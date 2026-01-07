/**
 * 图论场景渲染器
 * 根据场景配置渲染图结构、遍历动画、最短路径演示等可视化
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'

// 图的节点类型
interface GraphNode {
  id: string
  x: number
  y: number
  label: string
  visited?: boolean
  distance?: number
  inPath?: boolean
}

// 图的边类型
interface GraphEdge {
  from: string
  to: string
  weight?: number
  directed?: boolean
  highlighted?: boolean
}

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '图论', subtitle: '探索网络与连接的数学' },
    'sum-1': { title: '总结回顾', subtitle: '图论的核心思想' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '图论', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 基础图结构展示场景
function GraphScene({ directed = false, weighted = false }: { directed?: boolean; weighted?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 创建示例图
  const graph = useMemo(() => {
    const nodes: GraphNode[] = [
      { id: 'A', x: 150, y: 100, label: 'A' },
      { id: 'B', x: 350, y: 100, label: 'B' },
      { id: 'C', x: 450, y: 250, label: 'C' },
      { id: 'D', x: 250, y: 350, label: 'D' },
      { id: 'E', x: 50, y: 250, label: 'E' },
    ]

    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', weight: 4, directed },
      { from: 'A', to: 'E', weight: 2, directed },
      { from: 'B', to: 'C', weight: 3, directed },
      { from: 'C', to: 'D', weight: 1, directed },
      { from: 'D', to: 'E', weight: 5, directed },
      { from: 'E', to: 'B', weight: 6, directed },
    ]

    return { nodes, edges }
  }, [directed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制边
    graph.edges.forEach(edge => {
      const fromNode = graph.nodes.find(n => n.id === edge.from)
      const toNode = graph.nodes.find(n => n.id === edge.to)
      if (!fromNode || !toNode) return

      ctx.strokeStyle = edge.highlighted ? '#22c55e' : 'rgba(148, 163, 184, 0.6)'
      ctx.lineWidth = edge.highlighted ? 3 : 2
      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      ctx.stroke()

      // 绘制箭头（有向图）
      if (directed) {
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)
        const arrowSize = 15
        const endX = toNode.x - Math.cos(angle) * 25
        const endY = toNode.y - Math.sin(angle) * 25

        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle - Math.PI / 6),
          endY - arrowSize * Math.sin(angle - Math.PI / 6)
        )
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - arrowSize * Math.cos(angle + Math.PI / 6),
          endY - arrowSize * Math.sin(angle + Math.PI / 6)
        )
        ctx.stroke()
      }

      // 绘制权重
      if (weighted && edge.weight) {
        const midX = (fromNode.x + toNode.x) / 2
        const midY = (fromNode.y + toNode.y) / 2
        ctx.fillStyle = 'white'
        ctx.font = 'bold 14px sans-serif'
        ctx.fillText(edge.weight.toString(), midX + 10, midY - 10)
      }
    })

    // 绘制节点
    graph.nodes.forEach(node => {
      // 节点圆圈
      ctx.fillStyle = node.visited ? '#22c55e' : node.inPath ? '#ef4444' : '#3b82f6'
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()

      // 节点标签
      ctx.fillStyle = 'white'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, node.x, node.y)

      // 距离标签（用于最短路径）
      if (node.distance !== undefined) {
        ctx.fillStyle = '#fbbf24'
        ctx.font = '12px sans-serif'
        ctx.fillText(`d=${node.distance}`, node.x, node.y + 35)
      }
    })
  }, [graph, directed, weighted])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 图遍历动画场景（BFS/DFS）
function TraversalScene({ algorithm = 'bfs' }: { algorithm?: 'bfs' | 'dfs' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)

  // 创建图结构
  const graph = useMemo(() => {
    const nodes: GraphNode[] = [
      { id: 'A', x: 250, y: 50, label: 'A' },
      { id: 'B', x: 150, y: 150, label: 'B' },
      { id: 'C', x: 350, y: 150, label: 'C' },
      { id: 'D', x: 100, y: 250, label: 'D' },
      { id: 'E', x: 200, y: 250, label: 'E' },
      { id: 'F', x: 300, y: 250, label: 'F' },
      { id: 'G', x: 400, y: 250, label: 'G' },
    ]

    const edges: GraphEdge[] = [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'B', to: 'E' },
      { from: 'C', to: 'F' },
      { from: 'C', to: 'G' },
    ]

    return { nodes, edges }
  }, [])

  // 遍历顺序
  const traversalOrder = useMemo(() => {
    if (algorithm === 'bfs') {
      return ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    } else {
      return ['A', 'B', 'D', 'E', 'C', 'F', 'G']
    }
  }, [algorithm])

  // 动画控制
  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < traversalOrder.length ? s + 1 : 0))
    }, 800)
    return () => clearInterval(timer)
  }, [traversalOrder.length])

  // 更新节点访问状态
  const visitedNodes = useMemo(() => {
    return new Set(traversalOrder.slice(0, step))
  }, [step, traversalOrder])

  const currentNode = step > 0 ? traversalOrder[step - 1] : null

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制边
    graph.edges.forEach(edge => {
      const fromNode = graph.nodes.find(n => n.id === edge.from)
      const toNode = graph.nodes.find(n => n.id === edge.to)
      if (!fromNode || !toNode) return

      const bothVisited = visitedNodes.has(edge.from) && visitedNodes.has(edge.to)
      ctx.strokeStyle = bothVisited ? 'rgba(34, 197, 94, 0.6)' : 'rgba(148, 163, 184, 0.4)'
      ctx.lineWidth = bothVisited ? 3 : 2
      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      ctx.stroke()
    })

    // 绘制节点
    graph.nodes.forEach(node => {
      const isVisited = visitedNodes.has(node.id)
      const isCurrent = node.id === currentNode

      // 节点圆圈
      ctx.fillStyle = isCurrent ? '#ef4444' : isVisited ? '#22c55e' : '#3b82f6'
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'white'
      ctx.lineWidth = isCurrent ? 3 : 2
      ctx.stroke()

      // 节点标签
      ctx.fillStyle = 'white'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, node.x, node.y)

      // 访问顺序
      if (isVisited) {
        const order = traversalOrder.indexOf(node.id) + 1
        ctx.fillStyle = '#fbbf24'
        ctx.font = '12px sans-serif'
        ctx.fillText(order.toString(), node.x, node.y + 35)
      }
    })

    // 显示算法名称
    ctx.fillStyle = 'white'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(algorithm === 'bfs' ? '广度优先搜索 (BFS)' : '深度优先搜索 (DFS)', 20, 30)
  }, [graph, visitedNodes, currentNode, algorithm, traversalOrder])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={350}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 最短路径演示场景（Dijkstra）
function ShortestPathScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)

  // 创建带权重的图
  const graph = useMemo(() => {
    const nodes: GraphNode[] = [
      { id: 'A', x: 100, y: 200, label: 'A', distance: 0 },
      { id: 'B', x: 200, y: 100, label: 'B', distance: Infinity },
      { id: 'C', x: 300, y: 100, label: 'C', distance: Infinity },
      { id: 'D', x: 200, y: 300, label: 'D', distance: Infinity },
      { id: 'E', x: 400, y: 200, label: 'E', distance: Infinity },
    ]

    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'D', weight: 2 },
      { from: 'B', to: 'C', weight: 3 },
      { from: 'B', to: 'D', weight: 1 },
      { from: 'C', to: 'E', weight: 2 },
      { from: 'D', to: 'E', weight: 5 },
    ]

    return { nodes, edges }
  }, [])

  // Dijkstra 算法步骤
  const dijkstraSteps = useMemo(() => {
    const steps: Array<{ visited: Set<string>; distances: Record<string, number>; path: string[] }> = []
    const distances: Record<string, number> = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity }
    const visited = new Set<string>()
    const previous: Record<string, string | null> = {}

    steps.push({ visited: new Set(visited), distances: { ...distances }, path: [] })

    while (visited.size < graph.nodes.length) {
      // 找到未访问的最小距离节点
      let minNode: string | null = null
      let minDist = Infinity
      for (const node of graph.nodes) {
        if (!visited.has(node.id) && distances[node.id] < minDist) {
          minDist = distances[node.id]
          minNode = node.id
        }
      }

      if (!minNode) break
      visited.add(minNode)

      // 更新邻居距离
      graph.edges.forEach(edge => {
        if (edge.from === minNode && !visited.has(edge.to)) {
          const newDist = distances[minNode] + (edge.weight || 0)
          if (newDist < distances[edge.to]) {
            distances[edge.to] = newDist
            previous[edge.to] = minNode
          }
        }
      })

      // 构建到 E 的路径
      const path: string[] = []
      if (distances.E !== Infinity) {
        let current: string | null = 'E'
        while (current) {
          path.unshift(current)
          current = previous[current] || null
        }
      }

      steps.push({ visited: new Set(visited), distances: { ...distances }, path })
    }

    return steps
  }, [graph])

  // 动画控制
  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < dijkstraSteps.length - 1 ? s + 1 : 0))
    }, 1500)
    return () => clearInterval(timer)
  }, [dijkstraSteps.length])

  const currentStep = dijkstraSteps[step]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !currentStep) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制边
    graph.edges.forEach(edge => {
      const fromNode = graph.nodes.find(n => n.id === edge.from)
      const toNode = graph.nodes.find(n => n.id === edge.to)
      if (!fromNode || !toNode) return

      const inPath = currentStep.path.includes(edge.from) && currentStep.path.includes(edge.to) &&
        Math.abs(currentStep.path.indexOf(edge.from) - currentStep.path.indexOf(edge.to)) === 1

      ctx.strokeStyle = inPath ? '#ef4444' : 'rgba(148, 163, 184, 0.4)'
      ctx.lineWidth = inPath ? 4 : 2
      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      ctx.stroke()

      // 绘制权重
      const midX = (fromNode.x + toNode.x) / 2
      const midY = (fromNode.y + toNode.y) / 2
      ctx.fillStyle = 'white'
      ctx.font = 'bold 14px sans-serif'
      ctx.fillText((edge.weight || 0).toString(), midX + 10, midY - 10)
    })

    // 绘制节点
    graph.nodes.forEach(node => {
      const isVisited = currentStep.visited.has(node.id)
      const inPath = currentStep.path.includes(node.id)
      const distance = currentStep.distances[node.id]

      // 节点圆圈
      ctx.fillStyle = inPath ? '#ef4444' : isVisited ? '#22c55e' : '#3b82f6'
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()

      // 节点标签
      ctx.fillStyle = 'white'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, node.x, node.y)

      // 距离标签
      ctx.fillStyle = '#fbbf24'
      ctx.font = '12px sans-serif'
      ctx.fillText(distance === Infinity ? '∞' : distance.toString(), node.x, node.y + 35)
    })

    // 显示算法名称
    ctx.fillStyle = 'white'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Dijkstra 最短路径算法', 20, 30)
  }, [graph, currentStep])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-1': {
      title: '图论的应用',
      items: ['社交网络分析', '导航系统', '搜索引擎', '生物信息学'],
      icon: '🌐',
    },
    'app-2': {
      title: '社交网络',
      items: ['好友推荐', '社区发现', '影响力分析', '信息传播'],
      icon: '👥',
    },
    'app-3': {
      title: '搜索引擎',
      items: ['PageRank 算法', '网页重要性', '链接分析', '搜索排序'],
      icon: '🔍',
    },
    'app-4': {
      title: '生物信息学',
      items: ['蛋白质网络', '基因调控', '代谢通路', '疾病传播'],
      icon: '🧬',
    },
  }

  const app = apps[sceneId] || apps['app-1']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function GraphTheorySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id === 'intro-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      // 展示基础图结构
      return <GraphScene directed={false} weighted={false} />

    case 'concept':
      // 展示有向图和带权图
      if (sceneConfig.id === 'concept-2') {
        return <GraphScene directed={true} weighted={true} />
      }
      return <GraphScene directed={false} weighted={false} />

    case 'traversal':
      // 图遍历动画
      if (sceneConfig.id === 'trav-2') {
        return <TraversalScene algorithm="dfs" />
      }
      if (sceneConfig.id === 'trav-3') {
        return <TraversalScene algorithm="bfs" />
      }
      return <TraversalScene algorithm="bfs" />

    case 'shortest-path':
      // 最短路径演示
      return <ShortestPathScene />

    case 'application':
      // 应用场景
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      // 总结场景
      if (sceneConfig.id === 'sum-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      return <GraphScene directed={false} weighted={true} />

    default:
      return <GraphScene directed={false} weighted={false} />
  }
}
