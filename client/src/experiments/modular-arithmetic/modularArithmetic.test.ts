import { describe, it, expect } from 'vitest'
import {
  mod,
  addMod,
  mulMod,
  powMod,
  isCongruent,
  buildCircleData,
  pointOnCircle,
  MULTIPLIER_OPTIONS,
} from './modularArithmetic'

describe('模运算与同余', () => {
  it('mod 对负数也返回 [0, n) 内的结果', () => {
    expect(mod(7, 5)).toBe(2)
    expect(mod(-1, 5)).toBe(4)
    expect(mod(-7, 5)).toBe(3)
    expect(mod(0, 5)).toBe(0)
    expect(mod(10, 5)).toBe(0)
  })

  it('时钟模型 mod 12：15 点即下午 3 点', () => {
    expect(mod(15, 12)).toBe(3)
    expect(mod(24, 12)).toBe(0)
    expect(mod(-3, 12)).toBe(9)
  })

  it('模加法与模乘法正确', () => {
    expect(addMod(9, 5, 12)).toBe(2)
    expect(mulMod(7, 8, 10)).toBe(6)
    expect(mulMod(0, 123, 7)).toBe(0)
  })

  it('powMod 快速幂与朴素幂一致', () => {
    expect(powMod(3, 4, 100)).toBe(81)
    expect(powMod(2, 10, 1000)).toBe(24)
    expect(powMod(5, 0, 7)).toBe(1)
    expect(powMod(7, 3, 1)).toBe(0)
  })

  it('费马小定理：a^(p-1) ≡ 1 (mod p)，p 为素数且不整除 a', () => {
    // p = 7, a = 3 → 3^6 mod 7 = 1
    expect(powMod(3, 6, 7)).toBe(1)
    expect(powMod(2, 12, 13)).toBe(1)
    expect(powMod(10, 16, 17)).toBe(1)
  })

  it('isCongruent 判断同余', () => {
    expect(isCongruent(17, 5, 12)).toBe(true)
    expect(isCongruent(38, 2, 12)).toBe(true)
    expect(isCongruent(7, 8, 12)).toBe(false)
  })

  it('buildCircleData 生成 n 条弦，连线为 i -> (i*k) mod n', () => {
    const data = buildCircleData(10, 2)
    expect(data.chords.length).toBe(10)
    expect(data.chords[0]).toEqual([0, 0])
    expect(data.chords[3]).toEqual([3, 6])
    expect(data.chords[7]).toEqual([7, 4]) // 7*2=14, 14 mod 10 = 4
  })

  it('pointOnCircle 顶部起点，半径正确', () => {
    const p0 = pointOnCircle(0, 4, 100)
    expect(p0.x).toBeCloseTo(0)
    expect(p0.y).toBeCloseTo(-100) // 顶部
    const p1 = pointOnCircle(1, 4, 100)
    expect(p1.x).toBeCloseTo(100) // 顺时针到右侧
    expect(p1.y).toBeCloseTo(0)
  })

  it('MULTIPLIER_OPTIONS 都能正常构造圆环数据', () => {
    for (const opt of MULTIPLIER_OPTIONS) {
      const data = buildCircleData(200, opt.k)
      expect(data.chords.length).toBe(200)
      for (const [from, to] of data.chords) {
        expect(from).toBeGreaterThanOrEqual(0)
        expect(from).toBeLessThan(200)
        expect(to).toBeGreaterThanOrEqual(0)
        expect(to).toBeLessThan(200)
      }
    }
  })
})
