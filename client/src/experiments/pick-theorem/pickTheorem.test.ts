import { describe, it, expect } from 'vitest'
import {
  gcd,
  shoelaceArea,
  boundaryPoints,
  interiorPoints,
  pickArea,
  PRESET_POLYGONS,
  type Point,
} from './pickTheorem'

describe('皮克定理', () => {
  it('gcd 计算正确', () => {
    expect(gcd(6, 4)).toBe(2)
    expect(gcd(7, 0)).toBe(7)
    expect(gcd(-12, 8)).toBe(4)
  })

  it('shoelaceArea 单位正方形面积为 1', () => {
    const sq: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]
    expect(shoelaceArea(sq)).toBe(1)
  })

  it('boundaryPoints 单位正方形边界点数为 4', () => {
    const sq: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]
    expect(boundaryPoints(sq)).toBe(4)
  })

  it('矩形 8x4 内部格点数正确', () => {
    // 顶点 (0,0)-(8,0)-(8,4)-(0,4)，面积32，边界2*(8+4)=24，I=32-12+1=21
    const rect: Point[] = [
      { x: 0, y: 0 },
      { x: 8, y: 0 },
      { x: 8, y: 4 },
      { x: 0, y: 4 },
    ]
    expect(shoelaceArea(rect)).toBe(32)
    expect(boundaryPoints(rect)).toBe(24)
    expect(interiorPoints(rect)).toBe(21)
  })

  it('斜边三角形 gcd 计入边界点', () => {
    // (0,0)-(4,0)-(0,4)，斜边 gcd(4,4)=4，B=4+4+4=12，A=8，I=8-6+1=3
    const tri: Point[] = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
    ]
    expect(boundaryPoints(tri)).toBe(12)
    expect(shoelaceArea(tri)).toBe(8)
    expect(interiorPoints(tri)).toBe(3)
  })

  it('皮克公式与鞋带面积一致（所有预设）', () => {
    for (const p of PRESET_POLYGONS) {
      const a = shoelaceArea(p.vertices)
      const b = pickArea(p.vertices)
      expect(b).toBeCloseTo(a, 9)
    }
  })

  it('预设多边形内部格点数为非负整数', () => {
    for (const p of PRESET_POLYGONS) {
      const I = interiorPoints(p.vertices)
      expect(I).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(I)).toBe(true)
    }
  })
})
