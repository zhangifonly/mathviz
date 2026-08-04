import { describe, it, expect } from 'vitest'
import {
  dot, cross, norm, unit, triangleSolidAngle, solidAngleByExcess,
  solidAngleResidual, coneSolidAngle, coneAngleFromSolid, solidFraction,
  coneSolidAngleNumeric, tetrahedronVertexSolidAngle, presetOf,
  FULL_SPACE, HALF_SPACE, CUBE_VERTEX_SOLID_ANGLE, CUBE_VERTEX_SUM,
  PRESETS, ANALOGY,
} from './solidAngle'
import type { Vec3 } from '../../lib/proj3d'

describe('立体角 - 基本量', () => {
  it('全空间 4π, 半空间 2π', () => {
    expect(FULL_SPACE).toBeCloseTo(4 * Math.PI, 12)
    expect(HALF_SPACE).toBeCloseTo(2 * Math.PI, 12)
    expect(FULL_SPACE / HALF_SPACE).toBeCloseTo(2, 12)
  })

  it('平面角与立体角的类比表完整', () => {
    expect(ANALOGY.length).toBe(2)
    expect(ANALOGY[0].full).toBe('2π')
    expect(ANALOGY[1].full).toBe('4π')
  })

  it('三条正交射线张成八分之一空间 = π/2', () => {
    const omega = triangleSolidAngle([1, 0, 0], [0, 1, 0], [0, 0, 1])
    expect(omega).toBeCloseTo(Math.PI / 2, 10)
    expect(omega).toBeCloseTo(FULL_SPACE / 8, 10)
    expect(solidFraction(omega)).toBeCloseTo(0.125, 10)
  })

  it('立体角与射线长度无关(只看方向)', () => {
    const base = triangleSolidAngle([1, 0, 0], [0, 1, 0], [0, 0, 1])
    const scaled = triangleSolidAngle([5, 0, 0], [0, 0.2, 0], [0, 0, 100])
    expect(scaled).toBeCloseTo(base, 10)
  })

  it('零向量给出零立体角', () => {
    expect(triangleSolidAngle([0, 0, 0], [0, 1, 0], [0, 0, 1])).toBe(0)
  })

  it('向量工具正确', () => {
    expect(cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1])
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
    expect(norm([3, 4, 0])).toBeCloseTo(5, 12)
    expect(norm(unit([3, 4, 0]))).toBeCloseTo(1, 12)
  })
})

describe('立体角 - 两种算法交叉验证', () => {
  it('公式法与球面盈余法结果一致', () => {
    for (const p of PRESETS) {
      expect(solidAngleResidual(p.a, p.b, p.c)).toBeLessThan(1e-9)
    }
  })

  it('对确定性随机射线也一致', () => {
    let s = 987654
    const rnd = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff
      return (s / 0x7fffffff) * 2 - 1
    }
    let checked = 0
    for (let i = 0; i < 40; i++) {
      const a: Vec3 = [rnd(), rnd(), rnd()]
      const b: Vec3 = [rnd(), rnd(), rnd()]
      const c: Vec3 = [rnd(), rnd(), rnd()]
      const omega = triangleSolidAngle(a, b, c)
      // 退化情形两法都给 0, 跳过
      if (omega < 1e-6) continue
      expect(solidAngleResidual(a, b, c)).toBeLessThan(1e-8)
      checked++
    }
    expect(checked).toBeGreaterThan(25)
  })

  it('球面盈余法在八分之一空间给 π/2', () => {
    expect(solidAngleByExcess([1, 0, 0], [0, 1, 0], [0, 0, 1]))
      .toBeCloseTo(Math.PI / 2, 9)
  })

  it('立体角恒非负且不超过 4π', () => {
    for (const p of PRESETS) {
      const omega = triangleSolidAngle(p.a, p.b, p.c)
      expect(omega).toBeGreaterThanOrEqual(0)
      expect(omega).toBeLessThanOrEqual(FULL_SPACE + 1e-9)
    }
  })

  it('近共面时立体角趋于零', () => {
    const { a, b, c } = presetOf('flat')
    const omega = triangleSolidAngle(a, b, c)
    expect(omega).toBeGreaterThan(0)
    expect(omega).toBeLessThan(0.1)
  })

  it('窄立体角明显小于宽立体角', () => {
    const narrow = triangleSolidAngle(...Object.values(presetOf('narrow')) as [Vec3, Vec3, Vec3])
    const wide = triangleSolidAngle(...Object.values(presetOf('wide')) as [Vec3, Vec3, Vec3])
    expect(narrow).toBeLessThan(wide)
  })
})

describe('立体角 - 圆锥公式', () => {
  it('Ω = 2π(1 − cos α)', () => {
    for (const alpha of [0.3, 0.8, 1.2]) {
      expect(coneSolidAngle(alpha))
        .toBeCloseTo(2 * Math.PI * (1 - Math.cos(alpha)), 12)
    }
  })

  it('α = π/2 给半空间 2π', () => {
    expect(coneSolidAngle(Math.PI / 2)).toBeCloseTo(HALF_SPACE, 10)
  })

  it('α = π 给全空间 4π', () => {
    expect(coneSolidAngle(Math.PI)).toBeCloseTo(FULL_SPACE, 10)
  })

  it('α = 0 给零', () => {
    expect(coneSolidAngle(0)).toBeCloseTo(0, 12)
  })

  it('α 越大立体角越大(单调)', () => {
    const os = [0.2, 0.5, 1.0, 1.5, 2.0, 3.0].map(coneSolidAngle)
    for (let i = 1; i < os.length; i++) {
      expect(os[i]).toBeGreaterThan(os[i - 1])
    }
  })

  it('反解半顶角与正向公式互逆', () => {
    for (const alpha of [0.3, 0.9, 1.5, 2.5]) {
      expect(coneAngleFromSolid(coneSolidAngle(alpha))).toBeCloseTo(alpha, 9)
    }
  })

  it('数值积分校验锥体公式', () => {
    for (const alpha of [0.4, 1.0, 1.57]) {
      const numeric = coneSolidAngleNumeric(alpha, 600)
      expect(numeric).toBeCloseTo(coneSolidAngle(alpha), 1)
    }
  })

  it('小角度近似 Ω ≈ πα²', () => {
    for (const alpha of [0.01, 0.02]) {
      const approx = Math.PI * alpha * alpha
      expect(coneSolidAngle(alpha) / approx).toBeCloseTo(1, 3)
    }
  })
})

describe('立体角 - 多面体顶点', () => {
  it('立方体顶点立体角恰为 π/2', () => {
    expect(CUBE_VERTEX_SOLID_ANGLE).toBeCloseTo(Math.PI / 2, 12)
    // 三条正交棱, 与八分之一空间同一个量
    expect(triangleSolidAngle([1, 0, 0], [0, 1, 0], [0, 0, 1]))
      .toBeCloseTo(CUBE_VERTEX_SOLID_ANGLE, 10)
  })

  it('立方体八顶点之和恰为 4π', () => {
    expect(CUBE_VERTEX_SUM).toBeCloseTo(FULL_SPACE, 10)
  })

  it('正四面体顶点立体角约 0.5513 球面度', () => {
    const omega = tetrahedronVertexSolidAngle()
    expect(omega).toBeGreaterThan(0.54)
    expect(omega).toBeLessThan(0.56)
  })

  it('正四面体四顶点之和不等于 4π —— 与角亏总和恒为 4π 不同', () => {
    const sum = 4 * tetrahedronVertexSolidAngle()
    expect(sum).toBeLessThan(FULL_SPACE)
    // 差距很明显, 不是数值误差
    expect(FULL_SPACE - sum).toBeGreaterThan(9)
  })

  it('立方体那个 4π 是巧合, 不是普适规律', () => {
    const cube = CUBE_VERTEX_SUM
    const tetra = 4 * tetrahedronVertexSolidAngle()
    expect(cube).toBeCloseTo(FULL_SPACE, 8)
    expect(tetra).not.toBeCloseTo(FULL_SPACE, 1)
  })

  it('四个预设覆盖八分区/窄/宽/近共面', () => {
    expect(PRESETS.length).toBe(4)
    const ids = PRESETS.map((p) => p.id)
    expect(ids).toContain('octant')
    expect(ids).toContain('flat')
  })

  it('presetOf 对未知 id 有兜底', () => {
    const p = presetOf('nope' as never)
    expect(triangleSolidAngle(p.a, p.b, p.c)).toBeGreaterThan(0)
  })
})
