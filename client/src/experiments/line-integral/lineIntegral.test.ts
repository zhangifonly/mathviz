import { describe, it, expect } from 'vitest'
import {
  FIELDS, PATHS, dot, mag, workDensity,
  lineIntegral2, lineIntegral1, samplePath, getField, getPath,
} from './lineIntegral'

describe('曲线积分', () => {
  it('dot / mag 计算正确', () => {
    expect(dot({ x: 1, y: 2 }, { x: 3, y: 4 })).toBe(11)
    expect(mag({ x: 3, y: 4 })).toBe(5)
  })

  it('FIELDS 与 PATHS 常量结构完整', () => {
    expect(FIELDS.length).toBeGreaterThanOrEqual(3)
    expect(PATHS.length).toBeGreaterThanOrEqual(3)
    for (const f of FIELDS) expect(typeof f.f(1, 1).x).toBe('number')
    for (const p of PATHS) expect(p.t1).toBeGreaterThan(p.t0)
  })

  it('匀强场沿直线做功 = F·位移（解析可验证）', () => {
    const field = getField('uniform')
    const path = getPath('line')
    // 位移 = (4, 2.4)，F=(0.9,0.4)，功 = 0.9*4 + 0.4*2.4 = 4.56
    const w = lineIntegral2(field, path, 200)
    expect(w).toBeCloseTo(4.56, 4)
  })

  it('旋转场沿闭合半圆弧的功为正（切向同向）', () => {
    const field = getField('rotation')
    const path = getPath('arc')
    // F=(-y,x) 沿逆时针圆弧，F·r' = 2^2 = 4 恒定，积分 = 4π
    const w = lineIntegral2(field, path, 400)
    expect(w).toBeCloseTo(4 * Math.PI, 2)
  })

  it('径向场沿旋转场同一圆弧做功为 0（正交）', () => {
    const field = getField('radial')
    const path = getPath('arc')
    // 径向场处处指向外，与圆弧切向垂直，功应约等于 0
    const w = lineIntegral2(field, path, 400)
    expect(Math.abs(w)).toBeLessThan(1e-6)
  })

  it('第一类积分非负，且加密网格收敛稳定', () => {
    const field = getField('rotation')
    const path = getPath('parabola')
    const a = lineIntegral1(field, path, 120)
    const b = lineIntegral1(field, path, 480)
    expect(a).toBeGreaterThan(0)
    expect(Math.abs(a - b)).toBeLessThan(0.05)
  })

  it('samplePath 返回 n+1 个点且首尾对应端点', () => {
    const path = getPath('line')
    const pts = samplePath(path, 40)
    expect(pts.length).toBe(41)
    expect(pts[0]).toEqual(path.r(path.t0))
    expect(pts[40].x).toBeCloseTo(path.r(path.t1).x, 6)
  })

  it('workDensity 与手工点乘一致', () => {
    const field = getField('rotation')
    const path = getPath('line')
    const t = 0.5
    const p = path.r(t)
    const expected = dot(field.f(p.x, p.y), path.dr(t))
    expect(workDensity(field, path, t)).toBeCloseTo(expected, 10)
  })
})
