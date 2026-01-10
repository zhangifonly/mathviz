/**
 * 拉普拉斯变换场景渲染器
 * 渲染时域/S域变换、系统响应、极点零点等
 */

import { useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '拉普拉斯变换', subtitle: '时域与复频域的桥梁' },
    'summary-intro': { title: '总结回顾', subtitle: '拉普拉斯变换的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索系统分析之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '拉普拉斯变换', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 时域信号场景
function TimeDomainScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [funcType, setFuncType] = useState<'step' | 'exp' | 'sine'>('step')

  useEffect(() => {
    const interval = setInterval(() => {
      setFuncType(prev => {
        if (prev === 'step') return 'exp'
        if (prev === 'exp') return 'sine'
        return 'step'
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, height / 2)
    ctx.lineTo(width - padding, height / 2)
    ctx.moveTo(width / 4, padding)
    ctx.lineTo(width / 4, height - padding)
    ctx.stroke()

    // 绘制信号
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()

    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * 6 - 1
      const x = padding + ((t + 1) / 6) * (width - 2 * padding)
      let y: number

      if (funcType === 'step') {
        y = t >= 0 ? 1 : 0
      } else if (funcType === 'exp') {
        y = t >= 0 ? Math.exp(-t) : 0
      } else {
        y = t >= 0 ? Math.sin(2 * t) : 0
      }

      const yCanvas = height / 2 - y * (height / 2 - padding) * 0.8

      if (i === 0) ctx.moveTo(x, yCanvas)
      else ctx.lineTo(x, yCanvas)
    }
    ctx.stroke()

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('t', width - padding + 10, height / 2 + 5)
    ctx.fillText('f(t)', width / 4 - 30, padding - 10)
  }, [funcType])

  const funcInfo: Record<string, { name: string; formula: string }> = {
    step: { name: '单位阶跃', formula: 'u(t)' },
    exp: { name: '指数衰减', formula: 'e^{-t}' },
    sine: { name: '正弦函数', formula: '\\sin(2t)' },
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      <h3 className="text-white text-2xl font-bold">时域信号 f(t)</h3>
      <canvas ref={canvasRef} width={500} height={300} className="border border-white/10 rounded" />
      <div className="p-3 bg-white/10 rounded-lg">
        <MathFormula formula={`f(t) = ${funcInfo[funcType].formula}`} />
      </div>
      <p className="text-white/60 text-sm">{funcInfo[funcType].name}函数</p>
    </div>
  )
}

// S域变换场景
function SDomainScene() {
  const transforms = [
    { time: 'u(t)', s: '\\frac{1}{s}', name: '阶跃' },
    { time: 't', s: '\\frac{1}{s^2}', name: '斜坡' },
    { time: 'e^{at}', s: '\\frac{1}{s-a}', name: '指数' },
    { time: '\\sin(\\omega t)', s: '\\frac{\\omega}{s^2+\\omega^2}', name: '正弦' },
    { time: '\\cos(\\omega t)', s: '\\frac{s}{s^2+\\omega^2}', name: '余弦' },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % transforms.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [transforms.length])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
      <h3 className="text-white text-2xl font-bold">拉普拉斯变换对</h3>

      <div className="flex items-center gap-8">
        <div className="p-6 bg-blue-500/20 rounded-xl border border-blue-500/50">
          <p className="text-blue-300 text-sm mb-2">时域</p>
          <MathFormula formula={`f(t) = ${transforms[currentIndex].time}`} />
        </div>

        <div className="text-4xl text-white">→</div>

        <div className="p-6 bg-purple-500/20 rounded-xl border border-purple-500/50">
          <p className="text-purple-300 text-sm mb-2">S域</p>
          <MathFormula formula={`F(s) = ${transforms[currentIndex].s}`} />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {transforms.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentIndex ? 'bg-white scale-125' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <p className="text-white/60 text-sm">{transforms[currentIndex].name}函数的拉普拉斯变换</p>
    </div>
  )
}

// 系统响应场景
function SystemResponseScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zeta, setZeta] = useState(0.3)

  useEffect(() => {
    const interval = setInterval(() => {
      setZeta(prev => {
        if (prev >= 1.5) return 0.1
        return prev + 0.1
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 稳态值线
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    const y1 = padding + (height - 2 * padding) * 0.1
    ctx.moveTo(padding, y1)
    ctx.lineTo(width - padding, y1)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制响应
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 3
    ctx.beginPath()

    const wn = 2
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * 10
      const x = padding + (t / 10) * (width - 2 * padding)
      let y: number

      if (zeta < 1) {
        const wd = wn * Math.sqrt(1 - zeta * zeta)
        const envelope = Math.exp(-zeta * wn * t)
        y = 1 - envelope * (Math.cos(wd * t) + (zeta * wn / wd) * Math.sin(wd * t))
      } else if (zeta === 1) {
        y = 1 - (1 + wn * t) * Math.exp(-wn * t)
      } else {
        const s1 = -zeta * wn + wn * Math.sqrt(zeta * zeta - 1)
        const s2 = -zeta * wn - wn * Math.sqrt(zeta * zeta - 1)
        y = 1 + (s1 * Math.exp(s2 * t) - s2 * Math.exp(s1 * t)) / (s2 - s1)
      }

      const yCanvas = padding + (1 - y) * (height - 2 * padding) * 0.9

      if (i === 0) ctx.moveTo(x, yCanvas)
      else ctx.lineTo(x, yCanvas)
    }
    ctx.stroke()

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('t', width - padding + 10, height - padding + 20)
    ctx.fillText('y(t)', padding - 35, padding - 10)
    ctx.fillStyle = '#ef4444'
    ctx.fillText('稳态值', width - 80, y1 - 5)
  }, [zeta])

  const dampingType = zeta < 1 ? '欠阻尼' : zeta === 1 ? '临界阻尼' : '过阻尼'

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      <h3 className="text-white text-2xl font-bold">二阶系统阶跃响应</h3>
      <canvas ref={canvasRef} width={500} height={300} className="border border-white/10 rounded" />
      <div className="flex gap-4 items-center">
        <div className="p-3 bg-white/10 rounded-lg">
          <MathFormula formula={`\\zeta = ${zeta.toFixed(1)}`} />
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          zeta < 1 ? 'bg-blue-500' : zeta === 1 ? 'bg-yellow-500' : 'bg-green-500'
        }`}>
          {dampingType}
        </span>
      </div>
    </div>
  )
}

// 极点零点场景
function PoleZeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [poles, setPoles] = useState([
    { real: -1, imag: 2 },
    { real: -1, imag: -2 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setPoles(prev => {
        const newReal = prev[0].real - 0.1
        if (newReal < -3) {
          return [
            { real: -0.5, imag: 2 },
            { real: -0.5, imag: -2 },
          ]
        }
        return [
          { real: newReal, imag: prev[0].imag },
          { real: newReal, imag: -prev[0].imag },
        ]
      })
    }, 500)
    return () => clearInterval(interval)
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
    const scale = 50

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 左半平面（稳定区域）
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)'
    ctx.fillRect(0, 0, centerX, height)

    // 坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // 虚轴标签
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制极点
    poles.forEach(pole => {
      const x = centerX + pole.real * scale
      const y = centerY - pole.imag * scale

      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x - 10, y - 10)
      ctx.lineTo(x + 10, y + 10)
      ctx.moveTo(x + 10, y - 10)
      ctx.lineTo(x - 10, y + 10)
      ctx.stroke()
    })

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('σ', width - 20, centerY - 10)
    ctx.fillText('jω', centerX + 10, 20)
    ctx.fillStyle = '#22c55e'
    ctx.fillText('稳定区域', 20, 30)
  }, [poles])

  const isStable = poles.every(p => p.real < 0)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      <h3 className="text-white text-2xl font-bold">S平面极点分布</h3>
      <canvas ref={canvasRef} width={400} height={300} className="border border-white/10 rounded" />
      <div className={`px-4 py-2 rounded-lg ${isStable ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
        系统{isStable ? '稳定' : '不稳定'}：极点{isStable ? '全部' : '未全部'}在左半平面
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'definition': {
      formula: 'F(s) = \\mathcal{L}\\{f(t)\\} = \\int_0^{\\infty} f(t) e^{-st} dt',
      description: '拉普拉斯变换定义',
    },
    'inverse': {
      formula: 'f(t) = \\mathcal{L}^{-1}\\{F(s)\\} = \\frac{1}{2\\pi j} \\int_{c-j\\infty}^{c+j\\infty} F(s) e^{st} ds',
      description: '拉普拉斯逆变换',
    },
    'derivative': {
      formula: '\\mathcal{L}\\{f\'(t)\\} = sF(s) - f(0)',
      description: '微分性质：时域微分对应S域乘s',
    },
    'transfer': {
      formula: 'H(s) = \\frac{Y(s)}{X(s)} = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}',
      description: '二阶系统传递函数',
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
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '拉普拉斯变换的应用',
      items: ['电路分析', '控制系统', '信号处理', '机械振动'],
      icon: '🔄',
    },
    'app-circuit': {
      title: '电路分析',
      items: ['电阻 R → R', '电容 C → 1/sC', '电感 L → sL'],
      icon: '⚡',
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
            <span className="w-2 h-2 bg-indigo-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function LaplaceSceneRenderer({ scene }: SceneRendererProps) {
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

  if (sceneConfig.type === 'application') {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  if (sceneConfig.type === 'formula') {
    const formulaMap: Record<string, string> = {
      'definition': 'definition',
      'basic-transforms': 'derivative',
      'system-analysis': 'transfer',
    }
    return <FormulaScene formulaType={formulaMap[sectionId] || 'definition'} />
  }

  switch (sectionId) {
    case 'intro':
    case 'definition':
      return <TimeDomainScene />
    case 'basic-transforms':
      return <SDomainScene />
    case 'system-analysis':
      return <SystemResponseScene />
    case 'pole-zero':
      return <PoleZeroScene />
    case 'applications':
      return <ApplicationScene sceneId="app-intro" />
    default:
      return <TimeDomainScene />
  }
}
