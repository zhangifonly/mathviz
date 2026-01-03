import { useState, useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'

type InterpolationMethod = 'linear' | 'lagrange' | 'newton' | 'spline'

export default function InterpolationExperiment() {
  const [method, setMethod] = useState<InterpolationMethod>('lagrange')
  const [points, setPoints] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 0 },
    { x: 3, y: 3 },
    { x: 4, y: 1 },
  ])
  const [showDerivative, setShowDerivative] = useState(false)
  const [evalX, setEvalX] = useState(1.5)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

  // 动画效果：求值点沿曲线移动
  useEffect(() => {
    if (!isAnimating) return

    const minX = Math.min(...points.map((p) => p.x)) - 0.3
    const maxX = Math.max(...points.map((p) => p.x)) + 0.3

    const animate = () => {
      setEvalX((prev) => {
        const newVal = prev + 0.03
        if (newVal > maxX) {
          return minX
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
  }, [isAnimating, points])

  // 排序点
  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => a.x - b.x)
  }, [points])

  // 线性插值
  const linearInterpolation = (x: number): number => {
    if (sortedPoints.length < 2) return 0

    for (let i = 0; i < sortedPoints.length - 1; i++) {
      if (x >= sortedPoints[i].x && x <= sortedPoints[i + 1].x) {
        const t = (x - sortedPoints[i].x) / (sortedPoints[i + 1].x - sortedPoints[i].x)
        return sortedPoints[i].y + t * (sortedPoints[i + 1].y - sortedPoints[i].y)
      }
    }

    // 外推
    if (x < sortedPoints[0].x) {
      const t = (x - sortedPoints[0].x) / (sortedPoints[1].x - sortedPoints[0].x)
      return sortedPoints[0].y + t * (sortedPoints[1].y - sortedPoints[0].y)
    }
    const n = sortedPoints.length
    const t = (x - sortedPoints[n - 2].x) / (sortedPoints[n - 1].x - sortedPoints[n - 2].x)
    return sortedPoints[n - 2].y + t * (sortedPoints[n - 1].y - sortedPoints[n - 2].y)
  }

  // 拉格朗日插值
  const lagrangeInterpolation = (x: number): number => {
    let result = 0
    const n = sortedPoints.length

    for (let i = 0; i < n; i++) {
      let term = sortedPoints[i].y
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          term *= (x - sortedPoints[j].x) / (sortedPoints[i].x - sortedPoints[j].x)
        }
      }
      result += term
    }

    return result
  }

  // 牛顿插值（差商）
  const newtonInterpolation = useMemo(() => {
    const n = sortedPoints.length
    const dd: number[][] = Array(n).fill(null).map(() => Array(n).fill(0))

    // 初始化
    for (let i = 0; i < n; i++) {
      dd[i][0] = sortedPoints[i].y
    }

    // 计算差商
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        dd[i][j] = (dd[i + 1][j - 1] - dd[i][j - 1]) / (sortedPoints[i + j].x - sortedPoints[i].x)
      }
    }

    const coefficients = dd[0]

    const evaluate = (x: number): number => {
      let result = coefficients[0]
      let product = 1

      for (let i = 1; i < n; i++) {
        product *= (x - sortedPoints[i - 1].x)
        result += coefficients[i] * product
      }

      return result
    }

    return { coefficients, evaluate, dividedDifferences: dd }
  }, [sortedPoints])

  // 三次样条插值（自然边界条件）
  const splineInterpolation = useMemo(() => {
    const n = sortedPoints.length
    if (n < 3) return { evaluate: linearInterpolation }

    const h: number[] = []
    const alpha: number[] = [0]

    for (let i = 0; i < n - 1; i++) {
      h.push(sortedPoints[i + 1].x - sortedPoints[i].x)
    }

    for (let i = 1; i < n - 1; i++) {
      alpha.push(
        (3 / h[i]) * (sortedPoints[i + 1].y - sortedPoints[i].y) -
        (3 / h[i - 1]) * (sortedPoints[i].y - sortedPoints[i - 1].y)
      )
    }

    // 求解三对角系统
    const l: number[] = [1]
    const mu: number[] = [0]
    const z: number[] = [0]

    for (let i = 1; i < n - 1; i++) {
      l.push(2 * (sortedPoints[i + 1].x - sortedPoints[i - 1].x) - h[i - 1] * mu[i - 1])
      mu.push(h[i] / l[i])
      z.push((alpha[i] - h[i - 1] * z[i - 1]) / l[i])
    }

    l.push(1)
    z.push(0)

    const c: number[] = Array(n).fill(0)
    const b: number[] = Array(n - 1).fill(0)
    const d: number[] = Array(n - 1).fill(0)

    for (let j = n - 2; j >= 0; j--) {
      c[j] = z[j] - mu[j] * c[j + 1]
      b[j] = (sortedPoints[j + 1].y - sortedPoints[j].y) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3
      d[j] = (c[j + 1] - c[j]) / (3 * h[j])
    }

    const evaluate = (x: number): number => {
      let i = 0
      for (let j = 0; j < n - 1; j++) {
        if (x >= sortedPoints[j].x && x <= sortedPoints[j + 1].x) {
          i = j
          break
        }
        if (j === n - 2) i = j
      }

      const dx = x - sortedPoints[i].x
      return sortedPoints[i].y + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx
    }

    return { evaluate, b, c, d }
  }, [sortedPoints])

  // 生成插值曲线
  const curveData = useMemo(() => {
    if (sortedPoints.length < 2) return { x: [], y: [] }

    const minX = Math.min(...sortedPoints.map((p) => p.x)) - 0.5
    const maxX = Math.max(...sortedPoints.map((p) => p.x)) + 0.5
    const x: number[] = []
    const y: number[] = []
    const n = 200

    for (let i = 0; i <= n; i++) {
      const xi = minX + ((maxX - minX) * i) / n
      x.push(xi)

      let yi = 0
      switch (method) {
        case 'linear':
          yi = linearInterpolation(xi)
          break
        case 'lagrange':
          yi = lagrangeInterpolation(xi)
          break
        case 'newton':
          yi = newtonInterpolation.evaluate(xi)
          break
        case 'spline':
          yi = splineInterpolation.evaluate(xi)
          break
      }
      y.push(yi)
    }

    return { x, y }
  }, [sortedPoints, method, newtonInterpolation, splineInterpolation])

  // 计算插值点的值
  const evalResult = useMemo(() => {
    switch (method) {
      case 'linear':
        return linearInterpolation(evalX)
      case 'lagrange':
        return lagrangeInterpolation(evalX)
      case 'newton':
        return newtonInterpolation.evaluate(evalX)
      case 'spline':
        return splineInterpolation.evaluate(evalX)
    }
  }, [method, evalX, newtonInterpolation, splineInterpolation])

  // 拉格朗日基函数
  const lagrangeBasis = useMemo(() => {
    if (method !== 'lagrange') return []

    const minX = Math.min(...sortedPoints.map((p) => p.x)) - 0.5
    const maxX = Math.max(...sortedPoints.map((p) => p.x)) + 0.5
    const n = sortedPoints.length
    const basis: { x: number[]; y: number[]; name: string }[] = []

    for (let i = 0; i < n; i++) {
      const x: number[] = []
      const y: number[] = []

      for (let j = 0; j <= 100; j++) {
        const xi = minX + ((maxX - minX) * j) / 100
        x.push(xi)

        let li = 1
        for (let k = 0; k < n; k++) {
          if (k !== i) {
            li *= (xi - sortedPoints[k].x) / (sortedPoints[i].x - sortedPoints[k].x)
          }
        }
        y.push(li)
      }

      basis.push({ x, y, name: `L${i}(x)` })
    }

    return basis
  }, [method, sortedPoints])

  const addPoint = () => {
    const maxX = Math.max(...points.map((p) => p.x), 0) + 1
    setPoints([...points, { x: maxX, y: Math.random() * 4 - 1 }])
  }

  const removePoint = (index: number) => {
    if (points.length > 2) {
      setPoints(points.filter((_, i) => i !== index))
    }
  }

  const updatePoint = (index: number, field: 'x' | 'y', value: string) => {
    const newPoints = [...points]
    newPoints[index] = { ...newPoints[index], [field]: parseFloat(value) || 0 }
    setPoints(newPoints)
  }

  const methodInfo: Record<InterpolationMethod, { name: string; description: string }> = {
    linear: { name: '线性插值', description: '相邻点之间用直线连接' },
    lagrange: { name: '拉格朗日插值', description: '使用基函数的加权和' },
    newton: { name: '牛顿插值', description: '使用差商递推计算' },
    spline: { name: '三次样条', description: '分段三次多项式，二阶连续' },
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">插值方法</h1>
        <p className="text-gray-600">比较线性、拉格朗日、牛顿和样条插值</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                插值曲线 - {methodInfo[method].name}
              </h3>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
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
                  line: { color: '#8b5cf6', width: 2 },
                  name: '插值曲线',
                },
                {
                  x: sortedPoints.map((p) => p.x),
                  y: sortedPoints.map((p) => p.y),
                  type: 'scatter',
                  mode: 'markers',
                  marker: { size: 12, color: '#3b82f6' },
                  name: '数据点',
                },
                {
                  x: [evalX],
                  y: [evalResult],
                  type: 'scatter',
                  mode: 'markers',
                  marker: { size: 10, color: '#ef4444', symbol: 'diamond' },
                  name: '求值点',
                },
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x' },
                yaxis: { title: 'y' },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          {method === 'lagrange' && lagrangeBasis.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">拉格朗日基函数</h3>
              <Plot
                data={lagrangeBasis.map((basis) => ({
                  x: basis.x,
                  y: basis.y,
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  name: basis.name,
                }))}
                layout={{
                  autosize: true,
                  height: 300,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: 'x' },
                  yaxis: { title: 'L(x)' },
                  legend: { orientation: 'h', y: -0.2 },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">求值</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">x = </label>
                  <input
                    type="number"
                    step="0.1"
                    value={evalX}
                    onChange={(e) => setEvalX(parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border rounded ml-2"
                  />
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">P({evalX}) =</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {evalResult.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>

            {method === 'newton' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">差商表</h3>
                <div className="overflow-x-auto">
                  <table className="text-xs">
                    <thead>
                      <tr>
                        <th className="px-2">x</th>
                        <th className="px-2">f[x]</th>
                        {sortedPoints.slice(1).map((_, i) => (
                          <th key={i} className="px-2">f[{i + 1}]</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPoints.map((p, i) => (
                        <tr key={i}>
                          <td className="px-2">{p.x}</td>
                          {newtonInterpolation.dividedDifferences[i]
                            .slice(0, sortedPoints.length - i)
                            .map((d, j) => (
                              <td key={j} className="px-2 font-mono">
                                {d.toFixed(3)}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">插值方法</h3>
            <div className="space-y-2">
              {(Object.keys(methodInfo) as InterpolationMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    method === m
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div>{methodInfo[m].name}</div>
                  <div className="text-xs opacity-75">{methodInfo[m].description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">数据点</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {points.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={p.x}
                    onChange={(e) => updatePoint(i, 'x', e.target.value)}
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={p.y}
                    onChange={(e) => updatePoint(i, 'y', e.target.value)}
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                  <button
                    onClick={() => removePoint(i)}
                    className="text-red-500 hover:text-red-700"
                    disabled={points.length <= 2}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addPoint}
              className="w-full mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              添加点
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">拉格朗日公式</h3>
            <div className="p-3 bg-purple-50 rounded-lg text-sm">
              <MathFormula formula="P(x) = \sum_{i=0}^{n} y_i L_i(x)" />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg mt-2 text-sm">
              <MathFormula formula="L_i(x) = \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">方法比较</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>线性</strong>: 简单但不光滑</p>
              <p><strong>拉格朗日</strong>: 全局多项式，可能振荡</p>
              <p><strong>牛顿</strong>: 便于增加新点</p>
              <p><strong>样条</strong>: 光滑且稳定</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showDerivative}
                onChange={(e) => setShowDerivative(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">显示导数</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
