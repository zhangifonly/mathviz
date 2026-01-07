import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { heatEquationNarration } from '../../narrations/scripts/heat-equation'

type InitialCondition = 'step' | 'gaussian' | 'sine' | 'random'
type BoundaryCondition = 'dirichlet' | 'neumann' | 'periodic'

export default function HeatEquationExperiment() {
  const [initialCondition, setInitialCondition] = useState<InitialCondition>('gaussian')
  const [boundaryCondition, setBoundaryCondition] = useState<BoundaryCondition>('dirichlet')
  const [diffusivity, setDiffusivity] = useState(0.1)
  const [gridSize, setGridSize] = useState(50)
  const [isAnimating, setIsAnimating] = useState(false)
  const [time, setTime] = useState(0)
  const animationRef = useRef<number | null>(null)
  const [temperature, setTemperature] = useState<number[]>([])
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(heatEquationNarration)
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

  // 初始化温度分布
  useEffect(() => {
    const u: number[] = []
    const dx = 1 / gridSize

    for (let i = 0; i <= gridSize; i++) {
      const x = i * dx

      switch (initialCondition) {
        case 'step':
          u.push(x < 0.5 ? 1 : 0)
          break
        case 'gaussian':
          u.push(Math.exp(-50 * (x - 0.5) ** 2))
          break
        case 'sine':
          u.push(Math.sin(Math.PI * x))
          break
        case 'random':
          u.push(Math.random())
          break
      }
    }

    // 应用边界条件
    if (boundaryCondition === 'dirichlet') {
      u[0] = 0
      u[gridSize] = 0
    }

    setTemperature(u)
    setTime(0)
  }, [initialCondition, boundaryCondition, gridSize])

  // 动画更新
  useEffect(() => {
    if (!isAnimating || temperature.length === 0) return

    const dt = 0.0001
    const dx = 1 / gridSize
    const alpha = diffusivity
    const r = alpha * dt / (dx * dx)

    // 稳定性检查
    if (r > 0.5) {
      console.warn('CFL condition violated')
    }

    const animate = () => {
      setTemperature((prev) => {
        const newU = [...prev]
        const n = prev.length

        // 显式有限差分
        for (let i = 1; i < n - 1; i++) {
          newU[i] = prev[i] + r * (prev[i + 1] - 2 * prev[i] + prev[i - 1])
        }

        // 边界条件
        switch (boundaryCondition) {
          case 'dirichlet':
            newU[0] = 0
            newU[n - 1] = 0
            break
          case 'neumann':
            newU[0] = newU[1]
            newU[n - 1] = newU[n - 2]
            break
          case 'periodic':
            newU[0] = prev[0] + r * (prev[1] - 2 * prev[0] + prev[n - 2])
            newU[n - 1] = newU[0]
            break
        }

        return newU
      })

      setTime((t) => t + dt)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating, gridSize, diffusivity, boundaryCondition, temperature.length])

  // 解析解（仅对某些情况）
  const analyticalSolution = useMemo(() => {
    if (initialCondition !== 'sine' || boundaryCondition !== 'dirichlet') return null

    const x: number[] = []
    const y: number[] = []
    const dx = 1 / gridSize

    for (let i = 0; i <= gridSize; i++) {
      const xi = i * dx
      x.push(xi)
      // u(x,t) = sin(πx) * exp(-π²αt)
      y.push(Math.sin(Math.PI * xi) * Math.exp(-Math.PI * Math.PI * diffusivity * time))
    }

    return { x, y }
  }, [initialCondition, boundaryCondition, gridSize, diffusivity, time])

  // 热量守恒
  const totalHeat = useMemo(() => {
    if (temperature.length === 0) return 0
    const dx = 1 / gridSize
    return temperature.reduce((sum, u) => sum + u * dx, 0)
  }, [temperature, gridSize])

  // 最大温度
  const maxTemp = useMemo(() => {
    return Math.max(...temperature, 0)
  }, [temperature])

  // 空间坐标
  const xCoords = useMemo(() => {
    const x: number[] = []
    const dx = 1 / gridSize
    for (let i = 0; i <= gridSize; i++) {
      x.push(i * dx)
    }
    return x
  }, [gridSize])

  // 2D 热图数据（时间演化）
  const [heatmapHistory, setHeatmapHistory] = useState<number[][]>([])

  useEffect(() => {
    if (temperature.length > 0) {
      setHeatmapHistory((prev) => {
        const newHistory = [...prev, [...temperature]]
        if (newHistory.length > 100) {
          return newHistory.slice(-100)
        }
        return newHistory
      })
    }
  }, [temperature])

  const reset = () => {
    setIsAnimating(false)
    setHeatmapHistory([])
    // 触发重新初始化
    setInitialCondition((prev) => prev)
  }

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">热传导方程</h1>
          <p className="text-gray-600">可视化一维热扩散过程</p>
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
            <h3 className="text-lg font-semibold mb-2">温度分布</h3>
            <Plot
              data={[
                {
                  x: xCoords,
                  y: temperature,
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  fill: 'tozeroy' as const,
                  line: { color: '#ef4444', width: 2 } as const,
                  fillcolor: 'rgba(239, 68, 68, 0.3)',
                  name: '数值解',
                },
                ...(analyticalSolution
                  ? [{
                      x: analyticalSolution.x,
                      y: analyticalSolution.y,
                      type: 'scatter' as const,
                      mode: 'lines' as const,
                      line: { color: '#3b82f6', width: 2, dash: 'dash' as const } as const,
                      name: '解析解',
                    }]
                  : []),
              ]}
              layout={{
                autosize: true,
                height: 350,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: { text: '位置 x' }, range: [0, 1] },
                yaxis: { title: { text: '温度 u(x,t)' }, range: [-0.1, 1.1] },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-4 py-2 rounded-lg ${
                  isAnimating ? 'bg-red-500' : 'bg-green-500'
                } text-white`}
              >
                {isAnimating ? '暂停' : '播放'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                重置
              </button>
              <span className="text-sm text-gray-600">
                时间: t = {time.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">时空演化</h3>
              {heatmapHistory.length > 0 && (
                <Plot
                  data={[
                    {
                      z: heatmapHistory,
                      type: 'heatmap' as const,
                      colorscale: 'Hot' as const,
                      showscale: true,
                    },
                  ]}
                  layout={{
                    autosize: true,
                    height: 250,
                    margin: { t: 30, r: 50, b: 40, l: 50 },
                    xaxis: { title: { text: '位置' } },
                    yaxis: { title: { text: '时间步' } },
                  }}
                  config={{ responsive: true }}
                  className="w-full"
                />
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">统计信息</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-red-50 rounded flex justify-between">
                  <span>最高温度</span>
                  <span className="font-mono">{maxTemp.toFixed(4)}</span>
                </div>
                <div className="p-2 bg-blue-50 rounded flex justify-between">
                  <span>总热量</span>
                  <span className="font-mono">{totalHeat.toFixed(4)}</span>
                </div>
                <div className="p-2 bg-purple-50 rounded flex justify-between">
                  <span>扩散系数 α</span>
                  <span className="font-mono">{diffusivity.toFixed(3)}</span>
                </div>
                <div className="p-2 bg-green-50 rounded flex justify-between">
                  <span>网格点数</span>
                  <span className="font-mono">{gridSize + 1}</span>
                </div>
                <div className="p-2 bg-amber-50 rounded flex justify-between">
                  <span>CFL 数</span>
                  <span className="font-mono">
                    {(diffusivity * 0.0001 / (1 / gridSize) ** 2).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">初始条件</h3>
            <div className="space-y-2">
              {[
                { type: 'gaussian' as const, name: '高斯分布' },
                { type: 'step' as const, name: '阶跃函数' },
                { type: 'sine' as const, name: '正弦波' },
                { type: 'random' as const, name: '随机分布' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => {
                    setInitialCondition(item.type)
                    setHeatmapHistory([])
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    initialCondition === item.type
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">边界条件</h3>
            <div className="space-y-2">
              {[
                { type: 'dirichlet' as const, name: 'Dirichlet (u=0)' },
                { type: 'neumann' as const, name: 'Neumann (∂u/∂x=0)' },
                { type: 'periodic' as const, name: '周期边界' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => {
                    setBoundaryCondition(item.type)
                    setHeatmapHistory([])
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    boundaryCondition === item.type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">扩散系数 α: {diffusivity.toFixed(3)}</label>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={diffusivity}
                  onChange={(e) => setDiffusivity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">网格大小: {gridSize}</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={gridSize}
                  onChange={(e) => {
                    setGridSize(parseInt(e.target.value))
                    setHeatmapHistory([])
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">热传导方程</h3>
            <div className="p-3 bg-red-50 rounded-lg">
              <MathFormula formula="\frac{\partial u}{\partial t} = \alpha \frac{\partial^2 u}{\partial x^2}" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              描述热量在介质中的扩散过程，α 为热扩散系数。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">数值方法</h3>
            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <MathFormula formula="u_i^{n+1} = u_i^n + r(u_{i+1}^n - 2u_i^n + u_{i-1}^n)" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              显式有限差分法，稳定性要求 r = αΔt/Δx² ≤ 0.5
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
