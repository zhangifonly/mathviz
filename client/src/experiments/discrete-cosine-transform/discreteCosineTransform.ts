/**
 * 离散余弦变换核心算法（DCT-II / 逆变换，纯函数，便于测试）
 *
 * DCT-II 把一段离散信号分解成一组余弦基的叠加，能量往往集中在低频，
 * 这正是 JPEG 等有损压缩的核心：只保留前几个系数即可近似重建原信号。
 */

/** 正变换 DCT-II（未归一化）
 *  X[k] = sum_{n=0}^{N-1} x[n] * cos(pi/N * (n + 0.5) * k)
 */
export function dct(signal: number[]): number[] {
  const N = signal.length
  const out: number[] = new Array(N).fill(0)
  for (let k = 0; k < N; k++) {
    let sum = 0
    for (let n = 0; n < N; n++) {
      sum += signal[n] * Math.cos((Math.PI / N) * (n + 0.5) * k)
    }
    out[k] = sum
  }
  return out
}

/** 逆变换 DCT-III（与上面的 dct 精确互逆）
 *  x[n] = (2/N) * ( X[0]/2 + sum_{k=1}^{N-1} X[k] * cos(pi/N * (n + 0.5) * k) )
 */
export function idct(coeffs: number[]): number[] {
  const N = coeffs.length
  const out: number[] = new Array(N).fill(0)
  for (let n = 0; n < N; n++) {
    let sum = coeffs[0] / 2
    for (let k = 1; k < N; k++) {
      sum += coeffs[k] * Math.cos((Math.PI / N) * (n + 0.5) * k)
    }
    out[n] = (2 / N) * sum
  }
  return out
}

/** 压缩：只保留前 keep 个低频系数，其余高频置零 */
export function keepLowFreq(coeffs: number[], keep: number): number[] {
  const k = Math.max(0, Math.min(keep, coeffs.length))
  return coeffs.map((c, i) => (i < k ? c : 0))
}

/** 保留前 keep 个系数后重建信号 */
export function reconstruct(signal: number[], keep: number): number[] {
  return idct(keepLowFreq(dct(signal), keep))
}

/** 生成一段平滑信号：低频余弦叠加 + 轻微高频扰动，能量集中在低频 */
function makeSignal(N: number): number[] {
  const s: number[] = []
  for (let n = 0; n < N; n++) {
    const t = n / N
    const v =
      50 +
      40 * Math.cos(2 * Math.PI * 1 * t) +
      20 * Math.cos(2 * Math.PI * 2 * t + 0.6) +
      8 * Math.cos(2 * Math.PI * 5 * t) +
      3 * Math.cos(2 * Math.PI * 11 * t)
    s.push(v)
  }
  return s
}

/** 演示用固定信号（32 点） */
export const SIGNAL: number[] = makeSignal(32)

/** 可选的保留系数个数（用于交互按钮） */
export const KEEP_COUNTS = [2, 4, 8, 16]
