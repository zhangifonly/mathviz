import { describe, it, expect } from 'vitest'
import {
  waveValue,
  superpose,
  sampleWaves,
  beatEnvelope,
  WAVE_SCENARIOS,
  type WaveParams,
} from './sineSuperposition'

const near = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps

describe('波的叠加数学内核', () => {
  it('waveValue: sin 在 x=1/4 波（f=1,φ=0）处取振幅峰值', () => {
    const w: WaveParams = { amplitude: 2, frequency: 1, phase: 0 }
    // 2π·1·0.25 = π/2 → sin = 1
    expect(near(waveValue(w, 0.25), 2)).toBe(true)
    expect(near(waveValue(w, 0), 0)).toBe(true)
    expect(near(waveValue(w, 0.5), 0)).toBe(true)
  })

  it('superpose: 同相叠加为振幅之和', () => {
    const a: WaveParams = { amplitude: 1, frequency: 1, phase: 0 }
    const b: WaveParams = { amplitude: 1, frequency: 1, phase: 0 }
    expect(near(superpose([a, b], 0.25), 2)).toBe(true)
  })

  it('superpose: 反相同频处处相消为零', () => {
    const a: WaveParams = { amplitude: 1, frequency: 3, phase: 0 }
    const b: WaveParams = { amplitude: 1, frequency: 3, phase: Math.PI }
    for (const x of [0.1, 0.37, 0.5, 0.83, 0.99]) {
      expect(near(superpose([a, b], x), 0)).toBe(true)
    }
  })

  it('空波列叠加恒为 0', () => {
    expect(superpose([], 0.4)).toBe(0)
  })

  it('sampleWaves: 采样点数与分量结构正确', () => {
    const waves: WaveParams[] = [
      { amplitude: 1, frequency: 2, phase: 0 },
      { amplitude: 1, frequency: 3, phase: 0 },
    ]
    const s = sampleWaves(waves, 100)
    expect(s.xs.length).toBe(100)
    expect(s.components.length).toBe(2)
    expect(s.components[0].length).toBe(100)
    expect(s.sum.length).toBe(100)
    // 端点 x 为 0 和 1
    expect(near(s.xs[0], 0)).toBe(true)
    expect(near(s.xs[99], 1)).toBe(true)
    // 叠加值等于分量之和
    for (let i = 0; i < 100; i++) {
      expect(near(s.sum[i], s.components[0][i] + s.components[1][i])).toBe(true)
    }
  })

  it('sampleWaves: n<2 时至少给 2 个点', () => {
    const s = sampleWaves([{ amplitude: 1, frequency: 1, phase: 0 }], 1)
    expect(s.xs.length).toBe(2)
  })

  it('beatEnvelope: 拍频包络在 x=0 达到 2A 最大值', () => {
    expect(near(beatEnvelope(1, 10, 12, 0), 2)).toBe(true)
    // 差频 Δf=2，包络零点在 π·Δf·x=π/2 → x=0.25
    expect(near(beatEnvelope(1, 10, 12, 0.25), 0)).toBe(true)
  })

  it('三角恒等式校验：sin(a)+sin(b)=2 sin((a+b)/2) cos((a-b)/2)', () => {
    const w1: WaveParams = { amplitude: 1, frequency: 10, phase: 0 }
    const w2: WaveParams = { amplitude: 1, frequency: 12, phase: 0 }
    const x = 0.13
    const direct = superpose([w1, w2], x)
    const a = 2 * Math.PI * 10 * x
    const b = 2 * Math.PI * 12 * x
    const identity = 2 * Math.sin((a + b) / 2) * Math.cos((a - b) / 2)
    expect(near(direct, identity)).toBe(true)
  })

  it('WAVE_SCENARIOS: 每个场景 id 唯一且波列非空', () => {
    const ids = new Set<string>()
    for (const sc of WAVE_SCENARIOS) {
      expect(sc.waves.length).toBeGreaterThan(0)
      expect(ids.has(sc.id)).toBe(false)
      ids.add(sc.id)
      const s = sampleWaves(sc.waves, 50)
      expect(s.sum.length).toBe(50)
    }
  })

  it('WAVE_SCENARIOS: 相消场景叠加确实处处为零', () => {
    const sc = WAVE_SCENARIOS.find((s) => s.id === 'destructive')!
    const s = sampleWaves(sc.waves, 64)
    for (const v of s.sum) expect(near(v, 0)).toBe(true)
  })
})
