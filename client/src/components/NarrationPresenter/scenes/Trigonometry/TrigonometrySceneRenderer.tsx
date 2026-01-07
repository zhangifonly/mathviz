/**
 * 三角函数场景渲染器
 * 渲染单位圆、正弦/余弦波形、三角恒等式等可视化
 */

import { useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '三角函数', subtitle: '圆与波的数学之美' },
    'summary-1': { title: '总结回顾', subtitle: '三角函数的核心概念' },
    'summary-end': { title: '感谢观看', subtitle: '探索三角函数的奥秘' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '三角函数', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 单位圆场景
function UnitCircleScene({
  animate = true,
  showSin = true,
  showCos = true,
  showTan = false,
  angle = 45
}: {
  animate?: boolean
  showSin?: boolean
  showCos?: boolean
  showTan?: boolean
  angle?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentAngle, setCurrentAngle] = useState(angle)

  useEffect(() => {
    if (!animate) return
    const timer = setInterval(() => {
      setCurrentAngle(a => (a + 2) % 360)
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
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.35

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // 绘制单位圆
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    // 计算角度对应的点
    const angleRad = (currentAngle * Math.PI) / 180
    const x = Math.cos(angleRad)
    const y = Math.sin(angleRad)
    const px = centerX + x * radius
    const py = centerY - y * radius

    // 绘制半径
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(px, py)
    ctx.stroke()

    // 绘制点
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, 2 * Math.PI)
    ctx.fill()

    // 绘制 cos (x 轴投影)
    if (showCos) {
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(px, centerY)
      ctx.stroke()
      ctx.setLineDash([])

      // cos 标签
      ctx.fillStyle = '#22c55e'
      ctx.font = '14px sans-serif'
      ctx.fillText('cos θ', px > centerX ? px - 40 : px + 10, centerY + 20)
    }

    // 绘制 sin (y 轴投影)
    if (showSin) {
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(px, centerY)
      ctx.lineTo(px, py)
      ctx.stroke()
      ctx.setLineDash([])

      // sin 标签
      ctx.fillStyle = '#ef4444'
      ctx.font = '14px sans-serif'
      ctx.fillText('sin θ', px + 10, py > centerY ? py + 15 : py - 5)
    }

    // 绘制 tan (切线)
    if (showTan && Math.abs(Math.cos(angleRad)) > 0.01) {
      const tanValue = Math.tan(angleRad)
      const tanY = centerY - tanValue * radius

      // 只在合理范围内绘制
      if (Math.abs(tanY - centerY) < height) {
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX + radius, centerY)
        ctx.lineTo(centerX + radius, tanY)
        ctx.stroke()

        // tan 标签
        ctx.fillStyle = '#f59e0b'
        ctx.font = '14px sans-serif'
        ctx.fillText('tan θ', centerX + radius + 10, (centerY + tanY) / 2)
      }
    }

    // 绘制角度弧
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, -angleRad, true)
    ctx.stroke()

    // 显示角度和三角函数值
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.fillText(`θ = ${currentAngle.toFixed(0)}°`, 20, 30)
    ctx.font = '14px sans-serif'
    ctx.fillText(`sin θ = ${y.toFixed(3)}`, 20, 55)
    ctx.fillText(`cos θ = ${x.toFixed(3)}`, 20, 75)
    if (showTan) {
      const tanValue = Math.tan(angleRad)
      ctx.fillText(`tan θ = ${Math.abs(tanValue) < 100 ? tanValue.toFixed(3) : '∞'}`, 20, 95)
    }
  }, [currentAngle, showSin, showCos, showTan])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 波形场景 (正弦/余弦波)
function WaveScene({
  showSin = true,
  showCos = false,
  animate = true,
  showUnitCircle = false
}: {
  showSin?: boolean
  showCos?: boolean
  animate?: boolean
  showUnitCircle?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!animate) return
    const timer = setInterval(() => {
      setPhase(p => (p + 0.05) % (2 * Math.PI))
    }, 30)
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
    const amplitude = height * 0.3
    const frequency = 2 // 2 个周期
    const circleRadius = 60

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    // 绘制网格线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 1; i <= 4; i++) {
      const x = (width * i) / 4
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // 如果显示单位圆
    if (showUnitCircle) {
      const circleCenterX = 100
      const circleCenterY = centerY

      // 绘制单位圆
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, 2 * Math.PI)
      ctx.stroke()

      // 绘制旋转半径
      const angle = phase
      const px = circleCenterX + circleRadius * Math.cos(angle)
      const py = circleCenterY - circleRadius * Math.sin(angle)

      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(circleCenterX, circleCenterY)
      ctx.lineTo(px, py)
      ctx.stroke()

      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.arc(px, py, 4, 0, 2 * Math.PI)
      ctx.fill()

      // 连接到波形
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(200, centerY - circleRadius * Math.sin(angle))
      ctx.stroke()
      ctx.setLineDash([])
    }

    const startX = showUnitCircle ? 200 : 50

    // 绘制正弦波
    if (showSin) {
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (let x = 0; x < width - startX; x++) {
        const angle = (x / (width - startX)) * frequency * 2 * Math.PI + phase
        const y = centerY - amplitude * Math.sin(angle)
        if (x === 0) {
          ctx.moveTo(startX + x, y)
        } else {
          ctx.lineTo(startX + x, y)
        }
      }
      ctx.stroke()
    }

    // 绘制余弦波
    if (showCos) {
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (let x = 0; x < width - startX; x++) {
        const angle = (x / (width - startX)) * frequency * 2 * Math.PI + phase
        const y = centerY - amplitude * Math.cos(angle)
        if (x === 0) {
          ctx.moveTo(startX + x, y)
        } else {
          ctx.lineTo(startX + x, y)
        }
      }
      ctx.stroke()
    }

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    if (showSin) {
      ctx.fillStyle = '#ef4444'
      ctx.fillText('y = sin(x)', width - 100, 30)
    }
    if (showCos) {
      ctx.fillStyle = '#22c55e'
      ctx.fillText('y = cos(x)', width - 100, showSin ? 50 : 30)
    }
  }, [phase, showSin, showCos, showUnitCircle])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 三角恒等式场景
function IdentityScene({ identityType = 'pythagorean' }: { identityType?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setAngle(a => (a + 2) % 360)
    }, 50)
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
    const radius = 120

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    const angleRad = (angle * Math.PI) / 180
    const x = Math.cos(angleRad)
    const y = Math.sin(angleRad)

    if (identityType === 'pythagorean') {
      // 勾股定理: sin²θ + cos²θ = 1

      // 绘制单位圆
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.stroke()

      // 绘制坐标轴
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(width, centerY)
      ctx.moveTo(centerX, 0)
      ctx.lineTo(centerX, height)
      ctx.stroke()

      const px = centerX + x * radius
      const py = centerY - y * radius

      // 绘制直角三角形
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(px, centerY)
      ctx.lineTo(px, py)
      ctx.lineTo(centerX, centerY)
      ctx.stroke()

      // 绘制半径
      ctx.strokeStyle = '#a855f7'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(px, py)
      ctx.stroke()

      // 标注
      ctx.fillStyle = '#22c55e'
      ctx.font = '14px sans-serif'
      ctx.fillText('cos θ', (centerX + px) / 2, centerY + 20)

      ctx.fillStyle = '#ef4444'
      ctx.fillText('sin θ', px + 10, (centerY + py) / 2)

      ctx.fillStyle = '#a855f7'
      ctx.fillText('1', (centerX + px) / 2 - 20, (centerY + py) / 2 - 10)

      // 显示验证
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      const sum = x * x + y * y
      ctx.fillText(`sin²θ + cos²θ = ${sum.toFixed(4)}`, 20, height - 20)
    } else if (identityType === 'double-angle') {
      // 二倍角公式: sin(2θ) = 2sin(θ)cos(θ)

      // 绘制两个角度的对比
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.stroke()

      // θ
      const px1 = centerX + x * radius
      const py1 = centerY - y * radius
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(px1, py1)
      ctx.stroke()

      // 2θ
      const angle2Rad = angleRad * 2
      const x2 = Math.cos(angle2Rad)
      const y2 = Math.sin(angle2Rad)
      const px2 = centerX + x2 * radius
      const py2 = centerY - y2 * radius
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(px2, py2)
      ctx.stroke()

      // 标注
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText(`sin(2θ) = ${y2.toFixed(3)}`, 20, 30)
      ctx.fillText(`2sin(θ)cos(θ) = ${(2 * y * x).toFixed(3)}`, 20, 50)
    }
  }, [angle, identityType])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'basic-sin': {
      formula: '\\sin\\theta = \\frac{\\text{对边}}{\\text{斜边}}',
      description: '正弦函数的定义',
    },
    'basic-cos': {
      formula: '\\cos\\theta = \\frac{\\text{邻边}}{\\text{斜边}}',
      description: '余弦函数的定义',
    },
    'basic-tan': {
      formula: '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = \\frac{\\text{对边}}{\\text{邻边}}',
      description: '正切函数的定义',
    },
    'pythagorean': {
      formula: '\\sin^2\\theta + \\cos^2\\theta = 1',
      description: '勾股恒等式',
    },
    'double-angle-sin': {
      formula: '\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta',
      description: '正弦二倍角公式',
    },
    'double-angle-cos': {
      formula: '\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta',
      description: '余弦二倍角公式',
    },
    'sum-sin': {
      formula: '\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta',
      description: '正弦和角公式',
    },
    'sum-cos': {
      formula: '\\cos(\\alpha + \\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta',
      description: '余弦和角公式',
    },
    'period': {
      formula: '\\sin(\\theta + 2\\pi) = \\sin\\theta, \\quad \\cos(\\theta + 2\\pi) = \\cos\\theta',
      description: '三角函数的周期性',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['pythagorean']

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
      title: '三角函数的应用',
      items: ['物理学', '工程学', '音乐', '天文学'],
      icon: '🔬',
    },
    'applications-physics': {
      title: '物理学应用',
      items: ['简谐运动', '波动', '圆周运动', '交流电'],
      icon: '⚡',
    },
    'applications-engineering': {
      title: '工程学应用',
      items: ['结构分析', '信号处理', '导航系统', '测量学'],
      icon: '🏗️',
    },
    'applications-music': {
      title: '音乐中的应用',
      items: ['声波分析', '音高频率', '和声理论', '音色合成'],
      icon: '🎵',
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
export default function TrigonometrySceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('pythagorean')) {
      return <FormulaScene formulaType="pythagorean" />
    }
    if (sceneConfig.id.includes('double-angle')) {
      return <FormulaScene formulaType="double-angle-sin" />
    }
    if (sceneConfig.id.includes('sum')) {
      return <FormulaScene formulaType="sum-sin" />
    }
    return <FormulaScene formulaType="basic-sin" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id === 'intro-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      return <UnitCircleScene animate showSin showCos />

    case 'unit-circle':
      if (sceneConfig.id.includes('definition')) {
        return <FormulaScene formulaType="basic-sin" />
      }
      if (sceneConfig.id.includes('interactive')) {
        return <UnitCircleScene animate={false} showSin showCos />
      }
      return <UnitCircleScene animate showSin showCos />

    case 'sine-cosine':
      if (sceneConfig.id.includes('sine-def')) {
        return <FormulaScene formulaType="basic-sin" />
      }
      if (sceneConfig.id.includes('cosine-def')) {
        return <FormulaScene formulaType="basic-cos" />
      }
      return <UnitCircleScene animate showSin showCos />

    case 'tangent':
      if (sceneConfig.id.includes('definition')) {
        return <FormulaScene formulaType="basic-tan" />
      }
      return <UnitCircleScene animate showSin showCos showTan />

    case 'wave':
      if (sceneConfig.id.includes('sine-wave')) {
        return <WaveScene showSin showCos={false} animate />
      }
      if (sceneConfig.id.includes('cosine-wave')) {
        return <WaveScene showSin={false} showCos animate />
      }
      if (sceneConfig.id.includes('both')) {
        return <WaveScene showSin showCos animate />
      }
      if (sceneConfig.id.includes('connection')) {
        return <WaveScene showSin showCos={false} animate showUnitCircle />
      }
      return <WaveScene showSin animate />

    case 'identities':
      if (sceneConfig.id.includes('pythagorean')) {
        return <IdentityScene identityType="pythagorean" />
      }
      if (sceneConfig.id.includes('double-angle')) {
        return <IdentityScene identityType="double-angle" />
      }
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="pythagorean" />
      }
      return <IdentityScene identityType="pythagorean" />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id === 'summary-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id.includes('unit-circle')) {
        return <UnitCircleScene animate showSin showCos />
      }
      if (sceneConfig.id.includes('wave')) {
        return <WaveScene showSin showCos animate />
      }
      if (sceneConfig.id.includes('identity')) {
        return <IdentityScene identityType="pythagorean" />
      }
      return <TitleScene sceneId="summary-end" />

    default:
      return <UnitCircleScene animate showSin showCos />
  }
}
