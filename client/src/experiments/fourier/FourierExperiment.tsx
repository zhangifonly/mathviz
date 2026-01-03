import { useState, useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'

type WaveType = 'sine' | 'square' | 'sawtooth' | 'triangle'

export default function FourierExperiment() {
  const [params, setParams] = useState({
    frequency: 2,
    amplitude: 1,
    terms: 5,
    waveType: 'square' as WaveType,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">傅里叶变换</h1>
        <p className="text-gray-600">探索信号的时域与频域表示</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">时域信号</h3>
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setParams((prev) => ({ ...prev, terms: 1 }))
                  }
                  setIsAnimating(!isAnimating)
                }}
                className={`px-4 py-1 rounded-lg text-sm font-medium ${
                  isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {isAnimating ? '停止' : '播放动画'}
              </button>
            </div>
            <Plot
              data={[
                {
                  x: timeData.t,
                  y: timeData.original,
                  type: 'scatter',
                  mode: 'lines',
                  name: '原始信号',
                  line: { color: '#3b82f6', width: 2 },
                },
                {
                  x: timeData.t,
                  y: fourierApprox,
                  type: 'scatter',
                  mode: 'lines',
                  name: `傅里叶逼近 (${params.terms}项)`,
                  line: { color: '#ef4444', width: 2, dash: 'dash' },
                },
              ]}
              layout={{
                autosize: true,
                height: 300,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: '时间 t' },
                yaxis: { title: '振幅' },
                legend: { orientation: 'h', y: -0.2 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">频谱</h3>
            <Plot
              data={[
                {
                  x: frequencyData.freqBins,
                  y: frequencyData.magnitudes,
                  type: 'bar',
                  marker: { color: '#8b5cf6' },
                },
              ]}
              layout={{
                autosize: true,
                height: 250,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: '频率 (Hz)' },
                yaxis: { title: '幅度' },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-6">
          <ParameterPanel
            title="参数控制"
            params={[
              { key: 'frequency', label: '基频', value: params.frequency, min: 1, max: 10, step: 1, unit: 'Hz' },
              { key: 'amplitude', label: '振幅', value: params.amplitude, min: 0.1, max: 2, step: 0.1 },
              { key: 'terms', label: '傅里叶项数', value: params.terms, min: 1, max: 50, step: 1 },
            ]}
            onChange={handleParamChange}
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">波形选择</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['sine', 'square', 'sawtooth', 'triangle'] as WaveType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setParams((p) => ({ ...p, waveType: type }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    params.waveType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">傅里叶级数公式</h3>
            <MathFormula formula={formulas[params.waveType]} className="text-center" />
          </div>
        </div>
      </div>
    </div>
  )
}
