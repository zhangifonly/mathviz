/**
 * 波的叠加（纯函数，便于测试，无 DOM 依赖）
 *
 * 叠加原理：多列正弦波在同一点的位移等于各波位移的代数和。
 *   y(x) = Σ Aᵢ · sin(2π·fᵢ·x + φᵢ)
 * 由此涌现出相长干涉、相消干涉、拍频与谐波合成等现象。
 * 约定：x ∈ [0, 1] 表示一个归一化区间，frequency 表示该区间内的完整波数。
 */

export interface WaveParams {
  amplitude: number // 振幅
  frequency: number // 区间 [0,1] 内的波数（圈数）
  phase: number // 初相位（弧度）
}

/** 单列正弦波在位置 x 处的位移 */
export function waveValue(w: WaveParams, x: number): number {
  return w.amplitude * Math.sin(2 * Math.PI * w.frequency * x + w.phase)
}

/** 多列波在位置 x 处的叠加位移（代数和） */
export function superpose(waves: WaveParams[], x: number): number {
  let sum = 0
  for (const w of waves) sum += waveValue(w, x)
  return sum
}

export interface SampledWaves {
  xs: number[] // 采样横坐标
  components: number[][] // 每列波的采样值
  sum: number[] // 叠加后的采样值
}

/**
 * 在 [x0, x1] 上均匀采样 n+1 个点，返回各分量与叠加结果。
 * 采样点数至少为 2，避免除零。
 */
export function sampleWaves(
  waves: WaveParams[],
  n: number,
  x0 = 0,
  x1 = 1,
): SampledWaves {
  const count = Math.max(2, Math.floor(n))
  const xs: number[] = []
  const components: number[][] = waves.map(() => [])
  const sum: number[] = []
  for (let i = 0; i < count; i++) {
    const x = x0 + ((x1 - x0) * i) / (count - 1)
    xs.push(x)
    let s = 0
    for (let k = 0; k < waves.length; k++) {
      const v = waveValue(waves[k], x)
      components[k].push(v)
      s += v
    }
    sum.push(s)
  }
  return { xs, components, sum }
}

/**
 * 两列等幅波产生的拍频包络幅度：|2A·cos(π·(f1−f2)·x)|。
 * 拍频（包络重复频率）为 |f1 − f2|。
 */
export function beatEnvelope(amplitude: number, f1: number, f2: number, x: number): number {
  return Math.abs(2 * amplitude * Math.cos(Math.PI * (f1 - f2) * x))
}

export interface WaveScenario {
  id: string
  label: string
  note: string
  waves: WaveParams[]
}

/** 预设叠加场景，供交互切换 */
export const WAVE_SCENARIOS: WaveScenario[] = [
  {
    id: 'constructive',
    label: '相长干涉',
    note: '同频同相，振幅叠加变大',
    waves: [
      { amplitude: 1, frequency: 3, phase: 0 },
      { amplitude: 1, frequency: 3, phase: 0 },
    ],
  },
  {
    id: 'destructive',
    label: '相消干涉',
    note: '同频反相，处处抵消归零',
    waves: [
      { amplitude: 1, frequency: 3, phase: 0 },
      { amplitude: 1, frequency: 3, phase: Math.PI },
    ],
  },
  {
    id: 'beats',
    label: '拍频',
    note: '频率相近，包络缓慢起伏',
    waves: [
      { amplitude: 1, frequency: 10, phase: 0 },
      { amplitude: 1, frequency: 12, phase: 0 },
    ],
  },
  {
    id: 'harmonics',
    label: '谐波合成',
    note: '基波加倍频，合成复杂波形',
    waves: [
      { amplitude: 1, frequency: 2, phase: 0 },
      { amplitude: 0.5, frequency: 4, phase: 0 },
    ],
  },
]
