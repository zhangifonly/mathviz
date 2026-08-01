/**
 * 维维亚尼曲线（纯函数，便于测试）
 *
 * 半径 2a 的球面与半径 a、且过球心的圆柱面的交线：
 *   x = a(1 + cos t)
 *   y = a·sin t
 *   z = 2a·sin(t/2)
 *
 * 由 Vincenzo Viviani 1692 年研究，他当年的问题是：
 * 「在半球顶上开多大的窗，才能让剩下的曲面面积可以用尺规算出来？」
 * 答案就是用这条曲线切出的窗 —— 剩余面积恰为 4a²，一个不含 π 的值。
 *
 * 三条可验证性质：
 *   1. **同时落在球面与柱面上**：x²+y²+z² = 4a²，且 (x−a)²+y² = a²
 *   2. **三个投影各不相同**：xy 平面得圆、xz 平面得抛物线、yz 平面得双纽线
 *   3. **t=2π 处闭合但 z 需走到 4π**：z 含 sin(t/2)，周期是 4π 而非 2π ——
 *      故 t∈[0,4π] 才画出完整的双环形状（这是最容易画错的地方）
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Curve3D } from '../../lib/curve3d'

/** 默认尺度参数 */
export const DEFAULT_A = 1

/**
 * 参数范围。
 * ⚠️ 必须取 [0, 4π]：z = 2a·sin(t/2) 的周期是 4π，
 * 只取 [0,2π] 会画出半条曲线（少了下面那个环）。
 */
export const T_RANGE: [number, number] = [0, 4 * Math.PI]

/** 维维亚尼曲线 */
export function vivianiCurve(a = DEFAULT_A): Curve3D {
  return (t) => [
    a * (1 + Math.cos(t)),
    a * Math.sin(t),
    2 * a * Math.sin(t / 2),
  ]
}

/** 球面残差 x²+y²+z² − 4a²，应恒为 0 */
export function sphereResidual(t: number, a = DEFAULT_A): number {
  const [x, y, z] = vivianiCurve(a)(t)
  return x * x + y * y + z * z - 4 * a * a
}

/** 圆柱残差 (x−a)²+y² − a²，应恒为 0 */
export function cylinderResidual(t: number, a = DEFAULT_A): number {
  const [x, y] = vivianiCurve(a)(t)
  return (x - a) * (x - a) + y * y - a * a
}

/** 球半径 2a 与柱半径 a */
export function sphereRadius(a = DEFAULT_A): number {
  return 2 * a
}

export function cylinderRadius(a = DEFAULT_A): number {
  return a
}

/**
 * 三个坐标投影。
 *   xy: 圆 (x−a)²+y²=a²
 *   xz: 抛物线 z² = 2a(2a − x)  ⟸ 由 z=2a sin(t/2), x=a(1+cos t) 与
 *       cos t = 1−2sin²(t/2) 消参得到
 *   yz: 双纽线 z⁴ = 4a²(4a²... 实际为 z²(4a²−z²) = 4a²y²
 */
export function projectionResidualXZ(t: number, a = DEFAULT_A): number {
  const [x, , z] = vivianiCurve(a)(t)
  return z * z - 2 * a * (2 * a - x)
}

export function projectionResidualYZ(t: number, a = DEFAULT_A): number {
  const [, y, z] = vivianiCurve(a)(t)
  return z * z * (4 * a * a - z * z) - 4 * a * a * y * y
}

/** 维维亚尼窗切除后半球的剩余面积 = 4a²（不含 π，可尺规作图） */
export function vivianiWindowArea(a = DEFAULT_A): number {
  return 4 * a * a
}

/**
 * 曲线的自交点 (2a, 0, 0)。
 *
 * 实测：t=0 与 **t=2π** 映到同一点（距离 0），这就是双环相交处。
 * 注意 t=π 与 t=3π 给出 (0,0,±2a)，是上下两个极点，并不重合 ——
 * 我一开始以为自交在那里，数值检验才纠正过来。
 */
export function selfIntersectionPoint(a = DEFAULT_A): Vec3 {
  return [2 * a, 0, 0]
}

/** 自交处的两个参数值 */
export const SELF_INTERSECTION_PARAMS: [number, number] = [0, 2 * Math.PI]

export const PRESETS = [
  { a: 0.7, label: '小球', note: '球半径 1.4' },
  { a: 1, label: '标准', note: '球半径 2' },
  { a: 1.4, label: '大球', note: '球半径 2.8' },
] as const
