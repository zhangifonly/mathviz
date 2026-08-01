/**
 * 旋转曲面（纯函数，便于测试）
 *
 * 一条母线 r = f(t), z = g(t) 绕 z 轴旋转一周：
 *   x = f(t)·cos u,  y = f(t)·sin u,  z = g(t)
 *
 * 本实验的价值在于「统摄」：球面、环面、悬链面、伪球面、双曲面、
 * 抛物面全都是旋转曲面，换一条母线就换一张曲面。
 *
 * 两条可验证的定量结论：
 *   侧面积（Pappus）  A = 2π·∫ f(t)·√(f'²+g'²) dt
 *   体积（Pappus）    V = π·∫ f(t)²·g'(t) dt
 * 古尔丁-帕普斯定理还给出更漂亮的形式：绕轴旋转所得体积等于
 * 截面面积乘以质心走过的路程，这里用数值积分验证球与环面两例。
 */

import type { Vec3 } from '../../lib/proj3d'

export const PROFILES = [
  'sphere', 'torus', 'catenoid', 'pseudosphere', 'hyperboloid', 'paraboloid', 'vase',
] as const
export type ProfileKind = (typeof PROFILES)[number]

export interface ProfileInfo {
  kind: ProfileKind
  label: string
  /** 母线的数学描述 */
  curve: string
  note: string
}

export const PROFILE_INFO: ProfileInfo[] = [
  { kind: 'sphere', label: '球面', curve: 'r = sin t, z = cos t', note: '常正曲率' },
  { kind: 'torus', label: '环面', curve: 'r = R + a·cos t, z = a·sin t', note: '亏格 1' },
  { kind: 'catenoid', label: '悬链面', curve: 'r = cosh t, z = t', note: '极小曲面' },
  { kind: 'pseudosphere', label: '伪球面', curve: 'r = sech t, z = t − tanh t', note: '常负曲率' },
  { kind: 'hyperboloid', label: '单叶双曲面', curve: 'r = cosh t, z = sinh t', note: '直纹面' },
  { kind: 'paraboloid', label: '抛物面', curve: 'r = t, z = t²', note: '聚焦性质' },
  { kind: 'vase', label: '花瓶', curve: 'r = 1 + 0.3·sin 3t, z = t', note: '任意母线' },
]

/** 母线：返回 (r, z)。t 为母线参数 */
export function profile(kind: ProfileKind, t: number): { r: number; z: number } {
  switch (kind) {
    case 'sphere': return { r: Math.sin(t), z: Math.cos(t) }
    case 'torus': return { r: 1 + 0.4 * Math.cos(t), z: 0.4 * Math.sin(t) }
    case 'catenoid': return { r: Math.cosh(t), z: t }
    case 'pseudosphere': return { r: 1 / Math.cosh(t), z: t - Math.tanh(t) }
    case 'hyperboloid': return { r: Math.cosh(t), z: Math.sinh(t) }
    case 'paraboloid': return { r: t, z: t * t }
    case 'vase': return { r: 1 + 0.3 * Math.sin(3 * t), z: t }
  }
}

/** 母线的参数范围 */
export function profileRange(kind: ProfileKind): [number, number] {
  switch (kind) {
    case 'sphere': return [0, Math.PI]
    case 'torus': return [0, 2 * Math.PI]
    case 'catenoid': return [-1, 1]
    case 'pseudosphere': return [0.001, 3]
    case 'hyperboloid': return [-1.2, 1.2]
    case 'paraboloid': return [0, 1.4]
    case 'vase': return [0, 2 * Math.PI]
  }
}

/** 旋转曲面参数方程。u 为绕轴角度, t 为母线参数 */
export function revolve(kind: ProfileKind, u: number, t: number): Vec3 {
  const { r, z } = profile(kind, t)
  return [r * Math.cos(u), r * Math.sin(u), z]
}

export const U_RANGE: [number, number] = [0, 2 * Math.PI]

/**
 * Pappus 侧面积：A = 2π·∫ r·√(r'² + z'²) dt。
 * 球面(单位)应得 4π，环面(R=1,a=0.4)应得 4π²Ra = 4π²·0.4。
 */
export function lateralArea(kind: ProfileKind, steps = 4000): number {
  const [t0, t1] = profileRange(kind)
  const h = (t1 - t0) / steps
  let s = 0
  for (let i = 0; i < steps; i++) {
    const t = t0 + h * (i + 0.5)
    const p = profile(kind, t)
    const dp = derivative(kind, t)
    s += p.r * Math.hypot(dp.r, dp.z) * h
  }
  return 2 * Math.PI * s
}

/** 母线的数值导数 */
export function derivative(kind: ProfileKind, t: number, h = 1e-6): { r: number; z: number } {
  const a = profile(kind, t - h)
  const b = profile(kind, t + h)
  return { r: (b.r - a.r) / (2 * h), z: (b.z - a.z) / (2 * h) }
}

/**
 * Pappus 体积：V = π·∫ r²·z' dt。
 * 单位球应得 4π/3。注意母线方向决定符号，取绝对值。
 */
export function revolvedVolume(kind: ProfileKind, steps = 4000): number {
  const [t0, t1] = profileRange(kind)
  const h = (t1 - t0) / steps
  let s = 0
  for (let i = 0; i < steps; i++) {
    const t = t0 + h * (i + 0.5)
    const p = profile(kind, t)
    const dp = derivative(kind, t)
    s += p.r * p.r * dp.z * h
  }
  return Math.abs(Math.PI * s)
}

export function infoOf(kind: ProfileKind): ProfileInfo {
  return PROFILE_INFO.find((p) => p.kind === kind) ?? PROFILE_INFO[0]
}
