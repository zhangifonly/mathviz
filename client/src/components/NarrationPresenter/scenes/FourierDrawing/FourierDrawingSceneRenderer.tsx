/**
 * 傅里叶绘图场景渲染器
 * 使用旋转圆（本轮）绘制复杂图形，展示傅里叶级数的几何意义
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 傅里叶系数类型
interface FourierCoefficient {
  freq: number    // 频率
  amp: number     // 振幅
  phase: number   // 相位
}

// 预定义的图形路径
const SHAPES = {
  circle: (t: number) => ({ x: Math.cos(t), y: Math.sin(t) }),
  square: (t: number) => {
    const s = (t % (2 * Math.PI)) / (Math.PI / 2)
    if (s < 1) return { x: 1, y: s * 2 - 1 }
    if (s < 2) return { x: 3 - s * 2, y: 1 }
    if (s < 3) return { x: -1, y: 5 - s * 2 }
    return { x: s * 2 - 7, y: -1 }
  },
  heart: (t: number) => ({
    x: 16 * Math.pow(Math.sin(t), 3) / 16,
    y: (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16,
  }),
  star: (t: number) => {
    const r = t % (2 * Math.PI / 5) < Math.PI / 5 ? 1 : 0.5
    return { x: r * Math.cos(t), y: r * Math.sin(t) }
  },
}

// 计算离散傅里叶变换
function computeDFT(points: { x: number; y: number }[]): FourierCoefficient[] {
  const N = points.length
  const coeffs: FourierCoefficient[] = []

  for (let k = 0; k < N; k++) {
    let re = 0, im = 0
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N
      const c = points[n]
      re += c.x * Math.cos(phi) + c.y * Math.sin(phi)
      im += -c.x * Math.sin(phi) + c.y * Math.cos(phi)
    }
    re /= N
    im /= N

    const freq = k
    const amp = Math.sqrt(re * re + im * im)
    const phase = Math.atan2(im, re)
    coeffs.push({ freq, amp, phase })
  }

  // 按振幅排序，保留最大的几个
  return coeffs.sort((a, b) => b.amp - a.amp).slice(0, 50)
}

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '傅里叶绘图', subtitle: '用旋转圆绘制任意图形' },
    'summary-intro': { title: '总结回顾', subtitle: '傅里叶绘图的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '傅里叶绘图', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 本轮动画场景
function EpicycleScene({
  shape = 'circle',
  numCircles = 10,
  showTrail = true
}: {
  shape?: keyof typeof SHAPES
  numCircles?: number
  showTrail?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [time, setTime] = useState(0)
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([])

  // 生成采样点
  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    const numSamples = 100
    const shapeFunc = SHAPES[shape]
    for (let i = 0; i < numSamples; i++) {
      const t = (i / numSamples) * 2 * Math.PI
      pts.push(shapeFunc(t))
    }
    return pts
  }, [shape])

  // 计算傅里叶系数
  const coeffs = useMemo(() => computeDFT(points), [points])

  // 动画循环
  useEffect(() => {
    let animationId: number
    const animate = () => {
      setTime(t => (t + 0.02) % (2 * Math.PI))
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const scale = Math.min(width, height) * 0.3

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制本轮系统
    let x = width / 2
    let y = height / 2

    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)'
    ctx.lineWidth = 1

    // 绘制前 numCircles 个圆
    for (let i = 0; i < Math.min(numCircles, coeffs.length); i++) {
      const coeff = coeffs[i]
      const prevX = x
      const prevY = y

      const radius = coeff.amp * scale
      const angle = coeff.freq * time + coeff.phase

      // 绘制圆
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.stroke()

      // 计算下一个圆的中心
      x += radius * Math.cos(angle)
      y += radius * Math.sin(angle)

      // 绘制半径线
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.beginPath()
      ctx.moveTo(prevX, prevY)
      ctx.lineTo(x, y)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)'
    }

    // 记录轨迹点
    if (showTrail) {
      setTrail(prev => {
        const newTrail = [...prev, { x, y }]
        return newTrail.length > 500 ? newTrail.slice(-500) : newTrail
      })

      // 绘制轨迹
      if (trail.length > 1) {
        ctx.strokeStyle = '#60a5fa'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(trail[0].x, trail[0].y)
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y)
        }
        ctx.stroke()
      }
    }

    // 绘制当前点
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()

    // 重置轨迹（当完成一个周期）
    if (time < 0.02) {
      setTrail([])
    }
  }, [time, coeffs, numCircles, showTrail, trail])

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

// 绘图轨迹场景（展示不同图形）
function DrawingScene({
  shapes = ['circle', 'square', 'heart']
}: {
  shapes?: (keyof typeof SHAPES)[]
}) {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentShapeIndex(i => (i + 1) % shapes.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [shapes.length])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <EpicycleScene
        shape={shapes[currentShapeIndex]}
        numCircles={20}
        showTrail={true}
      />
      <p className="text-white/60 text-sm">
        当前图形: {shapes[currentShapeIndex]}
      </p>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'dft': {
      formula: 'X_k = \\sum_{n=0}^{N-1} x_n e^{-i 2\\pi k n / N}',
      description: '离散傅里叶变换 - 将路径分解为旋转圆',
    },
    'epicycle': {
      formula: 'z(t) = \\sum_{k=-\\infty}^{\\infty} c_k e^{i k t}',
      description: '本轮叠加 - 用旋转圆的和表示任意曲线',
    },
    'coefficient': {
      formula: 'c_k = \\frac{1}{T} \\int_0^T f(t) e^{-i k t} dt',
      description: '傅里叶系数 - 每个圆的半径和相位',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['dft']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg">{description}</p>
    </div>
  )
}

// 对比场景（展示不同圆数量的效果）
function ComparisonScene() {
  return (
    <div className="w-full h-full grid grid-cols-2 gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <p className="text-white/70 text-sm">5 个圆</p>
        <div className="flex-1 w-full">
          <EpicycleScene shape="heart" numCircles={5} showTrail={true} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-white/70 text-sm">20 个圆</p>
        <div className="flex-1 w-full">
          <EpicycleScene shape="heart" numCircles={20} showTrail={true} />
        </div>
      </div>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '傅里叶绘图的应用',
      items: ['动画制作', '图像压缩', '手写识别', '路径规划'],
      icon: '🎨',
    },
    'app-animation': {
      title: '动画制作',
      items: ['3Blue1Brown 视频', 'SVG 路径动画', '创意可视化'],
      icon: '🎬',
    },
    'app-compression': {
      title: '图像压缩',
      items: ['JPEG 压缩', '保留主要频率', '减少数据量'],
      icon: '📦',
    },
  }

  const app = apps[sceneId] || apps['app-intro']

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
export default function FourierDrawingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig, lineState } = scene

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
    if (sceneConfig.id.includes('dft')) {
      return <FormulaScene formulaType="dft" />
    }
    if (sceneConfig.id.includes('epicycle')) {
      return <FormulaScene formulaType="epicycle" />
    }
    if (sceneConfig.id.includes('coefficient')) {
      return <FormulaScene formulaType="coefficient" />
    }
    return <FormulaScene formulaType="dft" />
  }

  // 对比场景
  if (sceneConfig.type === 'comparison') {
    return <ComparisonScene />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('circle')) {
        return <EpicycleScene shape="circle" numCircles={1} showTrail={true} />
      }
      if (sceneConfig.id.includes('epicycle')) {
        return <EpicycleScene shape="circle" numCircles={5} showTrail={true} />
      }
      return <EpicycleScene shape="circle" numCircles={10} showTrail={true} />

    case 'concept':
      if (sceneConfig.id.includes('rotation')) {
        return <EpicycleScene shape="circle" numCircles={3} showTrail={false} />
      }
      if (sceneConfig.id.includes('superposition')) {
        return <EpicycleScene shape="circle" numCircles={10} showTrail={true} />
      }
      if (sceneConfig.id.includes('dft')) {
        return <FormulaScene formulaType="dft" />
      }
      return <EpicycleScene shape="circle" numCircles={5} showTrail={true} />

    case 'drawing':
      const numCircles = (lineState?.params?.numCircles as number) || 10
      const shape = (lineState?.params?.shape as keyof typeof SHAPES) || 'circle'
      return <EpicycleScene shape={shape} numCircles={numCircles} showTrail={true} />

    case 'shapes':
      if (sceneConfig.id.includes('heart')) {
        return <EpicycleScene shape="heart" numCircles={20} showTrail={true} />
      }
      if (sceneConfig.id.includes('square')) {
        return <EpicycleScene shape="square" numCircles={20} showTrail={true} />
      }
      if (sceneConfig.id.includes('star')) {
        return <EpicycleScene shape="star" numCircles={20} showTrail={true} />
      }
      return <DrawingScene shapes={['circle', 'square', 'heart', 'star']} />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('beauty')) {
        return <EpicycleScene shape="heart" numCircles={30} showTrail={true} />
      }
      if (sceneConfig.id.includes('power')) {
        return <FormulaScene formulaType="epicycle" />
      }
      return <DrawingScene shapes={['circle', 'heart']} />

    default:
      return <EpicycleScene shape="circle" numCircles={10} showTrail={true} />
  }
}
