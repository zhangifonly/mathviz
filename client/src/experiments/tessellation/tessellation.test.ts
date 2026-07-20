import { describe, it, expect } from 'vitest'
import { interiorAngle, canTessellate, tilingCells, TILINGS } from './tessellation'

describe('密铺镶嵌', () => {
  it('interiorAngle 计算正确', () => {
    expect(interiorAngle(3)).toBeCloseTo(60)
    expect(interiorAngle(4)).toBeCloseTo(90)
    expect(interiorAngle(6)).toBeCloseTo(120)
    expect(interiorAngle(12)).toBeCloseTo(150)
  })

  it('canTessellate: 仅正三角形、正方形、正六边形可单一密铺', () => {
    expect(canTessellate(3)).toBe(true)
    expect(canTessellate(4)).toBe(true)
    expect(canTessellate(6)).toBe(true)
  })

  it('canTessellate: 五边形、七边形等不能单一密铺', () => {
    expect(canTessellate(5)).toBe(false)
    expect(canTessellate(7)).toBe(false)
    expect(canTessellate(8)).toBe(false)
    expect(canTessellate(2)).toBe(false)
  })

  it('tilingCells 生成 cols*rows 个多边形', () => {
    for (const t of TILINGS) {
      const cells = tilingCells(t, 4, 3, 40)
      expect(cells.length).toBe(12)
    }
  })

  it('三角形3顶点、正方形4顶点、六边形6顶点', () => {
    expect(tilingCells('triangle', 2, 2)[0].points.length).toBe(3)
    expect(tilingCells('square', 2, 2)[0].points.length).toBe(4)
    expect(tilingCells('hexagon', 2, 2)[0].points.length).toBe(6)
  })

  it('每个单元都有合法颜色与有限坐标', () => {
    const cells = tilingCells('hexagon', 3, 3, 30)
    for (const c of cells) {
      expect(c.color).toMatch(/^#[0-9a-f]{6}$/i)
      for (const p of c.points) {
        expect(Number.isFinite(p.x)).toBe(true)
        expect(Number.isFinite(p.y)).toBe(true)
      }
    }
  })

  it('TILINGS 恰好三种规则密铺', () => {
    expect(TILINGS).toEqual(['triangle', 'square', 'hexagon'])
  })
})
