/**
 * 伪球面（曳物线旋转面，纯函数，便于测试）
 *
 * 把曳物线（tractrix）绕它的渐近线旋转，得到常高斯曲率 K = -1/a² 的曲面。
 * 参数方程（u 为沿母线参数，v 为旋转角）：
 *
 *   x = a·sech(u)·cos(v)
 *   y = a·sech(u)·sin(v)
 *   z = a·(u - tanh(u))
 *
 * 意义：球面是常正曲率曲面，伪球面是常负曲率曲面，是双曲几何的局部模型。
 * 贝尔特拉米 1868 年用它首次给出非欧几何的具体实现，让双曲几何从
 * 「逻辑上自洽的怪物」变成了「看得见摸得着的曲面」。
 *
 * 注意希尔伯特定理：三维欧氏空间中不存在完备的常负曲率曲面，
 * 所以伪球面必然有奇边（u=0 处的那圈尖棱），只能局部实现双曲平面。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [0.001, 3]
export const V_RANGE: [number, number] = [0, 2 * Math.PI]

const sech = (x: number) => 1 / Math.cosh(x)

/** 伪球面参数方程。a 为伪球半径, 曲率 K = -1/a² */
export function pseudosphere(u: number, v: number, a = 1): Vec3 {
  const r = a * sech(u)
  return [r * Math.cos(v), r * Math.sin(v), a * (u - Math.tanh(u))]
}

/** 曳物线母线（在 rz 平面内），旋转它就得到伪球面 */
export function tractrix(u: number, a = 1): { r: number; z: number } {
  return { r: a * sech(u), z: a * (u - Math.tanh(u)) }
}

/** 高斯曲率解析值: 处处等于 -1/a²（这正是「常负曲率」的含义） */
export function gaussianCurvature(a = 1): number {
  return -1 / (a * a)
}

/** 第一基本形式。E = a²·tanh²(u)·sech⁰, F = 0, G = a²·sech²(u) */
export function firstFundamental(u: number, a = 1): { E: number; F: number; G: number } {
  const t = Math.tanh(u)
  const s = sech(u)
  return { E: a * a * t * t, F: 0, G: a * a * s * s }
}

/**
 * 曳物线的定义性质：从曲线上任一点沿切线到渐近线（z 轴）的线段长恒为 a。
 * 这是「拖拉」得名的由来 —— 拉一根定长绳子拖动重物走出的轨迹。
 */
export function tangentSegmentLength(u: number, a = 1): number {
  const h = 1e-7
  const p0 = tractrix(u - h, a)
  const p1 = tractrix(u + h, a)
  const dr = (p1.r - p0.r) / (2 * h)
  const dz = (p1.z - p0.z) / (2 * h)
  const p = tractrix(u, a)
  const len = Math.hypot(dr, dz)
  if (len < 1e-12) return a
  // 沿单位切向走到 r=0 所需的参数距离
  return Math.abs((p.r / dr) * len)
}

/**
 * 伪球面的总面积 = 4πa²，与半径 a 的球面面积完全相同。
 * 这是个漂亮的巧合，也是「伪球面」得名的原因之一。
 */
export function surfaceArea(a = 1): number {
  return 4 * Math.PI * a * a
}

/** 数值积分求侧面积, 用于验证 surfaceArea 的解析式 */
export function surfaceAreaNumeric(a = 1, uMax = 12, steps = 20000): number {
  let s = 0
  for (let i = 0; i < steps; i++) {
    const u = (uMax * (i + 0.5)) / steps
    const du = uMax / steps
    // dA = 2π·r·ds, ds = a·tanh(u)·du
    s += 2 * Math.PI * a * sech(u) * a * Math.tanh(u) * du
  }
  // 上下两半对称, 乘 2
  return 2 * s
}

export const PRESETS = [
  { a: 0.7, label: '小伪球', note: 'K = -2.04' },
  { a: 1, label: '单位伪球', note: 'K = -1' },
  { a: 1.5, label: '大伪球', note: 'K = -0.44' },
] as const
