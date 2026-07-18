/**
 * 均匀三次 B 样条曲线核心算法（纯函数，便于测试）
 *
 * B 样条由一组控制点和一个节点向量决定，曲线不必经过控制点，
 * 而是被控制点"拉扯"成一条光滑曲线。三次 B 样条(degree=3)是
 * 最常用的一种：每一点只受相邻 4 个控制点影响，因此拖动一个
 * 控制点只改变局部曲线——这就是"局部支撑"。
 * 这里用 De Boor 递推直接求值，数值稳定。
 */

export interface Point {
  x: number
  y: number
}

export const DEGREE = 3

/** 演示用控制点（可拖动的初始布局） */
export const CONTROL_POINTS: Point[] = [
  { x: 60, y: 380 },
  { x: 150, y: 120 },
  { x: 260, y: 300 },
  { x: 370, y: 90 },
  { x: 480, y: 320 },
  { x: 560, y: 140 },
]

/** 均匀(clamped)节点向量：两端各重复 degree+1 次，中间等距 */
export function uniformKnots(n: number, degree: number): number[] {
  const knots: number[] = []
  const inner = n - degree // 内部区间数
  for (let i = 0; i <= n + degree; i++) {
    if (i <= degree) knots.push(0)
    else if (i >= n) knots.push(inner)
    else knots.push(i - degree)
  }
  return knots
}

/** 找到 u 所在的节点区间下标 k，使 knots[k] <= u < knots[k+1] */
export function findSpan(knots: number[], degree: number, n: number, u: number): number {
  if (u >= knots[n]) return n - 1
  let k = degree
  while (k < n - 1 && u >= knots[k + 1]) k++
  return k
}

/** De Boor 递推：求参数 u 处的曲线点 */
export function deBoor(points: Point[], degree: number, knots: number[], u: number): Point {
  const n = points.length
  const k = findSpan(knots, degree, n, u)
  const d: Point[] = []
  for (let j = 0; j <= degree; j++) {
    const idx = k - degree + j
    d[j] = { x: points[idx].x, y: points[idx].y }
  }
  for (let r = 1; r <= degree; r++) {
    for (let j = degree; j >= r; j--) {
      const i = k - degree + j
      const denom = knots[i + degree - r + 1] - knots[i]
      const a = denom === 0 ? 0 : (u - knots[i]) / denom
      d[j] = {
        x: (1 - a) * d[j - 1].x + a * d[j].x,
        y: (1 - a) * d[j - 1].y + a * d[j].y,
      }
    }
  }
  return d[degree]
}

/** 采样整条 B 样条曲线，返回 samples+1 个点 */
export function bsplineCurve(controlPoints: Point[], degree: number, samples: number): Point[] {
  const n = controlPoints.length
  if (n <= degree) return controlPoints.slice()
  const knots = uniformKnots(n, degree)
  const uMax = knots[n]
  const out: Point[] = []
  for (let i = 0; i <= samples; i++) {
    const u = (i / samples) * uMax * 0.99999
    out.push(deBoor(controlPoints, degree, knots, u))
  }
  return out
}

/** Cox-de Boor 基函数 N_{i,p}(u)，用于绘制基函数图 */
export function basisFunction(i: number, p: number, knots: number[], u: number): number {
  if (p === 0) {
    return u >= knots[i] && u < knots[i + 1] ? 1 : 0
  }
  const d1 = knots[i + p] - knots[i]
  const d2 = knots[i + p + 1] - knots[i + 1]
  const a = d1 === 0 ? 0 : ((u - knots[i]) / d1) * basisFunction(i, p - 1, knots, u)
  const b = d2 === 0 ? 0 : ((knots[i + p + 1] - u) / d2) * basisFunction(i + 1, p - 1, knots, u)
  return a + b
}
