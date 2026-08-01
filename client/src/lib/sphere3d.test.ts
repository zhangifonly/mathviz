import { describe, it, expect } from 'vitest'
import {
  dot, cross, norm, unit, fromLatLon, toLatLon, sphericalDistance, slerp,
  greatCircleArc, greatCircle, sphericalAngle, tangentAt, triangleAngles,
  triangleSides, sphericalExcess, triangleArea, cosineRuleResidual,
  sineRuleSpread, pythagoreanResidual, triangleCentroid, triangleEdges,
  type SphericalTriangle,
} from './sphere3d'
import type { Vec3 } from './proj3d'

/** 八分之一球面三角形：三个顶点在三个坐标轴上，三个内角都是直角 */
const OCTANT: SphericalTriangle = {
  A: [1, 0, 0], B: [0, 1, 0], C: [0, 0, 1],
}

/** 确定性伪随机，保证测试可复现 */
function makeRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function randomPoint(rng: () => number): Vec3 {
  return unit([rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1])
}

describe('sphere3d - 基本运算', () => {
  it('unit 归一化, 零向量有兜底', () => {
    expect(norm(unit([3, 4, 0]))).toBeCloseTo(1, 12)
    expect(unit([0, 0, 0])).toEqual([0, 0, 1])
  })

  it('经纬度往返一致', () => {
    for (const [lat, lon] of [[0, 0], [0.5, 1.2], [-0.9, -2.5], [1.3, 3]]) {
      const p = fromLatLon(lat, lon)
      const back = toLatLon(p)
      expect(back.lat).toBeCloseTo(lat, 10)
      expect(Math.cos(back.lon)).toBeCloseTo(Math.cos(lon), 10)
    }
  })

  it('经纬度给出的点在单位球上', () => {
    for (const [lat, lon] of [[0.3, 0.7], [-1.1, 2.2]]) {
      expect(norm(fromLatLon(lat, lon))).toBeCloseTo(1, 12)
    }
  })

  it('北极与南极', () => {
    expect(fromLatLon(Math.PI / 2, 0)[2]).toBeCloseTo(1, 10)
    expect(fromLatLon(-Math.PI / 2, 0)[2]).toBeCloseTo(-1, 10)
  })
})

describe('sphere3d - 球面距离', () => {
  it('同点距离为零, 对径点距离为 π', () => {
    expect(sphericalDistance([1, 0, 0], [1, 0, 0])).toBeCloseTo(0, 12)
    expect(sphericalDistance([1, 0, 0], [-1, 0, 0])).toBeCloseTo(Math.PI, 10)
  })

  it('正交两点距离为 π/2', () => {
    expect(sphericalDistance([1, 0, 0], [0, 1, 0])).toBeCloseTo(Math.PI / 2, 12)
    expect(sphericalDistance([0, 0, 1], [0, 1, 0])).toBeCloseTo(Math.PI / 2, 12)
  })

  it('距离对称', () => {
    const rng = makeRng(7)
    for (let i = 0; i < 20; i++) {
      const a = randomPoint(rng)
      const b = randomPoint(rng)
      expect(sphericalDistance(a, b)).toBeCloseTo(sphericalDistance(b, a), 12)
    }
  })

  it('距离满足三角不等式', () => {
    const rng = makeRng(11)
    for (let i = 0; i < 30; i++) {
      const a = randomPoint(rng)
      const b = randomPoint(rng)
      const c = randomPoint(rng)
      const ab = sphericalDistance(a, b)
      const bc = sphericalDistance(b, c)
      const ac = sphericalDistance(a, c)
      expect(ac).toBeLessThanOrEqual(ab + bc + 1e-9)
    }
  })
})

describe('sphere3d - 大圆弧', () => {
  it('slerp 端点正确, 中点在球面上', () => {
    const a: Vec3 = [1, 0, 0]
    const b: Vec3 = [0, 1, 0]
    expect(slerp(a, b, 0)).toEqual(a)
    const mid = slerp(a, b, 0.5)
    expect(norm(mid)).toBeCloseTo(1, 10)
    // 中点到两端距离相等
    expect(sphericalDistance(mid, a)).toBeCloseTo(sphericalDistance(mid, b), 10)
  })

  it('slerp 的点全在单位球上', () => {
    const rng = makeRng(3)
    const a = randomPoint(rng)
    const b = randomPoint(rng)
    for (let i = 0; i <= 10; i++) {
      expect(norm(slerp(a, b, i / 10))).toBeCloseTo(1, 10)
    }
  })

  it('大圆弧采样点数正确且都在球面上', () => {
    const arc = greatCircleArc([1, 0, 0], [0, 0, 1], 20)
    expect(arc.length).toBe(21)
    for (const p of arc) expect(norm(p)).toBeCloseTo(1, 10)
  })

  it('大圆的点都与法向量正交', () => {
    for (const n of [[0, 0, 1], [1, 1, 1], [0.3, -0.7, 0.2]] as Vec3[]) {
      const circle = greatCircle(n, 40)
      const un = unit(n)
      for (const p of circle) {
        expect(Math.abs(dot(p, un))).toBeLessThan(1e-10)
        expect(norm(p)).toBeCloseTo(1, 10)
      }
    }
  })

  it('赤道大圆的 z 恒为零', () => {
    for (const p of greatCircle([0, 0, 1], 30)) {
      expect(Math.abs(p[2])).toBeLessThan(1e-12)
    }
  })
})

describe('sphere3d - 球面三角形', () => {
  it('八分之一球面: 三个内角都是直角', () => {
    for (const a of triangleAngles(OCTANT)) {
      expect(a).toBeCloseTo(Math.PI / 2, 10)
    }
  })

  it('八分之一球面: 三边长都是 π/2', () => {
    for (const s of triangleSides(OCTANT)) {
      expect(s).toBeCloseTo(Math.PI / 2, 10)
    }
  })

  it('八分之一球面: 内角和为 3π/2, 明显大于 π', () => {
    const sum = triangleAngles(OCTANT).reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo((3 * Math.PI) / 2, 10)
    expect(sum).toBeGreaterThan(Math.PI)
  })

  it('吉拉尔定理: 面积等于球面盈余, 且恰为球面积的 1/8', () => {
    const excess = sphericalExcess(OCTANT)
    expect(excess).toBeCloseTo(Math.PI / 2, 10)
    expect(triangleArea(OCTANT)).toBeCloseTo(excess, 12)
    // 单位球总面积 4π, 八分之一是 π/2
    expect(triangleArea(OCTANT)).toBeCloseTo((4 * Math.PI) / 8, 10)
  })

  it('球面盈余恒为正(内角和总大于 π)', () => {
    const rng = makeRng(23)
    let checked = 0
    for (let i = 0; i < 60; i++) {
      const t: SphericalTriangle = {
        A: randomPoint(rng), B: randomPoint(rng), C: randomPoint(rng),
      }
      const e = sphericalExcess(t)
      if (!Number.isFinite(e)) continue
      expect(e).toBeGreaterThan(-1e-9)
      checked++
    }
    expect(checked).toBeGreaterThan(40)
  })

  it('球面余弦定理: 随机三角形残差近零', () => {
    const rng = makeRng(31)
    let maxRes = 0
    let checked = 0
    for (let i = 0; i < 200; i++) {
      const t: SphericalTriangle = {
        A: randomPoint(rng), B: randomPoint(rng), C: randomPoint(rng),
      }
      const r = cosineRuleResidual(t)
      if (!Number.isFinite(r)) continue
      maxRes = Math.max(maxRes, Math.abs(r))
      checked++
    }
    expect(checked).toBeGreaterThan(150)
    expect(maxRes).toBeLessThan(1e-9)
  })

  it('球面正弦定理: 三个比值一致', () => {
    const rng = makeRng(41)
    let maxSpread = 0
    for (let i = 0; i < 200; i++) {
      const t: SphericalTriangle = {
        A: randomPoint(rng), B: randomPoint(rng), C: randomPoint(rng),
      }
      const s = sineRuleSpread(t)
      if (Number.isFinite(s)) maxSpread = Math.max(maxSpread, s)
    }
    // 接近退化的三角形精度会降, 放宽到 1e-3
    expect(maxSpread).toBeLessThan(1e-3)
  })

  it('球面勾股定理: 直角三角形满足 cos c = cos a·cos b(无平方项)', () => {
    // A 在北极, B 沿一条经线, C 沿另一条正交经线 → A 处为直角
    for (const [la, lb] of [[0.4, 0.6], [0.9, 1.1], [0.2, 1.4]]) {
      const A: Vec3 = [0, 0, 1]
      const B: Vec3 = unit([Math.sin(la), 0, Math.cos(la)])
      const C: Vec3 = unit([0, Math.sin(lb), Math.cos(lb)])
      // 确认 A 处确实是直角
      expect(sphericalAngle(A, B, C)).toBeCloseTo(Math.PI / 2, 8)
      const hyp = sphericalDistance(B, C)
      const legB = sphericalDistance(C, A)
      const legC = sphericalDistance(A, B)
      expect(Math.abs(pythagoreanResidual(legB, legC, hyp))).toBeLessThan(1e-12)
    }
  })

  it('小三角形上球面勾股定理退化为欧氏勾股定理', () => {
    // 边长趋于 0 时 cos c ≈ 1−c²/2, 展开后得 c² ≈ a²+b²
    for (const scale of [0.01, 0.005]) {
      const a = scale
      const b = scale * 1.3
      // 解 cos c = cos a cos b
      const c = Math.acos(Math.cos(a) * Math.cos(b))
      const euclid = Math.hypot(a, b)
      expect(Math.abs(c - euclid) / euclid).toBeLessThan(1e-4)
    }
  })

  it('tangentAt 给出切平面内的单位向量', () => {
    const a: Vec3 = [0, 0, 1]
    const t = tangentAt(a, unit([1, 0, 1]))
    expect(norm(t)).toBeCloseTo(1, 10)
    // 与 a 正交
    expect(Math.abs(dot(t, a))).toBeLessThan(1e-10)
  })

  it('形心在球面上, 三边采样点数正确', () => {
    expect(norm(triangleCentroid(OCTANT))).toBeCloseTo(1, 10)
    const edges = triangleEdges(OCTANT, 15)
    expect(edges.length).toBe(3)
    for (const e of edges) expect(e.length).toBe(16)
  })

  it('cross 与 dot 的基本性质', () => {
    expect(cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1])
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
  })
})
