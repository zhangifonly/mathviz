import { describe, it, expect } from 'vitest'
import {
  kalmanPredict,
  kalmanUpdate,
  kalmanStep,
  runKalman,
  makeRng,
  gaussian,
  generateDataset,
  NOISE_OPTIONS,
  type KalmanState,
} from './kalmanFilter'

describe('卡尔曼滤波内核', () => {
  it('预测步：随机游走使方差按 Q 增大，估计不变', () => {
    const s: KalmanState = { x: 5, P: 2 }
    const p = kalmanPredict(s, 0.5)
    expect(p.x).toBe(5)
    expect(p.P).toBeCloseTo(2.5, 10)
  })

  it('卡尔曼增益 K = P / (P + R) 落在 0 到 1 之间', () => {
    const step = kalmanUpdate({ x: 0, P: 3 }, 10, 1)
    expect(step.K).toBeCloseTo(3 / 4, 10)
    expect(step.K).toBeGreaterThan(0)
    expect(step.K).toBeLessThan(1)
  })

  it('更新后方差必然不大于预测方差（信息增加）', () => {
    const step = kalmanUpdate({ x: 0, P: 3 }, 10, 1)
    expect(step.P).toBeLessThanOrEqual(3)
    // P = (1-K)P_pred = (1/4)*3 = 0.75
    expect(step.P).toBeCloseTo(0.75, 10)
  })

  it('估计是预测与测量的凸组合：x = (1-K)x_pred + K z', () => {
    const xPred = 2
    const z = 8
    const step = kalmanStep({ x: xPred, P: 1 }, z, 0, 1)
    const expected = (1 - step.K) * xPred + step.K * z
    expect(step.x).toBeCloseTo(expected, 10)
    // 估计必落在预测与测量之间
    expect(step.x).toBeGreaterThan(xPred)
    expect(step.x).toBeLessThan(z)
  })

  it('R 趋近 0（完全信任测量）时估计趋近测量值', () => {
    const step = kalmanStep({ x: 0, P: 1 }, 42, 0, 1e-9)
    expect(step.x).toBeCloseTo(42, 4)
    expect(step.K).toBeCloseTo(1, 4)
  })

  it('R 极大（不信任测量）时估计几乎保持预测', () => {
    const step = kalmanStep({ x: 7, P: 1 }, 42, 0, 1e9)
    expect(step.x).toBeCloseTo(7, 4)
    expect(step.K).toBeCloseTo(0, 4)
  })

  it('对常值信号无噪声测量，滤波稳定收敛到真值', () => {
    const meas = new Array(20).fill(10)
    const steps = runKalman(meas, { x: 0, P: 1 }, 0.01, 0.1)
    expect(steps).toHaveLength(20)
    expect(steps[19].x).toBeCloseTo(10, 2)
    // 方差单调趋于稳态，末端应远小于初值
    expect(steps[19].P).toBeLessThan(1)
  })

  it('makeRng 确定性可复现', () => {
    const a = makeRng(7)
    const b = makeRng(7)
    for (let i = 0; i < 5; i++) expect(a()).toBe(b())
  })

  it('gaussian 大样本均值方差接近设定值', () => {
    const rng = makeRng(99)
    const N = 20000
    let sum = 0
    let sumSq = 0
    for (let i = 0; i < N; i++) {
      const v = gaussian(rng, 5, 2)
      sum += v
      sumSq += v * v
    }
    const mean = sum / N
    const variance = sumSq / N - mean * mean
    expect(mean).toBeCloseTo(5, 1)
    expect(Math.sqrt(variance)).toBeCloseTo(2, 1)
  })

  it('generateDataset 结构完整、长度一致、可复现', () => {
    const d1 = generateDataset(60, 0.02, 1)
    const d2 = generateDataset(60, 0.02, 1)
    expect(d1.truth).toHaveLength(60)
    expect(d1.measurements).toHaveLength(60)
    expect(d1.steps).toHaveLength(60)
    expect(d1.measurements).toEqual(d2.measurements)
  })

  it('滤波估计比原始测量更贴近真值（误差更小）', () => {
    const d = generateDataset(120, 0.02, 1.5)
    let errMeas = 0
    let errKf = 0
    for (let i = 0; i < d.truth.length; i++) {
      errMeas += (d.measurements[i] - d.truth[i]) ** 2
      errKf += (d.steps[i].x - d.truth[i]) ** 2
    }
    expect(errKf).toBeLessThan(errMeas)
  })

  it('NOISE_OPTIONS 都能生成有效数据集，Q/R 为正', () => {
    for (const opt of NOISE_OPTIONS) {
      expect(opt.Q).toBeGreaterThan(0)
      expect(opt.R).toBeGreaterThan(0)
      const d = generateDataset(40, opt.Q, opt.R)
      expect(d.steps).toHaveLength(40)
      for (const s of d.steps) {
        expect(Number.isFinite(s.x)).toBe(true)
        expect(s.K).toBeGreaterThanOrEqual(0)
        expect(s.K).toBeLessThanOrEqual(1)
      }
    }
  })
})
