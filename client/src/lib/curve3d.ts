/**
 * 空间曲线的共享分析工具（纯函数，便于测试）
 *
 * 四个曲线实验（Frenet 标架、维维亚尼、圆锥螺线、球面螺线）共用这套工具，
 * 各自只需给出参数方程。
 *
 * 提供曲线论的三个基本量：
 *   弧长      s = ∫|γ'|dt
 *   曲率      κ = |γ'×γ''| / |γ'|³
 *   挠率      τ = (γ'×γ'')·γ''' / |γ'×γ''|²
 *
 * **曲线论基本定理**：曲率与挠率作为弧长的函数，完全决定一条空间曲线的
 * 形状（差一个刚体运动）。这是本组实验的统一主题 ——
 * 两个标量函数就把三维曲线的全部几何信息装下了。
 */

import type { Vec3 } from './proj3d'

export type Curve3D = (t: number) => Vec3

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

export function cross3(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

export function dot3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

export function norm3(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2])
}

export function unit3(a: Vec3): Vec3 {
  const n = norm3(a)
  if (n < 1e-12) return [0, 0, 1]
  return [a[0] / n, a[1] / n, a[2] / n]
}

/** 一阶导（中心差分） */
export function d1(c: Curve3D, t: number, h = 1e-5): Vec3 {
  const a = c(t - h)
  const b = c(t + h)
  return [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h), (b[2] - a[2]) / (2 * h)]
}

/** 二阶导 */
export function d2(c: Curve3D, t: number, h = 1e-4): Vec3 {
  const a = c(t - h)
  const m = c(t)
  const b = c(t + h)
  return [
    (a[0] - 2 * m[0] + b[0]) / (h * h),
    (a[1] - 2 * m[1] + b[1]) / (h * h),
    (a[2] - 2 * m[2] + b[2]) / (h * h),
  ]
}

/** 三阶导（挠率需要它） */
export function d3(c: Curve3D, t: number, h = 1e-3): Vec3 {
  // f'''≈ (-f(t-2h) + 2f(t-h) - 2f(t+h) + f(t+2h)) / (2h³)
  const m2 = c(t - 2 * h)
  const m1 = c(t - h)
  const p1 = c(t + h)
  const p2 = c(t + 2 * h)
  const k = 1 / (2 * h * h * h)
  return [
    k * (-m2[0] + 2 * m1[0] - 2 * p1[0] + p2[0]),
    k * (-m2[1] + 2 * m1[1] - 2 * p1[1] + p2[1]),
    k * (-m2[2] + 2 * m1[2] - 2 * p1[2] + p2[2]),
  ]
}

/** 曲率 κ = |γ'×γ''| / |γ'|³ */
export function curvature(c: Curve3D, t: number): number {
  const v = d1(c, t)
  const a = d2(c, t)
  const n = norm3(v)
  if (n < 1e-12) return 0
  return norm3(cross3(v, a)) / (n * n * n)
}

/**
 * 挠率 τ = (γ'×γ'')·γ''' / |γ'×γ''|²。
 *
 * ⚠️ 兜底阈值取 1e-6 而非 1e-9: 直线上 |γ'×γ''| 理论为 0, 但数值差分会给出
 * 1e-8 量级的残余, 若阈值太小就会走进正常分支, 拿 1e-16 除以 1e-16 得到
 * 无意义的大数。曲率为零处挠率本就无定义, 返回 0 是合适的约定。
 */
export function torsion(c: Curve3D, t: number): number {
  const v = d1(c, t)
  const a = d2(c, t)
  const j = d3(c, t)
  const va = cross3(v, a)
  const d = norm3(va)
  if (d < 1e-6) return 0
  return dot3(va, j) / (d * d)
}

export interface Frame3D {
  T: Vec3
  N: Vec3
  B: Vec3
}

/**
 * Frenet 标架。用 T = γ'/|γ'|、B = (γ'×γ'')/|γ'×γ''|、N = B×T 构造，
 * 比"对 T 求导再归一化"数值稳定得多（后者要算两次差分，误差放大）。
 */
export function frenet(c: Curve3D, t: number): Frame3D {
  const v = d1(c, t)
  const a = d2(c, t)
  const T = unit3(v)
  const va = cross3(v, a)
  if (norm3(va) < 1e-9) {
    // 曲率为零处 N/B 无定义, 返回一组与 T 正交的向量占位
    const tmp: Vec3 = Math.abs(T[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]
    const B = unit3(cross3(T, tmp))
    return { T, N: cross3(B, T), B }
  }
  const B = unit3(va)
  return { T, N: cross3(B, T), B }
}

/** 弧长（复化辛普森积分） */
export function arcLength(c: Curve3D, t0: number, t1: number, n = 400): number {
  const m = n % 2 === 0 ? n : n + 1
  const h = (t1 - t0) / m
  const f = (t: number) => norm3(d1(c, t))
  let s = f(t0) + f(t1)
  for (let i = 1; i < m; i++) {
    s += f(t0 + i * h) * (i % 2 === 1 ? 4 : 2)
  }
  return (h / 3) * s
}

/** 闭合性偏差 */
export function closureGap(c: Curve3D, t0: number, t1: number): number {
  return norm3(sub(c(t1), c(t0)))
}

/** 采样曲线为点集 */
export function sample(c: Curve3D, t0: number, t1: number, n = 600): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i <= n; i++) out.push(c(t0 + ((t1 - t0) * i) / n))
  return out
}

/** Frenet 标架的正交性误差（三个内积的最大绝对值） */
export function frenetOrthoError(c: Curve3D, t: number): number {
  const { T, N, B } = frenet(c, t)
  return Math.max(
    Math.abs(dot3(T, N)), Math.abs(dot3(T, B)), Math.abs(dot3(N, B)),
  )
}

/** Frenet 标架的单位性误差 */
export function frenetUnitError(c: Curve3D, t: number): number {
  const { T, N, B } = frenet(c, t)
  return Math.max(
    Math.abs(norm3(T) - 1), Math.abs(norm3(N) - 1), Math.abs(norm3(B) - 1),
  )
}
