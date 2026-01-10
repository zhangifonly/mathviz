/**
 * 随机游走场景渲染器
 * 根据场景配置渲染 1D/2D 随机游走、分布演化等可视化
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '随机游走', subtitle: '探索随机过程的基础' },
    'sum-1': { title: '总结回顾', subtitle: '随机游走的核心思想' },
    'sum-4': { title: '感谢观看', subtitle: '探索随机之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '随机游走', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 1D 随机游走场景
function Walk1DScene({ numPaths = 10, steps = 100, animated = false }: { numPaths?: number; steps?: number; animated?: boolean }) {
  const [currentStep, setCurrentStep] = useState(animated ? 0 : steps)
  const prevAnimatedRef = useRef(animated)
  const prevStepsRef = useRef(steps)

  useEffect(() => {
    // 只在 animated 或 steps 变化时才更新
    if (animated !== prevAnimatedRef.current || steps !== prevStepsRef.current) {
      prevAnimatedRef.current = animated
      prevStepsRef.current = steps

      if (!animated) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentStep(steps)
        return
      }

      setCurrentStep(0)
      const timer = setInterval(() => {
        setCurrentStep(s => (s < steps ? s + 1 : s))
      }, 50)
      return () => clearInterval(timer)
    }
  }, [animated, steps])

  // 生成稳定的随机步骤种子（使用 useState 初始化函数）
  const [walkSeeds] = useState(() => {
    const seeds: number[][] = []
    for (let p = 0; p < numPaths; p++) {
      const pathSeed: number[] = []
      for (let i = 0; i < steps; i++) {
        pathSeed.push(Math.random())
      }
      seeds.push(pathSeed)
    }
    return seeds
  })

  const walkData = useMemo(() => {
    const paths: Array<{ x: number[]; y: number[] }> = []

    for (let p = 0; p < numPaths; p++) {
      const x: number[] = [0]
      const y: number[] = [0]
      let position = 0

      for (let i = 1; i <= (animated ? currentStep : steps); i++) {
        position += walkSeeds[p][i - 1] < 0.5 ? -1 : 1
        x.push(i)
        y.push(position)
      }

      paths.push({ x, y })
    }

    return paths
  }, [numPaths, steps, animated, currentStep, walkSeeds])

  const traces: Plotly.Data[] = walkData.map((path, i) => ({
    x: path.x,
    y: path.y,
    type: 'scatter',
    mode: 'lines',
    line: {
      color: `hsl(${(i * 360) / numPaths}, 70%, 60%)`,
      width: 1.5,
    },
    opacity: 0.7,
    showlegend: false,
  }))

  // 添加零线
  traces.push({
    x: [0, animated ? currentStep : steps],
    y: [0, 0],
    type: 'scatter',
    mode: 'lines',
    line: { color: 'rgba(255,255,255,0.3)', width: 1, dash: 'dash' },
    showlegend: false,
  } as Data)

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: '步数' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: '位置' },
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

// 2D 随机游走场景
function Walk2DScene({ numPaths = 5, steps = 200 }: { numPaths?: number; steps?: number }) {
  // 生成稳定的随机角度种子（使用 useState 初始化函数）
  const [angleSeeds] = useState(() => {
    const seeds: number[][] = []
    for (let p = 0; p < numPaths; p++) {
      const pathSeed: number[] = []
      for (let i = 0; i < steps; i++) {
        pathSeed.push(Math.random())
      }
      seeds.push(pathSeed)
    }
    return seeds
  })

  const walkData = useMemo(() => {
    const paths: Array<{ x: number[]; y: number[] }> = []

    for (let p = 0; p < numPaths; p++) {
      const x: number[] = [0]
      const y: number[] = [0]
      let posX = 0
      let posY = 0

      for (let i = 1; i <= steps; i++) {
        const angle = angleSeeds[p][i - 1] * 2 * Math.PI
        posX += Math.cos(angle)
        posY += Math.sin(angle)
        x.push(posX)
        y.push(posY)
      }

      paths.push({ x, y })
    }

    return paths
  }, [numPaths, steps, angleSeeds])

  const traces: Plotly.Data[] = walkData.map((path, i) => ({
    x: path.x,
    y: path.y,
    type: 'scatter',
    mode: 'lines+markers',
    line: {
      color: `hsl(${(i * 360) / numPaths}, 70%, 60%)`,
      width: 1.5,
    },
    marker: {
      size: 3,
      color: `hsl(${(i * 360) / numPaths}, 70%, 60%)`,
    },
    opacity: 0.7,
    showlegend: false,
  }))

  // 添加起点标记
  traces.push({
    x: [0],
    y: [0],
    type: 'scatter',
    mode: 'markers',
    marker: { size: 12, color: '#22c55e', symbol: 'circle' },
    name: '起点',
    showlegend: true,
  } as Data)

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
            title: { text: 'X 位置' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            scaleanchor: 'y',
            scaleratio: 1,
          },
          yaxis: {
            title: { text: 'Y 位置' },
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

// 分布演化场景
function DistributionScene({ steps = 100, numWalks = 1000 }: { steps?: number; numWalks?: number }) {
  const [currentStep, setCurrentStep] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(s => {
        if (s >= steps) return 10
        return s + 5
      })
    }, 200)
    return () => clearInterval(timer)
  }, [steps])

  // 生成稳定的随机步骤种子（使用 useState 初始化函数）
  const [walkSeeds] = useState(() => {
    const seeds: number[][] = []
    for (let w = 0; w < numWalks; w++) {
      const walkSeed: number[] = []
      for (let i = 0; i < steps; i++) {
        walkSeed.push(Math.random())
      }
      seeds.push(walkSeed)
    }
    return seeds
  })

  const distributionData = useMemo(() => {
    const positions: number[] = []

    for (let w = 0; w < numWalks; w++) {
      let position = 0
      for (let i = 0; i < currentStep; i++) {
        position += walkSeeds[w][i] < 0.5 ? -1 : 1
      }
      positions.push(position)
    }

    return positions
  }, [numWalks, currentStep, walkSeeds])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="text-white text-lg">
        步数: {currentStep} / {steps}
      </div>
      <Plot
        data={[
          {
            x: distributionData,
            type: 'histogram',
            marker: {
              color: '#8b5cf6',
              line: { color: '#a78bfa', width: 1 },
            },
            opacity: 0.8,
            nbinsx: 30,
          } as unknown as Plotly.PlotData,
        ]}
        layout={{
          autosize: true,
          height: 350,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: '位置' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: '频数' },
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

// 多轨迹对比场景（Canvas 实现）
function MultiPathCanvas({ numPaths = 20, steps = 150 }: { numPaths?: number; steps?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(s => (s < steps ? s + 1 : 0))
    }, 50)
    return () => clearInterval(timer)
  }, [steps])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    const maxY = Math.sqrt(currentStep) * 3
    const toCanvas = (step: number, position: number) => ({
      cx: padding + (step / steps) * (width - 2 * padding),
      cy: height / 2 - (position / maxY) * (height / 2 - padding),
    })

    // 绘制零线
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding, height / 2)
    ctx.lineTo(width - padding, height / 2)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制随机游走轨迹
    for (let p = 0; p < numPaths; p++) {
      const hue = (p * 360) / numPaths
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.6)`
      ctx.lineWidth = 1.5
      ctx.beginPath()

      let position = 0
      for (let i = 0; i <= currentStep; i++) {
        const { cx, cy } = toCanvas(i, position)
        if (i === 0) ctx.moveTo(cx, cy)
        else ctx.lineTo(cx, cy)

        if (i < currentStep) {
          position += Math.random() < 0.5 ? -1 : 1
        }
      }
      ctx.stroke()
    }

    // 坐标轴标签
    ctx.fillStyle = 'white'
    ctx.font = '12px sans-serif'
    ctx.fillText('0', padding - 15, height / 2 + 5)
    ctx.fillText('步数', width / 2, height - 10)
    ctx.fillText('位置', 5, height / 2)
  }, [numPaths, steps, currentStep])

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
    'expectation': {
      formula: 'E[X_n] = 0',
      description: '随机游走的期望位置始终是起点',
    },
    'variance': {
      formula: 'Var(X_n) = n',
      description: '位置的方差随步数线性增长',
    },
    'std': {
      formula: '\\sigma(X_n) = \\sqrt{n}',
      description: '典型偏离距离与步数的平方根成正比',
    },
    'diffusion': {
      formula: '\\langle r^2 \\rangle = 2Dt',
      description: '扩散定律：均方位移与时间成正比',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['expectation']

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
      title: '随机游走的应用',
      items: ['金融学：股票价格建模', '物理学：布朗运动', '生态学：动物觅食行为', '计算机科学：算法分析'],
      icon: '🎲',
    },
    'app-2': {
      title: '金融学应用',
      items: ['股票价格短期波动', '期权定价模型', '风险管理', '市场效率假说'],
      icon: '📈',
    },
    'app-3': {
      title: '物理学应用',
      items: ['布朗运动', '扩散过程', '热传导', '量子力学'],
      icon: '⚛️',
    },
    'app-4': {
      title: '生态学应用',
      items: ['动物觅食模式', '种群扩散', '疾病传播', '生态系统动态'],
      icon: '🦋',
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
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 醉汉问题可视化
function DrunkardScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)
  const maxSteps = 50

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < maxSteps ? s + 1 : 0))
    }, 200)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 8

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
    ctx.lineWidth = 1
    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 绘制起点（酒吧）
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('🍺 酒吧', centerX + 10, centerY - 10)

    // 绘制随机游走路径
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    ctx.beginPath()

    let x = 0, y = 0
    ctx.moveTo(centerX, centerY)

    for (let i = 0; i < step; i++) {
      const direction = Math.floor(Math.random() * 4)
      if (direction === 0) x++
      else if (direction === 1) x--
      else if (direction === 2) y++
      else y--

      ctx.lineTo(centerX + x * scale, centerY + y * scale)
    }
    ctx.stroke()

    // 绘制当前位置（醉汉）
    if (step > 0) {
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(centerX + x * scale, centerY + y * scale, 5, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.fillText('🚶', centerX + x * scale + 10, centerY + y * scale - 10)
    }

    // 显示步数和距离
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.fillText(`步数: ${step}`, 10, 25)
    ctx.fillText(`距离: ${Math.sqrt(x * x + y * y).toFixed(1)}`, 10, 50)
  }, [step])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 主渲染器
export default function RandomWalkSceneRenderer({ scene }: SceneRendererProps) {
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

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id === 'intro-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id === 'intro-2' || sceneConfig.id === 'intro-3') {
        return <DrunkardScene />
      }
      return <Walk1DScene numPaths={5} steps={100} />

    case 'concept':
      if (sceneConfig.id === 'concept-1') {
        return <FormulaScene formulaType="expectation" />
      }
      if (sceneConfig.id === 'concept-2') {
        return <Walk1DScene numPaths={1} steps={50} animated />
      }
      if (sceneConfig.id === 'concept-3') {
        return <Walk1DScene numPaths={10} steps={100} />
      }
      return <Walk1DScene numPaths={5} steps={100} />

    case 'simulation':
      if (sceneConfig.id === 'sim-1' || sceneConfig.id === 'sim-2') {
        return <MultiPathCanvas numPaths={20} steps={150} />
      }
      if (sceneConfig.id === 'sim-3') {
        return <Walk1DScene numPaths={15} steps={200} animated />
      }
      if (sceneConfig.id === 'sim-4') {
        return <DistributionScene steps={100} numWalks={1000} />
      }
      return <Walk1DScene numPaths={10} steps={100} />

    case 'statistics':
      if (sceneConfig.id === 'stat-1') {
        return <FormulaScene formulaType="expectation" />
      }
      if (sceneConfig.id === 'stat-2') {
        return <FormulaScene formulaType="variance" />
      }
      if (sceneConfig.id === 'stat-3') {
        return <FormulaScene formulaType="std" />
      }
      if (sceneConfig.id === 'stat-4') {
        return <FormulaScene formulaType="diffusion" />
      }
      return <DistributionScene steps={100} numWalks={1000} />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id === 'sum-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id === 'sum-2') {
        return <Walk2DScene numPaths={5} steps={200} />
      }
      if (sceneConfig.id === 'sum-3') {
        return <DistributionScene steps={100} numWalks={1000} />
      }
      if (sceneConfig.id === 'sum-4') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      return <Walk1DScene numPaths={10} steps={100} />

    default:
      return <Walk1DScene numPaths={10} steps={100} />
  }
}
