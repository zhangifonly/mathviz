/**
 * 迪尼曲面（纯函数，便于测试）
 *
 * 把伪球面沿 z 轴方向「螺旋推进」得到的常负曲率曲面。参数方程：
 *
 *   x = a·cos(u)·sin(v)
 *   y = a·sin(u)·sin(v)
 *   z = a·(cos(v) + ln(tan(v/2))) + b·u
 *
 * 由意大利数学家 Ulisse Dini 给出。它与伪球面同属「螺旋面族」
 * (helicoidal surfaces of constant negative curvature)：
 *   b=0 退化为伪球面（纯旋转），b>0 时每绕一圈上升 2πb。
 *
 * 高斯曲率 K = -1/(a²+b²)，处处相同 —— 所以它也是双曲平面的局部模型，
 * 只不过卷成了无限延伸的螺旋海螺形状。
 */

import type { Vec3 } from '../../lib/proj3d'

/** v 不能取到 0 或 π: ln(tan(v/2)) 在两端发散 */
export const U_RANGE: [number, number] = [0, 4 * Math.PI]
export const V_RANGE: [number, number] = [0.05, Math.PI / 2]

/** 迪尼曲面参数方程。a 控制粗细, b 控制螺距(b=0 即伪球面) */
export function dini(u: number, v: number, a = 1, b = 0.2): Vec3 {
  const s = Math.sin(v)
  return [
    a * Math.cos(u) * s,
    a * Math.sin(u) * s,
    a * (Math.cos(v) + Math.log(Math.tan(v / 2))) + b * u,
  ]
}

/**
 * 高斯曲率解析值 K = -1/(a²+b²)。
 * 关键性质：与 (u,v) 无关，即处处等于同一个负数。
 */
export function gaussianCurvature(a = 1, b = 0.2): number {
  return -1 / (a * a + b * b)
}

/** 每绕一圈的上升高度（螺距）。b=0 时为 0，退化成旋转面 */
export function pitch(b = 0.2): number {
  return 2 * Math.PI * b
}

/** 第一基本形式。E = a²sin²v + b², F = a·b·cos v... 这里给出对角化前的三系数 */
export function firstFundamental(
  v: number, a = 1, b = 0.2,
): { E: number; F: number; G: number } {
  const s = Math.sin(v)
  const c = Math.cos(v)
  // x_u = (-a sin u sin v, a cos u sin v, b)
  const E = a * a * s * s + b * b
  // x_v = (a cos u cos v, a sin u cos v, a·(-sin v + 1/sin v))
  //     z_v = a·(-sin v + csc v) = a·cos²v/sin v
  const zv = (a * c * c) / s
  const G = a * a * c * c + zv * zv
  // x_u · x_v = b·z_v （旋转部分正交, 只剩 z 分量的乘积）
  const F = b * zv
  return { E, F, G }
}

/**
 * 数值求高斯曲率, 用于验证解析式 K = -1/(a²+b²)。
 * K = (LN - M²)/(EG - F²)
 */
export function gaussianCurvatureNumeric(
  u: number, v: number, a = 1, b = 0.2, h = 1e-5,
): number {
  const f = (p: number, q: number) => dini(p, q, a, b)
  const xu = d1((t) => f(t, v), u, h)
  const xv = d1((t) => f(u, t), v, h)
  const xuu = d2((t) => f(t, v), u, h)
  const xvv = d2((t) => f(u, t), v, h)
  const xuv = d1((t) => d1((s) => f(s, t), u, h), v, h)

  const n = cross(xu, xv)
  const nl = Math.hypot(n[0], n[1], n[2])
  if (nl < 1e-12) return 0
  const N: Vec3 = [n[0] / nl, n[1] / nl, n[2] / nl]

  const E = dot(xu, xu)
  const F = dot(xu, xv)
  const G = dot(xv, xv)
  const L = dot(xuu, N)
  const M = dot(xuv, N)
  const NN = dot(xvv, N)
  const den = E * G - F * F
  if (Math.abs(den) < 1e-12) return 0
  return (L * NN - M * M) / den
}

function d1(fn: (t: number) => Vec3, at: number, h: number): Vec3 {
  const a = fn(at - h)
  const b = fn(at + h)
  return [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h), (b[2] - a[2]) / (2 * h)]
}

function d2(fn: (t: number) => Vec3, at: number, h: number): Vec3 {
  const a = fn(at - h)
  const b = fn(at)
  const c = fn(at + h)
  return [
    (a[0] - 2 * b[0] + c[0]) / (h * h),
    (a[1] - 2 * b[1] + c[1]) / (h * h),
    (a[2] - 2 * b[2] + c[2]) / (h * h),
  ]
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

export const PRESETS = [
  { a: 1, b: 0, label: '退化为伪球面', note: '螺距 0' },
  { a: 1, b: 0.2, label: '标准迪尼曲面', note: 'K = -0.96' },
  { a: 1, b: 0.6, label: '拉长螺旋', note: '螺距 3.77' },
] as const
