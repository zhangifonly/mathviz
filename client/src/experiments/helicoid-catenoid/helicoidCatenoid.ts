/**
 * 螺旋面 ↔ 悬链面 的伴随变形（纯函数，便于测试）
 *
 * 两张曲面都是极小曲面（处处平均曲率 H=0）。它们互为「伴随曲面」，
 * 存在一族由参数 θ 连接的中间曲面，全程保持 H=0：
 *
 *   x(u,v) = cosθ · sinh(v) · sin(u) + sinθ · cosh(v) · cos(u)
 *   y(u,v) = -cosθ · sinh(v) · cos(u) + sinθ · cosh(v) · sin(u)
 *   z(u,v) = u · cosθ + v · sinθ
 *
 * θ=0 是螺旋面（直纹面，可由直线扫出），θ=π/2 是悬链面（旋转面）。
 * 这族变形是等距的：曲面上任意两点间的最短路径长度全程不变，
 * 所以能「不撕不皱」地从螺旋面卷成悬链面。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [-Math.PI, Math.PI]
export const V_RANGE: [number, number] = [-1, 1]

/** 伴随族参数方程。theta=0 螺旋面, theta=PI/2 悬链面 */
export function associateFamily(u: number, v: number, theta: number): Vec3 {
  const ct = Math.cos(theta)
  const st = Math.sin(theta)
  const sh = Math.sinh(v)
  const ch = Math.cosh(v)
  return [
    ct * sh * Math.sin(u) + st * ch * Math.cos(u),
    -ct * sh * Math.cos(u) + st * ch * Math.sin(u),
    u * ct + v * st,
  ]
}

/** 纯螺旋面: z 正比于旋转角, 每点都有一条水平直线穿过 */
export function helicoid(u: number, v: number): Vec3 {
  return associateFamily(u, v, 0)
}

/** 纯悬链面: 悬链线 cosh 绕 z 轴旋转 */
export function catenoid(u: number, v: number): Vec3 {
  return associateFamily(u, v, Math.PI / 2)
}

/**
 * 第一基本形式的三个系数 E,F,G。
 * 伴随族在变形中 E,F,G 全程不变 —— 这正是「等距」的判据，
 * 也是本实验最关键的可验证性质。
 */
export function firstFundamental(
  u: number, v: number, theta: number,
): { E: number; F: number; G: number } {
  const h = 1e-6
  const du = diff((t) => associateFamily(t, v, theta), u, h)
  const dv = diff((t) => associateFamily(u, t, theta), v, h)
  return { E: dot(du, du), F: dot(du, dv), G: dot(dv, dv) }
}

function diff(fn: (t: number) => Vec3, at: number, h: number): Vec3 {
  const a = fn(at - h)
  const b = fn(at + h)
  return [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h), (b[2] - a[2]) / (2 * h)]
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

/**
 * 平均曲率 H（数值求二阶导）。极小曲面处处 H=0，
 * 这里用来验证整族变形都是极小曲面。
 */
export function meanCurvature(u: number, v: number, theta: number): number {
  const h = 1e-4
  const f = (a: number, b: number) => associateFamily(a, b, theta)
  const xu = diff((t) => f(t, v), u, h)
  const xv = diff((t) => f(u, t), v, h)
  const xuu = second((t) => f(t, v), u, h)
  const xvv = second((t) => f(u, t), v, h)
  const xuv = diff((t) => diff((s) => f(s, t), u, h), v, h)

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
  const den = 2 * (E * G - F * F)
  if (Math.abs(den) < 1e-12) return 0
  return (G * L - 2 * F * M + E * NN) / den
}

function second(fn: (t: number) => Vec3, at: number, h: number): Vec3 {
  const a = fn(at - h)
  const b = fn(at)
  const c = fn(at + h)
  return [
    (a[0] - 2 * b[0] + c[0]) / (h * h),
    (a[1] - 2 * b[1] + c[1]) / (h * h),
    (a[2] - 2 * b[2] + c[2]) / (h * h),
  ]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

export const STAGES = [
  { theta: 0, label: '螺旋面', note: '直纹面 · 由直线扫出' },
  { theta: Math.PI / 4, label: '中间曲面', note: '仍是极小曲面' },
  { theta: Math.PI / 2, label: '悬链面', note: '旋转面 · 肥皂膜形状' },
] as const
