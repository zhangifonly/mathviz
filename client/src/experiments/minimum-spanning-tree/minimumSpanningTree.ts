/**
 * 最小生成树核心算法（纯函数，便于测试）
 *
 * 在带权连通无向图上，找出连接所有节点、总权重最小且不成环的边集。
 * 实现两种经典算法：Kruskal（并查集，按边权升序加边不成环）
 * 与 Prim（从一点出发，每次并入最小跨界边）。节点坐标归一化到 [0,1]。
 */

export interface GraphNode { x: number; y: number; label: string }
export interface Edge { u: number; v: number; w: number }
export interface Graph { nodes: GraphNode[]; edges: Edge[] }
export interface MSTResult { mstEdges: Edge[]; totalWeight: number }

/** 并查集（路径压缩 + 按秩合并） */
export class DisjointSet {
  parent: number[]
  rank: number[]
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i)
    this.rank = new Array(n).fill(0)
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]]
      x = this.parent[x]
    }
    return x
  }
  /** 合并两点所在集合，若原本已连通返回 false */
  union(a: number, b: number): boolean {
    const ra = this.find(a)
    const rb = this.find(b)
    if (ra === rb) return false
    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb
    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra
    else { this.parent[rb] = ra; this.rank[ra]++ }
    return true
  }
}

/** Kruskal：边按权重升序，用并查集依次加入不成环的边 */
export function kruskalMST(graph: Graph): MSTResult {
  const dsu = new DisjointSet(graph.nodes.length)
  const sorted = [...graph.edges].sort((a, b) => a.w - b.w)
  const mstEdges: Edge[] = []
  let totalWeight = 0
  for (const e of sorted) {
    if (mstEdges.length === graph.nodes.length - 1) break
    if (dsu.union(e.u, e.v)) { mstEdges.push(e); totalWeight += e.w }
  }
  return { mstEdges, totalWeight }
}

/** Prim：从节点 0 出发，反复并入连接已选集合的最小边 */
export function primMST(graph: Graph): MSTResult {
  const n = graph.nodes.length
  const inTree = new Array(n).fill(false)
  const mstEdges: Edge[] = []
  let totalWeight = 0
  if (n > 0) inTree[0] = true
  while (mstEdges.length < n - 1) {
    let best: Edge | null = null
    for (const e of graph.edges) {
      const cross = inTree[e.u] !== inTree[e.v]
      if (cross && (best === null || e.w < best.w)) best = e
    }
    if (!best) break // 图不连通
    inTree[best.u] = true
    inTree[best.v] = true
    mstEdges.push(best)
    totalWeight += best.w
  }
  return { mstEdges, totalWeight }
}

export const ALGORITHMS = ['kruskal', 'prim'] as const
export type Algorithm = (typeof ALGORITHMS)[number]

export function runMST(graph: Graph, algo: Algorithm): MSTResult {
  return algo === 'kruskal' ? kruskalMST(graph) : primMST(graph)
}

/** 示例图：8 个节点，坐标归一化，边权为其欧氏距离的近似整数 */
export const SAMPLE_GRAPH: Graph = {
  nodes: [
    { x: 0.15, y: 0.2, label: 'A' }, { x: 0.5, y: 0.12, label: 'B' },
    { x: 0.82, y: 0.22, label: 'C' }, { x: 0.2, y: 0.55, label: 'D' },
    { x: 0.52, y: 0.5, label: 'E' }, { x: 0.85, y: 0.58, label: 'F' },
    { x: 0.32, y: 0.85, label: 'G' }, { x: 0.72, y: 0.88, label: 'H' },
  ],
  edges: [
    { u: 0, v: 1, w: 7 }, { u: 0, v: 3, w: 8 }, { u: 1, v: 2, w: 6 },
    { u: 1, v: 4, w: 9 }, { u: 2, v: 5, w: 7 }, { u: 3, v: 4, w: 6 },
    { u: 3, v: 6, w: 6 }, { u: 4, v: 5, w: 7 }, { u: 4, v: 6, w: 8 },
    { u: 4, v: 7, w: 9 }, { u: 5, v: 7, w: 6 }, { u: 6, v: 7, w: 8 },
    { u: 2, v: 4, w: 10 }, { u: 1, v: 3, w: 11 },
  ],
}
