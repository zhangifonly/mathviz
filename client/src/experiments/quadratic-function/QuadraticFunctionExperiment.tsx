import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import 'katex/dist/katex.min.css'
// @ts-expect-error react-katex types
import { InlineMath, BlockMath } from 'react-katex'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { quadraticFunctionNarration } from '../../narrations/scripts/quadratic-function'

interface Step {
  description: string
}

export default function QuadraticFunctionExperiment() {
  const [a, setA] = useState(1) // 二次项系数
  const [b, setB] = useState(0) // 一次项系数
  const [c, setC] = useState(0) // 常数项
  const [showGrid, setShowGrid] = useState(true)
  const [showVertex, setShowVertex] = useState(true)
  const [showAxis, setShowAxis] = useState(true)
  const [showRoots, setShowRoots] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedA, setAnimatedA] = useState(-2)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(quadraticFunctionNarration)
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

  // 计算特殊点
  const calculations = useMemo(() => {
    const currentA = isAnimating ? animatedA : a
    // 顶点坐标
    const vertexX = currentA !== 0 ? -b / (2 * currentA) : 0
    const vertexY = currentA !== 0 ? c - (b * b) / (4 * currentA) : c

    // 判别式
    const delta = b * b - 4 * currentA * c

    // 根
    let roots: number[] = []
    if (currentA !== 0) {
      if (delta > 0) {
        roots = [
          (-b + Math.sqrt(delta)) / (2 * currentA),
          (-b - Math.sqrt(delta)) / (2 * currentA),
        ]
      } else if (delta === 0) {
        roots = [-b / (2 * currentA)]
      }
    }

    // 开口方向
    const direction = currentA > 0 ? '向上' : currentA < 0 ? '向下' : '退化为直线'

    return {
      a: currentA,
      vertexX,
      vertexY,
      delta,
      roots,
      direction,
      axisOfSymmetry: vertexX,
    }
  }, [a, b, c, isAnimating, animatedA])

  // 生成演示步骤
  const steps: Step[] = useMemo(() => {
    const { vertexX, vertexY, delta, roots, direction } = calculations
    return [
      { description: `二次函数的一般形式是 y = ax² + bx + c，其中 a ≠ 0` },
      { description: `当前函数：y = ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}` },
      { description: `二次项系数 a = ${a}，决定抛物线开口${direction}` },
      { description: `顶点坐标：(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})` },
      { description: `对称轴：x = ${vertexX.toFixed(2)}` },
      { description: `判别式 Δ = b² - 4ac = ${delta.toFixed(2)}` },
      { description: delta > 0 ? `Δ > 0，有两个不等实根：x₁ = ${roots[0]?.toFixed(2)}, x₂ = ${roots[1]?.toFixed(2)}` :
                     delta === 0 ? `Δ = 0，有一个重根：x = ${roots[0]?.toFixed(2)}` :
                     `Δ < 0，无实根` },
    ]
  }, [a, b, c, calculations])

  // 动画效果 - a 值变化
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimatedA((prev) => {
        const newVal = prev + 0.03
        if (newVal > 2) {
          setIsAnimating(false)
          return a
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
  }, [isAnimating, a])

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
    const scale = 30

    ctx.clearRect(0, 0, width, height)

    // 绘制网格
    if (showGrid) {
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
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2

    // X 轴
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    // Y 轴
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

    // 刻度
    ctx.font = '12px sans-serif'
    for (let i = -Math.floor(centerX / scale); i <= Math.floor((width - centerX) / scale); i++) {
      if (i !== 0 && i % 2 === 0) {
        const x = centerX + i * scale
        ctx.beginPath()
        ctx.moveTo(x, centerY - 3)
        ctx.lineTo(x, centerY + 3)
        ctx.stroke()
        ctx.fillText(i.toString(), x - 5, centerY + 18)
      }
    }
    for (let i = -Math.floor(centerY / scale); i <= Math.floor((height - centerY) / scale); i++) {
      if (i !== 0 && i % 2 === 0) {
        const y = centerY - i * scale
        ctx.beginPath()
        ctx.moveTo(centerX - 3, y)
        ctx.lineTo(centerX + 3, y)
        ctx.stroke()
        ctx.fillText(i.toString(), centerX + 8, y + 4)
      }
    }

    const currentA = calculations.a

    // 绘制抛物线
    if (currentA !== 0) {
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 3
      ctx.beginPath()

      let firstPoint = true
      for (let px = 0; px < width; px++) {
        const x = (px - centerX) / scale
        const y = currentA * x * x + b * x + c
        const py = centerY - y * scale

        if (py >= -100 && py <= height + 100) {
          if (firstPoint) {
            ctx.moveTo(px, py)
            firstPoint = false
          } else {
            ctx.lineTo(px, py)
          }
        }
      }
      ctx.stroke()
    }

    // 绘制对称轴
    if (showAxis && currentA !== 0) {
      ctx.strokeStyle = '#9CA3AF'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      const axisX = centerX + calculations.axisOfSymmetry * scale
      ctx.beginPath()
      ctx.moveTo(axisX, 0)
      ctx.lineTo(axisX, height)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = '#9CA3AF'
      ctx.font = '12px sans-serif'
      ctx.fillText(`x = ${calculations.axisOfSymmetry.toFixed(1)}`, axisX + 5, 20)
    }

    // 绘制顶点
    if (showVertex && currentA !== 0) {
      const vx = centerX + calculations.vertexX * scale
      const vy = centerY - calculations.vertexY * scale

      ctx.fillStyle = '#EF4444'
      ctx.beginPath()
      ctx.arc(vx, vy, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#EF4444'
      ctx.font = '12px sans-serif'
      ctx.fillText(`(${calculations.vertexX.toFixed(1)}, ${calculations.vertexY.toFixed(1)})`, vx + 10, vy - 10)
    }

    // 绘制根（与 x 轴交点）
    if (showRoots && calculations.roots.length > 0) {
      ctx.fillStyle = '#10B981'
      calculations.roots.forEach((root) => {
        const rx = centerX + root * scale
        ctx.beginPath()
        ctx.arc(rx, centerY, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#10B981'
        ctx.font = '12px sans-serif'
        ctx.fillText(`(${root.toFixed(1)}, 0)`, rx - 15, centerY + 20)
      })
    }

    // Y 轴截距
    const yIntercept = c
    if (Math.abs(yIntercept) < 10) {
      ctx.fillStyle = '#8B5CF6'
      ctx.beginPath()
      ctx.arc(centerX, centerY - yIntercept * scale, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [calculations, b, c, showGrid, showVertex, showAxis, showRoots])

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">二次函数</h1>
            <p className="text-gray-600">探索抛物线的顶点、对称轴和根</p>
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
              onClick={() => {
                if (!isAnimating) {
                  setAnimatedA(-2)
                }
                setIsAnimating(!isAnimating)
              }}
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
            <h3 className="text-lg font-semibold mb-4">函数表达式</h3>
            <div className="text-center">
              <div className="text-3xl mb-4">
                <BlockMath math={`y = ${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${b >= 0 ? '+' : '-'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${b !== 0 ? 'x' : ''} ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`} />
              </div>
              <div className="text-gray-600 space-x-4">
                <span>一般式：<InlineMath math="y = ax^2 + bx + c" /></span>
                <span>顶点式：<InlineMath math={`y = ${a}(x ${calculations.vertexX >= 0 ? '-' : '+'} ${Math.abs(calculations.vertexX).toFixed(1)})^2 ${calculations.vertexY >= 0 ? '+' : '-'} ${Math.abs(calculations.vertexY).toFixed(1)}`} /></span>
              </div>
            </div>
          </div>

          {/* 图形展示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">函数图像</h3>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">网格</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showVertex}
                    onChange={(e) => setShowVertex(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">顶点</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showAxis}
                    onChange={(e) => setShowAxis(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">对称轴</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showRoots}
                    onChange={(e) => setShowRoots(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">根</span>
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
                <span className="w-3 h-3 bg-blue-500 rounded"></span> 抛物线
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> 顶点
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span> 根
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-purple-500 rounded-full"></span> y轴截距
              </span>
            </div>
          </div>

          {/* 特殊值 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">关键数值</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">顶点</div>
                <div className="text-lg font-bold text-red-700">
                  ({calculations.vertexX.toFixed(2)}, {calculations.vertexY.toFixed(2)})
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">对称轴</div>
                <div className="text-lg font-bold text-gray-700">
                  x = {calculations.axisOfSymmetry.toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">判别式 Δ</div>
                <div className="text-lg font-bold text-yellow-700">
                  {calculations.delta.toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">开口方向</div>
                <div className="text-lg font-bold text-blue-700">
                  {calculations.direction}
                </div>
              </div>
            </div>
            {calculations.roots.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">实根</div>
                <div className="text-lg font-bold text-green-700">
                  {calculations.roots.map((r, i) => `x${i + 1} = ${r.toFixed(2)}`).join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* 步骤说明 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">知识讲解</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-sm"
                >
                  {step.description}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">调整参数</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  a = {a} (二次项系数)
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={a}
                  onChange={(e) => setA(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  b = {b} (一次项系数)
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={b}
                  onChange={(e) => setB(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  c = {c} (常数项)
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={c}
                  onChange={(e) => setC(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">快速设置</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setA(1); setB(0); setC(0); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = x²
              </button>
              <button
                onClick={() => { setA(-1); setB(0); setC(0); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = -x²
              </button>
              <button
                onClick={() => { setA(1); setB(-2); setC(1); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = (x-1)²
              </button>
              <button
                onClick={() => { setA(1); setB(0); setC(-4); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = x² - 4
              </button>
              <button
                onClick={() => { setA(1); setB(-4); setC(4); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                Δ = 0 (重根)
              </button>
              <button
                onClick={() => { setA(1); setB(0); setC(1); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                Δ &lt; 0 (无实根)
              </button>
            </div>
          </div>

          {/* 知识点说明 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">知识点</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>二次函数</strong>的图像是抛物线。</p>
              <p><strong>系数 a</strong>：</p>
              <ul className="list-disc list-inside ml-2 text-gray-600">
                <li>a &gt; 0：开口向上，有最小值</li>
                <li>a &lt; 0：开口向下，有最大值</li>
                <li>|a| 越大，抛物线越窄</li>
              </ul>
              <p><strong>顶点公式</strong>：</p>
              <p className="ml-2"><InlineMath math="x = -\frac{b}{2a}, \quad y = c - \frac{b^2}{4a}" /></p>
              <p><strong>求根公式</strong>：</p>
              <p className="ml-2"><InlineMath math="x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}" /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
