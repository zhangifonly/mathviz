/**
 * 贝塞尔曲线场景渲染器
 * 渲染控制点、de Casteljau 算法、不同阶数的贝塞尔曲线等可视化
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 点类型
interface Point {
  x: number
  y: number
}

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '贝塞尔曲线', subtitle: '计算机图形学的基石' },
    'summary-intro': { title: '总结回顾', subtitle: '贝塞尔曲线的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索曲线之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '贝塞尔曲线', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 控制点和曲线场景
function ControlPointsScene({
  degree = 3,
  showControlLines = true,
  animate = false,
  interactive = false
}: {
  degree?: number
  showControlLines?: boolean
  animate?: boolean
  interactive?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(0)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  // 计算贝塞尔曲线上的点
  const bezierPoint = useCallback(function calculateBezierPoint(points: Point[], t: number): Point {
    if (points.length === 1) return points[0]

    const newPoints: Point[] = []
    for (let i = 0; i < points.length - 1; i++) {
      newPoints.push({
        x: (1 - t) * points[i].x + t * points[i + 1].x,
        y: (1 - t) * points[i].y + t * points[i + 1].y,
      })
    }
    return calculateBezierPoint(newPoints, t)
  }, [])

  // 初始化控制点 - 使用 useMemo 而不是 useEffect
  const controlPoints = useMemo(() => {
    const width = 600
    const height = 400
    const padding = 80

    const points: Point[] = []
    for (let i = 0; i <= degree; i++) {
      const x = padding + (width - 2 * padding) * (i / degree)
      const y = height / 2 + (Math.sin(i * Math.PI / degree) * 80) * (i % 2 === 0 ? 1 : -1)
      points.push({ x, y })
    }
    return points
  }, [degree])

  const [localControlPoints, setLocalControlPoints] = useState<Point[]>([])

  // 同步 controlPoints 到 localControlPoints
  useEffect(() => {
    setLocalControlPoints(controlPoints)
  }, [controlPoints])

  // 动画
  useEffect(() => {
    if (!animate) {
      setT(0)
      return
    }

    const timer = setInterval(() => {
      setT(prevT => (prevT + 0.01) % 1)
    }, 50)
    return () => clearInterval(timer)
  }, [animate])

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 检查是否点击了控制点
    for (let i = 0; i < localControlPoints.length; i++) {
      const dx = x - localControlPoints[i].x
      const dy = y - localControlPoints[i].y
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        setDraggingIndex(i)
        break
      }
    }
  }, [interactive, localControlPoints])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingIndex === null) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setLocalControlPoints(prev => {
      const newPoints = [...prev]
      newPoints[draggingIndex] = { x, y }
      return newPoints
    })
  }, [draggingIndex])

  const handleMouseUp = useCallback(() => {
    setDraggingIndex(null)
  }, [])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || localControlPoints.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制控制线
    if (showControlLines) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(localControlPoints[0].x, localControlPoints[0].y)
      for (let i = 1; i < localControlPoints.length; i++) {
        ctx.lineTo(localControlPoints[i].x, localControlPoints[i].y)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }

    // 绘制贝塞尔曲线
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let i = 0; i <= 100; i++) {
      const t = i / 100
      const point = bezierPoint(localControlPoints, t)
      if (i === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    }
    ctx.stroke()

    // 绘制控制点
    localControlPoints.forEach((point, i) => {
      ctx.fillStyle = i === 0 || i === localControlPoints.length - 1 ? '#ef4444' : '#3b82f6'
      ctx.beginPath()
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI)
      ctx.fill()

      // 绘制控制点标签
      ctx.fillStyle = 'white'
      ctx.font = '12px sans-serif'
      ctx.fillText(`P${i}`, point.x + 10, point.y - 10)
    })

    // 如果正在动画，绘制当前点
    if (animate && t > 0) {
      const currentPoint = bezierPoint(localControlPoints, t)
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(currentPoint.x, currentPoint.y, 8, 0, 2 * Math.PI)
      ctx.fill()

      // 显示 t 值
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText(`t = ${t.toFixed(2)}`, 20, 30)
    }
  }, [localControlPoints, showControlLines, animate, t, bezierPoint])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="max-w-full border border-white/10 rounded cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <p className="text-white/60 text-sm">
        {degree} 阶贝塞尔曲线 ({localControlPoints.length} 个控制点)
        {interactive && ' - 拖动控制点调整曲线'}
      </p>
    </div>
  )
}

// de Casteljau 算法动画场景
function DeCasteljauScene({
  degree = 3,
  animate = true
}: {
  degree?: number
  animate?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(0.5)

  // 计算 de Casteljau 算法的所有中间点
  const deCasteljauSteps = useCallback((points: Point[], t: number): Point[][] => {
    const steps: Point[][] = [points]
    let currentPoints = points

    while (currentPoints.length > 1) {
      const newPoints: Point[] = []
      for (let i = 0; i < currentPoints.length - 1; i++) {
        newPoints.push({
          x: (1 - t) * currentPoints[i].x + t * currentPoints[i + 1].x,
          y: (1 - t) * currentPoints[i].y + t * currentPoints[i + 1].y,
        })
      }
      steps.push(newPoints)
      currentPoints = newPoints
    }

    return steps
  }, [])

  // 初始化控制点 - 使用 useMemo 而不是 useEffect
  const controlPoints = useMemo(() => {
    const width = 600
    const height = 400
    const padding = 80

    const points: Point[] = []
    for (let i = 0; i <= degree; i++) {
      const x = padding + (width - 2 * padding) * (i / degree)
      const y = height / 2 + (Math.sin(i * Math.PI / degree) * 80) * (i % 2 === 0 ? 1 : -1)
      points.push({ x, y })
    }
    return points
  }, [degree])

  // 动画
  useEffect(() => {
    if (!animate) return

    const timer = setInterval(() => {
      setT(prevT => {
        const newT = prevT + 0.01
        return newT > 1 ? 0 : newT
      })
    }, 50)
    return () => clearInterval(timer)
  }, [animate])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || controlPoints.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制贝塞尔曲线（淡色）
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= 100; i++) {
      const tVal = i / 100
      const steps = deCasteljauSteps(controlPoints, tVal)
      const point = steps[steps.length - 1][0]
      if (i === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    }
    ctx.stroke()

    // 计算当前 t 值的 de Casteljau 步骤
    const steps = deCasteljauSteps(controlPoints, t)

    // 绘制每一层的线段和点
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    steps.forEach((points, level) => {
      const color = colors[level % colors.length]

      // 绘制线段
      if (points.length > 1) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.stroke()
      }

      // 绘制点
      points.forEach((point) => {
        ctx.fillStyle = color
        ctx.beginPath()
        const radius = level === steps.length - 1 ? 8 : 5
        ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI)
        ctx.fill()

        // 最后一个点（曲线上的点）特殊标记
        if (level === steps.length - 1) {
          ctx.strokeStyle = 'white'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI)
          ctx.stroke()
        }
      })
    })

    // 显示 t 值
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.fillText(`t = ${t.toFixed(2)}`, 20, 30)
    ctx.font = '12px sans-serif'
    ctx.fillText(`de Casteljau 算法 - ${steps.length} 层递归`, 20, 50)
  }, [controlPoints, t, deCasteljauSteps])

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

// 不同阶数对比场景
function DegreeScene({ animate = false }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(0)

  // 计算贝塞尔曲线上的点
  const bezierPoint = useCallback(function calculateBezierPoint(points: Point[], t: number): Point {
    if (points.length === 1) return points[0]

    const newPoints: Point[] = []
    for (let i = 0; i < points.length - 1; i++) {
      newPoints.push({
        x: (1 - t) * points[i].x + t * points[i + 1].x,
        y: (1 - t) * points[i].y + t * points[i + 1].y,
      })
    }
    return calculateBezierPoint(newPoints, t)
  }, [])

  // 动画
  useEffect(() => {
    if (!animate) return

    const timer = setInterval(() => {
      setT(prevT => (prevT + 0.01) % 1)
    }, 50)
    return () => clearInterval(timer)
  }, [animate])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 定义不同阶数的控制点
    const curves = [
      {
        name: '线性 (1阶)',
        color: '#3b82f6',
        points: [
          { x: 100, y: 150 },
          { x: 500, y: 150 },
        ],
      },
      {
        name: '二次 (2阶)',
        color: '#10b981',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 100 },
          { x: 500, y: 200 },
        ],
      },
      {
        name: '三次 (3阶)',
        color: '#f59e0b',
        points: [
          { x: 100, y: 250 },
          { x: 250, y: 150 },
          { x: 350, y: 350 },
          { x: 500, y: 250 },
        ],
      },
      {
        name: '四次 (4阶)',
        color: '#ef4444',
        points: [
          { x: 100, y: 300 },
          { x: 200, y: 200 },
          { x: 300, y: 350 },
          { x: 400, y: 200 },
          { x: 500, y: 300 },
        ],
      },
    ]

    // 绘制每条曲线
    curves.forEach((curve, index) => {
      // 绘制控制点
      ctx.fillStyle = curve.color
      curve.points.forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })

      // 绘制控制线
      ctx.strokeStyle = curve.color + '40'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(curve.points[0].x, curve.points[0].y)
      for (let i = 1; i < curve.points.length; i++) {
        ctx.lineTo(curve.points[i].x, curve.points[i].y)
      }
      ctx.stroke()
      ctx.setLineDash([])

      // 绘制贝塞尔曲线
      ctx.strokeStyle = curve.color
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (let i = 0; i <= 100; i++) {
        const tVal = i / 100
        const point = bezierPoint(curve.points, tVal)
        if (i === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      }
      ctx.stroke()

      // 绘制标签
      ctx.fillStyle = 'white'
      ctx.font = '12px sans-serif'
      ctx.fillText(curve.name, 520, 150 + index * 50)

      // 如果正在动画，绘制当前点
      if (animate && t > 0) {
        const currentPoint = bezierPoint(curve.points, t)
        ctx.fillStyle = curve.color
        ctx.beginPath()
        ctx.arc(currentPoint.x, currentPoint.y, 5, 0, 2 * Math.PI)
        ctx.fill()
      }
    })

    // 标题
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.fillText('不同阶数的贝塞尔曲线对比', 20, 30)
  }, [t, animate, bezierPoint])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'linear': {
      formula: 'B(t) = (1-t)P_0 + tP_1, \\quad t \\in [0,1]',
      description: '线性贝塞尔曲线（1阶）',
    },
    'quadratic': {
      formula: 'B(t) = (1-t)^2P_0 + 2(1-t)tP_1 + t^2P_2',
      description: '二次贝塞尔曲线（2阶）',
    },
    'cubic': {
      formula: 'B(t) = (1-t)^3P_0 + 3(1-t)^2tP_1 + 3(1-t)t^2P_2 + t^3P_3',
      description: '三次贝塞尔曲线（3阶）',
    },
    'general': {
      formula: 'B(t) = \\sum_{i=0}^{n} \\binom{n}{i}(1-t)^{n-i}t^i P_i',
      description: 'n 阶贝塞尔曲线的一般形式',
    },
    'decasteljau': {
      formula: 'B_i^r(t) = (1-t)B_i^{r-1}(t) + tB_{i+1}^{r-1}(t)',
      description: 'de Casteljau 算法递归公式',
    },
    'bernstein': {
      formula: 'B_{i,n}(t) = \\binom{n}{i}t^i(1-t)^{n-i}',
      description: 'Bernstein 基函数',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['cubic']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-xl" />
      </div>
      <p className="text-white/70 text-lg">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '贝塞尔曲线的应用',
      items: ['字体设计', '矢量图形', 'CSS 动画', '3D 建模'],
      icon: '🎨',
    },
    'app-fonts': {
      title: '字体设计',
      items: ['TrueType 字体', 'PostScript 字体', '平滑曲线轮廓', '可缩放矢量'],
      icon: '🔤',
    },
    'app-graphics': {
      title: '计算机图形学',
      items: ['SVG 路径', 'Canvas 绘图', 'Illustrator', 'Photoshop 钢笔工具'],
      icon: '🖼️',
    },
    'app-animation': {
      title: '动画与过渡',
      items: ['CSS cubic-bezier()', '缓动函数', '运动路径', '关键帧插值'],
      icon: '🎬',
    },
    'app-3d': {
      title: '3D 建模',
      items: ['曲面建模', 'NURBS 曲线', 'CAD 设计', '游戏开发'],
      icon: '🎮',
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
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function BezierSceneRenderer({ scene, isInteractive }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('linear')) {
      return <FormulaScene formulaType="linear" />
    }
    if (sceneConfig.id.includes('quadratic')) {
      return <FormulaScene formulaType="quadratic" />
    }
    if (sceneConfig.id.includes('cubic')) {
      return <FormulaScene formulaType="cubic" />
    }
    if (sceneConfig.id.includes('general')) {
      return <FormulaScene formulaType="general" />
    }
    if (sceneConfig.id.includes('decasteljau')) {
      return <FormulaScene formulaType="decasteljau" />
    }
    if (sceneConfig.id.includes('bernstein')) {
      return <FormulaScene formulaType="bernstein" />
    }
    return <FormulaScene formulaType="cubic" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('curve')) {
        return <ControlPointsScene degree={3} animate />
      }
      if (sceneConfig.id.includes('control')) {
        return <ControlPointsScene degree={3} showControlLines interactive={isInteractive} />
      }
      return <ControlPointsScene degree={3} />

    case 'concept':
      if (sceneConfig.id.includes('definition')) {
        return <FormulaScene formulaType="general" />
      }
      if (sceneConfig.id.includes('control')) {
        return <ControlPointsScene degree={3} showControlLines />
      }
      if (sceneConfig.id.includes('parameter')) {
        return <ControlPointsScene degree={3} animate />
      }
      return <ControlPointsScene degree={2} />

    case 'linear': {
      const linearAnimate = lineState?.params?.animate as boolean || false
      return <ControlPointsScene degree={1} animate={linearAnimate} />
    }

    case 'quadratic': {
      const quadAnimate = lineState?.params?.animate as boolean || false
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="quadratic" />
      }
      return <ControlPointsScene degree={2} animate={quadAnimate} interactive={isInteractive} />
    }

    case 'cubic': {
      const cubicAnimate = lineState?.params?.animate as boolean || false
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="cubic" />
      }
      return <ControlPointsScene degree={3} animate={cubicAnimate} interactive={isInteractive} />
    }

    case 'decasteljau': {
      const dcAnimate = lineState?.params?.animate as boolean || true
      const dcDegree = (lineState?.params?.degree as number) || 3
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="decasteljau" />
      }
      return <DeCasteljauScene degree={dcDegree} animate={dcAnimate} />
    }

    case 'degree': {
      const degreeAnimate = lineState?.params?.animate as boolean || false
      return <DegreeScene animate={degreeAnimate} />
    }

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('decasteljau')) {
        return <DeCasteljauScene degree={3} animate />
      }
      if (sceneConfig.id.includes('degree')) {
        return <DegreeScene animate />
      }
      if (sceneConfig.id.includes('application')) {
        return <ApplicationScene sceneId="app-intro" />
      }
      return <ControlPointsScene degree={3} animate interactive={isInteractive} />

    default:
      return <ControlPointsScene degree={3} />
  }
}
