/**
 * 指数与对数（纯函数，便于测试，不依赖 DOM）
 *
 * 指数函数 y = a^x 与对数函数 y = log_a(x) 互为反函数，
 * 它们的图像关于直线 y = x 对称。这里提供采样、求值与
 * 关键恒等式所需的纯计算函数。
 */

export interface Point {
  x: number
  y: number
}

/** 指数函数求值：a^x（a>0）。 */
export function expValue(base: number, x: number): number {
  return Math.pow(base, x)
}

/**
 * 对数函数求值：log_a(x) = ln(x) / ln(a)（换底公式）。
 * 定义域 x>0；x<=0 或底数非法时返回 NaN。
 */
export function logValue(base: number, x: number): number {
  if (x <= 0 || base <= 0 || base === 1) return NaN
  return Math.log(x) / Math.log(base)
}

/** 在 [xMin, xMax] 上等距采样指数曲线，返回 n+1 个点。 */
export function sampleExp(base: number, xMin: number, xMax: number, n: number): Point[] {
  const pts: Point[] = []
  for (let i = 0; i <= n; i++) {
    const x = xMin + ((xMax - xMin) * i) / n
    pts.push({ x, y: expValue(base, x) })
  }
  return pts
}

/**
 * 在 (0, xMax] 上等距采样对数曲线，返回 n 个点。
 * 从一个小正数起步以避开 x=0 处的垂直渐近线。
 */
export function sampleLog(base: number, xMax: number, n: number): Point[] {
  const pts: Point[] = []
  const xMin = xMax / (n + 1)
  for (let i = 0; i < n; i++) {
    const x = xMin + ((xMax - xMin) * i) / (n - 1)
    pts.push({ x, y: logValue(base, x) })
  }
  return pts
}

/** 换底公式：log_a(x) = log_c(x) / log_c(a)，此处以 c=e 校验。 */
export function changeBase(base: number, x: number, viaBase: number): number {
  if (x <= 0) return NaN
  return (Math.log(x) / Math.log(viaBase)) / (Math.log(base) / Math.log(viaBase))
}

/** 指数与对数互为反函数：log_a(a^x) 应恒等于 x。 */
export function inverseCheck(base: number, x: number): number {
  return logValue(base, expValue(base, x))
}

export interface BaseOption {
  base: number
  label: string
  note: string
}

/** 欧拉数 e，作为自然底数选项。 */
export const E = Math.E

export const BASE_OPTIONS: BaseOption[] = [
  { base: 2, label: '底数 2', note: '每增加 1，数值翻一倍' },
  { base: E, label: '自然底数 e', note: '约等于 2.718，微积分的宠儿' },
  { base: 10, label: '底数 10', note: '常用对数，刻画数量级' },
  { base: 0.5, label: '底数 0.5', note: '底数小于 1，曲线递减' },
]
