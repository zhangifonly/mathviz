import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { markovChainNarration } from '../../narrations/scripts/markov-chain'

type PresetChain = 'weather' | 'random-walk' | 'gambler' | 'custom'

const PRESETS: Record<PresetChain, {
  name: string
  states: string[]
  matrix: number[][]
}> = {
  weather: {
    name: '天气模型',
    states: ['晴天', '阴天', '雨天'],
    matrix: [
      [0.7, 0.2, 0.1],
      [0.3, 0.4, 0.3],
      [0.2, 0.3, 0.5],
    ],
  },
  'random-walk': {
    name: '随机游走',
    states: ['状态1', '状态2', '状态3', '状态4'],
    matrix: [
      [0.5, 0.5, 0, 0],
      [0.25, 0.5, 0.25, 0],
      [0, 0.25, 0.5, 0.25],
      [0, 0, 0.5, 0.5],
    ],
  },
  gambler: {
    name: '赌徒破产',
    states: ['$0', '$1', '$2', '$3'],
    matrix: [
      [1, 0, 0, 0],
      [0.5, 0, 0.5, 0],
      [0, 0.5, 0, 0.5],
      [0, 0, 0, 1],
    ],
  },
  custom: {
    name: '自定义',
    states: ['A', 'B', 'C'],
    matrix: [
      [0.5, 0.3, 0.2],
      [0.2, 0.6, 0.2],
      [0.3, 0.3, 0.4],
    ],
  },
}

export default function MarkovChainExperiment() {
  const [showPresenter, setShowPresenter] = useState(false)
  const narration = useNarrationOptional()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [preset, setPreset] = useState<PresetChain>('weather')
  const [matrix, setMatrix] = useState(PRESETS.weather.matrix)
  const [states, setStates] = useState(PRESETS.weather.states)
  const [initialDist, setInitialDist] = useState([1, 0, 0])
  const [steps, setSteps] = useState(20)
  const [currentState, setCurrentState] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationHistory, setSimulationHistory] = useState<number[]>([0])
  const animationRef = useRef<number | null>(null)

  // 讲解系统
  useEffect(() => {
    if (narration) {
      narration.loadScript(markovChainNarration)
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

  // 加载预设
  useEffect(() => {
    const p = PRESETS[preset]
    setMatrix(p.matrix)
    setStates(p.states)
    setInitialDist(Array(p.states.length).fill(0).map((_, i) => i === 0 ? 1 : 0))
    setCurrentState(0)
    setSimulationHistory([0])
  }, [preset])

  // 计算稳态分布
  const stationaryDist = useMemo(() => {
    const n = matrix.length
    // 幂迭代法
    let dist = Array(n).fill(1 / n)

    for (let iter = 0; iter < 1000; iter++) {
      const newDist = Array(n).fill(0)
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          newDist[j] += dist[i] * matrix[i][j]
        }
      }
      dist = newDist
    }

    return dist
  }, [matrix])

  // 计算分布随时间演化
  const distributionEvolution = useMemo(() => {
    const n = matrix.length
    const evolution: number[][] = [initialDist]
    let dist = [...initialDist]

    for (let t = 1; t <= steps; t++) {
      const newDist = Array(n).fill(0)
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          newDist[j] += dist[i] * matrix[i][j]
        }
      }
      evolution.push(newDist)
      dist = newDist
    }

    return evolution
  }, [matrix, initialDist, steps])

  // 模拟
  useEffect(() => {
    if (isSimulating && simulationHistory.length <= steps) {
      animationRef.current = window.setTimeout(() => {
        const current = simulationHistory[simulationHistory.length - 1]
        const rand = Math.random()
        let cumProb = 0
        let nextState = 0

        for (let i = 0; i < matrix[current].length; i++) {
          cumProb += matrix[current][i]
          if (rand < cumProb) {
            nextState = i
            break
          }
        }

        setCurrentState(nextState)
        setSimulationHistory([...simulationHistory, nextState])
      }, 500)
    } else if (simulationHistory.length > steps) {
      setIsSimulating(false)
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [isSimulating, simulationHistory, matrix, steps])

  // 绘制状态转移图
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const n = states.length
    const cx = width / 2
    const cy = height / 2
    const radius = Math.min(width, height) / 3

    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    // 计算节点位置
    const nodePositions: { x: number; y: number }[] = []
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2
      nodePositions.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      })
    }

    // 绘制边
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] > 0.01) {
          const from = nodePositions[i]
          const to = nodePositions[j]

          if (i === j) {
            // 自环
            const loopRadius = 20
            const angle = (i / n) * 2 * Math.PI - Math.PI / 2
            const loopCx = from.x + loopRadius * 1.5 * Math.cos(angle)
            const loopCy = from.y + loopRadius * 1.5 * Math.sin(angle)

            ctx.strokeStyle = `rgba(139, 92, 246, ${matrix[i][j]})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(loopCx, loopCy, loopRadius, 0, 2 * Math.PI)
            ctx.stroke()

            // 概率标签
            ctx.fillStyle = '#6b7280'
            ctx.font = '10px sans-serif'
            ctx.fillText(
              matrix[i][j].toFixed(2),
              loopCx + loopRadius + 5,
              loopCy
            )
          } else {
            // 普通边
            const dx = to.x - from.x
            const dy = to.y - from.y
            const len = Math.sqrt(dx * dx + dy * dy)
            const nodeRadius = 25

            const startX = from.x + (dx / len) * nodeRadius
            const startY = from.y + (dy / len) * nodeRadius
            const endX = to.x - (dx / len) * nodeRadius
            const endY = to.y - (dy / len) * nodeRadius

            // 曲线偏移
            const offset = 15
            const midX = (startX + endX) / 2 + (dy / len) * offset
            const midY = (startY + endY) / 2 - (dx / len) * offset

            ctx.strokeStyle = `rgba(139, 92, 246, ${matrix[i][j]})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.quadraticCurveTo(midX, midY, endX, endY)
            ctx.stroke()

            // 箭头
            const arrowLen = 8
            const arrowAngle = Math.atan2(endY - midY, endX - midX)
            ctx.beginPath()
            ctx.moveTo(endX, endY)
            ctx.lineTo(
              endX - arrowLen * Math.cos(arrowAngle - 0.3),
              endY - arrowLen * Math.sin(arrowAngle - 0.3)
            )
            ctx.moveTo(endX, endY)
            ctx.lineTo(
              endX - arrowLen * Math.cos(arrowAngle + 0.3),
              endY - arrowLen * Math.sin(arrowAngle + 0.3)
            )
            ctx.stroke()

            // 概率标签
            ctx.fillStyle = '#6b7280'
            ctx.font = '10px sans-serif'
            ctx.fillText(matrix[i][j].toFixed(2), midX, midY - 5)
          }
        }
      }
    }

    // 绘制节点
    for (let i = 0; i < n; i++) {
      const pos = nodePositions[i]
      const isActive = i === currentState

      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI)
      ctx.fillStyle = isActive ? '#8b5cf6' : '#e2e8f0'
      ctx.fill()
      ctx.strokeStyle = isActive ? '#6d28d9' : '#94a3b8'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = isActive ? 'white' : '#1e293b'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(states[i], pos.x, pos.y)
    }
  }, [matrix, states, currentState])

  const startSimulation = () => {
    setSimulationHistory([0])
    setCurrentState(0)
    setIsSimulating(true)
  }

  const updateMatrix = (i: number, j: number, value: string) => {
    const newMatrix = matrix.map((row) => [...row])
    newMatrix[i][j] = Math.max(0, Math.min(1, parseFloat(value) || 0))

    // 归一化行
    const rowSum = newMatrix[i].reduce((a, b) => a + b, 0)
    if (rowSum > 0) {
      newMatrix[i] = newMatrix[i].map((v) => v / rowSum)
    }

    setMatrix(newMatrix)
  }

  // 统计模拟结果
  const simulationStats = useMemo(() => {
    const counts = Array(states.length).fill(0)
    for (const s of simulationHistory) {
      counts[s]++
    }
    const total = simulationHistory.length
    return counts.map((c) => c / total)
  }, [simulationHistory, states.length])

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">马尔可夫链</h1>
          <p className="text-gray-600">探索状态转移、稳态分布和随机过程</p>
        </div>
        <button
          onClick={handleStartNarration}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
          <span>开始讲解</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">状态转移图</h3>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full max-w-md mx-auto border border-gray-300 rounded"
            />
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={startSimulation}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                开始模拟
              </button>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {isSimulating ? '暂停' : '继续'}
              </button>
              <span className="text-sm text-gray-600">
                步数: {simulationHistory.length - 1} / {steps}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">分布演化</h3>
              <Plot
                data={states.map((state, i) => ({
                  x: Array.from({ length: distributionEvolution.length }, (_, t) => t),
                  y: distributionEvolution.map((d) => d[i]),
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  name: state,
                } as const))}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: '时间步' } },
                  yaxis: { title: { text: '概率' }, range: [0, 1] },
                  legend: { orientation: 'h', y: -0.2 },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">稳态 vs 模拟</h3>
              <Plot
                data={[
                  {
                    x: states,
                    y: stationaryDist,
                    type: 'bar' as const,
                    name: '稳态分布',
                    marker: { color: '#8b5cf6' },
                  },
                  {
                    x: states,
                    y: simulationStats,
                    type: 'bar' as const,
                    name: '模拟频率',
                    marker: { color: '#22c55e' },
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  yaxis: { title: { text: '概率' }, range: [0, 1] },
                  barmode: 'group',
                  legend: { orientation: 'h', y: -0.2 },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">模拟轨迹</h3>
            <div className="flex flex-wrap gap-1">
              {simulationHistory.map((s, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 text-xs rounded ${
                    i === simulationHistory.length - 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {states[s]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">预设模型</h3>
            <div className="space-y-2">
              {(Object.keys(PRESETS) as PresetChain[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    preset === p
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {PRESETS[p].name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">转移矩阵 P</h3>
            <div className="overflow-x-auto">
              <table className="text-xs">
                <thead>
                  <tr>
                    <th className="px-1"></th>
                    {states.map((s, j) => (
                      <th key={j} className="px-1">{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={i}>
                      <td className="px-1 font-semibold">{states[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className="px-1">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            value={val.toFixed(2)}
                            onChange={(e) => updateMatrix(i, j, e.target.value)}
                            className="w-12 px-1 py-0.5 border rounded text-center"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">稳态分布</h3>
            <div className="space-y-1">
              {states.map((s, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{s}</span>
                  <span className="font-mono">{(stationaryDist[i] * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">模拟步数</h3>
            <div>
              <label className="text-sm text-gray-600">步数: {steps}</label>
              <input
                type="range"
                min="10"
                max="100"
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">马尔可夫性质</h3>
            <div className="p-3 bg-purple-50 rounded-lg text-sm">
              <MathFormula formula="P(X_{n+1}|X_n, ..., X_0) = P(X_{n+1}|X_n)" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              未来状态只依赖于当前状态，与历史无关。
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
