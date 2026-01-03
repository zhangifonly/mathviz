import { useState, useEffect, useRef, useCallback } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'

type WaveType = 'standing' | 'traveling' | 'superposition' | 'damped'

export default function WaveEquationExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [waveType, setWaveType] = useState<WaveType>('standing')
  const [frequency, setFrequency] = useState(2)
  const [amplitude, setAmplitude] = useState(1)
  const [wavelength, setWavelength] = useState(2)
  const [damping, setDamping] = useState(0.1)
  const [isRunning, setIsRunning] = useState(true)
  const [time, setTime] = useState(0)
  const animationRef = useRef<number | null>(null)

  // 波动方程参数
  const omega = 2 * Math.PI * frequency
  const k = 2 * Math.PI / wavelength

  const getWaveFunction = useCallback((x: number, t: number): number => {
    switch (waveType) {
      case 'standing':
        // 驻波: y = 2A cos(kx) sin(ωt)
        return 2 * amplitude * Math.cos(k * x) * Math.sin(omega * t)
      case 'traveling':
        // 行波: y = A sin(kx - ωt)
        return amplitude * Math.sin(k * x - omega * t)
      case 'superposition':
        // 两波叠加（拍频）
        const omega2 = omega * 1.1
        return amplitude * (Math.sin(k * x - omega * t) + Math.sin(k * x - omega2 * t))
      case 'damped':
        // 阻尼波
        return amplitude * Math.exp(-damping * t) * Math.sin(k * x - omega * t)
      default:
        return 0
    }
  }, [waveType, amplitude, k, omega, damping])

  // 动画循环
  useEffect(() => {
    if (!isRunning) return

    const animate = () => {
      setTime((t) => t + 0.02)
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const midY = height / 2
    const scaleX = width / 10 // x从0到10
    const scaleY = height / 4 // y从-2到2

    // 清空画布
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(i * scaleX, 0)
      ctx.lineTo(i * scaleX, height)
      ctx.stroke()
    }
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.moveTo(0, midY - i * scaleY)
      ctx.lineTo(width, midY - i * scaleY)
      ctx.stroke()
    }

    // 绘制中心线
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, midY)
    ctx.lineTo(width, midY)
    ctx.stroke()

    // 绘制波形
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 3
    ctx.beginPath()

    for (let px = 0; px <= width; px++) {
      const x = (px / width) * 10
      const y = getWaveFunction(x, time)
      const py = midY - y * scaleY

      if (px === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    // 对于驻波，显示波节和波腹
    if (waveType === 'standing') {
      // 波节（节点）
      ctx.fillStyle = '#ef4444'
      for (let n = 0; n <= 10; n++) {
        const nodeX = (n * Math.PI / k)
        if (nodeX <= 10) {
          const px = (nodeX / 10) * width
          ctx.beginPath()
          ctx.arc(px, midY, 6, 0, 2 * Math.PI)
          ctx.fill()
        }
      }

      // 波腹
      ctx.fillStyle = '#3b82f6'
      for (let n = 0; n <= 10; n++) {
        const antinodeX = ((n + 0.5) * Math.PI / k)
        if (antinodeX <= 10) {
          const px = (antinodeX / 10) * width
          ctx.beginPath()
          ctx.arc(px, midY, 6, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
    }

    // 显示粒子运动（对于行波）
    if (waveType === 'traveling') {
      ctx.fillStyle = '#f59e0b'
      for (let i = 0; i <= 10; i += 0.5) {
        const y = getWaveFunction(i, time)
        const px = (i / 10) * width
        const py = midY - y * scaleY
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // 时间显示
    ctx.fillStyle = 'white'
    ctx.font = '14px monospace'
    ctx.fillText(`t = ${time.toFixed(2)}s`, 10, 25)

  }, [time, getWaveFunction, waveType, k])

  const waveDescriptions: Record<WaveType, { title: string; desc: string; formula: string }> = {
    standing: {
      title: '驻波',
      desc: '两列相向传播的波叠加形成，有固定的波节和波腹。',
      formula: 'y = 2A\\cos(kx)\\sin(\\omega t)',
    },
    traveling: {
      title: '行波',
      desc: '能量沿传播方向传递的波动。',
      formula: 'y = A\\sin(kx - \\omega t)',
    },
    superposition: {
      title: '波的叠加（拍频）',
      desc: '两个频率接近的波叠加产生拍频现象。',
      formula: 'y = A[\\sin(\\omega_1 t) + \\sin(\\omega_2 t)]',
    },
    damped: {
      title: '阻尼波',
      desc: '振幅随时间指数衰减的波动。',
      formula: 'y = Ae^{-\\gamma t}\\sin(kx - \\omega t)',
    },
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">波动方程</h1>
        <p className="text-gray-600">可视化驻波、行波、叠加和阻尼波</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{waveDescriptions[waveType].title}</h3>
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="w-full border border-gray-300 rounded"
            />
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isRunning ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {isRunning ? '暂停' : '播放'}
              </button>
              <button
                onClick={() => setTime(0)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                重置
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">波动方程</h3>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MathFormula formula="\frac{\partial^2 y}{\partial t^2} = v^2 \frac{\partial^2 y}{\partial x^2}" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                描述波在介质中传播的偏微分方程，v 是波速。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">当前波形</h3>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MathFormula formula={waveDescriptions[waveType].formula} />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {waveDescriptions[waveType].desc}
              </p>
            </div>
          </div>

          {waveType === 'standing' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">驻波特性</h3>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500"></span>
                  <span className="text-sm text-gray-600">波节（振幅为零）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-gray-600">波腹（振幅最大）</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择波类型</h3>
            <div className="space-y-2">
              {(Object.keys(waveDescriptions) as WaveType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setWaveType(type)
                    setTime(0)
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    waveType === type ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {waveDescriptions[type].title}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">波参数</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">频率 f: {frequency.toFixed(1)} Hz</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={frequency}
                  onChange={(e) => setFrequency(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">振幅 A: {amplitude.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.1"
                  value={amplitude}
                  onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">波长 λ: {wavelength.toFixed(1)}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={wavelength}
                  onChange={(e) => setWavelength(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              {waveType === 'damped' && (
                <div>
                  <label className="text-sm text-gray-600">阻尼系数 γ: {damping.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={damping}
                    onChange={(e) => setDamping(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">波的关系式</h3>
            <div className="space-y-2">
              <MathFormula formula="v = f \lambda" />
              <MathFormula formula="\omega = 2\pi f" />
              <MathFormula formula="k = \frac{2\pi}{\lambda}" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">当前参数</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">角频率 ω</span>
                <span className="font-mono">{omega.toFixed(2)} rad/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">波数 k</span>
                <span className="font-mono">{k.toFixed(2)} rad/m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">波速 v</span>
                <span className="font-mono">{(frequency * wavelength).toFixed(2)} m/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
