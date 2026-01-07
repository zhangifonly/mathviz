/**
 * 向量场场景渲染器
 * 可视化向量场、流线、散度和旋度
 */

import { useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../MathFormula/MathFormula'

// 向量场函数类型
type VectorFieldFunction = (x: number, y: number) => { vx: number; vy: number }

// 预定义的向量场
const vectorFields: Record<string, { fn: VectorFieldFunction; name: string; formula: string }> = {
  radial: {
    fn: (x, y) => ({ vx: x, vy: y }),
    name: '径向场',
    formula: '\\vec{F}(x,y) = (x, y)',
  },
  circular: {
    fn: (x, y) => ({ vx: -y, vy: x }),
    name: '旋转场',
    formula: '\\vec{F}(x,y) = (-y, x)',
  },
  saddle: {
    fn: (x, y) => ({ vx: x, vy: -y }),
    name: '鞍点场',
    formula: '\\vec{F}(x,y) = (x, -y)',
  },
  vortex: {
    fn: (x, y) => {
      const r = Math.sqrt(x * x + y * y) + 0.1
      return { vx: -y / r, vy: x / r }
    },
    name: '涡旋场',
    formula: '\\vec{F}(x,y) = \\frac{1}{r}(-y, x)',
  },
}

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '向量场', subtitle: '探索空间中的向量分布' },
    'sum-1': { title: '总结回顾', subtitle: '向量场的核心概念' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '向量场', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 向量场箭头图场景
function ArrowFieldScene({ fieldType = 'radial', interactive = false }: { fieldType?: string; interactive?: boolean }) {
  const [selectedField, setSelectedField] = useState(fieldType)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const field = vectorFields[selectedField] || vectorFields.radial

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 40 // 网格间距

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
    ctx.lineWidth = 1
    for (let i = -10; i <= 10; i++) {
      // 垂直线
      ctx.beginPath()
      ctx.moveTo(centerX + i * scale, 0)
      ctx.lineTo(centerX + i * scale, height)
      ctx.stroke()
      // 水平线
      ctx.beginPath()
      ctx.moveTo(0, centerY + i * scale)
      ctx.lineTo(width, centerY + i * scale)
      ctx.stroke()
    }

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    // 绘制向量场箭头
    const arrowSize = 8
    const maxMagnitude = 3

    for (let i = -6; i <= 6; i++) {
      for (let j = -6; j <= 6; j++) {
        const x = i * 0.8
        const y = j * 0.8
        const { vx, vy } = field.fn(x, y)

        // 归一化向量
        const magnitude = Math.sqrt(vx * vx + vy * vy)
        if (magnitude === 0) continue

        const normalizedVx = (vx / magnitude) * Math.min(magnitude, maxMagnitude)
        const normalizedVy = (vy / magnitude) * Math.min(magnitude, maxMagnitude)

        // 计算箭头位置
        const startX = centerX + x * scale
        const startY = centerY - y * scale
        const endX = startX + normalizedVx * scale * 0.3
        const endY = startY - normalizedVy * scale * 0.3

        // 颜色根据大小变化
        const colorIntensity = Math.min(magnitude / maxMagnitude, 1)
        const hue = 200 + colorIntensity * 60 // 从蓝色到青色
        ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
        ctx.lineWidth = 1.5

        // 绘制箭头线
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // 绘制箭头头部
        const angle = Math.atan2(-(endY - startY), endX - startX)
        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle - Math.PI / 6),
          endY - arrowSize * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle + Math.PI / 6),
          endY - arrowSize * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fill()
      }
    }

    // 绘制标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText(field.name, 10, 25)
  }, [selectedField, field])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />

      {interactive && (
        <div className="flex gap-2 flex-wrap justify-center">
          {Object.entries(vectorFields).map(([key, { name }]) => (
            <button
              key={key}
              onClick={() => setSelectedField(key)}
              className={`px-4 py-2 rounded transition-colors ${
                selectedField === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// 流线动画场景
function StreamlineScene({ fieldType = 'circular' }: { fieldType?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Array<{ x: number; y: number; trail: Array<{ x: number; y: number }> }>>([])

  const field = vectorFields[fieldType] || vectorFields.circular

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 40

    // 初始化粒子
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
          trail: [],
        })
      }
    }

    const animate = () => {
      // 半透明清空，产生拖尾效果
      ctx.fillStyle = 'rgba(30, 41, 59, 0.1)'
      ctx.fillRect(0, 0, width, height)

      // 绘制坐标轴
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX, 0)
      ctx.lineTo(centerX, height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(width, centerY)
      ctx.stroke()

      // 更新和绘制粒子
      particlesRef.current.forEach((particle) => {
        const { vx, vy } = field.fn(particle.x, particle.y)
        const magnitude = Math.sqrt(vx * vx + vy * vy) + 0.1

        // 更新位置
        const dt = 0.02
        particle.x += (vx / magnitude) * dt
        particle.y += (vy / magnitude) * dt

        // 添加到轨迹
        particle.trail.push({ x: particle.x, y: particle.y })
        if (particle.trail.length > 50) {
          particle.trail.shift()
        }

        // 边界检查，重置粒子
        if (
          Math.abs(particle.x) > 8 ||
          Math.abs(particle.y) > 8 ||
          magnitude < 0.01
        ) {
          particle.x = (Math.random() - 0.5) * 10
          particle.y = (Math.random() - 0.5) * 10
          particle.trail = []
        }

        // 绘制轨迹
        if (particle.trail.length > 1) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
          ctx.lineWidth = 2
          ctx.beginPath()
          const firstPoint = particle.trail[0]
          ctx.moveTo(centerX + firstPoint.x * scale, centerY - firstPoint.y * scale)
          for (let i = 1; i < particle.trail.length; i++) {
            const point = particle.trail[i]
            ctx.lineTo(centerX + point.x * scale, centerY - point.y * scale)
          }
          ctx.stroke()
        }

        // 绘制粒子
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.arc(centerX + particle.x * scale, centerY - particle.y * scale, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [field])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
      <p className="text-white/70 text-sm">流线展示向量场的整体结构</p>
    </div>
  )
}

// 散度可视化场景
function DivergenceScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 40

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制散度热图
    const gridSize = 20
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i / gridSize - 0.5) * 10
        const y = (j / gridSize - 0.5) * 10

        // 计算散度 (对于 F = (x, y)，散度 = ∂x/∂x + ∂y/∂y = 2)
        // 对于 F = (x, -y)，散度 = ∂x/∂x + ∂(-y)/∂y = 1 - 1 = 0
        // 使用径向场作为示例
        const divergence = 2 // 常数散度

        // 颜色映射：正散度为红色，负散度为蓝色
        const color = divergence > 0
          ? `rgba(239, 68, 68, ${Math.min(Math.abs(divergence) / 3, 0.8)})`
          : `rgba(59, 130, 246, ${Math.min(Math.abs(divergence) / 3, 0.8)})`

        ctx.fillStyle = color
        ctx.fillRect(
          centerX + x * scale - scale / 2,
          centerY - y * scale - scale / 2,
          width / gridSize,
          height / gridSize
        )
      }
    }

    // 绘制向量场箭头
    const arrowSize = 6
    for (let i = -4; i <= 4; i++) {
      for (let j = -4; j <= 4; j++) {
        const x = i * 1.2
        const y = j * 1.2
        const vx = x
        const vy = y

        const magnitude = Math.sqrt(vx * vx + vy * vy)
        if (magnitude === 0) continue

        const normalizedVx = (vx / magnitude) * Math.min(magnitude, 2)
        const normalizedVy = (vy / magnitude) * Math.min(magnitude, 2)

        const startX = centerX + x * scale
        const startY = centerY - y * scale
        const endX = startX + normalizedVx * scale * 0.3
        const endY = startY - normalizedVy * scale * 0.3

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        const angle = Math.atan2(-(endY - startY), endX - startX)
        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle - Math.PI / 6),
          endY - arrowSize * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle + Math.PI / 6),
          endY - arrowSize * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fill()
      }
    }

    // 绘制标签
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.fillText('散度 > 0 (源)', 10, 25)
    ctx.fillText('红色区域表示向量发散', 10, 45)
  }, [])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
      <div className="text-white/70 text-center">
        <p>散度衡量向量场的发散程度</p>
        <p className="text-sm">正散度 = 源，负散度 = 汇</p>
      </div>
    </div>
  )
}

// 旋度可视化场景
function CurlScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const rotationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 40

    const animate = () => {
      // 清空画布
      ctx.fillStyle = 'rgba(30, 41, 59, 1)'
      ctx.fillRect(0, 0, width, height)

      // 绘制旋转场向量
      const arrowSize = 6
      for (let i = -5; i <= 5; i++) {
        for (let j = -5; j <= 5; j++) {
          const x = i * 1.0
          const y = j * 1.0
          const vx = -y
          const vy = x

          const magnitude = Math.sqrt(vx * vx + vy * vy)
          if (magnitude === 0) continue

          const normalizedVx = (vx / magnitude) * Math.min(magnitude, 2)
          const normalizedVy = (vy / magnitude) * Math.min(magnitude, 2)

          const startX = centerX + x * scale
          const startY = centerY - y * scale
          const endX = startX + normalizedVx * scale * 0.3
          const endY = startY - normalizedVy * scale * 0.3

          // 颜色根据距离中心的距离变化
          const distance = Math.sqrt(x * x + y * y)
          const hue = 200 + distance * 10
          ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
          ctx.lineWidth = 2

          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.stroke()

          const angle = Math.atan2(-(endY - startY), endX - startX)
          ctx.beginPath()
          ctx.moveTo(endX, endY)
          ctx.lineTo(
            endX - arrowSize * Math.cos(angle - Math.PI / 6),
            endY - arrowSize * Math.sin(angle - Math.PI / 6)
          )
          ctx.lineTo(
            endX - arrowSize * Math.cos(angle + Math.PI / 6),
            endY - arrowSize * Math.sin(angle + Math.PI / 6)
          )
          ctx.closePath()
          ctx.fill()
        }
      }

      // 绘制旋转的小球来展示旋度
      const numBalls = 8
      const radius = 100
      for (let i = 0; i < numBalls; i++) {
        const angle = (i / numBalls) * Math.PI * 2 + rotationRef.current
        const ballX = centerX + Math.cos(angle) * radius
        const ballY = centerY + Math.sin(angle) * radius

        ctx.fillStyle = '#22c55e'
        ctx.beginPath()
        ctx.arc(ballX, ballY, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      rotationRef.current += 0.02

      // 绘制标签
      ctx.fillStyle = 'white'
      ctx.font = '16px sans-serif'
      ctx.fillText('旋度 ≠ 0 (旋转场)', 10, 25)
      ctx.fillText('绿色小球展示旋转效果', 10, 45)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
      <div className="text-white/70 text-center">
        <p>旋度衡量向量场的旋转程度</p>
        <p className="text-sm">旋转场具有非零旋度</p>
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'vector-field': {
      formula: '\\vec{F}(x,y) = (P(x,y), Q(x,y))',
      description: '向量场的定义 - 每点对应一个向量',
    },
    'divergence': {
      formula: '\\text{div}\\,\\vec{F} = \\nabla \\cdot \\vec{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y}',
      description: '散度 - 衡量向量场的发散程度',
    },
    'curl': {
      formula: '\\text{curl}\\,\\vec{F} = \\nabla \\times \\vec{F} = \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}',
      description: '旋度 - 衡量向量场的旋转程度（2D情况）',
    },
    'streamline': {
      formula: '\\frac{dx}{P(x,y)} = \\frac{dy}{Q(x,y)}',
      description: '流线方程 - 与向量场处处相切的曲线',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['vector-field']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg text-center max-w-2xl px-4">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-1': {
      title: '向量场的应用',
      items: ['流体力学 - 流体运动', '电磁学 - 电场和磁场', '计算机图形学 - 特效模拟', '气象学 - 风场分析'],
      icon: '🌊',
    },
    'app-2': {
      title: '流体力学',
      items: ['速度场描述流体运动', '压力梯度驱动流动', '涡旋和湍流分析', 'CFD 数值模拟'],
      icon: '💨',
    },
    'app-3': {
      title: '电磁学',
      items: ['电场 E 和磁场 B', '麦克斯韦方程组', '电磁波传播', '天线辐射模式'],
      icon: '⚡',
    },
    'app-4': {
      title: '计算机图形学',
      items: ['烟雾和火焰模拟', '水流和波浪效果', '粒子系统', '实时物理引擎'],
      icon: '🎮',
    },
  }

  const app = apps[sceneId] || apps['app-1']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function VectorFieldSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 标题场景
  if (sceneConfig.type === 'title' || sceneConfig.id.includes('intro-1') || sceneConfig.id.includes('sum-1')) {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 应用场景
  if (sceneConfig.type === 'application' || sceneConfig.id.includes('app-')) {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('intro-1')) {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id.includes('intro-2') || sceneConfig.id.includes('intro-3')) {
        return <ArrowFieldScene fieldType="radial" />
      }
      return <ArrowFieldScene fieldType="radial" />

    case 'concept':
      if (sceneConfig.id.includes('concept-1')) {
        return <FormulaScene formulaType="vector-field" />
      }
      if (sceneConfig.id.includes('concept-2')) {
        return <ArrowFieldScene fieldType="radial" />
      }
      if (sceneConfig.id.includes('concept-3')) {
        return <ArrowFieldScene fieldType="circular" interactive={false} />
      }
      return <ArrowFieldScene fieldType="saddle" />

    case 'streamlines':
      if (sceneConfig.id.includes('stream-1')) {
        return <FormulaScene formulaType="streamline" />
      }
      return <StreamlineScene fieldType="circular" />

    case 'divergence-curl':
      if (sceneConfig.id.includes('div-1') || sceneConfig.id.includes('div-2')) {
        return <DivergenceScene />
      }
      if (sceneConfig.id.includes('div-3')) {
        return <CurlScene />
      }
      if (sceneConfig.id.includes('div-4')) {
        return <FormulaScene formulaType="divergence" />
      }
      return <DivergenceScene />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('sum-1')) {
        return <TitleScene sceneId="sum-1" />
      }
      if (sceneConfig.id.includes('sum-2')) {
        return <ArrowFieldScene fieldType="vortex" />
      }
      if (sceneConfig.id.includes('sum-3')) {
        return <FormulaScene formulaType="curl" />
      }
      return <StreamlineScene fieldType="vortex" />

    default:
      return <ArrowFieldScene fieldType="radial" />
  }
}
