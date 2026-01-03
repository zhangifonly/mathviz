import { useState, useMemo, useEffect, useRef } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'

type PresetShape = {
  name: string
  points: { x: number; y: number }[]
}

const presets: PresetShape[] = [
  {
    name: '正方形',
    points: (() => {
      const pts: { x: number; y: number }[] = []
      const n = 100
      for (let i = 0; i < n; i++) {
        const t = i / n
        if (t < 0.25) pts.push({ x: -1 + 8 * t, y: -1 })
        else if (t < 0.5) pts.push({ x: 1, y: -1 + 8 * (t - 0.25) })
        else if (t < 0.75) pts.push({ x: 1 - 8 * (t - 0.5), y: 1 })
        else pts.push({ x: -1, y: 1 - 8 * (t - 0.75) })
      }
      return pts
    })(),
  },
  {
    name: '三角形',
    points: (() => {
      const pts: { x: number; y: number }[] = []
      const n = 100
      for (let i = 0; i < n; i++) {
        const t = i / n
        if (t < 1 / 3) {
          const s = t * 3
          pts.push({ x: -1 + 1.5 * s, y: -1 + 2 * s })
        } else if (t < 2 / 3) {
          const s = (t - 1 / 3) * 3
          pts.push({ x: 0.5 + 0.5 * s, y: 1 - 2 * s })
        } else {
          const s = (t - 2 / 3) * 3
          pts.push({ x: 1 - 2 * s, y: -1 })
        }
      }
      return pts
    })(),
  },
  {
    name: '心形',
    points: (() => {
      const pts: { x: number; y: number }[] = []
      const n = 200
      for (let i = 0; i < n; i++) {
        const t = (i / n) * 2 * Math.PI
        const x = 16 * Math.pow(Math.sin(t), 3) / 17
        const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17
        pts.push({ x, y })
      }
      return pts
    })(),
  },
  {
    name: '星形',
    points: (() => {
      const pts: { x: number; y: number }[] = []
      const n = 100
      for (let i = 0; i < n; i++) {
        const t = (i / n) * 2 * Math.PI
        const r = i % (n / 5) < n / 10 ? 1 : 0.4
        pts.push({ x: r * Math.cos(t - Math.PI / 2), y: r * Math.sin(t - Math.PI / 2) })
      }
      return pts
    })(),
  },
]

export default function FourierDrawingExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [numCircles, setNumCircles] = useState(20)
  const [speed, setSpeed] = useState(1)
  const [isRunning, setIsRunning] = useState(true)
  const [time, setTime] = useState(0)
  const [showCircles, setShowCircles] = useState(true)
  const animationRef = useRef<number | null>(null)

  const points = presets[selectedPreset].points

  // 计算傅里叶系数
  const coefficients = useMemo(() => {
    const N = points.length
    const coeffs: { freq: number; amp: number; phase: number }[] = []

    for (let k = -numCircles; k <= numCircles; k++) {
      let re = 0, im = 0
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N
        re += points[n].x * Math.cos(angle) + points[n].y * Math.sin(angle)
        im += points[n].y * Math.cos(angle) - points[n].x * Math.sin(angle)
      }
      re /= N
      im /= N
      const amp = Math.sqrt(re * re + im * im)
      const phase = Math.atan2(im, re)
      coeffs.push({ freq: k, amp, phase })
    }

    // 按振幅排序
    coeffs.sort((a, b) => b.amp - a.amp)
    return coeffs
  }, [points, numCircles])

  // 动画循环
  useEffect(() => {
    if (!isRunning) return

    const animate = () => {
      setTime((t) => (t + 0.01 * speed) % (2 * Math.PI))
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning, speed])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const scale = Math.min(width, height) / 3
    const cx = width / 2
    const cy = height / 2

    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    // 绘制原始路径（淡色）
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    points.forEach((p, i) => {
      const x = cx + p.x * scale
      const y = cy - p.y * scale
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.stroke()

    // 计算当前位置和绘制圆
    let x = cx, y = cy
    const drawnPath: { x: number; y: number }[] = []

    // 绘制到当前时间的路径
    const steps = 500
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * time
      let px = 0, py = 0
      for (const coeff of coefficients) {
        const angle = coeff.freq * t + coeff.phase
        px += coeff.amp * Math.cos(angle)
        py += coeff.amp * Math.sin(angle)
      }
      drawnPath.push({ x: cx + px * scale, y: cy - py * scale })
    }

    // 绘制已画路径
    if (drawnPath.length > 1) {
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2
      ctx.beginPath()
      drawnPath.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.stroke()
    }

    // 绘制圆和向量
    if (showCircles) {
      x = cx
      y = cy
      for (const coeff of coefficients) {
        const angle = coeff.freq * time + coeff.phase
        const nx = x + coeff.amp * scale * Math.cos(angle)
        const ny = y - coeff.amp * scale * Math.sin(angle)

        // 圆
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, coeff.amp * scale, 0, 2 * Math.PI)
        ctx.stroke()

        // 向量
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(nx, ny)
        ctx.stroke()

        x = nx
        y = ny
      }

      // 画笔位置
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }, [time, coefficients, points, showCircles])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">傅里叶绘图</h1>
        <p className="text-gray-600">用旋转的圆（本轮）绘制任意图形</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">傅里叶级数绘图</h3>
            <canvas
              ref={canvasRef}
              width={600}
              height={500}
              className="w-full border border-gray-300 rounded"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4 flex-wrap">
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
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCircles}
                  onChange={(e) => setShowCircles(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">显示圆</span>
              </label>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-gray-600">进度</label>
                <input
                  type="range"
                  min="0"
                  max={2 * Math.PI}
                  step="0.01"
                  value={time}
                  onChange={(e) => {
                    setIsRunning(false)
                    setTime(parseFloat(e.target.value))
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">傅里叶级数</h3>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MathFormula formula="f(t) = \sum_{k=-n}^{n} c_k e^{ikt}" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                任何周期函数都可以表示为不同频率正弦波的叠加。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">本轮（Epicycle）</h3>
              <p className="text-sm text-gray-600">
                每个傅里叶系数对应一个旋转的圆。圆的半径是振幅，旋转速度是频率。
                将所有圆首尾相连，最后一个圆的圆心轨迹就是原始图形。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择图形</h3>
            <div className="space-y-2">
              {presets.map((preset, i) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setSelectedPreset(i)
                    setTime(0)
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    selectedPreset === i ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">圆的数量: {numCircles * 2 + 1}</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={numCircles}
                  onChange={(e) => setNumCircles(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">速度: {speed.toFixed(1)}x</label>
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
            <h3 className="text-lg font-semibold mb-3">主要系数</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {coefficients.slice(0, 10).map((c, i) => (
                <div key={i} className="flex justify-between text-sm p-1 bg-gray-50 rounded">
                  <span className="text-gray-600">k={c.freq}</span>
                  <span className="font-mono">{c.amp.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">原理说明</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 灰色：原始图形轮廓</li>
              <li>• 紫色圆：傅里叶分量</li>
              <li>• 红色线：连接向量</li>
              <li>• 绿色线：绘制轨迹</li>
              <li>• 黄点：当前画笔位置</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
