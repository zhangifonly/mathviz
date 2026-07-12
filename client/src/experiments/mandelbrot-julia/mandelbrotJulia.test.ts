import { describe, it, expect } from 'vitest'
import {
  escapeTime,
  mandelbrotEscape,
  juliaEscape,
  smoothEscape,
  JULIA_OPTIONS,
} from './mandelbrotJulia'

describe('曼德博集与朱利亚集', () => {
  it('原点 c=0 永不逃逸（属于曼德博集）', () => {
    expect(mandelbrotEscape(0, 0, 100)).toBe(100)
  })

  it('明显发散的 c=2 立刻逃逸', () => {
    // z0=0 -> 2 -> 6 ...，第 1 步 |z|=2 未超，第 2 步 |z|=6 逃逸
    expect(mandelbrotEscape(2, 0, 100)).toBeLessThan(5)
  })

  it('主心形内部的点 c=-0.5 不逃逸', () => {
    expect(mandelbrotEscape(-0.5, 0, 200)).toBe(200)
  })

  it('周期 2 圆盘中心 c=-1 不逃逸', () => {
    expect(mandelbrotEscape(-1, 0, 200)).toBe(200)
  })

  it('远离集合的点逃逸步数很小', () => {
    expect(mandelbrotEscape(3, 3, 100)).toBeLessThan(3)
  })

  it('juliaEscape: c=0 时 |z0|<1 不逃逸，|z0|>1 逃逸', () => {
    // c=0 -> z 平方迭代，单位圆内收敛，圆外发散
    expect(juliaEscape(0.5, 0, 0, 0, 100)).toBe(100)
    expect(juliaEscape(1.5, 0, 0, 0, 100)).toBeLessThan(100)
  })

  it('escapeTime 与 mandelbrotEscape 在 z0=0 时等价', () => {
    for (const [cx, cy] of [[0.1, 0.1], [-0.7, 0.2], [0.3, -0.5]]) {
      expect(escapeTime(cx, cy, 0, 0, 80)).toBe(mandelbrotEscape(cx, cy, 80))
    }
  })

  it('smoothEscape 逃逸时返回值大于等于整数逃逸步数', () => {
    const raw = mandelbrotEscape(0.4, 0.4, 100)
    const smooth = smoothEscape(0.4, 0.4, 0, 0, 100)
    expect(smooth).toBeGreaterThanOrEqual(raw)
    expect(Number.isFinite(smooth)).toBe(true)
  })

  it('迭代步数越多，判定越严格（逃逸步数不减）', () => {
    const a = mandelbrotEscape(0.26, 0, 50)
    const b = mandelbrotEscape(0.26, 0, 200)
    expect(b).toBeGreaterThanOrEqual(a)
  })

  it('JULIA_OPTIONS 参数有效且模长合理', () => {
    expect(JULIA_OPTIONS.length).toBeGreaterThanOrEqual(4)
    for (const opt of JULIA_OPTIONS) {
      expect(Number.isFinite(opt.cx)).toBe(true)
      expect(Number.isFinite(opt.cy)).toBe(true)
      expect(opt.label.length).toBeGreaterThan(0)
      expect(opt.note.length).toBeGreaterThan(0)
      // 经典朱利亚参数都在 |c| < 2 内
      expect(Math.hypot(opt.cx, opt.cy)).toBeLessThan(2)
    }
  })
})
