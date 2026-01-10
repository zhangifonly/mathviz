import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pdeNarration } from '../../narrations/scripts/pde'

type PDEType = 'laplace' | 'poisson' | 'wave' | 'heat'
type BoundaryCondition = 'dirichlet' | 'neumann' | 'mixed'

export default function PDEExperiment() {
  const [pdeType, setPDEType] = useState<PDEType>('laplace')
  const [boundaryCondition, setBoundaryCondition] = useState<BoundaryCondition>('dirichlet')
  const [gridSize, setGridSize] = useState(30)
  const [isAnimating, setIsAnimating] = useState(false)
  const [time, setTime] = useState(0)
  const animationRef = useRef<number | null>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(pdeNarration)
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

  // 初始化解
  const [solution, setSolution] = useState<number[][]>(() => {
    const n = gridSize
    const u: number[][] = []

    for (let i = 0; i < n; i++) {
      u[i] = []
      for (let j = 0; j < n; j++) {
        const x = i / (n - 1)
        const y = j / (n - 1)

        switch (pdeType) {
          case 'laplace':
            // 拉普拉斯方程：边界条件决定解
            if (i === 0 || i === n - 1 || j === 0 || j === n - 1) {
              u[i][j] = boundaryCondition === 'dirichlet' ? Math.sin(Math.PI * x) : 0
            } else {
              u[i][j] = 0
            }
            break
          case 'poisson':
            // 泊松方程：有源项
            u[i][j] = 0
            break
          case 'wave':
            // 波动方程：初始位移
            u[i][j] = Math.exp(-50 * ((x - 0.5) ** 2 + (y - 0.5) ** 2))
            break
          case 'heat':
            // 热传导方程：初始温度分布
            u[i][j] = Math.exp(-20 * ((x - 0.5) ** 2 + (y - 0.5) ** 2))
            break
        }
      }
    }

    return u
  })

  // 重新初始化解当参数改变时
  useEffect(() => {
    const n = gridSize
    const u: number[][] = []

    for (let i = 0; i < n; i++) {
      u[i] = []
      for (let j = 0; j < n; j++) {
        const x = i / (n - 1)
        const y = j / (n - 1)

        switch (pdeType) {
          case 'laplace':
            // 拉普拉斯方程：边界条件决定解
            if (i === 0 || i === n - 1 || j === 0 || j === n - 1) {
              u[i][j] = boundaryCondition === 'dirichlet' ? Math.sin(Math.PI * x) : 0
            } else {
              u[i][j] = 0
            }
            break
          case 'poisson':
            // 泊松方程：有源项
            u[i][j] = 0
            break
          case 'wave':
            // 波动方程：初始位移
            u[i][j] = Math.exp(-50 * ((x - 0.5) ** 2 + (y - 0.5) ** 2))
            break
          case 'heat':
            // 热传导方程：初始温度分布
            u[i][j] = Math.exp(-20 * ((x - 0.5) ** 2 + (y - 0.5) ** 2))
            break
        }
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSolution(u)
    setTime(0)
  }, [pdeType, boundaryCondition, gridSize])

  // 求解拉普拉斯/泊松方程（迭代法）
  const solveLaplace = useCallback((u: number[][], iterations: number = 100): number[][] => {
    const n = u.length
    const newU = u.map(row => [...row])

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 1; i < n - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
          // 五点差分格式
          newU[i][j] = 0.25 * (newU[i + 1][j] + newU[i - 1][j] + newU[i][j + 1] + newU[i][j - 1])

          // 泊松方程：添加源项
          if (pdeType === 'poisson') {
            const x = i / (n - 1)
            const y = j / (n - 1)
            const source = -Math.exp(-20 * ((x - 0.5) ** 2 + (y - 0.5) ** 2))
            newU[i][j] += 0.25 * source * (1 / (n - 1)) ** 2
          }
        }
      }
    }

    return newU
  }, [pdeType])

  // 求解热传导方程（显式差分）
  const solveHeat = useCallback((u: number[][], dt: number, alpha: number = 0.01): number[][] => {
    const n = u.length
    const dx = 1 / (n - 1)
    const r = alpha * dt / (dx * dx)
    const newU = u.map(row => [...row])

    for (let i = 1; i < n - 1; i++) {
      for (let j = 1; j < n - 1; j++) {
        newU[i][j] = u[i][j] + r * (
          u[i + 1][j] + u[i - 1][j] + u[i][j + 1] + u[i][j - 1] - 4 * u[i][j]
        )
      }
    }

    // 边界条件
    if (boundaryCondition === 'dirichlet') {
      for (let i = 0; i < n; i++) {
        newU[0][i] = 0
        newU[n - 1][i] = 0
        newU[i][0] = 0
        newU[i][n - 1] = 0
      }
    }

    return newU
  }, [boundaryCondition])

  // 求解波动方程（需要两个时间层）
  const [prevSolution, setPrevSolution] = useState<number[][]>([])

  const solveWave = useCallback((u: number[][], uPrev: number[][], dt: number, c: number = 1): number[][] => {
    const n = u.length
    const dx = 1 / (n - 1)
    const r = (c * dt / dx) ** 2
    const newU = u.map(row => [...row])

    for (let i = 1; i < n - 1; i++) {
      for (let j = 1; j < n - 1; j++) {
        if (uPrev.length === 0) {
          // 第一步：使用初始速度为0的假设
          newU[i][j] = u[i][j] + 0.5 * r * (
            u[i + 1][j] + u[i - 1][j] + u[i][j + 1] + u[i][j - 1] - 4 * u[i][j]
          )
        } else {
          // 后续步骤
          newU[i][j] = 2 * u[i][j] - uPrev[i][j] + r * (
            u[i + 1][j] + u[i - 1][j] + u[i][j + 1] + u[i][j - 1] - 4 * u[i][j]
          )
        }
      }
    }

    // 边界条件
    for (let i = 0; i < n; i++) {
      newU[0][i] = 0
      newU[n - 1][i] = 0
      newU[i][0] = 0
      newU[i][n - 1] = 0
    }

    return newU
  }, [])

  // 动画更新
  useEffect(() => {
    if (!isAnimating || solution.length === 0) return

    const dt = 0.001

    const animate = () => {
      setSolution((prev) => {
        let newU: number[][]

        switch (pdeType) {
          case 'laplace':
          case 'poisson':
            // 迭代求解
            newU = solveLaplace(prev, 10)
            break
          case 'heat':
            // 热传导
            newU = solveHeat(prev, dt)
            break
          case 'wave':
            // 波动方程
            newU = solveWave(prev, prevSolution, dt)
            setPrevSolution(prev)
            break
          default:
            newU = prev
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
  }, [isAnimating, pdeType, solveLaplace, solveHeat, solveWave, prevSolution, solution.length])

  // 统计信息
  const maxValue = useMemo(() => {
    if (solution.length === 0) return 0
    return Math.max(...solution.flat())
  }, [solution])

  const minValue = useMemo(() => {
    if (solution.length === 0) return 0
    return Math.min(...solution.flat())
  }, [solution])

  const avgValue = useMemo(() => {
    if (solution.length === 0) return 0
    const sum = solution.flat().reduce((a, b) => a + b, 0)
    return sum / (solution.length * solution[0].length)
  }, [solution])

  const reset = () => {
    setIsAnimating(false)
    setPrevSolution([])
    // 触发重新初始化
    setPDEType((prev) => prev)
  }

  // PDE 方程信息
  const pdeInfo: Record<PDEType, { name: string; formula: string; description: string }> = {
    laplace: {
      name: '拉普拉斯方程',
      formula: '\\nabla^2 u = \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} = 0',
      description: '描述稳态场（无源、无时间变化），如静电场、稳态温度分布',
    },
    poisson: {
      name: '泊松方程',
      formula: '\\nabla^2 u = f(x,y)',
      description: '拉普拉斯方程的推广，右侧有源项，描述有源场分布',
    },
    wave: {
      name: '波动方程',
      formula: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u',
      description: '描述波的传播，如声波、电磁波、弦振动',
    },
    heat: {
      name: '热传导方程',
      formula: '\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u',
      description: '描述热量扩散过程，也称扩散方程',
    },
  }

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">偏微分方程</h1>
            <p className="text-gray-600">探索多变量函数的微分方程</p>
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
              <h3 className="text-lg font-semibold mb-2">解的可视化</h3>
              {solution.length > 0 && (
                <Plot
                  data={[
                    {
                      z: solution,
                      type: 'surface' as const,
                      colorscale: 'Viridis' as const,
                      showscale: true,
                    } as const,
                  ]}
                  layout={{
                    autosize: true,
                    height: 500,
                    margin: { t: 30, r: 30, b: 30, l: 30 },
                    scene: {
                      xaxis: { title: { text: 'x' } },
                      yaxis: { title: { text: 'y' } },
                      zaxis: { title: { text: 'u(x,y,t)' } },
                      camera: {
                        eye: { x: 1.5, y: 1.5, z: 1.3 },
                      },
                    },
                  }}
                  config={{ responsive: true, displaylogo: false }}
                  className="w-full"
                />
              )}
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`px-4 py-2 rounded-lg ${
                    isAnimating ? 'bg-red-500' : 'bg-green-500'
                  } text-white`}
                  disabled={pdeType === 'laplace' || pdeType === 'poisson'}
                >
                  {isAnimating ? '暂停' : '播放'}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  重置
                </button>
                {(pdeType === 'wave' || pdeType === 'heat') && (
                  <span className="text-sm text-gray-600">
                    时间: t = {time.toFixed(3)}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">等高线图</h3>
              {solution.length > 0 && (
                <Plot
                  data={[
                    {
                      z: solution,
                      type: 'contour' as const,
                      colorscale: 'Viridis' as const,
                      showscale: true,
                      contours: {
                        coloring: 'heatmap' as const,
                      },
                    },
                  ]}
                  layout={{
                    autosize: true,
                    height: 350,
                    margin: { t: 30, r: 50, b: 40, l: 50 },
                    xaxis: { title: { text: 'x' } },
                    yaxis: { title: { text: 'y' }, scaleanchor: 'x' },
                  }}
                  config={{ responsive: true, displaylogo: false }}
                  className="w-full"
                />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">PDE 类型</h3>
              <div className="space-y-2">
                {(['laplace', 'poisson', 'wave', 'heat'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setPDEType(type)
                      setPrevSolution([])
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      pdeType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pdeInfo[type].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">边界条件</h3>
              <div className="space-y-2">
                {[
                  { type: 'dirichlet' as const, name: 'Dirichlet (固定值)' },
                  { type: 'neumann' as const, name: 'Neumann (固定导数)' },
                  { type: 'mixed' as const, name: '混合边界' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => {
                      setBoundaryCondition(item.type)
                      setPrevSolution([])
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
                  <label className="text-sm text-gray-600">网格大小: {gridSize}</label>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    value={gridSize}
                    onChange={(e) => {
                      setGridSize(parseInt(e.target.value))
                      setPrevSolution([])
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">统计信息</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-purple-50 rounded flex justify-between">
                  <span>最大值</span>
                  <span className="font-mono">{maxValue.toFixed(4)}</span>
                </div>
                <div className="p-2 bg-blue-50 rounded flex justify-between">
                  <span>最小值</span>
                  <span className="font-mono">{minValue.toFixed(4)}</span>
                </div>
                <div className="p-2 bg-green-50 rounded flex justify-between">
                  <span>平均值</span>
                  <span className="font-mono">{avgValue.toFixed(4)}</span>
                </div>
                <div className="p-2 bg-amber-50 rounded flex justify-between">
                  <span>网格点数</span>
                  <span className="font-mono">{gridSize}×{gridSize}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">{pdeInfo[pdeType].name}</h3>
              <div className="p-3 bg-purple-50 rounded-lg mb-2">
                <MathFormula formula={pdeInfo[pdeType].formula} />
              </div>
              <p className="text-sm text-gray-600">
                {pdeInfo[pdeType].description}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">数值方法</h3>
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                <MathFormula formula="u_{i,j}^{n+1} = u_{i,j}^n + r(u_{i+1,j}^n + u_{i-1,j}^n + u_{i,j+1}^n + u_{i,j-1}^n - 4u_{i,j}^n)" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                五点差分格式，适用于二维偏微分方程的数值求解
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
