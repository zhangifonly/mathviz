import { describe, it, expect } from 'vitest'
import {
  mobius,
  mobiusArray,
  mertens,
  mertensArray,
  divisorMobiusSum,
  RANGE,
} from './mobiusFunction'

describe('莫比乌斯函数', () => {
  it('mobius 已知小值正确', () => {
    // μ(1)=1, μ(2)=-1, μ(3)=-1, μ(4)=0(有平方因子),
    // μ(5)=-1, μ(6)=1(=2*3), μ(12)=0(=2^2*3)
    expect(mobius(1)).toBe(1)
    expect(mobius(2)).toBe(-1)
    expect(mobius(3)).toBe(-1)
    expect(mobius(4)).toBe(0)
    expect(mobius(5)).toBe(-1)
    expect(mobius(6)).toBe(1)
    expect(mobius(12)).toBe(0)
    expect(mobius(30)).toBe(-1) // 2*3*5，三个素因子
  })

  it('mobius 值域只有 -1/0/1', () => {
    for (let n = 1; n <= 200; n++) {
      expect([-1, 0, 1]).toContain(mobius(n))
    }
  })

  it('mobiusArray 长度与首项正确', () => {
    const arr = mobiusArray(10)
    expect(arr.length).toBe(10)
    expect(arr[0]).toBe(1) // μ(1)
    expect(arr[3]).toBe(0) // μ(4)
  })

  it('mertens 是 mobius 的前缀和', () => {
    expect(mertens(1)).toBe(1)
    expect(mertens(2)).toBe(0) // 1 + (-1)
    expect(mertens(3)).toBe(-1) // + (-1)
    const arr = mertensArray(50)
    expect(arr[49]).toBe(mertens(50))
    expect(arr.length).toBe(50)
  })

  it('狄利克雷卷积: ∑_{d|n} μ(d) = [n==1]', () => {
    for (let n = 1; n <= 60; n++) {
      expect(divisorMobiusSum(n)).toBe(n === 1 ? 1 : 0)
    }
  })

  it('RANGE 档位都能生成数组', () => {
    for (const n of RANGE) {
      expect(mobiusArray(n).length).toBe(n)
      expect(mertensArray(n).length).toBe(n)
    }
  })
})
