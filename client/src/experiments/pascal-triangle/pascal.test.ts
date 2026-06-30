import { describe, it, expect } from 'vitest'
import { pascalRows, pascalMod, countNonZero, MOD_OPTIONS } from './pascal'

describe('帕斯卡三角与模染色', () => {
  it('pascalRows 前 5 行正确', () => {
    const tri = pascalRows(5)
    expect(tri[0]).toEqual([1])
    expect(tri[1]).toEqual([1, 1])
    expect(tri[2]).toEqual([1, 2, 1])
    expect(tri[3]).toEqual([1, 3, 3, 1])
    expect(tri[4]).toEqual([1, 4, 6, 4, 1])
  })

  it('每行长度等于行号+1', () => {
    const tri = pascalRows(10)
    for (let i = 0; i < 10; i++) expect(tri[i].length).toBe(i + 1)
  })

  it('pascalMod 与 pascalRows 取余一致（小行数）', () => {
    const full = pascalRows(12)
    const mod = pascalMod(12, 3)
    for (let i = 0; i < 12; i++)
      for (let j = 0; j <= i; j++) expect(mod[i][j]).toBe(full[i][j] % 3)
  })

  it('pascalMod(行,2) 第 4 行 (1,4,6,4,1) → (1,0,0,0,1)', () => {
    const mod = pascalMod(5, 2)
    expect(mod[4]).toEqual([1, 0, 0, 0, 1])
  })

  it('countNonZero: mod 2 时非零数即奇数个数', () => {
    const mod = pascalMod(5, 2)
    // 行: [1][1,1][1,0,1][1,1,1,1][1,0,0,0,1] → 1+2+2+4+2 = 11 个非零
    expect(countNonZero(mod)).toBe(11)
  })

  it('MOD_OPTIONS 都能正常生成', () => {
    for (const opt of MOD_OPTIONS) {
      const tri = pascalMod(20, opt.mod)
      expect(tri.length).toBe(20)
      for (const row of tri) for (const v of row) expect(v).toBeLessThan(opt.mod)
    }
  })
})
