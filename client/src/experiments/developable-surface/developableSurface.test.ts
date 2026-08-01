import { describe, it, expect } from 'vitest'
import {
  DEV_KINDS, DEV_INFO, directrix, direction, devSurface, developabilityDet,
  gaussianCurvature, infoOf, vRange, U_RANGE, type DevKind,
} from './developableSurface'

describe('可展曲面', () => {
  it('四种类型: 三种可展 + 一个反例', () => {
    expect(DEV_KINDS.length).toBe(4)
    expect(DEV_INFO.filter((d) => d.developable).length).toBe(3)
    expect(DEV_INFO.filter((d) => !d.developable).length).toBe(1)
  })

  it('可展的三种: 代数判据 det[γ′,d,d′] 恒为零', () => {
    for (const info of DEV_INFO.filter((d) => d.developable)) {
      for (const u of [0.5, 1.5, 3, 4.5, 6]) {
        expect(Math.abs(developabilityDet(info.kind, u))).toBeLessThan(1e-8)
      }
    }
  })

  it('反例: 螺旋面的判据明显非零', () => {
    const dets = [0.5, 1.5, 3, 4.5].map((u) => Math.abs(developabilityDet('nondev', u)))
    expect(Math.max(...dets)).toBeGreaterThan(0.1)
  })

  it('可展的三种: 几何判据 K 恒为零', () => {
    for (const info of DEV_INFO.filter((d) => d.developable)) {
      for (const [u, v] of [[0.5, 0.4], [1.5, -0.3], [3, 0.6], [4.5, 0.2]]) {
        expect(Math.abs(gaussianCurvature(info.kind, u, v))).toBeLessThan(1e-6)
      }
    }
  })

  it('反例: 螺旋面 K 明显非零', () => {
    const ks = [[0.5, 0.4], [1.5, -0.3], [3, 0.6]].map(
      ([u, v]) => Math.abs(gaussianCurvature('nondev', u, v)),
    )
    expect(Math.max(...ks)).toBeGreaterThan(0.5)
  })

  it('两条判据结论一致(代数与几何互相印证)', () => {
    for (const kind of DEV_KINDS) {
      const detZero = [0.5, 1.5, 3, 4.5]
        .every((u) => Math.abs(developabilityDet(kind, u)) < 1e-8)
      const kZero = [[0.5, 0.4], [1.5, -0.3], [3, 0.6]]
        .every(([u, v]) => Math.abs(gaussianCurvature(kind, u, v)) < 1e-6)
      expect(detZero).toBe(kZero)
      expect(detZero).toBe(infoOf(kind).developable)
    }
  })

  it('柱面: 方向恒定(平行直线族)', () => {
    const d0 = direction('cylinder', 0)
    for (const u of [1, 3, 5]) {
      expect(direction('cylinder', u)).toEqual(d0)
    }
  })

  it('锥面: 所有直线过同一顶点', () => {
    for (const u of [0, 2, 4, 6]) {
      expect(devSurface('cone', u, 0)).toEqual([0, 0, 1.2])
    }
  })

  it('切线面: 方向就是基曲线的切向量', () => {
    const h = 1e-6
    for (const u of [0.7, 2.5, 4]) {
      const a = directrix('tangent', u - h)
      const b = directrix('tangent', u + h)
      const tangent = [0, 1, 2].map((i) => (b[i] - a[i]) / (2 * h))
      const d = direction('tangent', u)
      // 方向应与切向量平行(此处已归一化到相同尺度)
      for (let i = 0; i < 3; i++) expect(d[i]).toBeCloseTo(tangent[i], 5)
    }
  })

  it('曲面参数方程就是 γ(u) + v·d(u)', () => {
    for (const kind of DEV_KINDS) {
      for (const u of [0.6, 2.2]) {
        for (const v of [-0.5, 0.8]) {
          const g = directrix(kind, u)
          const d = direction(kind, u)
          const s = devSurface(kind, u, v)
          for (let i = 0; i < 3; i++) expect(s[i]).toBeCloseTo(g[i] + v * d[i], 12)
        }
      }
    }
  })

  it('固定 u 变 v 得到直线(直纹面的前提)', () => {
    for (const kind of DEV_KINDS) {
      for (const u of [0.4, 2.8]) {
        const p = devSurface(kind, u, -0.5)
        const q = devSurface(kind, u, 0.2)
        const r = devSurface(kind, u, 0.9)
        const e1 = [0, 1, 2].map((i) => q[i] - p[i])
        const e2 = [0, 1, 2].map((i) => r[i] - p[i])
        const c = Math.hypot(
          e1[1] * e2[2] - e1[2] * e2[1],
          e1[2] * e2[0] - e1[0] * e2[2],
          e1[0] * e2[1] - e1[1] * e2[0],
        )
        expect(c).toBeLessThan(1e-12)
      }
    }
  })

  it('各类型的 v 范围合理', () => {
    for (const kind of DEV_KINDS) {
      const [lo, hi] = vRange(kind)
      expect(hi).toBeGreaterThan(lo)
    }
  })

  it('参数域内坐标全部有限', () => {
    for (const kind of DEV_KINDS) {
      const [v0, v1] = vRange(kind)
      for (const u of U_RANGE) {
        for (const v of [v0, (v0 + v1) / 2, v1]) {
          expect(devSurface(kind, u, v).every(Number.isFinite)).toBe(true)
        }
      }
    }
  })

  it('infoOf 能查到每种类型, 未知类型有兜底', () => {
    for (const kind of DEV_KINDS) expect(infoOf(kind).kind).toBe(kind)
    expect(infoOf('nope' as DevKind).kind).toBe('cylinder')
  })
})
