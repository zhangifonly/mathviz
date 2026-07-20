/**
 * 加窗函数核心（纯函数，便于测试）
 *
 * 对有限长信号做 DFT 前，先乘上一个"窗函数"来平滑两端，
 * 可以显著减少频谱泄漏。这里实现四种经典窗，并提供 DFT 幅度谱。
 */

export type WindowKind = 'rect' | 'hann' | 'hamming' | 'blackman'

export const WINDOWS: WindowKind[] = ['rect', 'hann', 'hamming', 'blackman']

export const WINDOW_LABELS: Record<WindowKind, string> = {
  rect: '矩形窗',
  hann: '汉宁窗',
  hamming: '汉明窗',
  blackman: '布莱克曼窗',
}

/** 生成长度为 N 的窗函数系数（对称窗，w[0]..w[N-1]，取值 [0,1]） */
export function windowFn(kind: WindowKind, N: number): number[] {
  const w: number[] = []
  const M = N - 1
  for (let n = 0; n < N; n++) {
    const t = M === 0 ? 0 : n / M
    let v = 1
    if (kind === 'hann') {
      v = 0.5 - 0.5 * Math.cos(2 * Math.PI * t)
    } else if (kind === 'hamming') {
      v = 0.54 - 0.46 * Math.cos(2 * Math.PI * t)
    } else if (kind === 'blackman') {
      v = 0.42 - 0.5 * Math.cos(2 * Math.PI * t) + 0.08 * Math.cos(4 * Math.PI * t)
    }
    w.push(v)
  }
  return w
}

/** 采样一个正弦信号（频率为 freq 个周期跨整个窗，故意用非整数造成泄漏） */
export function makeSignal(N: number, freq: number): number[] {
  const s: number[] = []
  for (let n = 0; n < N; n++) {
    s.push(Math.sin((2 * Math.PI * freq * n) / N))
  }
  return s
}

/** 逐点相乘：信号乘窗 */
export function applyWindow(signal: number[], win: number[]): number[] {
  return signal.map((v, i) => v * (win[i] ?? 0))
}

/** DFT 幅度谱，返回长度 floor(N/2)+1 的单边幅度（已按 N 归一） */
export function dftMagnitude(signal: number[]): number[] {
  const N = signal.length
  const half = Math.floor(N / 2)
  const mag: number[] = []
  for (let k = 0; k <= half; k++) {
    let re = 0
    let im = 0
    for (let n = 0; n < N; n++) {
      const ang = (-2 * Math.PI * k * n) / N
      re += signal[n] * Math.cos(ang)
      im += signal[n] * Math.sin(ang)
    }
    mag.push(Math.sqrt(re * re + im * im) / N)
  }
  return mag
}
