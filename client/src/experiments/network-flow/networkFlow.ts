/**
 * 最大流最小割核心算法（纯函数，便于测试）
 *
 * Edmonds-Karp：反复用 BFS 在残余网络里找最短增广路径，沿路推送
 * 瓶颈流量，直到无增广路。此时总流量即最大流，等于最小割容量。
 */

export interface FlowNode { id: number; x: number; y: number; label: string }
export interface FlowEdge { from: number; to: number; capacity: number }
export interface FlowNetwork { nodes: FlowNode[]; edges: FlowEdge[]; source: number; sink: number }

export interface FlowResult {
  value: number                // 最大流值
  flow: number[]               // 每条边（与 edges 同序）的实际流量
  minCutSet: number[]          // 残余图中源可达的节点集合
  minCutEdges: number[]        // 属于最小割的边下标（与 edges 同序）
}

/** 用 BFS 在残余容量矩阵里找一条增广路径，返回前驱数组或 null */
export function bfsAugment(res: number[][], source: number, sink: number): number[] | null {
  const n = res.length
  const prev = new Array<number>(n).fill(-1)
  prev[source] = source
  const queue = [source]
  while (queue.length > 0) {
    const u = queue.shift() as number
    for (let v = 0; v < n; v++) {
      if (prev[v] === -1 && res[u][v] > 0) {
        prev[v] = u
        if (v === sink) return prev
        queue.push(v)
      }
    }
  }
  return null
}

/** Edmonds-Karp 求最大流，返回流量、最小割集合与割边 */
export function maxFlow(net: FlowNetwork): FlowResult {
  const n = net.nodes.length
  const res: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0))
  for (const e of net.edges) res[e.from][e.to] += e.capacity

  let value = 0
  let prev = bfsAugment(res, net.source, net.sink)
  while (prev) {
    // 找路径瓶颈
    let bottleneck = Infinity
    for (let v = net.sink; v !== net.source; v = prev[v]) {
      bottleneck = Math.min(bottleneck, res[prev[v]][v])
    }
    for (let v = net.sink; v !== net.source; v = prev[v]) {
      res[prev[v]][v] -= bottleneck
      res[v][prev[v]] += bottleneck
    }
    value += bottleneck
    prev = bfsAugment(res, net.source, net.sink)
  }

  // 最小割：残余图中源可达集合
  const reachable = new Array<boolean>(n).fill(false)
  const stack = [net.source]
  reachable[net.source] = true
  while (stack.length > 0) {
    const u = stack.pop() as number
    for (let v = 0; v < n; v++) {
      if (!reachable[v] && res[u][v] > 0) {
        reachable[v] = true
        stack.push(v)
      }
    }
  }
  const minCutSet: number[] = []
  for (let i = 0; i < n; i++) if (reachable[i]) minCutSet.push(i)

  const flow = net.edges.map((e) => e.capacity - res[e.from][e.to])
  const minCutEdges: number[] = []
  net.edges.forEach((e, i) => {
    if (reachable[e.from] && !reachable[e.to]) minCutEdges.push(i)
  })

  return { value, flow, minCutSet, minCutEdges }
}

export const SAMPLE_NETWORK: FlowNetwork = {
  nodes: [
    { id: 0, x: 70, y: 240, label: 'S' }, { id: 1, x: 230, y: 110, label: 'A' },
    { id: 2, x: 230, y: 370, label: 'B' }, { id: 3, x: 400, y: 110, label: 'C' },
    { id: 4, x: 400, y: 370, label: 'D' }, { id: 5, x: 560, y: 240, label: 'T' },
  ],
  edges: [
    { from: 0, to: 1, capacity: 12 }, { from: 0, to: 2, capacity: 10 },
    { from: 1, to: 2, capacity: 4 }, { from: 1, to: 3, capacity: 10 },
    { from: 2, to: 4, capacity: 14 }, { from: 3, to: 2, capacity: 6 },
    { from: 3, to: 5, capacity: 10 }, { from: 4, to: 3, capacity: 7 },
    { from: 4, to: 5, capacity: 12 },
  ],
  source: 0,
  sink: 5,
}
