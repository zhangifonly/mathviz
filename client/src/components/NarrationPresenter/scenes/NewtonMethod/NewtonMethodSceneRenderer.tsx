/**
 * 牛顿法场景渲染器
 * 渲染函数曲线、切线、迭代逼近动画等
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '牛顿法', subtitle: '迭代求根的数学方法' },
    'sum-1': { title: '总结回顾', subtitle: '牛顿法的核心思想' },
    'sum-4': { title: '感谢观看', subtitle: '探索迭代算法的威力' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '牛顿法', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 函数定义
const targetFunction = (x: number) => x * x * x - 2 * x - 5
const targetDerivative = (x: number) => 3 * x * x - 2

// 牛顿迭代函数
const newtonIteration = (x: number) => {
  const fx = targetFunction(x)
  const fpx = targetDerivative(x)
  if (Math.abs(fpx) < 1e-10) return x // 避免除以零
  return x - fx / fpx
}

// 切线场景 - 展示单个切线
function TangentScene({ x0 = 3 }: { x0?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 60

    // 坐标转换
    const xMin = -1, xMax = 4, yMin = -10, yMax = 10
    const toCanvas = (x: number, y: number) => ({
      cx: padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding),
      cy: height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding),
    })

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    const { cy: yAxisY } = toCanvas(0, 0)
    ctx.moveTo(padding, yAxisY)
    ctx.lineTo(width - padding, yAxisY)
    ctx.stroke()

    ctx.beginPath()
    const { cx: xAxisX } = toCanvas(0, 0)
    ctx.moveTo(xAxisX, padding)
    ctx.lineTo(xAxisX, height - padding)
    ctx.stroke()

    // 绘制函数曲线
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    let first = true
    for (let x = xMin; x <= xMax; x += 0.01) {
      const y = targetFunction(x)
      if (y >= yMin && y <= yMax) {
        const { cx, cy } = toCanvas(x, y)
        if (first) {
          ctx.moveTo(cx, cy)
          first = false
        } else {
          ctx.lineTo(cx, cy)
        }
      }
    }
    ctx.stroke()

    // 绘制切线
    const y0 = targetFunction(x0)
    const slope = targetDerivative(x0)
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    ctx.beginPath()
    const tangentXMin = xMin
    const tangentXMax = xMax
    const tangentYMin = y0 + slope * (tangentXMin - x0)
    const tangentYMax = y0 + slope * (tangentXMax - x0)
    const { cx: tx1, cy: ty1 } = toCanvas(tangentXMin, tangentYMin)
    const { cx: tx2, cy: ty2 } = toCanvas(tangentXMax, tangentYMax)
    ctx.moveTo(tx1, ty1)
    ctx.lineTo(tx2, ty2)
    ctx.stroke()

    // 绘制当前点
    const { cx: px, cy: py } = toCanvas(x0, y0)
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, 2 * Math.PI)
    ctx.fill()

    // 绘制切线与x轴交点
    const xNext = newtonIteration(x0)
    const { cx: nx, cy: ny } = toCanvas(xNext, 0)
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(nx, ny, 6, 0, 2 * Math.PI)
    ctx.fill()

    // 绘制垂直虚线
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(px, yAxisY)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)'
    ctx.beginPath()
    ctx.moveTo(nx, ny)
    ctx.lineTo(nx, yAxisY)
    ctx.stroke()
    ctx.setLineDash([])

    // 标注
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText(`x₀ = ${x0.toFixed(2)}`, px + 10, py - 10)
    ctx.fillText(`x₁ = ${xNext.toFixed(2)}`, nx + 10, ny + 20)

    // 坐标轴标签
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '12px sans-serif'
    ctx.fillText('x', width - padding + 10, yAxisY + 5)
    ctx.fillText('y', xAxisX + 5, padding - 10)
  }, [x0])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 迭代场景 - 展示多次迭代
function IterationScene({ animate = false, maxIterations = 5 }: { animate?: boolean; maxIterations?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentIter, setCurrentIter] = useState(0)

  useEffect(() => {
    if (animate) {
      const timer = setInterval(() => {
        setCurrentIter(i => (i < maxIterations ? i + 1 : 0))
      }, 1500)
      return () => clearInterval(timer)
    }
  }, [animate, maxIterations])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 60

    // 坐标转换
    const xMin = -1, xMax = 4, yMin = -10, yMax = 10
    const toCanvas = (x: number, y: number) => ({
      cx: padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding),
      cy: height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding),
    })

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    const { cy: yAxisY } = toCanvas(0, 0)
    ctx.moveTo(padding, yAxisY)
    ctx.lineTo(width - padding, yAxisY)
    ctx.stroke()

    ctx.beginPath()
    const { cx: xAxisX } = toCanvas(0, 0)
    ctx.moveTo(xAxisX, padding)
    ctx.lineTo(xAxisX, height - padding)
    ctx.stroke()

    // 绘制函数曲线
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    let first = true
    for (let x = xMin; x <= xMax; x += 0.01) {
      const y = targetFunction(x)
      if (y >= yMin && y <= yMax) {
        const { cx, cy } = toCanvas(x, y)
        if (first) {
          ctx.moveTo(cx, cy)
          first = false
        } else {
          ctx.lineTo(cx, cy)
        }
      }
    }
    ctx.stroke()

    // 执行迭代
    let x = 3
    const iterations: Array<{ x: number; y: number; xNext: number }> = []
    for (let i = 0; i < currentIter; i++) {
      const y = targetFunction(x)
      const xNext = newtonIteration(x)
      iterations.push({ x, y, xNext })
      x = xNext
    }

    // 绘制所有迭代的切线和点
    iterations.forEach((iter, i) => {
      const { x, y, xNext } = iter
      const slope = targetDerivative(x)

      // 绘制切线
      const alpha = 0.3 + (i / currentIter) * 0.7
      ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      const tangentXMin = xMin
      const tangentXMax = xMax
      const tangentYMin = y + slope * (tangentXMin - x)
      const tangentYMax = y + slope * (tangentXMax - x)
      const { cx: tx1, cy: ty1 } = toCanvas(tangentXMin, tangentYMin)
      const { cx: tx2, cy: ty2 } = toCanvas(tangentXMax, tangentYMax)
      ctx.moveTo(tx1, ty1)
      ctx.lineTo(tx2, ty2)
      ctx.stroke()

      // 绘制点
      const { cx: px, cy: py } = toCanvas(x, y)
      ctx.fillStyle = i === currentIter - 1 ? '#ef4444' : `rgba(239, 68, 68, ${alpha})`
      ctx.beginPath()
      ctx.arc(px, py, i === currentIter - 1 ? 6 : 4, 0, 2 * Math.PI)
      ctx.fill()

      // 绘制下一个点
      const { cx: nx, cy: ny } = toCanvas(xNext, 0)
      ctx.fillStyle = i === currentIter - 1 ? '#f59e0b' : `rgba(245, 158, 11, ${alpha})`
      ctx.beginPath()
      ctx.arc(nx, ny, i === currentIter - 1 ? 6 : 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // 显示当前迭代信息
    if (currentIter > 0) {
      const lastIter = iterations[iterations.length - 1]
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText(`迭代次数: ${currentIter}`, 20, 30)
      ctx.fillText(`当前值: x = ${lastIter.xNext.toFixed(6)}`, 20, 50)
      ctx.fillText(`f(x) = ${targetFunction(lastIter.xNext).toFixed(6)}`, 20, 70)
    }

    // 坐标轴标签
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '12px sans-serif'
    ctx.fillText('x', width - padding + 10, yAxisY + 5)
    ctx.fillText('y', xAxisX + 5, padding - 10)
  }, [currentIter])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 收敛过程场景 - 展示误差随迭代次数的变化
function ConvergenceScene() {
  const convergenceData = useMemo(() => {
    let x = 3
    const iterations: number[] = []
    const errors: number[] = []
    const trueRoot = 2.0946 // 真实根的近似值

    for (let i = 0; i <= 10; i++) {
      iterations.push(i)
      errors.push(Math.abs(x - trueRoot))
      x = newtonIteration(x)
    }

    return { iterations, errors }
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={[
          {
            x: convergenceData.iterations,
            y: convergenceData.errors,
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#8b5cf6', width: 2 },
            marker: { size: 8, color: '#8b5cf6' },
            name: '误差',
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 40, r: 30, b: 60, l: 80 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          title: {
            text: '牛顿法收敛过程',
            font: { color: 'white', size: 18 },
          },
          xaxis: {
            title: { text: '迭代次数' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: '误差 |x - x*|' },
            type: 'log',
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'newton': {
      formula: 'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}',
      description: '牛顿法迭代公式',
    },
    'tangent': {
      formula: 'y - f(x_0) = f\'(x_0)(x - x_0)',
      description: '切线方程',
    },
    'convergence': {
      formula: '|x_{n+1} - x^*| \\approx C|x_n - x^*|^2',
      description: '二次收敛性质',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['newton']

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
    'app-1': {
      title: '牛顿法的应用',
      items: ['求解非线性方程', '优化问题', '计算平方根', '机器学习'],
      icon: '🔬',
    },
    'app-2': {
      title: '计算器中的应用',
      items: ['平方根计算', '三角函数求值', '对数计算', '指数运算'],
      icon: '🧮',
    },
    'app-3': {
      title: '优化问题',
      items: ['寻找函数极值', '最小二乘法', '非线性回归', '参数估计'],
      icon: '📊',
    },
    'app-4': {
      title: '机器学习',
      items: ['梯度下降的变体', '二阶优化方法', '牛顿-拉夫逊法', 'L-BFGS算法'],
      icon: '🤖',
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
export default function NewtonMethodSceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('convergence')) {
      return <FormulaScene formulaType="convergence" />
    }
    if (sceneConfig.id.includes('tangent')) {
      return <FormulaScene formulaType="tangent" />
    }
    return <FormulaScene formulaType="newton" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('intro-1')) {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id.includes('intro-4')) {
        return <FormulaScene formulaType="newton" />
      }
      return <TangentScene x0={3} />

    case 'concept':
      if (sceneConfig.id.includes('concept-1')) {
        return <TangentScene x0={3} />
      }
      if (sceneConfig.id.includes('concept-2')) {
        return <TangentScene x0={3} />
      }
      if (sceneConfig.id.includes('concept-3')) {
        return <TangentScene x0={3} />
      }
      return <IterationScene maxIterations={3} />

    case 'visualization':
      if (sceneConfig.id.includes('vis-1') || sceneConfig.id.includes('vis-2')) {
        return <TangentScene x0={3} />
      }
      if (sceneConfig.id.includes('vis-3')) {
        return <IterationScene maxIterations={2} />
      }
      return <IterationScene animate maxIterations={5} />

    case 'convergence':
      if (sceneConfig.id.includes('conv-1') || sceneConfig.id.includes('conv-2')) {
        return <ConvergenceScene />
      }
      if (sceneConfig.id.includes('conv-3') || sceneConfig.id.includes('conv-4')) {
        return <IterationScene animate maxIterations={8} />
      }
      return <FormulaScene formulaType="convergence" />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('sum-1')) {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id.includes('sum-2')) {
        return <IterationScene animate maxIterations={5} />
      }
      if (sceneConfig.id.includes('sum-3')) {
        return <ConvergenceScene />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    default:
      return <TangentScene x0={3} />
  }
}
