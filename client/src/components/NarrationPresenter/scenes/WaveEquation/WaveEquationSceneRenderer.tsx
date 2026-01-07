/**
 * 波动方程场景渲染器
 * 实现弦振动、驻波、波的叠加等可视化
 */

import { useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '波动方程', subtitle: '描述波的传播与振动' },
    'summary-intro': { title: '总结回顾', subtitle: '波动方程的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索波的奥秘' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '波动方程', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 弦振动动画场景
function StringVibrationScene({
  frequency = 1,
  amplitude = 50,
  showEnvelope = false
}: {
  frequency?: number
  amplitude?: number
  showEnvelope?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t + 0.05)
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
    const centerY = height / 2
    const padding = 40

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制中心线
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding, centerY)
    ctx.lineTo(width - padding, centerY)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制弦的固定端点
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(padding, centerY, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(width - padding, centerY, 6, 0, Math.PI * 2)
    ctx.fill()

    // 绘制振动的弦
    const stringLength = width - 2 * padding
    const waveNumber = (2 * Math.PI * frequency) / stringLength
    const omega = 2 * Math.PI * frequency

    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()

    for (let x = 0; x <= stringLength; x += 2) {
      const realX = padding + x
      const y = amplitude * Math.sin(waveNumber * x) * Math.cos(omega * time)
      const realY = centerY + y

      if (x === 0) {
        ctx.moveTo(realX, realY)
      } else {
        ctx.lineTo(realX, realY)
      }
    }
    ctx.stroke()

    // 绘制包络线（如果启用）
    if (showEnvelope) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])

      // 上包络
      ctx.beginPath()
      for (let x = 0; x <= stringLength; x += 2) {
        const realX = padding + x
        const y = amplitude * Math.sin(waveNumber * x)
        const realY = centerY + y
        if (x === 0) ctx.moveTo(realX, realY)
        else ctx.lineTo(realX, realY)
      }
      ctx.stroke()

      // 下包络
      ctx.beginPath()
      for (let x = 0; x <= stringLength; x += 2) {
        const realX = padding + x
        const y = -amplitude * Math.sin(waveNumber * x)
        const realY = centerY + y
        if (x === 0) ctx.moveTo(realX, realY)
        else ctx.lineTo(realX, realY)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }

    // 绘制标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('固定端', padding - 30, centerY - 15)
    ctx.fillText('固定端', width - padding - 30, centerY - 15)
    ctx.fillText(`频率: ${frequency} Hz`, width / 2 - 40, 30)

  }, [time, frequency, amplitude, showEnvelope])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={300}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 驻波演示场景
function StandingWaveScene({ mode = 1 }: { mode?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t + 0.05)
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
    const centerY = height / 2
    const padding = 40

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制中心线
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding, centerY)
    ctx.lineTo(width - padding, centerY)
    ctx.stroke()
    ctx.setLineDash([])

    const stringLength = width - 2 * padding
    const amplitude = 50
    const waveNumber = (mode * Math.PI) / stringLength
    const omega = mode * Math.PI

    // 绘制驻波
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()

    for (let x = 0; x <= stringLength; x += 2) {
      const realX = padding + x
      const y = amplitude * Math.sin(waveNumber * x) * Math.cos(omega * time)
      const realY = centerY + y

      if (x === 0) {
        ctx.moveTo(realX, realY)
      } else {
        ctx.lineTo(realX, realY)
      }
    }
    ctx.stroke()

    // 标记节点（振幅为0的点）
    ctx.fillStyle = '#ef4444'
    for (let n = 0; n <= mode; n++) {
      const x = padding + (n * stringLength) / mode
      ctx.beginPath()
      ctx.arc(x, centerY, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    // 标记腹点（振幅最大的点）
    ctx.fillStyle = '#22c55e'
    for (let n = 0; n < mode; n++) {
      const x = padding + ((n + 0.5) * stringLength) / mode
      const y = centerY + amplitude * Math.sin(waveNumber * (x - padding)) * Math.cos(omega * time)
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    // 绘制标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText(`第 ${mode} 模态`, width / 2 - 30, 30)
    ctx.fillText('节点', padding + 10, centerY + 25)
    ctx.fillText('腹点', padding + stringLength / (2 * mode) - 15, centerY - 70)

  }, [time, mode])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={700}
        height={300}
        className="max-w-full border border-white/10 rounded"
      />
      <div className="flex gap-4 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span>节点（不动点）</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>腹点（最大振幅）</span>
        </div>
      </div>
    </div>
  )
}

// 波的叠加场景
function SuperpositionScene({
  showComponents = true
}: {
  showComponents?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t + 0.05)
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
    const padding = 40
    const sectionHeight = height / 3

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    const stringLength = width - 2 * padding
    const amplitude = 30

    // 绘制第一个波（向右传播）
    if (showComponents) {
      const centerY1 = sectionHeight / 2
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let x = 0; x <= stringLength; x += 2) {
        const realX = padding + x
        const k = 2 * Math.PI / 200
        const omega = 2 * Math.PI / 2
        const y = amplitude * Math.sin(k * x - omega * time)
        const realY = centerY1 + y

        if (x === 0) ctx.moveTo(realX, realY)
        else ctx.lineTo(realX, realY)
      }
      ctx.stroke()

      // 标签
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'
      ctx.font = '12px sans-serif'
      ctx.fillText('波1 (向右)', padding, centerY1 - 50)
      ctx.fillText('→', width - padding - 20, centerY1)
    }

    // 绘制第二个波（向左传播）
    if (showComponents) {
      const centerY2 = sectionHeight * 1.5
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let x = 0; x <= stringLength; x += 2) {
        const realX = padding + x
        const k = 2 * Math.PI / 200
        const omega = 2 * Math.PI / 2
        const y = amplitude * Math.sin(k * x + omega * time)
        const realY = centerY2 + y

        if (x === 0) ctx.moveTo(realX, realY)
        else ctx.lineTo(realX, realY)
      }
      ctx.stroke()

      // 标签
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'
      ctx.font = '12px sans-serif'
      ctx.fillText('波2 (向左)', padding, centerY2 - 50)
      ctx.fillText('←', padding + 10, centerY2)
    }

    // 绘制叠加后的波
    const centerY3 = sectionHeight * 2.5
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 3
    ctx.beginPath()

    for (let x = 0; x <= stringLength; x += 2) {
      const realX = padding + x
      const k = 2 * Math.PI / 200
      const omega = 2 * Math.PI / 2
      const y1 = amplitude * Math.sin(k * x - omega * time)
      const y2 = amplitude * Math.sin(k * x + omega * time)
      const y = y1 + y2
      const realY = centerY3 + y

      if (x === 0) ctx.moveTo(realX, realY)
      else ctx.lineTo(realX, realY)
    }
    ctx.stroke()

    // 标签
    ctx.fillStyle = '#22c55e'
    ctx.font = '14px sans-serif'
    ctx.fillText('叠加波 (驻波)', padding, centerY3 - 50)

    // 绘制分隔线
    if (showComponents) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, sectionHeight)
      ctx.lineTo(width, sectionHeight)
      ctx.moveTo(0, sectionHeight * 2)
      ctx.lineTo(width, sectionHeight * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }

  }, [time, showComponents])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'wave-equation': {
      formula: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}',
      description: '一维波动方程 - 描述波的传播',
    },
    'solution': {
      formula: 'u(x,t) = A \\sin(kx - \\omega t + \\phi)',
      description: '行波解 - 沿x轴传播的波',
    },
    'standing-wave': {
      formula: 'u(x,t) = A \\sin(kx) \\cos(\\omega t)',
      description: '驻波解 - 两个反向传播波的叠加',
    },
    'dispersion': {
      formula: 'v = \\frac{\\omega}{k} = \\sqrt{\\frac{T}{\\mu}}',
      description: '波速公式 - 取决于张力和线密度',
    },
    'energy': {
      formula: 'E = \\frac{1}{2}\\mu \\omega^2 A^2',
      description: '波的能量 - 与振幅平方成正比',
    },
    'superposition': {
      formula: 'u_{total} = u_1 + u_2',
      description: '叠加原理 - 波可以线性叠加',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['wave-equation']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg text-center max-w-xl">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '波动方程的应用',
      items: ['乐器设计', '地震波分析', '声学工程', '光纤通信'],
      icon: '🎵',
    },
    'app-music': {
      title: '乐器设计',
      items: ['弦乐器的音高控制', '管乐器的共鸣', '打击乐器的振动模式'],
      icon: '🎸',
    },
    'app-seismic': {
      title: '地震波分析',
      items: ['地震预警系统', '地质勘探', '建筑抗震设计'],
      icon: '🌊',
    },
    'app-acoustics': {
      title: '声学工程',
      items: ['音乐厅设计', '噪音控制', '超声波应用'],
      icon: '🔊',
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

// 波形对比场景
function WaveComparisonScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t + 0.05)
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
    const padding = 40
    const rowHeight = height / 3

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    const stringLength = width - 2 * padding
    const amplitude = 40

    // 绘制三种模态
    const modes = [1, 2, 3]
    const colors = ['#3b82f6', '#ef4444', '#22c55e']

    modes.forEach((mode, index) => {
      const centerY = rowHeight * (index + 0.5)
      const waveNumber = (mode * Math.PI) / stringLength
      const omega = mode * Math.PI

      // 中心线
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(padding, centerY)
      ctx.lineTo(width - padding, centerY)
      ctx.stroke()
      ctx.setLineDash([])

      // 波形
      ctx.strokeStyle = colors[index]
      ctx.lineWidth = 2.5
      ctx.beginPath()

      for (let x = 0; x <= stringLength; x += 2) {
        const realX = padding + x
        const y = amplitude * Math.sin(waveNumber * x) * Math.cos(omega * time)
        const realY = centerY + y

        if (x === 0) ctx.moveTo(realX, realY)
        else ctx.lineTo(realX, realY)
      }
      ctx.stroke()

      // 标签
      ctx.fillStyle = colors[index]
      ctx.font = '14px sans-serif'
      ctx.fillText(`模态 ${mode}`, padding, centerY - 60)
      ctx.fillText(`频率: ${mode}f₀`, width - padding - 60, centerY - 60)
    })

  }, [time])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 主渲染器
export default function WaveEquationSceneRenderer({ scene }: SceneRendererProps) {
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
      if (sceneConfig.id.includes('string') || sceneConfig.id.includes('vibration')) {
        return <StringVibrationScene frequency={1} amplitude={50} />
      }
      if (sceneConfig.id.includes('wave')) {
        return <StringVibrationScene frequency={2} amplitude={40} />
      }
      return <StringVibrationScene />

    case 'concept':
      if (sceneConfig.id.includes('equation') || sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="wave-equation" />
      }
      if (sceneConfig.id.includes('solution')) {
        return <FormulaScene formulaType="solution" />
      }
      if (sceneConfig.id.includes('string')) {
        return <StringVibrationScene frequency={1} amplitude={50} showEnvelope />
      }
      return <FormulaScene formulaType="wave-equation" />

    case 'standing-wave':
      if (sceneConfig.id.includes('mode-1') || sceneConfig.id.includes('first')) {
        return <StandingWaveScene mode={1} />
      }
      if (sceneConfig.id.includes('mode-2') || sceneConfig.id.includes('second')) {
        return <StandingWaveScene mode={2} />
      }
      if (sceneConfig.id.includes('mode-3') || sceneConfig.id.includes('third')) {
        return <StandingWaveScene mode={3} />
      }
      if (sceneConfig.id.includes('comparison') || sceneConfig.id.includes('modes')) {
        return <WaveComparisonScene />
      }
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="standing-wave" />
      }
      return <StandingWaveScene mode={1} />

    case 'superposition':
      if (sceneConfig.id.includes('principle') || sceneConfig.id.includes('intro')) {
        return <SuperpositionScene showComponents={true} />
      }
      if (sceneConfig.id.includes('result') || sceneConfig.id.includes('standing')) {
        return <SuperpositionScene showComponents={false} />
      }
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="superposition" />
      }
      return <SuperpositionScene />

    case 'properties':
      if (sceneConfig.id.includes('speed') || sceneConfig.id.includes('velocity')) {
        return <FormulaScene formulaType="dispersion" />
      }
      if (sceneConfig.id.includes('energy')) {
        return <FormulaScene formulaType="energy" />
      }
      if (sceneConfig.id.includes('frequency')) {
        return <WaveComparisonScene />
      }
      return <StringVibrationScene />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('equation')) {
        return <FormulaScene formulaType="wave-equation" />
      }
      if (sceneConfig.id.includes('standing')) {
        return <StandingWaveScene mode={2} />
      }
      if (sceneConfig.id.includes('superposition')) {
        return <SuperpositionScene />
      }
      return <StringVibrationScene />

    default:
      return <StringVibrationScene />
  }
}
