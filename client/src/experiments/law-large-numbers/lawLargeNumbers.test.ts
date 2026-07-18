import { describe, it, expect } from 'vitest'
import {
  DISTRIBUTIONS,
  getDistribution,
  makeRng,
  sampleFrom,
  runningMean,
  meanTrajectory,
  SAMPLE_COUNTS,
} from './lawLargeNumbers'

describe('大数定律', () => {
  it('DISTRIBUTIONS 含三种分布且期望正确', () => {
    expect(DISTRIBUTIONS.length).toBe(3)
    expect(getDistribution('dice').mean).toBe(3.5)
    expect(getDistribution('bernoulli').mean).toBe(0.5)
    expect(getDistribution('uniform').mean).toBe(0.5)
  })

  it('getDistribution 未知 id 回退到第一个', () => {
    expect(getDistribution('nope').id).toBe('dice')
  })

  it('makeRng 同种子可复现，不同种子不同', () => {
    const a = makeRng(42)
    const b = makeRng(42)
    const c = makeRng(99)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
    expect(makeRng(42)()).not.toBe(c())
  })

  it('sampleFrom 掷骰子样本落在 1~6 的整数', () => {
    const s = sampleFrom('dice', 200, 7)
    expect(s.length).toBe(200)
    for (const v of s) {
      expect(Number.isInteger(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(6)
    }
  })

  it('runningMean 首项等于首样本，长度不变', () => {
    const means = runningMean([2, 4, 6])
    expect(means[0]).toBe(2)
    expect(means[1]).toBe(3)
    expect(means[2]).toBe(4)
    expect(means.length).toBe(3)
  })

  it('样本量增大时累计均值更接近期望', () => {
    const dist = getDistribution('dice')
    const traj = meanTrajectory('dice', 5000, 12345)
    const errSmall = Math.abs(traj[9] - dist.mean)
    const errLarge = Math.abs(traj[traj.length - 1] - dist.mean)
    expect(errLarge).toBeLessThan(0.2)
    expect(errLarge).toBeLessThanOrEqual(errSmall + 0.05)
  })

  it('SAMPLE_COUNTS 都能生成对应长度轨迹', () => {
    for (const n of SAMPLE_COUNTS) {
      expect(meanTrajectory('uniform', n, 1).length).toBe(n)
    }
  })
})
