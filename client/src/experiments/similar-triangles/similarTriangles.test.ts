import { describe, it, expect } from 'vitest'
import {
  distance,
  sideLengths,
  triangleArea,
  triangleAngles,
  scaleTriangle,
  computeSimilar,
  BASE_TRIANGLE,
  SCALE_OPTIONS,
} from './similarTriangles'

describe('相似三角形数学内核', () => {
  it('distance 计算 3-4-5 直角边', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeCloseTo(5)
  })

  it('直角三角形面积 = 底乘高除以二', () => {
    const rt = [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 0, y: 4 },
    ]
    expect(triangleArea(rt)).toBeCloseTo(12)
  })

  it('三个内角之和为 180 度', () => {
    const [a, b, c] = triangleAngles(BASE_TRIANGLE)
    expect(a + b + c).toBeCloseTo(180)
  })

  it('相似变换保持角度不变', () => {
    const before = triangleAngles(BASE_TRIANGLE)
    const after = triangleAngles(scaleTriangle(BASE_TRIANGLE, 2.5))
    for (let i = 0; i < 3; i++) expect(after[i]).toBeCloseTo(before[i])
  })

  it('对应边之比都等于相似比 k', () => {
    const { baseSides, scaledSides } = computeSimilar(3)
    for (let i = 0; i < 3; i++) {
      expect(scaledSides[i] / baseSides[i]).toBeCloseTo(3)
    }
  })

  it('面积之比等于相似比的平方', () => {
    for (const k of [0.5, 1.5, 2, 3]) {
      const { areaRatio } = computeSimilar(k)
      expect(areaRatio).toBeCloseTo(k * k)
    }
  })

  it('相似比为 1 时两三角形全等（边长面积不变）', () => {
    const { baseSides, scaledSides, areaRatio } = computeSimilar(1)
    for (let i = 0; i < 3; i++) expect(scaledSides[i]).toBeCloseTo(baseSides[i])
    expect(areaRatio).toBeCloseTo(1)
  })

  it('sideLengths 返回三条边且均为正数', () => {
    const s = sideLengths(BASE_TRIANGLE)
    expect(s.length).toBe(3)
    for (const len of s) expect(len).toBeGreaterThan(0)
  })

  it('SCALE_OPTIONS 全部有效，note 与平方关系一致', () => {
    expect(SCALE_OPTIONS.length).toBeGreaterThan(0)
    for (const opt of SCALE_OPTIONS) {
      expect(opt.k).toBeGreaterThan(0)
      expect(opt.label.length).toBeGreaterThan(0)
      const { areaRatio } = computeSimilar(opt.k)
      expect(areaRatio).toBeCloseTo(opt.k * opt.k)
    }
  })
})
