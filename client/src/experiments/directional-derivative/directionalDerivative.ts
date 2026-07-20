/**
 * 方向导数核心算法（纯函数，便于测试）
 *
 * 二元函数 f(x,y) 在某点沿单位方向 u=(cosθ,sinθ) 的方向导数
 *   D_u f = grad f · u = |grad f| cos(夹角)
 * 因此沿梯度方向取到最大值 |grad f|，与梯度垂直的方向为 0，
 * 反方向取到最小值 -|grad f|。这里用中心差分求数值梯度，通用可靠。
 */

export interface Field {
  id: string
  label: string
  f: (x: number, y: number) => number
}

/** 可选的二元函数集合（导出常量） */
export const FUNCTIONS: Field[] = [
  { id: 'paraboloid', label: 'z = x² + y²', f: (x, y) => x * x + y * y },
  { id: 'saddle', label: 'z = x² − y²', f: (x, y) => x * x - y * y },
  { id: 'ripple', label: 'z = sin x · cos y', f: (x, y) => Math.sin(x) * Math.cos(y) },
]

/** 按 id 取函数，找不到则回退第一个 */
export function fieldById(id: string): Field {
  return FUNCTIONS.find((fn) => fn.id === id) ?? FUNCTIONS[0]
}

/** 中心差分求梯度 grad f = (∂f/∂x, ∂f/∂y) */
export function gradient(
  f: (x: number, y: number) => number,
  x: number,
  y: number,
  h = 1e-4,
): [number, number] {
  const fx = (f(x + h, y) - f(x - h, y)) / (2 * h)
  const fy = (f(x, y + h) - f(x, y - h)) / (2 * h)
  return [fx, fy]
}

/** 梯度的模，即方向导数能取到的最大值 */
export function gradMagnitude(
  f: (x: number, y: number) => number,
  x: number,
  y: number,
  h = 1e-4,
): number {
  const [gx, gy] = gradient(f, x, y, h)
  return Math.hypot(gx, gy)
}

/** 梯度方向的角度（弧度），即方向导数最大的方向 */
export function gradAngle(
  f: (x: number, y: number) => number,
  x: number,
  y: number,
  h = 1e-4,
): number {
  const [gx, gy] = gradient(f, x, y, h)
  return Math.atan2(gy, gx)
}

/** 方向导数 D_u f = grad f · u，u=(cosθ,sinθ) */
export function dirDeriv(
  f: (x: number, y: number) => number,
  x: number,
  y: number,
  angle: number,
  h = 1e-4,
): number {
  const [gx, gy] = gradient(f, x, y, h)
  return gx * Math.cos(angle) + gy * Math.sin(angle)
}

/** 观察用的固定考察点 */
export const SAMPLE_POINT: [number, number] = [1, 1]
