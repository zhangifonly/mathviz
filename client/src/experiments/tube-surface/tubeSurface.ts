/**
 * 管状曲面（纯函数，便于测试）
 *
 * 沿一条空间曲线套一根等半径的圆管。难点不在圆管本身，而在
 * **截面朝向**：必须让圆截面始终垂直于曲线，且相邻截面不能突然扭转，
 * 否则管子会自己拧起来。
 *
 * 标准做法是 Frenet 标架（切向 T、法向 N、副法向 B）：
 *   T = γ′/|γ′|
 *   N = T′/|T′|
 *   B = T × N
 * 管面 = γ(t) + r·(cos θ·N + sin θ·B)
 *
 * ⚠️ Frenet 标架在曲率为零的点（直线段、拐点）无定义 —— N 的分母归零。
 * 本实验选的三条曲线都处处有正曲率，避开这个奇点；实际工程中遇到直线段
 * 需换 Bishop 标架（旋转最小标架）。
 */

import type { Vec3 } from '../../lib/proj3d'

export const CURVES = ['helix', 'trefoil', 'viviani'] as const
export type CurveKind = (typeof CURVES)[number]

export interface CurveInfo {
  kind: CurveKind
  label: string
  equation: string
  note: string
}

export const CURVE_INFO: CurveInfo[] = [
  { kind: 'helix', label: '螺旋线', equation: '(cos t, sin t, 0.3t)', note: '曲率与挠率均为常数' },
  { kind: 'trefoil', label: '三叶结', equation: 'sin t + 2sin 2t, …', note: '最简单的非平凡纽结' },
  { kind: 'viviani', label: '维维亚尼曲线', equation: '(1+cos t, sin t, 2sin(t/2))', note: '球与柱面的交线' },
]

/** 中心曲线 */
export function centerCurve(kind: CurveKind, t: number): Vec3 {
  switch (kind) {
    case 'helix':
      return [Math.cos(t), Math.sin(t), 0.3 * t]
    case 'trefoil':
      return [
        Math.sin(t) + 2 * Math.sin(2 * t),
        Math.cos(t) - 2 * Math.cos(2 * t),
        -Math.sin(3 * t),
      ]
    case 'viviani':
      return [1 + Math.cos(t), Math.sin(t), 2 * Math.sin(t / 2)]
  }
}

export function curveRange(kind: CurveKind): [number, number] {
  if (kind === 'helix') return [0, 6 * Math.PI]
  return [0, 2 * Math.PI]
}

function norm(v: Vec3): number {
  return Math.hypot(v[0], v[1], v[2])
}

function unit(v: Vec3): Vec3 {
  const n = norm(v)
  if (n < 1e-12) return [0, 0, 1]
  return [v[0] / n, v[1] / n, v[2] / n]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function diff(fn: (t: number) => Vec3, at: number, h: number): Vec3 {
  const a = fn(at - h)
  const b = fn(at + h)
  return [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h), (b[2] - a[2]) / (2 * h)]
}

export interface Frame {
  T: Vec3
  N: Vec3
  B: Vec3
}

/** Frenet 标架。三个向量应两两正交且都是单位长 */
export function frenetFrame(kind: CurveKind, t: number, h = 1e-5): Frame {
  const g = (s: number) => centerCurve(kind, s)
  const T = unit(diff(g, t, h))
  // N 由 T 的导数给出; 曲率为零时该导数归零, 此处退化(见文件头注释)
  const dT = diff((s) => unit(diff(g, s, h)), t, h)
  const N = unit(dT)
  return { T, N, B: cross(T, N) }
}

/** 管面参数方程: γ(t) + r·(cos θ·N + sin θ·B) */
export function tubeSurface(kind: CurveKind, t: number, theta: number, r = 0.25): Vec3 {
  const c = centerCurve(kind, t)
  const { N, B } = frenetFrame(kind, t)
  return [
    c[0] + r * (Math.cos(theta) * N[0] + Math.sin(theta) * B[0]),
    c[1] + r * (Math.cos(theta) * N[1] + Math.sin(theta) * B[1]),
    c[2] + r * (Math.cos(theta) * N[2] + Math.sin(theta) * B[2]),
  ]
}

export const THETA_RANGE: [number, number] = [0, 2 * Math.PI]

/** 曲线曲率 κ = |γ′ × γ″| / |γ′|³ */
export function curvature(kind: CurveKind, t: number, h = 1e-4): number {
  const g = (s: number) => centerCurve(kind, s)
  const d1 = diff(g, t, h)
  const a = g(t - h)
  const b = g(t)
  const c = g(t + h)
  const d2: Vec3 = [
    (a[0] - 2 * b[0] + c[0]) / (h * h),
    (a[1] - 2 * b[1] + c[1]) / (h * h),
    (a[2] - 2 * b[2] + c[2]) / (h * h),
  ]
  const n1 = norm(d1)
  if (n1 < 1e-12) return 0
  return norm(cross(d1, d2)) / (n1 * n1 * n1)
}

/** 管面上任意点到中心曲线对应点的距离应恒等于 r */
export function radialError(kind: CurveKind, t: number, theta: number, r = 0.25): number {
  const p = tubeSurface(kind, t, theta, r)
  const c = centerCurve(kind, t)
  return Math.abs(Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]) - r)
}

export function infoOf(kind: CurveKind): CurveInfo {
  return CURVE_INFO.find((c) => c.kind === kind) ?? CURVE_INFO[0]
}
