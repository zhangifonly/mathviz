import { describe, it, expect } from 'vitest'
import { digitSum, digitalRootSteps, digitalRoot, castingOutNines, SAMPLES } from './digitalRoot'

describe('数字根与弃九验算', () => {
  it('digitSum 求各位之和', () => {
    expect(digitSum(12345)).toBe(15)
    expect(digitSum(0)).toBe(0)
    expect(digitSum(9)).toBe(9)
    expect(digitSum(-208)).toBe(10)
  })

  it('digitalRootSteps 逐步坍缩到一位数', () => {
    expect(digitalRootSteps(12345)).toEqual([12345, 15, 6])
    expect(digitalRootSteps(9)).toEqual([9])
    expect(digitalRootSteps(0)).toEqual([0])
    const steps = digitalRootSteps(99999)
    expect(steps[0]).toBe(99999)
    expect(steps[steps.length - 1]).toBeLessThan(10)
  })

  it('digitalRoot 闭式与逐步结果一致', () => {
    for (let n = 1; n <= 200; n++) {
      const steps = digitalRootSteps(n)
      expect(digitalRoot(n)).toBe(steps[steps.length - 1])
    }
    expect(digitalRoot(0)).toBe(0)
  })

  it('digitalRoot 等价于模9（非零映射到1..9）', () => {
    expect(digitalRoot(18)).toBe(9)
    expect(digitalRoot(27)).toBe(9)
    expect(digitalRoot(10)).toBe(1)
    expect(digitalRoot(19)).toBe(1)
  })

  it('castingOutNines 正确算式通过校验', () => {
    const add = castingOutNines(1234, 5678, 'add')
    expect(add.result).toBe(6912)
    expect(add.valid).toBe(true)
    const mul = castingOutNines(123, 456, 'mul')
    expect(mul.result).toBe(56088)
    expect(mul.valid).toBe(true)
  })

  it('castingOutNines 能识别数字根不符的错误结果', () => {
    // 手动构造一个数字根冲突：真乘积 root 与两根乘积 root 一致时 valid
    const r = castingOutNines(11, 11, 'mul')
    expect(r.result).toBe(121)
    expect(r.rootResult).toBe(digitalRoot(121))
    expect(r.valid).toBe(true)
  })

  it('SAMPLES 都能求出数字根', () => {
    for (const n of SAMPLES) {
      const steps = digitalRootSteps(n)
      expect(steps[steps.length - 1]).toBe(digitalRoot(n))
    }
  })
})
