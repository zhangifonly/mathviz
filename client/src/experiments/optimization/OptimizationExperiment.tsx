import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { optimizationNarration } from '../../narrations/scripts/optimization'

type Algorithm = 'gradient' | 'momentum' | 'adam' | 'simulated-annealing' | 'genetic'
type ObjectiveFunction = 'quadratic' | 'rosenbrock' | 'rastrigin' | 'ackley'

const FUNCTIONS: Record<ObjectiveFunction, {
  name: string
  fn: (x: number, y: number) => number
  gradient: (x: number, y: number) => [number, number]
  optimum: [number, number]
}> = {
  quadratic: {
    name: '二次函数',
    fn: (x, y) => x * x + y * y,
    gradient: (x, y) => [2 * x, 2 * y],
    optimum: [0, 0],
  },
  rosenbrock: {
    name: 'Rosenbrock',
    fn: (x, y) => Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2),
    gradient: (x, y) => [
      -2 * (1 - x) - 400 * x * (y - x * x),
      200 * (y - x * x),
    ],
    optimum: [1, 1],
  },
  rastrigin: {
    name: 'Rastrigin',
    fn: (x, y) => 20 + x * x - 10 * Math.cos(2 * Math.PI * x) + y * y - 10 * Math.cos(2 * Math.PI * y),
    gradient: (x, y) => [
      2 * x + 20 * Math.PI * Math.sin(2 * Math.PI * x),
      2 * y + 20 * Math.PI * Math.sin(2 * Math.PI * y),
    ],
    optimum: [0, 0],
  },
  ackley: {
    name: 'Ackley',
    fn: (x, y) => {
      const a = 20, b = 0.2, c = 2 * Math.PI
      return -a * Math.exp(-b * Math.sqrt(0.5 * (x * x + y * y))) -
        Math.exp(0.5 * (Math.cos(c * x) + Math.cos(c * y))) + a + Math.E
    },
    gradient: (x, y) => {
      const a = 20, b = 0.2, c = 2 * Math.PI
      const r = Math.sqrt(x * x + y * y) + 1e-10
      const expTerm = Math.exp(-b * Math.sqrt(0.5 * (x * x + y * y)))
      const cosTerm = Math.exp(0.5 * (Math.cos(c * x) + Math.cos(c * y)))
      return [
        a * b * x * expTerm / (Math.sqrt(2) * r) + c * Math.sin(c * x) * cosTerm * 0.5,
        a * b * y * expTerm / (Math.sqrt(2) * r) + c * Math.sin(c * y) * cosTerm * 0.5,
      ]
    },
    optimum: [0, 0],
  },
}

export default function OptimizationExperiment() {
  const [showPresenter, setShowPresenter] = useState(false)
  const narration = useNarrationOptional()

  const [algorithm, setAlgorithm] = useState<Algorithm>('gradient')
  const [objective, setObjective] = useState<ObjectiveFunction>('quadratic')
  const [learningRate, setLearningRate] = useState(0.1)
  const [momentum, setMomentum] = useState(0.9)
  const [iterations, setIterations] = useState(50)

  // 讲解系统
  useEffect(() => {
    if (narration) {
      narration.loadScript(optimizationNarration)
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
  const [startX, setStartX] = useState(-2)
  const [startY, setStartY] = useState(2)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const animationRef = useRef<number | null>(null)

  const func = FUNCTIONS[objective]

  // 生成等高线数据
  const contourData = useMemo(() => {
    const range = objective === 'rosenbrock' ? 3 : 5
    const n = 50
    const x: number[] = []
    const y: number[] = []
    const z: number[][] = []

    for (let i = 0; i < n; i++) {
      x.push(-range + (2 * range * i) / (n - 1))
      y.push(-range + (2 * range * i) / (n - 1))
    }

    for (let j = 0; j < n; j++) {
      const row: number[] = []
      for (let i = 0; i < n; i++) {
        row.push(func.fn(x[i], y[j]))
      }
      z.push(row)
    }

    return { x, y, z }
  }, [objective, func])

  // 优化路径
  const optimizationPath = useMemo(() => {
    const path: { x: number; y: number; f: number }[] = []
    let x = startX
    let y = startY
    let vx = 0, vy = 0 // momentum
    let mx = 0, my = 0, vvx = 0, vvy = 0 // adam
    const beta1 = 0.9, beta2 = 0.999, eps = 1e-8

    path.push({ x, y, f: func.fn(x, y) })

    for (let i = 0; i < iterations; i++) {
      const [gx, gy] = func.gradient(x, y)

      switch (algorithm) {
        case 'gradient':
          x -= learningRate * gx
          y -= learningRate * gy
          break

        case 'momentum':
          vx = momentum * vx - learningRate * gx
          vy = momentum * vy - learningRate * gy
          x += vx
          y += vy
          break

        case 'adam':
          mx = beta1 * mx + (1 - beta1) * gx
          my = beta1 * my + (1 - beta1) * gy
          vvx = beta2 * vvx + (1 - beta2) * gx * gx
          vvy = beta2 * vvy + (1 - beta2) * gy * gy
          const mxHat = mx / (1 - Math.pow(beta1, i + 1))
          const myHat = my / (1 - Math.pow(beta1, i + 1))
          const vxHat = vvx / (1 - Math.pow(beta2, i + 1))
          const vyHat = vvy / (1 - Math.pow(beta2, i + 1))
          x -= learningRate * mxHat / (Math.sqrt(vxHat) + eps)
          y -= learningRate * myHat / (Math.sqrt(vyHat) + eps)
          break

        case 'simulated-annealing':
          const T = 10 * Math.exp(-i / (iterations / 3))
          const newX = x + (Math.random() - 0.5) * T
          const newY = y + (Math.random() - 0.5) * T
          const delta = func.fn(newX, newY) - func.fn(x, y)
          if (delta < 0 || Math.random() < Math.exp(-delta / T)) {
            x = newX
            y = newY
          }
          break

        case 'genetic':
          // 简化的遗传算法：局部搜索
          let bestX = x, bestY = y, bestF = func.fn(x, y)
          for (let j = 0; j < 10; j++) {
            const candX = x + (Math.random() - 0.5) * 0.5
            const candY = y + (Math.random() - 0.5) * 0.5
            const candF = func.fn(candX, candY)
            if (candF < bestF) {
              bestX = candX
              bestY = candY
              bestF = candF
            }
          }
          x = bestX
          y = bestY
          break
      }

      path.push({ x, y, f: func.fn(x, y) })
    }

    return path
  }, [algorithm, objective, learningRate, momentum, iterations, startX, startY, func])

  // 动画
  useEffect(() => {
    if (isRunning && currentStep < optimizationPath.length - 1) {
      animationRef.current = window.setTimeout(() => {
        setCurrentStep((s) => s + 1)
      }, 100)
    } else if (currentStep >= optimizationPath.length - 1) {
      setIsRunning(false)
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [isRunning, currentStep, optimizationPath.length])

  const startAnimation = () => {
    setCurrentStep(0)
    setIsRunning(true)
  }

  const currentPoint = optimizationPath[currentStep]
  const finalPoint = optimizationPath[optimizationPath.length - 1]

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">优化算法</h1>
            <p className="text-gray-600">比较梯度下降、动量、Adam、模拟退火等优化方法</p>
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
            <h3 className="text-lg font-semibold mb-2">优化路径 - {func.name}</h3>
            <Plot
              data={[
                {
                  x: contourData.x,
                  y: contourData.y,
                  z: contourData.z,
                  type: 'contour' as const,
                  colorscale: 'Viridis' as const,
                  contours: { coloring: 'heatmap' as const },
                  showscale: false,
                } as const,
                {
                  x: optimizationPath.slice(0, currentStep + 1).map((p) => p.x),
                  y: optimizationPath.slice(0, currentStep + 1).map((p) => p.y),
                  type: 'scatter' as const,
                  mode: 'lines+markers' as const,
                  line: { color: '#ef4444', width: 2 },
                  marker: { size: 4, color: '#ef4444' },
                  name: '路径',
                },
                {
                  x: [startX],
                  y: [startY],
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { size: 12, color: '#22c55e', symbol: 'circle' },
                  name: '起点',
                },
                {
                  x: [currentPoint.x],
                  y: [currentPoint.y],
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { size: 12, color: '#3b82f6', symbol: 'circle' },
                  name: '当前',
                },
                {
                  x: [func.optimum[0]],
                  y: [func.optimum[1]],
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { size: 12, color: '#f59e0b', symbol: 'star' },
                  name: '最优',
                },
              ]}
              layout={{
                autosize: true,
                height: 450,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: { text: 'x' } },
                yaxis: { title: { text: 'y' }, scaleanchor: 'x', scaleratio: 1 },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={startAnimation}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                开始动画
              </button>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {isRunning ? '暂停' : '继续'}
              </button>
              <span className="text-sm text-gray-600">
                步骤: {currentStep} / {iterations}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">收敛曲线</h3>
              <Plot
                data={[
                  {
                    x: Array.from({ length: currentStep + 1 }, (_, i) => i),
                    y: optimizationPath.slice(0, currentStep + 1).map((p) => p.f),
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    line: { color: '#8b5cf6', width: 2 },
                  } as const,
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: '迭代次数' } },
                  yaxis: { title: { text: 'f(x,y)' }, type: 'log' },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">优化结果</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded flex justify-between">
                  <span>当前位置</span>
                  <span className="font-mono">
                    ({currentPoint.x.toFixed(4)}, {currentPoint.y.toFixed(4)})
                  </span>
                </div>
                <div className="p-2 bg-green-50 rounded flex justify-between">
                  <span>当前函数值</span>
                  <span className="font-mono">{currentPoint.f.toFixed(6)}</span>
                </div>
                <div className="p-2 bg-amber-50 rounded flex justify-between">
                  <span>最优位置</span>
                  <span className="font-mono">
                    ({func.optimum[0]}, {func.optimum[1]})
                  </span>
                </div>
                <div className="p-2 bg-purple-50 rounded flex justify-between">
                  <span>距最优距离</span>
                  <span className="font-mono">
                    {Math.sqrt(
                      Math.pow(currentPoint.x - func.optimum[0], 2) +
                      Math.pow(currentPoint.y - func.optimum[1], 2)
                    ).toFixed(6)}
                  </span>
                </div>
                <div className="p-2 bg-red-50 rounded flex justify-between">
                  <span>最终函数值</span>
                  <span className="font-mono">{finalPoint.f.toFixed(6)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择算法</h3>
            <div className="space-y-2">
              {[
                { type: 'gradient' as const, name: '梯度下降' },
                { type: 'momentum' as const, name: '动量法' },
                { type: 'adam' as const, name: 'Adam' },
                { type: 'simulated-annealing' as const, name: '模拟退火' },
                { type: 'genetic' as const, name: '遗传算法' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setAlgorithm(item.type)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    algorithm === item.type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">目标函数</h3>
            <div className="space-y-2">
              {(Object.keys(FUNCTIONS) as ObjectiveFunction[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setObjective(key)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    objective === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {FUNCTIONS[key].name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">学习率: {learningRate.toFixed(3)}</label>
                <input
                  type="range"
                  min="0.001"
                  max="0.5"
                  step="0.001"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              {algorithm === 'momentum' && (
                <div>
                  <label className="text-sm text-gray-600">动量: {momentum.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="0.99"
                    step="0.01"
                    value={momentum}
                    onChange={(e) => setMomentum(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
              <div>
                <label className="text-sm text-gray-600">迭代次数: {iterations}</label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={iterations}
                  onChange={(e) => setIterations(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">起始点</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-600">x₀</label>
                <input
                  type="number"
                  step="0.5"
                  value={startX}
                  onChange={(e) => setStartX(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">y₀</label>
                <input
                  type="number"
                  step="0.5"
                  value={startY}
                  onChange={(e) => setStartY(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">梯度下降</h3>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MathFormula formula="x_{k+1} = x_k - \alpha \nabla f(x_k)" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              沿负梯度方向更新参数，α 为学习率。
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
