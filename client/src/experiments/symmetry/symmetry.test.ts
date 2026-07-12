import { describe, it, expect } from 'vitest'
import {
  rotatePoint,
  reflectPoint,
  pointRadius,
  symmetryCopyCount,
  petalMotif,
  buildSymmetricPattern,
  SYMMETRY_OPTIONS,
  type Point,
} from './symmetry'

const near = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps

describe('对称之美内核', () => {
  it('旋转 0 弧度不改变点', () => {
    const p: Point = { x: 3, y: 4 }
    const r = rotatePoint(p, 0)
    expect(near(r.x, 3)).toBe(true)
    expect(near(r.y, 4)).toBe(true)
  })

  it('旋转 90 度：(1,0) → (0,1)', () => {
    const r = rotatePoint({ x: 1, y: 0 }, Math.PI / 2)
    expect(near(r.x, 0)).toBe(true)
    expect(near(r.y, 1)).toBe(true)
  })

  it('旋转保持到原点距离不变', () => {
    const p: Point = { x: 2, y: -5 }
    const r = rotatePoint(p, 1.234)
    expect(near(pointRadius(r), pointRadius(p))).toBe(true)
  })

  it('镜像翻折两次回到原点', () => {
    const p: Point = { x: 7, y: -2 }
    const back = reflectPoint(reflectPoint(p))
    expect(near(back.x, p.x)).toBe(true)
    expect(near(back.y, p.y)).toBe(true)
  })

  it('镜像只改变 x 符号，保持距离', () => {
    const p: Point = { x: 3, y: 4 }
    const m = reflectPoint(p)
    expect(m.x).toBe(-3)
    expect(m.y).toBe(4)
    expect(near(pointRadius(m), pointRadius(p))).toBe(true)
  })

  it('拷贝数量：纯旋转为 n，含镜像为 2n', () => {
    expect(symmetryCopyCount(6, false)).toBe(6)
    expect(symmetryCopyCount(6, true)).toBe(12)
    expect(symmetryCopyCount(1, true)).toBe(2)
  })

  it('petalMotif 点数为 samples+1 且全为有限值', () => {
    const m = petalMotif(20)
    expect(m.length).toBe(21)
    for (const p of m) {
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Number.isFinite(p.y)).toBe(true)
    }
  })

  it('buildSymmetricPattern 拷贝数与 symmetryCopyCount 一致', () => {
    const motif = petalMotif(8)
    const rot = buildSymmetricPattern(motif, 5, false)
    expect(rot.length).toBe(5)
    const dih = buildSymmetricPattern(motif, 5, true)
    expect(dih.length).toBe(10)
  })

  it('旋转 n 重图案：第 k 份相对第 0 份恰好转了 2πk/n', () => {
    const motif: Point[] = [{ x: 1, y: 0 }]
    const copies = buildSymmetricPattern(motif, 4, false)
    // 第 1 份应为 (1,0) 转 90 度 → (0,1)
    expect(near(copies[1][0].x, 0)).toBe(true)
    expect(near(copies[1][0].y, 1)).toBe(true)
  })

  it('SYMMETRY_OPTIONS 有效：order≥1，id 唯一', () => {
    const ids = new Set<string>()
    for (const o of SYMMETRY_OPTIONS) {
      expect(o.order).toBeGreaterThanOrEqual(1)
      expect(typeof o.mirror).toBe('boolean')
      expect(o.label.length).toBeGreaterThan(0)
      ids.add(o.id)
    }
    expect(ids.size).toBe(SYMMETRY_OPTIONS.length)
  })
})
