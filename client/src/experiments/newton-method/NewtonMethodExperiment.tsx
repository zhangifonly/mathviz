import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { evaluate, derivative, parse } from 'mathjs'

type PresetFunction = {
  name: string
  expr: string
  x0: number
  xRange: [number, number]
}

const presets: PresetFunction[] = [
  { name: 'x² - 2', expr: 'x^2 - 2', x0: 1, xRange: [-2, 3] },
  { name: 'x³ - x - 2', expr: 'x^3 - x - 2', x0: 1.5, xRange: [-2, 3] },
  { name: 'cos(x) - x', expr: 'cos(x) - x', x0: 0.5, xRange: [-2, 2] },
  { name: 'e^x - 3x', expr: 'exp(x) - 3*x', x0: 1, xRange: [-1, 3] },
  { name: 'sin(x) - x/2', expr: 'sin(x) - x/2', x0: 2, xRange: [-4, 4] },
]

export default function NewtonMethodExperiment() {
  const [funcExpr, setFuncExpr] = useState('x^2 - 2')
  const [x0, setX0] = useState(1)
  const [maxIter, setMaxIter] = useState(10)
  const [xRange, setXRange] = useState<[number, number]>([-2, 3])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

  const evalFunc = useCallback((expr: string, x: number): number => {
    try {
      return evaluate(expr, { x })
    } catch {
      return NaN
    }
  }, [])

  const evalDerivative = useCallback((expr: string, x: number): number => {
    try {
      const node = parse(expr)
      const deriv = derivative(node, 'x')
      return deriv.evaluate({ x })
    } catch {
      return NaN
    }
  }, [])

  const iterations = useMemo(() => {
    const result: { x: number; fx: number; fpx: number; xNext: number }[] = []
    let x = x0

    for (let i = 0; i < maxIter; i++) {
      const fx = evalFunc(funcExpr, x)
      const fpx = evalDerivative(funcExpr, x)

      if (Math.abs(fpx) < 1e-10 || !isFinite(fx) || !isFinite(fpx)) break

      const xNext = x - fx / fpx
      result.push({ x, fx, fpx, xNext })

      if (Math.abs(xNext - x) < 1e-12) break
      x = xNext
    }

    return result
  }, [funcExpr, x0, maxIter, evalFunc, evalDerivative])

  // 动画效果：自动播放迭代步骤
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setCurrentStep((prev) => {
        if (prev >= iterations.length - 1) {
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 800) as unknown as number
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating, iterations.length])

  const functionCurve = useMemo(() => {
    const x: number[] = []
    const y: number[] = []
    const points = 200

    for (let i = 0; i <= points; i++) {
      const xVal = xRange[0] + (i / points) * (xRange[1] - xRange[0])
      const yVal = evalFunc(funcExpr, xVal)
      if (isFinite(yVal) && Math.abs(yVal) < 100) {
        x.push(xVal)
        y.push(yVal)
      }
    }

    return { x, y }
  }, [funcExpr, xRange, evalFunc])

  const tangentLine = useMemo(() => {
    if (currentStep >= iterations.length) return null
    const iter = iterations[currentStep]
    const slope = iter.fpx
    const x1 = iter.x - 1
    const x2 = iter.xNext + 0.5
    return {
      x: [x1, x2],
      y: [iter.fx + slope * (x1 - iter.x), iter.fx + slope * (x2 - iter.x)],
    }
  }, [iterations, currentStep])

  const stepPoints = useMemo(() => {
    const x: number[] = []
    const y: number[] = []
    for (let i = 0; i <= currentStep && i < iterations.length; i++) {
      x.push(iterations[i].x)
      y.push(iterations[i].fx)
    }
    return { x, y }
  }, [iterations, currentStep])

  const verticalLines = useMemo(() => {
    const lines: { x: number[]; y: number[] }[] = []
    for (let i = 0; i <= currentStep && i < iterations.length; i++) {
      lines.push({
        x: [iterations[i].x, iterations[i].x],
        y: [0, iterations[i].fx],
      })
    }
    return lines
  }, [iterations, currentStep])

  const selectPreset = (preset: PresetFunction) => {
    setFuncExpr(preset.expr)
    setX0(preset.x0)
    setXRange(preset.xRange)
    setCurrentStep(0)
  }

  const finalRoot = iterations.length > 0 ? iterations[iterations.length - 1].xNext : null

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">牛顿法求根</h1>
        <p className="text-gray-600">可视化牛顿-拉弗森迭代法求解方程根</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">迭代过程可视化</h3>
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setCurrentStep(0)
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
                  x: functionCurve.x,
                  y: functionCurve.y,
                  type: 'scatter',
                  mode: 'lines',
                  line: { color: '#3b82f6', width: 2 },
                  name: 'f(x)',
                },
                {
                  x: [xRange[0], xRange[1]],
                  y: [0, 0],
                  type: 'scatter',
                  mode: 'lines',
                  line: { color: '#94a3b8', width: 1 },
                  name: 'y=0',
                  showlegend: false,
                },
                ...verticalLines.map((line, i) => ({
                  x: line.x,
                  y: line.y,
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#94a3b8', width: 1, dash: 'dot' as const },
                  showlegend: false,
                  name: `vertical-${i}`,
                })),
                ...(tangentLine ? [{
                  x: tangentLine.x,
                  y: tangentLine.y,
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#ef4444', width: 2 },
                  name: '切线',
                }] : []),
                {
                  x: stepPoints.x,
                  y: stepPoints.y,
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: '#22c55e', size: 10 },
                  name: '迭代点',
                },
                ...(currentStep < iterations.length ? [{
                  x: [iterations[currentStep].xNext],
                  y: [0],
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { color: '#f59e0b', size: 12, symbol: 'diamond' },
                  name: '下一点',
                }] : []),
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x', range: xRange },
                yaxis: { title: 'f(x)' },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">迭代步骤控制</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                上一步
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, iterations.length - 1)}
                  value={currentStep}
                  onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <button
                onClick={() => setCurrentStep(Math.min(iterations.length - 1, currentStep + 1))}
                disabled={currentStep >= iterations.length - 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                下一步
              </button>
              <span className="text-sm text-gray-600 w-20">
                步骤 {currentStep + 1}/{iterations.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">迭代历史</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 text-left">n</th>
                    <th className="py-2 px-3 text-left">xₙ</th>
                    <th className="py-2 px-3 text-left">f(xₙ)</th>
                    <th className="py-2 px-3 text-left">f'(xₙ)</th>
                    <th className="py-2 px-3 text-left">xₙ₊₁</th>
                  </tr>
                </thead>
                <tbody>
                  {iterations.map((iter, i) => (
                    <tr
                      key={i}
                      className={`border-b ${i === currentStep ? 'bg-blue-50' : ''}`}
                    >
                      <td className="py-2 px-3">{i}</td>
                      <td className="py-2 px-3 font-mono">{iter.x.toFixed(10)}</td>
                      <td className="py-2 px-3 font-mono">{iter.fx.toFixed(10)}</td>
                      <td className="py-2 px-3 font-mono">{iter.fpx.toFixed(6)}</td>
                      <td className="py-2 px-3 font-mono">{iter.xNext.toFixed(10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">预设函数</h3>
            <div className="space-y-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => selectPreset(preset)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    funcExpr === preset.expr ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  f(x) = {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">初始值 x₀</label>
                <input
                  type="number"
                  step="0.1"
                  value={x0}
                  onChange={(e) => {
                    setX0(parseFloat(e.target.value))
                    setCurrentStep(0)
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">最大迭代次数: {maxIter}</label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={maxIter}
                  onChange={(e) => setMaxIter(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {finalRoot !== null && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">求解结果</h3>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-sm text-green-600">方程的根</div>
                <div className="text-2xl font-bold text-green-700 font-mono">
                  {finalRoot.toFixed(10)}
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">f(root)</span>
                  <span className="font-mono">{evalFunc(funcExpr, finalRoot).toExponential(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">迭代次数</span>
                  <span className="font-mono">{iterations.length}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">牛顿迭代公式</h3>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MathFormula formula="x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}" />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              从初始点出发，沿切线方向找到与x轴的交点作为下一个近似值，不断迭代直到收敛。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">收敛性</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 二阶收敛（误差平方级减小）</li>
              <li>• 需要初始值足够接近根</li>
              <li>• f'(x) ≠ 0 在迭代点附近</li>
              <li>• 可能发散或陷入循环</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
