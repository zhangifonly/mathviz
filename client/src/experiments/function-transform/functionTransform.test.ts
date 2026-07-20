import { describe, it, expect } from 'vitest'
import {
  transform, sample, getBase, describe as describeT,
  IDENTITY, BASES, A_VALUES,
} from './functionTransform'

const sq = (x: number) => x * x

describe('函数图象变换', () => {
  it('恒等变换不改变函数值', () => {
    const g = transform(sq, IDENTITY)
    for (const x of [-2, -1, 0, 1, 3]) {
      expect(g(x)).toBeCloseTo(sq(x))
    }
  })

  it('h 水平平移：g(x)=f(x-h)', () => {
    const g = transform(sq, { a: 1, b: 1, h: 2, k: 0 })
    expect(g(2)).toBeCloseTo(0) // 顶点从 0 移到 2
    expect(g(3)).toBeCloseTo(1)
  })

  it('k 竖直平移：整体上移', () => {
    const g = transform(sq, { a: 1, b: 1, h: 0, k: 3 })
    expect(g(0)).toBeCloseTo(3)
    expect(g(1)).toBeCloseTo(4)
  })

  it('a<0 关于 x 轴翻折，|a| 竖直伸缩', () => {
    const g = transform(sq, { a: -2, b: 1, h: 0, k: 0 })
    expect(g(1)).toBeCloseTo(-2)
    expect(g(2)).toBeCloseTo(-8)
  })

  it('b 水平伸缩：g(x)=f(b*x)', () => {
    const g = transform(sq, { a: 1, b: 2, h: 0, k: 0 })
    expect(g(1)).toBeCloseTo(4) // f(2)=4
    const neg = transform((x) => x, { a: 1, b: -1, h: 0, k: 0 })
    expect(neg(3)).toBeCloseTo(-3) // y 轴翻折
  })

  it('sample 返回 n 个点且端点正确', () => {
    const pts = sample(sq, -2, 2, 5)
    expect(pts.length).toBe(5)
    expect(pts[0]).toEqual([-2, 4])
    expect(pts[4]).toEqual([2, 4])
    expect(sample(sq, 0, 1, 1).length).toBe(0)
  })

  it('getBase 与 BASES 常量', () => {
    expect(getBase('sin').key).toBe('sin')
    expect(getBase('nope').key).toBe(BASES[0].key)
    expect(A_VALUES).toContain(-1)
  })

  it('describe 能识别翻折与平移', () => {
    expect(describeT(IDENTITY)).toBe('与基函数重合')
    expect(describeT({ a: -1, b: 1, h: 1, k: 0 })).toContain('翻折')
    expect(describeT({ a: 1, b: 1, h: 1, k: 0 })).toContain('右移')
  })
})
