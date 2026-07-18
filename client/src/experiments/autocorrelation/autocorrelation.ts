/**
 * 自相关核心算法（纯函数，便于测试）
 *
 * 自相关把信号与自身延迟若干样本后的版本相乘再求和，
 * 用来衡量"信号隔多久之后还像自己"。
 * 周期信号在延迟等于周期整数倍时，会与自己高度重合，出现峰值，
 * 因此自相关是从噪声中提取基频（周期）的经典手段。
 */

export interface SignalPreset {
  key: string
  label: string
  period: number
  noise: number
}

/** 预置信号：不同周期与噪声强度，用于观察峰值位置变化 */
export const SIGNAL_PRESETS: SignalPreset[] = [
  { key: 'clean', label: '周期20·弱噪声', period: 20, noise: 0.15 },
  { key: 'noisy', label: '周期20·强噪声', period: 20, noise: 0.6 },
  { key: 'fast', label: '周期12·中噪声', period: 12, noise: 0.35 },
]

/** 线性同余伪随机，保证测试可复现 */
function makeRand(seed: number): () => number {
  let s = seed & 0x7fffffff
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff - 0.5
  }
}

/** 生成带噪正弦信号：sin(2πt/period) + noise·随机 */
export function makeSignal(n: number, period: number, noise: number, seed = 1): number[] {
  const rand = makeRand(seed)
  const sig: number[] = []
  for (let t = 0; t < n; t++) {
    sig.push(Math.sin((2 * Math.PI * t) / period) + noise * rand())
  }
  return sig
}

/**
 * 计算自相关：对每个延迟 lag，把 signal[t] 与 signal[t+lag] 相乘并求和。
 * 结果按 lag=0 处的值归一化到 [-1, 1]，便于比较与可视化。
 */
export function autocorr(signal: number[], maxLag?: number): number[] {
  const n = signal.length
  const mean = signal.reduce((a, b) => a + b, 0) / n
  const lags = maxLag ?? n - 1
  const raw: number[] = []
  for (let lag = 0; lag <= lags; lag++) {
    let sum = 0
    for (let t = 0; t + lag < n; t++) {
      sum += (signal[t] - mean) * (signal[t + lag] - mean)
    }
    raw.push(sum)
  }
  const denom = raw[0] || 1
  return raw.map((v) => v / denom)
}

/**
 * 从自相关序列中检测周期：跳过 lag=0 的主峰，
 * 找第一个"局部最大且高于阈值"的延迟作为基础周期。
 */
export function detectPeriod(ac: number[], threshold = 0.3): number {
  for (let lag = 2; lag < ac.length - 1; lag++) {
    if (ac[lag] > threshold && ac[lag] > ac[lag - 1] && ac[lag] >= ac[lag + 1]) {
      return lag
    }
  }
  return 0
}
