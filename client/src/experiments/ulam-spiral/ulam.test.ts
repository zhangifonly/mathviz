import { describe, it, expect } from 'vitest'
import { sieve, isPrime, ulamSpiral, countPrimes } from './ulam'

describe('素数螺旋', () => {
  it('sieve 正确标出小素数', () => {
    const p = sieve(20)
    expect(p[2]).toBe(true)
    expect(p[3]).toBe(true)
    expect(p[4]).toBe(false)
    expect(p[17]).toBe(true)
    expect(p[1]).toBe(false)
    expect(p[0]).toBe(false)
  })

  it('isPrime 与 sieve 一致', () => {
    const p = sieve(100)
    for (let n = 0; n <= 100; n++) {
      expect(isPrime(n)).toBe(p[n])
    }
  })

  it('ulamSpiral 生成正确数量的格子，从中心开始', () => {
    const cells = ulamSpiral(25)
    expect(cells.length).toBe(25)
    expect(cells[0].n).toBe(1)
    expect(cells[0].x).toBe(0)
    expect(cells[0].y).toBe(0)
  })

  it('ulamSpiral 螺旋路径：第 2 个数在中心右侧 (1,0)', () => {
    const cells = ulamSpiral(10)
    expect(cells[1].x).toBe(1)
    expect(cells[1].y).toBe(0)
  })

  it('ulamSpiral 坐标互不重复', () => {
    const cells = ulamSpiral(100)
    const seen = new Set(cells.map((c) => `${c.x},${c.y}`))
    expect(seen.size).toBe(100)
  })

  it('countPrimes 统计正确：1-10 内有 4 个素数 (2,3,5,7)', () => {
    const cells = ulamSpiral(10)
    expect(countPrimes(cells)).toBe(4)
  })
})
