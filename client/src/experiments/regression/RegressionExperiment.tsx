import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { regressionNarration } from '../../narrations/scripts/regression'

type RegressionType = 'linear' | 'polynomial' | 'exponential' | 'logarithmic'

export default function RegressionExperiment() {
  const [regressionType, setRegressionType] = useState<RegressionType>('linear')
  const [polyDegree, setPolyDegree] = useState(2)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([
    { x: 1, y: 2.1 },
    { x: 2, y: 3.9 },
    { x: 3, y: 6.2 },
    { x: 4, y: 7.8 },
    { x: 5, y: 10.1 },
    { x: 6, y: 12.3 },
    { x: 7, y: 13.9 },
    { x: 8, y: 16.2 },
  ])
  const [showResiduals, setShowResiduals] = useState(false)
  const [showConfidence, setShowConfidence] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedPolyDegree, setAnimatedPolyDegree] = useState(1)
  const animationRef = useRef<number | null>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(regressionNarration)
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

  // 动画效果：逐步增加多项式阶数
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimatedPolyDegree((prev) => {
        if (prev >= 6) {
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
  }, [isAnimating])

  const currentPolyDegree = isAnimating ? animatedPolyDegree : polyDegree

  // 线性回归
  const linearRegression = useMemo(() => {
    const n = points.length
    if (n < 2) return { slope: 0, intercept: 0, r2: 0 }

    const sumX = points.reduce((s, p) => s + p.x, 0)
    const sumY = points.reduce((s, p) => s + p.y, 0)
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
    const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // R²
    const meanY = sumY / n
    const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0)
    const ssRes = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0)
    const r2 = 1 - ssRes / ssTot

    return { slope, intercept, r2 }
  }, [points])

  // 多项式回归 (使用正规方程)
  const polynomialRegression = useMemo(() => {
    const n = points.length
    const degree = Math.min(currentPolyDegree, n - 1)

    // 构建 Vandermonde 矩阵
    const X: number[][] = []
    const Y: number[] = []

    for (const p of points) {
      const row: number[] = []
      for (let j = 0; j <= degree; j++) {
        row.push(Math.pow(p.x, j))
      }
      X.push(row)
      Y.push(p.y)
    }

    // X^T * X
    const XtX: number[][] = []
    for (let i = 0; i <= degree; i++) {
      XtX.push([])
      for (let j = 0; j <= degree; j++) {
        let sum = 0
        for (let k = 0; k < n; k++) {
          sum += X[k][i] * X[k][j]
        }
        XtX[i].push(sum)
      }
    }

    // X^T * Y
    const XtY: number[] = []
    for (let i = 0; i <= degree; i++) {
      let sum = 0
      for (let k = 0; k < n; k++) {
        sum += X[k][i] * Y[k]
      }
      XtY.push(sum)
    }

    // 高斯消元求解
    const coeffs = solveLinearSystem(XtX, XtY)

    // R²
    const meanY = Y.reduce((s, y) => s + y, 0) / n
    const ssTot = Y.reduce((s, y) => s + (y - meanY) ** 2, 0)
    let ssRes = 0
    for (let i = 0; i < n; i++) {
      let pred = 0
      for (let j = 0; j <= degree; j++) {
        pred += coeffs[j] * Math.pow(points[i].x, j)
      }
      ssRes += (points[i].y - pred) ** 2
    }
    const r2 = 1 - ssRes / ssTot

    return { coeffs, r2 }
  }, [points, currentPolyDegree])

  // 指数回归 y = a * e^(bx)
  const exponentialRegression = useMemo(() => {
    const validPoints = points.filter((p) => p.y > 0)
    if (validPoints.length < 2) return { a: 1, b: 0, r2: 0 }

    // 对 y 取对数，转化为线性回归
    const logPoints = validPoints.map((p) => ({ x: p.x, y: Math.log(p.y) }))

    const n = logPoints.length
    const sumX = logPoints.reduce((s, p) => s + p.x, 0)
    const sumY = logPoints.reduce((s, p) => s + p.y, 0)
    const sumXY = logPoints.reduce((s, p) => s + p.x * p.y, 0)
    const sumX2 = logPoints.reduce((s, p) => s + p.x * p.x, 0)

    const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const a = Math.exp((sumY - b * sumX) / n)

    // R²
    const meanY = validPoints.reduce((s, p) => s + p.y, 0) / n
    const ssTot = validPoints.reduce((s, p) => s + (p.y - meanY) ** 2, 0)
    const ssRes = validPoints.reduce((s, p) => s + (p.y - a * Math.exp(b * p.x)) ** 2, 0)
    const r2 = 1 - ssRes / ssTot

    return { a, b, r2 }
  }, [points])

  // 对数回归 y = a + b * ln(x)
  const logarithmicRegression = useMemo(() => {
    const validPoints = points.filter((p) => p.x > 0)
    if (validPoints.length < 2) return { a: 0, b: 0, r2: 0 }

    const logPoints = validPoints.map((p) => ({ x: Math.log(p.x), y: p.y }))

    const n = logPoints.length
    const sumX = logPoints.reduce((s, p) => s + p.x, 0)
    const sumY = logPoints.reduce((s, p) => s + p.y, 0)
    const sumXY = logPoints.reduce((s, p) => s + p.x * p.y, 0)
    const sumX2 = logPoints.reduce((s, p) => s + p.x * p.x, 0)

    const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const a = (sumY - b * sumX) / n

    // R²
    const meanY = validPoints.reduce((s, p) => s + p.y, 0) / n
    const ssTot = validPoints.reduce((s, p) => s + (p.y - meanY) ** 2, 0)
    const ssRes = validPoints.reduce((s, p) => s + (p.y - (a + b * Math.log(p.x))) ** 2, 0)
    const r2 = 1 - ssRes / ssTot

    return { a, b, r2 }
  }, [points])

  // 生成拟合曲线
  const fittedCurve = useMemo(() => {
    const minX = Math.min(...points.map((p) => p.x)) - 0.5
    const maxX = Math.max(...points.map((p) => p.x)) + 0.5
    const xs: number[] = []
    const ys: number[] = []

    for (let x = minX; x <= maxX; x += 0.1) {
      xs.push(x)
      let y = 0

      switch (regressionType) {
        case 'linear':
          y = linearRegression.slope * x + linearRegression.intercept
          break
        case 'polynomial':
          for (let j = 0; j < polynomialRegression.coeffs.length; j++) {
            y += polynomialRegression.coeffs[j] * Math.pow(x, j)
          }
          break
        case 'exponential':
          y = exponentialRegression.a * Math.exp(exponentialRegression.b * x)
          break
        case 'logarithmic':
          if (x > 0) {
            y = logarithmicRegression.a + logarithmicRegression.b * Math.log(x)
          }
          break
      }

      ys.push(y)
    }

    return { x: xs, y: ys }
  }, [points, regressionType, linearRegression, polynomialRegression, exponentialRegression, logarithmicRegression])

  // 残差
  const residuals = useMemo(() => {
    return points.map((p) => {
      let pred = 0
      switch (regressionType) {
        case 'linear':
          pred = linearRegression.slope * p.x + linearRegression.intercept
          break
        case 'polynomial':
          for (let j = 0; j < polynomialRegression.coeffs.length; j++) {
            pred += polynomialRegression.coeffs[j] * Math.pow(p.x, j)
          }
          break
        case 'exponential':
          pred = exponentialRegression.a * Math.exp(exponentialRegression.b * p.x)
          break
        case 'logarithmic':
          if (p.x > 0) {
            pred = logarithmicRegression.a + logarithmicRegression.b * Math.log(p.x)
          }
          break
      }
      return { x: p.x, y: p.y, pred, residual: p.y - pred }
    })
  }, [points, regressionType, linearRegression, polynomialRegression, exponentialRegression, logarithmicRegression])

  // 当前模型的 R²
  const currentR2 = useMemo(() => {
    switch (regressionType) {
      case 'linear':
        return linearRegression.r2
      case 'polynomial':
        return polynomialRegression.r2
      case 'exponential':
        return exponentialRegression.r2
      case 'logarithmic':
        return logarithmicRegression.r2
    }
  }, [regressionType, linearRegression, polynomialRegression, exponentialRegression, logarithmicRegression])

  const addRandomPoint = () => {
    const maxX = Math.max(...points.map((p) => p.x), 0) + 1
    const noise = (Math.random() - 0.5) * 2
    const y = linearRegression.slope * maxX + linearRegression.intercept + noise
    setPoints([...points, { x: maxX, y }])
  }

  const resetPoints = () => {
    setPoints([
      { x: 1, y: 2.1 },
      { x: 2, y: 3.9 },
      { x: 3, y: 6.2 },
      { x: 4, y: 7.8 },
      { x: 5, y: 10.1 },
      { x: 6, y: 12.3 },
      { x: 7, y: 13.9 },
      { x: 8, y: 16.2 },
    ])
  }

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">回归分析</h1>
            <p className="text-gray-600">探索线性、多项式、指数和对数回归</p>
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
            {regressionType === 'polynomial' && (
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setAnimatedPolyDegree(1)
                  }
                  setIsAnimating(!isAnimating)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {isAnimating ? '停止' : '播放动画'}
              </button>
            )}
          </div>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">散点图与拟合曲线</h3>
            <Plot
              data={[
                {
                  x: points.map((p) => p.x),
                  y: points.map((p) => p.y),
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { size: 10, color: '#3b82f6' } as const,
                  name: '数据点',
                },
                {
                  x: fittedCurve.x,
                  y: fittedCurve.y,
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#ef4444', width: 2 } as const,
                  name: '拟合曲线',
                },
                ...(showResiduals
                  ? residuals.map((r, i) => ({
                      x: [r.x, r.x],
                      y: [r.y, r.pred],
                      type: 'scatter' as const,
                      mode: 'lines' as const,
                      line: { color: '#22c55e', width: 1, dash: 'dash' as const } as const,
                      showlegend: i === 0,
                      name: '残差',
                    }))
                  : []),
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: { text: 'x' } },
                yaxis: { title: { text: 'y' } },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">残差图</h3>
              <Plot
                data={[
                  {
                    x: residuals.map((r) => r.x),
                    y: residuals.map((r) => r.residual),
                    type: 'scatter' as const,
                    mode: 'markers' as const,
                    marker: { size: 8, color: '#8b5cf6' } as const,
                  },
                  {
                    x: [Math.min(...points.map((p) => p.x)), Math.max(...points.map((p) => p.x))],
                    y: [0, 0],
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    line: { color: '#94a3b8', dash: 'dash' as const } as const,
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: 'x' } },
                  yaxis: { title: { text: '残差' } },
                  showlegend: false,
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">模型比较</h3>
              <Plot
                data={[
                  {
                    x: ['线性', '多项式', '指数', '对数'],
                    y: [linearRegression.r2, polynomialRegression.r2, exponentialRegression.r2, logarithmicRegression.r2],
                    type: 'bar' as const,
                    marker: {
                      color: ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'],
                    } as const,
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  yaxis: { title: { text: 'R²' }, range: [0, 1] },
                  showlegend: false,
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">数据点</h3>
            <div className="flex flex-wrap gap-2">
              {points.map((p, i) => (
                <div key={i} className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center gap-2">
                  ({p.x.toFixed(1)}, {p.y.toFixed(1)})
                  <button
                    onClick={() => setPoints(points.filter((_, j) => j !== i))}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={addRandomPoint}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                添加点
              </button>
              <button
                onClick={resetPoints}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
              >
                重置
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">回归类型</h3>
            <div className="space-y-2">
              {[
                { type: 'linear' as const, name: '线性回归' },
                { type: 'polynomial' as const, name: '多项式回归' },
                { type: 'exponential' as const, name: '指数回归' },
                { type: 'logarithmic' as const, name: '对数回归' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setRegressionType(item.type)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    regressionType === item.type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {regressionType === 'polynomial' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">多项式阶数</h3>
              <div>
                <label className="text-sm text-gray-600">阶数: {polyDegree}</label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={polyDegree}
                  onChange={(e) => setPolyDegree(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">模型参数</h3>
            <div className="space-y-2 text-sm">
              {regressionType === 'linear' && (
                <>
                  <div className="p-2 bg-blue-50 rounded">
                    <MathFormula formula={`y = ${linearRegression.slope.toFixed(3)}x + ${linearRegression.intercept.toFixed(3)}`} />
                  </div>
                  <div className="p-2 bg-gray-50 rounded flex justify-between">
                    <span>斜率</span>
                    <span className="font-mono">{linearRegression.slope.toFixed(4)}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded flex justify-between">
                    <span>截距</span>
                    <span className="font-mono">{linearRegression.intercept.toFixed(4)}</span>
                  </div>
                </>
              )}
              {regressionType === 'polynomial' && (
                <div className="p-2 bg-purple-50 rounded">
                  <div className="font-mono text-xs">
                    y = {polynomialRegression.coeffs.map((c, i) =>
                      `${c >= 0 && i > 0 ? '+' : ''}${c.toFixed(2)}${i > 0 ? `x^${i}` : ''}`
                    ).join(' ')}
                  </div>
                </div>
              )}
              {regressionType === 'exponential' && (
                <div className="p-2 bg-green-50 rounded">
                  <MathFormula formula={`y = ${exponentialRegression.a.toFixed(3)} e^{${exponentialRegression.b.toFixed(3)}x}`} />
                </div>
              )}
              {regressionType === 'logarithmic' && (
                <div className="p-2 bg-amber-50 rounded">
                  <MathFormula formula={`y = ${logarithmicRegression.a.toFixed(3)} + ${logarithmicRegression.b.toFixed(3)} \\ln(x)`} />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">拟合优度</h3>
            <div className="space-y-2">
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-700">{(currentR2 * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600">R² 决定系数</div>
              </div>
              <div className="p-2 bg-gray-50 rounded flex justify-between text-sm">
                <span>残差平方和</span>
                <span className="font-mono">
                  {residuals.reduce((s, r) => s + r.residual ** 2, 0).toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">显示选项</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showResiduals}
                  onChange={(e) => setShowResiduals(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">显示残差线</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConfidence}
                  onChange={(e) => setShowConfidence(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">显示置信区间</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">最小二乘法</h3>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MathFormula formula="\min \sum_{i=1}^{n} (y_i - \hat{y}_i)^2" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              最小化残差平方和，找到最佳拟合参数。
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

// 高斯消元法求解线性方程组
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length
  const aug: number[][] = A.map((row, i) => [...row, b[i]])

  // 前向消元
  for (let i = 0; i < n; i++) {
    // 选主元
    let maxRow = i
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
        maxRow = k
      }
    }
    [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]]

    // 消元
    for (let k = i + 1; k < n; k++) {
      const factor = aug[k][i] / aug[i][i]
      for (let j = i; j <= n; j++) {
        aug[k][j] -= factor * aug[i][j]
      }
    }
  }

  // 回代
  const x: number[] = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    x[i] = aug[i][n]
    for (let j = i + 1; j < n; j++) {
      x[i] -= aug[i][j] * x[j]
    }
    x[i] /= aug[i][i]
  }

  return x
}
