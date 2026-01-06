import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { numericalIntegrationNarration } from '../../narrations/scripts/numerical-integration'

type IntegrationMethod = 'rectangle-left' | 'rectangle-right' | 'midpoint' | 'trapezoidal' | 'simpson'
type FunctionType = 'polynomial' | 'sine' | 'exponential' | 'gaussian'

const FUNCTIONS: Record<FunctionType, {
  name: string
  fn: (x: number) => number
  integral: (a: number, b: number) => number
  formula: string
}> = {
  polynomial: {
    name: 'x²',
    fn: (x) => x * x,
    integral: (a, b) => (b * b * b - a * a * a) / 3,
    formula: 'x^2',
  },
  sine: {
    name: 'sin(x)',
    fn: (x) => Math.sin(x),
    integral: (a, b) => -Math.cos(b) + Math.cos(a),
    formula: '\\sin(x)',
  },
  exponential: {
    name: 'e^(-x²)',
    fn: (x) => Math.exp(-x * x),
    integral: (a, b) => {
      // 使用数值积分近似
      const n = 1000
      let sum = 0
      const h = (b - a) / n
      for (let i = 0; i < n; i++) {
        const x = a + (i + 0.5) * h
        sum += Math.exp(-x * x) * h
      }
      return sum
    },
    formula: 'e^{-x^2}',
  },
  gaussian: {
    name: '1/(1+x²)',
    fn: (x) => 1 / (1 + x * x),
    integral: (a, b) => Math.atan(b) - Math.atan(a),
    formula: '\\frac{1}{1+x^2}',
  },
}

export default function NumericalIntegrationExperiment() {
  const [showPresenter, setShowPresenter] = useState(false)
  const narration = useNarrationOptional()

  const [method, setMethod] = useState<IntegrationMethod>('trapezoidal')
  const [funcType, setFuncType] = useState<FunctionType>('polynomial')
  const [lowerBound, setLowerBound] = useState(0)
  const [upperBound, setUpperBound] = useState(2)
  const [intervals, setIntervals] = useState(8)

  // 讲解系统
  useEffect(() => {
    if (narration) {
      narration.loadScript(numericalIntegrationNarration)
    }
  }, [narration])

  const handleStartNarration = useCallback(() => {
    if (narration) {
      narration.startNarration()
      narration.setPresenterMode(true)
      setShowPresenter(true)
    }
  }, [narration])

  const handleExitPresenter = useCallback(() => {
    if (narration) {
      narration.setPresenterMode(false)
    }
    setShowPresenter(false)
  }, [narration])
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedIntervals, setAnimatedIntervals] = useState(2)
  const animationRef = useRef<number | null>(null)

  // 动画效果：逐步增加区间数
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimatedIntervals((prev) => {
        if (prev >= 64) {
          setIsAnimating(false)
          return prev
        }
        return prev + 2
      })
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 200) as unknown as number
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating])

  const func = FUNCTIONS[funcType]
  const currentIntervals = isAnimating ? animatedIntervals : intervals

  // 生成函数曲线
  const curveData = useMemo(() => {
    const x: number[] = []
    const y: number[] = []
    const n = 200
    const range = upperBound - lowerBound
    const padding = range * 0.2

    for (let i = 0; i <= n; i++) {
      const xi = lowerBound - padding + ((range + 2 * padding) * i) / n
      x.push(xi)
      y.push(func.fn(xi))
    }

    return { x, y }
  }, [funcType, lowerBound, upperBound, func])

  // 数值积分计算
  const integrationResult = useMemo(() => {
    const a = lowerBound
    const b = upperBound
    const n = currentIntervals
    const h = (b - a) / n

    let result = 0
    const rectangles: { x: number; y: number; width: number; height: number }[] = []

    switch (method) {
      case 'rectangle-left':
        for (let i = 0; i < n; i++) {
          const x = a + i * h
          const y = func.fn(x)
          result += y * h
          rectangles.push({ x, y: 0, width: h, height: y })
        }
        break

      case 'rectangle-right':
        for (let i = 1; i <= n; i++) {
          const x = a + i * h
          const y = func.fn(x)
          result += y * h
          rectangles.push({ x: x - h, y: 0, width: h, height: y })
        }
        break

      case 'midpoint':
        for (let i = 0; i < n; i++) {
          const x = a + (i + 0.5) * h
          const y = func.fn(x)
          result += y * h
          rectangles.push({ x: a + i * h, y: 0, width: h, height: y })
        }
        break

      case 'trapezoidal':
        result = (func.fn(a) + func.fn(b)) / 2
        for (let i = 1; i < n; i++) {
          result += func.fn(a + i * h)
        }
        result *= h
        // 梯形可视化
        for (let i = 0; i < n; i++) {
          const x1 = a + i * h
          const x2 = a + (i + 1) * h
          rectangles.push({
            x: x1,
            y: 0,
            width: h,
            height: (func.fn(x1) + func.fn(x2)) / 2,
          })
        }
        break

      case 'simpson':
        if (n % 2 !== 0) {
          // Simpson 需要偶数个区间
          result = 0
        } else {
          result = func.fn(a) + func.fn(b)
          for (let i = 1; i < n; i++) {
            const x = a + i * h
            result += (i % 2 === 0 ? 2 : 4) * func.fn(x)
          }
          result *= h / 3
        }
        break
    }

    const exact = func.integral(a, b)
    const error = Math.abs(result - exact)
    const relativeError = exact !== 0 ? error / Math.abs(exact) : error

    return { result, exact, error, relativeError, rectangles }
  }, [method, funcType, lowerBound, upperBound, currentIntervals, func])

  // 收敛性分析
  const convergenceData = useMemo(() => {
    const ns = [2, 4, 8, 16, 32, 64, 128]
    const errors: number[] = []
    const exact = func.integral(lowerBound, upperBound)

    for (const n of ns) {
      const h = (upperBound - lowerBound) / n
      let result = 0

      switch (method) {
        case 'rectangle-left':
        case 'rectangle-right':
          for (let i = 0; i < n; i++) {
            const x = lowerBound + (method === 'rectangle-left' ? i : i + 1) * h
            result += func.fn(x) * h
          }
          break
        case 'midpoint':
          for (let i = 0; i < n; i++) {
            result += func.fn(lowerBound + (i + 0.5) * h) * h
          }
          break
        case 'trapezoidal':
          result = (func.fn(lowerBound) + func.fn(upperBound)) / 2
          for (let i = 1; i < n; i++) {
            result += func.fn(lowerBound + i * h)
          }
          result *= h
          break
        case 'simpson':
          if (n % 2 === 0) {
            result = func.fn(lowerBound) + func.fn(upperBound)
            for (let i = 1; i < n; i++) {
              result += (i % 2 === 0 ? 2 : 4) * func.fn(lowerBound + i * h)
            }
            result *= h / 3
          }
          break
      }

      errors.push(Math.abs(result - exact))
    }

    return { n: ns, errors }
  }, [method, funcType, lowerBound, upperBound, func])

  // 生成填充区域
  const fillData = useMemo(() => {
    if (method === 'simpson') {
      // Simpson 用抛物线填充
      const x: number[] = []
      const y: number[] = []
      const n = 100
      const h = (upperBound - lowerBound) / n

      for (let i = 0; i <= n; i++) {
        const xi = lowerBound + i * h
        x.push(xi)
        y.push(func.fn(xi))
      }

      return { x, y }
    }

    // 其他方法用矩形/梯形
    const shapes: { type: string; x0?: number; x1?: number; y0?: number; y1?: number; path?: string; fillcolor: string; line: { color: string; width: number } }[] = []
    const { rectangles } = integrationResult

    for (const rect of rectangles) {
      if (method === 'trapezoidal') {
        const x1 = rect.x
        const x2 = rect.x + rect.width
        shapes.push({
          type: 'path',
          path: `M ${x1} 0 L ${x1} ${func.fn(x1)} L ${x2} ${func.fn(x2)} L ${x2} 0 Z`,
          fillcolor: 'rgba(139, 92, 246, 0.3)',
          line: { color: '#8b5cf6', width: 1 },
        })
      } else {
        shapes.push({
          type: 'rect',
          x0: rect.x,
          x1: rect.x + rect.width,
          y0: 0,
          y1: rect.height,
          fillcolor: 'rgba(139, 92, 246, 0.3)',
          line: { color: '#8b5cf6', width: 1 },
        })
      }
    }

    return { shapes }
  }, [method, integrationResult, func, upperBound, lowerBound])

  const methodInfo: Record<IntegrationMethod, { name: string; order: string; formula: string }> = {
    'rectangle-left': { name: '左矩形', order: 'O(h)', formula: '\\sum_{i=0}^{n-1} f(x_i) \\cdot h' },
    'rectangle-right': { name: '右矩形', order: 'O(h)', formula: '\\sum_{i=1}^{n} f(x_i) \\cdot h' },
    'midpoint': { name: '中点法', order: 'O(h²)', formula: '\\sum_{i=0}^{n-1} f(x_{i+1/2}) \\cdot h' },
    'trapezoidal': { name: '梯形法', order: 'O(h²)', formula: '\\frac{h}{2}[f(a) + 2\\sum f(x_i) + f(b)]' },
    'simpson': { name: 'Simpson', order: 'O(h⁴)', formula: '\\frac{h}{3}[f(a) + 4\\sum f_{odd} + 2\\sum f_{even} + f(b)]' },
  }

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">数值积分</h1>
            <p className="text-gray-600">比较矩形法、梯形法和 Simpson 法</p>
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
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                积分可视化 - {methodInfo[method].name} (n={currentIntervals})
              </h3>
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setAnimatedIntervals(2)
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
            <Plot
              data={[
                {
                  x: curveData.x,
                  y: curveData.y,
                  type: 'scatter',
                  mode: 'lines',
                  line: { color: '#3b82f6', width: 3 },
                  name: `f(x) = ${func.name}`,
                },
                ...(method === 'simpson'
                  ? [{
                      x: fillData.x,
                      y: fillData.y,
                      type: 'scatter' as const,
                      mode: 'lines' as const,
                      fill: 'tozeroy' as const,
                      fillcolor: 'rgba(139, 92, 246, 0.3)',
                      line: { color: 'transparent' },
                      name: '积分区域',
                    }]
                  : []),
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x' },
                yaxis: { title: 'f(x)' },
                shapes: method !== 'simpson' ? (fillData as { shapes: unknown[] }).shapes : [],
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">收敛性分析</h3>
              <Plot
                data={[
                  {
                    x: convergenceData.n,
                    y: convergenceData.errors,
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: '#ef4444', width: 2 },
                    marker: { size: 8 },
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 60 },
                  xaxis: { title: '区间数 n', type: 'log' },
                  yaxis: { title: '误差', type: 'log' },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">计算结果</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-purple-50 rounded flex justify-between">
                  <span>数值积分</span>
                  <span className="font-mono font-bold">{integrationResult.result.toFixed(8)}</span>
                </div>
                <div className="p-2 bg-blue-50 rounded flex justify-between">
                  <span>精确值</span>
                  <span className="font-mono">{integrationResult.exact.toFixed(8)}</span>
                </div>
                <div className="p-2 bg-red-50 rounded flex justify-between">
                  <span>绝对误差</span>
                  <span className="font-mono">{integrationResult.error.toExponential(4)}</span>
                </div>
                <div className="p-2 bg-amber-50 rounded flex justify-between">
                  <span>相对误差</span>
                  <span className="font-mono">{(integrationResult.relativeError * 100).toFixed(6)}%</span>
                </div>
                <div className="p-2 bg-green-50 rounded flex justify-between">
                  <span>收敛阶</span>
                  <span className="font-mono">{methodInfo[method].order}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">方法公式</h3>
            <div className="p-4 bg-purple-50 rounded-lg">
              <MathFormula formula={`\\int_a^b f(x)dx \\approx ${methodInfo[method].formula}`} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">积分方法</h3>
            <div className="space-y-2">
              {(Object.keys(methodInfo) as IntegrationMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    method === m
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {methodInfo[m].name} ({methodInfo[m].order})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">被积函数</h3>
            <div className="space-y-2">
              {(Object.keys(FUNCTIONS) as FunctionType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFuncType(f)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    funcType === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {FUNCTIONS[f].name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">积分区间</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-600">下界 a</label>
                <input
                  type="number"
                  step="0.5"
                  value={lowerBound}
                  onChange={(e) => setLowerBound(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">上界 b</label>
                <input
                  type="number"
                  step="0.5"
                  value={upperBound}
                  onChange={(e) => setUpperBound(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">区间数</h3>
            <div>
              <label className="text-sm text-gray-600">n = {intervals}</label>
              <input
                type="range"
                min="2"
                max="64"
                step="2"
                value={intervals}
                onChange={(e) => setIntervals(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">误差分析</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>矩形法</strong>: 误差 ∝ h</p>
              <p><strong>梯形法</strong>: 误差 ∝ h²</p>
              <p><strong>Simpson</strong>: 误差 ∝ h⁴</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              区间数翻倍时，Simpson 法误差减少为原来的 1/16。
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
