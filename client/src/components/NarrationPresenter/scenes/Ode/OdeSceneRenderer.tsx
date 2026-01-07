/**
 * 常微分方程场景渲染器
 * 渲染方向场、解曲线、数值方法对比等 ODE 可视化
 */

import { useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '常微分方程', subtitle: '探索变化率与动力系统' },
    'summary-intro': { title: '总结回顾', subtitle: '微分方程的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索变化的数学' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '常微分方程', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 方向场场景
function DirectionFieldScene({ equation = 'exponential' }: { equation?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 定义不同的微分方程
  const equations: Record<string, { f: (x: number, y: number) => number; name: string }> = {
    exponential: {
      f: (_x: number, y: number) => y,
      name: "y' = y (指数增长)",
    },
    decay: {
      f: (_x: number, y: number) => -y,
      name: "y' = -y (指数衰减)",
    },
    logistic: {
      f: (_x: number, y: number) => y * (1 - y),
      name: "y' = y(1-y) (逻辑增长)",
    },
    linear: {
      f: (x: number, y: number) => x + y,
      name: "y' = x + y",
    },
  }

  const eq = equations[equation] || equations.exponential

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 坐标范围
    const xMin = -2, xMax = 2
    const yMin = -2, yMax = 2
    const xScale = (width - 2 * padding) / (xMax - xMin)
    const yScale = (height - 2 * padding) / (yMax - yMin)

    const toCanvas = (x: number, y: number) => ({
      cx: padding + (x - xMin) * xScale,
      cy: height - padding - (y - yMin) * yScale,
    })

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    const { cx: x0, cy: y0 } = toCanvas(0, yMin)
    const { cx: x1, cy: y1 } = toCanvas(0, yMax)
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()

    ctx.beginPath()
    const { cx: x2, cy: y2 } = toCanvas(xMin, 0)
    const { cx: x3, cy: y3 } = toCanvas(xMax, 0)
    ctx.moveTo(x2, y2)
    ctx.lineTo(x3, y3)
    ctx.stroke()

    // 绘制方向场
    const step = 0.3
    const arrowLen = 0.15

    for (let x = xMin; x <= xMax; x += step) {
      for (let y = yMin; y <= yMax; y += step) {
        const slope = eq.f(x, y)

        // 归一化斜率以获得方向
        const angle = Math.atan(slope)
        const dx = arrowLen * Math.cos(angle)
        const dy = arrowLen * Math.sin(angle)

        const { cx: cx1, cy: cy1 } = toCanvas(x - dx / 2, y - dy / 2)
        const { cx: cx2, cy: cy2 } = toCanvas(x + dx / 2, y + dy / 2)

        // 根据斜率大小设置颜色
        const magnitude = Math.min(Math.abs(slope), 3) / 3
        const r = Math.floor(59 + magnitude * 100)
        const g = Math.floor(130 + magnitude * 100)
        const b = Math.floor(246)

        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(cx1, cy1)
        ctx.lineTo(cx2, cy2)
        ctx.stroke()

        // 绘制箭头
        const arrowSize = 3
        const arrowAngle = Math.PI / 6
        ctx.beginPath()
        ctx.moveTo(cx2, cy2)
        ctx.lineTo(
          cx2 - arrowSize * Math.cos(angle - arrowAngle),
          cy2 + arrowSize * Math.sin(angle - arrowAngle)
        )
        ctx.moveTo(cx2, cy2)
        ctx.lineTo(
          cx2 - arrowSize * Math.cos(angle + arrowAngle),
          cy2 + arrowSize * Math.sin(angle + arrowAngle)
        )
        ctx.stroke()
      }
    }

    // 绘制标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('x', width - 25, height / 2 - 10)
    ctx.fillText('y', width / 2 + 10, 25)
    ctx.font = '12px sans-serif'
    ctx.fillText(eq.name, padding, padding - 10)
  }, [equation, eq])

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

// 解曲线场景
function SolutionCurveScene({ equation = 'exponential', showMultiple = false }: { equation?: string; showMultiple?: boolean }) {
  const data = useMemo(() => {
    // 欧拉法求解 ODE
    const euler = (f: (x: number, y: number) => number, x0: number, y0: number, xEnd: number, steps: number) => {
      const h = (xEnd - x0) / steps
      const xs: number[] = [x0]
      const ys: number[] = [y0]
      let _x = x0, y = y0

      for (let i = 0; i < steps; i++) {
        y = y + h * f(_x, y)
        _x = _x + h
        xs.push(_x)
        ys.push(y)
      }

      return { x: xs, y: ys }
    }

    const equations: Record<string, (_x: number, y: number) => number> = {
      exponential: (_x: number, y: number) => y,
      decay: (_x: number, y: number) => -y,
      logistic: (_x: number, y: number) => y * (1 - y),
      oscillation: (x: number, _y: number) => -x, // 简化的简谐振动
    }

    const f = equations[equation] || equations.exponential

    if (showMultiple) {
      // 多条初始条件的解曲线
      const initialValues = [0.5, 1.0, 1.5, 2.0]
      return initialValues.map(y0 => ({
        ...euler(f, 0, y0, 3, 300),
        name: `y(0) = ${y0}`,
      }))
    } else {
      // 单条解曲线
      return [{ ...euler(f, 0, 1, 3, 300), name: 'y(0) = 1' }]
    }
  }, [equation, showMultiple])

  const traces: Data[] = data.map((curve, i) => ({
    x: curve.x,
    y: curve.y,
    type: 'scatter' as const,
    mode: 'lines',
    line: {
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 4],
      width: 2,
    },
    name: curve.name,
  }))

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 450,
          margin: { t: 30, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x (时间)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: 'y (解)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
          showlegend: showMultiple,
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  )
}

// 数值方法对比场景
function MethodComparisonScene() {
  const data = useMemo(() => {
    // 真实解: y' = y, y(0) = 1 => y = e^x
    const trueF = (_x: number) => Math.exp(_x)

    // 欧拉法
    const euler = (h: number) => {
      const xs: number[] = [0]
      const ys: number[] = [1]
      let _x = 0, y = 1
      const xEnd = 2

      while (_x < xEnd) {
        y = y + h * y
        _x = _x + h
        xs.push(_x)
        ys.push(y)
      }

      return { x: xs, y: ys }
    }

    // 龙格-库塔法 (RK4)
    const rk4 = (h: number) => {
      const xs: number[] = [0]
      const ys: number[] = [1]
      let _x = 0, y = 1
      const xEnd = 2
      const f = (_xVal: number, yVal: number) => yVal

      while (_x < xEnd) {
        const k1 = h * f(_x, y)
        const k2 = h * f(_x + h / 2, y + k1 / 2)
        const k3 = h * f(_x + h / 2, y + k2 / 2)
        const k4 = h * f(_x + h, y + k3)
        y = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6
        _x = _x + h
        xs.push(_x)
        ys.push(y)
      }

      return { x: xs, y: ys }
    }

    const h = 0.2
    const eulerData = euler(h)
    const rk4Data = rk4(h)

    // 真实解
    const trueX = []
    const trueY = []
    for (let _x = 0; _x <= 2; _x += 0.01) {
      trueX.push(_x)
      trueY.push(trueF(_x))
    }

    return {
      true: { x: trueX, y: trueY },
      euler: eulerData,
      rk4: rk4Data,
    }
  }, [])

  const traces: Data[] = [
    {
      x: data.true.x,
      y: data.true.y,
      type: 'scatter' as const,
      mode: 'lines',
      line: { color: '#10b981', width: 2, dash: 'dash' },
      name: '真实解 (e^x)',
    },
    {
      x: data.euler.x,
      y: data.euler.y,
      type: 'scatter' as const,
      mode: 'lines+markers',
      line: { color: '#ef4444', width: 2 },
      marker: { size: 6 },
      name: '欧拉法',
    },
    {
      x: data.rk4.x,
      y: data.rk4.y,
      type: 'scatter' as const,
      mode: 'lines+markers',
      line: { color: '#3b82f6', width: 2 },
      marker: { size: 6 },
      name: '龙格-库塔法 (RK4)',
    },
  ]

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 450,
          margin: { t: 30, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: 'y' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  )
}

// 相空间轨迹场景 (二阶 ODE)
function PhaseSpaceScene({ damping = 0 }: { damping?: number }) {
  const data = useMemo(() => {
    // 简谐振动: x'' + 2*damping*x' + x = 0
    // 转换为一阶系统: x' = v, v' = -x - 2*damping*v
    const rk4 = (x0: number, v0: number, damping: number) => {
      const dt = 0.05
      const steps = 400
      const xs: number[] = [x0]
      const vs: number[] = [v0]
      let x = x0, v = v0

      for (let i = 0; i < steps; i++) {
        const k1x = v
        const k1v = -x - 2 * damping * v

        const k2x = v + dt * k1v / 2
        const k2v = -(x + dt * k1x / 2) - 2 * damping * (v + dt * k1v / 2)

        const k3x = v + dt * k2v / 2
        const k3v = -(x + dt * k2x / 2) - 2 * damping * (v + dt * k2v / 2)

        const k4x = v + dt * k3v
        const k4v = -(x + dt * k3x) - 2 * damping * (v + dt * k3v)

        x = x + dt * (k1x + 2 * k2x + 2 * k3x + k4x) / 6
        v = v + dt * (k1v + 2 * k2v + 2 * k3v + k4v) / 6

        xs.push(x)
        vs.push(v)
      }

      return { x: xs, v: vs }
    }

    // 多条不同初始条件的轨迹
    const initialConditions = [
      { x: 2, v: 0 },
      { x: 1, v: 1 },
      { x: 0, v: 2 },
    ]

    return initialConditions.map(ic => rk4(ic.x, ic.v, damping))
  }, [damping])

  const traces: Data[] = data.map((trajectory, i) => ({
    x: trajectory.x,
    y: trajectory.v,
    type: 'scatter' as const,
    mode: 'lines',
    line: {
      color: ['#3b82f6', '#10b981', '#f59e0b'][i],
      width: 2,
    },
    name: `轨迹 ${i + 1}`,
  }))

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 450,
          margin: { t: 30, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x (位置)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: 'v (速度)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    definition: {
      formula: '\\frac{dy}{dx} = f(x, y)',
      description: '常微分方程的一般形式',
    },
    exponential: {
      formula: '\\frac{dy}{dt} = ky \\quad \\Rightarrow \\quad y(t) = y_0 e^{kt}',
      description: '指数增长/衰减方程',
    },
    logistic: {
      formula: '\\frac{dP}{dt} = rP\\left(1 - \\frac{P}{K}\\right)',
      description: '逻辑增长方程 (Logistic)',
    },
    harmonic: {
      formula: '\\frac{d^2x}{dt^2} + \\omega^2 x = 0 \\quad \\Rightarrow \\quad x(t) = A\\cos(\\omega t + \\phi)',
      description: '简谐振动方程',
    },
    damped: {
      formula: '\\frac{d^2x}{dt^2} + 2\\zeta\\omega_0\\frac{dx}{dt} + \\omega_0^2 x = 0',
      description: '阻尼振动方程',
    },
    euler: {
      formula: 'y_{n+1} = y_n + h \\cdot f(x_n, y_n)',
      description: '欧拉法数值求解',
    },
    rk4: {
      formula: 'y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)',
      description: '龙格-库塔法 (RK4)',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['definition']

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
      title: '微分方程的应用',
      items: ['物理学', '生态学', '流行病学', '工程学'],
      icon: '🔬',
    },
    'app-2': {
      title: '物理学应用',
      items: ['牛顿运动定律', '电路分析', '热传导', '波动方程'],
      icon: '⚛️',
    },
    'app-3': {
      title: '生态学应用',
      items: ['种群增长', '捕食者-猎物模型', '竞争模型', '生态平衡'],
      icon: '🌿',
    },
    'app-4': {
      title: '流行病学应用',
      items: ['SIR 模型', '疾病传播预测', '疫苗接种策略', '群体免疫'],
      icon: '🦠',
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
export default function OdeSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene
  const lineState = scene.lineState

  // 标题场景
  if (sceneConfig.type === 'title') {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 公式场景
  if (sceneConfig.type === 'formula') {
    const formulaType = (lineState?.params?.formulaType as string) || 'definition'
    return <FormulaScene formulaType={formulaType} />
  }

  // 应用场景
  if (sceneConfig.type === 'application') {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 根据 section 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('intro-1')) {
        return <TitleScene sceneId="intro-1" />
      }
      if (sceneConfig.id.includes('intro-2') || sceneConfig.id.includes('intro-3')) {
        return <DirectionFieldScene equation="exponential" />
      }
      return <FormulaScene formulaType="definition" />

    case 'concept':
      if (sceneConfig.id.includes('concept-1')) {
        return <FormulaScene formulaType="definition" />
      }
      if (sceneConfig.id.includes('concept-2')) {
        return <DirectionFieldScene equation="exponential" />
      }
      if (sceneConfig.id.includes('concept-3')) {
        return <SolutionCurveScene equation="exponential" showMultiple={false} />
      }
      if (sceneConfig.id.includes('concept-4')) {
        return <SolutionCurveScene equation="exponential" showMultiple={true} />
      }
      return <DirectionFieldScene />

    case 'exponential':
      if (sceneConfig.id.includes('exp-1')) {
        return <FormulaScene formulaType="exponential" />
      }
      if (sceneConfig.id.includes('exp-2')) {
        return <SolutionCurveScene equation="exponential" showMultiple={true} />
      }
      if (sceneConfig.id.includes('exp-3')) {
        return <SolutionCurveScene equation="decay" showMultiple={true} />
      }
      if (sceneConfig.id.includes('exp-4')) {
        return <DirectionFieldScene equation="logistic" />
      }
      return <SolutionCurveScene equation="exponential" />

    case 'oscillation':
      if (sceneConfig.id.includes('osc-1')) {
        return <FormulaScene formulaType="harmonic" />
      }
      if (sceneConfig.id.includes('osc-2')) {
        return <PhaseSpaceScene damping={0} />
      }
      if (sceneConfig.id.includes('osc-3')) {
        return <PhaseSpaceScene damping={0.2} />
      }
      if (sceneConfig.id.includes('osc-4')) {
        return <FormulaScene formulaType="damped" />
      }
      return <PhaseSpaceScene />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('sum-1')) {
        return <FormulaScene formulaType="definition" />
      }
      if (sceneConfig.id.includes('sum-2')) {
        return <DirectionFieldScene equation="logistic" />
      }
      if (sceneConfig.id.includes('sum-3')) {
        return <MethodComparisonScene />
      }
      return <PhaseSpaceScene damping={0.1} />

    default:
      return <DirectionFieldScene />
  }
}
