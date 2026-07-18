import { describe, it, expect } from 'vitest'
import {
  hopfMap,
  s2Point,
  inverseHopfCircle,
  stereographic,
  hopfFiber,
  BASE_POINTS,
  FIBER_COUNTS,
  type Vec4,
} from './hopfFibration'

const norm4 = (p: Vec4) => Math.hypot(p[0], p[1], p[2], p[3])

describe('霍普夫纤维化', () => {
  it('hopfMap 输出总在单位球 S2 上', () => {
    const pts: Vec4[] = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0.5, 0.5, 0.5, 0.5],
    ]
    for (const p of pts) {
      const [x, y, z] = hopfMap(p)
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6)
    }
  })

  it('inverseHopfCircle 的每个点都在 S3 上（模长为1）', () => {
    const circle = inverseHopfCircle(Math.PI / 3, 0.7, 24)
    expect(circle.length).toBe(25)
    for (const p of circle) {
      expect(norm4(p)).toBeCloseTo(1, 6)
    }
  })

  it('纤维上每点经 hopfMap 都回到同一个 base 点', () => {
    const theta = Math.PI / 3
    const phi = 1.2
    const base = s2Point(theta, phi)
    const circle = inverseHopfCircle(theta, phi, 16)
    for (const p of circle) {
      const m = hopfMap(p)
      expect(m[0]).toBeCloseTo(base[0], 5)
      expect(m[1]).toBeCloseTo(base[1], 5)
      expect(m[2]).toBeCloseTo(base[2], 5)
    }
  })

  it('stereographic 把 S3 点降到有限的 3D 坐标', () => {
    const v = stereographic([0.6, 0, 0, 0.8])
    expect(v.every((c) => Number.isFinite(c))).toBe(true)
    expect(v[0]).toBeCloseTo(0.6 / (1 - 0.8), 6)
  })

  it('hopfFiber 返回闭合圆（首尾点重合）', () => {
    const fiber = hopfFiber(BASE_POINTS[0], 32)
    expect(fiber.length).toBe(33)
    const a = fiber[0]
    const b = fiber[fiber.length - 1]
    expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeCloseTo(0, 5)
  })

  it('BASE_POINTS 与 FIBER_COUNTS 结构正确', () => {
    expect(BASE_POINTS.length).toBe(6)
    for (const bp of BASE_POINTS) {
      expect(bp.color).toMatch(/^#[0-9a-f]{6}$/i)
    }
    for (const n of FIBER_COUNTS) {
      expect(hopfFiber(BASE_POINTS[0], n).length).toBe(n + 1)
    }
  })
})
