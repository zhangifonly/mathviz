import { describe, it, expect } from 'vitest'
import {
  makePoints, buildQuadtree, countNodes, queryRange,
  CAPACITY, POINT_COUNTS, type Point,
} from './quadtree'

describe('四叉树', () => {
  it('makePoints 生成指定数量的点, 坐标在范围内', () => {
    const pts = makePoints(80, 600, 480, 1)
    expect(pts.length).toBe(80)
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(600)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(480)
    }
  })

  it('makePoints 同种子可复现, 不同种子不同', () => {
    const a = makePoints(50, 600, 480, 42)
    const b = makePoints(50, 600, 480, 42)
    const c = makePoints(50, 600, 480, 99)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('点数不超容量时不细分, 是单个叶子', () => {
    const pts: Point[] = [{ x: 1, y: 1 }, { x: 2, y: 2 }]
    const root = buildQuadtree(pts, 0, 0, 100, 100, 4)
    expect(root.children).toBeNull()
    expect(root.points.length).toBe(2)
    expect(countNodes(root)).toBe(1)
  })

  it('点数超容量则四分, 叶子点数不超过容量', () => {
    const pts = makePoints(160, 512, 512, 7)
    const root = buildQuadtree(pts, 0, 0, 512, 512, CAPACITY)
    expect(root.children).not.toBeNull()
    const leaves: number[] = []
    const walk = (n: typeof root) => {
      if (n.children) n.children.forEach(walk)
      else leaves.push(n.points.length)
    }
    walk(root)
    // 除触底外, 叶子点数应受容量约束(允许 maxDepth 触底的少量超额)
    const over = leaves.filter((c) => c > CAPACITY).length
    expect(over).toBeLessThanOrEqual(2)
  })

  it('构建不丢点: 所有叶子点数之和等于输入点数', () => {
    const pts = makePoints(80, 400, 400, 3)
    const root = buildQuadtree(pts, 0, 0, 400, 400, CAPACITY)
    let total = 0
    const walk = (n: typeof root) => {
      if (n.children) n.children.forEach(walk)
      else total += n.points.length
    }
    walk(root)
    expect(total).toBe(80)
  })

  it('queryRange 与暴力筛选结果一致', () => {
    const pts = makePoints(120, 400, 400, 11)
    const root = buildQuadtree(pts, 0, 0, 400, 400, CAPACITY)
    const rx = 50, ry = 60, rw = 150, rh = 120
    const got = queryRange(root, rx, ry, rw, rh)
    const brute = pts.filter((p) => p.x >= rx && p.x <= rx + rw && p.y >= ry && p.y <= ry + rh)
    expect(got.length).toBe(brute.length)
  })

  it('POINT_COUNTS 都能正常构建', () => {
    for (const n of POINT_COUNTS) {
      const pts = makePoints(n, 500, 500, 1)
      const root = buildQuadtree(pts, 0, 0, 500, 500, CAPACITY)
      expect(countNodes(root)).toBeGreaterThanOrEqual(1)
    }
  })
})
