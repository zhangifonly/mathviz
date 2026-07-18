/**
 * PageRank 核心算法（纯函数，便于测试）
 *
 * PageRank 把"重要性"建模成随机浏览者在网页链接图上无限漫步后的稳态分布。
 * 用幂迭代法：转移矩阵（带阻尼因子）反复作用于 rank 向量，直到收敛。
 * 这里返回每一次迭代的 rank 快照，便于逐帧展示收敛过程。
 */

export interface WebNode {
  id: number
  label: string
  x: number // 归一化坐标 0..1
  y: number
}

export interface WebGraph {
  nodes: WebNode[]
  edges: [number, number][] // [from, to] 有向链接
}

export interface PageRankResult {
  history: number[][] // 每次迭代后的 rank 向量
  final: number[] // 收敛后的 rank
}

/** 一个带坐标的小网页链接图 */
export const WEB_GRAPH: WebGraph = {
  nodes: [
    { id: 0, label: 'A', x: 0.2, y: 0.28 },
    { id: 1, label: 'B', x: 0.52, y: 0.14 },
    { id: 2, label: 'C', x: 0.82, y: 0.3 },
    { id: 3, label: 'D', x: 0.76, y: 0.72 },
    { id: 4, label: 'E', x: 0.44, y: 0.86 },
    { id: 5, label: 'F', x: 0.15, y: 0.68 },
  ],
  edges: [
    [0, 1], [0, 2],
    [1, 2], [1, 3],
    [2, 0], [2, 3],
    [3, 4],
    [4, 2], [4, 5],
    [5, 0],
  ],
}

/** 每个节点的出度 */
export function outDegrees(graph: WebGraph): number[] {
  const deg = new Array(graph.nodes.length).fill(0)
  for (const [from] of graph.edges) deg[from]++
  return deg
}

/**
 * 幂迭代计算 PageRank。
 * r' = damping * M·r + (1-damping)/N ，悬挂节点(无出链)把权重均摊给所有节点。
 * @returns 每次迭代的 rank 快照与最终值
 */
export function pagerank(graph: WebGraph, damping = 0.85, iters = 20): PageRankResult {
  const N = graph.nodes.length
  const deg = outDegrees(graph)
  let r = new Array(N).fill(1 / N)
  const history: number[][] = [r.slice()]
  const teleport = (1 - damping) / N

  for (let it = 0; it < iters; it++) {
    const next = new Array(N).fill(teleport)
    // 悬挂节点(出度为0)的权重均摊到所有节点
    let dangling = 0
    for (let i = 0; i < N; i++) if (deg[i] === 0) dangling += r[i]
    const dShare = (damping * dangling) / N
    for (let i = 0; i < N; i++) next[i] += dShare
    // 沿有向边转移
    for (const [from, to] of graph.edges) {
      next[to] += (damping * r[from]) / deg[from]
    }
    r = next
    history.push(r.slice())
  }
  return { history, final: r }
}

/** rank 向量的元素之和（收敛时应约为 1） */
export function rankSum(rank: number[]): number {
  return rank.reduce((a, b) => a + b, 0)
}

export const DAMPING_OPTIONS = [0.5, 0.85, 0.95]
