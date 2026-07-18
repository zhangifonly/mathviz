import { describe, it, expect } from 'vitest'
import {
  DisjointSet, kruskalMST, primMST, runMST, ALGORITHMS, SAMPLE_GRAPH,
  type Graph,
} from './minimumSpanningTree'

// 一个手算过的小图（4 节点方形，对角线更贵）
const SQUARE: Graph = {
  nodes: [
    { x: 0, y: 0, label: 'A' }, { x: 1, y: 0, label: 'B' },
    { x: 1, y: 1, label: 'C' }, { x: 0, y: 1, label: 'D' },
  ],
  edges: [
    { u: 0, v: 1, w: 1 }, { u: 1, v: 2, w: 2 }, { u: 2, v: 3, w: 1 },
    { u: 3, v: 0, w: 2 }, { u: 0, v: 2, w: 5 }, { u: 1, v: 3, w: 6 },
  ],
}

describe('最小生成树', () => {
  it('DisjointSet: union 后同根，重复 union 返回 false', () => {
    const d = new DisjointSet(3)
    expect(d.find(0)).not.toBe(d.find(1))
    expect(d.union(0, 1)).toBe(true)
    expect(d.find(0)).toBe(d.find(1))
    expect(d.union(0, 1)).toBe(false)
  })

  it('Kruskal: 方形图选出权重 1+1+2=4 的树', () => {
    const r = kruskalMST(SQUARE)
    expect(r.totalWeight).toBe(4)
    expect(r.mstEdges.length).toBe(3)
  })

  it('Prim 与 Kruskal 总权重一致', () => {
    expect(primMST(SQUARE).totalWeight).toBe(kruskalMST(SQUARE).totalWeight)
    expect(primMST(SAMPLE_GRAPH).totalWeight).toBe(kruskalMST(SAMPLE_GRAPH).totalWeight)
  })

  it('MST 恰有 n-1 条边且不成环（并查集验证）', () => {
    for (const algo of ALGORITHMS) {
      const r = runMST(SAMPLE_GRAPH, algo)
      expect(r.mstEdges.length).toBe(SAMPLE_GRAPH.nodes.length - 1)
      const dsu = new DisjointSet(SAMPLE_GRAPH.nodes.length)
      for (const e of r.mstEdges) expect(dsu.union(e.u, e.v)).toBe(true)
    }
  })

  it('Kruskal 加边顺序权重非递减', () => {
    const r = kruskalMST(SAMPLE_GRAPH)
    for (let i = 1; i < r.mstEdges.length; i++) {
      expect(r.mstEdges[i].w).toBeGreaterThanOrEqual(r.mstEdges[i - 1].w)
    }
  })

  it('生成的树连通所有节点', () => {
    const r = kruskalMST(SAMPLE_GRAPH)
    const dsu = new DisjointSet(SAMPLE_GRAPH.nodes.length)
    for (const e of r.mstEdges) dsu.union(e.u, e.v)
    const root = dsu.find(0)
    for (let i = 1; i < SAMPLE_GRAPH.nodes.length; i++) {
      expect(dsu.find(i)).toBe(root)
    }
  })
})
