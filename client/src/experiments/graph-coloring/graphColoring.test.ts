import { describe, it, expect } from 'vitest'
import {
  greedyColoring,
  chromaticNumber,
  conflictEdges,
  adjacency,
  SAMPLE_GRAPHS,
  type Graph,
} from './graphColoring'

// 三角形 K3：色数必为 3
const K3: Graph = {
  nodes: [
    { x: 0, y: 0, label: 'A' },
    { x: 1, y: 0, label: 'B' },
    { x: 0, y: 1, label: 'C' },
  ],
  edges: [[0, 1], [1, 2], [0, 2]],
}

// 路径 P3：两端可同色，色数=2
const P3: Graph = {
  nodes: [
    { x: 0, y: 0, label: 'A' },
    { x: 1, y: 0, label: 'B' },
    { x: 2, y: 0, label: 'C' },
  ],
  edges: [[0, 1], [1, 2]],
}

describe('图着色', () => {
  it('greedyColoring 产生合法着色（相邻不同色）', () => {
    for (const s of SAMPLE_GRAPHS) {
      const colors = greedyColoring(s.graph)
      expect(conflictEdges(s.graph, colors).length).toBe(0)
    }
  })

  it('greedyColoring 给每个节点都分配了非负色号', () => {
    const colors = greedyColoring(K3)
    expect(colors.length).toBe(3)
    for (const c of colors) expect(c).toBeGreaterThanOrEqual(0)
  })

  it('chromaticNumber: 三角形色数为 3', () => {
    const { k, colors } = chromaticNumber(K3)
    expect(k).toBe(3)
    expect(conflictEdges(K3, colors).length).toBe(0)
  })

  it('chromaticNumber: 路径色数为 2', () => {
    expect(chromaticNumber(P3).k).toBe(2)
  })

  it('conflictEdges 能检出同色冲突', () => {
    const bad = [0, 0, 0] // 全同色
    expect(conflictEdges(K3, bad).length).toBe(3)
  })

  it('adjacency 邻接表对称且计数正确', () => {
    const adj = adjacency(K3)
    expect(adj[0].sort()).toEqual([1, 2])
    expect(adj.every((a) => a.length === 2)).toBe(true)
  })

  it('SAMPLE_GRAPHS 的色数不超过节点数', () => {
    for (const s of SAMPLE_GRAPHS) {
      const { k } = chromaticNumber(s.graph)
      expect(k).toBeGreaterThanOrEqual(1)
      expect(k).toBeLessThanOrEqual(s.graph.nodes.length)
    }
  })
})
