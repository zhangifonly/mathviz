/**
 * 复数场景渲染器
 * 渲染复平面、复数运算、欧拉公式等可视化
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '复数与复平面', subtitle: '探索虚数的几何世界' },
    'summary-1': { title: '总结回顾', subtitle: '复数的核心概念' },
    'summary-5': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '复数与复平面', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 复平面场景
function ComplexPlaneScene({ interactive = false, showPoint = true, pointValue = { re: 3, im: 2 } }: {
  interactive?: boolean
  showPoint?: boolean
  pointValue?: { re: number; im: number }
}) {
  const [point, setPoint] = useState(pointValue)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 40 // 每单位的像素数

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
    ctx.lineWidth = 1
    for (let i = -10; i <= 10; i++) {
      // 垂直线
      ctx.beginPath()
      ctx.moveTo(centerX + i * scale, 0)
      ctx.lineTo(centerX + i * scale, height)
      ctx.stroke()
      // 水平线
      ctx.beginPath()
      ctx.moveTo(0, centerY + i * scale)
      ctx.lineTo(width, centerY + i * scale)
      ctx.stroke()
    }

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    // 实轴
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()
    // 虚轴
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // 绘制轴标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('实轴 (Re)', width - 60, centerY - 10)
    ctx.fillText('虚轴 (Im)', centerX + 10, 20)

    // 绘制刻度
    ctx.font = '12px sans-serif'
    for (let i = -5; i <= 5; i++) {
      if (i !== 0) {
        ctx.fillText(i.toString(), centerX + i * scale - 5, centerY + 20)
        ctx.fillText(i.toString(), centerX + 10, centerY - i * scale + 5)
      }
    }

    // 绘制复数点
    if (showPoint) {
      const px = centerX + point.re * scale
      const py = centerY - point.im * scale

      // 绘制从原点到点的向量
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

      // 绘制虚线辅助线
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(px, centerY)
      ctx.lineTo(px, py)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(centerX, py)
      ctx.lineTo(px, py)
      ctx.stroke()
      ctx.setLineDash([])

      // 显示复数值
      ctx.fillStyle = 'white'
      ctx.font = '16px sans-serif'
      const text = `${point.re.toFixed(1)} + ${point.im.toFixed(1)}i`
      ctx.fillText(text, px + 10, py - 10)

      // 显示模和辐角
      const modulus = Math.sqrt(point.re * point.re + point.im * point.im)
      const argument = Math.atan2(point.im, point.re) * 180 / Math.PI
      ctx.font = '14px sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fillText(`|z| = ${modulus.toFixed(2)}`, 10, height - 40)
      ctx.fillText(`arg(z) = ${argument.toFixed(1)}°`, 10, height - 20)
    }
  }, [point, showPoint])

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scale = 40

    const re = (x - centerX) / scale
    const im = -(y - centerY) / scale

    setPoint({ re, im })
  }, [interactive])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="max-w-full border border-white/10 rounded cursor-pointer"
        onClick={handleCanvasClick}
      />
      {interactive && (
        <p className="text-white/60 text-sm">点击画布上的任意位置来改变复数</p>
      )}
    </div>
  )
}

// 复数运算场景（加法、乘法）
function OperationScene({ operation = 'multiply' }: { operation?: 'add' | 'multiply' }) {
  const [angle, setAngle] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    const scale = 60

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

    if (operation === 'multiply') {
      // 乘法：旋转和缩放
      const z1 = { re: 2, im: 1 }
      const angleRad = angle * Math.PI / 180
      const z2 = { re: Math.cos(angleRad), im: Math.sin(angleRad) }
      const result = {
        re: z1.re * z2.re - z1.im * z2.im,
        im: z1.re * z2.im + z1.im * z2.re
      }

      // 绘制 z1
      const p1x = centerX + z1.re * scale
      const p1y = centerY - z1.im * scale
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(p1x, p1y)
      ctx.stroke()
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.arc(p1x, p1y, 5, 0, 2 * Math.PI)
      ctx.fill()

      // 绘制 z2
      const p2x = centerX + z2.re * scale
      const p2y = centerY - z2.im * scale
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(p2x, p2y)
      ctx.stroke()
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.arc(p2x, p2y, 5, 0, 2 * Math.PI)
      ctx.fill()

      // 绘制结果
      const prx = centerX + result.re * scale
      const pry = centerY - result.im * scale
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(prx, pry)
      ctx.stroke()
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(prx, pry, 6, 0, 2 * Math.PI)
      ctx.fill()

      // 标签
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText('z₁', p1x + 10, p1y)
      ctx.fillText('z₂', p2x + 10, p2y)
      ctx.fillText('z₁ × z₂', prx + 10, pry)
    } else {
      // 加法：向量相加
      const z1 = { re: 2, im: 1 }
      const angleRad = angle * Math.PI / 180
      const z2 = { re: Math.cos(angleRad) * 1.5, im: Math.sin(angleRad) * 1.5 }
      const result = { re: z1.re + z2.re, im: z1.im + z2.im }

      // 绘制 z1
      const p1x = centerX + z1.re * scale
      const p1y = centerY - z1.im * scale
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(p1x, p1y)
      ctx.stroke()

      // 绘制 z2（从原点）
      const p2x = centerX + z2.re * scale
      const p2y = centerY - z2.im * scale
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(p2x, p2y)
      ctx.stroke()

      // 绘制 z2（从 z1 的终点）
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(p1x, p1y)
      ctx.lineTo(p1x + z2.re * scale, p1y - z2.im * scale)
      ctx.stroke()
      ctx.setLineDash([])

      // 绘制结果
      const prx = centerX + result.re * scale
      const pry = centerY - result.im * scale
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(prx, pry)
      ctx.stroke()
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(prx, pry, 6, 0, 2 * Math.PI)
      ctx.fill()

      // 标签
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText('z₁', p1x / 2 + centerX / 2, p1y / 2 + centerY / 2)
      ctx.fillText('z₂', p2x / 2 + centerX / 2, p2y / 2 + centerY / 2)
      ctx.fillText('z₁ + z₂', prx + 10, pry)
    }
  }, [angle, operation])

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

// 欧拉公式可视化场景
function EulerScene({ animate = true }: { animate?: boolean }) {
  const [theta, setTheta] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!animate) return
    const timer = setInterval(() => {
      setTheta(t => (t + 0.02) % (2 * Math.PI))
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
    const centerX = width / 2
    const centerY = height / 2
    const radius = 150

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制单位圆
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // 计算点的位置
    const x = Math.cos(theta)
    const y = Math.sin(theta)
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

    // 绘制投影线
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(px, centerY)
    ctx.lineTo(px, py)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX, py)
    ctx.lineTo(px, py)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制角度弧
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, -theta, true)
    ctx.stroke()

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('cos θ', px, centerY + 20)
    ctx.fillText('sin θ', centerX - 40, py)
    ctx.fillText(`θ = ${(theta * 180 / Math.PI).toFixed(1)}°`, centerX + 50, centerY - 30)

    // 显示欧拉公式
    ctx.font = '16px sans-serif'
    ctx.fillText(`e^(iθ) = ${x.toFixed(2)} + ${y.toFixed(2)}i`, 10, height - 20)
  }, [theta])

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
    'imaginary-unit': {
      formula: 'i^2 = -1',
      description: '虚数单位的定义',
    },
    'complex-form': {
      formula: 'z = a + bi',
      description: '复数的代数形式',
    },
    'modulus': {
      formula: '|z| = \\sqrt{a^2 + b^2}',
      description: '复数的模',
    },
    'polar-form': {
      formula: 'z = r(\\cos\\theta + i\\sin\\theta)',
      description: '复数的极坐标形式',
    },
    'euler': {
      formula: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta',
      description: '欧拉公式',
    },
    'euler-identity': {
      formula: 'e^{i\\pi} + 1 = 0',
      description: '欧拉恒等式',
    },
    'multiplication': {
      formula: 'z_1 \\cdot z_2 = r_1 r_2 \\cdot e^{i(\\theta_1 + \\theta_2)}',
      description: '复数乘法：模相乘，辐角相加',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['complex-form']

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
      title: '复数的应用',
      items: ['电气工程', '量子力学', '信号处理', '流体力学'],
      icon: '⚡',
    },
    'applications-2': {
      title: '电气工程',
      items: ['交流电路分析', '阻抗计算', '相位关系', '功率因数'],
      icon: '🔌',
    },
    'applications-3': {
      title: '量子力学',
      items: ['波函数', '薛定谔方程', '概率幅', '量子态叠加'],
      icon: '⚛️',
    },
    'applications-4': {
      title: '信号处理',
      items: ['傅里叶变换', '频域分析', '滤波器设计', '调制解调'],
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
export default function ComplexSceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('euler')) {
      return <FormulaScene formulaType="euler" />
    }
    return <FormulaScene formulaType="complex-form" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id === 'intro-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id.includes('imaginary')) {
        return <FormulaScene formulaType="imaginary-unit" />
      }
      return <ComplexPlaneScene showPoint={false} />

    case 'imaginary-unit':
      if (sceneConfig.id.includes('1')) {
        return <FormulaScene formulaType="imaginary-unit" />
      }
      return <ComplexPlaneScene showPoint pointValue={{ re: 0, im: 2 }} />

    case 'complex-number':
      if (sceneConfig.id.includes('1')) {
        return <FormulaScene formulaType="complex-form" />
      }
      return <ComplexPlaneScene showPoint pointValue={{ re: 3, im: 2 }} />

    case 'complex-plane':
      if (sceneConfig.id.includes('4')) {
        return <ComplexPlaneScene interactive />
      }
      return <ComplexPlaneScene showPoint pointValue={{ re: 3, im: 2 }} />

    case 'modulus-argument':
      if (sceneConfig.id.includes('1') || sceneConfig.id.includes('2')) {
        return <FormulaScene formulaType="modulus" />
      }
      if (sceneConfig.id.includes('4')) {
        return <FormulaScene formulaType="polar-form" />
      }
      return <ComplexPlaneScene showPoint pointValue={{ re: 3, im: 4 }} />

    case 'euler-formula':
      if (sceneConfig.id.includes('3')) {
        return <FormulaScene formulaType="euler-identity" />
      }
      if (sceneConfig.id.includes('1') || sceneConfig.id.includes('2')) {
        return <FormulaScene formulaType="euler" />
      }
      return <EulerScene animate />

    case 'multiplication':
      if (sceneConfig.id.includes('2')) {
        return <FormulaScene formulaType="multiplication" />
      }
      if (sceneConfig.id.includes('4') || sceneConfig.id.includes('5')) {
        return <OperationScene operation="multiply" />
      }
      return <OperationScene operation="multiply" />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id === 'summary-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id.includes('2')) {
        return <ComplexPlaneScene showPoint pointValue={{ re: 3, im: 2 }} />
      }
      if (sceneConfig.id.includes('3')) {
        return <FormulaScene formulaType="modulus" />
      }
      if (sceneConfig.id.includes('4')) {
        return <OperationScene operation="multiply" />
      }
      return <TitleScene sceneId="summary-5" />

    default:
      return <ComplexPlaneScene />
  }
}
