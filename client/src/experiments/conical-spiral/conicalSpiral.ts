/**
 * 圆锥螺线（纯函数，便于测试）
 *
 * 缠绕在圆锥表面、且与所有母线成固定角的曲线：
 *   r(t) = r₀·e^(k·t)          到轴的距离按指数增长
 *   x = r(t)·cos t
 *   y = r(t)·sin t
 *   z = r(t)/tan(α)            α 为圆锥半顶角
 *
 * 两条可验证的核心性质：
 *
 * 1. **投影是对数螺线**：把它压到底面（丢弃 z），得到 r = r₀e^(kt)，
 *    正是对数螺线。所以圆锥螺线可以看作「对数螺线被抬到圆锥上」。
 *
 * 2. **等角性**：与所有母线的夹角恒定。母线是从顶点出发的直线，
 *    曲线在每点的切向与该点母线方向的夹角处处相同 ——
 *    这正是它被称为「圆锥等角螺线」的原因。
 *
 * 另外它落在圆锥面上：x²+y² = (z·tanα)²，残差应恒为零。
 */

import type { Curve3D } from '../../lib/curve3d'

export interface ConicalParams {
  /** 初始半径 */
  r0: number
  /** 指数增长率 */
  k: number
  /** 圆锥半顶角(弧度) */
  alpha: number
}

export const CLASSIC: ConicalParams = { r0: 0.12, k: 0.16, alpha: Math.PI / 5 }

export const T_RANGE: [number, number] = [0, 8 * Math.PI]

/** 到轴的距离 r(t) = r₀·e^(kt) */
export function radiusAt(t: number, p: ConicalParams = CLASSIC): number {
  return p.r0 * Math.exp(p.k * t)
}

/** 圆锥螺线 */
export function conicalSpiral(p: ConicalParams = CLASSIC): Curve3D {
  return (t) => {
    const r = radiusAt(t, p)
    return [r * Math.cos(t), r * Math.sin(t), r / Math.tan(p.alpha)]
  }
}

/** 只调半顶角的便捷接口 */
export function conicalSpiralAlpha(alpha: number): Curve3D {
  return conicalSpiral({ ...CLASSIC, alpha })
}

/** 圆锥面残差 x²+y² − (z·tanα)²，应恒为 0 */
export function coneResidual(t: number, p: ConicalParams = CLASSIC): number {
  const [x, y, z] = conicalSpiral(p)(t)
  const rt = z * Math.tan(p.alpha)
  return x * x + y * y - rt * rt
}

/** 底面投影的半径，应等于 radiusAt（即对数螺线） */
export function projectionRadius(t: number, p: ConicalParams = CLASSIC): number {
  const [x, y] = conicalSpiral(p)(t)
  return Math.hypot(x, y)
}

/**
 * 与母线的夹角。母线方向 = 从顶点(原点)指向该点的单位向量，
 * 曲线切向与它的夹角应处处相同。
 */
export function generatorAngle(t: number, p: ConicalParams = CLASSIC, h = 1e-6): number {
  const c = conicalSpiral(p)
  const q = c(t)
  const a = c(t - h)
  const b = c(t + h)
  const tangent = [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h), (b[2] - a[2]) / (2 * h)]
  const nq = Math.hypot(q[0], q[1], q[2])
  const nt = Math.hypot(tangent[0], tangent[1], tangent[2])
  if (nq < 1e-12 || nt < 1e-12) return 0
  const dot = q[0] * tangent[0] + q[1] * tangent[1] + q[2] * tangent[2]
  return Math.acos(Math.max(-1, Math.min(1, dot / (nq * nt))))
}

/** 每绕一圈的半径放大倍数 e^(2πk) */
export function growthPerTurn(p: ConicalParams = CLASSIC): number {
  return Math.exp(2 * Math.PI * p.k)
}

/** 顶点处的极限：t → −∞ 时曲线趋于原点 */
export function apexLimit(p: ConicalParams = CLASSIC): number {
  return radiusAt(-1e3, p)
}

export const PRESETS = [
  { alpha: Math.PI / 7, label: '尖锥', note: '半顶角 25.7°' },
  { alpha: Math.PI / 5, label: '标准', note: '半顶角 36°' },
  { alpha: Math.PI / 3.5, label: '钝锥', note: '半顶角 51.4°' },
] as const
