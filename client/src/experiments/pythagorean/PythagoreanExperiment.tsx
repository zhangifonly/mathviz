import { useState, useEffect, useRef, useMemo } from 'react'
import 'katex/dist/katex.min.css'
// @ts-expect-error react-katex types
import { InlineMath, BlockMath } from 'react-katex'

interface Step {
  description: string
}

type DemoMode = 'basic' | 'proof' | 'application'

export default function PythagoreanExperiment() {
  const [a, setA] = useState(3) // 直角边 a
  const [b, setB] = useState(4) // 直角边 b
  const [mode, setMode] = useState<DemoMode>('basic')
  const [showSquares, setShowSquares] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 计算斜边
  const c = useMemo(() => Math.sqrt(a * a + b * b), [a, b])

  // 生成演示步骤
  const steps: Step[] = useMemo(() => {
    switch (mode) {
      case 'basic':
        return [
          { description: `勾股定理：在直角三角形中，两条直角边的平方和等于斜边的平方` },
          { description: `公式：a² + b² = c²` },
          { description: `当前直角边：a = ${a}，b = ${b}` },
          { description: `计算：${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}` },
          { description: `斜边 c = √${a * a + b * b} = ${c.toFixed(2)}` },
          { description: `验证：${c.toFixed(2)}² ≈ ${(c * c).toFixed(2)} ✓` },
        ]
      case 'proof':
        return [
          { description: `勾股定理的几何证明（面积法）` },
          { description: `在直角边上分别构建正方形` },
          { description: `边长为 a 的正方形面积 = a² = ${a * a}` },
          { description: `边长为 b 的正方形面积 = b² = ${b * b}` },
          { description: `两个小正方形面积之和 = ${a * a} + ${b * b} = ${a * a + b * b}` },
          { description: `边长为 c 的正方形面积 = c² = ${(c * c).toFixed(2)}` },
          { description: `结论：a² + b² = c²，两边面积相等！` },
        ]
      case 'application':
        return [
          { description: `勾股定理的实际应用` },
          { description: `问题：一个梯子靠在墙上，梯子长 ${c.toFixed(1)} 米` },
          { description: `梯子底部距墙 ${a} 米，求梯子顶端离地高度` },
          { description: `设高度为 h，根据勾股定理：${a}² + h² = ${c.toFixed(1)}²` },
          { description: `h² = ${(c * c).toFixed(1)} - ${a * a} = ${(c * c - a * a).toFixed(1)}` },
          { description: `h = √${(c * c - a * a).toFixed(1)} ≈ ${b.toFixed(2)} 米` },
        ]
      default:
        return []
    }
  }, [a, b, c, mode])

  // 动画效果
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimationProgress((prev) => {
        const newVal = prev + 0.01
        if (newVal >= 1) {
          setIsAnimating(false)
          return 1
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
    const gridSize = 25
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 三角形顶点
    const triX = centerX - 50
    const triY = centerY + 50
    const ax = triX
    const ay = triY
    const bx = triX + a * scale
    const by = triY
    const cx = triX
    const cy = triY - b * scale

    // 绘制直角三角形
    ctx.fillStyle = '#3B82F620'
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
    ctx.lineTo(cx, cy)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // 绘制直角标记
    const markSize = 15
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(ax + markSize, ay)
    ctx.lineTo(ax + markSize, ay - markSize)
    ctx.lineTo(ax, ay - markSize)
    ctx.stroke()

    // 绘制正方形（面积证明）
    if (showSquares) {
      const progress = isAnimating ? animationProgress : 1

      // a² 正方形（底边外侧）
      ctx.fillStyle = '#EF444440'
      ctx.strokeStyle = '#EF4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.rect(ax, ay, a * scale * progress, a * scale * progress)
      ctx.fill()
      ctx.stroke()

      // b² 正方形（左边外侧）
      ctx.fillStyle = '#10B98140'
      ctx.strokeStyle = '#10B981'
      ctx.beginPath()
      ctx.rect(ax - b * scale * progress, ay - b * scale, b * scale * progress, b * scale)
      ctx.fill()
      ctx.stroke()

      // c² 正方形（斜边外侧）- 需要旋转
      if (mode === 'proof' && progress > 0.5) {
        const cProgress = (progress - 0.5) * 2
        const angle = Math.atan2(b, a)
        const cScale = c * scale

        ctx.save()
        ctx.translate(bx, by)
        ctx.rotate(-angle)

        ctx.fillStyle = '#8B5CF640'
        ctx.strokeStyle = '#8B5CF6'
        ctx.beginPath()
        ctx.rect(0, 0, cScale * cProgress, -cScale * cProgress)
        ctx.fill()
        ctx.stroke()

        ctx.restore()
      }
    }

    // 绘制标签
    if (showLabels) {
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'

      // 边 a 标签
      ctx.fillStyle = '#EF4444'
      ctx.fillText(`a = ${a}`, (ax + bx) / 2, ay + 25)

      // 边 b 标签
      ctx.fillStyle = '#10B981'
      ctx.save()
      ctx.translate(ax - 25, (ay + cy) / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText(`b = ${b}`, 0, 0)
      ctx.restore()

      // 边 c 标签
      ctx.fillStyle = '#8B5CF6'
      const midCx = (bx + cx) / 2
      const midCy = (by + cy) / 2
      ctx.fillText(`c = ${c.toFixed(2)}`, midCx + 30, midCy)

      // 面积标签
      if (showSquares) {
        ctx.font = '14px sans-serif'
        ctx.fillStyle = '#EF4444'
        ctx.fillText(`a² = ${a * a}`, ax + (a * scale) / 2, ay + (a * scale) / 2 + 5)

        ctx.fillStyle = '#10B981'
        ctx.fillText(`b² = ${b * b}`, ax - (b * scale) / 2, ay - (b * scale) / 2)
      }
    }

    // 应用模式：绘制梯子场景
    if (mode === 'application') {
      // 墙
      ctx.fillStyle = '#9CA3AF'
      ctx.fillRect(centerX + 100, centerY - 150, 20, 200)

      // 地面
      ctx.fillStyle = '#D1D5DB'
      ctx.fillRect(centerX - 100, centerY + 50, 220, 10)

      // 梯子
      ctx.strokeStyle = '#F59E0B'
      ctx.lineWidth = 8
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(centerX + 100 - a * 15, centerY + 50)
      ctx.lineTo(centerX + 100, centerY + 50 - b * 15)
      ctx.stroke()

      // 标注
      ctx.font = '14px sans-serif'
      ctx.fillStyle = '#374151'
      ctx.fillText(`底部距墙 ${a} 米`, centerX, centerY + 80)
      ctx.fillText(`高度 ${b} 米`, centerX + 130, centerY - 50)
      ctx.fillText(`梯子长 ${c.toFixed(1)} 米`, centerX + 20, centerY - 20)
    }
  }, [a, b, c, mode, showSquares, showLabels, isAnimating, animationProgress])

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">勾股定理</h1>
          <p className="text-gray-600">探索直角三角形中边长的关系</p>
        </div>
        <button
          onClick={() => {
            if (!isAnimating) {
              setAnimationProgress(0)
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
          {/* 公式展示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">勾股定理</h3>
            <div className="text-center">
              <div className="text-3xl mb-4">
                <BlockMath math="a^2 + b^2 = c^2" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-gray-600">a²</div>
                  <div className="text-xl font-bold text-red-700">{a * a}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">b²</div>
                  <div className="text-xl font-bold text-green-700">{b * b}</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">c²</div>
                  <div className="text-xl font-bold text-purple-700">{(c * c).toFixed(2)}</div>
                </div>
              </div>
              <div className="mt-4 text-gray-600">
                <InlineMath math={`${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}`} />
                <span className="mx-2">=</span>
                <InlineMath math={`${c.toFixed(2)}^2`} />
              </div>
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
                    checked={showSquares}
                    onChange={(e) => setShowSquares(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">显示正方形</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">显示标签</span>
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
                <span className="w-3 h-3 bg-blue-500 rounded"></span> 直角三角形
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded"></span> a² 正方形
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded"></span> b² 正方形
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-purple-500 rounded"></span> c² 正方形
              </span>
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
            <h3 className="text-lg font-semibold mb-4">演示模式</h3>
            <div className="space-y-2">
              <button
                onClick={() => { setMode('basic'); setCurrentStep(0); }}
                className={`w-full p-3 rounded-lg text-left ${
                  mode === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">基础概念</div>
                <div className="text-sm opacity-80">理解勾股定理的基本公式</div>
              </button>
              <button
                onClick={() => { setMode('proof'); setCurrentStep(0); }}
                className={`w-full p-3 rounded-lg text-left ${
                  mode === 'proof' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">几何证明</div>
                <div className="text-sm opacity-80">用面积法证明勾股定理</div>
              </button>
              <button
                onClick={() => { setMode('application'); setCurrentStep(0); }}
                className={`w-full p-3 rounded-lg text-left ${
                  mode === 'application' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">实际应用</div>
                <div className="text-sm opacity-80">梯子靠墙问题</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">调整参数</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  直角边 a = {a}
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={a}
                  onChange={(e) => {
                    setA(parseInt(e.target.value))
                    setCurrentStep(0)
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  直角边 b = {b}
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={b}
                  onChange={(e) => {
                    setB(parseInt(e.target.value))
                    setCurrentStep(0)
                  }}
                  className="w-full"
                />
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">斜边 c</div>
                <div className="text-xl font-bold text-purple-700">{c.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">常见勾股数</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setA(3); setB(4); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                3, 4, 5
              </button>
              <button
                onClick={() => { setA(5); setB(12); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                5, 12, 13
              </button>
              <button
                onClick={() => { setA(8); setB(15); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                8, 15, 17
              </button>
              <button
                onClick={() => { setA(7); setB(24); }}
                className="p-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
              >
                7, 24, 25
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
              <p><strong>勾股定理</strong>是几何学中最重要的定理之一。</p>
              <p><strong>历史</strong>：中国古代称为"勾三股四弦五"，西方称为毕达哥拉斯定理。</p>
              <p><strong>勾股数</strong>：满足 a² + b² = c² 的正整数组合。</p>
              <ul className="list-disc list-inside ml-2 text-gray-600">
                <li>最小的勾股数：3, 4, 5</li>
                <li>勾股数的倍数也是勾股数</li>
                <li>如：6, 8, 10 = 2×(3, 4, 5)</li>
              </ul>
              <p className="mt-2">
                <InlineMath math="c = \sqrt{a^2 + b^2}" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
