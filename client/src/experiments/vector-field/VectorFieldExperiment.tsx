import { useState, useMemo, useEffect, useRef } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'

type VectorField = {
  name: string
  formula: string
  fx: (x: number, y: number) => number
  fy: (x: number, y: number) => number
}

const fields: VectorField[] = [
  {
    name: '旋转场',
    formula: '\\vec{F} = (-y, x)',
    fx: (_, y) => -y,
    fy: (x) => x,
  },
  {
    name: '源场（发散）',
    formula: '\\vec{F} = (x, y)',
    fx: (x) => x,
    fy: (_, y) => y,
  },
  {
    name: '汇场（收敛）',
    formula: '\\vec{F} = (-x, -y)',
    fx: (x) => -x,
    fy: (_, y) => -y,
  },
  {
    name: '剪切场',
    formula: '\\vec{F} = (y, 0)',
    fx: (_, y) => y,
    fy: () => 0,
  },
  {
    name: '鞍点场',
    formula: '\\vec{F} = (x, -y)',
    fx: (x) => x,
    fy: (_, y) => -y,
  },
  {
    name: '涡旋场',
    formula: '\\vec{F} = \\frac{(-y, x)}{x^2+y^2}',
    fx: (x, y) => {
      const r2 = x * x + y * y
      return r2 > 0.01 ? -y / r2 : 0
    },
    fy: (x, y) => {
      const r2 = x * x + y * y
      return r2 > 0.01 ? x / r2 : 0
    },
  },
]

export default function VectorFieldExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedField, setSelectedField] = useState(0)
  const [gridDensity, setGridDensity] = useState(15)
  const [showStreamlines, setShowStreamlines] = useState(true)
  const [arrowScale, setArrowScale] = useState(0.3)
  const [isAnimating, setIsAnimating] = useState(false)
  const [particles, setParticles] = useState<{ x: number; y: number; age: number }[]>([])
  const animationRef = useRef<number | null>(null)

  const field = fields[selectedField]

  // 计算散度和旋度
  const fieldProperties = useMemo(() => {
    // 数值计算散度和旋度（在原点附近）
    const h = 0.001
    const x = 0.5, y = 0.5

    // 散度 div F = ∂Fx/∂x + ∂Fy/∂y
    const dFxdx = (field.fx(x + h, y) - field.fx(x - h, y)) / (2 * h)
    const dFydy = (field.fy(x, y + h) - field.fy(x, y - h)) / (2 * h)
    const divergence = dFxdx + dFydy

    // 旋度 curl F = ∂Fy/∂x - ∂Fx/∂y (2D情况下只有z分量)
    const dFydx = (field.fy(x + h, y) - field.fy(x - h, y)) / (2 * h)
    const dFxdy = (field.fx(x, y + h) - field.fx(x, y - h)) / (2 * h)
    const curl = dFydx - dFxdy

    return { divergence, curl }
  }, [field])

  // 粒子动画
  useEffect(() => {
    if (!isAnimating) return

    // 初始化粒子
    if (particles.length === 0) {
      const newParticles = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          x: (Math.random() - 0.5) * 5,
          y: (Math.random() - 0.5) * 5,
          age: Math.random() * 100,
        })
      }
      setParticles(newParticles)
    }

    const animate = () => {
      setParticles((prev) =>
        prev.map((p) => {
          const fx = field.fx(p.x, p.y)
          const fy = field.fy(p.x, p.y)
          const mag = Math.sqrt(fx * fx + fy * fy)
          const dt = 0.03

          let newX = p.x + (mag > 0.001 ? (fx / mag) * dt : 0)
          let newY = p.y + (mag > 0.001 ? (fy / mag) * dt : 0)
          let newAge = p.age + 1

          // 重置超出边界或太老的粒子
          if (Math.abs(newX) > 3 || Math.abs(newY) > 3 || newAge > 150) {
            newX = (Math.random() - 0.5) * 5
            newY = (Math.random() - 0.5) * 5
            newAge = 0
          }

          return { x: newX, y: newY, age: newAge }
        })
      )
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, field, particles.length])

  // 绘制向量场
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const scale = width / 6 // -3 to 3

    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    // 坐标转换
    const toCanvas = (x: number, y: number) => ({
      cx: width / 2 + x * scale,
      cy: height / 2 - y * scale,
    })

    // 绘制网格
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
    ctx.lineWidth = 1
    for (let i = -3; i <= 3; i++) {
      const { cx: x1, cy: y1 } = toCanvas(i, -3)
      const { cx: x2, cy: y2 } = toCanvas(i, 3)
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()

      const { cx: x3, cy: y3 } = toCanvas(-3, i)
      const { cx: x4, cy: y4 } = toCanvas(3, i)
      ctx.beginPath()
      ctx.moveTo(x3, y3)
      ctx.lineTo(x4, y4)
      ctx.stroke()
    }

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.lineWidth = 2
    const { cx: ox, cy: oy } = toCanvas(0, 0)
    ctx.beginPath()
    ctx.moveTo(0, oy)
    ctx.lineTo(width, oy)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(ox, 0)
    ctx.lineTo(ox, height)
    ctx.stroke()

    // 绘制流线
    if (showStreamlines) {
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)'
      ctx.lineWidth = 1

      const startPoints = []
      for (let i = -2.5; i <= 2.5; i += 1) {
        for (let j = -2.5; j <= 2.5; j += 1) {
          startPoints.push({ x: i, y: j })
        }
      }

      for (const start of startPoints) {
        ctx.beginPath()
        let x = start.x, y = start.y
        const { cx, cy } = toCanvas(x, y)
        ctx.moveTo(cx, cy)

        for (let step = 0; step < 100; step++) {
          const fx = field.fx(x, y)
          const fy = field.fy(x, y)
          const mag = Math.sqrt(fx * fx + fy * fy)
          if (mag < 0.001) break

          const dt = 0.05
          x += (fx / mag) * dt
          y += (fy / mag) * dt

          if (Math.abs(x) > 3 || Math.abs(y) > 3) break

          const { cx: nx, cy: ny } = toCanvas(x, y)
          ctx.lineTo(nx, ny)
        }
        ctx.stroke()
      }
    }

    // 绘制向量箭头
    const step = 6 / gridDensity
    for (let x = -3 + step / 2; x <= 3; x += step) {
      for (let y = -3 + step / 2; y <= 3; y += step) {
        const fx = field.fx(x, y)
        const fy = field.fy(x, y)
        const mag = Math.sqrt(fx * fx + fy * fy)

        if (mag < 0.001) continue

        const { cx, cy } = toCanvas(x, y)
        const len = Math.min(mag * arrowScale * scale * 0.8, step * scale * 0.4)
        const angle = Math.atan2(fy, fx)

        const ex = cx + len * Math.cos(angle)
        const ey = cy - len * Math.sin(angle)

        // 颜色根据大小变化
        const hue = Math.min(mag * 30, 60)
        ctx.strokeStyle = `hsl(${200 + hue}, 80%, 60%)`
        ctx.fillStyle = `hsl(${200 + hue}, 80%, 60%)`
        ctx.lineWidth = 1.5

        // 画线
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(ex, ey)
        ctx.stroke()

        // 画箭头
        const arrowSize = 4
        ctx.beginPath()
        ctx.moveTo(ex, ey)
        ctx.lineTo(
          ex - arrowSize * Math.cos(angle - Math.PI / 6),
          ey + arrowSize * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
          ex - arrowSize * Math.cos(angle + Math.PI / 6),
          ey + arrowSize * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fill()
      }
    }

    // 绘制动画粒子
    if (isAnimating && particles.length > 0) {
      for (const p of particles) {
        const { cx, cy } = toCanvas(p.x, p.y)
        const alpha = Math.min(1, (150 - p.age) / 50)
        ctx.fillStyle = `rgba(255, 200, 50, ${alpha})`
        ctx.beginPath()
        ctx.arc(cx, cy, 4, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }, [field, gridDensity, showStreamlines, arrowScale, isAnimating, particles])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">向量场可视化</h1>
        <p className="text-gray-600">探索二维向量场的散度、旋度和流线</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{field.name}</h3>
              <button
                onClick={() => {
                  if (isAnimating) {
                    setParticles([])
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
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="w-full max-w-lg mx-auto border border-gray-300 rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">散度 (Divergence)</h3>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MathFormula formula="\nabla \cdot \vec{F} = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y}" />
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded text-center">
                <span className="text-gray-600">div F ≈ </span>
                <span className="font-mono font-bold text-lg">
                  {fieldProperties.divergence.toFixed(3)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {fieldProperties.divergence > 0.1 ? '正散度：源（向外发散）' :
                 fieldProperties.divergence < -0.1 ? '负散度：汇（向内收敛）' :
                 '零散度：无源无汇'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">旋度 (Curl)</h3>
              <div className="p-3 bg-green-50 rounded-lg">
                <MathFormula formula="(\nabla \times \vec{F})_z = \frac{\partial F_y}{\partial x} - \frac{\partial F_x}{\partial y}" />
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded text-center">
                <span className="text-gray-600">curl F ≈ </span>
                <span className="font-mono font-bold text-lg">
                  {fieldProperties.curl.toFixed(3)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {fieldProperties.curl > 0.1 ? '正旋度：逆时针旋转' :
                 fieldProperties.curl < -0.1 ? '负旋度：顺时针旋转' :
                 '零旋度：无旋场'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择向量场</h3>
            <div className="space-y-2">
              {fields.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => setSelectedField(i)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    selectedField === i ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">当前场公式</h3>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MathFormula formula={field.formula} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">显示设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">网格密度: {gridDensity}</label>
                <input
                  type="range"
                  min="8"
                  max="25"
                  value={gridDensity}
                  onChange={(e) => setGridDensity(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">箭头缩放: {arrowScale.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={arrowScale}
                  onChange={(e) => setArrowScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showStreamlines}
                  onChange={(e) => setShowStreamlines(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">显示流线</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">物理意义</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>散度</strong>：流体的源/汇强度</li>
              <li>• <strong>旋度</strong>：流体的旋转程度</li>
              <li>• <strong>流线</strong>：质点运动轨迹</li>
              <li>• 箭头长度表示场强大小</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
