import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import 'katex/dist/katex.min.css'
// @ts-expect-error react-katex types
import { InlineMath, BlockMath } from 'react-katex'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { linearFunctionNarration } from '../../narrations/scripts/linear-function'

interface Step {
  description: string
}

export default function LinearFunctionExperiment() {
  const [slope, setSlope] = useState(1) // 斜率 k
  const [intercept, setIntercept] = useState(0) // 截距 b
  const [showGrid, setShowGrid] = useState(true)
  const [showIntercepts, setShowIntercepts] = useState(true)
  const [showSlopeTriangle, setShowSlopeTriangle] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [animatedSlope, setAnimatedSlope] = useState(-2)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(linearFunctionNarration)
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
    const currentSlope = isAnimating ? animatedSlope : slope
    const xIntercept = currentSlope !== 0 ? -intercept / currentSlope : null
    const yIntercept = intercept
    return {
      slope: currentSlope,
      xIntercept,
      yIntercept,
      equation: `y = ${currentSlope === 1 ? '' : currentSlope === -1 ? '-' : currentSlope}x${intercept >= 0 ? (intercept === 0 ? '' : ` + ${intercept}`) : ` - ${Math.abs(intercept)}`}`,
    }
  }, [slope, intercept, isAnimating, animatedSlope])

  // 生成演示步骤
  const steps: Step[] = useMemo(() => {
    const k = calculations.slope
    const b = calculations.yIntercept
    return [
      { description: `一次函数的一般形式是 y = kx + b，其中 k 是斜率，b 是 y 轴截距` },
      { description: `当前函数：y = ${k}x + ${b}` },
      { description: `斜率 k = ${k}，表示 x 每增加 1，y 增加 ${k}` },
      { description: `y 轴截距 b = ${b}，表示直线与 y 轴交于点 (0, ${b})` },
      { description: calculations.xIntercept !== null ? `x 轴截距：直线与 x 轴交于点 (${calculations.xIntercept.toFixed(2)}, 0)` : `当 k = 0 时，直线与 x 轴平行` },
      { description: k > 0 ? `斜率为正，函数单调递增` : k < 0 ? `斜率为负，函数单调递减` : `斜率为 0，函数为常数函数` },
    ]
  }, [calculations])

  // 动画效果 - 斜率变化
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimatedSlope((prev) => {
        const newVal = prev + 0.05
        if (newVal > 2) {
          setIsAnimating(false)
          return slope
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
  }, [isAnimating, slope])

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
    const scale = 30 // 每单位像素数

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
    // X 轴箭头
    ctx.beginPath()
    ctx.moveTo(width - 10, centerY - 5)
    ctx.lineTo(width, centerY)
    ctx.lineTo(width - 10, centerY + 5)
    ctx.closePath()
    ctx.fill()
    // Y 轴箭头
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
      if (i !== 0) {
        const x = centerX + i * scale
        ctx.beginPath()
        ctx.moveTo(x, centerY - 3)
        ctx.lineTo(x, centerY + 3)
        ctx.stroke()
        if (i % 2 === 0) {
          ctx.fillText(i.toString(), x - 5, centerY + 18)
        }
      }
    }
    for (let i = -Math.floor(centerY / scale); i <= Math.floor((height - centerY) / scale); i++) {
      if (i !== 0) {
        const y = centerY - i * scale
        ctx.beginPath()
        ctx.moveTo(centerX - 3, y)
        ctx.lineTo(centerX + 3, y)
        ctx.stroke()
        if (i % 2 === 0) {
          ctx.fillText(i.toString(), centerX + 8, y + 4)
        }
      }
    }

    const k = calculations.slope
    const b = calculations.yIntercept

    // 绘制直线
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 3
    ctx.beginPath()

    // 计算直线与画布边界的交点
    const x1 = -centerX / scale
    const y1 = k * x1 + b
    const x2 = (width - centerX) / scale
    const y2 = k * x2 + b

    ctx.moveTo(centerX + x1 * scale, centerY - y1 * scale)
    ctx.lineTo(centerX + x2 * scale, centerY - y2 * scale)
    ctx.stroke()

    // 绘制截距点
    if (showIntercepts) {
      // Y 轴截距
      ctx.fillStyle = '#10B981'
      ctx.beginPath()
      ctx.arc(centerX, centerY - b * scale, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#10B981'
      ctx.font = '12px sans-serif'
      ctx.fillText(`(0, ${b})`, centerX + 10, centerY - b * scale - 10)

      // X 轴截距
      if (calculations.xIntercept !== null && Math.abs(calculations.xIntercept) < 10) {
        ctx.fillStyle = '#EF4444'
        ctx.beginPath()
        ctx.arc(centerX + calculations.xIntercept * scale, centerY, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#EF4444'
        ctx.fillText(`(${calculations.xIntercept.toFixed(1)}, 0)`, centerX + calculations.xIntercept * scale - 20, centerY + 20)
      }
    }

    // 绘制斜率三角形
    if (showSlopeTriangle && k !== 0) {
      const triX = 1 // 从 x=1 开始
      const triY1 = k * triX + b
      const triY2 = k * (triX + 1) + b

      ctx.strokeStyle = '#F59E0B'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      // 水平线 (Δx = 1)
      ctx.beginPath()
      ctx.moveTo(centerX + triX * scale, centerY - triY1 * scale)
      ctx.lineTo(centerX + (triX + 1) * scale, centerY - triY1 * scale)
      ctx.stroke()

      // 垂直线 (Δy = k)
      ctx.beginPath()
      ctx.moveTo(centerX + (triX + 1) * scale, centerY - triY1 * scale)
      ctx.lineTo(centerX + (triX + 1) * scale, centerY - triY2 * scale)
      ctx.stroke()

      ctx.setLineDash([])

      // 标注
      ctx.fillStyle = '#F59E0B'
      ctx.font = '12px sans-serif'
      ctx.fillText('Δx=1', centerX + (triX + 0.3) * scale, centerY - triY1 * scale + 15)
      ctx.fillText(`Δy=${k.toFixed(1)}`, centerX + (triX + 1) * scale + 5, centerY - (triY1 + triY2) / 2 * scale)
    }
  }, [calculations, showGrid, showIntercepts, showSlopeTriangle])

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">一次函数</h1>
            <p className="text-gray-600">探索斜率和截距对直线的影响</p>
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
                  setAnimatedSlope(-2)
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
                <BlockMath math={`y = ${calculations.slope === 1 ? '' : calculations.slope === -1 ? '-' : calculations.slope}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept)}`} />
              </div>
              <div className="text-gray-600">
                一般形式：<InlineMath math="y = kx + b" />
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
                    checked={showIntercepts}
                    onChange={(e) => setShowIntercepts(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">截距点</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showSlopeTriangle}
                    onChange={(e) => setShowSlopeTriangle(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">斜率三角形</span>
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
                <span className="w-3 h-3 bg-blue-500 rounded"></span> 函数图像
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span> y轴截距
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> x轴截距
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-500 rounded"></span> 斜率三角形
              </span>
            </div>
          </div>

          {/* 特殊值 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">关键数值</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">斜率 k</div>
                <div className="text-xl font-bold text-blue-700">{calculations.slope.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">y轴截距 b</div>
                <div className="text-xl font-bold text-green-700">{calculations.yIntercept}</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">x轴截距</div>
                <div className="text-xl font-bold text-red-700">
                  {calculations.xIntercept !== null ? calculations.xIntercept.toFixed(2) : '无'}
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">单调性</div>
                <div className="text-xl font-bold text-purple-700">
                  {calculations.slope > 0 ? '递增' : calculations.slope < 0 ? '递减' : '常数'}
                </div>
              </div>
            </div>
          </div>

          {/* 步骤说明 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">知识讲解</h3>
            <div className="space-y-3">
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
            <h3 className="text-lg font-semibold mb-4">调整参数</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  斜率 k = {slope}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={slope}
                  onChange={(e) => {
                    setSlope(parseFloat(e.target.value))
                    setCurrentStep(0)
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>-3</span>
                  <span>0</span>
                  <span>3</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  截距 b = {intercept}
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={intercept}
                  onChange={(e) => {
                    setIntercept(parseFloat(e.target.value))
                    setCurrentStep(0)
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>-5</span>
                  <span>0</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">快速设置</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setSlope(1); setIntercept(0); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = x
              </button>
              <button
                onClick={() => { setSlope(-1); setIntercept(0); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = -x
              </button>
              <button
                onClick={() => { setSlope(2); setIntercept(1); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = 2x + 1
              </button>
              <button
                onClick={() => { setSlope(0.5); setIntercept(-2); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = 0.5x - 2
              </button>
              <button
                onClick={() => { setSlope(0); setIntercept(3); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = 3 (常数)
              </button>
              <button
                onClick={() => { setSlope(-2); setIntercept(4); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                y = -2x + 4
              </button>
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
              <p><strong>一次函数</strong>的图像是一条直线。</p>
              <p><strong>斜率 k</strong>：决定直线的倾斜程度</p>
              <ul className="list-disc list-inside ml-2 text-gray-600">
                <li>k &gt; 0：直线向右上方倾斜</li>
                <li>k &lt; 0：直线向右下方倾斜</li>
                <li>k = 0：直线与 x 轴平行</li>
                <li>|k| 越大，直线越陡</li>
              </ul>
              <p><strong>截距 b</strong>：直线与 y 轴的交点纵坐标</p>
              <p className="mt-2">
                <InlineMath math="k = \frac{\Delta y}{\Delta x} = \frac{y_2 - y_1}{x_2 - x_1}" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
