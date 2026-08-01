import { describe, it, expect } from 'vitest'
import {
  makeCamera, rotate, project, sampleSurface, sampleCurve, faceNormal,
  buildQuads, depthSortQuads, shade, rampColor, bounds, normalizePoints,
  normalizeGrid, type Vec3,
} from './proj3d'

describe('proj3d 旋转与投影', () => {
  it('零旋转是恒等变换', () => {
    const v: Vec3 = [1, 2, 3]
    const r = rotate(v, 0, 0)
    expect(r[0]).toBeCloseTo(1, 10)
    expect(r[1]).toBeCloseTo(2, 10)
    expect(r[2]).toBeCloseTo(3, 10)
  })

  it('旋转保持向量长度(正交变换)', () => {
    const v: Vec3 = [0.7, -1.3, 2.1]
    const len = Math.hypot(...v)
    for (const [yaw, pitch] of [[0.3, 0.2], [1.7, -0.9], [Math.PI, Math.PI / 2]]) {
      const r = rotate(v, yaw, pitch)
      expect(Math.hypot(...r)).toBeCloseTo(len, 10)
    }
  })

  it('绕 z 轴转 90 度把 x 轴送到 y 轴', () => {
    const r = rotate([1, 0, 0], Math.PI / 2, 0)
    expect(r[0]).toBeCloseTo(0, 10)
    expect(r[1]).toBeCloseTo(1, 10)
  })

  it('原点投影到相机中心', () => {
    const cam = makeCamera({ cx: 320, cy: 270 })
    const p = project([0, 0, 0], cam)
    expect(p.x).toBeCloseTo(320, 6)
    expect(p.y).toBeCloseTo(270, 6)
  })

  it('近处的点透视系数更大(近大远小)', () => {
    const cam = makeCamera({ yaw: 0, pitch: 0 })
    // yaw=pitch=0 时深度就是 y 分量
    const near = project([0, -1, 0], cam)
    const far = project([0, 1, 0], cam)
    expect(near.f).toBeGreaterThan(far.f)
    expect(near.depth).toBeLessThan(far.depth)
  })

  it('屏幕 y 轴已翻转: z 越大越靠上', () => {
    const cam = makeCamera({ yaw: 0, pitch: 0, cy: 0 })
    expect(project([0, 0, 1], cam).y).toBeLessThan(project([0, 0, -1], cam).y)
  })
})

describe('proj3d 采样', () => {
  it('sampleSurface 返回 (uSteps+1)×(vSteps+1) 网格', () => {
    const g = sampleSurface((u, v) => [u, v, 0], [0, 1], [0, 2], 4, 6)
    expect(g.length).toBe(5)
    expect(g[0].length).toBe(7)
    expect(g[4][6]).toEqual([1, 2, 0])
  })

  it('sampleCurve 覆盖闭区间两端', () => {
    const c = sampleCurve(t => [t, 0, 0], [-1, 3], 8)
    expect(c.length).toBe(9)
    expect(c[0][0]).toBeCloseTo(-1, 10)
    expect(c[8][0]).toBeCloseTo(3, 10)
  })
})

describe('proj3d 面片与光照', () => {
  it('xy 平面上的三点法向为 ±z 且单位长', () => {
    const n = faceNormal([0, 0, 0], [1, 0, 0], [0, 1, 0])
    expect(Math.abs(n[2])).toBeCloseTo(1, 10)
    expect(Math.hypot(...n)).toBeCloseTo(1, 10)
  })

  it('退化三角形不产生 NaN', () => {
    const n = faceNormal([1, 1, 1], [1, 1, 1], [1, 1, 1])
    expect(n.every(Number.isFinite)).toBe(true)
  })

  it('buildQuads 面片数为 (rows-1)*(cols-1)', () => {
    const g = sampleSurface((u, v) => [u, v, u * v], [0, 1], [0, 1], 5, 4)
    expect(buildQuads(g).length).toBe(5 * 4)
  })

  it('单行网格切不出面片', () => {
    expect(buildQuads([[[0, 0, 0], [1, 0, 0]]]).length).toBe(0)
  })

  it('depthSortQuads 按深度从远到近排列', () => {
    const cam = makeCamera({ yaw: 0, pitch: 0 })
    const g = sampleSurface((u, v) => [u, v, 0], [0, 1], [0, 1], 3, 3)
    const sorted = depthSortQuads(buildQuads(g), cam)
    const depths = sorted.map(q => rotate(q.center, cam.yaw, cam.pitch)[1])
    for (let i = 1; i < depths.length; i++) {
      expect(depths[i]).toBeLessThanOrEqual(depths[i - 1] + 1e-12)
    }
  })

  it('shade 落在 [0.35,1] 且与法向朝背无关(单侧曲面两面都亮)', () => {
    for (const n of [[0, 0, 1], [0, 0, -1], [1, 0, 0], [0.577, 0.577, 0.577]] as Vec3[]) {
      const s = shade(n)
      expect(s).toBeGreaterThanOrEqual(0.35)
      expect(s).toBeLessThanOrEqual(1.0000001)
    }
    expect(shade([0, 0, 1])).toBeCloseTo(shade([0, 0, -1]), 10)
  })
})

describe('proj3d 配色与归一化', () => {
  it('rampColor 端点取到配色带首尾色', () => {
    expect(rampColor(0, 'viridis')).toBe('rgb(68, 1, 84)')
    expect(rampColor(1, 'viridis')).toBe('rgb(253, 231, 37)')
  })

  it('rampColor 越界与 NaN 都被夹住', () => {
    expect(rampColor(-5, 'viridis')).toBe('rgb(68, 1, 84)')
    expect(rampColor(9, 'viridis')).toBe('rgb(253, 231, 37)')
    expect(rampColor(NaN, 'viridis')).toBe('rgb(68, 1, 84)')
  })

  it('未知配色带回退到 viridis', () => {
    expect(rampColor(0, 'no-such-ramp')).toBe(rampColor(0, 'viridis'))
  })

  it('bounds 求出包围盒与中心', () => {
    const b = bounds([[0, 0, 0], [2, 4, 6]])
    expect(b.min).toEqual([0, 0, 0])
    expect(b.max).toEqual([2, 4, 6])
    expect(b.center).toEqual([1, 2, 3])
  })

  it('空点集的 bounds 有安全兜底', () => {
    const b = bounds([])
    expect(b.radius).toBeGreaterThan(0)
    expect(b.center).toEqual([0, 0, 0])
  })

  it('normalizePoints 把点集缩放到单位半径且居中', () => {
    const out = normalizePoints([[10, 10, 10], [30, 30, 30], [20, 20, 20]])
    const b = bounds(out)
    expect(b.radius).toBeCloseTo(1, 6)
    expect(Math.hypot(...b.center)).toBeCloseTo(0, 6)
  })

  it('normalizeGrid 保持行列结构', () => {
    const g = sampleSurface((u, v) => [u * 50, v * 50, 0], [0, 1], [0, 1], 3, 5)
    const out = normalizeGrid(g)
    expect(out.length).toBe(4)
    expect(out[0].length).toBe(6)
    expect(bounds(out.flat()).radius).toBeCloseTo(1, 6)
  })
})
