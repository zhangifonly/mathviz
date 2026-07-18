import { describe, it, expect } from 'vitest'
import {
  straightPath, arcPath, cycloidPath, cycloidParams, descentTime, buildPath, PATHS,
} from './brachistochrone'

describe('最速降线', () => {
  const bx = 300
  const by = 200

  it('各路径起点为 A(0,0)、终点为 B(bx,by)', () => {
    for (const kind of PATHS) {
      const p = buildPath(kind, bx, by)
      expect(p[0].x).toBeCloseTo(0, 3)
      expect(p[0].y).toBeCloseTo(0, 3)
      expect(p[p.length - 1].x).toBeCloseTo(bx, 1)
      expect(p[p.length - 1].y).toBeCloseTo(by, 1)
    }
  })

  it('直线路径共线', () => {
    const p = straightPath(bx, by, 10)
    // 用叉积判断各点与 AB 共线（叉积近 0）
    for (const pt of p) expect(pt.x * by - pt.y * bx).toBeCloseTo(0, 6)
  })

  it('cycloidParams 满足比值方程', () => {
    const { R, thetaEnd } = cycloidParams(bx, by)
    expect(R * (thetaEnd - Math.sin(thetaEnd))).toBeCloseTo(bx, 2)
    expect(R * (1 - Math.cos(thetaEnd))).toBeCloseTo(by, 2)
  })

  it('摆线下滑时间最短（快于直线与圆弧）', () => {
    const tCyc = descentTime(cycloidPath(bx, by))
    const tStr = descentTime(straightPath(bx, by))
    const tArc = descentTime(arcPath(bx, by))
    expect(tCyc).toBeLessThan(tStr)
    expect(tCyc).toBeLessThanOrEqual(tArc + 1e-9)
  })

  it('圆弧不慢于直线', () => {
    expect(descentTime(arcPath(bx, by))).toBeLessThanOrEqual(descentTime(straightPath(bx, by)) + 1e-9)
  })

  it('下滑时间为正有限值', () => {
    for (const kind of PATHS) {
      const t = descentTime(buildPath(kind, bx, by))
      expect(t).toBeGreaterThan(0)
      expect(Number.isFinite(t)).toBe(true)
    }
  })

  it('PATHS 都能生成指定点数', () => {
    for (const kind of PATHS) expect(buildPath(kind, bx, by, 50).length).toBe(51)
  })
})
