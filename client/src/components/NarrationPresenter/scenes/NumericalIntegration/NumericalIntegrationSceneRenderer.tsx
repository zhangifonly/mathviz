/**
 * 数值积分场景渲染器
 * 渲染矩形法、梯形法、辛普森法等数值积分可视化
 */

import { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '数值积分', subtitle: '探索定积分的数值计算方法' },
    'summary-intro': { title: '总结回顾', subtitle: '数值积分的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索数值计算之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '数值积分', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 测试函数
const testFunction = (x: number): number => {
  return Math.sin(x) + 0.5 * Math.cos(2 * x) + 1
}

// 矩形法场景
function RectangleRuleScene({
  n = 8,
  method = 'midpoint',
  animate = false
}: {
  n?: number
  method?: 'left' | 'right' | 'midpoint'
  animate?: boolean
}) {
  const [currentN, setCurrentN] = useState(animate ? 2 : n)
  const a = 0, b = 2 * Math.PI

  useEffect(() => {
    if (!animate) {
      setCurrentN(n)
      return
    }

    const timer = setInterval(() => {
      setCurrentN(prev => {
        if (prev >= 32) return 2
        return prev * 2
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [animate, n])

  const data = useMemo(() => {
    const dx = (b - a) / currentN
    const xCurve = []
    const yCurve = []

    // 绘制曲线
    for (let x = a; x <= b; x += 0.01) {
      xCurve.push(x)
      yCurve.push(testFunction(x))
    }

    // 矩形数据
    const rectangles: Data[] = []
    let sum = 0

    for (let i = 0; i < currentN; i++) {
      const x0 = a + i * dx
      const x1 = a + (i + 1) * dx

      let height: number
      let xSample: number

      if (method === 'left') {
        xSample = x0
        height = testFunction(x0)
      } else if (method === 'right') {
        xSample = x1
        height = testFunction(x1)
      } else {
        xSample = (x0 + x1) / 2
        height = testFunction(xSample)
      }

      sum += height * dx

      rectangles.push({
        x: [x0, x1, x1, x0, x0],
        y: [0, 0, height, height, 0],
        type: 'scatter',
        mode: 'lines',
        fill: 'toself',
        fillcolor: 'rgba(59, 130, 246, 0.3)',
        line: { color: 'rgba(59, 130, 246, 0.8)', width: 1 },
        showlegend: false,
        hoverinfo: 'skip',
      } as Data)
    }

    // 精确值（用更细的分割近似）
    const exactValue = (() => {
      const steps = 10000
      const dx = (b - a) / steps
      let sum = 0
      for (let i = 0; i < steps; i++) {
        sum += testFunction(a + (i + 0.5) * dx) * dx
      }
      return sum
    })()

    const error = Math.abs(sum - exactValue)
    const errorPercent = (error / exactValue * 100).toFixed(2)

    return {
      curve: { x: xCurve, y: yCurve },
      rectangles,
      sum: sum.toFixed(4),
      exact: exactValue.toFixed(4),
      error: error.toFixed(4),
      errorPercent,
    }
  }, [currentN, method, a, b])

  const methodNames = {
    left: '左端点法',
    right: '右端点法',
    midpoint: '中点法',
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: data.curve.x,
            y: data.curve.y,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#10b981', width: 3 },
            name: 'f(x)',
          },
          ...data.rectangles,
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [a, b],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: 'f(x)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
      <div className="text-white/80 text-sm space-y-1 text-center">
        <p className="font-semibold">{methodNames[method]} (n = {currentN})</p>
        <p>近似值: {data.sum}</p>
        <p>精确值: {data.exact}</p>
        <p>误差: {data.error} ({data.errorPercent}%)</p>
      </div>
    </div>
  )
}

// 梯形法场景
function TrapezoidRuleScene({
  n = 8,
  animate = false
}: {
  n?: number
  animate?: boolean
}) {
  const [currentN, setCurrentN] = useState(animate ? 2 : n)
  const a = 0, b = 2 * Math.PI

  useEffect(() => {
    if (!animate) {
      setCurrentN(n)
      return
    }

    const timer = setInterval(() => {
      setCurrentN(prev => {
        if (prev >= 32) return 2
        return prev * 2
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [animate, n])

  const data = useMemo(() => {
    const dx = (b - a) / currentN
    const xCurve = []
    const yCurve = []

    // 绘制曲线
    for (let x = a; x <= b; x += 0.01) {
      xCurve.push(x)
      yCurve.push(testFunction(x))
    }

    // 梯形数据
    const trapezoids: Data[] = []
    let sum = 0

    for (let i = 0; i < currentN; i++) {
      const x0 = a + i * dx
      const x1 = a + (i + 1) * dx
      const y0 = testFunction(x0)
      const y1 = testFunction(x1)

      sum += (y0 + y1) * dx / 2

      trapezoids.push({
        x: [x0, x1, x1, x0, x0],
        y: [0, 0, y1, y0, 0],
        type: 'scatter',
        mode: 'lines',
        fill: 'toself',
        fillcolor: 'rgba(168, 85, 247, 0.3)',
        line: { color: 'rgba(168, 85, 247, 0.8)', width: 1 },
        showlegend: false,
        hoverinfo: 'skip',
      } as Data)
    }

    // 精确值
    const exactValue = (() => {
      const steps = 10000
      const dx = (b - a) / steps
      let sum = 0
      for (let i = 0; i < steps; i++) {
        sum += testFunction(a + (i + 0.5) * dx) * dx
      }
      return sum
    })()

    const error = Math.abs(sum - exactValue)
    const errorPercent = (error / exactValue * 100).toFixed(2)

    return {
      curve: { x: xCurve, y: yCurve },
      trapezoids,
      sum: sum.toFixed(4),
      exact: exactValue.toFixed(4),
      error: error.toFixed(4),
      errorPercent,
    }
  }, [currentN, a, b])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: data.curve.x,
            y: data.curve.y,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#10b981', width: 3 },
            name: 'f(x)',
          },
          ...data.trapezoids,
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [a, b],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: 'f(x)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
      <div className="text-white/80 text-sm space-y-1 text-center">
        <p className="font-semibold">梯形法 (n = {currentN})</p>
        <p>近似值: {data.sum}</p>
        <p>精确值: {data.exact}</p>
        <p>误差: {data.error} ({data.errorPercent}%)</p>
      </div>
    </div>
  )
}

// 辛普森法场景
function SimpsonRuleScene({
  n = 8,
  animate = false
}: {
  n?: number
  animate?: boolean
}) {
  const [currentN, setCurrentN] = useState(animate ? 2 : n)
  const a = 0, b = 2 * Math.PI

  useEffect(() => {
    if (!animate) {
      setCurrentN(n)
      return
    }

    const timer = setInterval(() => {
      setCurrentN(prev => {
        if (prev >= 32) return 2
        return prev * 2
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [animate, n])

  const data = useMemo(() => {
    // 辛普森法要求偶数个区间
    const actualN = currentN % 2 === 0 ? currentN : currentN + 1
    const dx = (b - a) / actualN
    const xCurve = []
    const yCurve = []

    // 绘制曲线
    for (let x = a; x <= b; x += 0.01) {
      xCurve.push(x)
      yCurve.push(testFunction(x))
    }

    // 辛普森法计算
    let sum = testFunction(a) + testFunction(b)

    for (let i = 1; i < actualN; i++) {
      const x = a + i * dx
      const coef = i % 2 === 0 ? 2 : 4
      sum += coef * testFunction(x)
    }

    sum *= dx / 3

    // 绘制抛物线段
    const parabolas: Data[] = []

    for (let i = 0; i < actualN; i += 2) {
      const x0 = a + i * dx
      const x1 = a + (i + 1) * dx
      const x2 = a + (i + 2) * dx

      const y0 = testFunction(x0)
      const y1 = testFunction(x1)
      const y2 = testFunction(x2)

      // 通过三点拟合抛物线
      const xPara = []
      const yPara = []

      for (let t = 0; t <= 1; t += 0.05) {
        const x = x0 + t * (x2 - x0)
        const s = (x - x0) / (x2 - x0)
        // 拉格朗日插值
        const y = y0 * (1 - s) * (1 - 2 * s) +
                  y1 * 4 * s * (1 - s) +
                  y2 * s * (2 * s - 1)
        xPara.push(x)
        yPara.push(y)
      }

      // 添加底边闭合
      xPara.push(x2)
      yPara.push(0)
      xPara.push(x0)
      yPara.push(0)
      xPara.push(x0)
      yPara.push(y0)

      parabolas.push({
        x: xPara,
        y: yPara,
        type: 'scatter',
        mode: 'lines',
        fill: 'toself',
        fillcolor: 'rgba(236, 72, 153, 0.3)',
        line: { color: 'rgba(236, 72, 153, 0.8)', width: 1 },
        showlegend: false,
        hoverinfo: 'skip',
      } as Data)
    }

    // 精确值
    const exactValue = (() => {
      const steps = 10000
      const dx = (b - a) / steps
      let sum = 0
      for (let i = 0; i < steps; i++) {
        sum += testFunction(a + (i + 0.5) * dx) * dx
      }
      return sum
    })()

    const error = Math.abs(sum - exactValue)
    const errorPercent = (error / exactValue * 100).toFixed(2)

    return {
      curve: { x: xCurve, y: yCurve },
      parabolas,
      sum: sum.toFixed(4),
      exact: exactValue.toFixed(4),
      error: error.toFixed(4),
      errorPercent,
      actualN,
    }
  }, [currentN, a, b])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: data.curve.x,
            y: data.curve.y,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#10b981', width: 3 },
            name: 'f(x)',
          },
          ...data.parabolas,
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [a, b],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: 'f(x)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
      <div className="text-white/80 text-sm space-y-1 text-center">
        <p className="font-semibold">辛普森法 (n = {data.actualN})</p>
        <p>近似值: {data.sum}</p>
        <p>精确值: {data.exact}</p>
        <p>误差: {data.error} ({data.errorPercent}%)</p>
      </div>
    </div>
  )
}

// 方法对比场景
function ComparisonScene({ n = 16 }: { n?: number }) {
  const a = 0, b = 2 * Math.PI

  const data = useMemo(() => {
    // 精确值
    const exactValue = (() => {
      const steps = 10000
      const dx = (b - a) / steps
      let sum = 0
      for (let i = 0; i < steps; i++) {
        sum += testFunction(a + (i + 0.5) * dx) * dx
      }
      return sum
    })()

    const methods = []
    const errors = []
    const colors = []

    // 矩形法（左端点）
    let dx = (b - a) / n
    let sum = 0
    for (let i = 0; i < n; i++) {
      sum += testFunction(a + i * dx) * dx
    }
    methods.push('矩形法(左)')
    errors.push(Math.abs(sum - exactValue))
    colors.push('rgba(59, 130, 246, 0.8)')

    // 矩形法（中点）
    sum = 0
    for (let i = 0; i < n; i++) {
      sum += testFunction(a + (i + 0.5) * dx) * dx
    }
    methods.push('矩形法(中)')
    errors.push(Math.abs(sum - exactValue))
    colors.push('rgba(59, 130, 246, 0.5)')

    // 梯形法
    sum = 0
    for (let i = 0; i < n; i++) {
      const x0 = a + i * dx
      const x1 = a + (i + 1) * dx
      sum += (testFunction(x0) + testFunction(x1)) * dx / 2
    }
    methods.push('梯形法')
    errors.push(Math.abs(sum - exactValue))
    colors.push('rgba(168, 85, 247, 0.8)')

    // 辛普森法
    const actualN = n % 2 === 0 ? n : n + 1
    dx = (b - a) / actualN
    sum = testFunction(a) + testFunction(b)
    for (let i = 1; i < actualN; i++) {
      const x = a + i * dx
      const coef = i % 2 === 0 ? 2 : 4
      sum += coef * testFunction(x)
    }
    sum *= dx / 3
    methods.push('辛普森法')
    errors.push(Math.abs(sum - exactValue))
    colors.push('rgba(236, 72, 153, 0.8)')

    return { methods, errors, colors }
  }, [n, a, b])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: data.methods,
            y: data.errors,
            type: 'bar',
            marker: { color: data.colors },
            text: data.errors.map(e => e.toExponential(2)),
            textposition: 'outside',
            textfont: { color: 'white' },
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 40, r: 30, b: 80, l: 80 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            color: 'white',
            tickangle: -15,
          },
          yaxis: {
            title: { text: '绝对误差' },
            type: 'log',
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          showlegend: false,
          title: {
            text: `误差对比 (n = ${n})`,
            font: { color: 'white', size: 16 },
          },
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
      <p className="text-white/70 text-sm text-center">
        辛普森法的精度明显优于其他方法
      </p>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'rectangle': {
      formula: '\\int_a^b f(x)dx \\approx \\sum_{i=0}^{n-1} f(x_i^*) \\Delta x',
      description: '矩形法：用矩形面积近似积分',
    },
    'trapezoid': {
      formula: '\\int_a^b f(x)dx \\approx \\frac{\\Delta x}{2}\\sum_{i=0}^{n-1} [f(x_i) + f(x_{i+1})]',
      description: '梯形法：用梯形面积近似积分',
    },
    'simpson': {
      formula: '\\int_a^b f(x)dx \\approx \\frac{\\Delta x}{3}[f(x_0) + 4\\sum_{i=odd}f(x_i) + 2\\sum_{i=even}f(x_i) + f(x_n)]',
      description: '辛普森法：用抛物线近似积分',
    },
    'error': {
      formula: 'E_{Simpson} = O(h^4), \\quad E_{Trapezoid} = O(h^2), \\quad E_{Rectangle} = O(h)',
      description: '误差阶：辛普森法收敛最快',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['rectangle']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur max-w-3xl">
        <MathFormula formula={formula} className="text-xl" />
      </div>
      <p className="text-white/70 text-lg text-center">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-1': {
      title: '数值积分的应用',
      items: ['物理学：计算功、电荷、质量', '统计学：概率分布的累积函数', '工程学：结构应力和变形', '计算机图形学：光照和渲染'],
      icon: '🔬',
    },
    'app-2': {
      title: '物理学应用',
      items: ['变力做功', '电场中的电势', '质心和转动惯量', '流体力学中的流量'],
      icon: '⚛️',
    },
    'app-3': {
      title: '统计学应用',
      items: ['正态分布的累积概率', '期望值计算', '方差和协方差', '贝叶斯推断'],
      icon: '📊',
    },
    'app-4': {
      title: '工程应用',
      items: ['结构分析', '热传导', '信号处理', '控制系统'],
      icon: '⚙️',
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
export default function NumericalIntegrationSceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('trapezoid')) {
      return <FormulaScene formulaType="trapezoid" />
    }
    if (sceneConfig.id.includes('simpson')) {
      return <FormulaScene formulaType="simpson" />
    }
    if (sceneConfig.id.includes('error')) {
      return <FormulaScene formulaType="error" />
    }
    return <FormulaScene formulaType="rectangle" />
  }

  // 根据 section 决定显示什么
  switch (sectionId) {
    case 'intro':
      // 引入部分显示基本的积分概念
      if (sceneConfig.id.includes('3') || sceneConfig.id.includes('4')) {
        return <RectangleRuleScene n={8} method="midpoint" />
      }
      return <RectangleRuleScene n={4} method="left" />

    case 'concept':
      // 概念部分展示分割动画
      if (sceneConfig.id.includes('2') || sceneConfig.id.includes('3')) {
        return <RectangleRuleScene n={16} method="midpoint" animate />
      }
      if (sceneConfig.id.includes('4')) {
        return <ComparisonScene n={8} />
      }
      return <RectangleRuleScene n={8} method="midpoint" />

    case 'rectangle':
      // 矩形法详细展示
      if (sceneConfig.id.includes('2')) {
        return <RectangleRuleScene n={8} method="left" />
      }
      if (sceneConfig.id.includes('3')) {
        return <RectangleRuleScene n={8} method="midpoint" />
      }
      if (sceneConfig.id.includes('4')) {
        return <ComparisonScene n={16} />
      }
      return <RectangleRuleScene n={8} method="midpoint" animate />

    case 'trapezoid':
      // 梯形法和辛普森法
      if (sceneConfig.id.includes('1') || sceneConfig.id.includes('2')) {
        return <TrapezoidRuleScene n={8} />
      }
      if (sceneConfig.id.includes('3')) {
        return <SimpsonRuleScene n={8} />
      }
      if (sceneConfig.id.includes('4')) {
        return <ComparisonScene n={16} />
      }
      return <TrapezoidRuleScene n={8} animate />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      // 总结部分
      if (sceneConfig.id.includes('2')) {
        return <ComparisonScene n={32} />
      }
      if (sceneConfig.id.includes('3')) {
        return <FormulaScene formulaType="error" />
      }
      return <SimpsonRuleScene n={16} />

    default:
      return <RectangleRuleScene n={8} method="midpoint" />
  }
}
