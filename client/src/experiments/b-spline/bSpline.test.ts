import { describe, it, expect } from 'vitest'
import {
  uniformKnots, findSpan, deBoor, bsplineCurve, basisFunction,
  CONTROL_POINTS, DEGREE, type Point,
} from './bSpline'

describe('B样条曲线', () => {
  it('uniformKnots 长度为 n+degree+1 且两端各重复 degree+1 次', () => {
    const n = 6
    const k = uniformKnots(n, DEGREE)
    expect(k.length).toBe(n + DEGREE + 1)
    expect(k.slice(0, DEGREE + 1)).toEqual([0, 0, 0, 0])
    const last = k[k.length - 1]
    expect(k.slice(n).every((v) => v === last)).toBe(true)
  })

  it('节点向量非递减', () => {
    const k = uniformKnots(8, DEGREE)
    for (let i = 1; i < k.length; i++) {
      expect(k[i]).toBeGreaterThanOrEqual(k[i - 1])
    }
  })

  it('bsplineCurve 采样点数为 samples+1', () => {
    const curve = bsplineCurve(CONTROL_POINTS, DEGREE, 100)
    expect(curve.length).toBe(101)
    for (const p of curve) {
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Number.isFinite(p.y)).toBe(true)
    }
  })

  it('clamped 端点：曲线起点终点与首末控制点重合', () => {
    const curve = bsplineCurve(CONTROL_POINTS, DEGREE, 200)
    const first = CONTROL_POINTS[0]
    const last = CONTROL_POINTS[CONTROL_POINTS.length - 1]
    expect(curve[0].x).toBeCloseTo(first.x, 1)
    expect(curve[0].y).toBeCloseTo(first.y, 1)
    expect(curve[curve.length - 1].x).toBeCloseTo(last.x, 0)
    expect(curve[curve.length - 1].y).toBeCloseTo(last.y, 0)
  })

  it('局部支撑：移动一个内部控制点，远端曲线点不变', () => {
    const base = bsplineCurve(CONTROL_POINTS, DEGREE, 120)
    const moved: Point[] = CONTROL_POINTS.map((p, i) =>
      i === 1 ? { x: p.x, y: p.y - 200 } : { ...p },
    )
    const after = bsplineCurve(moved, DEGREE, 120)
    // 起点附近(非端点)受影响
    expect(after[8].y).not.toBeCloseTo(base[8].y, 5)
    // 末端点不受影响
    const n = base.length - 1
    expect(after[n].x).toBeCloseTo(base[n].x, 6)
    expect(after[n].y).toBeCloseTo(base[n].y, 6)
  })

  it('基函数单位分解：各基函数之和在定义域内约为 1', () => {
    const n = CONTROL_POINTS.length
    const knots = uniformKnots(n, DEGREE)
    const u = 1.5
    let sum = 0
    for (let i = 0; i < n; i++) sum += basisFunction(i, DEGREE, knots, u)
    expect(sum).toBeCloseTo(1, 6)
  })

  it('findSpan 返回合法区间下标', () => {
    const n = CONTROL_POINTS.length
    const knots = uniformKnots(n, DEGREE)
    const k = findSpan(knots, DEGREE, n, 1.2)
    expect(k).toBeGreaterThanOrEqual(DEGREE)
    expect(k).toBeLessThanOrEqual(n - 1)
  })

  it('deBoor 在端点处等于对应控制点', () => {
    const n = CONTROL_POINTS.length
    const knots = uniformKnots(n, DEGREE)
    const p0 = deBoor(CONTROL_POINTS, DEGREE, knots, 0)
    expect(p0.x).toBeCloseTo(CONTROL_POINTS[0].x, 6)
    expect(p0.y).toBeCloseTo(CONTROL_POINTS[0].y, 6)
  })
})
