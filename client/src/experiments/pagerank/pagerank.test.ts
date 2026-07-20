import { describe, it, expect } from 'vitest'
import { pagerank, outDegrees, rankSum, WEB_GRAPH, DAMPING_OPTIONS } from './pagerank'

describe('PageRank', () => {
  it('outDegrees 统计出度正确', () => {
    const deg = outDegrees(WEB_GRAPH)
    expect(deg.length).toBe(WEB_GRAPH.nodes.length)
    // A 有两条出链(A->B, A->C)
    expect(deg[0]).toBe(2)
    // D 只有一条出链(D->E)
    expect(deg[3]).toBe(1)
    // 出度之和 = 边数
    expect(deg.reduce((a, b) => a + b, 0)).toBe(WEB_GRAPH.edges.length)
  })

  it('rank 向量每次迭代都是概率分布(和为1)', () => {
    const { history } = pagerank(WEB_GRAPH, 0.85, 15)
    for (const r of history) {
      expect(rankSum(r)).toBeCloseTo(1, 6)
    }
  })

  it('初始向量为均匀分布', () => {
    const { history } = pagerank(WEB_GRAPH, 0.85, 5)
    const N = WEB_GRAPH.nodes.length
    for (const v of history[0]) expect(v).toBeCloseTo(1 / N, 9)
  })

  it('幂迭代收敛：后期两次迭代差异极小', () => {
    const { history } = pagerank(WEB_GRAPH, 0.85, 40)
    const last = history[history.length - 1]
    const prev = history[history.length - 2]
    let diff = 0
    for (let i = 0; i < last.length; i++) diff += Math.abs(last[i] - prev[i])
    expect(diff).toBeLessThan(1e-6)
  })

  it('所有 rank 非负', () => {
    const { final } = pagerank(WEB_GRAPH, 0.85, 20)
    for (const v of final) expect(v).toBeGreaterThanOrEqual(0)
  })

  it('阻尼因子越大越接近纯链接结构', () => {
    // 极小阻尼时分布接近均匀(teleport 主导)
    const low = pagerank(WEB_GRAPH, 0.1, 30).final
    const N = WEB_GRAPH.nodes.length
    let spread = 0
    for (const v of low) spread += Math.abs(v - 1 / N)
    // 高阻尼时分布更不均匀
    const high = pagerank(WEB_GRAPH, 0.95, 30).final
    let spreadHigh = 0
    for (const v of high) spreadHigh += Math.abs(v - 1 / N)
    expect(spreadHigh).toBeGreaterThan(spread)
  })

  it('DAMPING_OPTIONS 都能正常收敛为概率分布', () => {
    for (const d of DAMPING_OPTIONS) {
      const { final } = pagerank(WEB_GRAPH, d, 30)
      expect(rankSum(final)).toBeCloseTo(1, 6)
    }
  })
})
