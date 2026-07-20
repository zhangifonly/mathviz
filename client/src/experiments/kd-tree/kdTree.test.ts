import { describe, it, expect } from 'vitest'
import {
  makePoints,
  buildKdTree,
  nearestNeighbor,
  dist2,
  POINT_COUNTS,
  type Point,
} from './kdTree'

// 朴素最近邻，用于对拍验证
function brute(points: Point[], q: Point): Point {
  let best = points[0]
  let bd = Infinity
  for (const p of points) {
    const d = dist2(p, q)
    if (d < bd) {
      bd = d
      best = p
    }
  }
  return best
}

describe('KD 树', () => {
  it('makePoints 生成指定数量点，坐标在范围内且可复现', () => {
    const a = makePoints(16, 600, 400, 42)
    const b = makePoints(16, 600, 400, 42)
    expect(a.length).toBe(16)
    expect(a).toEqual(b)
    for (const p of a) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(600)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(400)
    }
  })

  it('buildKdTree 根节点按 x 轴切分，子节点交替轴', () => {
    const tree = buildKdTree(makePoints(8, 500, 500, 1))
    expect(tree).not.toBeNull()
    expect(tree!.axis).toBe(0)
    if (tree!.left) expect(tree!.left.axis).toBe(1)
    if (tree!.right) expect(tree!.right.axis).toBe(1)
  })

  it('空点集构建返回 null', () => {
    expect(buildKdTree([])).toBeNull()
    expect(nearestNeighbor(null, { x: 0, y: 0 }).best).toBeNull()
  })

  it('nearestNeighbor 结果与暴力搜索一致', () => {
    for (const n of POINT_COUNTS) {
      const pts = makePoints(n, 600, 400, n)
      const tree = buildKdTree(pts)
      for (let i = 0; i < 5; i++) {
        const q = { x: (i * 97) % 600, y: (i * 53) % 400 }
        const kd = nearestNeighbor(tree, q).best!
        const bf = brute(pts, q)
        expect(dist2(kd, q)).toBeCloseTo(dist2(bf, q))
      }
    }
  })

  it('查询点等于某个点时距离为 0', () => {
    const pts = makePoints(16, 600, 400, 7)
    const tree = buildKdTree(pts)
    for (const p of pts) {
      expect(nearestNeighbor(tree, p).bestDist2).toBe(0)
    }
  })

  it('剪枝有效：访问节点数不超过总点数', () => {
    const pts = makePoints(32, 600, 400, 3)
    const tree = buildKdTree(pts)
    const r = nearestNeighbor(tree, { x: 300, y: 200 })
    expect(r.visited).toBeGreaterThan(0)
    expect(r.visited).toBeLessThanOrEqual(32)
  })
})
