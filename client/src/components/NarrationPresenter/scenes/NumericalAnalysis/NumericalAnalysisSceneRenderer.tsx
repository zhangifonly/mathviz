/**
 * 数值分析场景渲染器
 * 渲染欧拉法、RK4、牛顿法、二分法等数值方法的可视化动画
 */

import { useEffect, useRef, useState } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '数值分析', subtitle: '用计算机求解数学问题' },
    'summary-intro': { title: '总结回顾', subtitle: '数值方法的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索数值分析之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '数值分析', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 欧拉法场景
function EulerMethodScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    // 真实解 y = e^x
    ctx.strokeStyle = '#4ade80'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x < width; x++) {
      const t = (x / width) * 3
      const y = centerY - Math.exp(t) * 50
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 欧拉法近似
    const h = 0.3 // 步长
    const steps = Math.min(step, 10)
    let x = 0
    let y = 1

    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, centerY - y * 50)

    for (let i = 0; i < steps; i++) {
      const dy = y * h // dy/dx = y
      const newY = y + dy
      const newX = x + h

      const screenX2 = (newX / 3) * width
      const screenY2 = centerY - newY * 50

      ctx.lineTo(screenX2, screenY2)

      // 绘制步长标记
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(screenX2, screenY2, 4, 0, Math.PI * 2)
      ctx.fill()

      x = newX
      y = newY
    }
    ctx.stroke()

    // 图例
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#4ade80'
    ctx.fillText('真实解: y = e^x', 20, 30)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('欧拉法近似', 20, 50)

    if (animate) {
      const timer = setTimeout(() => {
        setStep(prev => (prev >= 10 ? 0 : prev + 1))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [step, animate])

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

// RK4 方法场景
function RK4Scene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2

    // 清空画布
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    // 真实解
    ctx.strokeStyle = '#4ade80'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x < width; x++) {
      const t = (x / width) * 3
      const y = centerY - Math.exp(t) * 50
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // RK4 方法
    const h = 0.3
    const steps = Math.min(step, 10)
    let x = 0
    let y = 1

    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, centerY - y * 50)

    for (let i = 0; i < steps; i++) {
      const k1 = y
      const k2 = y + h * k1 / 2
      const k3 = y + h * k2 / 2
      const k4 = y + h * k3

      const dy = (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4)
      const newY = y + dy
      const newX = x + h

      const screenX2 = (newX / 3) * width
      const screenY2 = centerY - newY * 50

      ctx.lineTo(screenX2, screenY2)

      ctx.fillStyle = '#8b5cf6'
      ctx.beginPath()
      ctx.arc(screenX2, screenY2, 4, 0, Math.PI * 2)
      ctx.fill()

      x = newX
      y = newY
    }
    ctx.stroke()

    // 图例
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#4ade80'
    ctx.fillText('真实解: y = e^x', 20, 30)
    ctx.fillStyle = '#8b5cf6'
    ctx.fillText('RK4 方法', 20, 50)

    if (animate) {
      const timer = setTimeout(() => {
        setStep(prev => (prev >= 10 ? 0 : prev + 1))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [step, animate])

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

// 牛顿法场景
function NewtonMethodScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [iteration, setIteration] = useState(0)

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

    // 函数 f(x) = x^2 - 2
    const f = (x: number) => x * x - 2
    const df = (x: number) => 2 * x

    const toScreenX = (x: number) => (x + 1) * width / 3
    const toScreenY = (y: number) => height / 2 - y * 50

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.moveTo(toScreenX(0), 0)
    ctx.lineTo(toScreenX(0), height)
    ctx.stroke()

    // 绘制函数曲线
    ctx.strokeStyle = '#4ade80'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = -1; x < 2; x += 0.01) {
      const y = f(x)
      const screenX = toScreenX(x)
      const screenY = toScreenY(y)
      if (x === -1) ctx.moveTo(screenX, screenY)
      else ctx.lineTo(screenX, screenY)
    }
    ctx.stroke()

    // 牛顿迭代
    let x = 2 // 初始猜测
    const iterations = Math.min(iteration, 5)

    for (let i = 0; i < iterations; i++) {
      const y = f(x)
      const slope = df(x)

      // 绘制切线
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      const x1 = x - 1
      const y1 = y + slope * (-1)
      const x2 = x + 1
      const y2 = y + slope * 1
      ctx.moveTo(toScreenX(x1), toScreenY(y1))
      ctx.lineTo(toScreenX(x2), toScreenY(y2))
      ctx.stroke()
      ctx.setLineDash([])

      // 绘制点
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(toScreenX(x), toScreenY(y), 5, 0, Math.PI * 2)
      ctx.fill()

      // 下一次迭代
      x = x - y / slope

      // 绘制新点
      ctx.fillStyle = '#8b5cf6'
      ctx.beginPath()
      ctx.arc(toScreenX(x), toScreenY(0), 5, 0, Math.PI * 2)
      ctx.fill()
    }

    // 绘制根
    const root = Math.sqrt(2)
    ctx.fillStyle = '#4ade80'
    ctx.beginPath()
    ctx.arc(toScreenX(root), toScreenY(0), 6, 0, Math.PI * 2)
    ctx.fill()

    // 图例
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#4ade80'
    ctx.fillText('f(x) = x² - 2', 20, 30)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText(`迭代 ${iterations} 次`, 20, 50)

    if (animate) {
      const timer = setTimeout(() => {
        setIteration(prev => (prev >= 5 ? 0 : prev + 1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [iteration, animate])

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

// 二分法场景
function BisectionScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [iteration, setIteration] = useState(0)

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

    // 函数 f(x) = x^3 - x - 2
    const f = (x: number) => x * x * x - x - 2

    const toScreenX = (x: number) => ((x + 1) / 3) * width
    const toScreenY = (y: number) => height / 2 - y * 30

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    // 绘制函数曲线
    ctx.strokeStyle = '#4ade80'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = -1; x < 2; x += 0.01) {
      const y = f(x)
      const screenX = toScreenX(x)
      const screenY = toScreenY(y)
      if (x === -1) ctx.moveTo(screenX, screenY)
      else ctx.lineTo(screenX, screenY)
    }
    ctx.stroke()

    // 二分法
    let a = 1
    let b = 2
    const iterations = Math.min(iteration, 8)

    for (let i = 0; i < iterations; i++) {
      const c = (a + b) / 2
      const fc = f(c)

      // 绘制区间
      ctx.fillStyle = 'rgba(249, 115, 22, 0.2)'
      ctx.fillRect(toScreenX(a), 0, toScreenX(b) - toScreenX(a), height)

      // 绘制中点
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(toScreenX(c), toScreenY(fc), 5, 0, Math.PI * 2)
      ctx.fill()

      // 更新区间
      if (f(a) * fc < 0) {
        b = c
      } else {
        a = c
      }
    }

    // 图例
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#4ade80'
    ctx.fillText('f(x) = x³ - x - 2', 20, 30)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText(`迭代 ${iterations} 次，区间: [${a.toFixed(4)}, ${b.toFixed(4)}]`, 20, 50)

    if (animate) {
      const timer = setTimeout(() => {
        setIteration(prev => (prev >= 8 ? 0 : prev + 1))
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [iteration, animate])

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
    'euler': {
      formula: 'y_{n+1} = y_n + h f(x_n, y_n)',
      description: '欧拉法 - 最简单的数值微分方程求解方法',
    },
    'rk4': {
      formula: 'y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)',
      description: 'RK4 方法 - 四阶龙格-库塔法，精度更高',
    },
    'newton': {
      formula: 'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}',
      description: '牛顿法 - 快速求解方程的根',
    },
    'bisection': {
      formula: 'c = \\frac{a + b}{2}, \\quad \\text{if } f(a)f(c) < 0 \\text{ then } b = c \\text{ else } a = c',
      description: '二分法 - 稳定但较慢的求根方法',
    },
    'error': {
      formula: '\\text{误差} = |\\text{真实值} - \\text{近似值}|',
      description: '数值误差分析',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['euler']

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
      title: '物理模拟',
      items: ['天体运动', '流体力学', '量子力学', '电磁场'],
      icon: '🌌',
    },
    'app-engineering': {
      title: '工程应用',
      items: ['结构分析', '热传导', '电路仿真', '控制系统'],
      icon: '⚙️',
    },
    'app-finance': {
      title: '金融计算',
      items: ['期权定价', '风险评估', '投资组合优化', '利率模型'],
      icon: '💰',
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
export default function NumericalAnalysisSceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('euler')) {
      return <FormulaScene formulaType="euler" />
    }
    if (sceneConfig.id.includes('rk4')) {
      return <FormulaScene formulaType="rk4" />
    }
    if (sceneConfig.id.includes('newton')) {
      return <FormulaScene formulaType="newton" />
    }
    if (sceneConfig.id.includes('bisection')) {
      return <FormulaScene formulaType="bisection" />
    }
    if (sceneConfig.id.includes('error')) {
      return <FormulaScene formulaType="error" />
    }
    return <FormulaScene formulaType="euler" />
  }

  // 根据 section 决定显示什么
  switch (sectionId) {
    case 'intro':
    case 'euler':
      return <EulerMethodScene animate />

    case 'rk4':
      return <RK4Scene animate />

    case 'newton':
      return <NewtonMethodScene animate />

    case 'bisection':
      return <BisectionScene animate />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('euler')) {
        return <EulerMethodScene animate />
      }
      if (sceneConfig.id.includes('rk4')) {
        return <RK4Scene animate />
      }
      if (sceneConfig.id.includes('newton')) {
        return <NewtonMethodScene animate />
      }
      return <EulerMethodScene animate />

    default:
      return <EulerMethodScene animate />
  }
}
