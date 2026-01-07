/**
 * 极坐标场景渲染器
 * 渲染极坐标系、玫瑰线、心形线等
 */

import { useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '极坐标', subtitle: '用角度和距离描述位置' },
    'summary-intro': { title: '总结回顾', subtitle: '极坐标的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索极坐标之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '极坐标', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 极坐标曲线场景
function PolarCurveScene({ curveType = 'rose' }: { curveType?: 'rose' | 'cardioid' | 'spiral' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress(p => (p + 0.02) % 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const cx = width / 2
    const cy = height / 2
    const scale = Math.min(width, height) / 3

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制极坐标网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    for (let r = 0.25; r <= 1; r += 0.25) {
      ctx.beginPath()
      ctx.arc(cx, cy, r * scale, 0, Math.PI * 2)
      ctx.stroke()
    }
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(angle) * scale, cy + Math.sin(angle) * scale)
      ctx.stroke()
    }

    // 绘制曲线
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()

    const maxTheta = animationProgress * Math.PI * 2 * (curveType === 'spiral' ? 4 : 1)

    for (let theta = 0; theta <= maxTheta; theta += 0.01) {
      let r: number
      switch (curveType) {
        case 'rose':
          r = Math.cos(4 * theta) * scale * 0.8
          break
        case 'cardioid':
          r = (1 + Math.cos(theta)) * scale * 0.4
          break
        case 'spiral':
          r = theta / (Math.PI * 4) * scale * 0.8
          break
        default:
          r = scale * 0.5
      }

      const x = cx + r * Math.cos(theta)
      const y = cy + r * Math.sin(theta)

      if (theta === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 绘制当前点
    const currentTheta = maxTheta
    let currentR: number
    switch (curveType) {
      case 'rose':
        currentR = Math.cos(4 * currentTheta) * scale * 0.8
        break
      case 'cardioid':
        currentR = (1 + Math.cos(currentTheta)) * scale * 0.4
        break
      case 'spiral':
        currentR = currentTheta / (Math.PI * 4) * scale * 0.8
        break
      default:
        currentR = scale * 0.5
    }
    const currentX = cx + currentR * Math.cos(currentTheta)
    const currentY = cy + currentR * Math.sin(currentTheta)

    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2)
    ctx.fill()

    // 绘制半径线
    ctx.strokeStyle = '#ef4444'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(currentX, currentY)
    ctx.stroke()
    ctx.setLineDash([])

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    const curveNames: Record<string, string> = {
      rose: '玫瑰线 r = cos(4θ)',
      cardioid: '心形线 r = 1 + cos(θ)',
      spiral: '阿基米德螺线 r = θ',
    }
    ctx.fillText(curveNames[curveType], 10, 25)
  }, [animationProgress, curveType])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={500} height={500} className="border border-white/10 rounded" />
    </div>
  )
}

// 坐标转换场景
function ConversionScene() {
  const [r, setR] = useState(3)
  const [theta, setTheta] = useState(Math.PI / 4)

  const x = r * Math.cos(theta)
  const y = r * Math.sin(theta)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const cx = width / 2
    const cy = height / 2
    const scale = 40

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(width, cy)
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, height)
    ctx.stroke()

    // 绘制点
    const px = cx + x * scale
    const py = cy - y * scale

    // 绘制 r 和 θ
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(px, py)
    ctx.stroke()

    // 绘制角度弧
    ctx.strokeStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(cx, cy, 30, 0, -theta, true)
    ctx.stroke()

    // 绘制点
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(px, py, 8, 0, Math.PI * 2)
    ctx.fill()

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText(`(r, θ) = (${r.toFixed(1)}, ${(theta * 180 / Math.PI).toFixed(0)}°)`, 10, 25)
    ctx.fillText(`(x, y) = (${x.toFixed(2)}, ${y.toFixed(2)})`, 10, 45)
  }, [r, theta, x, y])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas ref={canvasRef} width={400} height={400} className="border border-white/10 rounded" />
      <div className="flex gap-8">
        <div>
          <label className="text-white text-sm">r = {r.toFixed(1)}</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={r}
            onChange={e => setR(parseFloat(e.target.value))}
            className="w-32"
          />
        </div>
        <div>
          <label className="text-white text-sm">θ = {(theta * 180 / Math.PI).toFixed(0)}°</label>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.1"
            value={theta}
            onChange={e => setTheta(parseFloat(e.target.value))}
            className="w-32"
          />
        </div>
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'conversion': {
      formula: '\\begin{cases} x = r\\cos\\theta \\\\ y = r\\sin\\theta \\end{cases}',
      description: '极坐标到直角坐标的转换',
    },
    'inverse': {
      formula: '\\begin{cases} r = \\sqrt{x^2 + y^2} \\\\ \\theta = \\arctan(y/x) \\end{cases}',
      description: '直角坐标到极坐标的转换',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['conversion']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg">{description}</p>
    </div>
  )
}

// 主渲染器
export default function PolarSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  if (sceneConfig.type === 'title') {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  if (sceneConfig.type === 'formula') {
    return <FormulaScene formulaType="conversion" />
  }

  switch (sectionId) {
    case 'intro':
    case 'grid':
      return <ConversionScene />
    case 'rose':
      return <PolarCurveScene curveType="rose" />
    case 'cardioid':
      return <PolarCurveScene curveType="cardioid" />
    case 'spiral':
      return <PolarCurveScene curveType="spiral" />
    case 'conversion':
      return <ConversionScene />
    default:
      return <PolarCurveScene curveType="rose" />
  }
}
