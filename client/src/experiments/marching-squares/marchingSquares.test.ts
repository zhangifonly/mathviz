import { describe, it, expect } from 'vitest'
import {
  makeField,
  cellCase,
  marchingSquares,
  EDGE_TABLE,
  THRESHOLDS,
  type Field,
} from './marchingSquares'

describe('行进方块', () => {
  it('makeField 生成指定尺寸网格，值非负', () => {
    const f = makeField(20, 16)
    expect(f.length).toBe(16)
    expect(f[0].length).toBe(20)
    for (const row of f) for (const v of row) expect(v).toBeGreaterThanOrEqual(0)
  })

  it('cellCase 位编码正确', () => {
    // 全部低于阈值 => 0
    expect(cellCase(0, 0, 0, 0, 1)).toBe(0)
    // 全部高于阈值 => 15
    expect(cellCase(2, 2, 2, 2, 1)).toBe(15)
    // 仅 TL(bit3) => 8
    expect(cellCase(2, 0, 0, 0, 1)).toBe(8)
    // 仅 BL(bit0) => 1
    expect(cellCase(0, 0, 0, 2, 1)).toBe(1)
  })

  it('EDGE_TABLE 有 16 项，且 case 0 与 15 无线段', () => {
    expect(EDGE_TABLE.length).toBe(16)
    expect(EDGE_TABLE[0]).toEqual([])
    expect(EDGE_TABLE[15]).toEqual([])
  })

  it('全同值网格不产生等高线', () => {
    const flat: Field = Array.from({ length: 5 }, () => Array(5).fill(0.5))
    expect(marchingSquares(flat, 0.3).length).toBe(0)
    expect(marchingSquares(flat, 0.7).length).toBe(0)
  })

  it('单个高角单元产生一条线段，交点落在阈值处', () => {
    // 2x2：仅左下角为 1，其余 0，阈值 0.5 => case 1
    const f: Field = [
      [0, 0],
      [1, 0],
    ]
    const segs = marchingSquares(f, 0.5)
    expect(segs.length).toBe(1)
    const s = segs[0]
    // 交点应在下边(y=1,x=0.5)与左边(x=0,y=0.5)之间
    const xs = [s.x1, s.x2].sort()
    expect(xs[0]).toBeCloseTo(0, 5)
    expect(xs[1]).toBeCloseTo(0.5, 5)
  })

  it('高斯场在合理阈值下能提取到闭合等高线（线段数量 > 0）', () => {
    const f = makeField(40, 40)
    for (const t of THRESHOLDS) {
      const segs = marchingSquares(f, t)
      expect(segs.length).toBeGreaterThan(0)
    }
  })

  it('阈值越高等高线越靠近峰顶，线段更少', () => {
    const f = makeField(60, 60)
    const low = marchingSquares(f, 0.25).length
    const high = marchingSquares(f, 0.85).length
    expect(high).toBeLessThan(low)
  })
})
