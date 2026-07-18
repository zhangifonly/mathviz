/**
 * 欧拉与哈密顿回路核心算法（纯函数，便于测试，禁止依赖 DOM）
 *
 * 欧拉路径/回路：一笔画遍历每条【边】恰好一次。
 *   - 所有顶点度数为偶 => 存在欧拉回路
 *   - 恰有两个奇度顶点 => 存在欧拉路径（从一个奇点到另一个奇点）
 *   - 其余情况 => 不存在
 * 哈密顿回路：遍历每个【顶点】恰好一次并回到起点（小图暴力搜索）。
 */

export interface GraphNode {
  id: string
  x: number // 归一化坐标 0..1
  y: number
}

export interface Graph {
  nodes: GraphNode[]
  edges: [number, number][] // 顶点下标对，允许重边
}

export type EulerKind = 'circuit' | 'path' | 'none'

/** 每个顶点的度数 */
export function degrees(graph: Graph): number[] {
  const deg = graph.nodes.map(() => 0)
  for (const [a, b] of graph.edges) {
    deg[a]++
    deg[b]++
  }
  return deg
}

/** 忽略孤立点后，含边的顶点是否连通（并查集） */
export function edgesConnected(graph: Graph): boolean {
  const n = graph.nodes.length
  const parent = graph.nodes.map((_, i) => i)
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])))
  for (const [a, b] of graph.edges) parent[find(a)] = find(b)
  let root = -1
  for (let i = 0; i < n; i++) {
    const hasEdge = graph.edges.some(([a, b]) => a === i || b === i)
    if (!hasEdge) continue
    if (root === -1) root = find(i)
    else if (find(i) !== root) return false
  }
  return true
}

/** 判定欧拉类型：度数判据 + 连通性 */
export function classifyEuler(graph: Graph): EulerKind {
  if (graph.edges.length === 0 || !edgesConnected(graph)) return 'none'
  const odd = degrees(graph).filter((d) => d % 2 === 1).length
  if (odd === 0) return 'circuit'
  if (odd === 2) return 'path'
  return 'none'
}

/** 是否存在欧拉路径或回路 */
export function hasEulerPath(graph: Graph): boolean {
  return classifyEuler(graph) !== 'none'
}

/** Hierholzer 算法求欧拉路径，返回顶点下标序列；不存在则返回 [] */
export function findEulerPath(graph: Graph): number[] {
  const kind = classifyEuler(graph)
  if (kind === 'none') return []
  // 邻接表：每个元素记录目标顶点与边号，便于删边
  const adj: { to: number; e: number }[][] = graph.nodes.map(() => [])
  graph.edges.forEach(([a, b], e) => {
    adj[a].push({ to: b, e })
    adj[b].push({ to: a, e })
  })
  const used = graph.edges.map(() => false)
  const deg = degrees(graph)
  // 起点：欧拉路径从奇度顶点出发，回路从任意含边顶点出发
  let start = graph.edges[0][0]
  if (kind === 'path') start = deg.findIndex((d) => d % 2 === 1)
  const stack = [start]
  const path: number[] = []
  while (stack.length) {
    const v = stack[stack.length - 1]
    const next = adj[v].find((x) => !used[x.e])
    if (next) {
      used[next.e] = true
      stack.push(next.to)
    } else {
      path.push(stack.pop() as number)
    }
  }
  return path.reverse()
}

/** 暴力回溯求哈密顿回路（适用于小图），返回顶点序列或 [] */
export function findHamiltonCircuit(graph: Graph): number[] {
  const n = graph.nodes.length
  if (n === 0) return []
  const adj = graph.nodes.map(() => new Set<number>())
  for (const [a, b] of graph.edges) {
    adj[a].add(b)
    adj[b].add(a)
  }
  const visited = new Array(n).fill(false)
  const route = [0]
  visited[0] = true
  const dfs = (v: number): boolean => {
    if (route.length === n) return adj[v].has(0)
    for (const w of adj[v]) {
      if (visited[w]) continue
      visited[w] = true
      route.push(w)
      if (dfs(w)) return true
      route.pop()
      visited[w] = false
    }
    return false
  }
  return dfs(0) ? [...route, 0] : []
}

function g(nodes: [string, number, number][], edges: [number, number][]): Graph {
  return { nodes: nodes.map(([id, x, y]) => ({ id, x, y })), edges }
}

/** 示例图集合 */
export const SAMPLE_GRAPHS: { name: string; graph: Graph }[] = [
  {
    name: '柯尼斯堡七桥',
    graph: g(
      [['A', 0.5, 0.15], ['B', 0.15, 0.55], ['C', 0.85, 0.55], ['D', 0.5, 0.9]],
      [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]],
    ),
  },
  {
    name: '信封（一笔画）',
    graph: g(
      [['A', 0.2, 0.8], ['B', 0.8, 0.8], ['C', 0.8, 0.45], ['D', 0.2, 0.45], ['E', 0.5, 0.15]],
      [[0, 1], [0, 3], [1, 2], [3, 2], [3, 4], [2, 4], [0, 2], [1, 3]],
    ),
  },
  {
    name: '方形回路',
    graph: g(
      [['A', 0.25, 0.25], ['B', 0.75, 0.25], ['C', 0.75, 0.75], ['D', 0.25, 0.75]],
      [[0, 1], [1, 2], [2, 3], [3, 0]],
    ),
  },
]
