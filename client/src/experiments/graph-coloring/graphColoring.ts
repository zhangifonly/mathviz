/**
 * 图着色核心算法（纯函数，便于测试）
 *
 * 给定一张无向图，为每个节点分配颜色，要求相邻节点颜色不同。
 * greedyColoring: 贪心法，按节点顺序分配最小可用色。
 * chromaticNumber: 回溯法求最少色数（色数），适合小图。
 */

export { SAMPLE_GRAPHS, type SampleGraph } from './sampleGraphs'

export interface GraphNode {
  x: number
  y: number
  label: string
}

export interface Graph {
  nodes: GraphNode[]
  edges: [number, number][]
}

/** 构建每个节点的邻接表 */
export function adjacency(graph: Graph): number[][] {
  const adj: number[][] = graph.nodes.map(() => [])
  for (const [a, b] of graph.edges) {
    adj[a].push(b)
    adj[b].push(a)
  }
  return adj
}

/**
 * 贪心着色：按节点下标顺序，给每个节点分配未被邻居占用的最小色号。
 * 返回每个节点的色号数组（从 0 开始）。
 */
export function greedyColoring(graph: Graph): number[] {
  const adj = adjacency(graph)
  const colors = new Array(graph.nodes.length).fill(-1)
  for (let v = 0; v < graph.nodes.length; v++) {
    const used = new Set<number>()
    for (const u of adj[v]) {
      if (colors[u] >= 0) used.add(colors[u])
    }
    let c = 0
    while (used.has(c)) c++
    colors[v] = c
  }
  return colors
}

/** 找出相邻却同色的冲突边（返回边下标数组） */
export function conflictEdges(graph: Graph, colors: number[]): number[] {
  const out: number[] = []
  graph.edges.forEach(([a, b], i) => {
    if (colors[a] === colors[b]) out.push(i)
  })
  return out
}

/** 判断给节点 v 涂 c 色是否与已着色邻居冲突 */
function isSafe(adj: number[][], colors: number[], v: number, c: number): boolean {
  for (const u of adj[v]) {
    if (colors[u] === c) return false
  }
  return true
}

function canColorWith(graph: Graph, k: number): number[] | null {
  const adj = adjacency(graph)
  const n = graph.nodes.length
  const colors = new Array(n).fill(-1)
  const solve = (v: number): boolean => {
    if (v === n) return true
    for (let c = 0; c < k; c++) {
      if (isSafe(adj, colors, v, c)) {
        colors[v] = c
        if (solve(v + 1)) return true
        colors[v] = -1
      }
    }
    return false
  }
  return solve(0) ? colors : null
}

/**
 * 回溯法求色数：从 1 起逐一尝试 k 种颜色，找到可行的最小 k。
 * 返回 { k, colors }，colors 为该最优方案的着色。
 */
export function chromaticNumber(graph: Graph): { k: number; colors: number[] } {
  if (graph.nodes.length === 0) return { k: 0, colors: [] }
  for (let k = 1; k <= graph.nodes.length; k++) {
    const colors = canColorWith(graph, k)
    if (colors) return { k, colors }
  }
  return { k: graph.nodes.length, colors: greedyColoring(graph) }
}
