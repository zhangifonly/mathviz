import { describe, it, expect } from 'vitest'
import {
  applyMatrix,
  multiplyMatrix,
  determinant,
  rotationMatrix,
  lerpMatrix,
  IDENTITY,
  TRANSFORM_OPTIONS,
  type Mat2,
} from './matrixTransform'

describe('2x2 矩阵变换', () => {
  it('恒等矩阵不改变向量', () => {
    const v = { x: 3, y: -5 }
    expect(applyMatrix(IDENTITY, v)).toEqual(v)
  })

  it('applyMatrix 计算正确', () => {
    const m: Mat2 = [1, 2, 3, 4]
    expect(applyMatrix(m, { x: 1, y: 1 })).toEqual({ x: 3, y: 7 })
  })

  it('旋转 90° 把 (1,0) 送到 (0,1)', () => {
    const r = rotationMatrix(90)
    const out = applyMatrix(r, { x: 1, y: 0 })
    expect(out.x).toBeCloseTo(0, 10)
    expect(out.y).toBeCloseTo(1, 10)
  })

  it('旋转 360° 等于恒等（作用后向量不变）', () => {
    const r = rotationMatrix(360)
    const out = applyMatrix(r, { x: 2, y: 3 })
    expect(out.x).toBeCloseTo(2, 10)
    expect(out.y).toBeCloseTo(3, 10)
  })

  it('矩阵乘法：恒等矩阵是乘法单位元', () => {
    const m: Mat2 = [2, 1, -1, 3]
    expect(multiplyMatrix(IDENTITY, m)).toEqual(m)
    expect(multiplyMatrix(m, IDENTITY)).toEqual(m)
  })

  it('行列式恒等式 det(AB)=det(A)det(B)', () => {
    const a: Mat2 = [1, 2, 3, 4]
    const b: Mat2 = [2, 0, 1, 2]
    expect(determinant(multiplyMatrix(a, b))).toBeCloseTo(
      determinant(a) * determinant(b),
      10,
    )
  })

  it('旋转矩阵行列式恒为 1', () => {
    for (const deg of [0, 30, 90, 137, 270]) {
      expect(determinant(rotationMatrix(deg))).toBeCloseTo(1, 10)
    }
  })

  it('翻转矩阵行列式为 -1，奇异矩阵为 0', () => {
    expect(determinant([1, 0, 0, -1])).toBe(-1)
    expect(determinant([1, 1, 1, 1])).toBe(0)
  })

  it('lerpMatrix 端点与截断', () => {
    const to: Mat2 = [2, 0, 0, 2]
    expect(lerpMatrix(IDENTITY, to, 0)).toEqual(IDENTITY)
    expect(lerpMatrix(IDENTITY, to, 1)).toEqual(to)
    expect(lerpMatrix(IDENTITY, to, 0.5)).toEqual([1.5, 0, 0, 1.5])
    // 越界被截断到 [0,1]
    expect(lerpMatrix(IDENTITY, to, 2)).toEqual(to)
    expect(lerpMatrix(IDENTITY, to, -1)).toEqual(IDENTITY)
  })

  it('TRANSFORM_OPTIONS 有效且 id 唯一', () => {
    expect(TRANSFORM_OPTIONS.length).toBeGreaterThanOrEqual(4)
    const ids = new Set<string>()
    for (const opt of TRANSFORM_OPTIONS) {
      expect(opt.matrix).toHaveLength(4)
      expect(opt.label.length).toBeGreaterThan(0)
      expect(Number.isFinite(determinant(opt.matrix))).toBe(true)
      ids.add(opt.id)
    }
    expect(ids.size).toBe(TRANSFORM_OPTIONS.length)
  })

  it('预设 note 与行列式一致（抽查放大与奇异）', () => {
    const scale = TRANSFORM_OPTIONS.find((o) => o.id === 'scale')!
    expect(determinant(scale.matrix)).toBeCloseTo(4, 10)
    const squash = TRANSFORM_OPTIONS.find((o) => o.id === 'squash')!
    expect(determinant(squash.matrix)).toBe(0)
  })
})
