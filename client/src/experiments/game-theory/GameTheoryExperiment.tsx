import { useState, useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'

type GameType = 'prisoners' | 'chicken' | 'stag' | 'matching' | 'custom'

interface PayoffMatrix {
  name: string
  p1: [[number, number], [number, number]]
  p2: [[number, number], [number, number]]
  strategies: [string, string]
}

const GAMES: Record<GameType, PayoffMatrix> = {
  prisoners: {
    name: '囚徒困境',
    p1: [[-1, -3], [0, -2]],
    p2: [[-1, 0], [-3, -2]],
    strategies: ['合作', '背叛'],
  },
  chicken: {
    name: '胆小鬼博弈',
    p1: [[0, -1], [1, -10]],
    p2: [[0, 1], [-1, -10]],
    strategies: ['让步', '直行'],
  },
  stag: {
    name: '猎鹿博弈',
    p1: [[4, 0], [3, 3]],
    p2: [[4, 3], [0, 3]],
    strategies: ['猎鹿', '猎兔'],
  },
  matching: {
    name: '匹配硬币',
    p1: [[1, -1], [-1, 1]],
    p2: [[-1, 1], [1, -1]],
    strategies: ['正面', '反面'],
  },
  custom: {
    name: '自定义',
    p1: [[3, 0], [5, 1]],
    p2: [[3, 5], [0, 1]],
    strategies: ['策略A', '策略B'],
  },
}

export default function GameTheoryExperiment() {
  const [gameType, setGameType] = useState<GameType>('prisoners')
  const [customP1, setCustomP1] = useState<[[number, number], [number, number]]>([[3, 0], [5, 1]])
  const [customP2, setCustomP2] = useState<[[number, number], [number, number]]>([[3, 5], [0, 1]])
  const [p1Strategy, setP1Strategy] = useState(0.5)
  const [p2Strategy, setP2Strategy] = useState(0.5)
  const [iterations, setIterations] = useState(100)
  const [showEvolution, setShowEvolution] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

  // 动画效果：策略演化
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setP1Strategy((prev) => {
        const newVal = prev + (Math.random() - 0.5) * 0.05
        return Math.max(0, Math.min(1, newVal))
      })
      setP2Strategy((prev) => {
        const newVal = prev + (Math.random() - 0.5) * 0.05
        return Math.max(0, Math.min(1, newVal))
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

  const game = gameType === 'custom'
    ? { ...GAMES.custom, p1: customP1, p2: customP2 }
    : GAMES[gameType]

  // 计算纳什均衡
  const nashEquilibria = useMemo(() => {
    const { p1, p2 } = game
    const equilibria: { p1: number; p2: number; type: string }[] = []

    // 检查纯策略纳什均衡
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const p1Best = p1[i][j] >= p1[1 - i][j]
        const p2Best = p2[i][j] >= p2[i][1 - j]
        if (p1Best && p2Best) {
          equilibria.push({ p1: i, p2: j, type: '纯策略' })
        }
      }
    }

    // 计算混合策略纳什均衡
    // 玩家2使策略1无差异: p1[0][0]*q + p1[0][1]*(1-q) = p1[1][0]*q + p1[1][1]*(1-q)
    const a = p1[0][0] - p1[0][1] - p1[1][0] + p1[1][1]
    const b = p1[0][1] - p1[1][1]
    if (Math.abs(a) > 1e-10) {
      const q = -b / a
      if (q > 0 && q < 1) {
        // 玩家1使策略1无差异
        const c = p2[0][0] - p2[1][0] - p2[0][1] + p2[1][1]
        const d = p2[1][0] - p2[1][1]
        if (Math.abs(c) > 1e-10) {
          const p = -d / c
          if (p > 0 && p < 1) {
            equilibria.push({ p1: p, p2: q, type: '混合策略' })
          }
        }
      }
    }

    return equilibria
  }, [game])

  // 期望收益
  const expectedPayoffs = useMemo(() => {
    const { p1, p2 } = game
    const p = p1Strategy
    const q = p2Strategy

    const e1 = p * q * p1[0][0] + p * (1 - q) * p1[0][1] + (1 - p) * q * p1[1][0] + (1 - p) * (1 - q) * p1[1][1]
    const e2 = p * q * p2[0][0] + p * (1 - q) * p2[0][1] + (1 - p) * q * p2[1][0] + (1 - p) * (1 - q) * p2[1][1]

    return { e1, e2 }
  }, [game, p1Strategy, p2Strategy])

  // 复制动态演化
  const evolutionData = useMemo(() => {
    if (!showEvolution) return { t: [], x: [], y: [] }

    const { p1, p2 } = game
    const t: number[] = []
    const x: number[] = []
    const y: number[] = []

    let px = p1Strategy
    let py = p2Strategy
    const dt = 0.1

    for (let i = 0; i <= iterations; i++) {
      t.push(i * dt)
      x.push(px)
      y.push(py)

      // 玩家1的适应度
      const f1_0 = py * p1[0][0] + (1 - py) * p1[0][1]
      const f1_1 = py * p1[1][0] + (1 - py) * p1[1][1]
      const f1_avg = px * f1_0 + (1 - px) * f1_1

      // 玩家2的适应度
      const f2_0 = px * p2[0][0] + (1 - px) * p2[1][0]
      const f2_1 = px * p2[0][1] + (1 - px) * p2[1][1]
      const f2_avg = py * f2_0 + (1 - py) * f2_1

      // 复制动态
      const dx = px * (f1_0 - f1_avg)
      const dy = py * (f2_0 - f2_avg)

      px = Math.max(0.001, Math.min(0.999, px + dx * dt))
      py = Math.max(0.001, Math.min(0.999, py + dy * dt))
    }

    return { t, x, y }
  }, [game, p1Strategy, p2Strategy, iterations, showEvolution])

  // 最优响应曲线
  const bestResponseData = useMemo(() => {
    const { p1, p2 } = game
    const br1: { x: number; y: number }[] = []
    const br2: { x: number; y: number }[] = []

    for (let q = 0; q <= 1; q += 0.01) {
      // 玩家1对q的最优响应
      const u1_0 = q * p1[0][0] + (1 - q) * p1[0][1]
      const u1_1 = q * p1[1][0] + (1 - q) * p1[1][1]
      if (Math.abs(u1_0 - u1_1) < 0.01) {
        br1.push({ x: q, y: 0 })
        br1.push({ x: q, y: 1 })
      } else {
        br1.push({ x: q, y: u1_0 > u1_1 ? 1 : 0 })
      }
    }

    for (let p = 0; p <= 1; p += 0.01) {
      // 玩家2对p的最优响应
      const u2_0 = p * p2[0][0] + (1 - p) * p2[1][0]
      const u2_1 = p * p2[0][1] + (1 - p) * p2[1][1]
      if (Math.abs(u2_0 - u2_1) < 0.01) {
        br2.push({ x: 0, y: p })
        br2.push({ x: 1, y: p })
      } else {
        br2.push({ x: u2_0 > u2_1 ? 1 : 0, y: p })
      }
    }

    return { br1, br2 }
  }, [game])

  const updateCustomPayoff = (player: 1 | 2, i: number, j: number, value: string) => {
    const val = parseFloat(value) || 0
    if (player === 1) {
      const newP1 = customP1.map((row) => [...row]) as [[number, number], [number, number]]
      newP1[i][j] = val
      setCustomP1(newP1)
    } else {
      const newP2 = customP2.map((row) => [...row]) as [[number, number], [number, number]]
      newP2[i][j] = val
      setCustomP2(newP2)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">博弈论</h1>
          <p className="text-gray-600">探索纳什均衡、最优响应和演化博弈</p>
        </div>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {isAnimating ? '停止' : '播放动画'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">收益矩阵 - {game.name}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2"></th>
                    <th colSpan={2} className="p-2 bg-green-100">玩家2</th>
                  </tr>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2"></th>
                    <th className="p-2 bg-green-50">{game.strategies[0]}</th>
                    <th className="p-2 bg-green-50">{game.strategies[1]}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan={2} className="p-2 bg-blue-100 font-semibold">玩家1</td>
                    <td className="p-2 bg-blue-50">{game.strategies[0]}</td>
                    <td className="p-2 border">
                      <span className="text-blue-600">{game.p1[0][0]}</span>,
                      <span className="text-green-600">{game.p2[0][0]}</span>
                    </td>
                    <td className="p-2 border">
                      <span className="text-blue-600">{game.p1[0][1]}</span>,
                      <span className="text-green-600">{game.p2[0][1]}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-blue-50">{game.strategies[1]}</td>
                    <td className="p-2 border">
                      <span className="text-blue-600">{game.p1[1][0]}</span>,
                      <span className="text-green-600">{game.p2[1][0]}</span>
                    </td>
                    <td className="p-2 border">
                      <span className="text-blue-600">{game.p1[1][1]}</span>,
                      <span className="text-green-600">{game.p2[1][1]}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              (<span className="text-blue-600">玩家1收益</span>, <span className="text-green-600">玩家2收益</span>)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">策略空间</h3>
              <Plot
                data={[
                  {
                    x: bestResponseData.br1.map((p) => p.x),
                    y: bestResponseData.br1.map((p) => p.y),
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#3b82f6', width: 2 },
                    name: 'BR1(q)',
                  },
                  {
                    x: bestResponseData.br2.map((p) => p.x),
                    y: bestResponseData.br2.map((p) => p.y),
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#22c55e', width: 2 },
                    name: 'BR2(p)',
                  },
                  ...nashEquilibria.map((ne, i) => ({
                    x: [ne.p2],
                    y: [ne.p1],
                    type: 'scatter' as const,
                    mode: 'markers' as const,
                    marker: { size: 12, color: '#ef4444', symbol: 'star' },
                    name: `NE${i + 1}`,
                  })),
                  {
                    x: [p2Strategy],
                    y: [p1Strategy],
                    type: 'scatter',
                    mode: 'markers',
                    marker: { size: 10, color: '#8b5cf6' },
                    name: '当前',
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 300,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: 'q (玩家2策略1概率)', range: [0, 1] },
                  yaxis: { title: 'p (玩家1策略1概率)', range: [0, 1] },
                  legend: { orientation: 'h', y: -0.2 },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>

            {showEvolution && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">复制动态演化</h3>
                <Plot
                  data={[
                    {
                      x: evolutionData.t,
                      y: evolutionData.x,
                      type: 'scatter',
                      mode: 'lines',
                      line: { color: '#3b82f6', width: 2 },
                      name: 'p (玩家1)',
                    },
                    {
                      x: evolutionData.t,
                      y: evolutionData.y,
                      type: 'scatter',
                      mode: 'lines',
                      line: { color: '#22c55e', width: 2 },
                      name: 'q (玩家2)',
                    },
                  ]}
                  layout={{
                    autosize: true,
                    height: 300,
                    margin: { t: 30, r: 30, b: 40, l: 50 },
                    xaxis: { title: '时间' },
                    yaxis: { title: '策略概率', range: [0, 1] },
                    legend: { orientation: 'h', y: -0.2 },
                  }}
                  config={{ responsive: true }}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">纳什均衡</h3>
              {nashEquilibria.length === 0 ? (
                <p className="text-gray-500">未找到纳什均衡</p>
              ) : (
                <div className="space-y-2">
                  {nashEquilibria.map((ne, i) => (
                    <div key={i} className="p-2 bg-red-50 rounded">
                      <span className="font-semibold">NE{i + 1}</span> ({ne.type}):
                      <div className="font-mono text-sm">
                        p = {typeof ne.p1 === 'number' && ne.p1 % 1 !== 0 ? ne.p1.toFixed(3) : ne.p1 === 0 ? game.strategies[1] : ne.p1 === 1 ? game.strategies[0] : ne.p1}
                        , q = {typeof ne.p2 === 'number' && ne.p2 % 1 !== 0 ? ne.p2.toFixed(3) : ne.p2 === 0 ? game.strategies[1] : ne.p2 === 1 ? game.strategies[0] : ne.p2}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">期望收益</h3>
              <div className="space-y-2">
                <div className="p-2 bg-blue-50 rounded flex justify-between">
                  <span>玩家1期望收益</span>
                  <span className="font-mono font-bold">{expectedPayoffs.e1.toFixed(3)}</span>
                </div>
                <div className="p-2 bg-green-50 rounded flex justify-between">
                  <span>玩家2期望收益</span>
                  <span className="font-mono font-bold">{expectedPayoffs.e2.toFixed(3)}</span>
                </div>
                <div className="p-2 bg-purple-50 rounded flex justify-between">
                  <span>社会福利</span>
                  <span className="font-mono font-bold">{(expectedPayoffs.e1 + expectedPayoffs.e2).toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择博弈</h3>
            <div className="space-y-2">
              {(Object.keys(GAMES) as GameType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setGameType(type)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    gameType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {GAMES[type].name}
                </button>
              ))}
            </div>
          </div>

          {gameType === 'custom' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">自定义收益</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">玩家1收益:</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {customP1.map((row, i) =>
                      row.map((val, j) => (
                        <input
                          key={`p1-${i}-${j}`}
                          type="number"
                          value={val}
                          onChange={(e) => updateCustomPayoff(1, i, j, e.target.value)}
                          className="px-2 py-1 border rounded text-center text-sm"
                        />
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">玩家2收益:</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {customP2.map((row, i) =>
                      row.map((val, j) => (
                        <input
                          key={`p2-${i}-${j}`}
                          type="number"
                          value={val}
                          onChange={(e) => updateCustomPayoff(2, i, j, e.target.value)}
                          className="px-2 py-1 border rounded text-center text-sm"
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">混合策略</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">
                  玩家1选{game.strategies[0]}概率: {p1Strategy.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={p1Strategy}
                  onChange={(e) => setP1Strategy(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  玩家2选{game.strategies[0]}概率: {p2Strategy.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={p2Strategy}
                  onChange={(e) => setP2Strategy(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">演化博弈</h3>
            <button
              onClick={() => setShowEvolution(!showEvolution)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${
                showEvolution ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {showEvolution ? '隐藏演化' : '显示演化'}
            </button>
            {showEvolution && (
              <div className="mt-3">
                <label className="text-sm text-gray-600">迭代次数: {iterations}</label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={iterations}
                  onChange={(e) => setIterations(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">纳什均衡定义</h3>
            <div className="p-3 bg-purple-50 rounded-lg text-sm">
              <MathFormula formula="u_i(s_i^*, s_{-i}^*) \geq u_i(s_i, s_{-i}^*)" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              在纳什均衡中，没有玩家能通过单方面改变策略来提高自己的收益。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
