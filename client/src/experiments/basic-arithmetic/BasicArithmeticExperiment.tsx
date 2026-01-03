import { useState, useEffect, useRef, useMemo } from 'react'
import 'katex/dist/katex.min.css'
// @ts-expect-error react-katex types
import { InlineMath, BlockMath } from 'react-katex'

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division'

interface Step {
  description: string
  highlight: number[]
  result?: number
}

export default function BasicArithmeticExperiment() {
  const [operation, setOperation] = useState<Operation>('addition')
  const [num1, setNum1] = useState(7)
  const [num2, setNum2] = useState(5)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showBlocks, setShowBlocks] = useState(true)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 计算结果
  const result = useMemo(() => {
    switch (operation) {
      case 'addition':
        return num1 + num2
      case 'subtraction':
        return num1 - num2
      case 'multiplication':
        return num1 * num2
      case 'division':
        return num2 !== 0 ? num1 / num2 : 0
    }
  }, [operation, num1, num2])

  // 生成演示步骤
  const steps: Step[] = useMemo(() => {
    switch (operation) {
      case 'addition':
        return [
          { description: `首先，我们有 ${num1} 个方块`, highlight: Array.from({ length: num1 }, (_, i) => i) },
          { description: `然后，我们再添加 ${num2} 个方块`, highlight: Array.from({ length: num2 }, (_, i) => num1 + i) },
          { description: `数一数，一共有 ${num1 + num2} 个方块！`, highlight: Array.from({ length: num1 + num2 }, (_, i) => i), result: num1 + num2 },
        ]
      case 'subtraction':
        return [
          { description: `开始时，我们有 ${num1} 个方块`, highlight: Array.from({ length: num1 }, (_, i) => i) },
          { description: `现在，我们拿走 ${Math.min(num2, num1)} 个方块`, highlight: Array.from({ length: Math.max(0, num1 - num2) }, (_, i) => i) },
          { description: `还剩下 ${Math.max(0, num1 - num2)} 个方块！`, highlight: Array.from({ length: Math.max(0, num1 - num2) }, (_, i) => i), result: Math.max(0, num1 - num2) },
        ]
      case 'multiplication':
        return [
          { description: `乘法就是重复加法：${num1} × ${num2} 表示 ${num2} 个 ${num1}`, highlight: [] },
          { description: `我们排列 ${num2} 行，每行 ${num1} 个方块`, highlight: Array.from({ length: num1 * num2 }, (_, i) => i) },
          { description: `数一数，一共有 ${num1 * num2} 个方块！`, highlight: Array.from({ length: num1 * num2 }, (_, i) => i), result: num1 * num2 },
        ]
      case 'division':
        if (num2 === 0) {
          return [{ description: '除数不能为0！', highlight: [] }]
        }
        const quotient = Math.floor(num1 / num2)
        const remainder = num1 % num2
        return [
          { description: `除法就是平均分配：把 ${num1} 个方块平均分成 ${num2} 组`, highlight: Array.from({ length: num1 }, (_, i) => i) },
          { description: `每组可以分到 ${quotient} 个方块`, highlight: Array.from({ length: quotient * num2 }, (_, i) => i) },
          { description: remainder > 0 ? `还剩余 ${remainder} 个方块无法平均分配` : `正好分完，没有剩余！`, highlight: Array.from({ length: num1 }, (_, i) => i), result: quotient },
        ]
    }
  }, [operation, num1, num2])

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

  // 绘制数轴可视化
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // 绘制数轴
    const padding = 40
    const axisY = height / 2
    const maxNum = Math.max(Math.abs(num1), Math.abs(num2), Math.abs(result), 15) + 2
    const scale = (width - 2 * padding) / (maxNum * 2)

    // 数轴线
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, axisY)
    ctx.lineTo(width - padding, axisY)
    ctx.stroke()

    // 箭头
    ctx.beginPath()
    ctx.moveTo(width - padding, axisY)
    ctx.lineTo(width - padding - 10, axisY - 5)
    ctx.lineTo(width - padding - 10, axisY + 5)
    ctx.closePath()
    ctx.fill()

    // 刻度和数字
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#374151'

    for (let i = -maxNum; i <= maxNum; i++) {
      const x = width / 2 + i * scale
      if (x >= padding && x <= width - padding) {
        ctx.beginPath()
        ctx.moveTo(x, axisY - 5)
        ctx.lineTo(x, axisY + 5)
        ctx.stroke()
        if (i % 2 === 0 || maxNum <= 10) {
          ctx.fillText(i.toString(), x, axisY + 20)
        }
      }
    }

    // 原点标记
    ctx.fillStyle = '#3B82F6'
    ctx.beginPath()
    ctx.arc(width / 2, axisY, 4, 0, Math.PI * 2)
    ctx.fill()

    // 绘制运算过程
    const centerX = width / 2

    if (operation === 'addition') {
      // 第一个数（蓝色箭头）
      ctx.strokeStyle = '#3B82F6'
      ctx.fillStyle = '#3B82F6'
      ctx.lineWidth = 3
      const end1 = centerX + num1 * scale
      ctx.beginPath()
      ctx.moveTo(centerX, axisY - 30)
      ctx.lineTo(end1, axisY - 30)
      ctx.stroke()
      // 箭头
      ctx.beginPath()
      ctx.moveTo(end1, axisY - 30)
      ctx.lineTo(end1 - 8 * Math.sign(num1), axisY - 35)
      ctx.lineTo(end1 - 8 * Math.sign(num1), axisY - 25)
      ctx.closePath()
      ctx.fill()
      ctx.fillText(`+${num1}`, (centerX + end1) / 2, axisY - 40)

      // 第二个数（绿色箭头）
      ctx.strokeStyle = '#10B981'
      ctx.fillStyle = '#10B981'
      const end2 = end1 + num2 * scale
      ctx.beginPath()
      ctx.moveTo(end1, axisY - 15)
      ctx.lineTo(end2, axisY - 15)
      ctx.stroke()
      // 箭头
      ctx.beginPath()
      ctx.moveTo(end2, axisY - 15)
      ctx.lineTo(end2 - 8 * Math.sign(num2), axisY - 20)
      ctx.lineTo(end2 - 8 * Math.sign(num2), axisY - 10)
      ctx.closePath()
      ctx.fill()
      ctx.fillText(`+${num2}`, (end1 + end2) / 2, axisY - 25)

      // 结果标记
      ctx.fillStyle = '#EF4444'
      ctx.beginPath()
      ctx.arc(end2, axisY, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillText(`= ${result}`, end2, axisY + 35)
    } else if (operation === 'subtraction') {
      // 第一个数
      ctx.strokeStyle = '#3B82F6'
      ctx.fillStyle = '#3B82F6'
      ctx.lineWidth = 3
      const end1 = centerX + num1 * scale
      ctx.beginPath()
      ctx.moveTo(centerX, axisY - 30)
      ctx.lineTo(end1, axisY - 30)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(end1, axisY - 30)
      ctx.lineTo(end1 - 8, axisY - 35)
      ctx.lineTo(end1 - 8, axisY - 25)
      ctx.closePath()
      ctx.fill()
      ctx.fillText(`+${num1}`, (centerX + end1) / 2, axisY - 40)

      // 减去第二个数（向左的红色箭头）
      ctx.strokeStyle = '#EF4444'
      ctx.fillStyle = '#EF4444'
      const end2 = end1 - num2 * scale
      ctx.beginPath()
      ctx.moveTo(end1, axisY - 15)
      ctx.lineTo(end2, axisY - 15)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(end2, axisY - 15)
      ctx.lineTo(end2 + 8, axisY - 20)
      ctx.lineTo(end2 + 8, axisY - 10)
      ctx.closePath()
      ctx.fill()
      ctx.fillText(`-${num2}`, (end1 + end2) / 2, axisY - 25)

      // 结果
      ctx.fillStyle = '#8B5CF6'
      ctx.beginPath()
      ctx.arc(end2, axisY, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillText(`= ${result}`, end2, axisY + 35)
    }
  }, [operation, num1, num2, result])

  // 获取运算符号
  const getOperatorSymbol = () => {
    switch (operation) {
      case 'addition': return '+'
      case 'subtraction': return '-'
      case 'multiplication': return '\\times'
      case 'division': return '\\div'
    }
  }

  // 渲染方块
  const renderBlocks = () => {
    if (!showBlocks) return null

    const currentHighlight = steps[currentStep]?.highlight || []
    const blockSize = 30

    if (operation === 'multiplication') {
      // 乘法：显示为矩阵排列
      const rows = Math.min(num2, 10)
      const cols = Math.min(num1, 10)
      return (
        <div className="flex flex-col gap-1">
          {Array.from({ length: rows }).map((_, row) => (
            <div key={row} className="flex gap-1">
              {Array.from({ length: cols }).map((_, col) => {
                const index = row * cols + col
                const isHighlighted = currentHighlight.includes(index)
                return (
                  <div
                    key={col}
                    className={`transition-all duration-300 rounded ${
                      isHighlighted ? 'bg-blue-500 scale-110' : 'bg-gray-300'
                    }`}
                    style={{ width: blockSize, height: blockSize }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      )
    }

    if (operation === 'division' && num2 > 0) {
      // 除法：显示为分组
      const quotient = Math.floor(num1 / num2)
      const remainder = num1 % num2
      const groups = Math.min(num2, 10)
      const perGroup = Math.min(quotient, 10)

      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: groups }).map((_, groupIndex) => (
              <div key={groupIndex} className="p-2 border-2 border-dashed border-gray-400 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">第 {groupIndex + 1} 组</div>
                <div className="flex flex-wrap gap-1" style={{ maxWidth: 150 }}>
                  {Array.from({ length: perGroup }).map((_, blockIndex) => {
                    const index = groupIndex * perGroup + blockIndex
                    const isHighlighted = currentHighlight.includes(index)
                    return (
                      <div
                        key={blockIndex}
                        className={`transition-all duration-300 rounded ${
                          isHighlighted ? 'bg-green-500 scale-110' : 'bg-gray-300'
                        }`}
                        style={{ width: 24, height: 24 }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          {remainder > 0 && (
            <div className="p-2 border-2 border-dashed border-orange-400 rounded-lg inline-block">
              <div className="text-xs text-orange-500 mb-1">剩余</div>
              <div className="flex gap-1">
                {Array.from({ length: remainder }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-orange-400 rounded"
                    style={{ width: 24, height: 24 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    // 加法和减法：显示为两组方块
    return (
      <div className="flex flex-wrap gap-1" style={{ maxWidth: 400 }}>
        {Array.from({ length: operation === 'subtraction' ? num1 : num1 + num2 }).map((_, i) => {
          const isHighlighted = currentHighlight.includes(i)
          const isFirstGroup = i < num1
          let bgColor = 'bg-gray-300'
          if (isHighlighted) {
            bgColor = isFirstGroup ? 'bg-blue-500' : 'bg-green-500'
          }
          if (operation === 'subtraction' && !isHighlighted && currentStep >= 1) {
            bgColor = 'bg-red-300 opacity-30'
          }
          return (
            <div
              key={i}
              className={`transition-all duration-300 rounded ${bgColor} ${isHighlighted ? 'scale-110' : ''}`}
              style={{ width: blockSize, height: blockSize }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">加减乘除可视化</h1>
          <p className="text-gray-600">通过方块和数轴理解基本运算</p>
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
              <div className="text-4xl mb-4">
                <BlockMath math={`${num1} ${getOperatorSymbol()} ${num2} = ${
                  operation === 'division' && num2 !== 0
                    ? (Number.isInteger(result) ? result : result.toFixed(2))
                    : result
                }`} />
              </div>
            </div>
          </div>

          {/* 方块可视化 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">方块演示</h3>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showBlocks}
                  onChange={(e) => setShowBlocks(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">显示方块</span>
              </label>
            </div>
            <div className="min-h-[200px] flex items-center justify-center">
              {renderBlocks()}
            </div>
          </div>

          {/* 数轴可视化 */}
          {(operation === 'addition' || operation === 'subtraction') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">数轴演示</h3>
              <canvas
                ref={canvasRef}
                width={600}
                height={120}
                className="w-full border border-gray-200 rounded"
              />
              <div className="mt-2 text-sm text-gray-500 flex gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded"></span> 第一个数
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-500 rounded"></span> 第二个数
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span> 结果
                </span>
              </div>
            </div>
          )}

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
            <h3 className="text-lg font-semibold mb-4">选择运算</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'addition', label: '加法 +', color: 'blue' },
                { key: 'subtraction', label: '减法 -', color: 'red' },
                { key: 'multiplication', label: '乘法 ×', color: 'green' },
                { key: 'division', label: '除法 ÷', color: 'purple' },
              ].map((op) => (
                <button
                  key={op.key}
                  onClick={() => {
                    setOperation(op.key as Operation)
                    setCurrentStep(0)
                    setIsAnimating(false)
                  }}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    operation === op.key
                      ? `bg-${op.color}-500 text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: operation === op.key ?
                      op.color === 'blue' ? '#3B82F6' :
                      op.color === 'red' ? '#EF4444' :
                      op.color === 'green' ? '#10B981' :
                      '#8B5CF6' : undefined
                  }}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">设置数字</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  第一个数: {num1}
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
                  第二个数: {num2}
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
              {operation === 'addition' && (
                <>
                  <p><strong>加法</strong>是把两个数合并在一起。</p>
                  <p>在数轴上，加法就是向右移动。</p>
                  <p><InlineMath math="a + b = b + a" /> (交换律)</p>
                </>
              )}
              {operation === 'subtraction' && (
                <>
                  <p><strong>减法</strong>是从一个数中拿走另一个数。</p>
                  <p>在数轴上，减法就是向左移动。</p>
                  <p>减法是加法的逆运算。</p>
                </>
              )}
              {operation === 'multiplication' && (
                <>
                  <p><strong>乘法</strong>是重复加法的简便写法。</p>
                  <p><InlineMath math={`${num1} \\times ${num2}`} /> 表示 {num2} 个 {num1} 相加。</p>
                  <p><InlineMath math="a \times b = b \times a" /> (交换律)</p>
                </>
              )}
              {operation === 'division' && (
                <>
                  <p><strong>除法</strong>是把一个数平均分成若干份。</p>
                  <p><InlineMath math={`${num1} \\div ${num2}`} /> 表示把 {num1} 平均分成 {num2} 份。</p>
                  <p>除法是乘法的逆运算。</p>
                  {num2 !== 0 && num1 % num2 !== 0 && (
                    <p className="text-orange-600">
                      余数: <InlineMath math={`${num1} = ${num2} \\times ${Math.floor(num1/num2)} + ${num1 % num2}`} />
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
