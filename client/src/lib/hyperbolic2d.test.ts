import { describe, it, expect } from 'vitest'
import {
  hypot2, inDisk, hyperbolicDistance, geodesicThrough, orthogonalityResidual,
  geodesicPath, geodesicTangent, hyperbolicAngle, angleSum,
  angularDefect, triangleArea, triangleSides, cosineRuleResidual,
  pythagoreanResidual, circleCircumference, circleArea,
  euclideanCircumference, euclideanCircleArea, MAX_TRIANGLE_AREA,
  type HPoint, type HTriangle,
} from './hyperbolic2d'

const RIGHT_TRI: HTriangle = {
  A: { x: 0, y: 0 }, B: { x: 0.5, y: 0 }, C: { x: 0, y: 0.5 },
}
const GENERAL_TRI: HTriangle = {
  A: { x: 0.2, y: 0.3 }, B: { x: -0.4, y: 0.1 }, C: { x: 0.1, y: -0.5 },
}

describe('双曲几何 - 圆盘与距离', () => {
  it('圆盘内外判定', () => {
    expect(inDisk({ x: 0, y: 0 })).toBe(true)
    expect(inDisk({ x: 0.9, y: 0 })).toBe(true)
    expect(inDisk({ x: 1, y: 0 })).toBe(false)
    expect(inDisk({ x: 0.8, y: 0.8 })).toBe(false)
  })

  it('原点到自身距离为零', () => {
    expect(hyperbolicDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBeCloseTo(0, 12)
  })

  it('距离对称', () => {
    const pairs: Array<[HPoint, HPoint]> = [
      [{ x: 0.3, y: 0.1 }, { x: -0.2, y: 0.4 }],
      [{ x: 0.5, y: 0.5 }, { x: -0.5, y: 0.3 }],
    ]
    for (const [p, q] of pairs) {
      expect(hyperbolicDistance(p, q)).toBeCloseTo(hyperbolicDistance(q, p), 12)
    }
  })

  it('靠近边界时距离趋于无穷', () => {
    const o = { x: 0, y: 0 }
    const ds = [0.9, 0.99, 0.999, 0.9999].map((r) => hyperbolicDistance(o, { x: r, y: 0 }))
    for (let i = 1; i < ds.length; i++) expect(ds[i]).toBeGreaterThan(ds[i - 1])
    // 到边界的距离是无穷
    expect(hyperbolicDistance(o, { x: 1, y: 0 })).toBe(Infinity)
    expect(ds[ds.length - 1]).toBeGreaterThan(9)
  })

  it('原点到半径 r 处的距离是 2·artanh(r)', () => {
    for (const r of [0.2, 0.5, 0.8, 0.95]) {
      const want = 2 * Math.atanh(r)
      expect(hyperbolicDistance({ x: 0, y: 0 }, { x: r, y: 0 })).toBeCloseTo(want, 9)
    }
  })

  it('三角不等式成立', () => {
    const a = { x: 0.2, y: 0.1 }
    const b = { x: -0.3, y: 0.4 }
    const c = { x: 0.5, y: -0.2 }
    expect(hyperbolicDistance(a, c))
      .toBeLessThanOrEqual(hyperbolicDistance(a, b) + hyperbolicDistance(b, c) + 1e-9)
  })

  it('hypot2 给出欧氏半径', () => {
    expect(hypot2({ x: 3, y: 4 })).toBeCloseTo(5, 12)
  })
})

describe('双曲几何 - 测地线', () => {
  it('测地线精确垂直于边界圆(|c|² − r² = 1)', () => {
    const pairs: Array<[HPoint, HPoint]> = [
      [{ x: 0.3, y: 0.1 }, { x: -0.2, y: 0.4 }],
      [{ x: 0.5, y: 0.5 }, { x: -0.5, y: 0.3 }],
      [{ x: 0.7, y: 0.2 }, { x: 0.2, y: -0.6 }],
      [{ x: 0.1, y: 0.8 }, { x: -0.6, y: -0.1 }],
    ]
    for (const [p, q] of pairs) {
      expect(orthogonalityResidual(geodesicThrough(p, q))).toBeLessThan(1e-12)
    }
  })

  it('过原点的测地线是直径', () => {
    expect(geodesicThrough({ x: 0.1, y: 0 }, { x: -0.6, y: 0 }).kind).toBe('diameter')
    expect(geodesicThrough({ x: 0.2, y: 0.2 }, { x: -0.4, y: -0.4 }).kind).toBe('diameter')
  })

  it('非共线两点的测地线是圆弧', () => {
    expect(geodesicThrough({ x: 0.3, y: 0.1 }, { x: -0.2, y: 0.4 }).kind).toBe('arc')
  })

  it('测地线圆心在圆盘外(垂直条件的推论)', () => {
    const g = geodesicThrough({ x: 0.3, y: 0.1 }, { x: -0.2, y: 0.4 })
    expect(Math.hypot(g.cx, g.cy)).toBeGreaterThan(1)
  })

  it('采样路径的端点正确, 且都在圆盘内', () => {
    const p = { x: 0.6, y: 0.3 }
    const q = { x: -0.5, y: 0.5 }
    const path = geodesicPath(p, q, 40)
    expect(path.length).toBe(41)
    expect(Math.hypot(path[0].x - p.x, path[0].y - p.y)).toBeLessThan(1e-9)
    expect(Math.hypot(path[40].x - q.x, path[40].y - q.y)).toBeLessThan(1e-9)
    for (const pt of path) expect(hypot2(pt)).toBeLessThan(1)
  })

  it('测地线弧比欧氏直线段长(在双曲度量下)', () => {
    const p = { x: 0.6, y: 0.1 }
    const q = { x: -0.6, y: 0.1 }
    // 测地线长度即双曲距离
    const geo = hyperbolicDistance(p, q)
    // 沿欧氏直线走的双曲长度
    let straight = 0
    const N = 400
    for (let i = 1; i <= N; i++) {
      const a = { x: p.x + (q.x - p.x) * ((i - 1) / N), y: p.y + (q.y - p.y) * ((i - 1) / N) }
      const b = { x: p.x + (q.x - p.x) * (i / N), y: p.y + (q.y - p.y) * (i / N) }
      straight += hyperbolicDistance(a, b)
    }
    expect(straight).toBeGreaterThan(geo)
  })

  it('切向量是单位向量', () => {
    const t = geodesicTangent({ x: 0.3, y: 0.2 }, { x: -0.4, y: 0.5 })
    expect(Math.hypot(t.x, t.y)).toBeCloseTo(1, 10)
  })
})

describe('双曲几何 - 三角形与角亏', () => {
  it('内角和严格小于 π', () => {
    for (const t of [RIGHT_TRI, GENERAL_TRI]) {
      expect(angleSum(t)).toBeLessThan(Math.PI)
    }
  })

  it('角亏恒为正, 且精确等于面积', () => {
    for (const t of [RIGHT_TRI, GENERAL_TRI]) {
      expect(angularDefect(t)).toBeGreaterThan(0)
      expect(triangleArea(t)).toBeCloseTo(angularDefect(t), 12)
    }
  })

  it('三角形越大内角和越小', () => {
    const sums = [0.3, 0.5, 0.8, 0.95].map((s) => angleSum({
      A: { x: 0, y: 0 }, B: { x: s, y: 0 }, C: { x: 0, y: s },
    }))
    for (let i = 1; i < sums.length; i++) expect(sums[i]).toBeLessThan(sums[i - 1])
  })

  it('两条正交直径夹出的角恰为 90°', () => {
    const ang = hyperbolicAngle({ x: 0, y: 0 }, { x: 0.5, y: 0 }, { x: 0, y: 0.5 })
    expect(ang).toBeCloseTo(Math.PI / 2, 9)
  })

  it('面积有上界 π, 三角趋于零时逼近它', () => {
    expect(MAX_TRIANGLE_AREA).toBeCloseTo(Math.PI, 12)
    const areas = [0.9, 0.99, 0.999, 0.9999].map((s) => triangleArea({
      A: { x: 0, y: s },
      B: { x: -s * 0.866, y: -s * 0.5 },
      C: { x: s * 0.866, y: -s * 0.5 },
    }))
    for (let i = 1; i < areas.length; i++) {
      expect(areas[i]).toBeGreaterThan(areas[i - 1])
    }
    // 逼近但不超过 π
    for (const a of areas) expect(a).toBeLessThan(Math.PI)
    expect(areas[areas.length - 1]).toBeGreaterThan(3.14)
  })

  it('双曲余弦定理 cosh c = cosh a·cosh b − sinh a·sinh b·cos C', () => {
    for (const t of [RIGHT_TRI, GENERAL_TRI]) {
      expect(cosineRuleResidual(t)).toBeLessThan(1e-10)
    }
  })

  it('双曲勾股定理 cosh c = cosh a·cosh b(注意是 cosh 不是平方)', () => {
    for (const s of [0.3, 0.5, 0.8]) {
      const t: HTriangle = { A: { x: 0, y: 0 }, B: { x: s, y: 0 }, C: { x: 0, y: s } }
      // 确认 A 处是直角
      expect(hyperbolicAngle(t.A, t.B, t.C)).toBeCloseTo(Math.PI / 2, 9)
      const [hyp, legB, legC] = triangleSides(t)
      expect(pythagoreanResidual(legB, legC, hyp)).toBeLessThan(1e-10)
    }
  })

  it('双曲斜边比欧氏勾股定理预测的长', () => {
    for (const s of [0.5, 0.8]) {
      const t: HTriangle = { A: { x: 0, y: 0 }, B: { x: s, y: 0 }, C: { x: 0, y: s } }
      const [hyp, legB, legC] = triangleSides(t)
      expect(hyp).toBeGreaterThan(Math.hypot(legB, legC))
    }
  })

  it('小三角形趋近欧氏情形(内角和趋于 π)', () => {
    const tiny: HTriangle = {
      A: { x: 0, y: 0 }, B: { x: 0.001, y: 0 }, C: { x: 0, y: 0.001 },
    }
    expect(angleSum(tiny)).toBeGreaterThan(Math.PI - 0.01)
    expect(angleSum(tiny)).toBeLessThan(Math.PI)
    expect(triangleArea(tiny)).toBeLessThan(0.01)
  })
})

describe('双曲几何 - 圆周长与面积的指数增长', () => {
  it('圆周长 2π·sinh r 恒大于欧氏 2πr', () => {
    for (const r of [0.5, 1, 2, 3]) {
      expect(circleCircumference(r)).toBeGreaterThan(euclideanCircumference(r))
    }
  })

  it('圆面积 2π(cosh r − 1) 恒大于欧氏 πr²', () => {
    for (const r of [0.5, 1, 2, 3]) {
      expect(circleArea(r)).toBeGreaterThan(euclideanCircleArea(r))
    }
  })

  it('半径越大差距越悬殊(指数 vs 线性)', () => {
    const ratios = [0.5, 1, 2, 3, 4].map(
      (r) => circleCircumference(r) / euclideanCircumference(r),
    )
    for (let i = 1; i < ratios.length; i++) {
      expect(ratios[i]).toBeGreaterThan(ratios[i - 1])
    }
    // r=3 时已超过 3 倍
    expect(ratios[3]).toBeGreaterThan(3)
  })

  it('小半径时趋近欧氏(sinh r ≈ r)', () => {
    for (const r of [0.01, 0.001]) {
      expect(circleCircumference(r) / euclideanCircumference(r))
        .toBeCloseTo(1, 4)
    }
  })

  it('周长与面积满足 面积 = 周长 − 2π·(r 的欧氏部分)? 检验恒等式', () => {
    // 双曲平面上: dA/dr = 周长, 即 d/dr[2π(cosh r − 1)] = 2π sinh r ✓
    const h = 1e-6
    for (const r of [0.5, 1, 2]) {
      const dA = (circleArea(r + h) - circleArea(r - h)) / (2 * h)
      expect(dA).toBeCloseTo(circleCircumference(r), 5)
    }
  })
})
