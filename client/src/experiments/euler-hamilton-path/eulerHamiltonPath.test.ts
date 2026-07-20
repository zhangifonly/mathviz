import { describe, it, expect } from 'vitest'
import {
  degrees,
  edgesConnected,
  classifyEuler,
  hasEulerPath,
  findEulerPath,
  findHamiltonCircuit,
  SAMPLE_GRAPHS,
  type Graph,
} from './eulerHamiltonPath'

const square: Graph = SAMPLE_GRAPHS[2].graph // 方形回路，全偶度
const envelope: Graph = SAMPLE_GRAPHS[1].graph // 信封，恰两奇度
const bridges: Graph = SAMPLE_GRAPHS[0].graph // 七桥，四奇度

describe('欧拉与哈密顿回路', () => {
  it('degrees 计算顶点度数，总和为边数两倍', () => {
    const deg = degrees(square)
    expect(deg).toEqual([2, 2, 2, 2])
    const sum = deg.reduce((a, b) => a + b, 0)
    expect(sum).toBe(square.edges.length * 2)
  })

  it('classifyEuler: 方形=回路，信封=路径，七桥=无', () => {
    expect(classifyEuler(square)).toBe('circuit')
    expect(classifyEuler(envelope)).toBe('path')
    expect(classifyEuler(bridges)).toBe('none')
  })

  it('hasEulerPath 与七桥的历史结论一致', () => {
    expect(hasEulerPath(square)).toBe(true)
    expect(hasEulerPath(envelope)).toBe(true)
    expect(hasEulerPath(bridges)).toBe(false)
  })

  it('edgesConnected: 两个不相连的分量返回 false', () => {
    const g: Graph = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 1, y: 0 },
        { id: 'C', x: 0, y: 1 },
        { id: 'D', x: 1, y: 1 },
      ],
      edges: [[0, 1], [2, 3]],
    }
    expect(edgesConnected(g)).toBe(false)
  })

  it('findEulerPath 用尽每条边恰好一次', () => {
    const path = findEulerPath(envelope)
    expect(path.length).toBe(envelope.edges.length + 1)
    // 相邻顶点必须存在对应的边，且每条边只用一次
    const remaining = envelope.edges.map(() => true)
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i]
      const b = path[i + 1]
      const idx = envelope.edges.findIndex(
        (e, j) => remaining[j] && ((e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)),
      )
      expect(idx).toBeGreaterThanOrEqual(0)
      remaining[idx] = false
    }
    expect(remaining.every((r) => r === false)).toBe(true)
  })

  it('findEulerPath 对七桥返回空', () => {
    expect(findEulerPath(bridges)).toEqual([])
  })

  it('findHamiltonCircuit: 方形存在，起止同点且覆盖全部顶点', () => {
    const cyc = findHamiltonCircuit(square)
    expect(cyc.length).toBe(square.nodes.length + 1)
    expect(cyc[0]).toBe(cyc[cyc.length - 1])
    const distinct = new Set(cyc.slice(0, -1))
    expect(distinct.size).toBe(square.nodes.length)
  })
})
