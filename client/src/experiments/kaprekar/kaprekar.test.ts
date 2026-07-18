import { describe, it, expect } from 'vitest'
import {
  digitsOf,
  kaprekarStep,
  kaprekarChain,
  stepsToKaprekar,
  isRepdigit,
  KAPREKAR_CONSTANT,
  SAMPLES,
} from './kaprekar'

describe('卡普雷卡常数', () => {
  it('digitsOf 补齐到四位', () => {
    expect(digitsOf(7)).toEqual([0, 0, 0, 7])
    expect(digitsOf(3524)).toEqual([3, 5, 2, 4])
    expect(digitsOf(60)).toEqual([0, 0, 6, 0])
  })

  it('kaprekarStep 大数减小数正确', () => {
    // 3524 -> 5432 - 2345 = 3087
    expect(kaprekarStep(3524)).toEqual({ n: 3524, big: 5432, small: 2345, result: 3087 })
    // 6174 是不动点：7641 - 1467 = 6174
    expect(kaprekarStep(6174).result).toBe(KAPREKAR_CONSTANT)
  })

  it('kaprekarChain 从 3524 收敛到 6174', () => {
    const chain = kaprekarChain(3524)
    expect(chain[chain.length - 1].result).toBe(KAPREKAR_CONSTANT)
    expect(chain.length).toBeLessThanOrEqual(7)
  })

  it('几乎所有四位数最多 7 步收敛到 6174', () => {
    let maxSteps = 0
    for (let n = 1000; n <= 9999; n++) {
      if (isRepdigit(n)) continue
      const s = stepsToKaprekar(n)
      expect(s).toBeGreaterThan(0)
      expect(s).toBeLessThanOrEqual(7)
      if (s > maxSteps) maxSteps = s
    }
    expect(maxSteps).toBe(7)
  })

  it('全相同数字不收敛（落入 0）', () => {
    expect(isRepdigit(1111)).toBe(true)
    expect(stepsToKaprekar(2222)).toBe(-1)
    expect(kaprekarChain(5555)[0].result).toBe(0)
  })

  it('SAMPLES 均为有效四位数示例', () => {
    for (const n of SAMPLES) {
      expect(n).toBeGreaterThanOrEqual(1000)
      expect(n).toBeLessThanOrEqual(9999)
    }
    expect(SAMPLES).toContain(KAPREKAR_CONSTANT)
  })
})
