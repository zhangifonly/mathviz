/**
 * 圆锥曲线场景渲染器
 * 根据场景配置渲染椭圆、双曲线、抛物线等圆锥曲线可视化
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '圆锥曲线', subtitle: '探索椭圆、双曲线和抛物线' },
    'summary-1': { title: '总结回顾', subtitle: '圆锥曲线的核心思想' },
    'summary-5': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '圆锥曲线', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 圆锥切割场景
function ConeCuttingScene({ sceneId }: { sceneId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    // 根据场景ID设置不同的切割角度
    const angles: Record<string, number> = {
      'cone-cutting-1': 0,
      'cone-cutting-2': 15,
      'cone-cutting-3': 30,
      'cone-cutting-4': 60,
    }
    setAngle(angles[sceneId] || 0)
  }, [sceneId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制双圆锥
    const centerX = width / 2
    const centerY = height / 2
    const coneHeight = 150
    const coneRadius = 100

    // 上圆锥
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - coneHeight)
    ctx.lineTo(centerX - coneRadius, centerY)
    ctx.lineTo(centerX + coneRadius, centerY)
    ctx.closePath()
    ctx.stroke()

    // 下圆锥
    ctx.beginPath()
    ctx.moveTo(centerX, centerY + coneHeight)
    ctx.lineTo(centerX - coneRadius, centerY)
    ctx.lineTo(centerX + coneRadius, centerY)
    ctx.closePath()
    ctx.stroke()

    // 绘制切割平面
    if (angle > 0) {
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      const rad = (angle * Math.PI) / 180
      const offset = 80 * Math.tan(rad)
      ctx.moveTo(centerX - 120, centerY - offset)
      ctx.lineTo(centerX + 120, centerY + offset)
      ctx.stroke()

      // 显示角度
      ctx.fillStyle = 'white'
      ctx.font = '16px sans-serif'
      ctx.fillText(`切割角度: ${angle}°`, 20, 30)
    }
  }, [angle])

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

// 椭圆场景
function EllipseScene({ interactive = false }: { interactive?: boolean }) {
  const [a] = useState(5)
  const [b] = useState(3)
  const [pointAngle, setPointAngle] = useState(0)

  useEffect(() => {
    if (!interactive) return
    const timer = setInterval(() => {
      setPointAngle(angle => (angle + 0.02) % (2 * Math.PI))
    }, 50)
    return () => clearInterval(timer)
  }, [interactive])

  const ellipseData = useMemo(() => {
    const theta = Array.from({ length: 200 }, (_, i) => (i * 2 * Math.PI) / 199)
    const x = theta.map(t => a * Math.cos(t))
    const y = theta.map(t => b * Math.sin(t))
    return { x, y }
  }, [a, b])

  const c = Math.sqrt(Math.max(0, a * a - b * b))
  const eccentricity = a > 0 ? c / a : 0

  // 椭圆上的点
  const pointX = a * Math.cos(pointAngle)
  const pointY = b * Math.sin(pointAngle)

  // 到两个焦点的距离
  const dist1 = Math.sqrt((pointX - c) ** 2 + pointY ** 2)
  const dist2 = Math.sqrt((pointX + c) ** 2 + pointY ** 2)

  const traces: Data[] = [
    {
      x: ellipseData.x,
      y: ellipseData.y,
      type: 'scatter',
      mode: 'lines',
      line: { color: '#3b82f6', width: 3 },
      name: '椭圆',
    },
    {
      x: [c, -c],
      y: [0, 0],
      type: 'scatter',
      mode: 'markers',
      marker: { size: 10, color: '#ef4444' },
      name: '焦点',
    },
  ]

  if (interactive) {
    traces.push({
      x: [pointX],
      y: [pointY],
      type: 'scatter',
      mode: 'markers',
      marker: { size: 12, color: '#22c55e' },
      name: '动点',
    } as Data)

    traces.push({
      x: [pointX, c, pointX, -c],
      y: [pointY, 0, pointY, 0],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#22c55e', width: 1, dash: 'dash' },
      showlegend: false,
    } as Data)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [-a - 1, a + 1],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'y' },
            range: [-b - 1, b + 1],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
            scaleanchor: 'x',
          },
          showlegend: true,
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
      <div className="text-white/80 text-sm space-y-1">
        <p>a = {a.toFixed(1)}, b = {b.toFixed(1)}, c = {c.toFixed(2)}</p>
        <p>离心率 e = {eccentricity.toFixed(3)}</p>
        {interactive && (
          <p className="text-green-400">
            距离和: {dist1.toFixed(2)} + {dist2.toFixed(2)} = {(dist1 + dist2).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  )
}

// 双曲线场景
function HyperbolaScene() {
  const [a] = useState(3)
  const [b] = useState(2)

  const hyperbolaData = useMemo(() => {
    const t = Array.from({ length: 200 }, (_, i) => -3 + (i * 6) / 199)
    const xRight = t.map(ti => a * Math.cosh(ti))
    const yRight = t.map(ti => b * Math.sinh(ti))
    const xLeft = xRight.map(x => -x)
    const yLeft = [...yRight]
    return { xRight, yRight, xLeft, yLeft }
  }, [a, b])

  const c = Math.sqrt(a * a + b * b)
  const eccentricity = c / a

  // 渐近线
  const asympX = [-8, 8]
  const asympY1 = asympX.map(x => (b / a) * x)
  const asympY2 = asympX.map(x => -(b / a) * x)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: hyperbolaData.xRight,
            y: hyperbolaData.yRight,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#3b82f6', width: 3 },
            name: '双曲线右支',
          },
          {
            x: hyperbolaData.xLeft,
            y: hyperbolaData.yLeft,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#3b82f6', width: 3 },
            name: '双曲线左支',
          },
          {
            x: [c, -c],
            y: [0, 0],
            type: 'scatter',
            mode: 'markers',
            marker: { size: 10, color: '#ef4444' },
            name: '焦点',
          },
          {
            x: asympX,
            y: asympY1,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#94a3b8', width: 1, dash: 'dash' },
            name: '渐近线',
          },
          {
            x: asympX,
            y: asympY2,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#94a3b8', width: 1, dash: 'dash' },
            showlegend: false,
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [-8, 8],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'y' },
            range: [-6, 6],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
            scaleanchor: 'x',
          },
          showlegend: true,
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
      <div className="text-white/80 text-sm space-y-1">
        <p>a = {a.toFixed(1)}, b = {b.toFixed(1)}, c = {c.toFixed(2)}</p>
        <p>离心率 e = {eccentricity.toFixed(3)}</p>
        <p className="text-gray-400">渐近线: y = ±{(b / a).toFixed(2)}x</p>
      </div>
    </div>
  )
}

// 抛物线场景
function ParabolaScene({ interactive = false }: { interactive?: boolean }) {
  const [p] = useState(2)
  const [pointY, setPointY] = useState(0)

  useEffect(() => {
    if (!interactive) return
    let y = -4
    const timer = setInterval(() => {
      y += 0.1
      if (y > 4) y = -4
      setPointY(y)
    }, 50)
    return () => clearInterval(timer)
  }, [interactive])

  const parabolaData = useMemo(() => {
    const y = Array.from({ length: 200 }, (_, i) => -5 + (i * 10) / 199)
    const x = y.map(yi => (yi * yi) / (2 * p))
    return { x, y }
  }, [p])

  const focusX = p / 2
  const directrixX = -p / 2

  // 抛物线上的点
  const pointX = (pointY * pointY) / (2 * p)
  const distToFocus = Math.sqrt((pointX - focusX) ** 2 + pointY ** 2)
  const distToDirectrix = Math.abs(pointX - directrixX)

  const traces: Data[] = [
    {
      x: parabolaData.x,
      y: parabolaData.y,
      type: 'scatter',
      mode: 'lines',
      line: { color: '#3b82f6', width: 3 },
      name: '抛物线',
    },
    {
      x: [focusX],
      y: [0],
      type: 'scatter',
      mode: 'markers',
      marker: { size: 10, color: '#ef4444' },
      name: '焦点',
    },
    {
      x: [directrixX, directrixX],
      y: [-5, 5],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#94a3b8', width: 2, dash: 'dash' },
      name: '准线',
    },
  ]

  if (interactive) {
    traces.push({
      x: [pointX],
      y: [pointY],
      type: 'scatter',
      mode: 'markers',
      marker: { size: 12, color: '#22c55e' },
      name: '动点',
    } as Data)

    traces.push({
      x: [pointX, focusX],
      y: [pointY, 0],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#22c55e', width: 1, dash: 'dash' },
      showlegend: false,
    } as Data)

    traces.push({
      x: [pointX, directrixX],
      y: [pointY, pointY],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#fbbf24', width: 1, dash: 'dash' },
      showlegend: false,
    } as Data)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [-2, 8],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'y' },
            range: [-5, 5],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
            scaleanchor: 'x',
          },
          showlegend: true,
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
      <div className="text-white/80 text-sm space-y-1">
        <p>p = {p.toFixed(1)}</p>
        <p>焦点: ({focusX.toFixed(1)}, 0)</p>
        <p>准线: x = {directrixX.toFixed(1)}</p>
        {interactive && (
          <p className="text-green-400">
            到焦点距离: {distToFocus.toFixed(2)}, 到准线距离: {distToDirectrix.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  )
}

// 离心率演示场景
function EccentricityScene() {
  const [e, setE] = useState(0.5)

  useEffect(() => {
    let currentE = 0
    const timer = setInterval(() => {
      currentE += 0.01
      if (currentE > 0.95) currentE = 0.1
      setE(currentE)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const a = 5
  const c = a * e
  const b = Math.sqrt(a * a - c * c)

  const ellipseData = useMemo(() => {
    const theta = Array.from({ length: 200 }, (_, i) => (i * 2 * Math.PI) / 199)
    const x = theta.map(t => a * Math.cos(t))
    const y = theta.map(t => b * Math.sin(t))
    return { x, y }
  }, [a, b])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: ellipseData.x,
            y: ellipseData.y,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#3b82f6', width: 3 },
            name: '椭圆',
          },
          {
            x: [c, -c],
            y: [0, 0],
            type: 'scatter',
            mode: 'markers',
            marker: { size: 10, color: '#ef4444' },
            name: '焦点',
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            range: [-6, 6],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'y' },
            range: [-6, 6],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
            scaleanchor: 'x',
          },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
      <div className="text-white/80 text-lg">
        <p className="text-center">
          离心率 e = <span className="text-blue-400 font-bold">{e.toFixed(3)}</span>
        </p>
        <p className="text-center text-sm text-white/60 mt-2">
          {e < 0.3 && '接近圆形'}
          {e >= 0.3 && e < 0.7 && '标准椭圆'}
          {e >= 0.7 && '扁平椭圆'}
        </p>
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'ellipse': {
      formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1',
      description: '椭圆的标准方程',
    },
    'ellipse-focus': {
      formula: 'c^2 = a^2 - b^2',
      description: '椭圆焦距关系',
    },
    'hyperbola': {
      formula: '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1',
      description: '双曲线的标准方程',
    },
    'hyperbola-focus': {
      formula: 'c^2 = a^2 + b^2',
      description: '双曲线焦距关系',
    },
    'parabola': {
      formula: 'y^2 = 2px',
      description: '抛物线的标准方程',
    },
    'eccentricity': {
      formula: 'e = \\frac{c}{a}',
      description: '离心率定义',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['ellipse']

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
    'applications-1': {
      title: '圆锥曲线的应用',
      items: ['天文学', '光学', '建筑学', '工程学'],
      icon: '🌌',
    },
    'applications-2': {
      title: '开普勒行星运动定律',
      items: ['行星轨道是椭圆', '太阳在一个焦点上', '面积速度恒定', '周期与半长轴关系'],
      icon: '🪐',
    },
    'applications-3': {
      title: '彗星轨道',
      items: ['椭圆轨道 (周期彗星)', '抛物线轨道 (临界)', '双曲线轨道 (过客)', '离心率决定轨道类型'],
      icon: '☄️',
    },
    'applications-4': {
      title: '抛物面应用',
      items: ['卫星天线', '汽车前灯', '太阳能聚光器', '射电望远镜'],
      icon: '📡',
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

// 主渲染器
export default function ConicSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 标题场景
  if (sceneConfig.type === 'title' || sceneConfig.id.includes('summary')) {
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

    case 'cone-cutting':
      return <ConeCuttingScene sceneId={sceneConfig.id} />

    case 'ellipse':
      if (sceneConfig.id.includes('ellipse-3')) {
        return <FormulaScene formulaType="ellipse" />
      }
      if (sceneConfig.id.includes('ellipse-4')) {
        return <FormulaScene formulaType="ellipse-focus" />
      }
      return <EllipseScene />

    case 'ellipse-demo':
      return <EllipseScene interactive />

    case 'hyperbola':
      if (sceneConfig.id.includes('hyperbola-1')) {
        return <HyperbolaScene />
      }
      return <HyperbolaScene />

    case 'parabola':
      if (sceneConfig.id.includes('parabola-3')) {
        return <FormulaScene formulaType="parabola" />
      }
      return <ParabolaScene interactive={sceneConfig.id.includes('parabola-1')} />

    case 'eccentricity':
      if (sceneConfig.id.includes('eccentricity-2')) {
        return <FormulaScene formulaType="eccentricity" />
      }
      return <EccentricityScene />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('summary-2')) {
        return <ConeCuttingScene sceneId="cone-cutting-3" />
      }
      if (sceneConfig.id.includes('summary-3')) {
        return <EllipseScene />
      }
      if (sceneConfig.id.includes('summary-4')) {
        return <EccentricityScene />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    default:
      return <EllipseScene />
  }
}
