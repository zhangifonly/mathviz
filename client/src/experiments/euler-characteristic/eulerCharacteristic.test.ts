import { describe, it, expect } from 'vitest'
import {
  eulerChar, polyhedronChar, isConvexEuler, genusChar, POLYHEDRA, TORUS,
} from './eulerCharacteristic'

describe('欧拉示性数', () => {
  it('eulerChar 计算 V-E+F', () => {
    expect(eulerChar(8, 12, 6)).toBe(2)
    expect(eulerChar(4, 6, 4)).toBe(2)
    expect(eulerChar(0, 0, 0)).toBe(0)
  })

  it('五种正多面体都满足 V-E+F=2', () => {
    for (const p of POLYHEDRA) {
      expect(polyhedronChar(p)).toBe(2)
      expect(isConvexEuler(p)).toBe(true)
    }
  })

  it('POLYHEDRA 恰好 5 个且字段合法', () => {
    expect(POLYHEDRA.length).toBe(5)
    for (const p of POLYHEDRA) {
      expect(p.V).toBeGreaterThan(0)
      expect(p.E).toBeGreaterThan(0)
      expect(p.F).toBeGreaterThan(0)
      expect(p.color).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('环面示性数为 0，且不满足凸多面体公式', () => {
    expect(polyhedronChar(TORUS)).toBe(0)
    expect(isConvexEuler(TORUS)).toBe(false)
  })

  it('genusChar 给出 χ = 2 - 2g', () => {
    expect(genusChar(0)).toBe(2) // 球面
    expect(genusChar(1)).toBe(0) // 环面
    expect(genusChar(2)).toBe(-2) // 双环面
  })

  it('对偶多面体棱数相同、V 与 F 互换', () => {
    const cube = POLYHEDRA.find((p) => p.name === '立方体')!
    const octa = POLYHEDRA.find((p) => p.name === '八面体')!
    expect(cube.E).toBe(octa.E)
    expect(cube.V).toBe(octa.F)
    expect(cube.F).toBe(octa.V)
  })
})
