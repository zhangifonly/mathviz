/**
 * 恩内佩尔曲面（纯函数，便于测试）
 *
 * 由 Alfred Enneper 1864 年给出的极小曲面，参数方程是纯三次多项式：
 *
 *   x = u - u³/3 + u·v²
 *   y = v - v³/3 + v·u²
 *   z = u² - v²
 *
 * 它处处平均曲率为零（极小曲面），但不是嵌入的 —— 会自交出四片花瓣。
 * 历史意义：它是「完备极小曲面未必嵌入」的第一个反例，
 * 说明极小曲面理论里「浸入」与「嵌入」必须严格区分。
 *
 * 用复参数 w = u+iv 看，它的 Weierstrass 表示极其简洁: f=1, g=w。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [-2, 2]
export const V_RANGE: [number, number] = [-2, 2]

/** 恩内佩尔曲面参数方程。scale 控制整体大小 */
export function enneper(u: number, v: number, scale = 1): Vec3 {
  const s = scale
  return [
    s * (u - (u * u * u) / 3 + u * v * v),
    s * (v - (v * v * v) / 3 + v * u * u),
    s * (u * u - v * v),
  ]
}

/**
 * 第一基本形式系数。恩内佩尔曲面是等温参数化：
 * E = G = (1+u²+v²)², F = 0。
 */
export function firstFundamental(u: number, v: number): { E: number; F: number; G: number } {
  const lambda = (1 + u * u + v * v) ** 2
  return { E: lambda, F: 0, G: lambda }
}

/**
 * 高斯曲率的解析式。恩内佩尔曲面 K = -4/(1+u²+v²)⁴，
 * 处处为负（极小曲面的高斯曲率必非正），在原点取最小值 -4。
 */
export function gaussianCurvature(u: number, v: number): number {
  return -4 / (1 + u * u + v * v) ** 4
}

/** 平均曲率恒为零 —— 极小曲面的定义。解析结果直接给出 0 */
export function meanCurvature(): number {
  return 0
}

/**
 * 数值验证用: 由参数方程差分算平均曲率。
 * 单测拿它跟解析的 0 对照, 确认参数方程本身没抄错。
 */
export function meanCurvatureNumeric(u: number, v: number, h = 1e-4): number {
  const f = (a: number, b: number) => enneper(a, b)
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
  const den = 2 * (E * G - F * F)
  if (Math.abs(den) < 1e-12) return 0
  return (G * L - 2 * F * M + E * NN) / den
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
  { scale: 0.6, label: '收紧', note: '花瓣尚未相交' },
  { scale: 1, label: '标准', note: '四片花瓣自交' },
  { scale: 1.4, label: '放大', note: '自交更明显' },
] as const
