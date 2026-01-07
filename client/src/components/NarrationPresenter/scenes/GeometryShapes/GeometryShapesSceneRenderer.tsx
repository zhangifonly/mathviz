/**
 * 几何图形场景渲染器
 * 根据场景配置渲染基本几何图形、面积计算、图形变换等可视化内容
 */

import { useEffect, useRef, useState } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '几何图形', subtitle: '探索形状的奥秘' },
    'summary-intro': { title: '总结回顾', subtitle: '几何图形的核心概念' },
    'summary-end': { title: '感谢观看', subtitle: '继续探索几何之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '几何图形', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 基本图形展示场景
function ShapeScene({ shapeType = 'triangle', animated = false }: { shapeType?: string; animated?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationFrame, setAnimationFrame] = useState(0)

  useEffect(() => {
    if (!animated) return
    const timer = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 360)
    }, 30)
    return () => clearInterval(timer)
  }, [animated])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    const width = rect.width
    const height = rect.height
    const centerX = width / 2
    const centerY = height / 2

    ctx.clearRect(0, 0, width, height)

    // 绘制背景网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // 根据图形类型绘制
    const scale = animated ? 1 + Math.sin(animationFrame * Math.PI / 180) * 0.1 : 1
    const rotation = animated ? animationFrame * Math.PI / 180 : 0

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotation)
    ctx.scale(scale, scale)

    switch (shapeType) {
      case 'triangle':
        drawTriangle(ctx)
        break
      case 'square':
        drawSquare(ctx)
        break
      case 'circle':
        drawCircle(ctx)
        break
      case 'rectangle':
        drawRectangle(ctx)
        break
      case 'pentagon':
        drawPentagon(ctx)
        break
      case 'hexagon':
        drawHexagon(ctx)
        break
      default:
        drawTriangle(ctx)
    }

    ctx.restore()

    // 绘制图形名称
    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    const names: Record<string, string> = {
      triangle: '三角形',
      square: '正方形',
      circle: '圆形',
      rectangle: '矩形',
      pentagon: '五边形',
      hexagon: '六边形',
    }
    ctx.fillText(names[shapeType] || '图形', centerX, height - 30)
  }, [shapeType, animated, animationFrame])

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      />
    </div>
  )
}

// 绘制三角形
function drawTriangle(ctx: CanvasRenderingContext2D) {
  const size = 120
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.lineTo(-size, size)
  ctx.lineTo(size, size)
  ctx.closePath()
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#3B82F6'
  ctx.lineWidth = 3
  ctx.stroke()
}

// 绘制正方形
function drawSquare(ctx: CanvasRenderingContext2D) {
  const size = 100
  ctx.fillStyle = 'rgba(16, 185, 129, 0.3)'
  ctx.fillRect(-size, -size, size * 2, size * 2)
  ctx.strokeStyle = '#10B981'
  ctx.lineWidth = 3
  ctx.strokeRect(-size, -size, size * 2, size * 2)
}

// 绘制圆形
function drawCircle(ctx: CanvasRenderingContext2D) {
  const radius = 100
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(245, 158, 11, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#F59E0B'
  ctx.lineWidth = 3
  ctx.stroke()
}

// 绘制矩形
function drawRectangle(ctx: CanvasRenderingContext2D) {
  const width = 140
  const height = 80
  ctx.fillStyle = 'rgba(139, 92, 246, 0.3)'
  ctx.fillRect(-width, -height, width * 2, height * 2)
  ctx.strokeStyle = '#8B5CF6'
  ctx.lineWidth = 3
  ctx.strokeRect(-width, -height, width * 2, height * 2)
}

// 绘制五边形
function drawPentagon(ctx: CanvasRenderingContext2D) {
  const size = 100
  const sides = 5
  ctx.beginPath()
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(angle) * size
    const y = Math.sin(angle) * size
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(236, 72, 153, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#EC4899'
  ctx.lineWidth = 3
  ctx.stroke()
}

// 绘制六边形
function drawHexagon(ctx: CanvasRenderingContext2D) {
  const size = 100
  const sides = 6
  ctx.beginPath()
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(angle) * size
    const y = Math.sin(angle) * size
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(20, 184, 166, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#14B8A6'
  ctx.lineWidth = 3
  ctx.stroke()
}

// 面积计算演示场景
function AreaScene({ shapeType = 'square', showCalculation = false }: { shapeType?: string; showCalculation?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    const width = rect.width
    const height = rect.height
    const centerX = width / 2
    const centerY = height / 2 - 40

    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(centerX, centerY)

    // 根据图形类型绘制并标注尺寸
    switch (shapeType) {
      case 'square':
        drawSquareWithDimensions(ctx, 100)
        break
      case 'rectangle':
        drawRectangleWithDimensions(ctx, 140, 80)
        break
      case 'triangle':
        drawTriangleWithDimensions(ctx, 120)
        break
      case 'circle':
        drawCircleWithDimensions(ctx, 80)
        break
    }

    ctx.restore()

    // 显示计算公式
    if (showCalculation) {
      ctx.fillStyle = 'white'
      ctx.font = '18px sans-serif'
      ctx.textAlign = 'center'
      const formulas: Record<string, string> = {
        square: '面积 = 边长² = 100² = 10000',
        rectangle: '面积 = 长 × 宽 = 140 × 80 = 11200',
        triangle: '面积 = (底 × 高) ÷ 2 = (240 × 120) ÷ 2 = 14400',
        circle: '面积 = π × 半径² = π × 80² ≈ 20106',
      }
      ctx.fillText(formulas[shapeType] || '', centerX, height - 30)
    }
  }, [shapeType, showCalculation])

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      />
    </div>
  )
}

// 绘制带尺寸标注的正方形
function drawSquareWithDimensions(ctx: CanvasRenderingContext2D, size: number) {
  // 绘制正方形
  ctx.fillStyle = 'rgba(16, 185, 129, 0.3)'
  ctx.fillRect(-size, -size, size * 2, size * 2)
  ctx.strokeStyle = '#10B981'
  ctx.lineWidth = 3
  ctx.strokeRect(-size, -size, size * 2, size * 2)

  // 标注尺寸
  ctx.strokeStyle = '#EF4444'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-size, size + 20)
  ctx.lineTo(size, size + 20)
  ctx.stroke()

  ctx.fillStyle = 'white'
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${size * 2}`, 0, size + 40)
}

// 绘制带尺寸标注的矩形
function drawRectangleWithDimensions(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = 'rgba(139, 92, 246, 0.3)'
  ctx.fillRect(-width, -height, width * 2, height * 2)
  ctx.strokeStyle = '#8B5CF6'
  ctx.lineWidth = 3
  ctx.strokeRect(-width, -height, width * 2, height * 2)

  // 标注宽度
  ctx.strokeStyle = '#EF4444'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-width, height + 20)
  ctx.lineTo(width, height + 20)
  ctx.stroke()

  // 标注高度
  ctx.beginPath()
  ctx.moveTo(width + 20, -height)
  ctx.lineTo(width + 20, height)
  ctx.stroke()

  ctx.fillStyle = 'white'
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${width * 2}`, 0, height + 40)
  ctx.save()
  ctx.translate(width + 40, 0)
  ctx.rotate(Math.PI / 2)
  ctx.fillText(`${height * 2}`, 0, 0)
  ctx.restore()
}

// 绘制带尺寸标注的三角形
function drawTriangleWithDimensions(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.lineTo(-size, size)
  ctx.lineTo(size, size)
  ctx.closePath()
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#3B82F6'
  ctx.lineWidth = 3
  ctx.stroke()

  // 标注底边
  ctx.strokeStyle = '#EF4444'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-size, size + 20)
  ctx.lineTo(size, size + 20)
  ctx.stroke()

  // 标注高
  ctx.beginPath()
  ctx.moveTo(10, -size)
  ctx.lineTo(10, size)
  ctx.stroke()

  ctx.fillStyle = 'white'
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`底 = ${size * 2}`, 0, size + 40)
  ctx.fillText(`高 = ${size * 2}`, 40, 0)
}

// 绘制带尺寸标注的圆形
function drawCircleWithDimensions(ctx: CanvasRenderingContext2D, radius: number) {
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(245, 158, 11, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#F59E0B'
  ctx.lineWidth = 3
  ctx.stroke()

  // 绘制半径线
  ctx.strokeStyle = '#EF4444'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(radius, 0)
  ctx.stroke()

  ctx.fillStyle = 'white'
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`r = ${radius}`, radius / 2, -10)
}

// 图形变换场景
function TransformScene({ transformType = 'rotate' }: { transformType?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % 360)
    }, 30)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    const width = rect.width
    const height = rect.height
    const centerX = width / 2
    const centerY = height / 2

    ctx.clearRect(0, 0, width, height)

    // 绘制原始图形（半透明）
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.globalAlpha = 0.3
    drawSquare(ctx)
    ctx.restore()

    // 绘制变换后的图形
    ctx.save()
    ctx.translate(centerX, centerY)

    switch (transformType) {
      case 'rotate':
        ctx.rotate(frame * Math.PI / 180)
        break
      case 'scale':
        const scale = 1 + Math.sin(frame * Math.PI / 180) * 0.5
        ctx.scale(scale, scale)
        break
      case 'translate':
        const offsetX = Math.cos(frame * Math.PI / 180) * 50
        const offsetY = Math.sin(frame * Math.PI / 180) * 50
        ctx.translate(offsetX, offsetY)
        break
      case 'reflect':
        if (frame < 180) {
          ctx.scale(1, 1)
        } else {
          ctx.scale(-1, 1)
        }
        break
    }

    drawSquare(ctx)
    ctx.restore()

    // 显示变换类型
    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    const names: Record<string, string> = {
      rotate: '旋转变换',
      scale: '缩放变换',
      translate: '平移变换',
      reflect: '镜像变换',
    }
    ctx.fillText(names[transformType] || '变换', centerX, height - 30)
  }, [transformType, frame])

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'triangle-area': {
      formula: 'A = \\frac{1}{2}bh',
      description: '三角形面积 = 底 × 高 ÷ 2',
    },
    'square-area': {
      formula: 'A = a^2',
      description: '正方形面积 = 边长²',
    },
    'rectangle-area': {
      formula: 'A = l \\times w',
      description: '矩形面积 = 长 × 宽',
    },
    'circle-area': {
      formula: 'A = \\pi r^2',
      description: '圆形面积 = π × 半径²',
    },
    'circle-circumference': {
      formula: 'C = 2\\pi r',
      description: '圆周长 = 2 × π × 半径',
    },
    'pythagorean': {
      formula: 'a^2 + b^2 = c^2',
      description: '勾股定理：直角三角形两直角边的平方和等于斜边的平方',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['square-area']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-3xl" />
      </div>
      <p className="text-white/70 text-xl text-center max-w-2xl">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '几何图形的应用',
      items: ['建筑设计', '艺术创作', '工程制图', '日常生活'],
      icon: '📐',
    },
    'app-architecture': {
      title: '建筑设计',
      items: ['房屋结构', '桥梁设计', '空间规划', '美学比例'],
      icon: '🏛️',
    },
    'app-art': {
      title: '艺术创作',
      items: ['对称美学', '黄金分割', '图案设计', '视觉平衡'],
      icon: '🎨',
    },
    'app-engineering': {
      title: '工程制图',
      items: ['机械零件', '电路设计', '地图绘制', '产品设计'],
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
export default function GeometryShapesSceneRenderer({ scene }: SceneRendererProps) {
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
    const formulaType = (lineState?.params?.formulaType as string) || 'square-area'
    return <FormulaScene formulaType={formulaType} />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('shapes')) {
        return <ShapeScene shapeType="triangle" animated />
      }
      return <ShapeScene shapeType="square" />

    case 'concept':
    case 'basic-shapes':
      const shapeType = (lineState?.params?.shapeType as string) || 'triangle'
      const animated = lineState?.params?.animated as boolean
      return <ShapeScene shapeType={shapeType} animated={animated} />

    case 'area':
    case 'area-calculation':
      const areaShape = (lineState?.params?.shapeType as string) || 'square'
      const showCalc = lineState?.params?.showCalculation as boolean
      return <AreaScene shapeType={areaShape} showCalculation={showCalc} />

    case 'perimeter':
      return <FormulaScene formulaType="circle-circumference" />

    case 'transform':
    case 'transformation':
      const transformType = (lineState?.params?.transformType as string) || 'rotate'
      return <TransformScene transformType={transformType} />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="pythagorean" />
      }
      return <ShapeScene shapeType="hexagon" animated />

    default:
      return <ShapeScene shapeType="triangle" />
  }
}
