import { describe, it, expect } from 'vitest'
import {
  dot,
  cross,
  cross2d,
  magnitude,
  angleBetween,
  scalarProjection,
  parallelogramArea,
  DOT_CROSS_OPTIONS,
  type Vec3,
} from './dotCrossProduct'

const ex: Vec3 = { x: 1, y: 0, z: 0 }
const ey: Vec3 = { x: 0, y: 1, z: 0 }
const ez: Vec3 = { x: 0, y: 0, z: 1 }

describe('点积与叉积', () => {
  it('点积：对应分量乘积之和', () => {
    expect(dot({ x: 1, y: 2, z: 3 }, { x: 4, y: -5, z: 6 })).toBe(1 * 4 + 2 * -5 + 3 * 6)
  })

  it('点积对垂直向量为 0', () => {
    expect(dot(ex, ey)).toBe(0)
  })

  it('叉积满足右手定则 ex×ey=ez', () => {
    expect(cross(ex, ey)).toEqual(ez)
    expect(cross(ey, ez)).toEqual(ex)
    expect(cross(ez, ex)).toEqual(ey)
  })

  it('叉积反交换：a×b = -(b×a)', () => {
    const a: Vec3 = { x: 3, y: 1, z: 2 }
    const b: Vec3 = { x: -1, y: 4, z: 5 }
    const ab = cross(a, b)
    const ba = cross(b, a)
    expect(ab).toEqual({ x: -ba.x, y: -ba.y, z: -ba.z })
  })

  it('平行向量叉积为零向量', () => {
    expect(cross({ x: 2, y: 4, z: 6 }, { x: 1, y: 2, z: 3 })).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('二维叉积等于三维叉积的 z 分量', () => {
    const a: Vec3 = { x: 3, y: 1, z: 0 }
    const b: Vec3 = { x: 1, y: 2, z: 0 }
    expect(cross2d(a.x, a.y, b.x, b.y)).toBe(cross(a, b).z)
  })

  it('拉格朗日恒等式：|a×b|² + (a·b)² = |a|²|b|²', () => {
    const a: Vec3 = { x: 3, y: 1, z: 2 }
    const b: Vec3 = { x: -1, y: 4, z: 5 }
    const lhs = magnitude(cross(a, b)) ** 2 + dot(a, b) ** 2
    const rhs = magnitude(a) ** 2 * magnitude(b) ** 2
    expect(lhs).toBeCloseTo(rhs, 10)
  })

  it('夹角：垂直=π/2，平行=0', () => {
    expect(angleBetween(ex, ey)).toBeCloseTo(Math.PI / 2, 10)
    expect(angleBetween({ x: 1, y: 1, z: 0 }, { x: 2, y: 2, z: 0 })).toBeCloseTo(0, 6)
  })

  it('夹角对零向量返回 0（不崩）', () => {
    expect(angleBetween({ x: 0, y: 0, z: 0 }, ex)).toBe(0)
  })

  it('标量投影：a 在 b 上的分量', () => {
    // a=(3,4,0) 在 b=(1,0,0) 上投影 = 3
    expect(scalarProjection({ x: 3, y: 4, z: 0 }, { x: 1, y: 0, z: 0 })).toBeCloseTo(3, 10)
    expect(scalarProjection(ex, { x: 0, y: 0, z: 0 })).toBe(0)
  })

  it('平行四边形面积 = |a||b|sinθ', () => {
    const a: Vec3 = { x: 3, y: 0, z: 0 }
    const b: Vec3 = { x: 0, y: 2, z: 0 }
    // 垂直向量，面积 = 3*2 = 6
    expect(parallelogramArea(a, b)).toBeCloseTo(6, 10)
  })

  it('DOT_CROSS_OPTIONS 预设符合各自描述', () => {
    const perp = DOT_CROSS_OPTIONS.find((o) => o.id === 'perpendicular')!
    expect(dot(perp.a, perp.b)).toBe(0)

    const para = DOT_CROSS_OPTIONS.find((o) => o.id === 'parallel')!
    expect(cross(para.a, para.b)).toEqual({ x: 0, y: 0, z: 0 })

    const gen = DOT_CROSS_OPTIONS.find((o) => o.id === 'general')!
    expect(dot(gen.a, gen.b)).not.toBe(0)
    expect(cross(gen.a, gen.b).z).not.toBe(0)

    expect(DOT_CROSS_OPTIONS.length).toBeGreaterThanOrEqual(3)
  })
})
