/**
 * 微分几何场景渲染器
 * 渲染曲率、挠率、Frenet标架、高斯曲率、测地线的可视化动画
 */

import { useEffect, useRef, useState } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '微分几何', subtitle: '曲线与曲面的几何性质' },
    'summary-intro': { title: '总结回顾', subtitle: '微分几何的核心概念' },
    'summary-end': { title: '感谢观看', subtitle: '探索微分几何之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '微分几何', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 曲率场景 - 显示曲线的曲率
function CurvatureScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // 绘制曲线 (圆的一部分)
    const radius = 150
    ctx.strokeStyle = '#4ade80'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let angle = 0; angle <= Math.PI; angle += 0.01) {
      const x = centerX + radius * Math.cos(angle)
      const y = centerY - radius * Math.sin(angle)
      if (angle === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 当前点
    const angle = t * Math.PI
    const x = centerX + radius * Math.cos(angle)
    const y = centerY - radius * Math.sin(angle)

    // 绘制切线
    const tangentX = -Math.sin(angle)
    const tangentY = Math.cos(angle)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x - tangentX * 80, y + tangentY * 80)
    ctx.lineTo(x + tangentX * 80, y - tangentY * 80)
    ctx.stroke()

    // 绘制法线
    const normalX = Math.cos(angle)
    const normalY = -Math.sin(angle)
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + normalX * 60, y + normalY * 60)
    ctx.stroke()

    // 绘制曲率圆
    const curvature = 1 / radius
    const curvatureRadius = 1 / curvature
    const centerCurvX = x + normalX * curvatureRadius
    const centerCurvY = y + normalY * curvatureRadius
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(centerCurvX, centerCurvY, curvatureRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制当前点
    ctx.fillStyle = '#4ade80'
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()

    // 图例
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#4ade80'
    ctx.fillText('曲线', 20, 30)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('切线', 20, 50)
    ctx.fillStyle = '#8b5cf6'
    ctx.fillText('法线', 20, 70)
    ctx.fillText(`曲率 κ = ${curvature.toFixed(4)}`, 20, 90)

    if (animate) {
      const timer = setTimeout(() => {
        setT(prev => (prev >= 1 ? 0 : prev + 0.01))
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [t, animate])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// Frenet 标架场景
function FrenetFrameScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // 绘制螺旋线
    ctx.strokeStyle = '#4ade80'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let s = 0; s <= 4 * Math.PI; s += 0.05) {
      const x = centerX + 100 * Math.cos(s)
      const y = centerY + 100 * Math.sin(s) - s * 10
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 当前点
    const s = t * 4 * Math.PI
    const x = centerX + 100 * Math.cos(s)
    const y = centerY + 100 * Math.sin(s) - s * 10

    // 切向量 T
    const tx = -Math.sin(s)
    const ty = Math.cos(s) - 0.1
    const tLen = Math.sqrt(tx * tx + ty * ty)
    const T = { x: tx / tLen, y: ty / tLen }

    // 法向量 N (简化计算)
    const nx = -Math.cos(s)
    const ny = -Math.sin(s)
    const nLen = Math.sqrt(nx * nx + ny * ny)
    const N = { x: nx / nLen, y: ny / nLen }

    // 副法向量 B (垂直于 T 和 N) - 简化为指向屏幕外

    // 绘制 Frenet 标架
    const scale = 60

    // 切向量 (红色)
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + T.x * scale, y + T.y * scale)
    ctx.stroke()

    // 法向量 (蓝色)
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + N.x * scale, y + N.y * scale)
    ctx.stroke()

    // 副法向量 (绿色) - 用圆圈表示指向屏幕外
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, 15, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill()

    // 绘制当前点
    ctx.fillStyle = '#4ade80'
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()

    // 图例
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#ef4444'
    ctx.fillText('T: 切向量', 20, 30)
    ctx.fillStyle = '#3b82f6'
    ctx.fillText('N: 主法向量', 20, 50)
    ctx.fillStyle = '#22c55e'
    ctx.fillText('B: 副法向量', 20, 70)

    if (animate) {
      const timer = setTimeout(() => {
        setT(prev => (prev >= 1 ? 0 : prev + 0.01))
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [t, animate])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 高斯曲率场景
function GaussianCurvatureScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // 绘制三种曲面的示意图
    const surfaces = [
      { name: '球面 (K > 0)', x: width / 6, y: height / 2, type: 'sphere' },
      { name: '平面 (K = 0)', x: width / 2, y: height / 2, type: 'plane' },
      { name: '马鞍面 (K < 0)', x: 5 * width / 6, y: height / 2, type: 'saddle' },
    ]

    surfaces.forEach((surface) => {
      const { x, y, type, name } = surface

      if (type === 'sphere') {
        // 绘制球面
        const radius = 60
        ctx.strokeStyle = '#4ade80'
        ctx.lineWidth = 2

        // 绘制经线
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI + rotation
          ctx.beginPath()
          for (let t = -Math.PI / 2; t <= Math.PI / 2; t += 0.1) {
            const px = x + radius * Math.cos(t) * Math.cos(angle) * 0.5
            const py = y - radius * Math.sin(t)
            if (t === -Math.PI / 2) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.stroke()
        }

        // 绘制纬线
        for (let i = -2; i <= 2; i++) {
          const lat = (i / 3) * Math.PI / 2
          ctx.beginPath()
          for (let lon = 0; lon <= Math.PI * 2; lon += 0.1) {
            const r = radius * Math.cos(lat)
            const px = x + r * Math.cos(lon + rotation) * 0.5
            const py = y - radius * Math.sin(lat)
            if (lon === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.stroke()
        }
      } else if (type === 'plane') {
        // 绘制平面网格
        ctx.strokeStyle = '#4ade80'
        ctx.lineWidth = 1
        const size = 60
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath()
          ctx.moveTo(x - size, y + i * 20)
          ctx.lineTo(x + size, y + i * 20)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x + i * 20, y - size)
          ctx.lineTo(x + i * 20, y + size)
          ctx.stroke()
        }
      } else if (type === 'saddle') {
        // 绘制马鞍面
        ctx.strokeStyle = '#4ade80'
        ctx.lineWidth = 1
        const scale = 30

        // 绘制网格
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath()
          for (let j = -2; j <= 2; j += 0.2) {
            const px = x + j * scale
            const py = y + (j * j - i * i) * 5
            if (j === -2) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.stroke()

          ctx.beginPath()
          for (let j = -2; j <= 2; j += 0.2) {
            const px = x + i * scale
            const py = y + (i * i - j * j) * 5
            if (j === -2) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.stroke()
        }
      }

      // 标签
      ctx.font = '14px sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText(name, x, y + 100)
    })

    // 标题
    ctx.font = '16px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText('高斯曲率的三种情况', width / 2, 30)

    if (animate) {
      const timer = setTimeout(() => {
        setRotation(prev => prev + 0.05)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [rotation, animate])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 测地线场景
function GeodesicScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // 绘制球面 (用圆表示)
    const radius = 150
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // 绘制经线和纬线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle))
      ctx.lineTo(centerX - radius * Math.cos(angle), centerY - radius * Math.sin(angle))
      ctx.stroke()
    }

    // 绘制测地线 (大圆)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 3
    ctx.beginPath()
    const startAngle = Math.PI / 4
    for (let angle = startAngle; angle <= startAngle + Math.PI * 2; angle += 0.05) {
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      if (angle === startAngle) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 绘制非测地线 (小圆)
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    const smallRadius = radius * 0.7
    for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
      const x = centerX + smallRadius * Math.cos(angle)
      const y = centerY + smallRadius * Math.sin(angle) * 0.5 - 30
      if (angle === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // 动画点
    const currentAngle = startAngle + t * Math.PI * 2
    const px = centerX + radius * Math.cos(currentAngle)
    const py = centerY + radius * Math.sin(currentAngle)

    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, Math.PI * 2)
    ctx.fill()

    // 图例
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('测地线 (大圆)', 20, 30)
    ctx.fillStyle = '#8b5cf6'
    ctx.fillText('非测地线 (小圆)', 20, 50)
    ctx.fillStyle = '#ffffff'
    ctx.fillText('测地线是曲面上两点间的最短路径', 20, 380)

    if (animate) {
      const timer = setTimeout(() => {
        setT(prev => (prev >= 1 ? 0 : prev + 0.01))
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [t, animate])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'curvature': {
      formula: '\\kappa = \\frac{|\\mathbf{r}\'(t) \\times \\mathbf{r}\'\'(t)|}{|\\mathbf{r}\'(t)|^3}',
      description: '曲率 - 衡量曲线弯曲程度',
    },
    'torsion': {
      formula: '\\tau = \\frac{(\\mathbf{r}\' \\times \\mathbf{r}\'\') \\cdot \\mathbf{r}\'\'\'}{|\\mathbf{r}\' \\times \\mathbf{r}\'\'|^2}',
      description: '挠率 - 衡量曲线偏离平面的程度',
    },
    'frenet': {
      formula: '\\mathbf{T} = \\frac{\\mathbf{r}\'}{|\\mathbf{r}\'|}, \\quad \\mathbf{N} = \\frac{\\mathbf{T}\'}{|\\mathbf{T}\'|}, \\quad \\mathbf{B} = \\mathbf{T} \\times \\mathbf{N}',
      description: 'Frenet 标架 - 切向量、主法向量、副法向量',
    },
    'gaussian': {
      formula: 'K = \\kappa_1 \\kappa_2 = \\frac{\\det(\\text{II})}{\\det(\\text{I})}',
      description: '高斯曲率 - 两个主曲率的乘积',
    },
    'mean': {
      formula: 'H = \\frac{\\kappa_1 + \\kappa_2}{2}',
      description: '平均曲率 - 两个主曲率的平均值',
    },
    'geodesic': {
      formula: '\\nabla_{\\dot{\\gamma}} \\dot{\\gamma} = 0',
      description: '测地线方程 - 曲面上的最短路径',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['curvature']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-physics': {
      title: '物理应用',
      items: ['广义相对论', '弦理论', '流形上的场论', '几何光学'],
      icon: '🌌',
    },
    'app-graphics': {
      title: '计算机图形学',
      items: ['曲面建模', '网格处理', '形状分析', '纹理映射'],
      icon: '🎨',
    },
    'app-robotics': {
      title: '机器人学',
      items: ['路径规划', '运动学', '碰撞检测', '姿态控制'],
      icon: '🤖',
    },
  }

  const app = apps[sceneId] || apps['app-physics']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function DifferentialGeometrySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 标题场景
  if (sceneConfig.type === 'title') {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 应用场景
  if (sceneConfig.type === 'application') {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 公式场景
  if (sceneConfig.type === 'formula') {
    if (sceneConfig.id.includes('curvature') && !sceneConfig.id.includes('gaussian')) {
      return <FormulaScene formulaType="curvature" />
    }
    if (sceneConfig.id.includes('torsion')) {
      return <FormulaScene formulaType="torsion" />
    }
    if (sceneConfig.id.includes('frenet')) {
      return <FormulaScene formulaType="frenet" />
    }
    if (sceneConfig.id.includes('gaussian')) {
      return <FormulaScene formulaType="gaussian" />
    }
    if (sceneConfig.id.includes('mean')) {
      return <FormulaScene formulaType="mean" />
    }
    if (sceneConfig.id.includes('geodesic')) {
      return <FormulaScene formulaType="geodesic" />
    }
    return <FormulaScene formulaType="curvature" />
  }

  // 根据 section 决定显示什么
  switch (sectionId) {
    case 'intro':
    case 'curvature':
      return <CurvatureScene animate />

    case 'torsion':
    case 'frenet':
      return <FrenetFrameScene animate />

    case 'gaussian':
    case 'mean':
      return <GaussianCurvatureScene animate />

    case 'geodesic':
      return <GeodesicScene animate />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('curvature')) {
        return <CurvatureScene animate />
      }
      if (sceneConfig.id.includes('frenet')) {
        return <FrenetFrameScene animate />
      }
      if (sceneConfig.id.includes('gaussian')) {
        return <GaussianCurvatureScene animate />
      }
      return <CurvatureScene animate />

    default:
      return <CurvatureScene animate />
  }
}
