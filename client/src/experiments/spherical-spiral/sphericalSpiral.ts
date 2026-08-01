/**
 * 球面螺线（纯函数，便于测试）
 *
 * 本实验对比球面上两种「从北极绕到南极」的螺线，它们常被混为一谈：
 *
 * **等角航线（loxodrome / rhumb line）**
 *   与所有经线成固定角，即罗盘方向恒定。
 *   参数化：θ 为极角，φ = ln(tan(θ/2))/tan(β)
 *   在墨卡托投影上是一条直线 —— 这正是墨卡托投影 1569 年被发明的理由：
 *   航海时保持罗盘方向不变，在图上就是直着走。
 *
 *   ⚠️ 参数 β 的含义要当心：在这个参数化下 β 是与**纬线**的夹角，
 *   与经线的夹角是 γ = π/2 − β（数值验证比值精确为 1.000000）。
 *   我第一版把 β 当成了与经线的夹角，弧长公式也因此写错（πR/cos β
 *   算出 5.81 而实测 3.73），是数值检验纠正过来的。
 *
 * **球面阿基米德螺线（spherical spiral）**
 *   φ 与 θ 成正比，即 φ = c·θ，绕圈数均匀。
 *   它**不是**等角航线 —— 与经线的夹角随纬度变化。
 *
 * 关键可验证差别：
 *   等角航线的经线夹角恒定（误差 <1e-6），
 *   阿基米德螺线的夹角在赤道与极区相差几十度（实测极差 17°~32°）。
 *
 * 等角航线还有个漂亮性质：**总弧长有限**，等于 πR/sin β，
 * 尽管它绕无穷多圈才到极点。
 */

import type { Curve3D } from '../../lib/curve3d'

export const SPIRAL_KINDS = ['loxodrome', 'archimedean'] as const
export type SpiralKind = (typeof SPIRAL_KINDS)[number]

export interface SpiralInfo {
  kind: SpiralKind
  label: string
  /** 与经线的夹角是否恒定 */
  equiangular: boolean
  note: string
}

export const SPIRAL_INFO: SpiralInfo[] = [
  {
    kind: 'loxodrome',
    label: '等角航线',
    equiangular: true,
    note: '罗盘方向恒定 · 墨卡托图上是直线',
  },
  {
    kind: 'archimedean',
    label: '球面阿基米德螺线',
    equiangular: false,
    note: '绕圈均匀 · 夹角随纬度变',
  },
]

/** 球半径 */
export const R = 1

/**
 * 极角范围。两端要留余量：
 * 等角航线的 ln(tan(θ/2)) 在 θ→0 与 θ→π 处发散（绕无穷多圈）。
 */
export const THETA_RANGE: [number, number] = [0.08, Math.PI - 0.08]

/** 由极角与方位角给出球面点 */
function onSphere(theta: number, phi: number, r = R): [number, number, number] {
  return [
    r * Math.sin(theta) * Math.cos(phi),
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(theta),
  ]
}

/**
 * 等角航线。beta 为与经线的夹角（弧度），越接近 π/2 绕圈越多。
 * φ(θ) = ln(tan(θ/2)) / tan(β)
 */
export function loxodrome(beta: number, r = R): Curve3D {
  return (theta) => onSphere(theta, Math.log(Math.tan(theta / 2)) / Math.tan(beta), r)
}

/** 球面阿基米德螺线。c 为绕圈系数，φ = c·θ */
export function archimedeanSpiral(c: number, r = R): Curve3D {
  return (theta) => onSphere(theta, c * theta, r)
}

/** 按类型构造曲线。param 对等角航线是 β，对阿基米德螺线是 c */
export function sphericalSpiral(kind: SpiralKind, param: number, r = R): Curve3D {
  return kind === 'loxodrome' ? loxodrome(param, r) : archimedeanSpiral(param, r)
}

/** 球面残差 |p| − R，应恒为 0 */
export function sphereResidual(kind: SpiralKind, param: number, theta: number): number {
  const p = sphericalSpiral(kind, param)(theta)
  return Math.hypot(p[0], p[1], p[2]) - R
}

/**
 * 与经线的夹角。
 * 经线方向 = ∂/∂θ（固定 φ 沿极角走），曲线切向与它的夹角。
 */
export function meridianAngle(
  kind: SpiralKind, param: number, theta: number, h = 1e-6,
): number {
  const c = sphericalSpiral(kind, param)
  const a = c(theta - h)
  const b = c(theta + h)
  const tangent = [
    (b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h), (b[2] - a[2]) / (2 * h),
  ]
  // 经线切向: 固定当前 φ, 对 θ 求导
  const p = c(theta)
  const phi = Math.atan2(p[1], p[0])
  const mer = [
    Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), -Math.sin(theta),
  ]
  const nt = Math.hypot(tangent[0], tangent[1], tangent[2])
  const nm = Math.hypot(mer[0], mer[1], mer[2])
  if (nt < 1e-12) return 0
  const dot = tangent[0] * mer[0] + tangent[1] * mer[1] + tangent[2] * mer[2]
  return Math.acos(Math.max(-1, Math.min(1, Math.abs(dot) / (nt * nm))))
}

/**
 * 与经线的实际夹角 γ = π/2 − β。
 * 参数 β 在本参数化下是与纬线的夹角，别搞反。
 */
export function meridianAngleAnalytic(beta: number): number {
  return Math.PI / 2 - beta
}

/**
 * 等角航线的总弧长解析式 πR/cos γ = πR/sin β。
 * 尽管它绕无穷多圈才到极点，弧长仍然有限 —— 这是它最反直觉的性质。
 * （数值验证：β=1.0 时实测 3.73343，公式给 3.73345）
 */
export function loxodromeLength(beta: number, r = R): number {
  return (Math.PI * r) / Math.sin(beta)
}

/** 等角航线绕极点无穷多圈：θ→0 时 |φ| → ∞ */
export function windingDivergence(beta: number, theta: number): number {
  return Math.abs(Math.log(Math.tan(theta / 2)) / Math.tan(beta))
}

export function infoOf(kind: SpiralKind): SpiralInfo {
  return SPIRAL_INFO.find((s) => s.kind === kind) ?? SPIRAL_INFO[0]
}

/** 标签里标的是与经线的夹角 γ（= π/2 − β），因为航海上关心的是这个角 */
export const PRESETS = [
  { kind: 'loxodrome' as SpiralKind, param: 1.0, label: '等角航线 γ=32.7°', note: '罗盘恒定' },
  { kind: 'loxodrome' as SpiralKind, param: 1.3, label: '等角航线 γ=15.5°', note: '绕圈更多' },
  { kind: 'archimedean' as SpiralKind, param: 6, label: '阿基米德 c=6', note: '夹角随纬度变' },
]
