/**
 * 可展曲面（纯函数，便于测试）
 *
 * 高斯曲率恒为零的曲面能不撕不皱地摊平成平面。这类曲面只有三种：
 *
 *   柱面    directrix 上每点的直线方向都相同（平行直线族）
 *   锥面    所有直线过同一顶点
 *   切线面  直线族是某条空间曲线的切线
 *
 * 这个分类是完备的 —— 任何可展曲面局部都是这三者之一（或它们的拼接）。
 *
 * 可展性的两个等价判据：
 *   1. K ≡ 0（高斯曲率恒零）
 *   2. det[γ′(u), d(u), d′(u)] ≡ 0（准线导数、方向、方向导数共面）
 *
 * 实际意义：钣金加工、纸模型、船体外板、服装打版全靠它 ——
 * 只有可展曲面才能用平板材料无褶皱地做出来。
 */

import type { Vec3 } from '../../lib/proj3d'

export const DEV_KINDS = ['cylinder', 'cone', 'tangent', 'nondev'] as const
export type DevKind = (typeof DEV_KINDS)[number]

export interface DevInfo {
  kind: DevKind
  label: string
  developable: boolean
  note: string
}

export const DEV_INFO: DevInfo[] = [
  { kind: 'cylinder', label: '柱面', developable: true, note: '方向恒定 · 可摊平' },
  { kind: 'cone', label: '锥面', developable: true, note: '共顶点 · 可摊平' },
  { kind: 'tangent', label: '切线面', developable: true, note: '曲线的切线族 · 可摊平' },
  { kind: 'nondev', label: '螺旋面(反例)', developable: false, note: 'K < 0 · 摊不平' },
]

/** 准线 */
export function directrix(kind: DevKind, u: number): Vec3 {
  switch (kind) {
    case 'cylinder':
      // 一条平面曲线作准线
      return [Math.cos(u), Math.sin(u) * 0.7, 0]
    case 'cone':
      return [0, 0, 1.2]
    case 'tangent':
      // 螺旋线作基曲线, 它的切线族张成切线面
      return [Math.cos(u), Math.sin(u), 0.35 * u]
    case 'nondev':
      return [0, 0, u / 3]
  }
}

/** 直线方向 */
export function direction(kind: DevKind, u: number): Vec3 {
  switch (kind) {
    case 'cylinder':
      // 恒定方向 —— 这就是「柱面」的定义
      return [0, 0, 1]
    case 'cone':
      return [Math.cos(u), Math.sin(u) * 0.7, -1.2]
    case 'tangent':
      // 螺旋线的切向量
      return [-Math.sin(u), Math.cos(u), 0.35]
    case 'nondev':
      return [Math.cos(u), Math.sin(u), 0]
  }
}

/** 曲面 S(u,v) = γ(u) + v·d(u) */
export function devSurface(kind: DevKind, u: number, v: number): Vec3 {
  const g = directrix(kind, u)
  const d = direction(kind, u)
  return [g[0] + v * d[0], g[1] + v * d[1], g[2] + v * d[2]]
}

export const U_RANGE: [number, number] = [0, 2 * Math.PI]

export function vRange(kind: DevKind): [number, number] {
  if (kind === 'cone') return [0, 1.5]
  if (kind === 'tangent') return [-1.1, 1.1]
  return [-1.2, 1.2]
}

function vecDiff(fn: (t: number) => Vec3, at: number, h: number): Vec3 {
  const a = fn(at - h)
  const b = fn(at + h)
  return [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h), (b[2] - a[2]) / (2 * h)]
}

function det3(a: Vec3, b: Vec3, c: Vec3): number {
  return (
    a[0] * (b[1] * c[2] - b[2] * c[1])
    - a[1] * (b[0] * c[2] - b[2] * c[0])
    + a[2] * (b[0] * c[1] - b[1] * c[0])
  )
}

/**
 * 可展判据 det[γ′, d, d′]。恒为 0 即可展。
 * 这是判定的第一条路径（纯代数，不需要算曲率）。
 */
export function developabilityDet(kind: DevKind, u: number, h = 1e-6): number {
  return det3(
    vecDiff((t) => directrix(kind, t), u, h),
    direction(kind, u),
    vecDiff((t) => direction(kind, t), u, h),
  )
}

/**
 * 数值高斯曲率。可展曲面应恒为 0。
 * 这是判定的第二条路径（几何），两条路径结果一致才可信。
 */
export function gaussianCurvature(kind: DevKind, u: number, v: number, h = 1e-3): number {
  const f = (a: number, b: number) => devSurface(kind, a, b)
  const su = vecDiff((t) => f(t, v), u, h)
  const sv = vecDiff((t) => f(u, t), v, h)
  const suu = second((t) => f(t, v), u, h)
  const svv = second((t) => f(u, t), v, h)
  const suv = vecDiff((t) => vecDiff((s) => f(s, t), u, h), v, h)

  const n = cross(su, sv)
  const nl = Math.hypot(n[0], n[1], n[2])
  if (nl < 1e-12) return 0
  const N: Vec3 = [n[0] / nl, n[1] / nl, n[2] / nl]

  const E = dot(su, su)
  const F = dot(su, sv)
  const G = dot(sv, sv)
  const L = dot(suu, N)
  const M = dot(suv, N)
  const NN = dot(svv, N)
  const den = E * G - F * F
  if (Math.abs(den) < 1e-12) return 0
  return (L * NN - M * M) / den
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

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

export function infoOf(kind: DevKind): DevInfo {
  return DEV_INFO.find((d) => d.kind === kind) ?? DEV_INFO[0]
}
