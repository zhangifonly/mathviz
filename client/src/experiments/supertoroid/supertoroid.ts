/**
 * 超环面族（纯函数，便于测试）
 *
 * 把环面参数方程里的正弦余弦各取一个可调指数：
 *
 *   x = (R + r·|cos v|^e2·sgn) · |cos u|^e1·sgn
 *   y = (R + r·|cos v|^e2·sgn) · |sin u|^e1·sgn
 *   z = r · |sin v|^e2·sgn
 *
 * e1 控制环的走向（俯视轮廓从圆变方），e2 控制管截面（圆管变方管）。
 *   e1 = e2 = 1     标准环面
 *   e1 → 0          俯视是方框
 *   e2 → 0          管截面是方形
 *   e2 = 2          管截面是菱形
 *
 * 拓扑不变：只要 R > r，无论指数取多少都是环面（亏格 1，χ=0），
 * 形状千变万化而拓扑不动 —— 这正是「几何与拓扑分离」的直观例子。
 */

import type { Vec3 } from '../../lib/proj3d'
import { signedPow } from '../superquadric/superquadric'

export const U_RANGE: [number, number] = [-Math.PI, Math.PI]
export const V_RANGE: [number, number] = [-Math.PI, Math.PI]

/** 超环面参数方程。R 主半径, r 管半径, e1/e2 两个形状指数 */
export function supertoroid(
  u: number, v: number, e1 = 1, e2 = 1, R = 1, r = 0.4,
): Vec3 {
  const radial = R + r * signedPow(Math.cos(v), e2)
  return [
    radial * signedPow(Math.cos(u), e1),
    radial * signedPow(Math.sin(u), e1),
    r * signedPow(Math.sin(v), e2),
  ]
}

/**
 * 隐式方程残差（e1=e2=1 的标准环面情形）：
 *   (√(x²+y²) − R)² + z² = r²
 * 一般指数下隐式形式含分数次幂，这里只对标准情形给出，用于校验参数化。
 */
export function torusResidual(p: Vec3, R = 1, r = 0.4): number {
  const [x, y, z] = p
  const d = Math.hypot(x, y) - R
  return d * d + z * z - r * r
}

/** 亏格。环面亏格 1，与指数无关 */
export const GENUS = 1

/** 欧拉示性数 χ = 2 − 2g = 0 */
export const EULER_CHARACTERISTIC = 0

/** 环面可定向 */
export const ORIENTABLE = true

/**
 * 管中心线（v=±π/2 那一圈，此处 cos v = 0）到 z 轴的距离。
 *
 * e1 = 1 时这圈是半径恰为 R 的正圆；e1 ≠ 1 时它不再是圆 ——
 * 这正是「俯视轮廓从圆变方」的根源，所以本函数返回的是逐点半径而非常数。
 */
export function centerlineRadius(u: number, e1 = 1, R = 1, r = 0.4): number {
  const p = supertoroid(u, Math.PI / 2, e1, 1, R, r)
  return Math.hypot(p[0], p[1])
}

/** z 的取值范围恒为 ±r，与两个指数都无关 */
export function heightRange(r = 0.4): [number, number] {
  return [-r, r]
}

/** 洞是否存在：R > r 时中心有孔，R <= r 时自交退化 */
export function hasHole(R = 1, r = 0.4): boolean {
  return R > r
}

export interface ShapePreset {
  e1: number
  e2: number
  label: string
  note: string
}

export const PRESETS: ShapePreset[] = [
  { e1: 1, e2: 1, label: '标准环面', note: '圆环圆管' },
  { e1: 0.3, e2: 1, label: '方框圆管', note: '俯视成方' },
  { e1: 1, e2: 0.3, label: '圆环方管', note: '截面成方' },
  { e1: 0.3, e2: 0.3, label: '方框方管', note: '双方' },
  { e1: 1, e2: 2, label: '菱形截面', note: 'e2 = 2' },
  { e1: 2, e2: 1, label: '星形环', note: 'e1 = 2' },
]
