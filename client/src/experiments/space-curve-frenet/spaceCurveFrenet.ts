/**
 * 空间曲线与活动标架（纯函数，便于测试）
 *
 * **曲线论基本定理**：给定两个函数 κ(s) > 0 与 τ(s)，存在唯一一条空间曲线
 * （差一个刚体运动）以它们为曲率与挠率。反过来，任何空间曲线都被这两个
 * 标量函数完全决定。
 *
 * 换句话说：三维曲线的全部几何信息，都装在「弯多少」与「扭多少」这两个数里。
 *
 * 本实验收录四条曲线，覆盖 (κ, τ) 的四种典型组合：
 *   直线      κ = 0            无弯无扭
 *   圆        κ = 1/r, τ = 0   只弯不扭（平面曲线）
 *   螺旋线    κ, τ 均为常数     匀弯匀扭
 *   三叶结    κ, τ 都随 t 变    变弯变扭
 *
 * Frenet–Serret 公式描述标架如何沿曲线转动：
 *   T' = κ·N
 *   N' = −κ·T + τ·B
 *   B' = −τ·N
 * 单测直接用数值导数验证这三条 —— 这是本实验最硬的判据。
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Curve3D } from '../../lib/curve3d'
import {
  d1, norm3, unit3, frenet, curvature, torsion,
} from '../../lib/curve3d'

export const CURVE_KINDS = ['line', 'circle', 'helix', 'trefoil'] as const
export type CurveKind = (typeof CURVE_KINDS)[number]

export interface CurveInfo {
  kind: CurveKind
  label: string
  /** 曲率是否为常数 */
  constCurvature: boolean
  /** 挠率是否为常数 */
  constTorsion: boolean
  note: string
}

export const CURVE_INFO: CurveInfo[] = [
  {
    kind: 'line',
    label: '直线',
    constCurvature: true,
    constTorsion: true,
    note: 'κ=0 · 无弯无扭',
  },
  {
    kind: 'circle',
    label: '圆',
    constCurvature: true,
    constTorsion: true,
    note: 'κ=1/r, τ=0 · 平面曲线',
  },
  {
    kind: 'helix',
    label: '螺旋线',
    constCurvature: true,
    constTorsion: true,
    note: 'κ,τ 均为常数 · 匀弯匀扭',
  },
  {
    kind: 'trefoil',
    label: '三叶结',
    constCurvature: false,
    constTorsion: false,
    note: 'κ,τ 都随 t 变化',
  },
]

/** 四条曲线的参数方程 */
export function curveOf(kind: CurveKind): Curve3D {
  switch (kind) {
    case 'line':
      return (t) => [t * 0.5, t * 0.3, t * 0.4]
    case 'circle':
      return (t) => [Math.cos(t), Math.sin(t), 0]
    case 'helix':
      return (t) => [Math.cos(t), Math.sin(t), 0.35 * t]
    case 'trefoil':
      return (t) => [
        Math.sin(t) + 2 * Math.sin(2 * t),
        Math.cos(t) - 2 * Math.cos(2 * t),
        -Math.sin(3 * t),
      ]
  }
}

export function rangeOf(kind: CurveKind): [number, number] {
  if (kind === 'line') return [-2, 2]
  if (kind === 'helix') return [0, 6 * Math.PI]
  return [0, 2 * Math.PI]
}

/** 螺旋线曲率的解析值 a/(a²+b²)，这里 a=1, b=0.35 */
export const HELIX_CURVATURE = 1 / (1 + 0.35 * 0.35)
export const HELIX_TORSION = 0.35 / (1 + 0.35 * 0.35)

/**
 * Frenet–Serret 公式的残差。
 *
 * 公式是对**弧长** s 求导，而我们用参数 t，故需除以速率 |γ'|：
 *   dT/dt = |γ'|·κ·N
 *   dN/dt = |γ'|·(−κ·T + τ·B)
 *   dB/dt = |γ'|·(−τ·N)
 *
 * 返回三条公式各自的最大分量误差。
 */
export function frenetSerretError(
  kind: CurveKind, t: number, h = 1e-4,
): { tErr: number; nErr: number; bErr: number } {
  const c = curveOf(kind)
  const speed = norm3(d1(c, t))
  const { T, N, B } = frenet(c, t)
  const kappaVal = curvatureOf(kind, t)
  const tauVal = torsionOf(kind, t)

  // 标架各分量对 t 的数值导数
  const fa = frenet(c, t - h)
  const fb = frenet(c, t + h)
  const dT: Vec3 = [
    (fb.T[0] - fa.T[0]) / (2 * h), (fb.T[1] - fa.T[1]) / (2 * h),
    (fb.T[2] - fa.T[2]) / (2 * h),
  ]
  const dN: Vec3 = [
    (fb.N[0] - fa.N[0]) / (2 * h), (fb.N[1] - fa.N[1]) / (2 * h),
    (fb.N[2] - fa.N[2]) / (2 * h),
  ]
  const dB: Vec3 = [
    (fb.B[0] - fa.B[0]) / (2 * h), (fb.B[1] - fa.B[1]) / (2 * h),
    (fb.B[2] - fa.B[2]) / (2 * h),
  ]

  const maxDiff = (a: Vec3, b: Vec3) => Math.max(
    Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]),
  )

  return {
    tErr: maxDiff(dT, [
      speed * kappaVal * N[0], speed * kappaVal * N[1], speed * kappaVal * N[2],
    ]),
    nErr: maxDiff(dN, [
      speed * (-kappaVal * T[0] + tauVal * B[0]),
      speed * (-kappaVal * T[1] + tauVal * B[1]),
      speed * (-kappaVal * T[2] + tauVal * B[2]),
    ]),
    bErr: maxDiff(dB, [
      speed * -tauVal * N[0], speed * -tauVal * N[1], speed * -tauVal * N[2],
    ]),
  }
}

/** 曲率。直接转调 lib/curve3d，不重复实现差分逻辑 */
export function curvatureOf(kind: CurveKind, t: number): number {
  return curvature(curveOf(kind), t)
}

/** 挠率 */
export function torsionOf(kind: CurveKind, t: number): number {
  return torsion(curveOf(kind), t)
}

/** 平面性判据：挠率恒为零 ⟺ 平面曲线 */
export function isPlanar(kind: CurveKind, samples = 20): boolean {
  const [t0, t1] = rangeOf(kind)
  for (let i = 1; i < samples; i++) {
    if (Math.abs(torsionOf(kind, t0 + ((t1 - t0) * i) / samples)) > 1e-4) return false
  }
  return true
}

/** 副法向量是否为常向量（平面曲线的等价判据） */
export function binormalDrift(kind: CurveKind, samples = 12): number {
  const [t0, t1] = rangeOf(kind)
  const c = curveOf(kind)
  const b0 = frenet(c, t0 + (t1 - t0) * 0.1).B
  let maxDrift = 0
  for (let i = 2; i < samples; i++) {
    const b = frenet(c, t0 + ((t1 - t0) * i) / samples).B
    maxDrift = Math.max(maxDrift, norm3([b[0] - b0[0], b[1] - b0[1], b[2] - b0[2]]))
  }
  return maxDrift
}

export function infoOf(kind: CurveKind): CurveInfo {
  return CURVE_INFO.find((c) => c.kind === kind) ?? CURVE_INFO[0]
}

export { unit3 }
