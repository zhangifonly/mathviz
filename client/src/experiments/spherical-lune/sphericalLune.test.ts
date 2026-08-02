import { describe, it, expect } from 'vitest'
import {
  luneArea, luneFraction, luneBoundary, luneQuadGrid, numericLuneArea, polygonArea,
  polygonInteriorAngle, polygonAngleSum, polygonAreaByFormula,
  polygonAreaResidual, planarAngleSum, girardIdentityResidual,
  totalLuneAreaFor, regularSphericalPolygon, polygonBoundary,
  luneEdgeCircles, LUNE_PRESETS, LUNE_APEX_NORTH, LUNE_APEX_SOUTH,
} from './sphericalLune'
import {
  fromLatLon, sphericalExcess, sphericalDistance, norm, dot, unit,
} from '../../lib/sphere3d'
import type { SphericalTriangle } from '../../lib/sphere3d'

describe('球面二角形 - 面积公式', () => {
  it('面积公式 2α 与数值积分一致', () => {
    for (const p of LUNE_PRESETS) {
      // α=π 时采样在极点退化, 放宽到 1e-5
      const tol = p.alpha >= Math.PI - 1e-9 ? 1e-5 : 1e-10
      expect(Math.abs(luneArea(p.alpha) - numericLuneArea(p.alpha, 120)))
        .toBeLessThan(tol)
    }
  })

  it('α = π/2 的二角形面积恰为 π(球面的四分之一)', () => {
    expect(luneArea(Math.PI / 2)).toBeCloseTo(Math.PI, 12)
    expect(luneFraction(Math.PI / 2)).toBeCloseTo(0.25, 12)
  })

  it('α = π 的二角形就是半球, 面积 2π', () => {
    expect(luneArea(Math.PI)).toBeCloseTo(2 * Math.PI, 12)
    expect(luneFraction(Math.PI)).toBeCloseTo(0.5, 12)
  })

  it('α = 2π 覆盖整个球面', () => {
    expect(luneArea(2 * Math.PI)).toBeCloseTo(4 * Math.PI, 12)
    expect(luneFraction(2 * Math.PI)).toBeCloseTo(1, 12)
  })

  it('面积与夹角成正比', () => {
    for (const k of [2, 3, 5]) {
      expect(luneArea(0.3 * k)).toBeCloseTo(k * luneArea(0.3), 12)
    }
  })

  it('占比恰为 α/(2π)', () => {
    for (const a of [0.2, 0.7, 1.5, 3]) {
      expect(luneFraction(a)).toBeCloseTo(a / (2 * Math.PI), 12)
      expect(luneArea(a) / (4 * Math.PI)).toBeCloseTo(luneFraction(a), 12)
    }
  })

  it('两个顶点是对径点', () => {
    expect(sphericalDistance(LUNE_APEX_NORTH, LUNE_APEX_SOUTH))
      .toBeCloseTo(Math.PI, 10)
  })

  it('边界从北极经南极回到北极, 点都在球面上', () => {
    const b = luneBoundary(Math.PI / 3, 40)
    expect(b.length).toBe(81)
    for (const p of b) expect(norm(p)).toBeCloseTo(1, 10)
    // 首点是北极
    expect(sphericalDistance(b[0], LUNE_APEX_NORTH)).toBeLessThan(1e-9)
    // 中点附近应到过南极
    expect(sphericalDistance(b[40], LUNE_APEX_SOUTH)).toBeLessThan(1e-9)
  })

  it('两条边所在大圆的法向量互相夹角为 α', () => {
    for (const a of [0.4, 1.0, 1.5]) {
      const [n1, n2] = luneEdgeCircles(a)
      expect(norm(n1)).toBeCloseTo(1, 10)
      expect(norm(n2)).toBeCloseTo(1, 10)
      // 法向量夹角等于二面角 α
      const ang = Math.acos(Math.max(-1, Math.min(1, dot(unit(n1), unit(n2)))))
      expect(ang).toBeCloseTo(a, 8)
    }
  })

  it('平面上没有二角形 —— 两条直线最多交于一点', () => {
    // 球面上两个大圆交于两点(对径), 这才使二角形存在
    const [n1, n2] = luneEdgeCircles(Math.PI / 3)
    // 交点方向 = 两法向量的叉积, 与其反向, 恰是一对对径点
    const cx = [
      n1[1] * n2[2] - n1[2] * n2[1],
      n1[2] * n2[0] - n1[0] * n2[2],
      n1[0] * n2[1] - n1[1] * n2[0],
    ] as [number, number, number]
    const p = unit(cx)
    const q: [number, number, number] = [-p[0], -p[1], -p[2]]
    expect(sphericalDistance(p, q)).toBeCloseTo(Math.PI, 9)
  })
})

describe('球面多边形 - 面积 = 内角和 − (n−2)π', () => {
  const cases: Array<[number, number]> = [
    [3, 20], [3, 45], [3, 70], [4, 20], [4, 45], [4, 70],
    [5, 20], [5, 45], [6, 45], [8, 45], [8, 70],
  ]

  it('两种算法(切三角 vs 内角和公式)结果一致', () => {
    for (const [n, latDeg] of cases) {
      const poly = regularSphericalPolygon(n, (latDeg * Math.PI) / 180)
      expect(polygonAreaResidual(poly)).toBeLessThan(1e-12)
    }
  })

  it('内角和严格大于平面值 (n−2)π', () => {
    for (const [n, latDeg] of cases) {
      const poly = regularSphericalPolygon(n, (latDeg * Math.PI) / 180)
      expect(polygonAngleSum(poly)).toBeGreaterThan(planarAngleSum(n))
    }
  })

  it('面积恰等于内角和超出平面值的部分', () => {
    for (const [n, latDeg] of cases) {
      const poly = regularSphericalPolygon(n, (latDeg * Math.PI) / 180)
      const excess = polygonAngleSum(poly) - planarAngleSum(n)
      expect(polygonArea(poly)).toBeCloseTo(excess, 10)
    }
  })

  it('三角形情形退化为吉拉尔定理', () => {
    for (const latDeg of [20, 45, 70]) {
      const tri = regularSphericalPolygon(3, (latDeg * Math.PI) / 180)
      const t: SphericalTriangle = { A: tri[0], B: tri[1], C: tri[2] }
      // n=3 时公式给 内角和 − π, 正是球面盈余
      expect(polygonAreaByFormula(tri)).toBeCloseTo(sphericalExcess(t), 10)
    }
  })

  it('正多边形的所有内角相等', () => {
    for (const [n, latDeg] of cases) {
      const poly = regularSphericalPolygon(n, (latDeg * Math.PI) / 180)
      const angs = poly.map((_, i) => polygonInteriorAngle(poly, i))
      expect(Math.max(...angs) - Math.min(...angs)).toBeLessThan(1e-9)
    }
  })

  it('纬度越高多边形越小, 面积越小', () => {
    for (const n of [3, 4, 6]) {
      const areas = [20, 45, 70, 85].map(
        (d) => polygonArea(regularSphericalPolygon(n, (d * Math.PI) / 180)),
      )
      for (let i = 1; i < areas.length; i++) {
        expect(areas[i]).toBeLessThan(areas[i - 1])
      }
    }
  })

  it('高纬度小多边形趋近平面情形(内角和趋于 (n−2)π)', () => {
    for (const n of [3, 4, 5]) {
      const poly = regularSphericalPolygon(n, (89.5 * Math.PI) / 180)
      const ratio = polygonAngleSum(poly) / planarAngleSum(n)
      expect(ratio).toBeGreaterThan(1)
      expect(ratio).toBeLessThan(1.01)
    }
  })

  it('边界采样点都在球面上, 且闭合', () => {
    const poly = regularSphericalPolygon(5, 0.6)
    const b = polygonBoundary(poly, 20)
    for (const p of b) expect(norm(p)).toBeCloseTo(1, 10)
    expect(sphericalDistance(b[0], b[b.length - 1])).toBeLessThan(1e-9)
  })

  it('二角形的经纬网格铺满整块区域, 面积之和等于 2α', () => {
    // 之前把边界折线丢给「面心扇形三角化」, 细长二角形的面心几乎落在
    // 边界上, 扇形退化成一条线(截图里月牙只剩一条细边)。改用经纬网格后
    // 各小片面积之和必须等于解析值。
    for (const alpha of [Math.PI / 6, Math.PI / 2, Math.PI * 0.9]) {
      const quads = luneQuadGrid(alpha, 20, 40)
      const total = quads.reduce((s, q) => s + polygonArea(q), 0)
      expect(total).toBeCloseTo(luneArea(alpha), 3)
    }
  })

  it('网格小片数等于 lonSteps × latSteps, 每片四个顶点', () => {
    const quads = luneQuadGrid(Math.PI / 3, 8, 12)
    expect(quads.length).toBe(8 * 12)
    for (const q of quads) {
      expect(q.length).toBe(4)
      for (const p of q) expect(norm(p)).toBeCloseTo(1, 10)
    }
  })

  it('少于三个顶点时面积为零', () => {
    expect(polygonArea([])).toBe(0)
    expect(polygonArea([[1, 0, 0]])).toBe(0)
    expect(polygonArea([[1, 0, 0], [0, 1, 0]])).toBe(0)
  })
})

describe('球面二角形 - 推出吉拉尔定理', () => {
  const tris: SphericalTriangle[] = [
    { A: [1, 0, 0], B: [0, 1, 0], C: [0, 0, 1] },
    { A: fromLatLon(0.3, 0), B: fromLatLon(0.5, 1.1), C: fromLatLon(-0.4, 0.7) },
    { A: fromLatLon(1.2, 0), B: fromLatLon(0.1, 2.0), C: fromLatLon(-0.8, 4.0) },
    { A: fromLatLon(0.8, 0.2), B: fromLatLon(-0.6, 2.4), C: fromLatLon(0.1, 4.5) },
  ]

  it('三对二角形的总面积 = 4π + 4·三角形面积', () => {
    for (const t of tris) {
      expect(girardIdentityResidual(t)).toBeLessThan(1e-12)
    }
  })

  it('由此解出的面积等于球面盈余', () => {
    for (const t of tris) {
      const solved = (totalLuneAreaFor(t) - 4 * Math.PI) / 4
      expect(solved).toBeCloseTo(sphericalExcess(t), 10)
    }
  })

  it('八分之一球面: 三个内角都是 π/2, 二角形总和为 6π', () => {
    const t = tris[0]
    // 三对二角形, 每对 2×2×(π/2) = 2π, 共 6π
    expect(totalLuneAreaFor(t)).toBeCloseTo(6 * Math.PI, 10)
    // 代入公式: (6π − 4π)/4 = π/2, 正是八分之一球面的面积
    expect((totalLuneAreaFor(t) - 4 * Math.PI) / 4).toBeCloseTo(Math.PI / 2, 10)
  })

  it('二角形总和恒大于 4π(因为三角形面积为正)', () => {
    for (const t of tris) {
      expect(totalLuneAreaFor(t)).toBeGreaterThan(4 * Math.PI)
    }
  })

  it('预设的四个夹角覆盖 30° 到 180°', () => {
    expect(LUNE_PRESETS.length).toBe(4)
    expect(LUNE_PRESETS[0].alpha).toBeCloseTo(Math.PI / 6, 12)
    expect(LUNE_PRESETS[LUNE_PRESETS.length - 1].alpha).toBeCloseTo(Math.PI, 12)
    for (let i = 1; i < LUNE_PRESETS.length; i++) {
      expect(LUNE_PRESETS[i].alpha).toBeGreaterThan(LUNE_PRESETS[i - 1].alpha)
    }
  })
})
