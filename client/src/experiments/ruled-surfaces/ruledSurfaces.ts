/**
 * 直纹曲面（纯函数，便于测试）
 *
 * 由一族直线扫出的曲面，统一写成
 *   S(u,v) = base(u) + v·dir(u)
 * base 是准线（directrix），dir 是每点处那条直线的方向。
 *
 * 固定 u 变 v 一定得到直线 —— 这是定义，也是本实验的核心可验证性质。
 *
 * 收录五种典型：
 *   圆柱面      方向恒定, 高斯曲率 K ≡ 0(可展)
 *   圆锥面      所有直线过同一顶点, K ≡ 0(可展)
 *   螺旋面      直线水平且绕轴上升, K < 0(不可展)
 *   单叶双曲面  两族直线, K < 0(不可展)
 *   莫比乌斯带  直线绕行一周翻转半圈, 单侧曲面
 *
 * 关键区分：**可展曲面**是 K ≡ 0 的直纹面，能不撕不皱摊平（圆柱、圆锥）；
 * 而螺旋面、双曲面虽是直纹面却 K < 0，摊不平。所以
 * 「直纹」不等于「可展」—— 这是最常见的误解。
 */

import type { Vec3 } from '../../lib/proj3d'

export const RULED_KINDS = [
  'cylinder', 'cone', 'helicoid', 'hyperboloid', 'mobius',
] as const
export type RuledKind = (typeof RULED_KINDS)[number]

export interface RuledInfo {
  kind: RuledKind
  label: string
  /** 是否可展(K ≡ 0, 能摊平) */
  developable: boolean
  note: string
}

export const RULED_INFO: RuledInfo[] = [
  { kind: 'cylinder', label: '圆柱面', developable: true, note: '方向恒定 · 可摊平' },
  { kind: 'cone', label: '圆锥面', developable: true, note: '共顶点 · 可摊平' },
  { kind: 'helicoid', label: '螺旋面', developable: false, note: '极小曲面 · 摊不平' },
  { kind: 'hyperboloid', label: '单叶双曲面', developable: false, note: '双直纹 · 冷却塔' },
  { kind: 'mobius', label: '莫比乌斯带', developable: false, note: '单侧曲面' },
]

/** 准线：直线族的起点轨迹 */
export function baseCurve(kind: RuledKind, u: number): Vec3 {
  switch (kind) {
    case 'cylinder': return [Math.cos(u), Math.sin(u), 0]
    case 'cone': return [0, 0, 1]
    case 'helicoid': return [0, 0, u / 3]
    case 'hyperboloid': return [Math.cos(u), Math.sin(u), 0]
    case 'mobius': return [Math.cos(u), Math.sin(u), 0]
  }
}

/** 方向向量：每个 u 处那条直线的方向 */
export function direction(kind: RuledKind, u: number): Vec3 {
  switch (kind) {
    case 'cylinder': return [0, 0, 1]
    case 'cone': return [Math.cos(u), Math.sin(u), -1]
    case 'helicoid': return [Math.cos(u), Math.sin(u), 0]
    // 单叶双曲面: 切向 + 竖直, 得到其中一族直线
    case 'hyperboloid': return [-Math.sin(u), Math.cos(u), 1]
    // 莫比乌斯带: 方向绕行一周只翻转半圈(u/2)
    case 'mobius': return [
      Math.cos(u / 2) * Math.cos(u),
      Math.cos(u / 2) * Math.sin(u),
      Math.sin(u / 2),
    ]
  }
}

/** 直纹曲面统一参数方程 S(u,v) = base(u) + v·dir(u) */
export function ruledSurface(kind: RuledKind, u: number, v: number): Vec3 {
  const b = baseCurve(kind, u)
  const d = direction(kind, u)
  return [b[0] + v * d[0], b[1] + v * d[1], b[2] + v * d[2]]
}

export const U_RANGE: [number, number] = [0, 2 * Math.PI]

export function vRange(kind: RuledKind): [number, number] {
  if (kind === 'cone') return [0, 1.6]
  if (kind === 'mobius') return [-0.4, 0.4]
  if (kind === 'cylinder') return [-1, 1]
  return [-1.1, 1.1]
}

/**
 * 共线偏差：固定 u 取三个不同的 v，三点必须共线。
 * 这是「直纹」的定义性判据。
 */
export function collinearityError(kind: RuledKind, u: number): number {
  const p = ruledSurface(kind, u, -0.5)
  const q = ruledSurface(kind, u, 0.2)
  const r = ruledSurface(kind, u, 0.9)
  const e1: Vec3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]]
  const e2: Vec3 = [r[0] - p[0], r[1] - p[1], r[2] - p[2]]
  return Math.hypot(
    e1[1] * e2[2] - e1[2] * e2[1],
    e1[2] * e2[0] - e1[0] * e2[2],
    e1[0] * e2[1] - e1[1] * e2[0],
  )
}

/**
 * 可展判据：直纹面可展 ⟺ det[base'(u), dir(u), dir'(u)] ≡ 0。
 * 该行列式非零即说明 K < 0，摊不平。
 */
export function developabilityDet(kind: RuledKind, u: number, h = 1e-6): number {
  const db = vecDiff((t) => baseCurve(kind, t), u, h)
  const d = direction(kind, u)
  const dd = vecDiff((t) => direction(kind, t), u, h)
  return det3(db, d, dd)
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

export function infoOf(kind: RuledKind): RuledInfo {
  return RULED_INFO.find((r) => r.kind === kind) ?? RULED_INFO[0]
}
