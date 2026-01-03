import { useState, useEffect, useRef, useMemo } from 'react'
import 'katex/dist/katex.min.css'
// @ts-expect-error react-katex types
import { InlineMath, BlockMath } from 'react-katex'

type VisualizationType = 'pie' | 'bar' | 'grid'
type OperationType = 'compare' | 'add' | 'multiply' | 'equivalent'

interface Step {
  description: string
  fraction1Highlight?: number
  fraction2Highlight?: number
}

// 计算最大公约数
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

// 约分
function simplify(num: number, den: number): [number, number] {
  const g = gcd(Math.abs(num), Math.abs(den))
  return [num / g, den / g]
}

export default function FractionsExperiment() {
  const [visualization, setVisualization] = useState<VisualizationType>('pie')
  const [operation, setOperation] = useState<OperationType>('compare')
  const [num1, setNum1] = useState(1)
  const [den1, setDen1] = useState(4)
  const [num2, setNum2] = useState(2)
  const [den2, setDen2] = useState(3)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 计算结果
  const result = useMemo(() => {
    switch (operation) {
      case 'compare':
        const val1 = num1 / den1
        const val2 = num2 / den2
        if (val1 > val2) return '>'
        if (val1 < val2) return '<'
        return '='
      case 'add': {
        const newNum = num1 * den2 + num2 * den1
        const newDen = den1 * den2
        return simplify(newNum, newDen)
      }
      case 'multiply': {
        const newNum = num1 * num2
        const newDen = den1 * den2
        return simplify(newNum, newDen)
      }
      case 'equivalent':
        return simplify(num1, den1)
    }
  }, [operation, num1, den1, num2, den2])

  // 生成演示步骤
  const steps: Step[] = useMemo(() => {
    switch (operation) {
      case 'compare':
        return [
          { description: `第一个分数 ${num1}/${den1} 表示把整体分成 ${den1} 份，取其中 ${num1} 份` },
          { description: `第二个分数 ${num2}/${den2} 表示把整体分成 ${den2} 份，取其中 ${num2} 份` },
          { description: `比较大小：${num1}/${den1} ${result} ${num2}/${den2}` },
        ]
      case 'add':
        return [
          { description: `要相加两个分数，首先需要通分（找到公共分母）` },
          { description: `公共分母是 ${den1} × ${den2} = ${den1 * den2}` },
          { description: `${num1}/${den1} = ${num1 * den2}/${den1 * den2}，${num2}/${den2} = ${num2 * den1}/${den1 * den2}` },
          { description: `相加分子：${num1 * den2} + ${num2 * den1} = ${num1 * den2 + num2 * den1}` },
          { description: `结果：${(result as [number, number])[0]}/${(result as [number, number])[1]}` },
        ]
      case 'multiply':
        return [
          { description: `分数乘法：分子乘分子，分母乘分母` },
          { description: `分子：${num1} × ${num2} = ${num1 * num2}` },
          { description: `分母：${den1} × ${den2} = ${den1 * den2}` },
          { description: `结果：${(result as [number, number])[0]}/${(result as [number, number])[1]}` },
        ]
      case 'equivalent':
        const [sNum, sDen] = result as [number, number]
        return [
          { description: `找出 ${num1} 和 ${den1} 的最大公约数` },
          { description: `最大公约数是 ${gcd(num1, den1)}` },
          { description: `分子分母同时除以最大公约数` },
          { description: `${num1}/${den1} = ${sNum}/${sDen}` },
        ]
    }
  }, [operation, num1, den1, num2, den2, result])

  // 动画效果
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 1500) as unknown as number
    }

    animationRef.current = window.setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate)
    }, 1500) as unknown as number

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, steps.length])

  // 绘制饼图
  const drawPieChart = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    numerator: number,
    denominator: number,
    color: string,
    label: string
  ) => {
    // 绘制完整圆（背景）
    ctx.fillStyle = '#E5E7EB'
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    // 绘制分数部分
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x, y)
    const startAngle = -Math.PI / 2
    const endAngle = startAngle + (numerator / denominator) * Math.PI * 2
    ctx.arc(x, y, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fill()

    // 绘制分割线
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    for (let i = 0; i < denominator; i++) {
      const angle = startAngle + (i / denominator) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle))
      ctx.stroke()
    }

    // 绘制边框
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.stroke()

    // 标签
    ctx.fillStyle = '#374151'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, x, y + radius + 25)
  }

  // 绘制条形图
  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    numerator: number,
    denominator: number,
    color: string,
    label: string
  ) => {
    const segmentWidth = width / denominator

    // 绘制所有段
    for (let i = 0; i < denominator; i++) {
      ctx.fillStyle = i < numerator ? color : '#E5E7EB'
      ctx.fillRect(x + i * segmentWidth, y, segmentWidth - 2, height)
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      ctx.strokeRect(x + i * segmentWidth, y, segmentWidth - 2, height)
    }

    // 标签
    ctx.fillStyle = '#374151'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, x + width / 2, y + height + 25)
  }

  // 绘制网格图
  const drawGridChart = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    numerator: number,
    denominator: number,
    color: string,
    label: string
  ) => {
    // 计算网格布局
    const cols = Math.ceil(Math.sqrt(denominator))
    const rows = Math.ceil(denominator / cols)
    const cellSize = size / Math.max(cols, rows)

    for (let i = 0; i < denominator; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const cellX = x + col * cellSize
      const cellY = y + row * cellSize

      ctx.fillStyle = i < numerator ? color : '#E5E7EB'
      ctx.fillRect(cellX, cellY, cellSize - 2, cellSize - 2)
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 1
      ctx.strokeRect(cellX, cellY, cellSize - 2, cellSize - 2)
    }

    // 标签
    ctx.fillStyle = '#374151'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, x + size / 2, y + rows * cellSize + 25)
  }

  // 绘制可视化
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    const color1 = '#3B82F6'
    const color2 = '#10B981'

    if (visualization === 'pie') {
      const radius = 80
      if (operation !== 'equivalent') {
        drawPieChart(ctx, width / 4, height / 2, radius, num1, den1, color1, `${num1}/${den1}`)
        drawPieChart(ctx, (width * 3) / 4, height / 2, radius, num2, den2, color2, `${num2}/${den2}`)
      } else {
        const [sNum, sDen] = result as [number, number]
        drawPieChart(ctx, width / 4, height / 2, radius, num1, den1, color1, `${num1}/${den1}`)
        drawPieChart(ctx, (width * 3) / 4, height / 2, radius, sNum, sDen, color2, `${sNum}/${sDen}`)

        // 等号
        ctx.fillStyle = '#374151'
        ctx.font = 'bold 24px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('=', width / 2, height / 2)
      }

      // 比较符号
      if (operation === 'compare') {
        ctx.fillStyle = '#EF4444'
        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(result as string, width / 2, height / 2)
      }
    } else if (visualization === 'bar') {
      const barWidth = 200
      const barHeight = 40
      if (operation !== 'equivalent') {
        drawBarChart(ctx, (width - barWidth) / 2, height / 3 - 30, barWidth, barHeight, num1, den1, color1, `${num1}/${den1}`)
        drawBarChart(ctx, (width - barWidth) / 2, (height * 2) / 3 - 30, barWidth, barHeight, num2, den2, color2, `${num2}/${den2}`)
      } else {
        const [sNum, sDen] = result as [number, number]
        drawBarChart(ctx, (width - barWidth) / 2, height / 3 - 30, barWidth, barHeight, num1, den1, color1, `${num1}/${den1}`)
        drawBarChart(ctx, (width - barWidth) / 2, (height * 2) / 3 - 30, barWidth, barHeight, sNum, sDen, color2, `${sNum}/${sDen}`)
      }
    } else {
      const gridSize = 120
      if (operation !== 'equivalent') {
        drawGridChart(ctx, width / 4 - gridSize / 2, height / 2 - gridSize / 2, gridSize, num1, den1, color1, `${num1}/${den1}`)
        drawGridChart(ctx, (width * 3) / 4 - gridSize / 2, height / 2 - gridSize / 2, gridSize, num2, den2, color2, `${num2}/${den2}`)
      } else {
        const [sNum, sDen] = result as [number, number]
        drawGridChart(ctx, width / 4 - gridSize / 2, height / 2 - gridSize / 2, gridSize, num1, den1, color1, `${num1}/${den1}`)
        drawGridChart(ctx, (width * 3) / 4 - gridSize / 2, height / 2 - gridSize / 2, gridSize, sNum, sDen, color2, `${sNum}/${sDen}`)
      }
    }
  }, [visualization, operation, num1, den1, num2, den2, result])

  // 获取结果显示
  const getResultDisplay = () => {
    switch (operation) {
      case 'compare':
        return `\\frac{${num1}}{${den1}} ${result} \\frac{${num2}}{${den2}}`
      case 'add': {
        const [rNum, rDen] = result as [number, number]
        return `\\frac{${num1}}{${den1}} + \\frac{${num2}}{${den2}} = \\frac{${rNum}}{${rDen}}`
      }
      case 'multiply': {
        const [rNum, rDen] = result as [number, number]
        return `\\frac{${num1}}{${den1}} \\times \\frac{${num2}}{${den2}} = \\frac{${rNum}}{${rDen}}`
      }
      case 'equivalent': {
        const [rNum, rDen] = result as [number, number]
        return `\\frac{${num1}}{${den1}} = \\frac{${rNum}}{${rDen}}`
      }
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">分数可视化</h1>
          <p className="text-gray-600">通过图形理解分数的概念和运算</p>
        </div>
        <button
          onClick={() => {
            if (!isAnimating) {
              setCurrentStep(0)
            }
            setIsAnimating(!isAnimating)
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {isAnimating ? '停止' : '播放动画'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 算式展示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">算式</h3>
            <div className="text-center">
              <div className="text-3xl mb-4">
                <BlockMath math={getResultDisplay()} />
              </div>
            </div>
          </div>

          {/* 可视化展示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">图形演示</h3>
              <div className="flex gap-2">
                {[
                  { key: 'pie', label: '饼图' },
                  { key: 'bar', label: '条形图' },
                  { key: 'grid', label: '网格图' },
                ].map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setVisualization(v.key as VisualizationType)}
                    className={`px-3 py-1 rounded text-sm ${
                      visualization === v.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              className="w-full border border-gray-200 rounded bg-white"
            />
            <div className="mt-2 text-sm text-gray-500 flex gap-4">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded"></span> 第一个分数
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded"></span> 第二个分数/结果
              </span>
            </div>
          </div>

          {/* 步骤说明 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">演示步骤</h3>
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
            <h3 className="text-lg font-semibold mb-4">选择操作</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'compare', label: '比较大小' },
                { key: 'add', label: '分数加法' },
                { key: 'multiply', label: '分数乘法' },
                { key: 'equivalent', label: '约分' },
              ].map((op) => (
                <button
                  key={op.key}
                  onClick={() => {
                    setOperation(op.key as OperationType)
                    setCurrentStep(0)
                    setIsAnimating(false)
                  }}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    operation === op.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">第一个分数</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分子: {num1}
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={num1}
                  onChange={(e) => {
                    setNum1(parseInt(e.target.value))
                    setCurrentStep(0)
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分母: {den1}
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={den1}
                  onChange={(e) => {
                    setDen1(parseInt(e.target.value))
                    setCurrentStep(0)
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {operation !== 'equivalent' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-4">第二个分数</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分子: {num2}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={num2}
                    onChange={(e) => {
                      setNum2(parseInt(e.target.value))
                      setCurrentStep(0)
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分母: {den2}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={den2}
                    onChange={(e) => {
                      setDen2(parseInt(e.target.value))
                      setCurrentStep(0)
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

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
            <button
              onClick={() => setCurrentStep(0)}
              className="w-full mt-2 px-3 py-2 bg-gray-100 rounded-lg"
            >
              重置
            </button>
          </div>

          {/* 知识点说明 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">知识点</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>分数</strong>表示把整体平均分成若干份，取其中的几份。</p>
              <p><InlineMath math="\frac{a}{b}" /> 中，a 是分子，b 是分母。</p>
              {operation === 'compare' && (
                <p>比较分数大小时，可以通分后比较分子，或者转换为小数比较。</p>
              )}
              {operation === 'add' && (
                <>
                  <p>分数加法需要先通分（找公共分母）。</p>
                  <p><InlineMath math="\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}" /></p>
                </>
              )}
              {operation === 'multiply' && (
                <>
                  <p>分数乘法：分子乘分子，分母乘分母。</p>
                  <p><InlineMath math="\frac{a}{b} \times \frac{c}{d} = \frac{ac}{bd}" /></p>
                </>
              )}
              {operation === 'equivalent' && (
                <p>约分：分子分母同时除以它们的最大公约数。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
