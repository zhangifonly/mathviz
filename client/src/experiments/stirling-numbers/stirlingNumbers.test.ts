import { describe, it, expect } from 'vitest'
import {
  stirling2,
  stirling1,
  stirlingTriangle,
  bellNumber,
  MAX_N,
  N_CHOICES,
} from './stirlingNumbers'

describe('斯特林数', () => {
  it('第二类边界与已知小值正确', () => {
    expect(stirling2(0, 0)).toBe(1)
    expect(stirling2(3, 0)).toBe(0)
    expect(stirling2(4, 1)).toBe(1) // 只有一个大子集
    expect(stirling2(4, 4)).toBe(1) // 每人独立成子集
    expect(stirling2(4, 2)).toBe(7)
    expect(stirling2(5, 3)).toBe(25)
  })

  it('第二类满足递推 S(n,k)=k*S(n-1,k)+S(n-1,k-1)', () => {
    for (let n = 1; n <= MAX_N; n++) {
      for (let k = 1; k <= n; k++) {
        expect(stirling2(n, k)).toBe(k * stirling2(n - 1, k) + stirling2(n - 1, k - 1))
      }
    }
  })

  it('第一类无符号边界与已知小值正确', () => {
    expect(stirling1(0, 0)).toBe(1)
    expect(stirling1(4, 4)).toBe(1)
    expect(stirling1(4, 1)).toBe(6) // (n-1)! 个循环
    expect(stirling1(3, 2)).toBe(3)
    expect(stirling1(4, 2)).toBe(11)
  })

  it('第一类行和等于 n!（无符号循环数之和）', () => {
    const fact = (m: number): number => (m <= 1 ? 1 : m * fact(m - 1))
    for (let n = 0; n <= MAX_N; n++) {
      let sum = 0
      for (let k = 0; k <= n; k++) sum += stirling1(n, k)
      expect(sum).toBe(fact(n))
    }
  })

  it('贝尔数为第二类行和，前几项正确', () => {
    expect([0, 1, 2, 3, 4, 5].map(bellNumber)).toEqual([1, 1, 2, 5, 15, 52])
  })

  it('stirlingTriangle 形状与首列正确', () => {
    const tri = stirlingTriangle(MAX_N, 'second')
    expect(tri.length).toBe(MAX_N + 1)
    tri.forEach((row, n) => {
      expect(row.length).toBe(n + 1)
    })
    expect(tri[0]).toEqual([1])
    for (const n of N_CHOICES) expect(tri[n][n]).toBe(1)
  })
})
