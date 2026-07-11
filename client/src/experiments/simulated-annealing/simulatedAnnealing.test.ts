import { describe, it, expect } from 'vitest'
import {
  mulberry32,
  acceptanceProbability,
  temperatureAt,
  sampleCurve,
  runAnneal,
  ENERGY_OPTIONS,
  COOLING_OPTIONS,
} from './simulatedAnnealing'

/** 网格搜索求区间内的全局最小 x，作为退火结果的参照 */
function gridMinX(energy: (x: number) => number, lo: number, hi: number, n = 20000): number {
  let bestX = lo
  let bestE = energy(lo)
  for (let i = 1; i <= n; i++) {
    const x = lo + ((hi - lo) * i) / n
    const e = energy(x)
    if (e < bestE) {
      bestE = e
      bestX = x
    }
  }
  return bestX
}

describe('模拟退火内核', () => {
  it('acceptanceProbability: 变好的一步必被接受（概率为 1）', () => {
    expect(acceptanceProbability(-5, 2)).toBe(1)
    expect(acceptanceProbability(0, 2)).toBe(1)
  })

  it('acceptanceProbability: 变坏时随温度升高而增大，随 deltaE 增大而减小', () => {
    // 相同 deltaE，高温更愿意接受
    expect(acceptanceProbability(1, 10)).toBeGreaterThan(acceptanceProbability(1, 0.5))
    // 相同温度，越坏越不接受
    expect(acceptanceProbability(3, 2)).toBeLessThan(acceptanceProbability(1, 2))
    // exp(-deltaE/T) 恒等式
    expect(acceptanceProbability(2, 4)).toBeCloseTo(Math.exp(-0.5), 10)
  })

  it('acceptanceProbability: 温度趋于 0 时拒绝一切变坏的步', () => {
    expect(acceptanceProbability(1, 0)).toBe(0)
    expect(acceptanceProbability(1, 1e-9)).toBeLessThan(1e-6)
  })

  it('temperatureAt: k=0 时等于初始温度 T0', () => {
    expect(temperatureAt(0, 100, 0.95, 500, 'geometric')).toBeCloseTo(100, 10)
    expect(temperatureAt(0, 100, 0.01, 500, 'exponential')).toBeCloseTo(100, 10)
    expect(temperatureAt(0, 100, 0.95, 500, 'linear')).toBeCloseTo(100, 10)
  })

  it('temperatureAt: 温度单调不增且几何降温满足 T_k = T0*alpha^k', () => {
    const T0 = 100
    const alpha = 0.9
    for (let k = 1; k < 20; k++) {
      const t = temperatureAt(k, T0, alpha, 500, 'geometric')
      expect(t).toBeCloseTo(T0 * Math.pow(alpha, k), 8)
      expect(t).toBeLessThan(temperatureAt(k - 1, T0, alpha, 500, 'geometric'))
    }
  })

  it('temperatureAt: 线性降温保持正值，不会为零或负', () => {
    for (let k = 0; k <= 500; k++) {
      expect(temperatureAt(k, 50, 0.9, 500, 'linear')).toBeGreaterThan(0)
    }
  })

  it('mulberry32: 同种子结果可复现，输出落在 [0,1)', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    for (let i = 0; i < 100; i++) {
      const v = a()
      expect(v).toBe(b())
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('sampleCurve: 点数正确且覆盖端点', () => {
    const pts = sampleCurve((x) => x * x, [-2, 2], 50)
    expect(pts.length).toBe(50)
    expect(pts[0].x).toBeCloseTo(-2, 10)
    expect(pts[49].x).toBeCloseTo(2, 10)
    expect(pts[0].y).toBeCloseTo(4, 10)
  })

  it('runAnneal: 确定性——同配置同种子产生相同最优解', () => {
    const opt = ENERGY_OPTIONS[0]
    const cfg = {
      energy: opt.energy,
      domain: opt.domain,
      x0: opt.x0,
      T0: 5,
      rate: 0.98,
      steps: 800,
      stepSize: 1,
      schedule: 'geometric' as const,
      seed: 7,
    }
    const r1 = runAnneal(cfg)
    const r2 = runAnneal(cfg)
    expect(r1.bestX).toBe(r2.bestX)
    expect(r1.bestEnergy).toBe(r2.bestEnergy)
    expect(r1.trajectory.length).toBe(800)
  })

  it('runAnneal: 最优能量不劣于起点能量', () => {
    const opt = ENERGY_OPTIONS[0]
    const r = runAnneal({
      energy: opt.energy,
      domain: opt.domain,
      x0: opt.x0,
      T0: 5,
      rate: 0.98,
      steps: 800,
      stepSize: 1,
      schedule: 'geometric',
      seed: 3,
    })
    expect(r.bestEnergy).toBeLessThanOrEqual(opt.energy(opt.x0))
  })

  it('runAnneal: 能跳出局部最优，逼近网格全局最小', () => {
    const opt = ENERGY_OPTIONS[0]
    const trueMinX = gridMinX(opt.energy, opt.domain[0], opt.domain[1])
    const r = runAnneal({
      energy: opt.energy,
      domain: opt.domain,
      x0: opt.x0,
      T0: 8,
      rate: 0.99,
      steps: 3000,
      stepSize: 1.2,
      schedule: 'geometric',
      seed: 1,
    })
    // 退火找到的最优能量应非常接近网格搜索出的全局最小能量
    expect(r.bestEnergy).toBeLessThanOrEqual(opt.energy(trueMinX) + 0.05)
  })

  it('runAnneal: 记录的 bestEnergy 单调不增', () => {
    const opt = ENERGY_OPTIONS[1]
    const r = runAnneal({
      energy: opt.energy,
      domain: opt.domain,
      x0: opt.x0,
      T0: 6,
      rate: 0.98,
      steps: 500,
      stepSize: 1,
      schedule: 'exponential',
      seed: 9,
    })
    for (let i = 1; i < r.trajectory.length; i++) {
      expect(r.trajectory[i].bestEnergy).toBeLessThanOrEqual(r.trajectory[i - 1].bestEnergy)
    }
  })

  it('ENERGY_OPTIONS: 均在定义域内产生有限能量值', () => {
    for (const opt of ENERGY_OPTIONS) {
      const [lo, hi] = opt.domain
      expect(lo).toBeLessThan(hi)
      expect(opt.x0).toBeGreaterThanOrEqual(lo)
      expect(opt.x0).toBeLessThanOrEqual(hi)
      for (let i = 0; i <= 10; i++) {
        const x = lo + ((hi - lo) * i) / 10
        expect(Number.isFinite(opt.energy(x))).toBe(true)
      }
    }
  })

  it('COOLING_OPTIONS: 三种降温策略齐全且 id 唯一', () => {
    const ids = COOLING_OPTIONS.map((o) => o.id)
    expect(ids).toEqual(['geometric', 'exponential', 'linear'])
    expect(new Set(ids).size).toBe(3)
  })
})
