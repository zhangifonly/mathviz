import { describe, it, expect } from 'vitest'
import { expand, turtle, PRESETS } from './lsystem'

describe('L-系统', () => {
  it('expand 0 次返回公理本身', () => {
    expect(expand('F', { F: 'F+F' }, 0)).toBe('F')
  })

  it('expand 科赫规则正确展开', () => {
    expect(expand('F', { F: 'F+F-F-F+F' }, 1)).toBe('F+F-F-F+F')
    // 二次展开：每个 F 再替换
    expect(expand('F', { F: 'F+F-F-F+F' }, 2)).toBe('F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F')
  })

  it('expand 保留无规则字符（如 + - [ ]）', () => {
    expect(expand('F+[F]', { F: 'FF' }, 1)).toBe('FF+[FF]')
  })

  it('turtle: 单个 F 生成一条线段', () => {
    const segs = turtle('F', 90, 10, 0)
    expect(segs.length).toBe(1)
    expect(segs[0].x1).toBeCloseTo(0, 6)
    expect(segs[0].x2).toBeCloseTo(10, 6)
    expect(segs[0].y2).toBeCloseTo(0, 6)
  })

  it('turtle: + 转角改变方向', () => {
    const segs = turtle('F+F', 90, 10, 0)
    expect(segs.length).toBe(2)
    // 第一段沿 x，第二段转 90 度沿 y
    expect(segs[1].x2 - segs[1].x1).toBeCloseTo(0, 5)
    expect(Math.abs(segs[1].y2 - segs[1].y1)).toBeCloseTo(10, 5)
  })

  it('turtle: 括号 [] 入栈出栈恢复位置', () => {
    const segs = turtle('F[+F]F', 90, 10, 0)
    // 3 条线段，第 3 段从第 1 段末端继续（栈恢复）
    expect(segs.length).toBe(3)
    expect(segs[2].x1).toBeCloseTo(10, 5)
    expect(segs[2].y1).toBeCloseTo(0, 5)
  })

  it('PRESETS 都能展开并生成线段', () => {
    for (const key of Object.keys(PRESETS)) {
      const { sys } = PRESETS[key]
      // 用较小迭代次数避免测试过慢
      const n = Math.min(sys.iterations, 4)
      const str = expand(sys.axiom, sys.rules, n)
      const segs = turtle(str, sys.angle, 5)
      expect(segs.length).toBeGreaterThan(0)
    }
  })
})
