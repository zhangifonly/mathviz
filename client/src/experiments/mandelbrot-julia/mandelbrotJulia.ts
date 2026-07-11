/**
 * 曼德博集与朱利亚集（纯函数数学内核，无 DOM）
 *
 * 迭代复动力系统 z -> z^2 + c。
 * - 曼德博集：固定 z0 = 0，让参数 c 扫过复平面，记录不逃逸的 c。
 * - 朱利亚集：固定参数 c，让初值 z0 扫过复平面，记录不逃逸的 z0。
 * 逃逸判据：当 |z| 超过 bailout（通常取 2）时判定发散。
 */

/** 逃逸时间：返回逃逸所需迭代步数；未逃逸返回 maxIter。 */
export function escapeTime(
  cx: number,
  cy: number,
  zx0: number,
  zy0: number,
  maxIter: number,
  bailout = 2,
): number {
  let zx = zx0
  let zy = zy0
  const b2 = bailout * bailout
  for (let i = 0; i < maxIter; i++) {
    const x2 = zx * zx
    const y2 = zy * zy
    if (x2 + y2 > b2) return i
    // z^2 + c：(zx + i zy)^2 = zx^2 - zy^2 + 2 zx zy i
    zy = 2 * zx * zy + cy
    zx = x2 - y2 + cx
  }
  return maxIter
}

/** 曼德博集逃逸时间：z0 = 0，c = (cx, cy)。 */
export function mandelbrotEscape(cx: number, cy: number, maxIter: number): number {
  return escapeTime(cx, cy, 0, 0, maxIter)
}

/** 朱利亚集逃逸时间：z0 = (zx, zy)，c = (cx, cy) 固定。 */
export function juliaEscape(
  zx: number,
  zy: number,
  cx: number,
  cy: number,
  maxIter: number,
): number {
  return escapeTime(cx, cy, zx, zy, maxIter)
}

/**
 * 平滑迭代值（连续着色）：iter + 1 - log(log|z|)/log2。
 * 已逃逸时用逃逸点模长做对数插值，消除色带。未逃逸返回 maxIter。
 */
export function smoothEscape(
  cx: number,
  cy: number,
  zx0: number,
  zy0: number,
  maxIter: number,
  bailout = 2,
): number {
  let zx = zx0
  let zy = zy0
  const b2 = bailout * bailout
  for (let i = 0; i < maxIter; i++) {
    const x2 = zx * zx
    const y2 = zy * zy
    const mag2 = x2 + y2
    if (mag2 > b2) {
      const logZn = Math.log(mag2) / 2
      const nu = Math.log(logZn / Math.log(2)) / Math.log(2)
      return i + 1 - nu
    }
    zy = 2 * zx * zy + cy
    zx = x2 - y2 + cx
  }
  return maxIter
}

export interface JuliaOption {
  cx: number
  cy: number
  label: string
  note: string
}

/** 几个经典的朱利亚集参数 c，均取自广为人知的漂亮样例。 */
export const JULIA_OPTIONS: JuliaOption[] = [
  { cx: -0.4, cy: 0.6, label: 'c = -0.4 + 0.6i', note: '经典树枝状连通结构' },
  { cx: -0.8, cy: 0.156, label: 'c = -0.8 + 0.156i', note: '细长的螺旋触须' },
  { cx: 0.285, cy: 0.01, label: 'c = 0.285 + 0.01i', note: '近乎圆盘的连通集' },
  { cx: -0.70176, cy: -0.3842, label: 'c = -0.70176 - 0.3842i', note: '海马谷附近的花纹' },
  { cx: -0.123, cy: 0.745, label: 'c = -0.123 + 0.745i', note: '兔子分形（Douady 兔子）' },
]
