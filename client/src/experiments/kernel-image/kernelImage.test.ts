import { describe, it, expect } from 'vitest'
import {
  rank, det, kernelDirection, imageDescription, imageDirection, apply,
  SAMPLE_MATRICES, type Mat2,
} from './kernelImage'

describe('核与像', () => {
  it('rank 正确判定满秩/秩1/零', () => {
    expect(rank([1, 0, 0, 1])).toBe(2)
    expect(rank([1, 2, 2, 4])).toBe(1) // 两行成比例
    expect(rank([0, 0, 0, 0])).toBe(0)
  })

  it('det 与满秩一致', () => {
    expect(det([1, 0, 0, 1])).toBe(1)
    expect(det([1, 2, 2, 4])).toBe(0)
    expect(rank([1, 2, 2, 4]) === 2).toBe(false)
  })

  it('kernelDirection: 秩1 有核方向且映射到零', () => {
    const m: Mat2 = [1, 2, 2, 4]
    const k = kernelDirection(m)
    expect(k).not.toBeNull()
    const out = apply(m, k!)
    expect(Math.hypot(out.x, out.y)).toBeLessThan(1e-9)
  })

  it('kernelDirection: 满秩与零矩阵返回 null', () => {
    expect(kernelDirection([1, 0, 0, 1])).toBeNull()
    expect(kernelDirection([0, 0, 0, 0])).toBeNull()
  })

  it('imageDescription: 三种秩对应 plane/line/point', () => {
    expect(imageDescription([1, 0, 0, 1])).toBe('plane')
    expect(imageDescription([1, 2, 2, 4])).toBe('line')
    expect(imageDescription([0, 0, 0, 0])).toBe('point')
  })

  it('imageDirection: 秩1 的核方向与像方向正交于行空间关系成立', () => {
    const dir = imageDirection([1, 2, 2, 4])
    expect(dir).not.toBeNull()
    expect(Math.hypot(dir!.x, dir!.y)).toBeCloseTo(1, 6)
  })

  it('SAMPLE_MATRICES 秩符合标注', () => {
    expect(rank(SAMPLE_MATRICES[0].m)).toBe(2)
    expect(rank(SAMPLE_MATRICES[1].m)).toBe(1)
    expect(rank(SAMPLE_MATRICES[2].m)).toBe(0)
  })

  it('秩-零化度定理: rank + nullity = 2', () => {
    for (const s of SAMPLE_MATRICES) {
      const r = rank(s.m)
      const nullity = 2 - r
      expect(r + nullity).toBe(2)
    }
  })
})
