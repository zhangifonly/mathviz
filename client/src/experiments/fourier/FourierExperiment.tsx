import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { fourierNarration } from '../../narrations/scripts/fourier'

type WaveType = 'sine' | 'square' | 'sawtooth' | 'triangle'

export default function FourierExperiment() {
  const [params, setParams] = useState({
    frequency: 2,
    amplitude: 1,
    terms: 5,
    waveType: 'square' as WaveType,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [showPresenter, setShowPresenter] = useState(false)
  const animationRef = useRef<number | null>(null)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(fourierNarration)
    }
  }, [narration])

  // 开始讲解 - 进入全屏 PPT 模式
  const handleStartNarration = useCallback(() => {
    if (narration) {
      narration.startNarration()
      narration.setPresenterMode(true)
      setShowPresenter(true)
    }
  }, [narration])

  // 退出讲解
  const handleExitPresenter = useCallback(() => {
    if (narration) {
      narration.setPresenterMode(false)
    }
    setShowPresenter(false)
  }, [narration])

  // 动画效果：逐步增加傅里叶项数
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setParams((prev) => {
        const nextTerms = prev.terms + 1
        if (nextTerms > 50) {
          setIsAnimating(false)
          return { ...prev, terms: 50 }
        }
        return { ...prev, terms: nextTerms }
      })
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 200) as unknown as number
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating])

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const { timeData, frequencyData, fourierApprox } = useMemo(() => {
    const N = 512
    const t: number[] = []
    const original: number[] = []
    const approx: number[] = []

    for (let i = 0; i < N; i++) {
      const x = (i / N) * 2 * Math.PI
      t.push(x)

      let y = 0
      if (params.waveType === 'sine') {
        y = params.amplitude * Math.sin(params.frequency * x)
      } else if (params.waveType === 'square') {
        y = params.amplitude * Math.sign(Math.sin(params.frequency * x))
      } else if (params.waveType === 'sawtooth') {
        y = params.amplitude * (2 * ((params.frequency * x / (2 * Math.PI)) % 1) - 1)
      } else if (params.waveType === 'triangle') {
        y = params.amplitude * (2 * Math.abs(2 * ((params.frequency * x / (2 * Math.PI)) % 1) - 1) - 1)
      }
      original.push(y)

      let fourierSum = 0
      for (let n = 1; n <= params.terms; n++) {
        if (params.waveType === 'sine') {
          fourierSum = params.amplitude * Math.sin(params.frequency * x)
          break
        } else if (params.waveType === 'square') {
          const k = 2 * n - 1
          fourierSum += (4 / Math.PI) * (1 / k) * Math.sin(k * params.frequency * x)
        } else if (params.waveType === 'sawtooth') {
          fourierSum += (2 / Math.PI) * (Math.pow(-1, n + 1) / n) * Math.sin(n * params.frequency * x)
        } else if (params.waveType === 'triangle') {
          const k = 2 * n - 1
          fourierSum += (8 / (Math.PI * Math.PI)) * (Math.pow(-1, n + 1) / (k * k)) * Math.sin(k * params.frequency * x)
        }
      }
      approx.push(fourierSum * params.amplitude)
    }

    const freqBins: number[] = []
    const magnitudes: number[] = []
    for (let n = 1; n <= 10; n++) {
      freqBins.push(n * params.frequency)
      let mag = 0
      if (params.waveType === 'square' && n % 2 === 1) {
        mag = (4 / Math.PI) * (1 / n)
      } else if (params.waveType === 'sawtooth') {
        mag = (2 / Math.PI) * (1 / n)
      } else if (params.waveType === 'triangle' && n % 2 === 1) {
        mag = (8 / (Math.PI * Math.PI)) * (1 / (n * n))
      } else if (params.waveType === 'sine' && n === 1) {
        mag = 1
      }
      magnitudes.push(mag * params.amplitude)
    }

    return {
      timeData: { t, original, approx },
      frequencyData: { freqBins, magnitudes },
      fourierApprox: approx,
    }
  }, [params])

  const formulas: Record<WaveType, string> = {
    sine: 'f(t) = A \\sin(\\omega t)',
    square: 'f(t) = \\frac{4A}{\\pi} \\sum_{n=1,3,5,...}^{\\infty} \\frac{1}{n} \\sin(n\\omega t)',
    sawtooth: 'f(t) = \\frac{2A}{\\pi} \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n} \\sin(n\\omega t)',
    triangle: 'f(t) = \\frac{8A}{\\pi^2} \\sum_{n=1,3,5,...}^{\\infty} \\frac{(-1)^{(n-1)/2}}{n^2} \\sin(n\\omega t)',
  }

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-4 md:space-y-6">
        {/* 页面标题 */}
        <header className="flex items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-xl md:text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">傅里叶变换</h1>
              <p className="text-slate-500 text-sm md:text-base">探索信号的时域与频域表示</p>
            </div>
          </div>
          <button
            onClick={handleStartNarration}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm md:text-base shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
            <span>开始讲解</span>
          </button>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* 图表区域 - 移动端全宽 */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* 时域信号卡片 */}
          <div className="time-domain-chart bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden transition-all duration-300">
            <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <span className="text-xs md:text-sm">〰️</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">时域信号</h3>
              </div>
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setParams((prev) => ({ ...prev, terms: 1 }))
                  }
                  setIsAnimating(!isAnimating)
                }}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
                  isAnimating
                    ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/25'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                }`}
              >
                {isAnimating ? '停止' : '播放'}
              </button>
            </div>
            <div className="p-2 md:p-4">
              <Plot
                data={[
                  {
                    x: timeData.t,
                    y: timeData.original,
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    name: '原始信号',
                    line: { color: '#6366f1', width: 2 },
                  },
                  {
                    x: timeData.t,
                    y: fourierApprox,
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    name: `傅里叶逼近 (${params.terms}项)`,
                    line: { color: '#f43f5e', width: 2, dash: 'dash' },
                  },
                ] as any}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 20, r: 20, b: 40, l: 40 },
                  xaxis: { title: { text: '时间 t' }, gridcolor: '#f1f5f9' },
                  yaxis: { title: { text: '振幅' }, gridcolor: '#f1f5f9' },
                  legend: { orientation: 'h', y: -0.25, font: { size: 10 } },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                }}
                config={{ responsive: true, displayModeBar: false }}
                className="w-full"
              />
            </div>
          </div>

          {/* 频谱卡片 */}
          <div className="spectrum-chart bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden transition-all duration-300">
            <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md shadow-violet-500/20">
                  <span className="text-xs md:text-sm">📊</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">频谱</h3>
              </div>
            </div>
            <div className="p-2 md:p-4">
              <Plot
                data={[
                  {
                    x: frequencyData.freqBins,
                    y: frequencyData.magnitudes,
                    type: 'bar' as const,
                    marker: {
                      color: frequencyData.freqBins.map((_, i) =>
                        `rgba(139, 92, 246, ${0.5 + i * 0.05})`
                      )
                    },
                  },
                ] as any}
                layout={{
                  autosize: true,
                  height: 200,
                  margin: { t: 20, r: 20, b: 40, l: 40 },
                  xaxis: { title: { text: '频率 (Hz)' }, gridcolor: '#f1f5f9' },
                  yaxis: { title: { text: '幅度' }, gridcolor: '#f1f5f9' },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                }}
                config={{ responsive: true, displayModeBar: false }}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 控制面板区域 */}
        <div className="space-y-4 md:space-y-6">
          <ParameterPanel
            title="参数控制"
            className="parameter-panel"
            params={[
              { key: 'frequency', label: '基频', value: params.frequency, min: 1, max: 10, step: 1, unit: 'Hz' },
              { key: 'amplitude', label: '振幅', value: params.amplitude, min: 0.1, max: 2, step: 0.1 },
              { key: 'terms', label: '傅里叶项数', value: params.terms, min: 1, max: 50, step: 1 },
            ]}
            onChange={handleParamChange}
          />

          {/* 波形选择卡片 */}
          <div className="wave-selector bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden transition-all duration-300">
            <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                  <span className="text-xs md:text-sm">🎵</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">波形选择</h3>
              </div>
            </div>
            <div className="p-3 md:p-4">
              <div className="grid grid-cols-2 gap-2">
                {(['sine', 'square', 'sawtooth', 'triangle'] as WaveType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setParams((p) => ({ ...p, waveType: type }))}
                    className={`px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
                      params.waveType === type
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95'
                    }`}
                  >
                    {type === 'sine' && '正弦波'}
                    {type === 'square' && '方波'}
                    {type === 'sawtooth' && '锯齿波'}
                    {type === 'triangle' && '三角波'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 公式卡片 */}
          <div className="formula-card bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden transition-all duration-300">
            <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <span className="text-xs md:text-sm">∑</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">傅里叶级数公式</h3>
              </div>
            </div>
            <div className="p-3 md:p-5">
              <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-lg md:rounded-xl p-3 md:p-4 overflow-x-auto">
                <MathFormula formula={formulas[params.waveType]} className="text-center text-sm md:text-base" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
