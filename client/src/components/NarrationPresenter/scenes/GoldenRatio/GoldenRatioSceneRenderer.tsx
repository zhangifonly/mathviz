/**
 * 黄金比例场景渲染器
 * 渲染黄金矩形、黄金螺旋、斐波那契数列等可视化
 */

import { useEffect, useRef, useState } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../MathFormula/MathFormula'

const PHI = (1 + Math.sqrt(5)) / 2 // 黄金比例 ≈ 1.618

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '黄金比例', subtitle: '自然界中的完美比例' },
    'summary-intro': { title: '总结回顾', subtitle: '黄金比例的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '黄金比例', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 黄金矩形场景
function GoldenRectangleScene({ animate = false }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [iteration, setIteration] = useState(0)

  useEffect(() => {
    if (animate) {
      const timer = setInterval(() => {
        setIteration(i => (i < 8 ? i + 1 : 0))
      }, 1500)
      return () => clearInterval(timer)
    }
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制黄金矩形序列
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308',
      '#84cc16', '#22c55e', '#10b981', '#14b8a6',
      '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'
    ]

    let w = 300
    let h = w / PHI
    let angle = 0

    ctx.save()
    ctx.translate(width / 2, height / 2)

    for (let i = 0; i <= Math.min(iteration, 8); i++) {
      ctx.save()
      ctx.rotate(angle)

      // 绘制矩形
      ctx.strokeStyle = colors[i % colors.length]
      ctx.lineWidth = 2
      ctx.strokeRect(-w / 2, -h / 2, w, h)

      // 绘制正方形部分
      const squareSize = Math.min(w, h)
      ctx.fillStyle = colors[i % colors.length] + '20'
      ctx.fillRect(-w / 2, -h / 2, squareSize, squareSize)

      ctx.restore()

      // 更新下一个矩形的尺寸和角度
      const newW = h
      const newH = w - h
      w = newW
      h = newH
      angle += Math.PI / 2
    }

    ctx.restore()

    // 显示黄金比例值
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.fillText(`φ = ${PHI.toFixed(6)}`, 20, 30)
    ctx.fillText(`迭代次数: ${iteration}`, 20, 55)
  }, [iteration])

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

// 黄金螺旋场景
function GoldenSpiralScene({ animate = false }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (animate) {
      let animationId: number
      let t = 0
      const animateSpiral = () => {
        t += 0.01
        setProgress(Math.min(t, 1))
        if (t < 1) {
          animationId = requestAnimationFrame(animateSpiral)
        } else {
          t = 0
          animationId = requestAnimationFrame(animateSpiral)
        }
      }
      animationId = requestAnimationFrame(animateSpiral)
      return () => cancelAnimationFrame(animationId)
    }
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2

    // 绘制黄金矩形
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308',
      '#84cc16', '#22c55e', '#10b981', '#14b8a6'
    ]

    let w = 200
    let h = w / PHI
    let x = centerX - w / 2
    let y = centerY - h / 2
    let angle = 0

    ctx.save()

    for (let i = 0; i < 8; i++) {
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(angle)
      ctx.translate(-centerX, -centerY)

      // 绘制矩形
      ctx.strokeStyle = colors[i % colors.length]
      ctx.lineWidth = 1.5
      ctx.strokeRect(x, y, w, h)

      // 绘制正方形
      const squareSize = Math.min(w, h)
      ctx.fillStyle = colors[i % colors.length] + '15'
      ctx.fillRect(x, y, squareSize, squareSize)

      ctx.restore()

      // 更新位置
      const newW = h
      const newH = w - h

      if (i % 4 === 0) {
        x = x + w - newW
      } else if (i % 4 === 1) {
        y = y + h - newH
      } else if (i % 4 === 2) {
        // x stays the same
      } else {
        // y stays the same
      }

      w = newW
      h = newH
      angle += Math.PI / 2
    }

    ctx.restore()

    // 绘制黄金螺旋
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 3
    ctx.beginPath()

    const maxTheta = progress * 3 * Math.PI
    const steps = 200
    let firstPoint = true

    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const theta = t * maxTheta

      // 对数螺旋: r = a * e^(b*θ)
      const a = 5
      const b = Math.log(PHI) / (Math.PI / 2)
      const r = a * Math.exp(b * theta)

      const px = centerX + r * Math.cos(theta)
      const py = centerY + r * Math.sin(theta)

      if (firstPoint) {
        ctx.moveTo(px, py)
        firstPoint = false
      } else {
        ctx.lineTo(px, py)
      }
    }

    ctx.stroke()
  }, [progress])

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

// 斐波那契数列场景
function FibonacciScene({ animate = false }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [count, setCount] = useState(1)

  useEffect(() => {
    if (animate) {
      const timer = setInterval(() => {
        setCount(c => (c < 12 ? c + 1 : 1))
      }, 800)
      return () => clearInterval(timer)
    }
  }, [animate])

  const fibonacci = (n: number): number => {
    if (n <= 1) return n
    let a = 0, b = 1
    for (let i = 2; i <= n; i++) {
      const temp = a + b
      a = b
      b = temp
    }
    return b
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制斐波那契数列可视化
    const numbers: number[] = []
    for (let i = 0; i < count; i++) {
      numbers.push(fibonacci(i))
    }

    const maxNum = Math.max(...numbers, 1)
    const barWidth = Math.min(50, (width - 100) / count)
    const maxHeight = height - 150

    numbers.forEach((num, i) => {
      const barHeight = (num / maxNum) * maxHeight
      const x = 50 + i * (barWidth + 10)
      const y = height - 80 - barHeight

      // 绘制柱状图
      const hue = (i * 30) % 360
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
      ctx.fillRect(x, y, barWidth, barHeight)

      // 绘制数值
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(num.toString(), x + barWidth / 2, y - 5)

      // 绘制索引
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '12px sans-serif'
      ctx.fillText(`F${i}`, x + barWidth / 2, height - 60)
    })

    // 显示黄金比例收敛
    if (count > 1) {
      const ratio = numbers[count - 1] / numbers[count - 2]
      ctx.fillStyle = 'white'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`F${count - 1} / F${count - 2} = ${ratio.toFixed(6)}`, 50, 40)
      ctx.fillText(`φ = ${PHI.toFixed(6)}`, 50, 65)

      const error = Math.abs(ratio - PHI)
      ctx.fillStyle = error < 0.01 ? '#22c55e' : '#f59e0b'
      ctx.fillText(`误差: ${error.toFixed(6)}`, 50, 90)
    }
  }, [count])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 自然界应用场景
function NatureScene({ sceneId }: { sceneId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2

    if (sceneId.includes('flower') || sceneId.includes('sunflower')) {
      // 绘制向日葵种子排列（黄金角）
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // ≈ 137.5°
      const numSeeds = 500

      for (let i = 0; i < numSeeds; i++) {
        const angle = i * goldenAngle
        const radius = 3 * Math.sqrt(i)
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        const size = Math.max(2, 5 - radius / 30)
        ctx.fillStyle = `hsl(${45 + i % 30}, 80%, 60%)`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 标题
      ctx.fillStyle = 'white'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('向日葵种子排列', centerX, 40)
      ctx.font = '14px sans-serif'
      ctx.fillText(`黄金角 ≈ 137.5°`, centerX, 65)
    } else if (sceneId.includes('shell') || sceneId.includes('nautilus')) {
      // 绘制鹦鹉螺壳（对数螺旋）
      ctx.strokeStyle = '#60a5fa'
      ctx.lineWidth = 3
      ctx.beginPath()

      const a = 10
      const b = Math.log(PHI) / (Math.PI / 2)
      let firstPoint = true

      for (let theta = 0; theta <= 4 * Math.PI; theta += 0.05) {
        const r = a * Math.exp(b * theta)
        const x = centerX + r * Math.cos(theta)
        const y = centerY + r * Math.sin(theta)

        if (firstPoint) {
          ctx.moveTo(x, y)
          firstPoint = false
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      // 绘制分隔线
      for (let i = 0; i < 8; i++) {
        const theta = i * Math.PI / 2
        const r1 = a * Math.exp(b * theta)
        const r2 = a * Math.exp(b * (theta + Math.PI / 2))

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(centerX + r1 * Math.cos(theta), centerY + r1 * Math.sin(theta))
        ctx.lineTo(centerX + r2 * Math.cos(theta + Math.PI / 2), centerY + r2 * Math.sin(theta + Math.PI / 2))
        ctx.stroke()
      }

      ctx.fillStyle = 'white'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('鹦鹉螺壳', centerX, 40)
      ctx.font = '14px sans-serif'
      ctx.fillText('对数螺旋', centerX, 65)
    } else if (sceneId.includes('galaxy')) {
      // 绘制星系螺旋
      const arms = 2
      const pointsPerArm = 200

      for (let arm = 0; arm < arms; arm++) {
        const armAngle = (arm * 2 * Math.PI) / arms

        for (let i = 0; i < pointsPerArm; i++) {
          const t = i / pointsPerArm
          const theta = t * 4 * Math.PI + armAngle
          const r = 5 + t * 180

          const x = centerX + r * Math.cos(theta)
          const y = centerY + r * Math.sin(theta)

          const size = Math.random() * 2 + 1
          const brightness = Math.random() * 0.5 + 0.5
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // 中心
      ctx.fillStyle = 'rgba(255, 200, 100, 0.8)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'white'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('螺旋星系', centerX, 40)
    } else {
      // 默认：绘制黄金螺旋
      ctx.strokeStyle = '#60a5fa'
      ctx.lineWidth = 3
      ctx.beginPath()

      const a = 5
      const b = Math.log(PHI) / (Math.PI / 2)
      let firstPoint = true

      for (let theta = 0; theta <= 3 * Math.PI; theta += 0.05) {
        const r = a * Math.exp(b * theta)
        const x = centerX + r * Math.cos(theta)
        const y = centerY + r * Math.sin(theta)

        if (firstPoint) {
          ctx.moveTo(x, y)
          firstPoint = false
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      ctx.fillStyle = 'white'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('自然界中的黄金比例', centerX, 40)
    }
  }, [sceneId])

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

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'definition': {
      formula: '\\phi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618',
      description: '黄金比例的定义',
    },
    'ratio': {
      formula: '\\frac{a + b}{a} = \\frac{a}{b} = \\phi',
      description: '黄金比例的比例关系',
    },
    'fibonacci': {
      formula: '\\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\phi',
      description: '斐波那契数列与黄金比例',
    },
    'equation': {
      formula: '\\phi^2 = \\phi + 1',
      description: '黄金比例的方程',
    },
    'spiral': {
      formula: 'r = a \\cdot e^{b\\theta}, \\quad b = \\frac{\\ln \\phi}{\\pi/2}',
      description: '黄金螺旋的极坐标方程',
    },
    'angle': {
      formula: '\\theta = 2\\pi(2 - \\phi) \\approx 137.5°',
      description: '黄金角',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['definition']

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
  const applications: Record<string, { title: string; items: string[]; icon: string }> = {
    'art': {
      title: '艺术中的黄金比例',
      items: ['帕特农神庙', '蒙娜丽莎', '金字塔', '现代建筑'],
      icon: '🎨',
    },
    'design': {
      title: '设计中的应用',
      items: ['Logo 设计', '版面布局', '摄影构图', 'UI/UX 设计'],
      icon: '📐',
    },
    'nature': {
      title: '自然界的黄金比例',
      items: ['向日葵种子', '鹦鹉螺壳', '松果排列', '星系螺旋'],
      icon: '🌻',
    },
    'music': {
      title: '音乐中的黄金比例',
      items: ['乐曲结构', '和声比例', '节奏划分', '音阶关系'],
      icon: '🎵',
    },
  }

  const item = applications[sceneId] || applications['nature']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{item.icon}</div>
      <h2 className="text-3xl font-bold text-white">{item.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {item.items.map((i, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function GoldenRatioSceneRenderer({ scene }: SceneRendererProps) {
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

  // 公式场景
  if (sceneConfig.type === 'formula') {
    if (sceneConfig.id.includes('definition')) {
      return <FormulaScene formulaType="definition" />
    }
    if (sceneConfig.id.includes('ratio')) {
      return <FormulaScene formulaType="ratio" />
    }
    if (sceneConfig.id.includes('fibonacci')) {
      return <FormulaScene formulaType="fibonacci" />
    }
    if (sceneConfig.id.includes('equation')) {
      return <FormulaScene formulaType="equation" />
    }
    if (sceneConfig.id.includes('spiral')) {
      return <FormulaScene formulaType="spiral" />
    }
    if (sceneConfig.id.includes('angle')) {
      return <FormulaScene formulaType="angle" />
    }
    return <FormulaScene formulaType="definition" />
  }

  // 应用场景
  if (sceneConfig.type === 'application') {
    if (sceneConfig.id.includes('art')) {
      return <ApplicationScene sceneId="art" />
    }
    if (sceneConfig.id.includes('design')) {
      return <ApplicationScene sceneId="design" />
    }
    if (sceneConfig.id.includes('music')) {
      return <ApplicationScene sceneId="music" />
    }
    return <ApplicationScene sceneId="nature" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('definition')) {
        return <FormulaScene formulaType="definition" />
      }
      return <GoldenRectangleScene />

    case 'concept':
    case 'rectangle':
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="ratio" />
      }
      if (sceneConfig.id.includes('animate')) {
        return <GoldenRectangleScene animate />
      }
      return <GoldenRectangleScene />

    case 'spiral':
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="spiral" />
      }
      if (sceneConfig.id.includes('animate')) {
        return <GoldenSpiralScene animate />
      }
      return <GoldenSpiralScene />

    case 'fibonacci':
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="fibonacci" />
      }
      if (sceneConfig.id.includes('animate')) {
        return <FibonacciScene animate />
      }
      return <FibonacciScene />

    case 'nature':
      if (sceneConfig.id.includes('flower') || sceneConfig.id.includes('sunflower')) {
        return <NatureScene sceneId="flower" />
      }
      if (sceneConfig.id.includes('shell') || sceneConfig.id.includes('nautilus')) {
        return <NatureScene sceneId="shell" />
      }
      if (sceneConfig.id.includes('galaxy')) {
        return <NatureScene sceneId="galaxy" />
      }
      if (sceneConfig.id.includes('angle')) {
        return <FormulaScene formulaType="angle" />
      }
      return <NatureScene sceneId="nature" />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('fibonacci')) {
        return <FibonacciScene animate />
      }
      if (sceneConfig.id.includes('spiral')) {
        return <GoldenSpiralScene animate />
      }
      if (sceneConfig.id.includes('nature')) {
        return <NatureScene sceneId="flower" />
      }
      return <GoldenRectangleScene animate />

    default:
      return <GoldenRectangleScene />
  }
}
