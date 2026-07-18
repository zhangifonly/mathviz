import { describe, it, expect } from 'vitest'
import {
  sphere,
  project,
  unproject,
  rotateZ,
  parallel,
  meridian,
  GRID_COUNTS,
} from './stereographicProjection'

describe('球极投影', () => {
  it('sphere 生成的点都在单位球面上', () => {
    for (let i = 0; i < 20; i++) {
      const p = sphere(i * 0.3, (i - 10) * 0.15)
      const r = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z)
      expect(r).toBeCloseTo(1, 6)
    }
  })

  it('南极投到原点，赤道投到单位圆', () => {
    const south = project(sphere(0, -Math.PI / 2))
    expect(south.X).toBeCloseTo(0, 6)
    expect(south.Y).toBeCloseTo(0, 6)
    const eq = project(sphere(0, 0))
    expect(Math.hypot(eq.X, eq.Y)).toBeCloseTo(1, 6)
  })

  it('project 与 unproject 互为逆运算', () => {
    for (let i = 0; i < 15; i++) {
      const p = sphere(i * 0.4 + 0.1, (i - 7) * 0.18)
      const back = unproject(project(p))
      expect(back.x).toBeCloseTo(p.x, 5)
      expect(back.y).toBeCloseTo(p.y, 5)
      expect(back.z).toBeCloseTo(p.z, 5)
    }
  })

  it('unproject 的结果始终落在单位球面上', () => {
    const pts = [
      { X: 0, Y: 0 },
      { X: 2, Y: -1 },
      { X: -3, Y: 5 },
    ]
    for (const q of pts) {
      const p = unproject(q)
      expect(Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z)).toBeCloseTo(1, 6)
    }
  })

  it('rotateZ 保持模长且旋转 0 弧度不变', () => {
    const p = sphere(1.2, 0.5)
    const same = rotateZ(p, 0)
    expect(same.x).toBeCloseTo(p.x, 6)
    expect(same.y).toBeCloseTo(p.y, 6)
    const rot = rotateZ(p, Math.PI / 3)
    expect(Math.sqrt(rot.x * rot.x + rot.y * rot.y + rot.z * rot.z)).toBeCloseTo(1, 6)
  })

  it('parallel/meridian 采样数量正确且在球面上', () => {
    const par = parallel(0.3, 32)
    expect(par.length).toBe(33)
    const mer = meridian(0.7, 24)
    expect(mer.length).toBe(25)
    for (const p of [...par, ...mer]) {
      expect(Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z)).toBeCloseTo(1, 6)
    }
  })

  it('GRID_COUNTS 都是正整数', () => {
    for (const n of GRID_COUNTS) {
      expect(Number.isInteger(n)).toBe(true)
      expect(n).toBeGreaterThan(0)
    }
  })
})
