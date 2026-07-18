import { describe, it, expect } from 'vitest'
import {
  dijkstra,
  shortestPath,
  buildAdjacency,
  SAMPLE_GRAPH,
  SOURCE_NODES,
} from './dijkstra'

describe('Dijkstra 最短路', () => {
  it('buildAdjacency 生成无向邻接表，度数与边数吻合', () => {
    const adj = buildAdjacency(SAMPLE_GRAPH)
    expect(adj.length).toBe(SAMPLE_GRAPH.nodes.length)
    const totalDegree = adj.reduce((s, list) => s + list.length, 0)
    expect(totalDegree).toBe(SAMPLE_GRAPH.edges.length * 2)
  })

  it('源点到自身距离为 0，前驱为 -1', () => {
    const { dist, prev } = dijkstra(SAMPLE_GRAPH, 0)
    expect(dist[0]).toBe(0)
    expect(prev[0]).toBe(-1)
  })

  it('从 A 出发计算出正确的最短距离', () => {
    // A-C(3)-B(2)=5, C(3)-E(6)=9, ...手算验证关键节点
    const { dist } = dijkstra(SAMPLE_GRAPH, 0)
    expect(dist[0]).toBe(0) // A
    expect(dist[2]).toBe(3) // C
    expect(dist[1]).toBe(4) // B 直连更短(4<3+2=5)
    expect(dist[3]).toBe(9) // A-B-D=4+5
    expect(dist[4]).toBe(9) // A-C-E=3+6，比 A-B-D-E=10 更短
  })

  it('shortestPath 重建的路径首为源、尾为目标且连续', () => {
    const source = 0
    const target = 7
    const { prev, dist } = dijkstra(SAMPLE_GRAPH, source)
    const path = shortestPath(prev, target)
    expect(path[0]).toBe(source)
    expect(path[path.length - 1]).toBe(target)
    // 路径总权重应等于 dist[target]
    const adj = buildAdjacency(SAMPLE_GRAPH)
    let sum = 0
    for (let i = 0; i + 1 < path.length; i++) {
      const edge = adj[path[i]].find((e) => e.to === path[i + 1])
      expect(edge).toBeDefined()
      sum += edge!.w
    }
    expect(sum).toBe(dist[target])
  })

  it('order 首个确定节点必为源点，且长度不超过节点数', () => {
    const { order } = dijkstra(SAMPLE_GRAPH, 3)
    expect(order[0]).toBe(3)
    expect(order.length).toBeLessThanOrEqual(SAMPLE_GRAPH.nodes.length)
    // 确定顺序对应距离非递减（贪心不变量）
    const { dist } = dijkstra(SAMPLE_GRAPH, 3)
    for (let i = 0; i + 1 < order.length; i++) {
      expect(dist[order[i]]).toBeLessThanOrEqual(dist[order[i + 1]])
    }
  })

  it('所有预设源点均能连通全部 8 个节点', () => {
    for (const s of SOURCE_NODES) {
      const { dist } = dijkstra(SAMPLE_GRAPH, s)
      for (const d of dist) {
        expect(Number.isFinite(d)).toBe(true)
      }
    }
  })
})
