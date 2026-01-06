import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { fourierSeriesNarration } from '../../narrations/scripts/fourier-series'

type WaveformType = 'square' | 'sawtooth' | 'triangle' | 'pulse'

export default function FourierSeriesExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [waveform, setWaveform] = useState<WaveformType>('square')
  const [terms, setTerms] = useState(5)
  const [time, setTime] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [showCircles, setShowCircles] = useState(true)
  const [speed, setSpeed] = useState(1)
  const animationRef = useRef<number | null>(null)
  const traceRef = useRef<{ x: number; y: number }[]>([])
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(fourierSeriesNarration)
    }
  }, [narration])

  // 开始讲解
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

  // 傅里叶系数
  const coefficients = useMemo(() => {
    const coeffs: { n: number; a: number; b: number; amplitude: number; phase: number }[] = []

    for (let n = 1; n <= terms; n++) {
      let a = 0, b = 0

      switch (waveform) {
        case 'square':
          // 方波: 只有奇次谐波
          if (n % 2 === 1) {
            b = 4 / (n * Math.PI)
          }
          break

        case 'sawtooth':
          // 锯齿波
          b = 2 * Math.pow(-1, n + 1) / (n * Math.PI)
          break

        case 'triangle':
          // 三角波: 只有奇次谐波
          if (n % 2 === 1) {
            b = 8 * Math.pow(-1, (n - 1) / 2) / (n * n * Math.PI * Math.PI)
          }
          break

        case 'pulse':
          // 脉冲波 (占空比 25%)
          const d = 0.25
          a = 2 * Math.sin(n * Math.PI * d) / (n * Math.PI)
          b = 2 * (1 - Math.cos(n * Math.PI * d)) / (n * Math.PI)
          break
      }

      const amplitude = Math.sqrt(a * a + b * b)
      const phase = Math.atan2(a, b)

      if (amplitude > 1e-10) {
        coeffs.push({ n, a, b, amplitude, phase })
      }
    }

    return coeffs
  }, [waveform, terms])

  // 生成原始波形
  const originalWaveform = useMemo(() => {
    const x: number[] = []
    const y: number[] = []
    const n = 500

    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 4 * Math.PI
      x.push(t)

      let val = 0
      const phase = t % (2 * Math.PI)

      switch (waveform) {
        case 'square':
          val = phase < Math.PI ? 1 : -1
          break
        case 'sawtooth':
          val = 1 - phase / Math.PI
          break
        case 'triangle':
          val = phase < Math.PI
            ? -1 + 2 * phase / Math.PI
            : 3 - 2 * phase / Math.PI
          break
        case 'pulse':
          val = phase < Math.PI / 2 ? 1 : -0.33
          break
      }

      y.push(val)
    }

    return { x, y }
  }, [waveform])

  // 傅里叶近似
  const fourierApprox = useMemo(() => {
    const x: number[] = []
    const y: number[] = []
    const n = 500

    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 4 * Math.PI
      x.push(t)

      let sum = 0
      for (const coeff of coefficients) {
        sum += coeff.amplitude * Math.sin(coeff.n * t + coeff.phase)
      }

      y.push(sum)
    }

    return { x, y }
  }, [coefficients])

  // 动画
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setTime((t) => t + 0.02 * speed)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating, speed])

  // 绘制旋转圆
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const cx = width / 3
    const cy = height / 2
    const scale = 80

    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    let x = cx
    let y = cy

    // 绘制圆和向量
    for (let i = 0; i < coefficients.length; i++) {
      const coeff = coefficients[i]
      const radius = coeff.amplitude * scale
      const angle = coeff.n * time + coeff.phase

      if (showCircles) {
        // 绘制圆
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 + 0.7 * (1 - i / coefficients.length)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI)
        ctx.stroke()
      }

      // 绘制向量
      const newX = x + radius * Math.sin(angle)
      const newY = y - radius * Math.cos(angle)

      ctx.strokeStyle = `hsl(${(i * 360) / coefficients.length}, 70%, 50%)`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(newX, newY)
      ctx.stroke()

      // 绘制端点
      ctx.fillStyle = ctx.strokeStyle
      ctx.beginPath()
      ctx.arc(newX, newY, 3, 0, 2 * Math.PI)
      ctx.fill()

      x = newX
      y = newY
    }

    // 添加到轨迹
    traceRef.current.push({ x: width / 3 + 150, y })
    if (traceRef.current.length > 300) {
      traceRef.current.shift()
    }

    // 绘制连接线
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(width / 3 + 150, y)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制轨迹
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < traceRef.current.length; i++) {
      const point = traceRef.current[i]
      const px = point.x + i * 0.8
      if (i === 0) {
        ctx.moveTo(px, point.y)
      } else {
        ctx.lineTo(px, point.y)
      }
    }
    ctx.stroke()

    // 绘制当前点
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(width / 3 + 150, y, 5, 0, 2 * Math.PI)
    ctx.fill()

  }, [time, coefficients, showCircles])

  // 频谱
  const spectrum = useMemo(() => {
    const freqs: number[] = []
    const amps: number[] = []

    for (const coeff of coefficients) {
      freqs.push(coeff.n)
      amps.push(coeff.amplitude)
    }

    return { freqs, amps }
  }, [coefficients])

  const waveformInfo: Record<WaveformType, { name: string; formula: string }> = {
    square: { name: '方波', formula: 'f(t) = \\frac{4}{\\pi}\\sum_{n=1,3,5...}\\frac{1}{n}\\sin(nt)' },
    sawtooth: { name: '锯齿波', formula: 'f(t) = \\frac{2}{\\pi}\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n}\\sin(nt)' },
    triangle: { name: '三角波', formula: 'f(t) = \\frac{8}{\\pi^2}\\sum_{n=1,3,5...}\\frac{(-1)^{(n-1)/2}}{n^2}\\sin(nt)' },
    pulse: { name: '脉冲波', formula: 'f(t) = a_0 + \\sum_{n=1}^{\\infty}(a_n\\cos(nt) + b_n\\sin(nt))' },
  }

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">傅里叶级数动画</h1>
          <p className="text-gray-600">用旋转圆可视化傅里叶级数的叠加</p>
        </div>
        <button
          onClick={handleStartNarration}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
        >
          开始讲解
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">旋转圆动画</h3>
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="w-full border border-gray-300 rounded"
            />
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-4 py-2 rounded-lg ${
                  isAnimating ? 'bg-red-500' : 'bg-green-500'
                } text-white`}
              >
                {isAnimating ? '暂停' : '播放'}
              </button>
              <button
                onClick={() => {
                  setTime(0)
                  traceRef.current = []
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                重置
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCircles}
                  onChange={(e) => setShowCircles(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">显示圆</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">波形比较</h3>
              <Plot
                data={[
                  {
                    x: originalWaveform.x,
                    y: originalWaveform.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#94a3b8', width: 1, dash: 'dash' },
                    name: '原始',
                  },
                  {
                    x: fourierApprox.x,
                    y: fourierApprox.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#8b5cf6', width: 2 },
                    name: `${terms}项近似`,
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: 't' },
                  yaxis: { title: 'f(t)', range: [-1.5, 1.5] },
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
                    x: spectrum.freqs,
                    y: spectrum.amps,
                    type: 'bar',
                    marker: { color: '#8b5cf6' },
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: '谐波次数 n', dtick: 1 },
                  yaxis: { title: '幅度' },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">傅里叶系数</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2">n</th>
                    <th className="px-3 py-2">幅度</th>
                    <th className="px-3 py-2">相位</th>
                    <th className="px-3 py-2">贡献</th>
                  </tr>
                </thead>
                <tbody>
                  {coefficients.slice(0, 10).map((coeff) => (
                    <tr key={coeff.n} className="border-t">
                      <td className="px-3 py-2 text-center">{coeff.n}</td>
                      <td className="px-3 py-2 text-center font-mono">{coeff.amplitude.toFixed(4)}</td>
                      <td className="px-3 py-2 text-center font-mono">{(coeff.phase * 180 / Math.PI).toFixed(1)}°</td>
                      <td className="px-3 py-2">
                        <div className="w-full bg-gray-200 rounded h-2">
                          <div
                            className="bg-purple-500 h-2 rounded"
                            style={{ width: `${Math.min(100, coeff.amplitude * 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">波形类型</h3>
            <div className="space-y-2">
              {(Object.keys(waveformInfo) as WaveformType[]).map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    setWaveform(w)
                    traceRef.current = []
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    waveform === w
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {waveformInfo[w].name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">谐波项数: {terms}</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={terms}
                  onChange={(e) => setTerms(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">动画速度: {speed.toFixed(1)}x</label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">{waveformInfo[waveform].name}公式</h3>
            <div className="p-3 bg-purple-50 rounded-lg text-sm overflow-x-auto">
              <MathFormula formula={waveformInfo[waveform].formula} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">傅里叶级数</h3>
            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <MathFormula formula="f(t) = \sum_{n=1}^{\infty} A_n \sin(n\omega t + \phi_n)" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              任何周期函数都可以分解为正弦波的叠加。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">吉布斯现象</h3>
            <p className="text-sm text-gray-600">
              在不连续点附近，傅里叶级数会出现约 9% 的过冲，这种现象称为吉布斯现象，增加项数也无法消除。
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
