/**
 * 绝对值函数（纯函数数学内核，无 DOM）
 *
 * 一般形式 y = a * |x - h| + k：
 *  - 图像是一条 V 形折线，顶点在 (h, k)
 *  - a 控制开口方向与陡峭程度：a>0 开口向上，a<0 开口向下，|a| 越大越陡
 *  - h 水平平移，k 竖直平移
 */

/** 基本绝对值：|x| */
export function absValue(x: number): number {
  return x < 0 ? -x : x
}

/** 一般绝对值函数 y = a * |x - h| + k */
export function absFunction(x: number, a: number, h: number, k: number): number {
  return a * absValue(x - h) + k
}

/** 顶点坐标 (h, k)，即 V 形的拐点 */
export function vertex(h: number, k: number): { x: number; y: number } {
  return { x: h, y: k }
}

/**
 * 在区间 [xMin, xMax] 上等距采样 count+1 个点，返回 (x, y) 数组。
 * 用于绘制 V 形折线。
 */
export function samplePoints(
  a: number,
  h: number,
  k: number,
  xMin: number,
  xMax: number,
  count: number,
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = []
  const step = (xMax - xMin) / count
  for (let i = 0; i <= count; i++) {
    const x = xMin + step * i
    pts.push({ x, y: absFunction(x, a, h, k) })
  }
  return pts
}

/**
 * 求方程 a*|x-h|+k = 0 的实数解（即函数零点 / 与 x 轴交点）。
 * 令 |x-h| = -k/a，只有当该值 ≥ 0 时才有解。
 */
export function roots(a: number, h: number, k: number): number[] {
  if (a === 0) return []
  const t = -k / a
  if (t < 0) return []
  if (t === 0) return [h]
  return [h - t, h + t]
}

export interface AbsOption {
  a: number
  h: number
  k: number
  label: string
  note: string
}

/** 预设的几组参数，覆盖平移、翻转、缩放等典型情形 */
export const ABSOLUTE_VALUE_OPTIONS: AbsOption[] = [
  { a: 1, h: 0, k: 0, label: 'y = |x|', note: '最基本的 V 形，顶点在原点' },
  { a: 1, h: 2, k: 0, label: 'y = |x - 2|', note: '整体向右平移 2 个单位' },
  { a: 1, h: 0, k: 1, label: 'y = |x| + 1', note: '整体向上平移 1 个单位' },
  { a: 2, h: 0, k: 0, label: 'y = 2|x|', note: '开口更窄，V 形更陡' },
  { a: -1, h: 0, k: 3, label: 'y = -|x| + 3', note: '开口向下的倒 V 形' },
]
