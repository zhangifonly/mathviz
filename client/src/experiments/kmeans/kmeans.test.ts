import { describe, it, expect } from 'vitest'
import {
  makePoints,
  dist2,
  assignPoints,
  updateCenters,
  kmeansStep,
  runKmeans,
  K_VALUES,
  N_CLUSTERS,
} from './kmeans'

describe('K-means 聚类', () => {
  it('makePoints 生成指定数量的点，坐标在合理范围', () => {
    const pts = makePoints(60, 600, 480, 1)
    expect(pts.length).toBe(60)
    for (const p of pts) {
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Number.isFinite(p.y)).toBe(true)
    }
  })

  it('makePoints 同种子可复现，不同种子不同', () => {
    const a = makePoints(40, 600, 480, 5)
    const b = makePoints(40, 600, 480, 5)
    const c = makePoints(40, 600, 480, 9)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('dist2 与 assignPoints 归属最近中心', () => {
    expect(dist2({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(25)
    const pts = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 51, y: 0 }]
    const centers = [{ x: 0, y: 0 }, { x: 100, y: 0 }]
    expect(assignPoints(pts, centers)).toEqual([0, 1, 1])
  })

  it('updateCenters 取簇均值', () => {
    const pts = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 10, y: 10 }]
    const centers = updateCenters(pts, [0, 0, 1], 2)
    expect(centers[0]).toEqual({ x: 1, y: 0 })
    expect(centers[1]).toEqual({ x: 10, y: 10 })
  })

  it('kmeansStep 使总失真不增大（单调收敛）', () => {
    const pts = makePoints(80, 600, 480, 3)
    let centers = [pts[0], pts[10], pts[20]]
    const inertia = (cs: typeof centers, as: number[]) =>
      pts.reduce((acc, p, i) => acc + dist2(p, cs[as[i]]), 0)
    const a = assignPoints(pts, centers)
    let prev = inertia(centers, a)
    for (let i = 0; i < 5; i++) {
      const f = kmeansStep(pts, centers)
      centers = f.centers
      const cur = inertia(centers, f.assign)
      expect(cur).toBeLessThanOrEqual(prev + 1e-6)
      prev = cur
    }
  })

  it('runKmeans 收敛：最后一帧中心不再移动', () => {
    const frames = runKmeans(makePoints(90, 600, 480, 2), 3, 1)
    expect(frames.length).toBeGreaterThan(1)
    const last = frames[frames.length - 1]
    const prev = frames[frames.length - 2]
    for (let i = 0; i < last.centers.length; i++) {
      expect(dist2(last.centers[i], prev.centers[i])).toBeLessThan(1e-3)
    }
  })

  it('K_VALUES / N_CLUSTERS 常量可用', () => {
    expect(K_VALUES.length).toBeGreaterThan(0)
    expect(N_CLUSTERS).toBeGreaterThan(0)
    for (const k of K_VALUES) {
      const frames = runKmeans(makePoints(60, 500, 500, 1), k, 1)
      expect(frames[0].centers.length).toBe(k)
    }
  })
})
