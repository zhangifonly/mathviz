/**
 * 混叠现象核心算法（纯函数，便于测试）
 *
 * 一个频率为 f 的正弦信号 sin(2*pi*f*t)，若用采样率 fs 去采样，
 * 当 fs < 2f（低于奈奎斯特频率）时，采样点会"伪装"成一个更低频率的
 * 信号，这就是混叠(aliasing)。本内核提供真实信号、采样、以及
 * 混叠后表观频率的计算。
 */

/** 连续信号在时刻 t 的取值：sin(2*pi*f*t) */
export function signal(f: number, t: number): number {
  return Math.sin(2 * Math.PI * f * t)
}

/**
 * 计算欠采样后的表观(混叠)频率。
 * 表观频率 = |f - round(f / fs) * fs|，落在 [0, fs/2] 内。
 */
export function aliasFrequency(f: number, fs: number): number {
  if (fs <= 0) return f
  return Math.abs(f - Math.round(f / fs) * fs)
}

/** 是否发生混叠：采样率不足奈奎斯特频率(2f)时为真 */
export function isAliased(f: number, fs: number): boolean {
  return fs < 2 * f
}

/** 采样点接口 */
export interface Sample {
  t: number
  v: number
}

/**
 * 在时间区间 [0, duration] 上以采样率 fs 采样真实信号，
 * 返回采样点数组（t 为秒，v 为幅值）。
 */
export function sampleSignal(f: number, fs: number, duration: number): Sample[] {
  const out: Sample[] = []
  if (fs <= 0) return out
  const n = Math.floor(duration * fs)
  for (let i = 0; i <= n; i++) {
    const t = i / fs
    out.push({ t, v: signal(f, t) })
  }
  return out
}

/** 预设组合：真实频率 f(Hz) 与采样率 fs(Hz)，展示不同混叠程度 */
export const PRESETS: { f: number; fs: number; label: string }[] = [
  { f: 9, fs: 20, label: '充分采样(无混叠)' },
  { f: 9, fs: 10, label: '欠采样(轻度混叠)' },
  { f: 9, fs: 8, label: '严重混叠(伪低频)' },
]
