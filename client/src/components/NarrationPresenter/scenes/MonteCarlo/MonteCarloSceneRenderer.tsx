/**
 * 蒙特卡洛场景渲染器
 * 根据场景配置渲染随机点撒布、圆周率估算、积分估算等可视化
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '蒙特卡洛方法', subtitle: '用随机点估算圆周率 π' },
    'summary-1': { title: '总结回顾', subtitle: '蒙特卡洛方法的核心思想' },
    'summary-5': { title: '感谢观看', subtitle: '探索随机性的力量' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '蒙特卡洛方法', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 圆周率估算场景
interface PiEstimationSceneProps {
  pointCount?: number
  animate?: boolean
  showStats?: boolean
}

function PiEstimationScene({
  pointCount = 100,
  animate = false,
  showStats = true
}: PiEstimationSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  // 生成随机点
  const generatePoint = useMemo(() => {
    return () => {
      const x = Math.random() * 2 - 1 // [-1, 1]
      const y = Math.random() * 2 - 1 // [-1, 1]
      const inside = x * x + y * y <= 1
      return { x, y, inside }
    }
  }, [])

  // 初始化或重置点
  const initialPoints = useMemo(() => {
    if (animate) {
      return []
    }
    const newPoints = []
    for (let i = 0; i < pointCount; i++) {
      newPoints.push(generatePoint())
    }
    return newPoints
  }, [pointCount, animate, generatePoint])

  const initialCount = useMemo(() => (animate ? 0 : pointCount), [animate, pointCount])
  const initialEstimate = useMemo(() => {
    if (animate) return 0
    const insideCount = initialPoints.filter(p => p.inside).length
    return (4 * insideCount) / pointCount
  }, [animate, initialPoints, pointCount])

  const [points, setPoints] = useState(initialPoints)
  const [currentCount, setCurrentCount] = useState(initialCount)
  const [piEstimate, setPiEstimate] = useState(initialEstimate)

  useEffect(() => {
    setPoints(initialPoints)
  }, [initialPoints])

  useEffect(() => {
    setCurrentCount(initialCount)
  }, [initialCount])

  useEffect(() => {
    setPiEstimate(initialEstimate)
  }, [initialEstimate])

  // 动画效果
  useEffect(() => {
    if (!animate) return

    const addPoints = () => {
      setPoints(prev => {
        if (prev.length >= pointCount) {
          return prev
        }

        const newPoints = [...prev]
        const batchSize = Math.min(5, pointCount - prev.length)

        for (let i = 0; i < batchSize; i++) {
          newPoints.push(generatePoint())
        }

        setCurrentCount(newPoints.length)
        const insideCount = newPoints.filter(p => p.inside).length
        setPiEstimate((4 * insideCount) / newPoints.length)

        return newPoints
      })

      animationRef.current = requestAnimationFrame(addPoints)
    }

    animationRef.current = requestAnimationFrame(addPoints)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, pointCount, generatePoint])

  // 绘制 Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    // 清空画布
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制正方形
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.strokeRect(centerX - radius, centerY - radius, radius * 2, radius * 2)

    // 绘制圆
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // 绘制点
    points.forEach(point => {
      const px = centerX + point.x * radius
      const py = centerY + point.y * radius

      ctx.fillStyle = point.inside ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
      ctx.beginPath()
      ctx.arc(px, py, 2, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [points])

  const insideCount = points.filter(p => p.inside).length
  const error = Math.abs(piEstimate - Math.PI)
  const errorPercent = ((error / Math.PI) * 100).toFixed(2)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border border-white/20 rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      {showStats && (
        <div className="text-white/80 text-sm space-y-1 text-center">
          <p className="font-semibold">圆周率估算</p>
          <p>总点数: {currentCount}</p>
          <p>圆内点数: {insideCount}</p>
          <p>π 估计值: {piEstimate.toFixed(6)}</p>
          <p>真实值: {Math.PI.toFixed(6)}</p>
          <p>误差: {error.toFixed(6)} ({errorPercent}%)</p>
        </div>
      )}
    </div>
  )
}

// 积分估算场景（保留供将来使用）
interface IntegrationSceneProps {
  func?: (x: number) => number
  a?: number
  b?: number
  pointCount?: number
  animate?: boolean
}

// 导出供将来使用
export function IntegrationScene({
  func = (x: number) => Math.sin(x) + 1,
  a = 0,
  b = Math.PI,
  pointCount = 200,
  animate = false
}: IntegrationSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [points, setPoints] = useState<{ x: number; y: number; inside: boolean }[]>([])
  const [currentCount, setCurrentCount] = useState(0)
  const [integralEstimate, setIntegralEstimate] = useState(0)
  const animationRef = useRef<number | undefined>(undefined)

  // 找到函数的最大值
  const maxY = useMemo(() => {
    let max = 0
    for (let x = a; x <= b; x += 0.01) {
      max = Math.max(max, func(x))
    }
    return max * 1.1
  }, [func, a, b])

  // 生成随机点
  const generatePoint = useMemo(() => {
    return () => {
      const x = a + Math.random() * (b - a)
      const y = Math.random() * maxY
      const inside = y <= func(x)
      return { x, y, inside }
    }
  }, [a, b, maxY, func])

  // 初始化或重置点
  useEffect(() => {
    if (!animate) {
      const newPoints = []
      for (let i = 0; i < pointCount; i++) {
        newPoints.push(generatePoint())
      }
      setPoints(newPoints)
      setCurrentCount(pointCount)

      const insideCount = newPoints.filter(p => p.inside).length
      setIntegralEstimate((insideCount / pointCount) * (b - a) * maxY)
    } else {
      setPoints([])
      setCurrentCount(0)
      setIntegralEstimate(0)
    }
  }, [pointCount, animate, a, b, maxY, generatePoint])

  // 动画效果
  useEffect(() => {
    if (!animate) return

    const addPoints = () => {
      setPoints(prev => {
        if (prev.length >= pointCount) {
          return prev
        }

        const newPoints = [...prev]
        const batchSize = Math.min(3, pointCount - prev.length)

        for (let i = 0; i < batchSize; i++) {
          newPoints.push(generatePoint())
        }

        setCurrentCount(newPoints.length)
        const insideCount = newPoints.filter(p => p.inside).length
        setIntegralEstimate((insideCount / newPoints.length) * (b - a) * maxY)

        return newPoints
      })

      animationRef.current = requestAnimationFrame(addPoints)
    }

    animationRef.current = requestAnimationFrame(addPoints)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, pointCount, a, b, maxY, generatePoint])

  // 绘制 Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // 清空画布
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, width, height)

    // 坐标转换
    const toCanvasX = (x: number) => padding + ((x - a) / (b - a)) * (width - 2 * padding)
    const toCanvasY = (y: number) => height - padding - (y / maxY) * (height - 2 * padding)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, toCanvasY(0))
    ctx.lineTo(width - padding, toCanvasY(0))
    ctx.stroke()

    // 绘制函数曲线
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = a; x <= b; x += 0.01) {
      const y = func(x)
      const cx = toCanvasX(x)
      const cy = toCanvasY(y)
      if (x === a) {
        ctx.moveTo(cx, cy)
      } else {
        ctx.lineTo(cx, cy)
      }
    }
    ctx.stroke()

    // 绘制矩形边界
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.strokeRect(
      toCanvasX(a),
      toCanvasY(maxY),
      toCanvasX(b) - toCanvasX(a),
      toCanvasY(0) - toCanvasY(maxY)
    )

    // 绘制点
    points.forEach(point => {
      const px = toCanvasX(point.x)
      const py = toCanvasY(point.y)

      ctx.fillStyle = point.inside ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'
      ctx.beginPath()
      ctx.arc(px, py, 2, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [points, func, a, b, maxY])

  // 计算精确值（用数值积分近似）
  const exactValue = useMemo(() => {
    const steps = 10000
    const dx = (b - a) / steps
    let sum = 0
    for (let i = 0; i < steps; i++) {
      sum += func(a + (i + 0.5) * dx) * dx
    }
    return sum
  }, [func, a, b])

  const insideCount = points.filter(p => p.inside).length
  const error = Math.abs(integralEstimate - exactValue)
  const errorPercent = ((error / exactValue) * 100).toFixed(2)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-white/20 rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <div className="text-white/80 text-sm space-y-1 text-center">
        <p className="font-semibold">积分估算</p>
        <p>总点数: {currentCount}</p>
        <p>曲线下点数: {insideCount}</p>
        <p>估计值: {integralEstimate.toFixed(6)}</p>
        <p>精确值: {exactValue.toFixed(6)}</p>
        <p>误差: {error.toFixed(6)} ({errorPercent}%)</p>
      </div>
    </div>
  )
}

// 收敛过程场景
interface ConvergenceSceneProps {
  maxPoints?: number
  showAnimation?: boolean
}

function ConvergenceScene({
  maxPoints = 1000,
  showAnimation = true
}: ConvergenceSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 生成收敛历史数据
  const history = useMemo(() => {
    const newHistory: { count: number; estimate: number }[] = []
    let insideCount = 0
    // Use a simple hash-based approach for deterministic results
    const hashRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    for (let i = 1; i <= maxPoints; i++) {
      const x = hashRandom(i * 2) * 2 - 1
      const y = hashRandom(i * 2 + 1) * 2 - 1
      if (x * x + y * y <= 1) {
        insideCount++
      }

      // 每10个点记录一次
      if (i % 10 === 0 || i === 1) {
        newHistory.push({
          count: i,
          estimate: (4 * insideCount) / i
        })
      }
    }

    return newHistory
  }, [maxPoints])

  const initialIndex = useMemo(() => (showAnimation ? 0 : history.length - 1), [showAnimation, history.length])
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // 动画效果
  useEffect(() => {
    if (!showAnimation || currentIndex >= history.length - 1) return

    const timer = setTimeout(() => {
      setCurrentIndex(prev => Math.min(prev + 1, history.length - 1))
    }, 50)

    return () => clearTimeout(timer)
  }, [showAnimation, currentIndex, history.length])

  // 绘制收敛图
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || history.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 50

    // 清空画布
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, width, height)

    // 坐标转换
    const maxCount = history[history.length - 1].count
    const toCanvasX = (count: number) => padding + (count / maxCount) * (width - 2 * padding)
    const toCanvasY = (estimate: number) => {
      const minY = 2.5
      const maxY = 3.8
      return height - padding - ((estimate - minY) / (maxY - minY)) * (height - 2 * padding)
    }

    // 绘制网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * (height - 2 * padding)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // 绘制 π 参考线
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding, toCanvasY(Math.PI))
    ctx.lineTo(width - padding, toCanvasY(Math.PI))
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制收敛曲线
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'
    ctx.lineWidth = 2
    ctx.beginPath()

    const visibleHistory = history.slice(0, currentIndex + 1)
    visibleHistory.forEach((point, i) => {
      const x = toCanvasX(point.count)
      const y = toCanvasY(point.estimate)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // 绘制标签
    ctx.fillStyle = 'white'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('点数', width / 2, height - 10)

    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('π 估计值', 0, 0)
    ctx.restore()

    // 绘制 π 标签
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'
    ctx.textAlign = 'left'
    ctx.fillText(`π = ${Math.PI.toFixed(5)}`, width - padding + 5, toCanvasY(Math.PI))
  }, [history, currentIndex])

  const currentEstimate = history[currentIndex]?.estimate || 0
  const currentCount = history[currentIndex]?.count || 0
  const error = Math.abs(currentEstimate - Math.PI)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        className="border border-white/20 rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <div className="text-white/80 text-sm space-y-1 text-center">
        <p className="font-semibold">收敛过程</p>
        <p>当前点数: {currentCount}</p>
        <p>当前估计: {currentEstimate.toFixed(6)}</p>
        <p>误差: {error.toFixed(6)}</p>
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'pi-estimation': {
      formula: '\\pi \\approx 4 \\times \\frac{\\text{圆内点数}}{\\text{总点数}}',
      description: '圆周率估算公式：利用面积比估算 π',
    },
    'probability': {
      formula: 'P(\\text{点在圆内}) = \\frac{\\pi r^2}{(2r)^2} = \\frac{\\pi}{4}',
      description: '概率公式：点落在圆内的概率等于面积比',
    },
    'integration': {
      formula: '\\int_a^b f(x)dx \\approx \\frac{b-a}{N} \\sum_{i=1}^{N} f(x_i)',
      description: '积分估算：用随机采样估算定积分',
    },
    'convergence': {
      formula: '\\text{误差} \\propto \\frac{1}{\\sqrt{N}}',
      description: '收敛速度：误差与样本数的平方根成反比',
    },
    'law-of-large-numbers': {
      formula: '\\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{i=1}^{n} X_i = E[X]',
      description: '大数定律：样本均值收敛到期望值',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['pi-estimation']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur max-w-3xl">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg text-center max-w-2xl">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'application-1': {
      title: '蒙特卡洛方法的应用',
      items: ['金融工程', '物理模拟', '人工智能', '风险评估'],
      icon: '🎲',
    },
    'application-2': {
      title: '金融领域',
      items: ['期权定价', '风险管理', '投资组合优化', '信用风险评估'],
      icon: '💰',
    },
    'application-3': {
      title: '物理学',
      items: ['粒子输运', '核反应模拟', '量子力学', '统计物理'],
      icon: '⚛️',
    },
    'application-4': {
      title: '人工智能',
      items: ['强化学习', '游戏 AI', '决策优化', '贝叶斯推断'],
      icon: '🤖',
    },
  }

  const app = apps[sceneId] || apps['application-1']

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
export default function MonteCarloSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 标题场景
  if (sceneConfig.type === 'title' || sceneConfig.id.includes('intro-1') || sceneConfig.id.includes('summary')) {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 应用场景
  if (sceneConfig.type === 'application' || sceneConfig.id.includes('application')) {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 公式场景
  if (sceneConfig.type === 'formula') {
    return <FormulaScene formulaType="pi-estimation" />
  }

  // 根据 section 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('2')) {
        return <FormulaScene formulaType="probability" />
      }
      if (sceneConfig.id.includes('3')) {
        return <PiEstimationScene pointCount={50} animate={false} />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    case 'principle':
      if (sceneConfig.id.includes('1') || sceneConfig.id.includes('2')) {
        return <PiEstimationScene pointCount={0} animate={false} showStats={false} />
      }
      if (sceneConfig.id.includes('3')) {
        return <FormulaScene formulaType="probability" />
      }
      if (sceneConfig.id.includes('4')) {
        return <FormulaScene formulaType="pi-estimation" />
      }
      return <PiEstimationScene pointCount={100} animate={false} />

    case 'visualization':
      if (sceneConfig.id.includes('1')) {
        return <PiEstimationScene pointCount={50} animate={false} />
      }
      if (sceneConfig.id.includes('2') || sceneConfig.id.includes('3')) {
        return <PiEstimationScene pointCount={200} animate={true} />
      }
      return <PiEstimationScene pointCount={100} animate={true} />

    case 'experiment':
      if (sceneConfig.id.includes('3')) {
        return <FormulaScene formulaType="probability" />
      }
      return <PiEstimationScene pointCount={300} animate={true} />

    case 'convergence':
      if (sceneConfig.id.includes('4')) {
        return <FormulaScene formulaType="law-of-large-numbers" />
      }
      return <ConvergenceScene maxPoints={1000} showAnimation={true} />

    case 'accuracy':
      if (sceneConfig.id.includes('1') || sceneConfig.id.includes('2')) {
        return <FormulaScene formulaType="convergence" />
      }
      if (sceneConfig.id.includes('3')) {
        return <ConvergenceScene maxPoints={2000} showAnimation={false} />
      }
      return <PiEstimationScene pointCount={500} animate={false} />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('2')) {
        return <FormulaScene formulaType="pi-estimation" />
      }
      if (sceneConfig.id.includes('3')) {
        return <FormulaScene formulaType="probability" />
      }
      if (sceneConfig.id.includes('4')) {
        return <FormulaScene formulaType="law-of-large-numbers" />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    default:
      return <PiEstimationScene pointCount={100} animate={false} />
  }
}
