import { describe, it, expect } from 'vitest'
import {
  nextHappy,
  happyChain,
  isHappy,
  countHappy,
  SAMPLES,
  RANGE,
  SAD_CYCLE,
} from './happyNumbers'

describe('快乐数', () => {
  it('nextHappy 计算各位平方和', () => {
    expect(nextHappy(7)).toBe(49) // 7^2
    expect(nextHappy(19)).toBe(82) // 1+81
    expect(nextHappy(100)).toBe(1) // 1+0+0
    expect(nextHappy(4)).toBe(16)
  })

  it('isHappy 识别经典快乐数', () => {
    for (const h of [1, 7, 10, 13, 19, 23, 28, 100]) {
      expect(isHappy(h)).toBe(true)
    }
  })

  it('isHappy 识别不快乐数', () => {
    for (const s of [2, 4, 16, 20, 42, 89, 145]) {
      expect(isHappy(s)).toBe(false)
    }
  })

  it('happyChain 快乐数以 1 收尾', () => {
    const chain = happyChain(19)
    expect(chain[0]).toBe(19)
    expect(chain[chain.length - 1]).toBe(1)
    // 每一步都是上一步的平方和
    for (let i = 1; i < chain.length; i++) {
      expect(chain[i]).toBe(nextHappy(chain[i - 1]))
    }
  })

  it('happyChain 不快乐数进入 8 数循环', () => {
    const chain = happyChain(2)
    const last = chain[chain.length - 1]
    expect(SAD_CYCLE).toContain(last)
    // 尾值在链中出现过（循环入口重复）
    expect(chain.indexOf(last)).toBeLessThan(chain.length - 1)
  })

  it('countHappy 与常量一致', () => {
    // 1..10 之间的快乐数为 1,7,10 共 3 个
    expect(countHappy(10)).toBe(3)
    expect(SAMPLES.length).toBeGreaterThan(0)
    expect(RANGE).toContain(100)
    expect(SAD_CYCLE.length).toBe(8)
  })
})
