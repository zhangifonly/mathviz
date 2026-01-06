import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import 'katex/dist/katex.min.css'
// @ts-expect-error react-katex types
import { InlineMath, BlockMath } from 'react-katex'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { conicSectionsNarration } from '../../narrations/scripts/conic-sections'

interface Step {
  description: string
}

type ConicType = 'ellipse' | 'hyperbola' | 'parabola'

interface ConicConfig {
  name: string
  color: string
  formula: string
  definition: string
}

const conicConfigs: Record<ConicType, ConicConfig> = {
  ellipse: {
    name: '椭圆',
    color: '#3B82F6',
    formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1',
    definition: '到两个焦点距离之和为常数的点的轨迹',
  },
  hyperbola: {
    name: '双曲线',
    color: '#EF4444',
    formula: '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1',
    definition: '到两个焦点距离之差的绝对值为常数的点的轨迹',
  },
  parabola: {
    name: '抛物线',
    color: '#10B981',
    formula: 'y^2 = 4px',
    definition: '到焦点和准线距离相等的点的轨迹',
  },
}

export default function ConicSectionsExperiment() {
  const [conicType, setConicType] = useState<ConicType>('ellipse')
  const [a, setA] = useState(5) // 长轴/实轴
  const [b, setB] = useState(3) // 短轴/虚轴
  const [p, setP] = useState(2) // 抛物线焦准距
  const [showFoci, setShowFoci] = useState(true)
  const [showDirectrix, setShowDirectrix] = useState(true)
  const [showAsymptotes, setShowAsymptotes] = useState(true)
  const [showPoint, setShowPoint] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationAngle, setAnimationAngle] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(conicSectionsNarration)
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

  // 计算焦点和离心率
  const calculations = useMemo(() => {
    switch (conicType) {
      case 'ellipse': {
        const c = Math.sqrt(Math.abs(a * a - b * b))
        const e = a > b ? c / a : c / b
        return {
          c,
          e,
          foci: a > b ? [[-c, 0], [c, 0]] : [[0, -c], [0, c]],
          directrix: a > b ? a * a / c : b * b / c,
        }
      }
      case 'hyperbola': {
        const c = Math.sqrt(a * a + b * b)
        const e = c / a
        return {
          c,
          e,
          foci: [[-c, 0], [c, 0]],
          asymptotes: b / a,
          directrix: a * a / c,
        }
      }
      case 'parabola': {
        return {
          c: p,
          e: 1,
          focus: [p, 0],
          directrix: -p,
        }
      }
      default:
        return { c: 0, e: 0 }
    }
  }, [conicType, a, b, p])

  // 生成演示步骤
  const steps: Step[] = useMemo(() => {
    const config = conicConfigs[conicType]
    switch (conicType) {
      case 'ellipse':
        return [
          { description: `椭圆的定义：${config.definition}` },
          { description: `标准方程：x²/a² + y²/b² = 1，其中 a = ${a}，b = ${b}` },
          { description: `焦距 c = √(a² - b²) = √(${a * a} - ${b * b}) = ${calculations.c.toFixed(2)}` },
          { description: `焦点坐标：F₁(${(-calculations.c).toFixed(2)}, 0)，F₂(${calculations.c.toFixed(2)}, 0)` },
          { description: `离心率 e = c/a = ${calculations.e.toFixed(3)}（0 < e < 1）` },
          { description: `椭圆上任意一点到两焦点距离之和 = 2a = ${2 * a}` },
        ]
      case 'hyperbola':
        return [
          { description: `双曲线的定义：${config.definition}` },
          { description: `标准方程：x²/a² - y²/b² = 1，其中 a = ${a}，b = ${b}` },
          { description: `焦距 c = √(a² + b²) = √(${a * a} + ${b * b}) = ${calculations.c.toFixed(2)}` },
          { description: `焦点坐标：F₁(${(-calculations.c).toFixed(2)}, 0)，F₂(${calculations.c.toFixed(2)}, 0)` },
          { description: `离心率 e = c/a = ${calculations.e.toFixed(3)}（e > 1）` },
          { description: `渐近线方程：y = ±(b/a)x = ±${(b / a).toFixed(2)}x` },
        ]
      case 'parabola':
        return [
          { description: `抛物线的定义：${config.definition}` },
          { description: `标准方程：y² = 4px，其中 p = ${p}` },
          { description: `焦点坐标：F(${p}, 0)` },
          { description: `准线方程：x = -${p}` },
          { description: `离心率 e = 1（抛物线的离心率恒为1）` },
          { description: `抛物线上任意一点到焦点的距离等于到准线的距离` },
        ]
      default:
        return []
    }
  }, [conicType, a, b, p, calculations])

  // 动画效果
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimationAngle((prev) => (prev + 0.02) % (Math.PI * 2))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating])

  // 绘制图形
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 25

    ctx.clearRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    for (let x = centerX % scale; x < width; x += scale) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = centerY % scale; y < height; y += scale) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // 箭头
    ctx.fillStyle = '#374151'
    ctx.beginPath()
    ctx.moveTo(width - 10, centerY - 5)
    ctx.lineTo(width, centerY)
    ctx.lineTo(width - 10, centerY + 5)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(centerX - 5, 10)
    ctx.lineTo(centerX, 0)
    ctx.lineTo(centerX + 5, 10)
    ctx.closePath()
    ctx.fill()

    // 坐标轴标签
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#374151'
    ctx.fillText('x', width - 15, centerY + 20)
    ctx.fillText('y', centerX + 10, 15)
    ctx.fillText('O', centerX - 15, centerY + 15)

    const config = conicConfigs[conicType]

    // 绘制圆锥曲线
    ctx.strokeStyle = config.color
    ctx.lineWidth = 3

    switch (conicType) {
      case 'ellipse': {
        ctx.beginPath()
        for (let t = 0; t <= Math.PI * 2; t += 0.01) {
          const x = centerX + a * Math.cos(t) * scale
          const y = centerY - b * Math.sin(t) * scale
          if (t === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
        break
      }
      case 'hyperbola': {
        // 右支
        ctx.beginPath()
        for (let t = -2; t <= 2; t += 0.01) {
          const x = centerX + a * Math.cosh(t) * scale
          const y = centerY - b * Math.sinh(t) * scale
          if (t === -2) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        // 左支
        ctx.beginPath()
        for (let t = -2; t <= 2; t += 0.01) {
          const x = centerX - a * Math.cosh(t) * scale
          const y = centerY - b * Math.sinh(t) * scale
          if (t === -2) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // 渐近线
        if (showAsymptotes) {
          ctx.strokeStyle = '#9CA3AF'
          ctx.lineWidth = 1
          ctx.setLineDash([5, 5])
          const slope = b / a
          ctx.beginPath()
          ctx.moveTo(0, centerY + slope * centerX)
          ctx.lineTo(width, centerY - slope * (width - centerX))
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(0, centerY - slope * centerX)
          ctx.lineTo(width, centerY + slope * (width - centerX))
          ctx.stroke()
          ctx.setLineDash([])
        }
        break
      }
      case 'parabola': {
        ctx.beginPath()
        for (let y = -8; y <= 8; y += 0.05) {
          const x = (y * y) / (4 * p)
          const px = centerX + x * scale
          const py = centerY - y * scale
          if (y === -8) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
        break
      }
    }

    // 绘制焦点
    if (showFoci) {
      ctx.fillStyle = '#F59E0B'
      if (conicType === 'parabola') {
        ctx.beginPath()
        ctx.arc(centerX + p * scale, centerY, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.font = '12px sans-serif'
        ctx.fillText(`F(${p}, 0)`, centerX + p * scale + 10, centerY - 10)
      } else {
        const foci = calculations.foci as number[][]
        foci.forEach((f, i) => {
          ctx.beginPath()
          ctx.arc(centerX + f[0] * scale, centerY - f[1] * scale, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillText(`F${i + 1}`, centerX + f[0] * scale + 10, centerY - f[1] * scale - 10)
        })
      }
    }

    // 绘制准线
    if (showDirectrix) {
      ctx.strokeStyle = '#8B5CF6'
      ctx.lineWidth = 2
      ctx.setLineDash([10, 5])
      if (conicType === 'parabola') {
        const dx = centerX - p * scale
        ctx.beginPath()
        ctx.moveTo(dx, 0)
        ctx.lineTo(dx, height)
        ctx.stroke()
        ctx.font = '12px sans-serif'
        ctx.fillStyle = '#8B5CF6'
        ctx.fillText(`x = -${p}`, dx - 40, 30)
      } else if (conicType === 'ellipse' || conicType === 'hyperbola') {
        const dx = calculations.directrix as number
        ctx.beginPath()
        ctx.moveTo(centerX + dx * scale, 0)
        ctx.lineTo(centerX + dx * scale, height)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(centerX - dx * scale, 0)
        ctx.lineTo(centerX - dx * scale, height)
        ctx.stroke()
      }
      ctx.setLineDash([])
    }

    // 绘制动点和距离
    if (showPoint && isAnimating) {
      let px: number, py: number
      switch (conicType) {
        case 'ellipse':
          px = a * Math.cos(animationAngle)
          py = b * Math.sin(animationAngle)
          break
        case 'hyperbola':
          px = a * Math.cosh(animationAngle - Math.PI)
          py = b * Math.sinh(animationAngle - Math.PI)
          break
        case 'parabola':
          const t = (animationAngle - Math.PI) * 3
          py = t
          px = (t * t) / (4 * p)
          break
        default:
          px = 0
          py = 0
      }

      // 绘制动点
      ctx.fillStyle = '#EC4899'
      ctx.beginPath()
      ctx.arc(centerX + px * scale, centerY - py * scale, 8, 0, Math.PI * 2)
      ctx.fill()

      // 绘制到焦点的连线
      ctx.strokeStyle = '#EC4899'
      ctx.lineWidth = 2
      if (conicType === 'parabola') {
        // 到焦点的距离
        ctx.beginPath()
        ctx.moveTo(centerX + px * scale, centerY - py * scale)
        ctx.lineTo(centerX + p * scale, centerY)
        ctx.stroke()
        // 到准线的距离
        ctx.beginPath()
        ctx.moveTo(centerX + px * scale, centerY - py * scale)
        ctx.lineTo(centerX - p * scale, centerY - py * scale)
        ctx.stroke()
      } else {
        const foci = calculations.foci as number[][]
        foci.forEach((f) => {
          ctx.beginPath()
          ctx.moveTo(centerX + px * scale, centerY - py * scale)
          ctx.lineTo(centerX + f[0] * scale, centerY - f[1] * scale)
          ctx.stroke()
        })
      }
    }
  }, [conicType, a, b, p, calculations, showFoci, showDirectrix, showAsymptotes, showPoint, isAnimating, animationAngle])

  const config = conicConfigs[conicType]

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">圆锥曲线</h1>
            <p className="text-gray-600">探索椭圆、双曲线和抛物线的性质</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStartNarration}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <span>开始讲解</span>
            </button>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {isAnimating ? '停止' : '播放动画'}
            </button>
          </div>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 公式展示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">{config.name}的标准方程</h3>
            <div className="text-center">
              <div className="text-3xl mb-4">
                <BlockMath math={config.formula} />
              </div>
              <div className="text-gray-600">{config.definition}</div>
            </div>
          </div>

          {/* 图形展示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">图形演示</h3>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showFoci}
                    onChange={(e) => setShowFoci(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">焦点</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showDirectrix}
                    onChange={(e) => setShowDirectrix(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">准线</span>
                </label>
                {conicType === 'hyperbola' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showAsymptotes}
                      onChange={(e) => setShowAsymptotes(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">渐近线</span>
                  </label>
                )}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPoint}
                    onChange={(e) => setShowPoint(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">动点</span>
                </label>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={550}
              height={400}
              className="w-full border border-gray-200 rounded bg-white"
            />
            <div className="mt-2 text-sm text-gray-500 flex gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: config.color }}></span> {config.name}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> 焦点
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-purple-500 rounded"></span> 准线
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-pink-500 rounded-full"></span> 动点
              </span>
            </div>
          </div>

          {/* 关键数值 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">关键数值</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {conicType !== 'parabola' && (
                <>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-sm text-gray-600">a</div>
                    <div className="text-xl font-bold text-blue-700">{a}</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-sm text-gray-600">b</div>
                    <div className="text-xl font-bold text-green-700">{b}</div>
                  </div>
                </>
              )}
              {conicType === 'parabola' && (
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600">p</div>
                  <div className="text-xl font-bold text-blue-700">{p}</div>
                </div>
              )}
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">c (焦距)</div>
                <div className="text-xl font-bold text-yellow-700">{calculations.c.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">e (离心率)</div>
                <div className="text-xl font-bold text-purple-700">{calculations.e.toFixed(3)}</div>
              </div>
            </div>
          </div>

          {/* 步骤说明 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">知识讲解</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg transition-all ${
                    index === currentStep
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : index < currentStep
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === currentStep
                          ? 'bg-blue-500 text-white'
                          : index < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={index === currentStep ? 'font-medium' : ''}>{step.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">选择曲线类型</h3>
            <div className="space-y-2">
              {(Object.keys(conicConfigs) as ConicType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setConicType(type)
                    setCurrentStep(0)
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    conicType === type
                      ? 'text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: conicType === type ? conicConfigs[type].color : undefined,
                  }}
                >
                  <div className="font-medium">{conicConfigs[type].name}</div>
                  <div className="text-sm opacity-80">{conicConfigs[type].definition}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">调整参数</h3>
            <div className="space-y-4">
              {conicType !== 'parabola' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      a = {a}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="0.5"
                      value={a}
                      onChange={(e) => {
                        setA(parseFloat(e.target.value))
                        setCurrentStep(0)
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      b = {b}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="0.5"
                      value={b}
                      onChange={(e) => {
                        setB(parseFloat(e.target.value))
                        setCurrentStep(0)
                      }}
                      className="w-full"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    p = {p} (焦准距)
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={p}
                    onChange={(e) => {
                      setP(parseFloat(e.target.value))
                      setCurrentStep(0)
                    }}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">步骤控制</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex-1 px-3 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                上一步
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="flex-1 px-3 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                下一步
              </button>
            </div>
          </div>

          {/* 知识点说明 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">知识点</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>圆锥曲线</strong>是平面与圆锥面相交得到的曲线。</p>
              <p><strong>离心率 e</strong>：</p>
              <ul className="list-disc list-inside ml-2 text-gray-600">
                <li>椭圆：0 &lt; e &lt; 1</li>
                <li>抛物线：e = 1</li>
                <li>双曲线：e &gt; 1</li>
              </ul>
              <p><strong>焦点</strong>：圆锥曲线的特征点</p>
              <p><strong>准线</strong>：与焦点对应的特征直线</p>
              <p className="mt-2">
                <InlineMath math="e = \frac{c}{a}" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
