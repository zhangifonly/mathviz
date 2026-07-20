/**
 * 快速傅里叶变换核心算法（纯函数）：递归 Cooley-Tukey FFT，
 * 按奇偶下标分治 + 蝶形合并，复杂度 O(n log n)，远快于朴素 DFT 的 O(n^2)。
 */

export interface Complex {
  re: number
  im: number
}

export interface SignalComponent {
  freq: number
  amp: number
}

export interface SignalPreset {
  name: string
  components: SignalComponent[]
}

/** 内置合成信号：若干整数频率正弦叠加，频谱峰落在整数 bin 上 */
export const SIGNAL_PRESETS: SignalPreset[] = [
  { name: '单频正弦', components: [{ freq: 3, amp: 1 }] },
  { name: '双频叠加', components: [{ freq: 2, amp: 1 }, { freq: 5, amp: 0.6 }] },
  { name: '三频和弦', components: [{ freq: 1, amp: 1 }, { freq: 4, amp: 0.7 }, { freq: 7, amp: 0.45 }] },
]

/** 可选的采样点数（都是 2 的幂，满足 FFT 分治要求） */
export const FFT_SIZES = [16, 32, 64]

export const cadd = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im })
export const csub = (a: Complex, b: Complex): Complex => ({ re: a.re - b.re, im: a.im - b.im })
export const cmul = (a: Complex, b: Complex): Complex => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re })

/** 判断是否为 2 的幂 */
export function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0
}

/** 根据预设生成长度为 n 的实值信号（虚部为 0） */
export function makeSignal(preset: SignalPreset, n: number): Complex[] {
  const out: Complex[] = []
  for (let t = 0; t < n; t++) {
    let v = 0
    for (const c of preset.components) {
      v += c.amp * Math.sin((2 * Math.PI * c.freq * t) / n)
    }
    out.push({ re: v, im: 0 })
  }
  return out
}

/** 递归 Cooley-Tukey FFT，输入长度必须为 2 的幂 */
export function fft(input: Complex[]): Complex[] {
  const n = input.length
  if (n <= 1) return input.map((c) => ({ re: c.re, im: c.im }))
  if (!isPowerOfTwo(n)) throw new Error('FFT 输入长度必须是 2 的幂')
  const even = fft(input.filter((_, i) => i % 2 === 0))
  const odd = fft(input.filter((_, i) => i % 2 === 1))
  const out: Complex[] = new Array(n)
  for (let k = 0; k < n / 2; k++) {
    const angle = (-2 * Math.PI * k) / n
    const w: Complex = { re: Math.cos(angle), im: Math.sin(angle) }
    const t = cmul(w, odd[k])
    out[k] = cadd(even[k], t)
    out[k + n / 2] = csub(even[k], t)
  }
  return out
}

/** 朴素 DFT：直接按定义双重求和，O(n^2)，用于对照与验证 */
export function dft(input: Complex[]): Complex[] {
  const n = input.length
  const out: Complex[] = []
  for (let k = 0; k < n; k++) {
    let re = 0
    let im = 0
    for (let t = 0; t < n; t++) {
      const angle = (-2 * Math.PI * k * t) / n
      const c = Math.cos(angle)
      const s = Math.sin(angle)
      re += input[t].re * c - input[t].im * s
      im += input[t].re * s + input[t].im * c
    }
    out.push({ re, im })
  }
  return out
}

/** 幅度谱：每个频率 bin 的复数模长 */
export function magnitude(spectrum: Complex[]): number[] {
  return spectrum.map((c) => Math.hypot(c.re, c.im))
}

/** 朴素 DFT 的复数乘法次数：n^2 */
export const naiveOps = (n: number): number => n * n
/** FFT 的运算规模：n*log2(n) 量级 */
export const fftOps = (n: number): number => (n <= 1 ? 0 : Math.round(n * Math.log2(n)))
