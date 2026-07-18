/**
 * 弧长与曲率核心算法（纯函数，便于测试）
 *
 * 给定参数曲线 (x(t), y(t))：
 * - arcLength 用复合梯形法数值积分 ∫√(x'²+y'²) dt 求弧长；
 * - curvature 用 κ=(x'y''-y'x'')/(x'²+y'²)^1.5 求某点曲率；
 * - 一阶、二阶导数均用中心差分数值估计。
 */

export interface ParamCurve {
  id: string
  name: string
  x: (t: number) => number
  y: (t: number) => number
  tMin: number
  tMax: number
}

const H = 1e-4

/** 中心差分一阶导数 */
export function deriv1(f: (t: number) => number, t: number, h = H): number {
  return (f(t + h) - f(t - h)) / (2 * h)
}

/** 中心差分二阶导数 */
export function deriv2(f: (t: number) => number, t: number, h = H): number {
  return (f(t + h) - 2 * f(t) + f(t - h)) / (h * h)
}

/** 复合梯形法数值积分弧长 ∫_a^b √(x'²+y'²) dt */
export function arcLength(curve: ParamCurve, a: number, b: number, n = 400): number {
  if (n < 1) n = 1
  const dt = (b - a) / n
  const speed = (t: number) => {
    const xp = deriv1(curve.x, t)
    const yp = deriv1(curve.y, t)
    return Math.sqrt(xp * xp + yp * yp)
  }
  let sum = 0.5 * (speed(a) + speed(b))
  for (let i = 1; i < n; i++) sum += speed(a + i * dt)
  return sum * dt
}

/** 曲率 κ=(x'y''-y'x'')/(x'²+y'²)^1.5 */
export function curvature(curve: ParamCurve, t: number): number {
  const xp = deriv1(curve.x, t)
  const yp = deriv1(curve.y, t)
  const xpp = deriv2(curve.x, t)
  const ypp = deriv2(curve.y, t)
  const denom = Math.pow(xp * xp + yp * yp, 1.5)
  if (denom < 1e-12) return 0
  return (xp * ypp - yp * xpp) / denom
}

/** 曲率半径 1/|κ|（曲率为 0 时返回 Infinity） */
export function radiusOfCurvature(curve: ParamCurve, t: number): number {
  const k = Math.abs(curvature(curve, t))
  return k < 1e-9 ? Infinity : 1 / k
}

/** 单位切向量 (x'/s, y'/s) */
export function unitTangent(curve: ParamCurve, t: number): [number, number] {
  const xp = deriv1(curve.x, t)
  const yp = deriv1(curve.y, t)
  const s = Math.sqrt(xp * xp + yp * yp) || 1
  return [xp / s, yp / s]
}

/** 单位法向量（切向左转 90°，指向曲率中心一侧由 κ 符号决定） */
export function unitNormal(curve: ParamCurve, t: number): [number, number] {
  const [tx, ty] = unitTangent(curve, t)
  const s = Math.sign(curvature(curve, t)) || 1
  return [-ty * s, tx * s]
}

/** 曲率中心（密切圆圆心）= 曲线点沿法向偏移曲率半径 */
export function osculatingCenter(curve: ParamCurve, t: number): [number, number] {
  const r = radiusOfCurvature(curve, t)
  if (!isFinite(r)) return [curve.x(t), curve.y(t)]
  const [nx, ny] = unitNormal(curve, t)
  return [curve.x(t) + nx * r, curve.y(t) + ny * r]
}

export const CURVES: ParamCurve[] = [
  { id: 'circle', name: '圆', x: (t) => 2 * Math.cos(t), y: (t) => 2 * Math.sin(t), tMin: 0, tMax: 2 * Math.PI },
  { id: 'ellipse', name: '椭圆', x: (t) => 3 * Math.cos(t), y: (t) => 1.5 * Math.sin(t), tMin: 0, tMax: 2 * Math.PI },
  { id: 'parabola', name: '抛物线', x: (t) => t, y: (t) => 0.4 * t * t, tMin: -3, tMax: 3 },
  { id: 'spiral', name: '螺线', x: (t) => 0.25 * t * Math.cos(t), y: (t) => 0.25 * t * Math.sin(t), tMin: 0.5, tMax: 6 * Math.PI },
]
