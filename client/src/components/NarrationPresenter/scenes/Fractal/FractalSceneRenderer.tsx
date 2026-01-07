/**
 * 分形几何场景渲染器
 * 渲染 Mandelbrot 集、Julia 集、Koch 雪花等分形图形
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '分形几何', subtitle: '自然界中的无限细节' },
    'summary-intro': { title: '总结回顾', subtitle: '分形几何的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索无限之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '分形几何', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// Mandelbrot 集场景
function MandelbrotScene({ zoom = false }: { zoom?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [view, setView] = useState({ xMin: -2.5, xMax: 1, yMin: -1.5, yMax: 1.5 })

  const colorPalette = useCallback((iter: number, maxIter: number): [number, number, number] => {
    if (iter === maxIter) return [0, 0, 0]
    const t = iter / maxIter
    const r = Math.floor(9 * (1 - t) * t * t * t * 255)
    const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255)
    const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255)
    return [r, g, b]
  }, [])

  const mandelbrot = useCallback((cRe: number, cIm: number, maxIter: number): number => {
    let zRe = 0, zIm = 0
    let iter = 0
    while (zRe * zRe + zIm * zIm <= 4 && iter < maxIter) {
      const temp = zRe * zRe - zIm * zIm + cRe
      zIm = 2 * zRe * zIm + cIm
      zRe = temp
      iter++
    }
    return iter
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const imageData = ctx.createImageData(width, height)
    const maxIter = 100

    const xScale = (view.xMax - view.xMin) / width
    const yScale = (view.yMax - view.yMin) / height

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const x = view.xMin + px * xScale
        const y = view.yMin + py * yScale
        const iter = mandelbrot(x, y, maxIter)

        const [r, g, b] = colorPalette(iter, maxIter)
        const idx = (py * width + px) * 4
        imageData.data[idx] = r
        imageData.data[idx + 1] = g
        imageData.data[idx + 2] = b
        imageData.data[idx + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }, [view, mandelbrot, colorPalette])

  // 自动缩放动画
  useEffect(() => {
    if (!zoom) return

    const zoomCenter = { x: -0.743643887037151, y: 0.131825904205330 }
    let zoomLevel = 1
    let animationId: number

    const animate = () => {
      zoomLevel *= 1.02
      const size = 3.5 / zoomLevel
      setView({
        xMin: zoomCenter.x - size / 2,
        xMax: zoomCenter.x + size / 2,
        yMin: zoomCenter.y - size / 2 * 0.75,
        yMax: zoomCenter.y + size / 2 * 0.75,
      })

      if (zoomLevel < 1000) {
        animationId = requestAnimationFrame(animate)
      } else {
        zoomLevel = 1
        setView({ xMin: -2.5, xMax: 1, yMin: -1.5, yMax: 1.5 })
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [zoom])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// Julia 集场景
function JuliaScene({ animate = false }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [juliaC, setJuliaC] = useState({ re: -0.7, im: 0.27015 })
  const angleRef = useRef(0)

  const colorPalette = useCallback((iter: number, maxIter: number): [number, number, number] => {
    if (iter === maxIter) return [0, 0, 0]
    const t = iter / maxIter
    const r = Math.floor(9 * (1 - t) * t * t * t * 255)
    const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255)
    const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255)
    return [r, g, b]
  }, [])

  const julia = useCallback((zRe: number, zIm: number, cRe: number, cIm: number, maxIter: number): number => {
    let iter = 0
    while (zRe * zRe + zIm * zIm <= 4 && iter < maxIter) {
      const temp = zRe * zRe - zIm * zIm + cRe
      zIm = 2 * zRe * zIm + cIm
      zRe = temp
      iter++
    }
    return iter
  }, [])

  // Julia 参数动画
  useEffect(() => {
    if (!animate) return

    let animationId: number
    const animateJulia = () => {
      angleRef.current += 0.02
      const radius = 0.7885
      setJuliaC({
        re: radius * Math.cos(angleRef.current),
        im: radius * Math.sin(angleRef.current),
      })
      animationId = requestAnimationFrame(animateJulia)
    }

    animationId = requestAnimationFrame(animateJulia)
    return () => cancelAnimationFrame(animationId)
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const imageData = ctx.createImageData(width, height)
    const maxIter = 100
    const view = { xMin: -2, xMax: 2, yMin: -1.5, yMax: 1.5 }

    const xScale = (view.xMax - view.xMin) / width
    const yScale = (view.yMax - view.yMin) / height

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const x = view.xMin + px * xScale
        const y = view.yMin + py * yScale
        const iter = julia(x, y, juliaC.re, juliaC.im, maxIter)

        const [r, g, b] = colorPalette(iter, maxIter)
        const idx = (py * width + px) * 4
        imageData.data[idx] = r
        imageData.data[idx + 1] = g
        imageData.data[idx + 2] = b
        imageData.data[idx + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }, [juliaC, julia, colorPalette])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={500}
        height={375}
        className="max-w-full border border-white/10 rounded"
      />
      <p className="text-white/60 text-sm font-mono">
        c = {juliaC.re.toFixed(3)} + {juliaC.im.toFixed(3)}i
      </p>
    </div>
  )
}

// Koch 雪花场景
function KochScene({ iteration = 0 }: { iteration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentIter, setCurrentIter] = useState(iteration)

  useEffect(() => {
    if (iteration > 0) {
      const timer = setInterval(() => {
        setCurrentIter(i => (i < 5 ? i + 1 : 0))
      }, 1500)
      return () => clearInterval(timer)
    }
  }, [iteration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制 Koch 雪花
    const kochLine = (x1: number, y1: number, x2: number, y2: number, depth: number) => {
      if (depth === 0) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        return
      }

      const dx = (x2 - x1) / 3
      const dy = (y2 - y1) / 3

      const pA = { x: x1, y: y1 }
      const pB = { x: x1 + dx, y: y1 + dy }
      const pD = { x: x2 - dx, y: y2 - dy }
      const pE = { x: x2, y: y2 }

      const angle = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 3
      const len = Math.sqrt(dx * dx + dy * dy)
      const pC = {
        x: pB.x + len * Math.cos(angle),
        y: pB.y + len * Math.sin(angle),
      }

      kochLine(pA.x, pA.y, pB.x, pB.y, depth - 1)
      kochLine(pB.x, pB.y, pC.x, pC.y, depth - 1)
      kochLine(pC.x, pC.y, pD.x, pD.y, depth - 1)
      kochLine(pD.x, pD.y, pE.x, pE.y, depth - 1)
    }

    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 1.5

    // 等边三角形的三个顶点
    const size = Math.min(width, height) * 0.7
    const cx = width / 2
    const cy = height / 2 + size * 0.1
    const h = size * Math.sqrt(3) / 2

    const p1 = { x: cx, y: cy - h * 2 / 3 }
    const p2 = { x: cx - size / 2, y: cy + h / 3 }
    const p3 = { x: cx + size / 2, y: cy + h / 3 }

    kochLine(p1.x, p1.y, p2.x, p2.y, currentIter)
    kochLine(p2.x, p2.y, p3.x, p3.y, currentIter)
    kochLine(p3.x, p3.y, p1.x, p1.y, currentIter)

    // 显示迭代次数
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.fillText(`迭代次数: ${currentIter}`, 20, 30)
  }, [currentIter])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'mandelbrot': {
      formula: 'z_{n+1} = z_n^2 + c',
      description: 'Mandelbrot 集的迭代公式',
    },
    'dimension': {
      formula: 'D = \\frac{\\log N}{\\log s}',
      description: '分形维度的计算公式',
    },
    'koch': {
      formula: 'D_{Koch} = \\frac{\\log 4}{\\log 3} \\approx 1.26',
      description: 'Koch 雪花的分形维度',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['mandelbrot']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg">{description}</p>
    </div>
  )
}

// 自然界分形场景
function NatureScene({ sceneId }: { sceneId: string }) {
  const nature: Record<string, { title: string; items: string[]; icon: string }> = {
    'nature-intro': {
      title: '自然界中的分形',
      items: ['海岸线', '树木', '闪电', '云朵'],
      icon: '🌳',
    },
    'nature-bio': {
      title: '生物学中的分形',
      items: ['血管系统', '肺部支气管', '神经网络', '植物脉络'],
      icon: '🫀',
    },
    'nature-geo': {
      title: '地理中的分形',
      items: ['河流系统', '山脉轮廓', '海岸线长度', '地震断层'],
      icon: '🏔️',
    },
    'nature-preference': {
      title: '自然偏爱分形',
      items: ['最优化表面积', '高效资源分配', '稳定结构', '自组织系统'],
      icon: '✨',
    },
  }

  const item = nature[sceneId] || nature['nature-intro']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{item.icon}</div>
      <h2 className="text-3xl font-bold text-white">{item.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {item.items.map((i, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function FractalSceneRenderer({ scene }: SceneRendererProps) {
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
    return <NatureScene sceneId={sceneConfig.id} />
  }

  // 公式场景
  if (sceneConfig.type === 'formula') {
    if (sceneConfig.id.includes('dimension')) {
      return <FormulaScene formulaType="dimension" />
    }
    return <FormulaScene formulaType="mandelbrot" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('coastline') || sceneConfig.id.includes('tree')) {
        return <KochScene iteration={2} />
      }
      return <MandelbrotScene />

    case 'concept':
      if (sceneConfig.id.includes('self-similar')) {
        return <MandelbrotScene zoom />
      }
      if (sceneConfig.id.includes('mandelbrot')) {
        return <MandelbrotScene />
      }
      return <KochScene iteration={3} />

    case 'koch':
      const iteration = lineState?.params?.iteration as number || 0
      return <KochScene iteration={iteration} />

    case 'mandelbrot':
      if (sceneConfig.id.includes('zoom')) {
        return <MandelbrotScene zoom />
      }
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="mandelbrot" />
      }
      return <MandelbrotScene />

    case 'nature':
      return <NatureScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('beauty')) {
        return <KochScene iteration={4} />
      }
      if (sceneConfig.id.includes('connection')) {
        return <MandelbrotScene />
      }
      return <JuliaScene animate />

    default:
      return <MandelbrotScene />
  }
}
