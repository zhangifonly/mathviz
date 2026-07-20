import { describe, it, expect } from 'vitest'
import { pascalRow, binomialCoeff, expandTerms, EXPONENTS } from './binomialTheorem'

describe('二项式定理', () => {
  it('pascalRow 生成正确的杨辉三角行', () => {
    expect(pascalRow(0)).toEqual([1])
    expect(pascalRow(1)).toEqual([1, 1])
    expect(pascalRow(4)).toEqual([1, 4, 6, 4, 1])
    expect(pascalRow(5)).toEqual([1, 5, 10, 10, 5, 1])
  })

  it('pascalRow 每行对称且首尾为 1', () => {
    for (let n = 0; n <= 8; n++) {
      const row = pascalRow(n)
      expect(row.length).toBe(n + 1)
      expect(row[0]).toBe(1)
      expect(row[n]).toBe(1)
      for (let k = 0; k <= n; k++) {
        expect(row[k]).toBe(row[n - k])
      }
    }
  })

  it('binomialCoeff 与已知值一致，越界为 0', () => {
    expect(binomialCoeff(5, 2)).toBe(10)
    expect(binomialCoeff(6, 3)).toBe(20)
    expect(binomialCoeff(4, 0)).toBe(1)
    expect(binomialCoeff(4, 4)).toBe(1)
    expect(binomialCoeff(5, -1)).toBe(0)
    expect(binomialCoeff(5, 6)).toBe(0)
  })

  it('binomialCoeff 满足帕斯卡递推关系', () => {
    for (let n = 1; n <= 10; n++) {
      for (let k = 1; k < n; k++) {
        expect(binomialCoeff(n, k)).toBe(
          binomialCoeff(n - 1, k - 1) + binomialCoeff(n - 1, k),
        )
      }
    }
  })

  it('expandTerms 幂次和恒为 n，系数即杨辉三角', () => {
    const terms = expandTerms(4)
    expect(terms.length).toBe(5)
    expect(terms.map((t) => t.coeff)).toEqual([1, 4, 6, 4, 1])
    for (const t of terms) {
      expect(t.aPow + t.bPow).toBe(4)
    }
    expect(terms[0]).toEqual({ coeff: 1, aPow: 4, bPow: 0 })
  })

  it('系数之和等于 2^n', () => {
    for (const n of EXPONENTS) {
      const sum = pascalRow(n).reduce((s, c) => s + c, 0)
      expect(sum).toBe(2 ** n)
    }
  })
})
