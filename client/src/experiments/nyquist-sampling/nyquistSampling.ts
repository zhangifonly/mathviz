/**
 * 奈奎斯特采样定理核心算法（纯函数，便于测试）
 *
 * 采样定理：若信号最高频率为 fmax，只要采样率 fs > 2*fmax，
 * 就能用 sinc 插值从离散采样点完美重建原始连续信号。
 * 重建公式：x(t) = Σ_k  sample_k * sinc((t - k/fs) * fs)
 * 当 fs <= 2*fmax 时重建失真（欠采样）。
 */

/** 归一化 sinc 函数 sinc(x) = sin(pi*x)/(pi*x)，sinc(0)=1 */
export function sinc(x: number): number {
  if (x === 0) return 1
  const px = Math.PI * x
  return Math.sin(px) / px
}

/** 原始连续信号：单频正弦 sin(2*pi*freq*t) */
export function signal(freq: number, t: number): number {
  return Math.sin(2 * Math.PI * freq * t)
}

export interface Sample {
  t: number
  v: number
}

/** 在 [0, duration) 上以采样率 fs 对 freq 正弦采样 */
export function sampleSignal(freq: number, fs: number, duration: number): Sample[] {
  const out: Sample[] = []
  const n = Math.floor(duration * fs)
  for (let k = 0; k < n; k++) {
    const t = k / fs
    out.push({ t, v: signal(freq, t) })
  }
  return out
}

/**
 * sinc 插值重建：用采样点还原 t 时刻的信号值。
 * 每个采样点贡献一个平移+缩放的 sinc 波，叠加得到重建值。
 */
export function reconstruct(samples: Sample[], fs: number, t: number): number {
  let sum = 0
  for (let k = 0; k < samples.length; k++) {
    sum += samples[k].v * sinc((t - k / fs) * fs)
  }
  return sum
}

/** 奈奎斯特判据：采样率是否满足完美重建（fs > 2*fmax） */
export function isSufficient(freq: number, fs: number): boolean {
  return fs > 2 * freq
}

/** 奈奎斯特频率 = 采样率的一半，可无失真表示的最高频率 */
export function nyquistFreq(fs: number): number {
  return fs / 2
}

export interface Preset {
  label: string
  freq: number
  fs: number
}

/** 预设：信号频率(Hz)与采样率(Hz)，覆盖充分/临界/不足三种情形 */
export const PRESETS: Preset[] = [
  { label: '充分采样 (fs=10, f=2)', freq: 2, fs: 10 },
  { label: '临界采样 (fs=4, f=2)', freq: 2, fs: 4 },
  { label: '欠采样 (fs=3, f=2)', freq: 2, fs: 3 },
]
