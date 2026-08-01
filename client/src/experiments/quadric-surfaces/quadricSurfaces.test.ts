import { describe, it, expect } from 'vitest'
import {
  KINDS, QUADRIC_INFO, quadric, implicitResidual, signature,
  paramRange, infoOf, type QuadricKind,
} from './quadricSurfaces'

describe('二次曲面分类', () => {
  const shapes: Array<[number, number, number]> = [[1, 1, 1], [1.4, 0.8, 1.2]]

  it('六种非退化二次曲面全部覆盖', () => {
    expect(KINDS.length).toBe(6)
    expect(QUADRIC_INFO.length).toBe(6)
    expect(new Set(KINDS).size).toBe(6)
  })

  it('每种参数化都精确落在自己的隐式方程上', () => {
    for (const kind of KINDS) {
      const { u, v } = paramRange(kind)
      for (const [a, b, c] of shapes) {
        for (let i = 0; i <= 12; i++) {
          for (let j = 0; j <= 12; j++) {
            const uu = u[0] + ((u[1] - u[0]) * i) / 12
            const vv = v[0] + ((v[1] - v[0]) * j) / 12
            const p = quadric(kind, uu, vv, a, b, c)
            expect(Math.abs(implicitResidual(kind, p, a, b, c))).toBeLessThan(1e-10)
          }
        }
      }
    }
  })

  it('椭球面有界: 所有点落在半轴范围内', () => {
    for (const [a, b, c] of shapes) {
      const { u, v } = paramRange('ellipsoid')
      for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
          const p = quadric('ellipsoid', (u[1] * i) / 20, (v[1] * j) / 20, a, b, c)
          expect(Math.abs(p[0])).toBeLessThanOrEqual(a + 1e-12)
          expect(Math.abs(p[1])).toBeLessThanOrEqual(b + 1e-12)
          expect(Math.abs(p[2])).toBeLessThanOrEqual(c + 1e-12)
        }
      }
    }
  })

  it('单叶双曲面的腰部最细, 半径随 |v| 单调增大', () => {
    const r = (v: number) => {
      const p = quadric('hyperboloid1', 0.7, v)
      return Math.hypot(p[0], p[1])
    }
    expect(r(0)).toBeCloseTo(1, 10)
    for (const v of [0.3, 0.7, 1.2]) expect(r(v)).toBeGreaterThan(r(0))
    expect(r(1.2)).toBeGreaterThan(r(0.7))
  })

  it('双叶双曲面: 上片 x 恒 >= a, 存在间隙', () => {
    for (const [a, b, c] of shapes) {
      const { v } = paramRange('hyperboloid2')
      for (let j = 0; j <= 15; j++) {
        const vv = v[0] + ((v[1] - v[0]) * j) / 15
        const p = quadric('hyperboloid2', 1.1, vv, a, b, c)
        expect(p[0]).toBeGreaterThanOrEqual(a - 1e-12)
      }
    }
  })

  it('椭圆抛物面: z 恒非负, 顶点在原点', () => {
    const { u, v } = paramRange('paraboloid')
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        const p = quadric('paraboloid', (u[1] * i) / 10, (v[1] * j) / 10)
        expect(p[2]).toBeGreaterThanOrEqual(-1e-12)
      }
    }
    expect(quadric('paraboloid', 0, 0)[2]).toBeCloseTo(0, 12)
  })

  it('锥面: 顶点在原点, 且 v 与 -v 关于原点对称', () => {
    expect(quadric('cone', 1.2, 0)).toEqual([0, 0, 0])
    for (const u of [0.4, 2.1]) {
      const p = quadric('cone', u, 0.8)
      const q = quadric('cone', u, -0.8)
      p.forEach((cv, i) => expect(q[i]).toBeCloseTo(-cv, 12))
    }
  })

  it('符号组合决定分类: 全同号椭球, 一负单叶, 两负双叶', () => {
    expect(signature('ellipsoid')).toEqual([1, 1, 1])
    expect(signature('hyperboloid1').filter((s) => s < 0).length).toBe(1)
    expect(signature('hyperboloid2').filter((s) => s < 0).length).toBe(2)
  })

  it('两种直纹面: 单叶双曲面与双曲抛物面(锥面也是)', () => {
    const ruled = QUADRIC_INFO.filter((q) => q.ruled).map((q) => q.kind)
    expect(ruled).toContain('hyperboloid1')
    expect(ruled).toContain('saddle')
    expect(ruled).not.toContain('ellipsoid')
    expect(ruled).not.toContain('paraboloid')
  })

  it('只有双叶双曲面有两个连通分支', () => {
    const two = QUADRIC_INFO.filter((q) => q.pieces === 2)
    expect(two.length).toBe(1)
    expect(two[0].kind).toBe('hyperboloid2')
  })

  it('infoOf 能查到每种曲面, 未知类型有兜底', () => {
    for (const kind of KINDS) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('no-such' as QuadricKind).kind).toBe('ellipsoid')
  })

  it('所有曲面在参数域内坐标有限', () => {
    for (const kind of KINDS) {
      const { u, v } = paramRange(kind)
      for (const uu of u) {
        for (const vv of v) {
          expect(quadric(kind, uu, vv).every(Number.isFinite)).toBe(true)
        }
      }
    }
  })

  it('每种曲面都有非空的方程字符串与说明', () => {
    for (const q of QUADRIC_INFO) {
      expect(q.equation.length).toBeGreaterThan(5)
      expect(q.label.length).toBeGreaterThan(1)
      expect(q.note.length).toBeGreaterThan(1)
    }
  })
})
