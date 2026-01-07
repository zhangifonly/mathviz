/**
 * 傅里叶级数场景渲染器
 * 渲染方波、三角波、锯齿波的傅里叶级数展开及谐波叠加动画
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 波形类型
type WaveType = 'square' | 'triangle' | 'sawtooth'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '傅里叶级数', subtitle: '将周期函数分解为正弦波的和' },
    'summary-intro': { title: '总结回顾', subtitle: '傅里叶级数的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索频域的奥秘' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '傅里叶级数', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 波形展示场景
function WaveformScene({ waveType = 'square', terms = 1 }: { waveType?: WaveType; terms?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 计算傅里叶级数
  const fourierSeries = useCallback((x: number, type: WaveType, n: number): number => {
    let sum = 0

    switch (type) {
      case 'square':
        // 方波: f(x) = (4/π) * Σ[sin((2k-1)x) / (2k-1)]
        for (let k = 1; k <= n; k++) {
          sum += Math.sin((2 * k - 1) * x) / (2 * k - 1)
        }
        return (4 / Math.PI) * sum

      case 'triangle':
        // 三角波: f(x) = (8/π²) * Σ[(-1)^(k-1) * sin((2k-1)x) / (2k-1)²]
        for (let k = 1; k <= n; k++) {
          const sign = Math.pow(-1, k - 1)
          sum += sign * Math.sin((2 * k - 1) * x) / Math.pow(2 * k - 1, 2)
        }
        return (8 / (Math.PI * Math.PI)) * sum

      case 'sawtooth':
        // 锯齿波: f(x) = (2/π) * Σ[(-1)^(k+1) * sin(kx) / k]
        for (let k = 1; k <= n; k++) {
          const sign = Math.pow(-1, k + 1)
          sum += sign * Math.sin(k * x) / k
        }
        return (2 / Math.PI) * sum

      default:
        return 0
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2
    const amplitude = height * 0.35
    const padding = 40

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, centerY)
    ctx.lineTo(width - padding, centerY)
    ctx.stroke()

    // 绘制波形
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2.5
    ctx.beginPath()

    const xScale = (width - 2 * padding) / (4 * Math.PI)
    for (let px = 0; px < width - 2 * padding; px++) {
      const x = (px / xScale)
      const y = fourierSeries(x, waveType, terms)
      const canvasX = padding + px
      const canvasY = centerY - y * amplitude

      if (px === 0) {
        ctx.moveTo(canvasX, canvasY)
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }
    ctx.stroke()

    // 绘制标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('0', padding - 10, centerY + 20)
    ctx.fillText('2π', width / 2 - 10, centerY + 20)
    ctx.fillText('4π', width - padding - 10, centerY + 20)

    // 显示谐波数量
    ctx.font = '16px sans-serif'
    ctx.fillText(`谐波数量: ${terms}`, padding, 30)

    // 显示波形类型
    const waveNames: Record<WaveType, string> = {
      square: '方波',
      triangle: '三角波',
      sawtooth: '锯齿波',
    }
    ctx.fillText(`波形: ${waveNames[waveType]}`, padding, 55)
  }, [waveType, terms, fourierSeries])

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

// 谐波叠加动画场景
function HarmonicScene({ waveType = 'square', maxTerms = 5 }: { waveType?: WaveType; maxTerms?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentTerms, setCurrentTerms] = useState(1)

  // 自动增加谐波数量
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTerms(n => (n < maxTerms ? n + 1 : 1))
    }, 1500)
    return () => clearInterval(timer)
  }, [maxTerms])

  // 计算单个谐波
  const getHarmonic = useCallback((x: number, k: number, type: WaveType): number => {
    switch (type) {
      case 'square':
        return (4 / Math.PI) * Math.sin((2 * k - 1) * x) / (2 * k - 1)
      case 'triangle':
        const sign = Math.pow(-1, k - 1)
        return (8 / (Math.PI * Math.PI)) * sign * Math.sin((2 * k - 1) * x) / Math.pow(2 * k - 1, 2)
      case 'sawtooth':
        const sawSign = Math.pow(-1, k + 1)
        return (2 / Math.PI) * sawSign * Math.sin(k * x) / k
      default:
        return 0
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2
    const amplitude = height * 0.3
    const padding = 40

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, centerY)
    ctx.lineTo(width - padding, centerY)
    ctx.stroke()

    const xScale = (width - 2 * padding) / (4 * Math.PI)
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

    // 绘制各个谐波
    for (let k = 1; k <= currentTerms; k++) {
      ctx.strokeStyle = colors[(k - 1) % colors.length]
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.5
      ctx.beginPath()

      for (let px = 0; px < width - 2 * padding; px++) {
        const x = px / xScale
        const y = getHarmonic(x, k, waveType)
        const canvasX = padding + px
        const canvasY = centerY - y * amplitude

        if (px === 0) {
          ctx.moveTo(canvasX, canvasY)
        } else {
          ctx.lineTo(canvasX, canvasY)
        }
      }
      ctx.stroke()
    }

    // 绘制叠加后的波形
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2.5
    ctx.beginPath()

    for (let px = 0; px < width - 2 * padding; px++) {
      const x = px / xScale
      let sum = 0
      for (let k = 1; k <= currentTerms; k++) {
        sum += getHarmonic(x, k, waveType)
      }
      const canvasX = padding + px
      const canvasY = centerY - sum * amplitude

      if (px === 0) {
        ctx.moveTo(canvasX, canvasY)
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }
    ctx.stroke()

    // 显示信息
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.fillText(`当前谐波: ${currentTerms}`, padding, 30)
  }, [currentTerms, waveType, getHarmonic])

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

// 频谱图场景
function SpectrumScene({ waveType = 'square', terms = 10 }: { waveType?: WaveType; terms?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 计算谐波幅度
  const getAmplitude = useCallback((k: number, type: WaveType): number => {
    switch (type) {
      case 'square':
        return (4 / Math.PI) / (2 * k - 1)
      case 'triangle':
        return (8 / (Math.PI * Math.PI)) / Math.pow(2 * k - 1, 2)
      case 'sawtooth':
        return (2 / Math.PI) / k
      default:
        return 0
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 50
    const barWidth = (width - 2 * padding) / terms

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(padding, padding)
    ctx.stroke()

    // 找出最大幅度用于归一化
    let maxAmp = 0
    for (let k = 1; k <= terms; k++) {
      const amp = Math.abs(getAmplitude(k, waveType))
      if (amp > maxAmp) maxAmp = amp
    }

    // 绘制频谱柱状图
    const availableHeight = height - 2 * padding
    for (let k = 1; k <= terms; k++) {
      const amp = Math.abs(getAmplitude(k, waveType))
      const normalizedAmp = amp / maxAmp
      const barHeight = normalizedAmp * availableHeight

      const x = padding + (k - 0.5) * barWidth - barWidth * 0.4
      const y = height - padding - barHeight

      // 渐变色
      const hue = (k / terms) * 240
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
      ctx.fillRect(x, y, barWidth * 0.8, barHeight)

      // 绘制频率标签
      ctx.fillStyle = 'white'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      const freq = waveType === 'sawtooth' ? k : (2 * k - 1)
      ctx.fillText(`${freq}`, padding + (k - 0.5) * barWidth, height - padding + 20)
    }

    // 坐标轴标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('频率 (谐波次数)', width / 2, height - 10)

    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('幅度', 0, 0)
    ctx.restore()

    // 标题
    const waveNames: Record<WaveType, string> = {
      square: '方波',
      triangle: '三角波',
      sawtooth: '锯齿波',
    }
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`${waveNames[waveType]}频谱`, padding, 30)
  }, [waveType, terms, getAmplitude])

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
    'general': {
      formula: 'f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left( a_n \\cos(nx) + b_n \\sin(nx) \\right)',
      description: '傅里叶级数的一般形式',
    },
    'square': {
      formula: 'f(x) = \\frac{4}{\\pi} \\sum_{k=1}^{\\infty} \\frac{\\sin((2k-1)x)}{2k-1}',
      description: '方波的傅里叶级数展开',
    },
    'triangle': {
      formula: 'f(x) = \\frac{8}{\\pi^2} \\sum_{k=1}^{\\infty} \\frac{(-1)^{k-1} \\sin((2k-1)x)}{(2k-1)^2}',
      description: '三角波的傅里叶级数展开',
    },
    'sawtooth': {
      formula: 'f(x) = \\frac{2}{\\pi} \\sum_{k=1}^{\\infty} \\frac{(-1)^{k+1} \\sin(kx)}{k}',
      description: '锯齿波的傅里叶级数展开',
    },
    'coefficients': {
      formula: 'a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos(nx) dx, \\quad b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\sin(nx) dx',
      description: '傅里叶系数的计算公式',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['general']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur max-w-3xl">
        <MathFormula formula={formula} className="text-xl" />
      </div>
      <p className="text-white/70 text-lg text-center max-w-2xl">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '傅里叶级数的应用',
      items: ['信号处理', '音频压缩', '图像处理', '通信系统'],
      icon: '📡',
    },
    'app-signal': {
      title: '信号处理',
      items: ['频谱分析', '滤波器设计', '噪声消除', '特征提取'],
      icon: '📊',
    },
    'app-audio': {
      title: '音频处理',
      items: ['MP3 压缩', '音效合成', '均衡器', '音高检测'],
      icon: '🎵',
    },
    'app-image': {
      title: '图像处理',
      items: ['JPEG 压缩', '边缘检测', '图像增强', '纹理分析'],
      icon: '🖼️',
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
export default function FourierSeriesSceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('square')) {
      return <FormulaScene formulaType="square" />
    }
    if (sceneConfig.id.includes('triangle')) {
      return <FormulaScene formulaType="triangle" />
    }
    if (sceneConfig.id.includes('sawtooth')) {
      return <FormulaScene formulaType="sawtooth" />
    }
    if (sceneConfig.id.includes('coefficient')) {
      return <FormulaScene formulaType="coefficients" />
    }
    return <FormulaScene formulaType="general" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('periodic')) {
        return <WaveformScene waveType="square" terms={1} />
      }
      if (sceneConfig.id.includes('decompose')) {
        return <HarmonicScene waveType="square" maxTerms={5} />
      }
      return <WaveformScene waveType="square" terms={3} />

    case 'concept':
      if (sceneConfig.id.includes('sine')) {
        return <WaveformScene waveType="square" terms={1} />
      }
      if (sceneConfig.id.includes('superposition')) {
        return <HarmonicScene waveType="square" maxTerms={7} />
      }
      return <FormulaScene formulaType="general" />

    case 'square':
      const squareTerms = (lineState?.params?.terms as number) || 5
      if (sceneConfig.id.includes('spectrum')) {
        return <SpectrumScene waveType="square" terms={10} />
      }
      if (sceneConfig.id.includes('animation')) {
        return <HarmonicScene waveType="square" maxTerms={7} />
      }
      return <WaveformScene waveType="square" terms={squareTerms} />

    case 'triangle':
      const triangleTerms = (lineState?.params?.terms as number) || 5
      if (sceneConfig.id.includes('spectrum')) {
        return <SpectrumScene waveType="triangle" terms={10} />
      }
      if (sceneConfig.id.includes('animation')) {
        return <HarmonicScene waveType="triangle" maxTerms={7} />
      }
      return <WaveformScene waveType="triangle" terms={triangleTerms} />

    case 'sawtooth':
      const sawtoothTerms = (lineState?.params?.terms as number) || 5
      if (sceneConfig.id.includes('spectrum')) {
        return <SpectrumScene waveType="sawtooth" terms={10} />
      }
      if (sceneConfig.id.includes('animation')) {
        return <HarmonicScene waveType="sawtooth" maxTerms={7} />
      }
      return <WaveformScene waveType="sawtooth" terms={sawtoothTerms} />

    case 'spectrum':
      if (sceneConfig.id.includes('square')) {
        return <SpectrumScene waveType="square" terms={10} />
      }
      if (sceneConfig.id.includes('triangle')) {
        return <SpectrumScene waveType="triangle" terms={10} />
      }
      if (sceneConfig.id.includes('sawtooth')) {
        return <SpectrumScene waveType="sawtooth" terms={10} />
      }
      return <SpectrumScene waveType="square" terms={10} />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('convergence')) {
        return <HarmonicScene waveType="square" maxTerms={10} />
      }
      if (sceneConfig.id.includes('spectrum')) {
        return <SpectrumScene waveType="square" terms={10} />
      }
      return <WaveformScene waveType="square" terms={10} />

    default:
      return <WaveformScene waveType="square" terms={5} />
  }
}
