import { describe, it, expect } from 'vitest'
import { maxFlow, bfsAugment, SAMPLE_NETWORK, type FlowNetwork } from './networkFlow'

describe('最大流最小割', () => {
  it('SAMPLE_NETWORK 的最大流值为 22', () => {
    const r = maxFlow(SAMPLE_NETWORK)
    expect(r.value).toBe(22)
  })

  it('最大流等于最小割容量（最大流最小割定理）', () => {
    const r = maxFlow(SAMPLE_NETWORK)
    const cutCap = r.minCutEdges.reduce((s, i) => s + SAMPLE_NETWORK.edges[i].capacity, 0)
    expect(cutCap).toBe(r.value)
  })

  it('每条边流量不超过容量且非负', () => {
    const r = maxFlow(SAMPLE_NETWORK)
    r.flow.forEach((f, i) => {
      expect(f).toBeGreaterThanOrEqual(0)
      expect(f).toBeLessThanOrEqual(SAMPLE_NETWORK.edges[i].capacity)
    })
  })

  it('每个中间节点流入等于流出（流量守恒）', () => {
    const r = maxFlow(SAMPLE_NETWORK)
    const { nodes, edges, source, sink } = SAMPLE_NETWORK
    for (const node of nodes) {
      if (node.id === source || node.id === sink) continue
      let inFlow = 0
      let outFlow = 0
      edges.forEach((e, i) => {
        if (e.to === node.id) inFlow += r.flow[i]
        if (e.from === node.id) outFlow += r.flow[i]
      })
      expect(inFlow).toBe(outFlow)
    }
  })

  it('最小割集合含源、不含汇，源可达', () => {
    const r = maxFlow(SAMPLE_NETWORK)
    expect(r.minCutSet).toContain(SAMPLE_NETWORK.source)
    expect(r.minCutSet).not.toContain(SAMPLE_NETWORK.sink)
  })

  it('bfsAugment 在无路时返回 null', () => {
    const res = [
      [0, 0],
      [0, 0],
    ]
    expect(bfsAugment(res, 0, 1)).toBeNull()
    expect(bfsAugment([[0, 5], [0, 0]], 0, 1)).not.toBeNull()
  })

  it('简单串联网络瓶颈决定最大流', () => {
    const net: FlowNetwork = {
      nodes: [
        { id: 0, x: 0, y: 0, label: 'S' },
        { id: 1, x: 1, y: 0, label: 'M' },
        { id: 2, x: 2, y: 0, label: 'T' },
      ],
      edges: [
        { from: 0, to: 1, capacity: 3 },
        { from: 1, to: 2, capacity: 5 },
      ],
      source: 0,
      sink: 2,
    }
    expect(maxFlow(net).value).toBe(3)
  })
})
