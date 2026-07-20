import { describe, it, expect } from 'vitest'
import {
  removeMiddleThird,
  cantorSegments,
  segmentCount,
  remainingLength,
  cantorDimension,
  LEVELS,
} from './cantorSet'

describe('康托三分集', () => {
  it('removeMiddleThird 挖去中间三分之一', () => {
    const parts = removeMiddleThird({ start: 0, end: 1 })
    expect(parts.length).toBe(2)
    expect(parts[0].start).toBeCloseTo(0, 10)
    expect(parts[0].end).toBeCloseTo(1 / 3, 10)
    expect(parts[1].start).toBeCloseTo(2 / 3, 10)
    expect(parts[1].end).toBeCloseTo(1, 10)
  })

  it('cantorSegments 第 0 层是整段 [0,1]', () => {
    expect(cantorSegments(0)).toEqual([{ start: 0, end: 1 }])
  })

  it('cantorSegments 第 n 层有 2^n 段', () => {
    for (let n = 0; n <= 6; n++) {
      expect(cantorSegments(n).length).toBe(2 ** n)
      expect(segmentCount(n)).toBe(2 ** n)
    }
  })

  it('第 n 层每段长度都是 (1/3)^n，总长为 (2/3)^n', () => {
    for (let n = 0; n <= 5; n++) {
      const segs = cantorSegments(n)
      let total = 0
      for (const s of segs) {
        expect(s.end - s.start).toBeCloseTo((1 / 3) ** n, 10)
        total += s.end - s.start
      }
      expect(total).toBeCloseTo(remainingLength(n), 10)
    }
  })

  it('剩余总长度随层数递减且趋于零', () => {
    expect(remainingLength(0)).toBe(1)
    expect(remainingLength(1)).toBeCloseTo(2 / 3, 10)
    expect(remainingLength(10)).toBeLessThan(0.02)
  })

  it('区间保持有序且落在 [0,1] 内', () => {
    const segs = cantorSegments(4)
    let prevEnd = 0
    for (const s of segs) {
      expect(s.start).toBeGreaterThanOrEqual(0)
      expect(s.end).toBeLessThanOrEqual(1)
      expect(s.start).toBeGreaterThanOrEqual(prevEnd - 1e-9)
      expect(s.end).toBeGreaterThan(s.start)
      prevEnd = s.end
    }
  })

  it('cantorDimension 约为 0.6309', () => {
    expect(cantorDimension()).toBeCloseTo(0.6309, 3)
  })

  it('LEVELS 都能正常生成', () => {
    for (const n of LEVELS) {
      expect(cantorSegments(n).length).toBe(2 ** n)
    }
  })
})
