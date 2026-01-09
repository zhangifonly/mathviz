import { useState, useMemo, useEffect, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { numericalAnalysisNarration } from '../../narrations/scripts/numerical-analysis'

type MethodType = 'euler' | 'rk4' | 'newton' | 'bisection'

export default function NumericalAnalysisExperiment() {
  const [method, setMethod] = useState<MethodType>('euler')
  const [stepSize, setStepSize] = useState(0.1)
  const [tolerance, setTolerance] = useState(1e-6)
  const [maxIterations, setMaxIterations] = useState(50)
  const [showError, setShowError] = useState(true)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(numericalAnalysisNarration)
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

  // 测试函数: dy/dx = -2xy, y(0) = 1, 精确解: y = e^(-x^2)
  const exactSolution = (x: number) => Math.exp(-x * x)
  const derivative = (x: number, y: number) => -2 * x * y

  // 欧拉方法
  const eulerMethod = useMemo(() => {
    const x: number[] = [0]
    const y: number[] = [1]
    const exact: number[] = [1]
    const error: number[] = [0]

    const xMax = 2
    const n = Math.floor(xMax / stepSize)

    for (let i = 0; i < n; i++) {
      const xi = x[i]
      const yi = y[i]
      const xNext = xi + stepSize
      const yNext = yi + stepSize * derivative(xi, yi)

      x.push(xNext)
      y.push(yNext)
      exact.push(exactSolution(xNext))
      error.push(Math.abs(yNext - exactSolution(xNext)))
    }

    return { x, y, exact, error }
  }, [stepSize])

  // 四阶龙格-库塔方法
  const rk4Method = useMemo(() => {
    const x: number[] = [0]
    const y: number[] = [1]
    const exact: number[] = [1]
    const error: number[] = [0]

    const xMax = 2
    const n = Math.floor(xMax / stepSize)

    for (let i = 0; i < n; i++) {
      const xi = x[i]
      const yi = y[i]

      const k1 = stepSize * derivative(xi, yi)
      const k2 = stepSize * derivative(xi + stepSize / 2, yi + k1 / 2)
      const k3 = stepSize * derivative(xi + stepSize / 2, yi + k2 / 2)
      const k4 = stepSize * derivative(xi + stepSize, yi + k3)

      const xNext = xi + stepSize
      const yNext = yi + (k1 + 2 * k2 + 2 * k3 + k4) / 6

      x.push(xNext)
      y.push(yNext)
      exact.push(exactSolution(xNext))
      error.push(Math.abs(yNext - exactSolution(xNext)))
    }

    return { x, y, exact, error }
  }, [stepSize])

  // 牛顿法求根: f(x) = x^3 - 2x - 5
  const newtonMethod = useMemo(() => {
    const f = (x: number) => x * x * x - 2 * x - 5
    const df = (x: number) => 3 * x * x - 2

    const iterations: { x: number; fx: number; error: number }[] = []
    let x = 2 // 初始猜测

    for (let i = 0; i < maxIterations; i++) {
      const fx = f(x)
      const dfx = df(x)

      iterations.push({ x, fx, error: Math.abs(fx) })

      if (Math.abs(fx) < tolerance) break

      x = x - fx / dfx
    }

    return iterations
  }, [tolerance, maxIterations])

  // 二分法求根: f(x) = x^3 - 2x - 5
  const bisectionMethod = useMemo(() => {
    const f = (x: number) => x * x * x - 2 * x - 5

    const iterations: { a: number; b: number; c: number; fc: number; error: number }[] = []
    let a = 2
    let b = 3

    for (let i = 0; i < maxIterations; i++) {
      const c = (a + b) / 2
      const fc = f(c)

      iterations.push({ a, b, c, fc, error: Math.abs(fc) })

      if (Math.abs(fc) < tolerance) break

      if (f(a) * fc < 0) {
        b = c
      } else {
        a = c
      }
    }

    return iterations
  }, [tolerance, maxIterations])

  // 绘制ODE求解结果
  const odePlotData = useMemo(() => {
    const data = method === 'euler' ? eulerMethod : rk4Method

    return [
      {
        x: data.x,
        y: data.y,
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        line: { color: '#3b82f6', width: 2 },
        marker: { size: 6 },
        name: method === 'euler' ? '欧拉法' : 'RK4',
      },
      {
        x: data.x,
        y: data.exact,
        type: 'scatter' as const,
        mode: 'lines' as const,
        line: { color: '#22c55e', width: 2, dash: 'dash' as const },
        name: '精确解',
      },
    ]
  }, [method, eulerMethod, rk4Method])

  // 绘制误差
  const errorPlotData = useMemo(() => {
    const data = method === 'euler' ? eulerMethod : rk4Method

    return [
      {
        x: data.x,
        y: data.error,
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        line: { color: '#ef4444', width: 2 },
        marker: { size: 6 },
        name: '绝对误差',
      },
    ]
  }, [method, eulerMethod, rk4Method])

  // 绘制根查找收敛过程
  const rootPlotData = useMemo(() => {
    if (method === 'newton') {
      const iterations = newtonMethod.map((iter, i) => ({ iteration: i + 1, ...iter }))
      return [
        {
          x: iterations.map(iter => iter.iteration),
          y: iterations.map(iter => Math.abs(iter.fx)),
          type: 'scatter' as const,
          mode: 'lines+markers' as const,
          line: { color: '#8b5cf6', width: 2 },
          marker: { size: 8 },
          name: '|f(x)|',
        },
      ]
    } else {
      const iterations = bisectionMethod.map((iter, i) => ({ iteration: i + 1, ...iter }))
      return [
        {
          x: iterations.map(iter => iter.iteration),
          y: iterations.map(iter => Math.abs(iter.fc)),
          type: 'scatter' as const,
          mode: 'lines+markers' as const,
          line: { color: '#f59e0b', width: 2 },
          marker: { size: 8 },
          name: '|f(c)|',
        },
      ]
    }
  }, [method, newtonMethod, bisectionMethod])

  const methodInfo: Record<MethodType, { name: string; description: string; category: string }> = {
    euler: { name: '欧拉法', description: '最简单的ODE数值解法', category: 'ODE求解' },
    rk4: { name: '龙格-库塔法', description: '四阶精度的ODE求解', category: 'ODE求解' },
    newton: { name: '牛顿法', description: '快速收敛的求根方法', category: '求根' },
    bisection: { name: '二分法', description: '稳定可靠的求根方法', category: '求根' },
  }

  const isODEMethod = method === 'euler' || method === 'rk4'
  const isRootMethod = method === 'newton' || method === 'bisection'

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">数值分析</h1>
            <p className="text-gray-600">探索数值方法的误差、稳定性和收敛性</p>
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
            {isODEMethod && (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    ODE 数值解 - {methodInfo[method].name}
                  </h3>
                  <Plot
                    data={odePlotData}
                    layout={{
                      autosize: true,
                      height: 400,
                      margin: { t: 30, r: 30, b: 40, l: 50 },
                      xaxis: { title: { text: 'x' } },
                      yaxis: { title: { text: 'y' } },
                      legend: { orientation: 'h', y: -0.15 },
                    }}
                    config={{ responsive: true, displaylogo: false }}
                    className="w-full"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    求解: dy/dx = -2xy, y(0) = 1
                  </div>
                </div>

                {showError && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold mb-2">误差分析</h3>
                    <Plot
                      data={errorPlotData}
                      layout={{
                        autosize: true,
                        height: 300,
                        margin: { t: 30, r: 30, b: 40, l: 50 },
                        xaxis: { title: { text: 'x' } },
                        yaxis: { title: { text: '绝对误差' }, type: 'log' },
                        legend: { orientation: 'h', y: -0.2 },
                      }}
                      config={{ responsive: true, displaylogo: false }}
                      className="w-full"
                    />
                  </div>
                )}
              </>
            )}

            {isRootMethod && (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    求根收敛过程 - {methodInfo[method].name}
                  </h3>
                  <Plot
                    data={rootPlotData}
                    layout={{
                      autosize: true,
                      height: 400,
                      margin: { t: 30, r: 30, b: 40, l: 50 },
                      xaxis: { title: { text: '迭代次数' } },
                      yaxis: { title: { text: '|f(x)|' }, type: 'log' },
                      legend: { orientation: 'h', y: -0.15 },
                    }}
                    config={{ responsive: true, displaylogo: false }}
                    className="w-full"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    求解: x³ - 2x - 5 = 0
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold mb-2">迭代详情</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="px-2 py-1 text-left">迭代</th>
                          {method === 'newton' ? (
                            <>
                              <th className="px-2 py-1 text-right">x</th>
                              <th className="px-2 py-1 text-right">f(x)</th>
                            </>
                          ) : (
                            <>
                              <th className="px-2 py-1 text-right">a</th>
                              <th className="px-2 py-1 text-right">b</th>
                              <th className="px-2 py-1 text-right">c</th>
                              <th className="px-2 py-1 text-right">f(c)</th>
                            </>
                          )}
                          <th className="px-2 py-1 text-right">误差</th>
                        </tr>
                      </thead>
                      <tbody>
                        {method === 'newton'
                          ? newtonMethod.slice(0, 10).map((iter, i) => (
                              <tr key={i} className="border-b">
                                <td className="px-2 py-1">{i + 1}</td>
                                <td className="px-2 py-1 text-right font-mono">{iter.x.toFixed(6)}</td>
                                <td className="px-2 py-1 text-right font-mono">{iter.fx.toFixed(6)}</td>
                                <td className="px-2 py-1 text-right font-mono">{iter.error.toExponential(2)}</td>
                              </tr>
                            ))
                          : bisectionMethod.slice(0, 10).map((iter, i) => (
                              <tr key={i} className="border-b">
                                <td className="px-2 py-1">{i + 1}</td>
                                <td className="px-2 py-1 text-right font-mono">{iter.a.toFixed(6)}</td>
                                <td className="px-2 py-1 text-right font-mono">{iter.b.toFixed(6)}</td>
                                <td className="px-2 py-1 text-right font-mono">{iter.c.toFixed(6)}</td>
                                <td className="px-2 py-1 text-right font-mono">{iter.fc.toFixed(6)}</td>
                                <td className="px-2 py-1 text-right font-mono">{iter.error.toExponential(2)}</td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">数值方法</h3>
              <div className="space-y-2">
                {(Object.keys(methodInfo) as MethodType[]).map((m) => (
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

            {isODEMethod && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-3">步长控制</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">步长 h = {stepSize}</label>
                    <input
                      type="range"
                      min="0.01"
                      max="0.5"
                      step="0.01"
                      value={stepSize}
                      onChange={(e) => setStepSize(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    <div className="text-gray-600">总步数</div>
                    <div className="text-xl font-bold text-blue-700">
                      {Math.floor(2 / stepSize)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isRootMethod && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-3">收敛参数</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">容差</label>
                    <select
                      value={tolerance}
                      onChange={(e) => setTolerance(parseFloat(e.target.value))}
                      className="w-full px-2 py-1 border rounded mt-1"
                    >
                      <option value={1e-3}>1e-3</option>
                      <option value={1e-6}>1e-6</option>
                      <option value={1e-9}>1e-9</option>
                      <option value={1e-12}>1e-12</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">最大迭代次数</label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={maxIterations}
                      onChange={(e) => setMaxIterations(parseInt(e.target.value) || 50)}
                      className="w-full px-2 py-1 border rounded mt-1"
                    />
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-sm">
                    <div className="text-gray-600">实际迭代次数</div>
                    <div className="text-xl font-bold text-purple-700">
                      {method === 'newton' ? newtonMethod.length : bisectionMethod.length}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关键公式</h3>
              {isODEMethod && (
                <div className="space-y-2">
                  {method === 'euler' ? (
                    <div className="p-3 bg-blue-50 rounded-lg text-sm">
                      <MathFormula formula="y_{n+1} = y_n + h f(x_n, y_n)" />
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 rounded-lg text-sm">
                      <MathFormula formula="y_{n+1} = y_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)" />
                    </div>
                  )}
                </div>
              )}
              {isRootMethod && (
                <div className="space-y-2">
                  {method === 'newton' ? (
                    <div className="p-3 bg-purple-50 rounded-lg text-sm">
                      <MathFormula formula="x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}" />
                    </div>
                  ) : (
                    <div className="p-3 bg-orange-50 rounded-lg text-sm">
                      <MathFormula formula="c = \frac{a + b}{2}" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {isODEMethod && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showError}
                    onChange={(e) => setShowError(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">显示误差分析</span>
                </label>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">方法特点</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {method === 'euler' && (
                  <>
                    <p><strong>优点</strong>: 简单易实现</p>
                    <p><strong>缺点</strong>: 精度低，误差累积快</p>
                    <p><strong>阶数</strong>: O(h)</p>
                  </>
                )}
                {method === 'rk4' && (
                  <>
                    <p><strong>优点</strong>: 高精度，稳定性好</p>
                    <p><strong>缺点</strong>: 计算量较大</p>
                    <p><strong>阶数</strong>: O(h⁴)</p>
                  </>
                )}
                {method === 'newton' && (
                  <>
                    <p><strong>优点</strong>: 二次收敛，速度快</p>
                    <p><strong>缺点</strong>: 需要导数，初值敏感</p>
                    <p><strong>收敛率</strong>: 二次</p>
                  </>
                )}
                {method === 'bisection' && (
                  <>
                    <p><strong>优点</strong>: 稳定可靠，必定收敛</p>
                    <p><strong>缺点</strong>: 收敛慢，需要区间</p>
                    <p><strong>收敛率</strong>: 线性</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
