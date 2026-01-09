/**
 * 优化场景渲染器
 * 渲染目标函数等高线图、优化路径动画、约束条件可视化
 */

import { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '优化理论', subtitle: '寻找最优解的数学方法' },
    'summary-intro': { title: '总结回顾', subtitle: '优化理论的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索优化之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '优化理论', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 等高线图场景
function ContourScene({
  functionType = 'quadratic',
  showPath = false
}: {
  functionType?: 'quadratic' | 'rosenbrock' | 'himmelblau'
  showPath?: boolean
}) {
  // 定义不同的目标函数
  const objectiveFunctions = {
    quadratic: (x: number, y: number) => x * x + y * y,
    rosenbrock: (x: number, y: number) => (1 - x) ** 2 + 100 * (y - x ** 2) ** 2,
    himmelblau: (x: number, y: number) => (x ** 2 + y - 11) ** 2 + (x + y ** 2 - 7) ** 2,
  }

  const func = objectiveFunctions[functionType]

  // 生成等高线数据
  const contourData = useMemo(() => {
    const range = functionType === 'quadratic' ? 5 : functionType === 'rosenbrock' ? 2 : 5
    const resolution = 100
    const step = (2 * range) / resolution

    const x: number[] = []
    const y: number[] = []
    const z: number[][] = []

    for (let i = 0; i <= resolution; i++) {
      const row: number[] = []
      for (let j = 0; j <= resolution; j++) {
        const xi = -range + i * step
        const yj = -range + j * step
        if (i === 0) x.push(xi)
        if (j === 0) y.push(yj)
        row.push(func(xi, yj))
      }
      z.push(row)
    }

    return { x, y, z }
  }, [functionType, func])

  // 生成优化路径（梯度下降）
  const pathData = useMemo(() => {
    if (!showPath) return null

    const learningRate = functionType === 'quadratic' ? 0.1 : functionType === 'rosenbrock' ? 0.001 : 0.01
    const steps = functionType === 'rosenbrock' ? 1000 : 50

    let x = functionType === 'quadratic' ? 4 : functionType === 'rosenbrock' ? -1.5 : 3
    let y = functionType === 'quadratic' ? 4 : functionType === 'rosenbrock' ? 2.5 : 3

    const pathX: number[] = [x]
    const pathY: number[] = [y]
    const pathZ: number[] = [func(x, y)]

    // 梯度下降迭代
    for (let i = 0; i < steps; i++) {
      const epsilon = 0.0001
      const gradX = (func(x + epsilon, y) - func(x - epsilon, y)) / (2 * epsilon)
      const gradY = (func(x, y + epsilon) - func(x, y - epsilon)) / (2 * epsilon)

      x -= learningRate * gradX
      y -= learningRate * gradY

      pathX.push(x)
      pathY.push(y)
      pathZ.push(func(x, y))
    }

    return { x: pathX, y: pathY, z: pathZ }
  }, [showPath, functionType, func])

  const traces: Data[] = [
    {
      x: contourData.x,
      y: contourData.y,
      z: contourData.z,
      type: 'contour',
      colorscale: 'Viridis',
      contours: {
        coloring: 'heatmap',
      },
      colorbar: {
        title: { text: 'f(x,y)', font: { color: 'white' } },
        tickfont: { color: 'white' },
      },
    },
  ]

  if (pathData) {
    traces.push({
      x: pathData.x,
      y: pathData.y,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#ef4444', width: 3 },
      marker: {
        size: 6,
        color: '#ef4444',
        symbol: 'circle',
      },
      name: '优化路径',
    } as Data)

    // 添加起点和终点标记
    traces.push({
      x: [pathData.x[0]],
      y: [pathData.y[0]],
      type: 'scatter',
      mode: 'markers',
      marker: { size: 12, color: '#22c55e', symbol: 'star' },
      name: '起点',
    } as Data)

    traces.push({
      x: [pathData.x[pathData.x.length - 1]],
      y: [pathData.y[pathData.y.length - 1]],
      type: 'scatter',
      mode: 'markers',
      marker: { size: 12, color: '#3b82f6', symbol: 'star' },
      name: '终点',
    } as Data)
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 500,
          margin: { t: 20, r: 80, b: 50, l: 60 },
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
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
    </div>
  )
}

// 优化路径动画场景
function OptimizationPathScene({
  functionType = 'quadratic',
  animate = true
}: {
  functionType?: 'quadratic' | 'rosenbrock' | 'himmelblau'
  animate?: boolean
}) {
  const [frame, setFrame] = useState(0)

  const objectiveFunctions = {
    quadratic: (x: number, y: number) => x * x + y * y,
    rosenbrock: (x: number, y: number) => (1 - x) ** 2 + 100 * (y - x ** 2) ** 2,
    himmelblau: (x: number, y: number) => (x ** 2 + y - 11) ** 2 + (x + y ** 2 - 7) ** 2,
  }

  const func = objectiveFunctions[functionType]

  // 动画控制
  useEffect(() => {
    if (!animate) return

    const timer = setInterval(() => {
      setFrame(f => (f + 1) % 100)
    }, 100)

    return () => clearInterval(timer)
  }, [animate])

  // 生成完整路径
  const fullPath = useMemo(() => {
    const learningRate = functionType === 'quadratic' ? 0.1 : functionType === 'rosenbrock' ? 0.001 : 0.01
    const steps = functionType === 'rosenbrock' ? 1000 : 50

    let x = functionType === 'quadratic' ? 4 : functionType === 'rosenbrock' ? -1.5 : 3
    let y = functionType === 'quadratic' ? 4 : functionType === 'rosenbrock' ? 2.5 : 3

    const pathX: number[] = [x]
    const pathY: number[] = [y]
    const pathZ: number[] = [func(x, y)]

    for (let i = 0; i < steps; i++) {
      const epsilon = 0.0001
      const gradX = (func(x + epsilon, y) - func(x - epsilon, y)) / (2 * epsilon)
      const gradY = (func(x, y + epsilon) - func(x, y - epsilon)) / (2 * epsilon)

      x -= learningRate * gradX
      y -= learningRate * gradY

      pathX.push(x)
      pathY.push(y)
      pathZ.push(func(x, y))
    }

    return { x: pathX, y: pathY, z: pathZ }
  }, [functionType, func])

  // 当前显示的路径（根据动画帧）
  const currentPath = useMemo(() => {
    const maxIndex = Math.floor((frame / 100) * fullPath.x.length)
    return {
      x: fullPath.x.slice(0, maxIndex + 1),
      y: fullPath.y.slice(0, maxIndex + 1),
      z: fullPath.z.slice(0, maxIndex + 1),
    }
  }, [frame, fullPath])

  // 生成等高线数据
  const contourData = useMemo(() => {
    const range = functionType === 'quadratic' ? 5 : functionType === 'rosenbrock' ? 2 : 5
    const resolution = 100
    const step = (2 * range) / resolution

    const x: number[] = []
    const y: number[] = []
    const z: number[][] = []

    for (let i = 0; i <= resolution; i++) {
      const row: number[] = []
      for (let j = 0; j <= resolution; j++) {
        const xi = -range + i * step
        const yj = -range + j * step
        if (i === 0) x.push(xi)
        if (j === 0) y.push(yj)
        row.push(func(xi, yj))
      }
      z.push(row)
    }

    return { x, y, z }
  }, [functionType, func])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={[
          {
            x: contourData.x,
            y: contourData.y,
            z: contourData.z,
            type: 'contour',
            colorscale: 'Viridis',
            contours: {
              coloring: 'heatmap',
            },
            colorbar: {
              title: { text: 'f(x,y)', font: { color: 'white' } },
              tickfont: { color: 'white' },
            },
          },
          {
            x: currentPath.x,
            y: currentPath.y,
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#ef4444', width: 3 },
            marker: { size: 6, color: '#ef4444' },
            name: '优化路径',
          } as Data,
          {
            x: currentPath.x.length > 0 ? [currentPath.x[currentPath.x.length - 1]] : [],
            y: currentPath.y.length > 0 ? [currentPath.y[currentPath.y.length - 1]] : [],
            type: 'scatter',
            mode: 'markers',
            marker: { size: 15, color: '#22c55e', symbol: 'circle' },
            name: '当前位置',
          } as Data,
        ]}
        layout={{
          autosize: true,
          height: 500,
          margin: { t: 20, r: 80, b: 50, l: 60 },
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
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
    </div>
  )
}

// 约束条件场景
function ConstraintScene({
  showFeasibleRegion = true
}: {
  showFeasibleRegion?: boolean
}) {
  // 生成等高线数据（简单二次函数）
  const contourData = useMemo(() => {
    const range = 5
    const resolution = 100
    const step = (2 * range) / resolution

    const x: number[] = []
    const y: number[] = []
    const z: number[][] = []

    for (let i = 0; i <= resolution; i++) {
      const row: number[] = []
      for (let j = 0; j <= resolution; j++) {
        const xi = -range + i * step
        const yj = -range + j * step
        if (i === 0) x.push(xi)
        if (j === 0) y.push(yj)
        row.push(xi * xi + yj * yj)
      }
      z.push(row)
    }

    return { x, y, z }
  }, [])

  // 约束条件：x + y <= 3, x >= 0, y >= 0
  const constraintData = useMemo(() => {
    if (!showFeasibleRegion) return null

    // 可行域的边界
    const boundaryX = [0, 3, 0, 0]
    const boundaryY = [0, 0, 3, 0]

    return { x: boundaryX, y: boundaryY }
  }, [showFeasibleRegion])

  const traces: Data[] = [
    {
      x: contourData.x,
      y: contourData.y,
      z: contourData.z,
      type: 'contour',
      colorscale: 'Viridis',
      contours: {
        coloring: 'heatmap',
      },
      colorbar: {
        title: { text: 'f(x,y)', font: { color: 'white' } },
        tickfont: { color: 'white' },
      },
    } as Data,
  ]

  if (constraintData) {
    // 可行域填充
    traces.push({
      x: constraintData.x,
      y: constraintData.y,
      type: 'scatter',
      mode: 'lines',
      fill: 'toself',
      fillcolor: 'rgba(34, 197, 94, 0.3)',
      line: { color: '#22c55e', width: 3 },
      name: '可行域',
    } as Data)

    // 约束线
    traces.push({
      x: [0, 3],
      y: [3, 0],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#ef4444', width: 2, dash: 'dash' },
      name: 'x + y = 3',
    } as Data)
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 500,
          margin: { t: 20, r: 80, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [-1, 5],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: 'y' },
            range: [-1, 5],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
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
    'gradient-descent': {
      formula: 'x_{k+1} = x_k - \\alpha \\nabla f(x_k)',
      description: '梯度下降法 - 沿负梯度方向迭代',
    },
    'lagrange': {
      formula: '\\mathcal{L}(x, \\lambda) = f(x) + \\sum_{i=1}^m \\lambda_i g_i(x)',
      description: '拉格朗日乘数法 - 处理约束优化问题',
    },
    'kkt': {
      formula: '\\begin{cases} \\nabla f(x^*) + \\sum_{i=1}^m \\lambda_i \\nabla g_i(x^*) = 0 \\\\ g_i(x^*) \\leq 0 \\\\ \\lambda_i \\geq 0 \\\\ \\lambda_i g_i(x^*) = 0 \\end{cases}',
      description: 'KKT 条件 - 最优性必要条件',
    },
    'newton': {
      formula: 'x_{k+1} = x_k - [\\nabla^2 f(x_k)]^{-1} \\nabla f(x_k)',
      description: '牛顿法 - 使用二阶导数信息',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['gradient-descent']

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
    'app-intro': {
      title: '优化理论的应用',
      items: ['机器学习', '运筹学', '工程设计', '金融投资'],
      icon: '🎯',
    },
    'app-ml': {
      title: '机器学习',
      items: ['神经网络训练', '参数调优', '损失函数最小化', '模型优化'],
      icon: '🤖',
    },
    'app-operations': {
      title: '运筹学',
      items: ['资源分配', '生产调度', '物流优化', '供应链管理'],
      icon: '📊',
    },
    'app-engineering': {
      title: '工程设计',
      items: ['结构优化', '电路设计', '控制系统', '能源管理'],
      icon: '⚙️',
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
export default function OptimizationSceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('lagrange')) {
      return <FormulaScene formulaType="lagrange" />
    }
    if (sceneConfig.id.includes('kkt')) {
      return <FormulaScene formulaType="kkt" />
    }
    if (sceneConfig.id.includes('newton')) {
      return <FormulaScene formulaType="newton" />
    }
    return <FormulaScene formulaType="gradient-descent" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('contour') || sceneConfig.id.includes('landscape')) {
        return <ContourScene functionType="quadratic" />
      }
      if (sceneConfig.id.includes('path')) {
        return <ContourScene functionType="quadratic" showPath />
      }
      return <ContourScene functionType="quadratic" />

    case 'concept':
      if (sceneConfig.id.includes('gradient')) {
        return <OptimizationPathScene functionType="quadratic" animate />
      }
      if (sceneConfig.id.includes('contour')) {
        return <ContourScene functionType="quadratic" />
      }
      return <FormulaScene formulaType="gradient-descent" />

    case 'unconstrained':
      if (sceneConfig.id.includes('rosenbrock')) {
        return <ContourScene functionType="rosenbrock" showPath />
      }
      if (sceneConfig.id.includes('himmelblau')) {
        return <ContourScene functionType="himmelblau" showPath />
      }
      if (sceneConfig.id.includes('animate')) {
        return <OptimizationPathScene functionType="quadratic" animate />
      }
      return <ContourScene functionType="quadratic" showPath />

    case 'constrained':
      if (sceneConfig.id.includes('constraint')) {
        return <ConstraintScene showFeasibleRegion />
      }
      if (sceneConfig.id.includes('lagrange')) {
        return <FormulaScene formulaType="lagrange" />
      }
      if (sceneConfig.id.includes('kkt')) {
        return <FormulaScene formulaType="kkt" />
      }
      return <ConstraintScene showFeasibleRegion />

    case 'methods':
      if (sceneConfig.id.includes('gradient')) {
        return <OptimizationPathScene functionType="quadratic" animate />
      }
      if (sceneConfig.id.includes('newton')) {
        return <FormulaScene formulaType="newton" />
      }
      return <ContourScene functionType="quadratic" showPath />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('path')) {
        return <OptimizationPathScene functionType="rosenbrock" animate />
      }
      if (sceneConfig.id.includes('constraint')) {
        return <ConstraintScene showFeasibleRegion />
      }
      return <ContourScene functionType="quadratic" showPath />

    default:
      return <ContourScene functionType="quadratic" />
  }
}
