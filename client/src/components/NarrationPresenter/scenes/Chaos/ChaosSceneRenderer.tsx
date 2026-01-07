/**
 * 混沌理论场景渲染器
 * 根据场景配置渲染洛伦兹吸引子、分岔图等混沌可视化
 */

import { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '混沌理论', subtitle: '确定性系统中的不可预测性' },
    'summary-intro': { title: '总结回顾', subtitle: '混沌理论的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索混沌之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '混沌理论', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 洛伦兹吸引子场景
function LorenzScene({ animating = false }: { animating?: boolean }) {
  const lorenzData = useMemo(() => {
    const sigma = 10, rho = 28, beta = 8 / 3
    const dt = 0.01
    const steps = animating ? 3000 : 5000
    let x = 1, y = 1, z = 1
    const xs: number[] = [], ys: number[] = [], zs: number[] = []

    for (let i = 0; i < steps; i++) {
      xs.push(x)
      ys.push(y)
      zs.push(z)

      const dx = sigma * (y - x)
      const dy = x * (rho - z) - y
      const dz = x * y - beta * z

      x += dx * dt
      y += dy * dt
      z += dz * dt
    }

    return { x: xs, y: ys, z: zs }
  }, [animating])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={[
          {
            x: lorenzData.x,
            y: lorenzData.y,
            z: lorenzData.z,
            type: 'scatter3d',
            mode: 'lines',
            line: {
              color: lorenzData.z,
              colorscale: 'Viridis',
              width: 2
            },
          } as Data,
        ]}
        layout={{
          autosize: true,
          height: 450,
          margin: { t: 10, r: 10, b: 10, l: 10 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          scene: {
            xaxis: {
              title: { text: 'X' },
              gridcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
            },
            yaxis: {
              title: { text: 'Y' },
              gridcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
            },
            zaxis: {
              title: { text: 'Z' },
              gridcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
            },
            bgcolor: 'transparent',
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  )
}

// 分岔图场景
function BifurcationScene({ highlightR }: { highlightR?: number }) {
  const bifurcationData = useMemo(() => {
    const rValues: number[] = []
    const xValues: number[] = []

    for (let r = 2.5; r <= 4; r += 0.005) {
      let x = 0.5
      // 预迭代
      for (let i = 0; i < 200; i++) {
        x = r * x * (1 - x)
      }
      // 收集数据
      for (let i = 0; i < 100; i++) {
        x = r * x * (1 - x)
        rValues.push(r)
        xValues.push(x)
      }
    }

    return { r: rValues, x: xValues }
  }, [])

  const traces: Data[] = [
    {
      x: bifurcationData.r,
      y: bifurcationData.x,
      type: 'scattergl',
      mode: 'markers',
      marker: { size: 0.5, color: '#8b5cf6' },
    },
  ]

  if (highlightR) {
    traces.push({
      x: [highlightR, highlightR],
      y: [0, 1],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#ef4444', width: 2 },
      name: '当前 r',
    } as Data)
  }

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
            title: { text: 'r (参数)' },
            range: [2.5, 4],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: 'x (稳态值)' },
            range: [0, 1],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  )
}

// 敏感依赖性演示场景
function SensitivityScene() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % 200)
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const data = useMemo(() => {
    const sigma = 10, rho = 28, beta = 8 / 3
    const dt = 0.01
    const steps = frame * 5 + 10

    // 两条轨迹，初始值微小差异
    const path1 = { x: [1], y: [1], z: [1] }
    const path2 = { x: [1.001], y: [1], z: [1] }

    let x1 = 1, y1 = 1, z1 = 1
    let x2 = 1.001, y2 = 1, z2 = 1

    for (let i = 0; i < steps; i++) {
      const dx1 = sigma * (y1 - x1)
      const dy1 = x1 * (rho - z1) - y1
      const dz1 = x1 * y1 - beta * z1
      x1 += dx1 * dt
      y1 += dy1 * dt
      z1 += dz1 * dt
      path1.x.push(x1)
      path1.y.push(y1)
      path1.z.push(z1)

      const dx2 = sigma * (y2 - x2)
      const dy2 = x2 * (rho - z2) - y2
      const dz2 = x2 * y2 - beta * z2
      x2 += dx2 * dt
      y2 += dy2 * dt
      z2 += dz2 * dt
      path2.x.push(x2)
      path2.y.push(y2)
      path2.z.push(z2)
    }

    return { path1, path2 }
  }, [frame])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={[
          {
            x: data.path1.x,
            y: data.path1.y,
            z: data.path1.z,
            type: 'scatter3d',
            mode: 'lines',
            line: { color: '#3b82f6', width: 2 },
            name: '轨迹 1 (x₀=1)',
          } as Data,
          {
            x: data.path2.x,
            y: data.path2.y,
            z: data.path2.z,
            type: 'scatter3d',
            mode: 'lines',
            line: { color: '#ef4444', width: 2 },
            name: '轨迹 2 (x₀=1.001)',
          } as Data,
        ]}
        layout={{
          autosize: true,
          height: 450,
          margin: { t: 30, r: 10, b: 10, l: 10 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
          scene: {
            xaxis: { gridcolor: 'rgba(255,255,255,0.1)', color: 'white' },
            yaxis: { gridcolor: 'rgba(255,255,255,0.1)', color: 'white' },
            zaxis: { gridcolor: 'rgba(255,255,255,0.1)', color: 'white' },
            bgcolor: 'transparent',
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
    'logistic': {
      formula: 'x_{n+1} = rx_n(1-x_n)',
      description: 'Logistic 映射 - 最简单的混沌系统',
    },
    'lorenz': {
      formula: '\\begin{cases} \\dot{x} = \\sigma(y-x) \\\\ \\dot{y} = x(\\rho-z)-y \\\\ \\dot{z} = xy - \\beta z \\end{cases}',
      description: '洛伦兹方程组 - 经典气象模型',
    },
    'lyapunov': {
      formula: '\\delta(t) \\approx \\delta_0 e^{\\lambda t}',
      description: '李雅普诺夫指数 - 衡量混沌程度',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['logistic']

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
      title: '混沌理论的应用',
      items: ['气象学', '密码学', '生态学', '金融市场'],
      icon: '🌍',
    },
    'app-weather': {
      title: '气象学',
      items: ['天气预报的极限', '长期预测不可能', '蝴蝶效应的起源'],
      icon: '🌤️',
    },
    'app-crypto': {
      title: '密码学',
      items: ['混沌加密算法', '伪随机数生成', '安全通信'],
      icon: '🔐',
    },
    'app-ecology': {
      title: '生态学',
      items: ['种群动态', '生态平衡', '物种灭绝预测'],
      icon: '🦋',
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
export default function ChaosSceneRenderer({ scene }: SceneRendererProps) {
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
      if (sceneConfig.id.includes('weather') || sceneConfig.id.includes('chaos')) {
        return <LorenzScene />
      }
      if (sceneConfig.id.includes('deterministic')) {
        return <BifurcationScene />
      }
      return <LorenzScene />

    case 'concept':
      if (sceneConfig.id.includes('butterfly')) {
        return <SensitivityScene />
      }
      if (sceneConfig.id.includes('lorenz')) {
        return <LorenzScene animating />
      }
      if (sceneConfig.id.includes('viz')) {
        return <LorenzScene />
      }
      return <FormulaScene formulaType="logistic" />

    case 'visualization':
      if (sceneConfig.id.includes('butterfly-shape')) {
        return <LorenzScene />
      }
      if (sceneConfig.id.includes('trajectory') || sceneConfig.id.includes('essence')) {
        return <LorenzScene animating />
      }
      return <LorenzScene />

    case 'sensitivity':
      return <SensitivityScene />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('complexity')) {
        return <BifurcationScene />
      }
      if (sceneConfig.id.includes('insight')) {
        return <FormulaScene formulaType="lyapunov" />
      }
      return <LorenzScene />

    default:
      return <LorenzScene />
  }
}
