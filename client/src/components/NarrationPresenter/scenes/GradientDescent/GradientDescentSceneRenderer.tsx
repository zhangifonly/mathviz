/**
 * 梯度下降场景渲染器
 * 根据场景配置渲染 3D 损失函数曲面、梯度下降路径动画等可视化
 */

import { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '梯度下降', subtitle: '机器学习的核心优化算法' },
    'summary-intro': { title: '总结回顾', subtitle: '梯度下降的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索优化之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '梯度下降', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 3D 损失函数曲面场景
function SurfaceScene({ showPath = false, pathLength = 0 }: { showPath?: boolean; pathLength?: number }) {
  // 生成 3D 损失函数曲面数据（使用 Rosenbrock 函数）
  const surfaceData = useMemo(() => {
    const size = 50
    const range = 2
    const x: number[] = []
    const y: number[] = []
    const z: number[][] = []

    for (let i = 0; i < size; i++) {
      const row: number[] = []
      for (let j = 0; j < size; j++) {
        const xi = -range + (i / size) * 2 * range
        const yi = -range + (j / size) * 2 * range

        if (i === 0) y.push(yi)

        // Rosenbrock 函数: f(x,y) = (1-x)^2 + 100(y-x^2)^2
        const zi = Math.pow(1 - xi, 2) + 100 * Math.pow(yi - xi * xi, 2)
        row.push(Math.log(zi + 1)) // 使用对数缩放以便更好地可视化
      }
      x.push(-range + (i / size) * 2 * range)
      z.push(row)
    }

    return { x, y, z }
  }, [])

  // 生成梯度下降路径
  const pathData = useMemo(() => {
    if (!showPath) return null

    const learningRate = 0.001
    const maxSteps = Math.min(pathLength, 200)
    let x = -1.5
    let y = 1.5
    const pathX: number[] = [x]
    const pathY: number[] = [y]
    const pathZ: number[] = [Math.log(Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2) + 1)]

    for (let i = 0; i < maxSteps; i++) {
      // 计算梯度
      const gradX = -2 * (1 - x) - 400 * x * (y - x * x)
      const gradY = 200 * (y - x * x)

      // 更新位置
      x = x - learningRate * gradX
      y = y - learningRate * gradY

      pathX.push(x)
      pathY.push(y)
      const z = Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2)
      pathZ.push(Math.log(z + 1))
    }

    return { x: pathX, y: pathY, z: pathZ }
  }, [showPath, pathLength])

  const traces: Data[] = [
    {
      x: surfaceData.x,
      y: surfaceData.y,
      z: surfaceData.z,
      type: 'surface',
      colorscale: 'Viridis',
      showscale: false,
      opacity: 0.9,
    } as Data,
  ]

  if (pathData) {
    traces.push({
      x: pathData.x,
      y: pathData.y,
      z: pathData.z,
      type: 'scatter3d',
      mode: 'lines+markers',
      line: {
        color: '#ef4444',
        width: 4,
      },
      marker: {
        size: 3,
        color: '#ef4444',
      },
      name: '下降路径',
    } as Data)

    // 添加起点标记
    traces.push({
      x: [pathData.x[0]],
      y: [pathData.y[0]],
      z: [pathData.z[0]],
      type: 'scatter3d',
      mode: 'markers',
      marker: {
        size: 8,
        color: '#22c55e',
        symbol: 'circle',
      },
      name: '起点',
    } as Data)

    // 添加当前点标记
    if (pathData.x.length > 1) {
      const lastIdx = pathData.x.length - 1
      traces.push({
        x: [pathData.x[lastIdx]],
        y: [pathData.y[lastIdx]],
        z: [pathData.z[lastIdx]],
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          size: 8,
          color: '#f59e0b',
          symbol: 'circle',
        },
        name: '当前点',
      } as Data)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 500,
          margin: { t: 10, r: 10, b: 10, l: 10 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          scene: {
            xaxis: {
              title: { text: 'x' },
              gridcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
            },
            yaxis: {
              title: { text: 'y' },
              gridcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
            },
            zaxis: {
              title: { text: 'Loss' },
              gridcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
            },
            bgcolor: 'transparent',
            camera: {
              eye: { x: 1.5, y: 1.5, z: 1.3 },
            },
          },
          showlegend: showPath,
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

// 梯度下降路径动画场景
function DescentPathScene() {
  const [frame, setFrame] = useState(0)
  const maxFrames = 200

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f < maxFrames ? f + 1 : 0))
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return <SurfaceScene showPath={true} pathLength={frame} />
}

// 学习率对比场景
function LearningRateScene({ highlightRate }: { highlightRate?: 'small' | 'medium' | 'large' }) {
  const comparisonData = useMemo(() => {
    const rates = [
      { name: '学习率过小 (0.0001)', rate: 0.0001, color: '#3b82f6', maxSteps: 500 },
      { name: '学习率适中 (0.001)', rate: 0.001, color: '#22c55e', maxSteps: 200 },
      { name: '学习率过大 (0.01)', rate: 0.01, color: '#ef4444', maxSteps: 100 },
    ]

    return rates.map(({ name, rate, color, maxSteps }) => {
      let x = -1.5
      let y = 1.5
      const pathX: number[] = [x]
      const pathY: number[] = [y]
      const pathZ: number[] = [Math.log(Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2) + 1)]

      for (let i = 0; i < maxSteps; i++) {
        const gradX = -2 * (1 - x) - 400 * x * (y - x * x)
        const gradY = 200 * (y - x * x)

        x = x - rate * gradX
        y = y - rate * gradY

        // 防止发散
        if (Math.abs(x) > 10 || Math.abs(y) > 10) break

        pathX.push(x)
        pathY.push(y)
        const z = Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2)
        pathZ.push(Math.log(z + 1))
      }

      return { name, x: pathX, y: pathY, z: pathZ, color }
    })
  }, [])

  // 生成曲面数据
  const surfaceData = useMemo(() => {
    const size = 50
    const range = 2
    const x: number[] = []
    const y: number[] = []
    const z: number[][] = []

    for (let i = 0; i < size; i++) {
      const row: number[] = []
      for (let j = 0; j < size; j++) {
        const xi = -range + (i / size) * 2 * range
        const yi = -range + (j / size) * 2 * range

        if (i === 0) y.push(yi)

        const zi = Math.pow(1 - xi, 2) + 100 * Math.pow(yi - xi * xi, 2)
        row.push(Math.log(zi + 1))
      }
      x.push(-range + (i / size) * 2 * range)
      z.push(row)
    }

    return { x, y, z }
  }, [])

  const traces: Data[] = [
    {
      x: surfaceData.x,
      y: surfaceData.y,
      z: surfaceData.z,
      type: 'surface',
      colorscale: 'Viridis',
      showscale: false,
      opacity: 0.7,
    } as Data,
  ]

  comparisonData.forEach((path, idx) => {
    const isHighlighted =
      (highlightRate === 'small' && idx === 0) ||
      (highlightRate === 'medium' && idx === 1) ||
      (highlightRate === 'large' && idx === 2)

    traces.push({
      x: path.x,
      y: path.y,
      z: path.z,
      type: 'scatter3d',
      mode: 'lines+markers',
      line: {
        color: path.color,
        width: isHighlighted ? 6 : 3,
      },
      marker: {
        size: isHighlighted ? 4 : 2,
        color: path.color,
      },
      name: path.name,
    } as Data)
  })

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 500,
          margin: { t: 10, r: 10, b: 10, l: 10 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          scene: {
            xaxis: {
              title: { text: 'x' },
              gridcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
            },
            yaxis: {
              title: { text: 'y' },
              gridcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
            },
            zaxis: {
              title: { text: 'Loss' },
              gridcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
            },
            bgcolor: 'transparent',
            camera: {
              eye: { x: 1.5, y: 1.5, z: 1.3 },
            },
          },
          showlegend: true,
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
            x: 0.02,
            y: 0.98,
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
    'gradient': {
      formula: '\\nabla f(x) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x_1} \\\\ \\frac{\\partial f}{\\partial x_2} \\\\ \\vdots \\\\ \\frac{\\partial f}{\\partial x_n} \\end{bmatrix}',
      description: '梯度向量 - 指向函数增长最快的方向',
    },
    'update': {
      formula: 'x_{t+1} = x_t - \\alpha \\nabla f(x_t)',
      description: '梯度下降更新规则 - α 是学习率',
    },
    'learning-rate': {
      formula: '\\alpha \\in (0, 1)',
      description: '学习率 - 控制每步移动的距离',
    },
    'convergence': {
      formula: '\\lim_{t \\to \\infty} f(x_t) = f(x^*)',
      description: '收敛条件 - 函数值趋向最小值',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['gradient']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg text-center max-w-2xl">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-1': {
      title: '机器学习应用',
      items: ['神经网络训练', '线性回归', '逻辑回归', '支持向量机'],
      icon: '🤖',
    },
    'app-2': {
      title: '深度学习',
      items: ['反向传播算法', '参数优化', '损失函数最小化', '模型训练'],
      icon: '🧠',
    },
    'app-3': {
      title: '优化算法变体',
      items: ['随机梯度下降 (SGD)', 'Adam 优化器', 'RMSprop', 'Momentum'],
      icon: '⚡',
    },
    'app-4': {
      title: 'AI 革命',
      items: ['图像识别', '自然语言处理', '语音识别', '推荐系统'],
      icon: '🚀',
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
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 概念可视化场景（2D 等高线图）
function ConceptScene({ showGradient = false }: { showGradient?: boolean }) {
  const contourData = useMemo(() => {
    const size = 100
    const range = 2
    const x: number[] = []
    const y: number[] = []
    const z: number[][] = []

    for (let i = 0; i < size; i++) {
      const row: number[] = []
      for (let j = 0; j < size; j++) {
        const xi = -range + (i / size) * 2 * range
        const yi = -range + (j / size) * 2 * range

        if (i === 0) y.push(yi)

        // 简单的二次函数
        const zi = xi * xi + yi * yi
        row.push(zi)
      }
      x.push(-range + (i / size) * 2 * range)
      z.push(row)
    }

    return { x, y, z }
  }, [])

  const traces: Data[] = [
    {
      x: contourData.x,
      y: contourData.y,
      z: contourData.z,
      type: 'contour',
      colorscale: 'Viridis',
      showscale: false,
      contours: {
        coloring: 'heatmap',
      },
    } as Data,
  ]

  if (showGradient) {
    // 添加梯度向量场
    const arrowX: number[] = []
    const arrowY: number[] = []
    const arrowU: number[] = []
    const arrowV: number[] = []

    for (let i = -1.5; i <= 1.5; i += 0.3) {
      for (let j = -1.5; j <= 1.5; j += 0.3) {
        arrowX.push(i)
        arrowY.push(j)
        // 梯度: ∇f = (2x, 2y)
        const gradX = 2 * i
        const gradY = 2 * j
        const mag = Math.sqrt(gradX * gradX + gradY * gradY)
        // 归一化
        arrowU.push(-gradX / (mag + 0.1) * 0.15)
        arrowV.push(-gradY / (mag + 0.1) * 0.15)
      }
    }

    // 使用 scatter 模拟箭头
    for (let i = 0; i < arrowX.length; i++) {
      traces.push({
        x: [arrowX[i], arrowX[i] + arrowU[i]],
        y: [arrowY[i], arrowY[i] + arrowV[i]],
        type: 'scatter',
        mode: 'lines',
        line: {
          color: '#ef4444',
          width: 2,
        },
        showlegend: false,
      } as Data)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 450,
          margin: { t: 20, r: 30, b: 50, l: 60 },
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
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
    </div>
  )
}

// 主渲染器
export default function GradientDescentSceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('update')) {
      return <FormulaScene formulaType="update" />
    }
    if (sceneConfig.id.includes('learning-rate')) {
      return <FormulaScene formulaType="learning-rate" />
    }
    if (sceneConfig.id.includes('convergence')) {
      return <FormulaScene formulaType="convergence" />
    }
    return <FormulaScene formulaType="gradient" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('mountain') || sceneConfig.id.includes('valley')) {
        return <SurfaceScene />
      }
      if (sceneConfig.id.includes('slope')) {
        return <ConceptScene showGradient={true} />
      }
      return <SurfaceScene />

    case 'concept':
      if (sceneConfig.id.includes('vector') || sceneConfig.id.includes('gradient')) {
        return <ConceptScene showGradient={true} />
      }
      if (sceneConfig.id.includes('direction')) {
        return <FormulaScene formulaType="gradient" />
      }
      if (sceneConfig.id.includes('descent')) {
        return <FormulaScene formulaType="update" />
      }
      return <ConceptScene showGradient={true} />

    case 'algorithm':
      if (sceneConfig.id.includes('observe') || sceneConfig.id.includes('process')) {
        return <DescentPathScene />
      }
      if (sceneConfig.id.includes('position') || sceneConfig.id.includes('arrow')) {
        return <SurfaceScene showPath={true} pathLength={50} />
      }
      if (sceneConfig.id.includes('iterate')) {
        return <DescentPathScene />
      }
      return <DescentPathScene />

    case 'learning-rate':
      if (sceneConfig.id.includes('small') || sceneConfig.id.includes('slow')) {
        return <LearningRateScene highlightRate="small" />
      }
      if (sceneConfig.id.includes('large') || sceneConfig.id.includes('diverge')) {
        return <LearningRateScene highlightRate="large" />
      }
      if (sceneConfig.id.includes('appropriate') || sceneConfig.id.includes('key')) {
        return <LearningRateScene highlightRate="medium" />
      }
      return <LearningRateScene />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('simple') || sceneConfig.id.includes('powerful')) {
        return <SurfaceScene showPath={true} pathLength={200} />
      }
      if (sceneConfig.id.includes('learning-rate') || sceneConfig.id.includes('balance')) {
        return <LearningRateScene />
      }
      if (sceneConfig.id.includes('foundation')) {
        return <FormulaScene formulaType="update" />
      }
      return <SurfaceScene showPath={true} pathLength={200} />

    default:
      return <SurfaceScene />
  }
}
