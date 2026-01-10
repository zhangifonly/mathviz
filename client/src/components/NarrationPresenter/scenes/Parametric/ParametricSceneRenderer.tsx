/**
 * 参数方程场景渲染器
 * 渲染利萨如图形、摆线、参数曲线等参数方程可视化
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '参数方程', subtitle: '用参数描述曲线的运动' },
    'summary-intro': { title: '总结回顾', subtitle: '参数方程的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索参数之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '参数方程', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 利萨如图形场景
function LissajousScene({
  a = 3,
  b = 4,
  delta = Math.PI / 2,
  animate = false
}: {
  a?: number
  b?: number
  delta?: number
  animate?: boolean
}) {
  const [currentDelta, setCurrentDelta] = useState(delta)

  // 参数动画
  useEffect(() => {
    if (!animate) {
      setCurrentDelta(delta)
      return
    }

    const timer = setInterval(() => {
      setCurrentDelta(d => (d + 0.05) % (2 * Math.PI))
    }, 50)
    return () => clearInterval(timer)
  }, [animate, delta])

  const lissajousData = useMemo(() => {
    const t: number[] = []
    const x: number[] = []
    const y: number[] = []
    const steps = 1000

    for (let i = 0; i <= steps; i++) {
      const tVal = (i / steps) * 2 * Math.PI
      t.push(tVal)
      x.push(Math.sin(a * tVal + currentDelta))
      y.push(Math.sin(b * tVal))
    }

    return { t, x, y }
  }, [a, b, currentDelta])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: lissajousData.x,
            y: lissajousData.y,
            type: 'scatter',
            mode: 'lines',
            line: {
              color: '#8b5cf6',
              width: 2,
            },
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x = sin(at + δ)' },
            range: [-1.2, 1.2],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'y = sin(bt)' },
            range: [-1.2, 1.2],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
      <p className="text-white/60 text-sm font-mono">
        a = {a}, b = {b}, δ = {currentDelta.toFixed(2)}
      </p>
    </div>
  )
}

// 摆线场景
function CycloidScene({
  radius = 1,
  animate = false,
  type = 'cycloid'
}: {
  radius?: number
  animate?: boolean
  type?: 'cycloid' | 'epicycloid' | 'hypocycloid'
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(0)

  useEffect(() => {
    if (!animate) return

    const timer = setInterval(() => {
      setT(prevT => (prevT + 0.05) % (4 * Math.PI))
    }, 50)
    return () => clearInterval(timer)
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2
    const scale = 50

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制地面线
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY + radius * scale)
    ctx.lineTo(width, centerY + radius * scale)
    ctx.stroke()

    // 绘制摆线轨迹
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()

    const steps = Math.min(t * 50, 400)
    for (let i = 0; i <= steps; i++) {
      const theta = (i / 50)
      let x, y

      if (type === 'cycloid') {
        x = radius * (theta - Math.sin(theta))
        y = radius * (1 - Math.cos(theta))
      } else if (type === 'epicycloid') {
        const k = 3
        x = radius * ((k + 1) * Math.cos(theta) - Math.cos((k + 1) * theta))
        y = radius * ((k + 1) * Math.sin(theta) - Math.sin((k + 1) * theta))
      } else {
        const k = 3
        x = radius * ((k - 1) * Math.cos(theta) + Math.cos((k - 1) * theta))
        y = radius * ((k - 1) * Math.sin(theta) - Math.sin((k - 1) * theta))
      }

      const px = 50 + x * scale
      const py = centerY + radius * scale - y * scale

      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    // 绘制滚动的圆
    if (animate && t > 0) {
      let cx, cy
      if (type === 'cycloid') {
        cx = 50 + radius * t * scale
        cy = centerY + radius * scale - radius * scale
      } else if (type === 'epicycloid') {
        const k = 3
        cx = 50 + radius * ((k + 1) * Math.cos(t) - Math.cos((k + 1) * t)) * scale
        cy = centerY + radius * scale - radius * ((k + 1) * Math.sin(t) - Math.sin((k + 1) * t)) * scale
      } else {
        const k = 3
        cx = 50 + radius * ((k - 1) * Math.cos(t) + Math.cos((k - 1) * t)) * scale
        cy = centerY + radius * scale - radius * ((k - 1) * Math.sin(t) - Math.sin((k - 1) * t)) * scale
      }

      // 圆
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx, cy, radius * scale, 0, 2 * Math.PI)
      ctx.stroke()

      // 追踪点
      let px, py
      if (type === 'cycloid') {
        px = 50 + radius * (t - Math.sin(t)) * scale
        py = centerY + radius * scale - radius * (1 - Math.cos(t)) * scale
      } else if (type === 'epicycloid') {
        const k = 3
        px = 50 + radius * ((k + 1) * Math.cos(t) - Math.cos((k + 1) * t)) * scale
        py = centerY + radius * scale - radius * ((k + 1) * Math.sin(t) - Math.sin((k + 1) * t)) * scale
      } else {
        const k = 3
        px = 50 + radius * ((k - 1) * Math.cos(t) + Math.cos((k - 1) * t)) * scale
        py = centerY + radius * scale - radius * ((k - 1) * Math.sin(t) - Math.sin((k - 1) * t)) * scale
      }

      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(px, py, 4, 0, 2 * Math.PI)
      ctx.fill()

      // 连接线
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(px, py)
      ctx.stroke()
    }

    // 标题
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    const typeNames = {
      cycloid: '摆线 (Cycloid)',
      epicycloid: '外摆线 (Epicycloid)',
      hypocycloid: '内摆线 (Hypocycloid)',
    }
    ctx.fillText(typeNames[type], 20, 30)
  }, [t, radius, animate, type])

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

// 参数变化动画场景
function ParameterAnimationScene({
  curveType = 'circle'
}: {
  curveType?: 'circle' | 'ellipse' | 'spiral' | 'rose'
}) {
  const [param, setParam] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setParam(p => (p + 0.02) % (2 * Math.PI))
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const curveData = useMemo(() => {
    const t: number[] = []
    const x: number[] = []
    const y: number[] = []
    const steps = 1000

    for (let i = 0; i <= steps; i++) {
      const tVal = (i / steps) * 2 * Math.PI
      t.push(tVal)

      switch (curveType) {
        case 'circle': {
          x.push(Math.cos(tVal))
          y.push(Math.sin(tVal))
          break
        }
        case 'ellipse': {
          x.push(2 * Math.cos(tVal))
          y.push(Math.sin(tVal))
          break
        }
        case 'spiral': {
          const r = tVal / (2 * Math.PI)
          x.push(r * Math.cos(tVal))
          y.push(r * Math.sin(tVal))
          break
        }
        case 'rose': {
          const k = 3 + Math.sin(param)
          const rRose = Math.cos(k * tVal)
          x.push(rRose * Math.cos(tVal))
          y.push(rRose * Math.sin(tVal))
          break
        }
      }
    }

    // 当前点
    const currentX = x[Math.floor((param / (2 * Math.PI)) * steps)]
    const currentY = y[Math.floor((param / (2 * Math.PI)) * steps)]

    return { t, x, y, currentX, currentY }
  }, [curveType, param])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={[
          {
            x: curveData.x,
            y: curveData.y,
            type: 'scatter',
            mode: 'lines',
            line: {
              color: '#8b5cf6',
              width: 2,
            },
            name: '曲线',
          },
          {
            x: [curveData.currentX],
            y: [curveData.currentY],
            type: 'scatter',
            mode: 'markers',
            marker: {
              color: '#ef4444',
              size: 10,
            },
            name: '当前点',
          },
        ]}
        layout={{
          autosize: true,
          height: 450,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x(t)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'y(t)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
            scaleanchor: 'x',
            scaleratio: 1,
          },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
    </div>
  )
}

// 3D 参数曲线场景
function Parametric3DScene({
  curveType = 'helix'
}: {
  curveType?: 'helix' | 'torus' | 'trefoil'
}) {
  const curveData = useMemo(() => {
    const t: number[] = []
    const x: number[] = []
    const y: number[] = []
    const z: number[] = []
    const steps = 1000

    for (let i = 0; i <= steps; i++) {
      const tVal = (i / steps) * 4 * Math.PI
      t.push(tVal)

      switch (curveType) {
        case 'helix': {
          x.push(Math.cos(tVal))
          y.push(Math.sin(tVal))
          z.push(tVal / (2 * Math.PI))
          break
        }
        case 'torus': {
          const R = 2
          const r = 1
          x.push((R + r * Math.cos(3 * tVal)) * Math.cos(tVal))
          y.push((R + r * Math.cos(3 * tVal)) * Math.sin(tVal))
          z.push(r * Math.sin(3 * tVal))
          break
        }
        case 'trefoil': {
          x.push(Math.sin(tVal) + 2 * Math.sin(2 * tVal))
          y.push(Math.cos(tVal) - 2 * Math.cos(2 * tVal))
          z.push(-Math.sin(3 * tVal))
          break
        }
      }
    }

    return { t, x, y, z }
  }, [curveType])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={[
          {
            x: curveData.x,
            y: curveData.y,
            z: curveData.z,
            type: 'scatter3d' as const,
            mode: 'lines',
            line: {
              color: curveData.z,
              width: 3,
            },
            marker: {
              color: curveData.z,
              colorscale: 'Viridis' as const,
            },
          },
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
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'parametric': {
      formula: '\\begin{cases} x = f(t) \\\\ y = g(t) \\end{cases}',
      description: '参数方程的一般形式',
    },
    'circle': {
      formula: '\\begin{cases} x = r\\cos(t) \\\\ y = r\\sin(t) \\end{cases}',
      description: '圆的参数方程',
    },
    'cycloid': {
      formula: '\\begin{cases} x = r(t - \\sin t) \\\\ y = r(1 - \\cos t) \\end{cases}',
      description: '摆线的参数方程',
    },
    'lissajous': {
      formula: '\\begin{cases} x = A\\sin(at + \\delta) \\\\ y = B\\sin(bt) \\end{cases}',
      description: '利萨如曲线的参数方程',
    },
    'helix': {
      formula: '\\begin{cases} x = r\\cos(t) \\\\ y = r\\sin(t) \\\\ z = ct \\end{cases}',
      description: '螺旋线的参数方程',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['parametric']

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
      title: '参数方程的应用',
      items: ['机械运动轨迹', '计算机图形学', '物理学建模', '动画制作'],
      icon: '🎨',
    },
    'app-mechanics': {
      title: '机械运动',
      items: ['齿轮传动', '连杆机构', '凸轮设计', '机器人路径规划'],
      icon: '⚙️',
    },
    'app-graphics': {
      title: '计算机图形学',
      items: ['曲线绘制', '动画路径', '字体设计', '3D 建模'],
      icon: '🖥️',
    },
    'app-physics': {
      title: '物理学',
      items: ['抛体运动', '行星轨道', '波动传播', '粒子轨迹'],
      icon: '🌌',
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
export default function ParametricSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig, lineState } = scene

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
    if (sceneConfig.id.includes('circle')) {
      return <FormulaScene formulaType="circle" />
    }
    if (sceneConfig.id.includes('cycloid')) {
      return <FormulaScene formulaType="cycloid" />
    }
    if (sceneConfig.id.includes('lissajous')) {
      return <FormulaScene formulaType="lissajous" />
    }
    if (sceneConfig.id.includes('helix')) {
      return <FormulaScene formulaType="helix" />
    }
    return <FormulaScene formulaType="parametric" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('circle') || sceneConfig.id.includes('basic')) {
        return <ParameterAnimationScene curveType="circle" />
      }
      if (sceneConfig.id.includes('motion')) {
        return <CycloidScene animate />
      }
      return <LissajousScene a={1} b={1} />

    case 'concept':
      if (sceneConfig.id.includes('parameter')) {
        return <FormulaScene formulaType="parametric" />
      }
      if (sceneConfig.id.includes('circle')) {
        return <ParameterAnimationScene curveType="circle" />
      }
      if (sceneConfig.id.includes('ellipse')) {
        return <ParameterAnimationScene curveType="ellipse" />
      }
      return <FormulaScene formulaType="circle" />

    case 'lissajous': {
      const a = (lineState?.params?.a as number) || 3
      const b = (lineState?.params?.b as number) || 4
      const delta = (lineState?.params?.delta as number) || Math.PI / 2
      const animate = lineState?.params?.animate as boolean || false

      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="lissajous" />
      }
      return <LissajousScene a={a} b={b} delta={delta} animate={animate} />
    }

    case 'cycloid': {
      const cycloidType = (lineState?.params?.type as 'cycloid' | 'epicycloid' | 'hypocycloid') || 'cycloid'
      const cycloidAnimate = lineState?.params?.animate as boolean || false

      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="cycloid" />
      }
      if (sceneConfig.id.includes('epicycloid')) {
        return <CycloidScene type="epicycloid" animate={cycloidAnimate} />
      }
      if (sceneConfig.id.includes('hypocycloid')) {
        return <CycloidScene type="hypocycloid" animate={cycloidAnimate} />
      }
      return <CycloidScene type={cycloidType} animate={cycloidAnimate} />
    }

    case '3d':
      if (sceneConfig.id.includes('helix')) {
        return <Parametric3DScene curveType="helix" />
      }
      if (sceneConfig.id.includes('torus')) {
        return <Parametric3DScene curveType="torus" />
      }
      if (sceneConfig.id.includes('trefoil')) {
        return <Parametric3DScene curveType="trefoil" />
      }
      return <Parametric3DScene curveType="helix" />

    case 'animation': {
      const animCurveType = (lineState?.params?.curveType as 'circle' | 'ellipse' | 'spiral' | 'rose') || 'circle'
      return <ParameterAnimationScene curveType={animCurveType} />
    }

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('lissajous')) {
        return <LissajousScene a={3} b={4} animate />
      }
      if (sceneConfig.id.includes('cycloid')) {
        return <CycloidScene animate />
      }
      if (sceneConfig.id.includes('3d')) {
        return <Parametric3DScene curveType="trefoil" />
      }
      return <LissajousScene a={5} b={4} animate />

    default:
      return <LissajousScene a={3} b={4} />
  }
}
