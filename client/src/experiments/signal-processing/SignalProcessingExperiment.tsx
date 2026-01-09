import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { signalProcessingNarration } from '../../narrations/scripts/signal-processing'

type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'notch'
type WindowType = 'rectangular' | 'hamming' | 'hanning' | 'blackman'

export default function SignalProcessingExperiment() {
  const [showPresenter, setShowPresenter] = useState(false)
  const narration = useNarrationOptional()

  const [signalFreq, setSignalFreq] = useState(5)
  const [noiseFreq, setNoiseFreq] = useState(50)
  const [noiseAmp, setNoiseAmp] = useState(0.3)
  const [filterType, setFilterType] = useState<FilterType>('lowpass')
  const [cutoffFreq, setCutoffFreq] = useState(20)
  const [windowType, setWindowType] = useState<WindowType>('hamming')
  const [sampleRate] = useState(1000)
  const [duration] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedCutoff, setAnimatedCutoff] = useState(5)
  const animationRef = useRef<number | null>(null)

  // 讲解系统
  useEffect(() => {
    if (narration) {
      narration.loadScript(signalProcessingNarration)
    }
  }, [narration])

  const handleStartNarration = useCallback(() => {
    if (narration) {
      narration.startNarration()
      narration.setPresenterMode(true)
      setShowPresenter(true)
    }
  }, [narration])

  const handleExitPresenter = useCallback(() => {
    if (narration) {
      narration.setPresenterMode(false)
    }
    setShowPresenter(false)
  }, [narration])

  // 动画效果：截止频率扫描
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimatedCutoff((prev) => {
        const newVal = prev + 1
        if (newVal > 80) {
          return 5
        }
        return newVal
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating])

  const currentCutoff = isAnimating ? animatedCutoff : cutoffFreq

  // 生成时间序列
  const timeData = useMemo(() => {
    const n = sampleRate * duration
    const t: number[] = []
    for (let i = 0; i < n; i++) {
      t.push(i / sampleRate)
    }
    return t
  }, [sampleRate, duration])

  // 原始信号 + 噪声
  const signalData = useMemo(() => {
    const clean: number[] = []
    const noisy: number[] = []

    for (const t of timeData) {
      const s = Math.sin(2 * Math.PI * signalFreq * t)
      const noise = noiseAmp * Math.sin(2 * Math.PI * noiseFreq * t)
      clean.push(s)
      noisy.push(s + noise)
    }

    return { clean, noisy }
  }, [timeData, signalFreq, noiseFreq, noiseAmp])

  // 窗函数
  const windowFunction = useMemo(() => {
    const n = timeData.length
    const w: number[] = []

    for (let i = 0; i < n; i++) {
      let val = 1
      switch (windowType) {
        case 'hamming':
          val = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (n - 1))
          break
        case 'hanning':
          val = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)))
          break
        case 'blackman':
          val =
            0.42 -
            0.5 * Math.cos((2 * Math.PI * i) / (n - 1)) +
            0.08 * Math.cos((4 * Math.PI * i) / (n - 1))
          break
        default:
          val = 1
      }
      w.push(val)
    }

    return w
  }, [timeData.length, windowType])

  // 简化的 DFT
  const fftData = useMemo(() => {
    const n = timeData.length
    const signal = signalData.noisy
    const freqs: number[] = []
    const mags: number[] = []

    // 只计算前半部分频率
    const maxFreq = Math.min(100, sampleRate / 2)
    const freqStep = sampleRate / n

    for (let k = 0; k < n / 2 && k * freqStep <= maxFreq; k++) {
      const freq = k * freqStep
      let real = 0
      let imag = 0

      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * k * i) / n
        real += signal[i] * windowFunction[i] * Math.cos(angle)
        imag -= signal[i] * windowFunction[i] * Math.sin(angle)
      }

      freqs.push(freq)
      mags.push(Math.sqrt(real * real + imag * imag) / n)
    }

    return { freqs, mags }
  }, [signalData.noisy, timeData.length, sampleRate, windowFunction])

  // 滤波器频率响应
  const filterResponse = useMemo(() => {
    const freqs: number[] = []
    const response: number[] = []
    const maxFreq = 100

    for (let f = 0; f <= maxFreq; f += 0.5) {
      freqs.push(f)

      let h = 0
      const fc = currentCutoff
      const bw = 10 // 带宽

      switch (filterType) {
        case 'lowpass':
          h = 1 / (1 + Math.pow(f / fc, 4))
          break
        case 'highpass':
          h = 1 / (1 + Math.pow(fc / (f + 0.1), 4))
          break
        case 'bandpass':
          h = 1 / (1 + Math.pow((f - fc) / bw, 4))
          break
        case 'notch':
          h = 1 - 1 / (1 + Math.pow((f - fc) / 5, 4))
          break
      }

      response.push(h)
    }

    return { freqs, response }
  }, [filterType, currentCutoff])

  // 滤波后的信号（简化实现）
  const filteredSignal = useMemo(() => {
    const result: number[] = []
    const signal = signalData.noisy

    // 简单的移动平均滤波器模拟低通
    const windowSize = Math.max(1, Math.floor(sampleRate / currentCutoff / 2))

    if (filterType === 'lowpass') {
      for (let i = 0; i < signal.length; i++) {
        let sum = 0
        let count = 0
        for (let j = Math.max(0, i - windowSize); j <= Math.min(signal.length - 1, i + windowSize); j++) {
          sum += signal[j]
          count++
        }
        result.push(sum / count)
      }
    } else if (filterType === 'highpass') {
      // 高通 = 原信号 - 低通
      const lowpass: number[] = []
      for (let i = 0; i < signal.length; i++) {
        let sum = 0
        let count = 0
        for (let j = Math.max(0, i - windowSize); j <= Math.min(signal.length - 1, i + windowSize); j++) {
          sum += signal[j]
          count++
        }
        lowpass.push(sum / count)
      }
      for (let i = 0; i < signal.length; i++) {
        result.push(signal[i] - lowpass[i])
      }
    } else {
      // 其他滤波器简化处理
      for (let i = 0; i < signal.length; i++) {
        result.push(signal[i])
      }
    }

    return result
  }, [signalData.noisy, filterType, currentCutoff, sampleRate])

  // 信噪比计算
  const snr = useMemo(() => {
    const signalPower = signalData.clean.reduce((sum, x) => sum + x * x, 0) / signalData.clean.length
    const noisePower = noiseAmp * noiseAmp / 2
    return 10 * Math.log10(signalPower / noisePower)
  }, [signalData.clean, noiseAmp])

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">信号处理</h1>
            <p className="text-gray-600">探索滤波器、频谱分析和窗函数</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!isAnimating) {
                  setAnimatedCutoff(5)
                }
                setIsAnimating(!isAnimating)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {isAnimating ? '停止' : '播放动画'}
            </button>
            <button
              onClick={handleStartNarration}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
            >
              开始讲解
            </button>
          </div>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">时域信号</h3>
            <Plot
              data={[
                {
                  x: timeData.slice(0, 500),
                  y: signalData.noisy.slice(0, 500),
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#94a3b8', width: 1 } as const,
                  name: '含噪信号',
                },
                {
                  x: timeData.slice(0, 500),
                  y: signalData.clean.slice(0, 500),
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#3b82f6', width: 2 } as const,
                  name: '原始信号',
                },
                {
                  x: timeData.slice(0, 500),
                  y: filteredSignal.slice(0, 500),
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#22c55e', width: 2 } as const,
                  name: '滤波后',
                },
              ]}
              layout={{
                autosize: true,
                height: 300,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: { text: '时间 (s)' }, range: [0, 0.5] },
                yaxis: { title: { text: '幅度' } },
                legend: { orientation: 'h', y: -0.2 },
              }}
              config={{ responsive: true, displaylogo: false }}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">频谱分析</h3>
              <Plot
                data={[
                  {
                    x: fftData.freqs,
                    y: fftData.mags,
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    fill: 'tozeroy' as const,
                    line: { color: '#8b5cf6' } as const,
                    name: '频谱',
                  },
                  {
                    x: [signalFreq, signalFreq],
                    y: [0, Math.max(...fftData.mags)],
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    line: { color: '#3b82f6', dash: 'dash' as const } as const,
                    name: '信号频率',
                  },
                  {
                    x: [noiseFreq, noiseFreq],
                    y: [0, Math.max(...fftData.mags)],
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    line: { color: '#ef4444', dash: 'dash' as const } as const,
                    name: '噪声频率',
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: '频率 (Hz)' } },
                  yaxis: { title: { text: '幅度' } },
                  showlegend: false,
                }}
                config={{ responsive: true, displaylogo: false }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">滤波器响应</h3>
              <Plot
                data={[
                  {
                    x: filterResponse.freqs,
                    y: filterResponse.response,
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    fill: 'tozeroy' as const,
                    line: { color: '#22c55e' } as const,
                  },
                  {
                    x: [cutoffFreq, cutoffFreq],
                    y: [0, 1],
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    line: { color: '#ef4444', dash: 'dash' as const } as const,
                    name: '截止频率',
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: '频率 (Hz)' } },
                  yaxis: { title: { text: '增益' }, range: [0, 1.1] },
                  showlegend: false,
                }}
                config={{ responsive: true, displaylogo: false }}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">窗函数</h3>
              <Plot
                data={[
                  {
                    x: timeData.slice(0, 200),
                    y: windowFunction.slice(0, 200),
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    fill: 'tozeroy' as const,
                    line: { color: '#f59e0b' } as const,
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 200,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: '样本' } },
                  yaxis: { title: { text: '权重' }, range: [0, 1.1] },
                }}
                config={{ responsive: true, displaylogo: false }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">信号指标</h3>
              <div className="space-y-2">
                <div className="p-2 bg-blue-50 rounded flex justify-between">
                  <span>信号频率</span>
                  <span className="font-mono">{signalFreq} Hz</span>
                </div>
                <div className="p-2 bg-red-50 rounded flex justify-between">
                  <span>噪声频率</span>
                  <span className="font-mono">{noiseFreq} Hz</span>
                </div>
                <div className="p-2 bg-green-50 rounded flex justify-between">
                  <span>信噪比 (SNR)</span>
                  <span className="font-mono">{snr.toFixed(2)} dB</span>
                </div>
                <div className="p-2 bg-purple-50 rounded flex justify-between">
                  <span>采样率</span>
                  <span className="font-mono">{sampleRate} Hz</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">信号参数</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">信号频率: {signalFreq} Hz</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={signalFreq}
                  onChange={(e) => setSignalFreq(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">噪声频率: {noiseFreq} Hz</label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={noiseFreq}
                  onChange={(e) => setNoiseFreq(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">噪声幅度: {noiseAmp.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={noiseAmp}
                  onChange={(e) => setNoiseAmp(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">滤波器设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">滤波器类型</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['lowpass', 'highpass', 'bandpass', 'notch'] as FilterType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-2 py-1 text-xs rounded ${
                        filterType === type
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'lowpass' && '低通'}
                      {type === 'highpass' && '高通'}
                      {type === 'bandpass' && '带通'}
                      {type === 'notch' && '陷波'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">截止频率: {cutoffFreq} Hz</label>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={cutoffFreq}
                  onChange={(e) => setCutoffFreq(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">窗函数</h3>
            <div className="space-y-2">
              {(['rectangular', 'hamming', 'hanning', 'blackman'] as WindowType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setWindowType(type)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    windowType === type
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'rectangular' && '矩形窗'}
                  {type === 'hamming' && 'Hamming 窗'}
                  {type === 'hanning' && 'Hanning 窗'}
                  {type === 'blackman' && 'Blackman 窗'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">傅里叶变换</h3>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MathFormula formula="X(f) = \int_{-\infty}^{\infty} x(t) e^{-j2\pi ft} dt" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              傅里叶变换将时域信号转换为频域表示，揭示信号的频率成分。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">采样定理</h3>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MathFormula formula="f_s \geq 2 f_{max}" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              奈奎斯特定理：采样频率必须至少是信号最高频率的两倍。
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
