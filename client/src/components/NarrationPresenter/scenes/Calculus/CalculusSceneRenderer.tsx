/**
 * 微积分场景渲染器
 * 可视化导数、积分和微积分基本定理
 */

import { useMemo, useState, useEffect, useCallback } from 'react'
import Plot from 'react-plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '微积分入门', subtitle: '探索导数与积分的几何意义' },
    'summary-1': { title: '总结回顾', subtitle: '微积分的核心思想' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '微积分', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 导数/切线演示场景
function DerivativeScene({ interactive = false }: { interactive?: boolean }) {
  const [x, setX] = useState(1)
  const [animating] = useState(!interactive)

  // 自动动画
  useEffect(() => {
    if (!animating) return
    const timer = setInterval(() => {
      setX(prev => {
        const next = prev + 0.05
        return next > 3 ? -2 : next
      })
    }, 50)
    return () => clearInterval(timer)
  }, [animating])

  // 函数: f(x) = x^2 - 2x + 1
  const f = useCallback((x: number) => x * x - 2 * x + 1, [])
  const fPrime = useCallback((x: number) => 2 * x - 2, []) // 导数: f'(x) = 2x - 2

  const plotData = useMemo(() => {
    // 函数曲线
    const xValues = []
    const yValues = []
    for (let i = -2; i <= 3; i += 0.05) {
      xValues.push(i)
      yValues.push(f(i))
    }

    // 切点
    const y0 = f(x)
    const slope = fPrime(x)

    // 切线: y - y0 = slope * (x - x0)
    const tangentX = [x - 1.5, x + 1.5]
    const tangentY = tangentX.map(xi => y0 + slope * (xi - x))

    return {
      curve: { x: xValues, y: yValues },
      point: { x, y: y0 },
      tangent: { x: tangentX, y: tangentY },
      slope,
    }
  }, [x, f, fPrime])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: plotData.curve.x,
            y: plotData.curve.y,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#3b82f6', width: 3 },
            name: 'f(x) = x² - 2x + 1',
          },
          {
            x: plotData.tangent.x,
            y: plotData.tangent.y,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#ef4444', width: 2, dash: 'dash' },
            name: '切线',
          },
          {
            x: [plotData.point.x],
            y: [plotData.point.y],
            type: 'scatter',
            mode: 'markers',
            marker: { color: '#22c55e', size: 12 },
            name: '切点',
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 30, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [-2.5, 3.5],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'y' },
            range: [-2, 6],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
          showlegend: true,
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />

      {interactive && (
        <div className="w-full max-w-md px-4">
          <div className="flex items-center gap-4 text-white">
            <label className="text-sm">x = {x.toFixed(2)}</label>
            <input
              type="range"
              min="-2"
              max="3"
              step="0.1"
              value={x}
              onChange={(e) => setX(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
          <div className="text-white/70 text-sm mt-2 text-center">
            斜率 f'({x.toFixed(2)}) = {plotData.slope.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  )
}

// 积分/面积演示场景
function IntegralScene({ interactive = false }: { interactive?: boolean }) {
  const [a, setA] = useState(0)
  const [b, setB] = useState(2)
  const [numRects, setNumRects] = useState(10)

  // 函数: f(x) = x^2
  const f = useCallback((x: number) => x * x, [])

  const plotData = useMemo(() => {
    // 函数曲线
    const xValues = []
    const yValues = []
    for (let i = -0.5; i <= 3; i += 0.05) {
      xValues.push(i)
      yValues.push(f(i))
    }

    // 填充区域
    const fillX = []
    const fillY = []
    for (let i = a; i <= b; i += 0.01) {
      fillX.push(i)
      fillY.push(f(i))
    }

    // 黎曼和矩形
    const rects: { x: number[]; y: number[] }[] = []
    const dx = (b - a) / numRects
    for (let i = 0; i < numRects; i++) {
      const x0 = a + i * dx
      const x1 = x0 + dx
      const height = f(x0) // 左端点高度
      rects.push({
        x: [x0, x1, x1, x0, x0],
        y: [0, 0, height, height, 0],
      })
    }

    // 计算积分值 (x^2 的积分是 x^3/3)
    const integralValue = (b ** 3 - a ** 3) / 3

    return { curve: { x: xValues, y: yValues }, fill: { x: fillX, y: fillY }, rects, integralValue }
  }, [a, b, numRects, f])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          // 函数曲线
          {
            x: plotData.curve.x,
            y: plotData.curve.y,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#3b82f6', width: 3 },
            name: 'f(x) = x²',
          },
          // 填充区域
          {
            x: [...plotData.fill.x, b, a],
            y: [...plotData.fill.y, 0, 0],
            type: 'scatter',
            mode: 'lines',
            fill: 'toself',
            fillcolor: 'rgba(59, 130, 246, 0.3)',
            line: { width: 0 },
            name: '积分区域',
            showlegend: false,
          },
          // 黎曼和矩形
          ...plotData.rects.map((rect, i) => ({
            x: rect.x,
            y: rect.y,
            type: 'scatter' as const,
            mode: 'lines' as const,
            line: { color: '#22c55e', width: 1 },
            fill: 'toself' as const,
            fillcolor: 'rgba(34, 197, 94, 0.2)',
            showlegend: i === 0,
            name: i === 0 ? '黎曼和' : undefined,
          })),
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 30, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [-0.5, 3],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'y' },
            range: [-0.5, 9],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
          showlegend: true,
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />

      <div className="text-white text-center">
        <div className="text-lg">
          ∫<sub>{a.toFixed(1)}</sub><sup>{b.toFixed(1)}</sup> x² dx = {plotData.integralValue.toFixed(3)}
        </div>
      </div>

      {interactive && (
        <div className="w-full max-w-md px-4 space-y-3">
          <div className="flex items-center gap-4 text-white">
            <label className="text-sm w-20">下限 a:</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm w-12">{a.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <label className="text-sm w-20">上限 b:</label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm w-12">{b.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <label className="text-sm w-20">矩形数:</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={numRects}
              onChange={(e) => setNumRects(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm w-12">{numRects}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'derivative-definition': {
      formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
      description: '导数的定义 - 瞬时变化率',
    },
    'derivative-power': {
      formula: '\\frac{d}{dx}(x^n) = nx^{n-1}',
      description: '幂函数的导数公式',
    },
    'integral-definition': {
      formula: '\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^*)\\Delta x',
      description: '定积分的定义 - 黎曼和的极限',
    },
    'ftc': {
      formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)',
      description: '微积分基本定理 - 其中 F\'(x) = f(x)',
    },
    'ftc-part1': {
      formula: '\\frac{d}{dx}\\left[\\int_a^x f(t)\\,dt\\right] = f(x)',
      description: '微积分基本定理第一部分 - 积分的导数',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['derivative-definition']

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
    'applications-1': {
      title: '微积分的应用',
      items: ['物理学 - 运动分析', '经济学 - 边际分析', '工程学 - 优化设计', '生物学 - 种群增长'],
      icon: '📊',
    },
    'applications-2': {
      title: '物理学应用',
      items: ['速度 = 位置的导数', '加速度 = 速度的导数', '功 = 力的积分', '动能定理'],
      icon: '⚡',
    },
    'applications-3': {
      title: '经济学应用',
      items: ['边际成本 = 总成本的导数', '边际收益 = 总收益的导数', '消费者剩余 = 需求曲线下面积', '生产者剩余'],
      icon: '💰',
    },
    'applications-4': {
      title: '工程学应用',
      items: ['最优化问题', '面积和体积计算', '质心和转动惯量', '信号处理'],
      icon: '⚙️',
    },
  }

  const app = apps[sceneId] || apps['applications-1']

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

// 微积分基本定理演示场景
function FTCScene() {
  const [x, setX] = useState(1)
  const [animating] = useState(true)

  useEffect(() => {
    if (!animating) return
    const timer = setInterval(() => {
      setX(prev => {
        const next = prev + 0.05
        return next > 3 ? 0 : next
      })
    }, 50)
    return () => clearInterval(timer)
  }, [animating])

  // f(x) = x^2, F(x) = x^3/3
  const f = useCallback((x: number) => x * x, [])
  const F = useCallback((x: number) => (x ** 3) / 3, [])

  const plotData = useMemo(() => {
    const xValues = []
    const fValues = []
    const FValues = []

    for (let i = 0; i <= 3; i += 0.05) {
      xValues.push(i)
      fValues.push(f(i))
      FValues.push(F(i))
    }

    // 积分区域 [0, x]
    const fillX = []
    const fillY = []
    for (let i = 0; i <= x; i += 0.01) {
      fillX.push(i)
      fillY.push(f(i))
    }

    const integralValue = F(x) - F(0)

    return {
      x: xValues,
      f: fValues,
      F: FValues,
      fill: { x: fillX, y: fillY },
      integralValue,
      currentX: x,
    }
  }, [x, f, F])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
        {/* 左图: f(x) 和积分区域 */}
        <div>
          <Plot
            data={[
              {
                x: plotData.x,
                y: plotData.f,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#3b82f6', width: 3 },
                name: 'f(x) = x²',
              },
              {
                x: [...plotData.fill.x, x, 0],
                y: [...plotData.fill.y, 0, 0],
                type: 'scatter',
                mode: 'lines',
                fill: 'toself',
                fillcolor: 'rgba(59, 130, 246, 0.3)',
                line: { width: 0 },
                name: '积分区域',
                showlegend: false,
              },
              {
                x: [x, x],
                y: [0, f(x)],
                type: 'scatter',
                mode: 'lines',
                line: { color: '#ef4444', width: 2, dash: 'dash' },
                showlegend: false,
              },
            ]}
            layout={{
              autosize: true,
              height: 300,
              margin: { t: 30, r: 20, b: 50, l: 50 },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'rgba(255,255,255,0.05)',
              title: { text: 'f(x) = x²', font: { color: 'white' } },
              xaxis: {
                title: { text: 'x' },
                range: [0, 3],
                color: 'white',
                gridcolor: 'rgba(255,255,255,0.1)',
              },
              yaxis: {
                title: { text: 'y' },
                range: [0, 9],
                color: 'white',
                gridcolor: 'rgba(255,255,255,0.1)',
              },
            }}
            config={{ responsive: true, displayModeBar: false, displaylogo: false }}
            className="w-full"
          />
        </div>

        {/* 右图: F(x) 原函数 */}
        <div>
          <Plot
            data={[
              {
                x: plotData.x,
                y: plotData.F,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#22c55e', width: 3 },
                name: 'F(x) = x³/3',
              },
              {
                x: [x],
                y: [F(x)],
                type: 'scatter',
                mode: 'markers',
                marker: { color: '#ef4444', size: 12 },
                showlegend: false,
              },
            ]}
            layout={{
              autosize: true,
              height: 300,
              margin: { t: 30, r: 20, b: 50, l: 50 },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'rgba(255,255,255,0.05)',
              title: { text: 'F(x) = x³/3', font: { color: 'white' } },
              xaxis: {
                title: { text: 'x' },
                range: [0, 3],
                color: 'white',
                gridcolor: 'rgba(255,255,255,0.1)',
              },
              yaxis: {
                title: { text: 'y' },
                range: [0, 9],
                color: 'white',
                gridcolor: 'rgba(255,255,255,0.1)',
              },
            }}
            config={{ responsive: true, displayModeBar: false, displaylogo: false }}
            className="w-full"
          />
        </div>
      </div>

      <div className="text-white text-center space-y-2">
        <div className="text-lg">
          ∫<sub>0</sub><sup>{x.toFixed(2)}</sup> x² dx = F({x.toFixed(2)}) - F(0) = {plotData.integralValue.toFixed(3)}
        </div>
        <div className="text-sm text-white/70">
          积分值（左图阴影面积）= 原函数的增量（右图高度）
        </div>
      </div>
    </div>
  )
}

// 主渲染器
export default function CalculusSceneRenderer({ scene, isInteractive }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 标题场景
  if (sceneConfig.type === 'title' || sceneConfig.id.includes('intro-1') || sceneConfig.id.includes('summary-1')) {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 应用场景
  if (sceneConfig.type === 'application' || sceneConfig.id.includes('applications')) {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      return <TitleScene sceneId={sceneConfig.id} />

    case 'derivative-concept':
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="derivative-definition" />
      }
      return <DerivativeScene />

    case 'tangent-line':
      return <DerivativeScene interactive={isInteractive} />

    case 'derivative-formula':
      if (sceneConfig.id.includes('3') || sceneConfig.id.includes('4')) {
        return <FormulaScene formulaType="derivative-power" />
      }
      return <FormulaScene formulaType="derivative-definition" />

    case 'integral-concept':
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="integral-definition" />
      }
      return <IntegralScene />

    case 'area-demo':
      return <IntegralScene interactive={isInteractive} />

    case 'ftc':
      if (sceneConfig.id.includes('1') || sceneConfig.id.includes('2')) {
        return <FTCScene />
      }
      if (sceneConfig.id.includes('3') || sceneConfig.id.includes('4')) {
        return <FormulaScene formulaType="ftc" />
      }
      return <FTCScene />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('2')) {
        return <DerivativeScene />
      }
      if (sceneConfig.id.includes('3')) {
        return <IntegralScene />
      }
      if (sceneConfig.id.includes('4')) {
        return <FormulaScene formulaType="ftc" />
      }
      return <TitleScene sceneId="summary-1" />

    default:
      return <DerivativeScene />
  }
}
