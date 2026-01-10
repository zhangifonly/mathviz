import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gradientDescentNarration } from '../../narrations/scripts/gradient-descent'

type FunctionType = 'quadratic' | 'rosenbrock' | 'himmelblau' | 'beale'

const functions: Record<FunctionType, {
  name: string
  formula: string
  f: (x: number, y: number) => number
  gx: (x: number, y: number) => number
  gy: (x: number, y: number) => number
  xRange: [number, number]
  yRange: [number, number]
  minima: { x: number; y: number }[]
}> = {
  quadratic: {
    name: '二次函数',
    formula: 'f(x,y) = x^2 + y^2',
    f: (x, y) => x * x + y * y,
    gx: (x) => 2 * x,
    gy: (_, y) => 2 * y,
    xRange: [-3, 3],
    yRange: [-3, 3],
    minima: [{ x: 0, y: 0 }],
  },
  rosenbrock: {
    name: 'Rosenbrock 函数',
    formula: 'f(x,y) = (1-x)^2 + 100(y-x^2)^2',
    f: (x, y) => Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2),
    gx: (x, y) => -2 * (1 - x) - 400 * x * (y - x * x),
    gy: (x, y) => 200 * (y - x * x),
    xRange: [-2, 2],
    yRange: [-1, 3],
    minima: [{ x: 1, y: 1 }],
  },
  himmelblau: {
    name: 'Himmelblau 函数',
    formula: 'f(x,y) = (x^2+y-11)^2 + (x+y^2-7)^2',
    f: (x, y) => Math.pow(x * x + y - 11, 2) + Math.pow(x + y * y - 7, 2),
    gx: (x, y) => 4 * x * (x * x + y - 11) + 2 * (x + y * y - 7),
    gy: (x, y) => 2 * (x * x + y - 11) + 4 * y * (x + y * y - 7),
    xRange: [-5, 5],
    yRange: [-5, 5],
    minima: [
      { x: 3, y: 2 },
      { x: -2.805, y: 3.131 },
      { x: -3.779, y: -3.283 },
      { x: 3.584, y: -1.848 },
    ],
  },
  beale: {
    name: 'Beale 函数',
    formula: 'f(x,y) = (1.5-x+xy)^2 + ...',
    f: (x, y) =>
      Math.pow(1.5 - x + x * y, 2) +
      Math.pow(2.25 - x + x * y * y, 2) +
      Math.pow(2.625 - x + x * y * y * y, 2),
    gx: (x, y) =>
      2 * (1.5 - x + x * y) * (-1 + y) +
      2 * (2.25 - x + x * y * y) * (-1 + y * y) +
      2 * (2.625 - x + x * y * y * y) * (-1 + y * y * y),
    gy: (x, y) =>
      2 * (1.5 - x + x * y) * x +
      2 * (2.25 - x + x * y * y) * 2 * x * y +
      2 * (2.625 - x + x * y * y * y) * 3 * x * y * y,
    xRange: [-4.5, 4.5],
    yRange: [-4.5, 4.5],
    minima: [{ x: 3, y: 0.5 }],
  },
}

export default function GradientDescentExperiment() {
  const [funcType, setFuncType] = useState<FunctionType>('quadratic')
  const [startX, setStartX] = useState(-2)
  const [startY, setStartY] = useState(2)
  const [learningRate, setLearningRate] = useState(0.1)
  const [maxIter, setMaxIter] = useState(50)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const animationRef = useRef<number | null>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(gradientDescentNarration)
    }
  }, [narration])

  // 开始讲解
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

  const func = functions[funcType]

  const path = useMemo(() => {
    const result: { x: number; y: number; f: number }[] = []
    let x = startX
    let y = startY

    for (let i = 0; i < maxIter; i++) {
      const fVal = func.f(x, y)
      result.push({ x, y, f: fVal })

      const gx = func.gx(x, y)
      const gy = func.gy(x, y)

      // 梯度裁剪防止发散
      const gradNorm = Math.sqrt(gx * gx + gy * gy)
      if (gradNorm < 1e-8) break

      const clipNorm = Math.min(1, 10 / gradNorm)
      x = x - learningRate * gx * clipNorm
      y = y - learningRate * gy * clipNorm

      // 边界检查
      x = Math.max(func.xRange[0], Math.min(func.xRange[1], x))
      y = Math.max(func.yRange[0], Math.min(func.yRange[1], y))
    }

    return result
  }, [startX, startY, learningRate, maxIter, func])

  useEffect(() => {
    if (isRunning && currentStep < path.length - 1) {
      animationRef.current = window.setTimeout(() => {
        setCurrentStep((s) => {
          if (s >= path.length - 2) {
            setIsRunning(false)
          }
          return s + 1
        })
      }, 100)
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [isRunning, currentStep, path.length])

  const contourData = useMemo(() => {
    const xVals: number[] = []
    const yVals: number[] = []
    const zVals: number[][] = []
    const resolution = 50

    for (let i = 0; i <= resolution; i++) {
      xVals.push(func.xRange[0] + (i / resolution) * (func.xRange[1] - func.xRange[0]))
      yVals.push(func.yRange[0] + (i / resolution) * (func.yRange[1] - func.yRange[0]))
    }

    for (let j = 0; j <= resolution; j++) {
      const row: number[] = []
      for (let i = 0; i <= resolution; i++) {
        let z = func.f(xVals[i], yVals[j])
        // 对数缩放以便更好地显示
        z = Math.log(z + 1)
        row.push(z)
      }
      zVals.push(row)
    }

    return { x: xVals, y: yVals, z: zVals }
  }, [func])

  const visiblePath = path.slice(0, currentStep + 1)

  const startAnimation = () => {
    setCurrentStep(0)
    setIsRunning(true)
  }

  const resetAnimation = () => {
    setIsRunning(false)
    setCurrentStep(0)
  }

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">梯度下降</h1>
          <p className="text-gray-600">可视化优化算法如何找到函数最小值</p>
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
            <h3 className="text-lg font-semibold mb-2">优化路径</h3>
            <Plot
              data={[
                {
                  x: contourData.x,
                  y: contourData.y,
                  z: contourData.z,
                  type: 'contour' as const,
                  colorscale: 'Viridis' as const,
                  showscale: false,
                  contours: { coloring: 'heatmap' as const },
                },
                {
                  x: visiblePath.map((p) => p.x),
                  y: visiblePath.map((p) => p.y),
                  type: 'scatter' as const,
                  mode: 'lines+markers' as const,
                  line: { color: '#ef4444', width: 2 },
                  marker: { color: '#ef4444', size: 6 },
                  name: '优化路径',
                },
                {
                  x: [visiblePath[visiblePath.length - 1]?.x],
                  y: [visiblePath[visiblePath.length - 1]?.y],
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { color: '#22c55e', size: 14, symbol: 'star' },
                  name: '当前位置',
                },
                ...func.minima.map((m, i) => ({
                  x: [m.x],
                  y: [m.y],
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { color: '#f59e0b', size: 12, symbol: 'x' },
                  name: i === 0 ? '全局最小值' : `局部最小值 ${i}`,
                })),
              ]}
              layout={{
                autosize: true,
                height: 450,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: { text: 'x' }, range: func.xRange },
                yaxis: { title: { text: 'y' }, range: func.yRange, scaleanchor: 'x', scaleratio: 1 },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true, displaylogo: false }}
              className="w-full"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">损失函数值</h3>
            <Plot
              data={[
                {
                  x: visiblePath.map((_, i) => i),
                  y: visiblePath.map((p) => p.f),
                  type: 'scatter' as const,
                  mode: 'lines+markers' as const,
                  line: { color: '#8b5cf6', width: 2 },
                  marker: { size: 4 },
                },
              ]}
              layout={{
                autosize: true,
                height: 200,
                margin: { t: 30, r: 30, b: 40, l: 60 },
                xaxis: { title: { text: '迭代次数' } },
                yaxis: { title: { text: 'f(x,y)' }, type: 'log' },
              }}
              config={{ responsive: true, displaylogo: false }}
              className="w-full"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={startAnimation}
                disabled={isRunning}
                className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 hover:bg-green-600"
              >
                开始动画
              </button>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isRunning ? '暂停' : '继续'}
              </button>
              <button
                onClick={resetAnimation}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                重置
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={path.length - 1}
                  value={currentStep}
                  onChange={(e) => {
                    setIsRunning(false)
                    setCurrentStep(parseInt(e.target.value))
                  }}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-gray-600 w-24">
                步骤 {currentStep + 1}/{path.length}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择函数</h3>
            <div className="space-y-2">
              {(Object.keys(functions) as FunctionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFuncType(type)
                    resetAnimation()
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    funcType === type ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {functions[type].name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">起始点 X: {startX.toFixed(1)}</label>
                <input
                  type="range"
                  min={func.xRange[0]}
                  max={func.xRange[1]}
                  step="0.1"
                  value={startX}
                  onChange={(e) => {
                    setStartX(parseFloat(e.target.value))
                    resetAnimation()
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">起始点 Y: {startY.toFixed(1)}</label>
                <input
                  type="range"
                  min={func.yRange[0]}
                  max={func.yRange[1]}
                  step="0.1"
                  value={startY}
                  onChange={(e) => {
                    setStartY(parseFloat(e.target.value))
                    resetAnimation()
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">学习率: {learningRate.toFixed(3)}</label>
                <input
                  type="range"
                  min="0.001"
                  max="0.5"
                  step="0.001"
                  value={learningRate}
                  onChange={(e) => {
                    setLearningRate(parseFloat(e.target.value))
                    resetAnimation()
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">最大迭代: {maxIter}</label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={maxIter}
                  onChange={(e) => {
                    setMaxIter(parseInt(e.target.value))
                    resetAnimation()
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">当前状态</h3>
            <div className="space-y-2">
              <div className="p-2 bg-purple-50 rounded flex justify-between">
                <span className="text-purple-600">位置</span>
                <span className="font-mono text-sm">
                  ({visiblePath[visiblePath.length - 1]?.x.toFixed(4)},{' '}
                  {visiblePath[visiblePath.length - 1]?.y.toFixed(4)})
                </span>
              </div>
              <div className="p-2 bg-blue-50 rounded flex justify-between">
                <span className="text-blue-600">函数值</span>
                <span className="font-mono text-sm">
                  {visiblePath[visiblePath.length - 1]?.f.toExponential(4)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">梯度下降公式</h3>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MathFormula formula="\mathbf{x}_{n+1} = \mathbf{x}_n - \alpha \nabla f(\mathbf{x}_n)" />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              沿负梯度方向移动，学习率 α 控制步长大小。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">学习率影响</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 太小：收敛缓慢</li>
              <li>• 太大：可能发散或震荡</li>
              <li>• 适中：快速稳定收敛</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
