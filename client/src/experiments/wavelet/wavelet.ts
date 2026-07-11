/**
 * 小波变换（纯函数数学内核，无 DOM，便于测试）
 *
 * 傅里叶变换把信号分解成无穷延伸的正弦波，只知道"有哪些频率"，
 * 却不知道"频率出现在何时"。小波变换用一个又短又会衰减的"小波"母函数，
 * 通过平移(时间)和伸缩(尺度)去匹配信号，从而同时定位时间与频率。
 *
 * 本内核实现：
 *  - 采样信号生成（含瞬变，凸显小波的时频定位优势）
 *  - Haar 离散小波变换 DWT / 逆变换 IDWT（正交、可完美重构）
 *  - 简化的连续小波变换 CWT（墨西哥帽 / Morlet 母小波）生成尺度图
 */

/** 信号类型选项 */
export interface SignalOption {
  id: string
  label: string
  note: string
}

export const SIGNAL_OPTIONS: SignalOption[] = [
  { id: 'chirp', label: '啁啾信号', note: '频率随时间升高，时频图呈斜线' },
  { id: 'transient', label: '瞬变脉冲', note: '平稳正弦中突然插入尖峰' },
  { id: 'twoTone', label: '双频突变', note: '前后两段频率不同，小波精准定位切换点' },
]

/** 母小波类型选项（用于连续小波变换） */
export interface WaveletOption {
  id: string
  label: string
  note: string
}

export const WAVELET_OPTIONS: WaveletOption[] = [
  { id: 'mexican', label: '墨西哥帽', note: '高斯二阶导，对称，定位尖峰' },
  { id: 'morlet', label: 'Morlet', note: '高斯包络的余弦，频率分辨率好' },
]

/**
 * 生成采样信号。返回长度为 n 的数组，n 应为 2 的幂以便做 Haar 变换。
 * t 归一化到 [0,1)。
 */
export function generateSignal(kind: string, n: number): number[] {
  const out = new Array<number>(n)
  for (let i = 0; i < n; i++) {
    const t = i / n
    if (kind === 'transient') {
      // 平稳低频正弦，在中段插入一个窄高斯脉冲
      const base = Math.sin(2 * Math.PI * 4 * t)
      const spike = Math.exp(-Math.pow((t - 0.5) / 0.01, 2)) * 2
      out[i] = base + spike
    } else if (kind === 'twoTone') {
      // 前半段低频、后半段高频，切换点在 t=0.5
      out[i] = t < 0.5 ? Math.sin(2 * Math.PI * 5 * t) : Math.sin(2 * Math.PI * 20 * t)
    } else {
      // 默认 chirp：瞬时频率随时间线性升高
      out[i] = Math.sin(2 * Math.PI * (3 + 25 * t) * t)
    }
  }
  return out
}

const SQRT1_2 = Math.SQRT1_2 // 1/sqrt(2)

/**
 * 单层 Haar 分解：把长度 len 的前缀拆成 均值(近似) + 差值(细节)。
 * 就地写入 tmp 再拷回，返回不修改原数组。
 */
function haarStep(data: number[], len: number): void {
  const tmp = new Array<number>(len)
  const half = len >> 1
  for (let i = 0; i < half; i++) {
    const a = data[2 * i]
    const b = data[2 * i + 1]
    tmp[i] = (a + b) * SQRT1_2 // 近似系数（低频）
    tmp[half + i] = (a - b) * SQRT1_2 // 细节系数（高频）
  }
  for (let i = 0; i < len; i++) data[i] = tmp[i]
}

/**
 * Haar 离散小波变换（完整多层）。要求 signal.length 为 2 的幂。
 * 返回变换后的系数数组（原地思想，但不修改入参）。
 */
export function haarDWT(signal: number[]): number[] {
  const n = signal.length
  if (!isPowerOfTwo(n)) throw new Error('haarDWT 需要长度为 2 的幂')
  const data = signal.slice()
  for (let len = n; len >= 2; len >>= 1) haarStep(data, len)
  return data
}

/** 单层 Haar 重构：由 均值+差值 还原原始的 len 个样本。 */
function ihaarStep(data: number[], len: number): void {
  const tmp = new Array<number>(len)
  const half = len >> 1
  for (let i = 0; i < half; i++) {
    const s = data[i]
    const d = data[half + i]
    tmp[2 * i] = (s + d) * SQRT1_2
    tmp[2 * i + 1] = (s - d) * SQRT1_2
  }
  for (let i = 0; i < len; i++) data[i] = tmp[i]
}

/** Haar 逆离散小波变换，与 haarDWT 互逆（正交变换可完美重构）。 */
export function haarIDWT(coeffs: number[]): number[] {
  const n = coeffs.length
  if (!isPowerOfTwo(n)) throw new Error('haarIDWT 需要长度为 2 的幂')
  const data = coeffs.slice()
  for (let len = 2; len <= n; len <<= 1) ihaarStep(data, len)
  return data
}

/** 判断是否为 2 的幂（且为正）。 */
export function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0
}

/**
 * 母小波在给定位置的取值（已做零均值处理）。
 * x 为标准化坐标（(t - b) / a）。
 */
export function motherWavelet(kind: string, x: number): number {
  if (kind === 'morlet') {
    // 实 Morlet：cos(5x) * 高斯包络，5 为中心频率
    return Math.cos(5 * x) * Math.exp(-(x * x) / 2)
  }
  // 墨西哥帽（Ricker）：高斯的二阶导
  const x2 = x * x
  return (1 - x2) * Math.exp(-x2 / 2)
}

/**
 * 简化连续小波变换 CWT。
 * @param signal 输入信号
 * @param scales 尺度数组（越大越"宽"，对应越低频）
 * @param kind 母小波类型
 * @returns scales.length × signal.length 的系数矩阵（每行一个尺度）
 */
export function cwt(signal: number[], scales: number[], kind: string): number[][] {
  const n = signal.length
  const out: number[][] = []
  for (const a of scales) {
    const row = new Array<number>(n)
    // 有效支撑约 ±4a，超出则忽略以省算力
    const half = Math.max(1, Math.ceil(4 * a))
    const norm = 1 / Math.sqrt(a)
    for (let b = 0; b < n; b++) {
      let sum = 0
      for (let tau = -half; tau <= half; tau++) {
        const idx = b + tau
        if (idx < 0 || idx >= n) continue
        sum += signal[idx] * motherWavelet(kind, tau / a)
      }
      row[b] = norm * sum
    }
    out.push(row)
  }
  return out
}

/** 生成一组按对数分布的尺度（从 minScale 到 maxScale，count 个）。 */
export function makeScales(minScale: number, maxScale: number, count: number): number[] {
  const scales: number[] = []
  const logMin = Math.log(minScale)
  const logMax = Math.log(maxScale)
  for (let i = 0; i < count; i++) {
    const f = count === 1 ? 0 : i / (count - 1)
    scales.push(Math.exp(logMin + (logMax - logMin) * f))
  }
  return scales
}

/** 计算数组的能量（平方和），用于验证 Parseval/能量守恒。 */
export function energy(arr: number[]): number {
  let e = 0
  for (const v of arr) e += v * v
  return e
}
