/**
 * 哈尔沃森吸引子（纯函数，便于测试）
 *
 *   dx/dt = −a·x − 4y − 4z − y²
 *   dy/dt = −a·y − 4z − 4x − z²
 *   dz/dt = −a·z − 4x − 4y − x²
 *
 * 三个方程完全「循环对称」：把 (x,y,z) 循环替换成 (y,z,x)，方程组不变。
 * 这种对称性在吸引子外观上直接体现为**三重旋转对称** ——
 * 绕对角线 (1,1,1) 转 120° 后形状复原。
 *
 * 两条可验证性质：
 *   1. **循环对称**：若 (x,y,z) 是解，则 (y,z,x) 也满足同一方程组。
 *      数值上表现为向量场满足 f(y,z,x) = 循环移位后的 f(x,y,z)。
 *   2. **散度恒为 −3a**：三个方程各贡献 −a，与位置无关，故处处耗散。
 *
 * a = 1.89 是标准参数，此时最大李雅普诺夫指数为正（混沌）。
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Field3D } from '../../lib/attractor3d'

/** 标准参数 */
export const DEFAULT_A = 1.89

/** 构造向量场 */
export function halvorsenField(a = DEFAULT_A): Field3D {
  return ([x, y, z]) => [
    -a * x - 4 * y - 4 * z - y * y,
    -a * y - 4 * z - 4 * x - z * z,
    -a * z - 4 * x - 4 * y - x * x,
  ]
}

/**
 * 循环对称检验：f 应满足 f(σ(p)) = σ(f(p))，其中 σ 是循环移位 (x,y,z)→(y,z,x)。
 * 返回两者的最大分量差。
 */
export function cyclicSymmetryError(p: Vec3, a = DEFAULT_A): number {
  const f = halvorsenField(a)
  const shifted: Vec3 = [p[1], p[2], p[0]]
  const lhs = f(shifted)
  const rhs = f(p)
  const rhsShifted: Vec3 = [rhs[1], rhs[2], rhs[0]]
  return Math.max(
    Math.abs(lhs[0] - rhsShifted[0]),
    Math.abs(lhs[1] - rhsShifted[1]),
    Math.abs(lhs[2] - rhsShifted[2]),
  )
}

/** 散度的解析值 −3a，与位置无关 */
export function analyticDivergence(a = DEFAULT_A): number {
  return -3 * a
}

/**
 * 对称轴上的平衡点。在 x=y=z 的对角线上，三个方程退化为同一个：
 *   −a·x − 8x − x² = 0  ⟹  x = 0 或 x = −(a+8)
 */
export function diagonalEquilibria(a = DEFAULT_A): Vec3[] {
  const k = -(a + 8)
  return [[0, 0, 0], [k, k, k]]
}

/** 平衡点残差 */
export function equilibriumResidual(q: Vec3, a = DEFAULT_A): number {
  const d = halvorsenField(a)(q)
  return Math.hypot(d[0], d[1], d[2])
}

export const START: Vec3 = [-1.48, -1.51, 2.04]

export const PRESETS = [
  { a: 1.4, label: '弱耗散', note: 'a=1.4' },
  { a: 1.89, label: '标准', note: 'a=1.89 · 三重对称' },
  { a: 2.4, label: '强耗散', note: 'a=2.4' },
] as const
