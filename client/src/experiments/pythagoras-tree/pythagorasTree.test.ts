import { describe, it, expect } from 'vitest'
import { buildTree, squareCount, treeBounds, DEPTHS } from './pythagorasTree'

describe('毕达哥拉斯树', () => {
  it('squareCount 满足 2^(depth+1)-1', () => {
    expect(squareCount(0)).toBe(1)
    expect(squareCount(1)).toBe(3)
    expect(squareCount(2)).toBe(7)
    expect(squareCount(6)).toBe(127)
  })

  it('buildTree 返回的正方形数量与 squareCount 一致', () => {
    for (const d of [0, 1, 2, 3, 5]) {
      expect(buildTree(d).length).toBe(squareCount(d))
    }
  })

  it('每个正方形恰有 4 个顶点，边长相等（是正方形）', () => {
    const squares = buildTree(3, 45)
    for (const sq of squares) {
      expect(sq.points.length).toBe(4)
      const [a, b, c, d] = sq.points
      const s1 = Math.hypot(b.x - a.x, b.y - a.y)
      const s2 = Math.hypot(c.x - b.x, c.y - b.y)
      const s3 = Math.hypot(d.x - c.x, d.y - c.y)
      expect(s2).toBeCloseTo(s1, 6)
      expect(s3).toBeCloseTo(s1, 6)
    }
  })

  it('根正方形是单位正方形，位于原点', () => {
    const root = buildTree(0)[0]
    expect(root.points[0]).toEqual({ x: 0, y: 0 })
    expect(root.points[1]).toEqual({ x: 1, y: 0 })
    expect(root.level).toBe(0)
  })

  it('不同倾角生成不同形状的树，且树冠高于树干', () => {
    const a = treeBounds(buildTree(6, 30))
    const b = treeBounds(buildTree(6, 55))
    // 倾角不同，包围盒不同
    expect(a.maxX - a.minX).not.toBeCloseTo(b.maxX - b.minX, 3)
    // 树向上生长：顶部远高于根正方形（高度=1）
    expect(a.maxY).toBeGreaterThan(1)
    expect(b.maxY).toBeGreaterThan(1)
  })

  it('DEPTHS 常量都能构建出正确数量的正方形', () => {
    for (const d of DEPTHS) {
      expect(buildTree(d, 45).length).toBe(squareCount(d))
    }
  })
})
