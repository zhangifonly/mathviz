import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { graphTheoryNarration } from '../../narrations/scripts/graph-theory'

type Node = { id: number; x: number; y: number }
type Edge = { from: number; to: number; weight: number }

type GraphPreset = {
  name: string
  nodes: Node[]
  edges: Edge[]
}

const presets: GraphPreset[] = [
  {
    name: '简单图',
    nodes: [
      { id: 0, x: 150, y: 50 },
      { id: 1, x: 50, y: 150 },
      { id: 2, x: 250, y: 150 },
      { id: 3, x: 100, y: 250 },
      { id: 4, x: 200, y: 250 },
    ],
    edges: [
      { from: 0, to: 1, weight: 1 },
      { from: 0, to: 2, weight: 1 },
      { from: 1, to: 3, weight: 1 },
      { from: 2, to: 4, weight: 1 },
      { from: 3, to: 4, weight: 1 },
    ],
  },
  {
    name: '完全图 K5',
    nodes: [
      { id: 0, x: 150, y: 30 },
      { id: 1, x: 50, y: 120 },
      { id: 2, x: 250, y: 120 },
      { id: 3, x: 80, y: 250 },
      { id: 4, x: 220, y: 250 },
    ],
    edges: [
      { from: 0, to: 1, weight: 1 }, { from: 0, to: 2, weight: 1 },
      { from: 0, to: 3, weight: 1 }, { from: 0, to: 4, weight: 1 },
      { from: 1, to: 2, weight: 1 }, { from: 1, to: 3, weight: 1 },
      { from: 1, to: 4, weight: 1 }, { from: 2, to: 3, weight: 1 },
      { from: 2, to: 4, weight: 1 }, { from: 3, to: 4, weight: 1 },
    ],
  },
  {
    name: '二分图',
    nodes: [
      { id: 0, x: 80, y: 50 }, { id: 1, x: 80, y: 150 }, { id: 2, x: 80, y: 250 },
      { id: 3, x: 220, y: 100 }, { id: 4, x: 220, y: 200 },
    ],
    edges: [
      { from: 0, to: 3, weight: 1 }, { from: 0, to: 4, weight: 1 },
      { from: 1, to: 3, weight: 1 }, { from: 1, to: 4, weight: 1 },
      { from: 2, to: 3, weight: 1 }, { from: 2, to: 4, weight: 1 },
    ],
  },
  {
    name: '带权图',
    nodes: [
      { id: 0, x: 50, y: 50 }, { id: 1, x: 200, y: 50 },
      { id: 2, x: 50, y: 200 }, { id: 3, x: 200, y: 200 },
      { id: 4, x: 125, y: 125 },
    ],
    edges: [
      { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 2 },
      { from: 0, to: 4, weight: 3 }, { from: 1, to: 3, weight: 5 },
      { from: 1, to: 4, weight: 1 }, { from: 2, to: 3, weight: 6 },
      { from: 2, to: 4, weight: 2 }, { from: 3, to: 4, weight: 3 },
    ],
  },
]

type Algorithm = 'none' | 'bfs' | 'dfs' | 'dijkstra'

export default function GraphTheoryExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [nodes, setNodes] = useState<Node[]>(presets[0].nodes)
  const [edges, setEdges] = useState<Edge[]>(presets[0].edges)
  const [algorithm, setAlgorithm] = useState<Algorithm>('none')
  const [startNode, setStartNode] = useState(0)
  const [visitedNodes, setVisitedNodes] = useState<number[]>([])
  const [visitedEdges, setVisitedEdges] = useState<Edge[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const animationRef = useRef<number | null>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(graphTheoryNarration)
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

  const selectPreset = (index: number) => {
    setSelectedPreset(index)
    setNodes(presets[index].nodes)
    setEdges(presets[index].edges)
    resetAlgorithm()
  }

  const resetAlgorithm = () => {
    setVisitedNodes([])
    setVisitedEdges([])
    setCurrentStep(0)
    setIsRunning(false)
  }

  // 构建邻接表
  const adjacencyList = useMemo(() => {
    const adj: Map<number, { node: number; weight: number }[]> = new Map()
    nodes.forEach((n) => adj.set(n.id, []))
    edges.forEach((e) => {
      adj.get(e.from)?.push({ node: e.to, weight: e.weight })
      adj.get(e.to)?.push({ node: e.from, weight: e.weight })
    })
    return adj
  }, [nodes, edges])

  // 算法步骤
  const algorithmSteps = useMemo(() => {
    const steps: { visitedNodes: number[]; visitedEdges: Edge[]; description: string }[] = []

    if (algorithm === 'bfs') {
      const visited = new Set<number>()
      const queue: number[] = [startNode]
      visited.add(startNode)
      const vNodes: number[] = [startNode]
      const vEdges: Edge[] = []
      steps.push({ visitedNodes: [...vNodes], visitedEdges: [...vEdges], description: `从节点 ${startNode} 开始` })

      while (queue.length > 0) {
        const current = queue.shift()!
        const neighbors = adjacencyList.get(current) || []
        for (const { node } of neighbors) {
          if (!visited.has(node)) {
            visited.add(node)
            queue.push(node)
            vNodes.push(node)
            vEdges.push({ from: current, to: node, weight: 1 })
            steps.push({
              visitedNodes: [...vNodes],
              visitedEdges: [...vEdges],
              description: `访问节点 ${node}（从 ${current}）`,
            })
          }
        }
      }
    } else if (algorithm === 'dfs') {
      const visited = new Set<number>()
      const vNodes: number[] = []
      const vEdges: Edge[] = []

      const dfs = (node: number, parent: number | null) => {
        visited.add(node)
        vNodes.push(node)
        if (parent !== null) {
          vEdges.push({ from: parent, to: node, weight: 1 })
        }
        steps.push({
          visitedNodes: [...vNodes],
          visitedEdges: [...vEdges],
          description: parent !== null ? `访问节点 ${node}（从 ${parent}）` : `从节点 ${node} 开始`,
        })

        const neighbors = adjacencyList.get(node) || []
        for (const { node: neighbor } of neighbors) {
          if (!visited.has(neighbor)) {
            dfs(neighbor, node)
          }
        }
      }

      dfs(startNode, null)
    } else if (algorithm === 'dijkstra') {
      const dist: Map<number, number> = new Map()
      const prev: Map<number, number | null> = new Map()
      const unvisited = new Set<number>()
      const vNodes: number[] = []
      const vEdges: Edge[] = []

      nodes.forEach((n) => {
        dist.set(n.id, n.id === startNode ? 0 : Infinity)
        prev.set(n.id, null)
        unvisited.add(n.id)
      })

      steps.push({
        visitedNodes: [startNode],
        visitedEdges: [],
        description: `初始化，起点 ${startNode} 距离为 0`,
      })

      while (unvisited.size > 0) {
        let minNode = -1
        let minDist = Infinity
        unvisited.forEach((n) => {
          if (dist.get(n)! < minDist) {
            minDist = dist.get(n)!
            minNode = n
          }
        })

        if (minNode === -1 || minDist === Infinity) break

        unvisited.delete(minNode)
        if (!vNodes.includes(minNode)) vNodes.push(minNode)

        const neighbors = adjacencyList.get(minNode) || []
        for (const { node, weight } of neighbors) {
          const alt = dist.get(minNode)! + weight
          if (alt < dist.get(node)!) {
            dist.set(node, alt)
            prev.set(node, minNode)
          }
        }

        // 添加最短路径边
        const p = prev.get(minNode)
        if (p !== null && p !== undefined) {
          vEdges.push({ from: p, to: minNode, weight: 1 })
        }

        steps.push({
          visitedNodes: [...vNodes],
          visitedEdges: [...vEdges],
          description: `处理节点 ${minNode}，最短距离 ${dist.get(minNode)}`,
        })
      }
    }

    return steps
  }, [algorithm, startNode, adjacencyList, nodes])

  // 动画
  useEffect(() => {
    if (isRunning && currentStep < algorithmSteps.length - 1) {
      animationRef.current = window.setTimeout(() => {
        setCurrentStep((s) => s + 1)
      }, 800)
    } else if (currentStep >= algorithmSteps.length - 1) {
      setIsRunning(false)
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [isRunning, currentStep, algorithmSteps.length])

  useEffect(() => {
    if (algorithmSteps.length > 0 && currentStep < algorithmSteps.length) {
      setVisitedNodes(algorithmSteps[currentStep].visitedNodes)
      setVisitedEdges(algorithmSteps[currentStep].visitedEdges)
    }
  }, [currentStep, algorithmSteps])

  // 绘制
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制边
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)
      if (!fromNode || !toNode) return

      const isVisited = visitedEdges.some(
        (e) => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
      )

      ctx.strokeStyle = isVisited ? '#22c55e' : '#94a3b8'
      ctx.lineWidth = isVisited ? 3 : 2
      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      ctx.stroke()

      // 权重标签
      if (edge.weight > 1) {
        const midX = (fromNode.x + toNode.x) / 2
        const midY = (fromNode.y + toNode.y) / 2
        ctx.fillStyle = '#1e293b'
        ctx.font = '12px sans-serif'
        ctx.fillText(edge.weight.toString(), midX + 5, midY - 5)
      }
    })

    // 绘制节点
    nodes.forEach((node) => {
      const isVisited = visitedNodes.includes(node.id)
      const isStart = node.id === startNode

      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
      ctx.fillStyle = isStart ? '#f59e0b' : isVisited ? '#22c55e' : '#3b82f6'
      ctx.fill()
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = 'white'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.id.toString(), node.x, node.y)
    })
  }, [nodes, edges, visitedNodes, visitedEdges, startNode])

  useEffect(() => {
    draw()
  }, [draw])

  const graphStats = useMemo(() => {
    const n = nodes.length
    const m = edges.length
    const degrees = nodes.map((node) => {
      return edges.filter((e) => e.from === node.id || e.to === node.id).length
    })
    const avgDegree = degrees.reduce((a, b) => a + b, 0) / n

    return { n, m, avgDegree: avgDegree.toFixed(2) }
  }, [nodes, edges])

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">图论基础</h1>
          <p className="text-gray-600">可视化图的遍历算法：BFS、DFS、Dijkstra</p>
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
            <h3 className="text-lg font-semibold mb-2">图可视化</h3>
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="w-full max-w-md mx-auto border border-gray-300 rounded"
            />
            {algorithm !== 'none' && algorithmSteps.length > 0 && currentStep < algorithmSteps.length && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {algorithmSteps[currentStep].description}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => {
                  resetAlgorithm()
                  setCurrentStep(0)
                  setIsRunning(true)
                }}
                disabled={algorithm === 'none'}
                className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
              >
                开始
              </button>
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={algorithm === 'none'}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
              >
                {isRunning ? '暂停' : '继续'}
              </button>
              <button
                onClick={resetAlgorithm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                重置
              </button>
              <div className="flex-1 min-w-[150px]">
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, algorithmSteps.length - 1)}
                  value={currentStep}
                  onChange={(e) => {
                    setIsRunning(false)
                    setCurrentStep(parseInt(e.target.value))
                  }}
                  className="w-full"
                  disabled={algorithm === 'none'}
                />
              </div>
              <span className="text-sm text-gray-600">
                {currentStep + 1}/{algorithmSteps.length || 1}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">BFS</h3>
              <p className="text-sm text-gray-600">
                广度优先搜索，使用队列，按层遍历，找最短路径（无权图）。
              </p>
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                时间: O(V+E)
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">DFS</h3>
              <p className="text-sm text-gray-600">
                深度优先搜索，使用栈/递归，尽可能深入，用于连通性检测。
              </p>
              <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                时间: O(V+E)
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">Dijkstra</h3>
              <p className="text-sm text-gray-600">
                单源最短路径算法，使用优先队列，适用于非负权图。
              </p>
              <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                时间: O((V+E)logV)
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择图</h3>
            <div className="space-y-2">
              {presets.map((preset, i) => (
                <button
                  key={preset.name}
                  onClick={() => selectPreset(i)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    selectedPreset === i ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择算法</h3>
            <div className="space-y-2">
              {(['bfs', 'dfs', 'dijkstra'] as Algorithm[]).map((alg) => (
                <button
                  key={alg}
                  onClick={() => {
                    setAlgorithm(alg)
                    resetAlgorithm()
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    algorithm === alg ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {alg.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">起始节点</h3>
            <div className="flex flex-wrap gap-2">
              {nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    setStartNode(node.id)
                    resetAlgorithm()
                  }}
                  className={`w-10 h-10 rounded-full font-bold ${
                    startNode === node.id ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {node.id}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">图统计</h3>
            <div className="space-y-2">
              <div className="p-2 bg-blue-50 rounded flex justify-between">
                <span className="text-blue-600">节点数 |V|</span>
                <span className="font-mono font-bold">{graphStats.n}</span>
              </div>
              <div className="p-2 bg-green-50 rounded flex justify-between">
                <span className="text-green-600">边数 |E|</span>
                <span className="font-mono font-bold">{graphStats.m}</span>
              </div>
              <div className="p-2 bg-purple-50 rounded flex justify-between">
                <span className="text-purple-600">平均度</span>
                <span className="font-mono font-bold">{graphStats.avgDegree}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">图论公式</h3>
            <div className="space-y-2">
              <MathFormula formula="\sum_{v \in V} deg(v) = 2|E|" />
              <p className="text-xs text-gray-600">握手定理：所有顶点度数之和等于边数的两倍</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
