/**
 * Dijkstra 最短路算法核心（纯函数，便于测试）
 * 贪心：每步选未确定节点中距源点最近者定为已确定，再松弛其邻边。
 * 边权非负保证最先确定的距离即最终最短距离。
 */

export interface GraphNode {
  id: number
  label: string
  x: number // 归一化坐标 [0,1]
  y: number
}

export interface Edge {
  u: number
  v: number
  w: number
}
export interface Graph {
  nodes: GraphNode[]
  edges: Edge[]
}

export interface DijkstraResult {
  dist: number[] // 各节点到源点的最短距离，不可达为 Infinity
  prev: number[] // 最短路径树中的前驱节点，无则为 -1
  order: number[] // 节点被确定为最短的先后顺序
}

/** 由无向带权边构建邻接表 */
export function buildAdjacency(graph: Graph): Array<Array<{ to: number; w: number }>> {
  const adj: Array<Array<{ to: number; w: number }>> = graph.nodes.map(() => [])
  for (const e of graph.edges) {
    adj[e.u].push({ to: e.v, w: e.w })
    adj[e.v].push({ to: e.u, w: e.w })
  }
  return adj
}

/** Dijkstra 主过程，返回距离、前驱与确定顺序 */
export function dijkstra(graph: Graph, source: number): DijkstraResult {
  const n = graph.nodes.length
  const adj = buildAdjacency(graph)
  const dist = new Array(n).fill(Infinity)
  const prev = new Array(n).fill(-1)
  const done = new Array(n).fill(false)
  const order: number[] = []
  dist[source] = 0

  for (let iter = 0; iter < n; iter++) {
    // 线性选出未确定节点中距离最小者（图小，无需堆）
    let u = -1
    let best = Infinity
    for (let i = 0; i < n; i++) {
      if (!done[i] && dist[i] < best) {
        best = dist[i]
        u = i
      }
    }
    if (u === -1) break // 剩余节点均不可达
    done[u] = true
    order.push(u)
    // 松弛 u 的所有邻边
    for (const { to, w } of adj[u]) {
      if (!done[to] && dist[u] + w < dist[to]) {
        dist[to] = dist[u] + w
        prev[to] = u
      }
    }
  }
  return { dist, prev, order }
}
/** 根据前驱数组重建 source→target 的路径（节点 id 序列） */
export function shortestPath(prev: number[], target: number): number[] {
  const path: number[] = []
  let cur = target
  while (cur !== -1) {
    path.unshift(cur)
    cur = prev[cur]
  }
  return path
}

/** 固定带坐标示例图：8 个节点，11 条带权边 */
export const SAMPLE_GRAPH: Graph = {
  nodes: [
    { id: 0, label: 'A', x: 0.08, y: 0.5 }, { id: 1, label: 'B', x: 0.3, y: 0.18 },
    { id: 2, label: 'C', x: 0.3, y: 0.82 }, { id: 3, label: 'D', x: 0.55, y: 0.34 },
    { id: 4, label: 'E', x: 0.55, y: 0.68 }, { id: 5, label: 'F', x: 0.8, y: 0.2 },
    { id: 6, label: 'G', x: 0.8, y: 0.8 }, { id: 7, label: 'H', x: 0.95, y: 0.5 },
  ],
  edges: [
    { u: 0, v: 1, w: 4 }, { u: 0, v: 2, w: 3 }, { u: 1, v: 2, w: 2 },
    { u: 1, v: 3, w: 5 }, { u: 2, v: 4, w: 6 }, { u: 3, v: 4, w: 1 },
    { u: 3, v: 5, w: 3 }, { u: 4, v: 6, w: 4 }, { u: 4, v: 7, w: 8 },
    { u: 5, v: 7, w: 2 }, { u: 6, v: 7, w: 5 },
  ],
}

export const SOURCE_NODES = [0, 3, 7]
