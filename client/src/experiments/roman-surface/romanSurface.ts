/**
 * 罗马曲面（斯坦纳曲面，纯函数，便于测试）
 *
 * 雅各布·斯坦纳 1844 年在罗马发现，故名。它是实射影平面 RP² 的浸入：
 *
 *   x = a²·cos²v·cos u·sin u
 *   y = a²·cos u·sin v·cos v
 *   z = a²·sin u·sin v·cos v
 *
 * 定义性质（对径点粘合）：(u,v) 与 (u+π, π−v) 映到同一点，
 * 这正是 RP² = S²/± 的体现 —— 球面上每对对径点被认同为一个点。
 *
 * 隐式方程是一个四次曲面：
 *   x²y² + y²z² + z²x² = a²·x·y·z  （取 a=1 时右端为 xyz）
 *
 * 自交结构：3 条自交线（分别沿三个坐标轴）、6 个分支点、1 个三重点（原点）。
 * 对称性极强：它在坐标置换与偶数次符号翻转下不变，对称群为 24 阶。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [0, Math.PI]
export const V_RANGE: [number, number] = [0, Math.PI]

/** 罗马曲面参数方程。a 为整体尺度 */
export function romanSurface(u: number, v: number, a = 1): Vec3 {
  const a2 = a * a
  const cu = Math.cos(u)
  const su = Math.sin(u)
  const cv = Math.cos(v)
  const sv = Math.sin(v)
  return [a2 * cv * cv * cu * su, a2 * cu * sv * cv, a2 * su * sv * cv]
}

/**
 * 对径点粘合的偏差：(u,v) 与 (u+π, π−v) 应映到同一点。
 * 这是「它确实是 RP² 的浸入」的可验证判据。
 */
export function antipodalGap(u: number, v: number, a = 1): number {
  const p = romanSurface(u, v, a)
  const q = romanSurface(u + Math.PI, Math.PI - v, a)
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
}

/**
 * 隐式方程残差：x²y² + y²z² + z²x² − a²xyz。
 * 参数方程给出的每一点都应让它为 0。
 */
export function implicitResidual(p: Vec3, a = 1): number {
  const [x, y, z] = p
  return x * x * y * y + y * y * z * z + z * z * x * x - a * a * x * y * z
}

/**
 * 三条自交线分别沿三个坐标轴。
 * 每条线段长为 a²/2，两端各是一个分支点，中点交汇于原点(三重点)。
 */
export function selfIntersectionLines(a = 1, steps = 20): Vec3[][] {
  const half = (a * a) / 2
  const axis = (k: 0 | 1 | 2): Vec3[] => {
    const pts: Vec3[] = []
    for (let i = 0; i <= steps; i++) {
      const t = -half + (2 * half * i) / steps
      const p: Vec3 = [0, 0, 0]
      p[k] = t
      pts.push(p)
    }
    return pts
  }
  return [axis(0), axis(1), axis(2)]
}

/** 6 个分支点：三条自交线段的 6 个端点 */
export function branchPoints(a = 1): Vec3[] {
  const h = (a * a) / 2
  return [
    [h, 0, 0], [-h, 0, 0],
    [0, h, 0], [0, -h, 0],
    [0, 0, h], [0, 0, -h],
  ]
}

/** 唯一的三重点：原点。三条自交线在此交汇 */
export const TRIPLE_POINT: Vec3 = [0, 0, 0]

/** 欧拉示性数 χ(RP²)=1，不可定向 */
export const EULER_CHARACTERISTIC = 1
export const ORIENTABLE = false

export const PRESETS = [
  { a: 0.8, label: '收紧', note: '尺度 0.64' },
  { a: 1, label: '标准', note: '经典罗马曲面' },
  { a: 1.3, label: '放大', note: '尺度 1.69' },
] as const
