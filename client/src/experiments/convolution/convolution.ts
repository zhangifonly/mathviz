/**
 * 一维离散卷积核心算法（纯函数，便于测试）
 *
 * 卷积 (f * g)[n] = Σ_m f[m] * g[n - m]。
 * 直观理解：把核 kernel 翻转后，在信号 signal 上逐位滑动，
 * 每个位置做“对应相乘再求和”，得到该位置的输出值。
 * 这里采用 'same' 语义：输出长度 = 信号长度，核以中心对齐。
 */

export interface ConvFrame {
  /** 当前核中心对齐到信号的哪个下标 */
  center: number
  /** 该位置逐点乘积（长度 = 核长度） */
  products: number[]
  /** 乘积之和，即输出该位置的值 */
  sum: number
}

/** 一维离散卷积（same 模式），返回输出数组 */
export function convolve(signal: number[], kernel: number[]): number[] {
  return frames(signal, kernel).map((f) => f.sum)
}

/**
 * 生成每个偏移位置的中间帧，用于可视化滑动过程。
 * 核被翻转后与信号对齐（真正的卷积，而非相关）。
 */
export function frames(signal: number[], kernel: number[]): ConvFrame[] {
  const n = signal.length
  const k = kernel.length
  const half = Math.floor(k / 2)
  const flipped = [...kernel].reverse()
  const out: ConvFrame[] = []
  for (let center = 0; center < n; center++) {
    const products: number[] = []
    let sum = 0
    for (let j = 0; j < k; j++) {
      // 翻转核第 j 项对应信号下标（same 对齐）
      const idx = center + j - half
      const s = idx >= 0 && idx < n ? signal[idx] : 0
      const p = s * flipped[j]
      products.push(p)
      sum += p
    }
    out.push({ center, products, sum })
  }
  return out
}

/** 常见卷积核 */
export const KERNELS: Record<string, { label: string; taps: number[] }> = {
  average: { label: '移动平均', taps: [1 / 3, 1 / 3, 1 / 3] },
  gaussian: { label: '高斯平滑', taps: [0.25, 0.5, 0.25] },
  edge: { label: '边缘检测', taps: [-1, 0, 1] },
  sharpen: { label: '锐化', taps: [-0.5, 2, -0.5] },
}

/** 示例信号：带台阶与噪声的方波，方便看出平滑与边缘效果 */
export const SIGNAL: number[] = [
  0, 0, 0, 1, 1, 3, 1, 1, 1, 1,
  4, 4, 4, 4, 2, 2, 2, 0, 0, 0,
]
