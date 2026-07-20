import { describe, it, expect } from 'vitest'
import { modeShape, standingWave, sampleString, modeNodes, decompose, MODES } from './vibratingString'

const L = 1
const c = 1

describe('弦振动', () => {
  it('modeShape: 两端固定点位移恒为零', () => {
    for (let n = 1; n <= 4; n++) {
      for (const t of [0, 0.3, 0.7, 1.2]) {
        expect(Math.abs(modeShape(n, 0, t, L, c))).toBeLessThan(1e-12)
        expect(Math.abs(modeShape(n, L, t, L, c))).toBeLessThan(1e-12)
      }
    }
  })

  it('modeShape: t=0 时基频在中点取最大值 1', () => {
    expect(modeShape(1, L / 2, 0, L, c)).toBeCloseTo(1, 10)
  })

  it('standingWave: 空模态列表处处为零', () => {
    expect(standingWave([], 0.5, 0.5, L, c)).toBe(0)
  })

  it('standingWave: 线性叠加成立', () => {
    const modes = [{ n: 1, amp: 2 }, { n: 3, amp: -1 }]
    const x = 0.37
    const t = 0.21
    const manual = 2 * modeShape(1, x, t, L, c) - 1 * modeShape(3, x, t, L, c)
    expect(standingWave(modes, x, t, L, c)).toBeCloseTo(manual, 12)
  })

  it('sampleString: 采样点数量与端点位移正确', () => {
    const pts = sampleString([{ n: 2, amp: 1 }], 20, 0, L, c)
    expect(pts.length).toBe(21)
    expect(pts[0].x).toBe(0)
    expect(pts[pts.length - 1].x).toBeCloseTo(L, 12)
    expect(Math.abs(pts[0].y)).toBeLessThan(1e-12)
    expect(Math.abs(pts[pts.length - 1].y)).toBeLessThan(1e-12)
  })

  it('modeNodes: 第 n 阶有 n-1 个内部节点且均匀分布', () => {
    expect(modeNodes(1, L)).toEqual([])
    expect(modeNodes(3, L).length).toBe(2)
    const nodes = modeNodes(4, L)
    expect(nodes[0]).toBeCloseTo(0.25, 12)
    expect(nodes[1]).toBeCloseTo(0.5, 12)
    expect(nodes[2]).toBeCloseTo(0.75, 12)
  })

  it('decompose: 纯正弦初始形状还原出对应模态', () => {
    const f = (x: number) => Math.sin((2 * Math.PI * x) / L)
    const modes = decompose(f, 4, L, 400)
    expect(modes[1].amp).toBeCloseTo(1, 2)
    expect(Math.abs(modes[0].amp)).toBeLessThan(1e-2)
    expect(Math.abs(modes[2].amp)).toBeLessThan(1e-2)
  })

  it('MODES 常量为基频与前两个泛音', () => {
    expect(MODES).toEqual([1, 2, 3])
  })
})
