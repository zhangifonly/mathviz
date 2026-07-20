import { describe, it, expect } from 'vitest'
import { tent, iterate, cobwebPath, MU_VALUES } from './tentMap'

describe('帐篷映射', () => {
  it('tent 分段线性：顶点在 x=0.5 处取到 mu/2', () => {
    expect(tent(0, 2)).toBe(0)
    expect(tent(0.5, 2)).toBe(1)
    expect(tent(1, 2)).toBe(0)
    expect(tent(0.25, 2)).toBe(0.5)
    expect(tent(0.75, 2)).toBeCloseTo(0.5, 12)
  })

  it('tent 关于 x=0.5 对称', () => {
    for (const x of [0.1, 0.2, 0.3, 0.4]) {
      expect(tent(x, 1.5)).toBeCloseTo(tent(1 - x, 1.5), 12)
    }
  })

  it('mu=2 时把 [0,1] 映到 [0,1]（满混沌不越界）', () => {
    for (let i = 0; i <= 20; i++) {
      const x = i / 20
      const y = tent(x, 2)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(1 + 1e-12)
    }
  })

  it('iterate 序列长度为 n+1 且首项是起点', () => {
    const seq = iterate(0.3, 2, 10)
    expect(seq.length).toBe(11)
    expect(seq[0]).toBe(0.3)
    for (const v of seq) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1 + 1e-9)
    }
  })

  it('固定点 x=0 保持为 0', () => {
    const seq = iterate(0, 2, 5)
    expect(seq.every((v) => v === 0)).toBe(true)
  })

  it('cobwebPath 顶点数正确且在曲线与对角线间弹跳', () => {
    const pts = cobwebPath(0.2, 2, 3)
    // 起点 + 每步 2 个点
    expect(pts.length).toBe(1 + 3 * 2)
    expect(pts[0]).toEqual([0.2, 0])
    // 第二个点落在曲线上：y == tent(x)
    expect(pts[1][1]).toBeCloseTo(tent(pts[1][0], 2), 12)
    // 第三个点在对角线上：x == y
    expect(pts[2][0]).toBeCloseTo(pts[2][1], 12)
  })

  it('MU_VALUES 每个取值迭代都不越界', () => {
    for (const mu of MU_VALUES) {
      const seq = iterate(0.37, mu, 30)
      expect(seq.length).toBe(31)
      expect(Math.max(...seq)).toBeLessThanOrEqual(1 + 1e-9)
    }
  })
})
