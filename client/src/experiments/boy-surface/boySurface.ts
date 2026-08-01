/**
 * 博伊曲面（纯函数，便于测试）
 *
 * 维尔纳·博伊 1901 年发现的实射影平面 RP² 浸入。它的特别之处在于
 * **没有分支点**：交叉帽有 2 个、罗马曲面有 6 个，而博伊曲面一个都没有，
 * 是三者中唯一处处光滑的浸入。自交线呈三叶状，只有一个三重点。
 *
 * 这里用 Bryant–Kusner 参数化（定义域为单位闭圆盘上的复参数 w）：
 *
 *   分母 D = w⁶ + √5·w³ − 1
 *   g₁ = −(3/2)·Im[ w(1−w⁴)/D ]
 *   g₂ = −(3/2)·Re[ w(1+w⁴)/D ]
 *   g₃ = Im[ (1+w⁶)/D ] − 1/2
 *   (x,y,z) = (g₁,g₂,g₃) / (g₁²+g₂²+g₃²)
 *
 * 该参数化的两个可验证特征：
 *   1. 边界 |w|=1 上 w 与 −w 映到同一点（对径点粘合，故是 RP²）
 *   2. w ↦ w·e^(2πi/3) 保持像点到原点的距离（三重旋转对称）
 *
 * √5 不是凑出来的：它使分母的六个根落在正二十面体的对称位置上，
 * 正是这个选择让曲面获得三重对称且消掉全部分支点。
 */

import type { Vec3 } from '../../lib/proj3d'

/** 复数按 [实部, 虚部] 表示 */
export type Complex = [number, number]

const SQRT5 = Math.sqrt(5)

export function cmul(a: Complex, b: Complex): Complex {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]
}

export function cdiv(a: Complex, b: Complex): Complex {
  const d = b[0] * b[0] + b[1] * b[1]
  if (d < 1e-15) return [0, 0]
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]
}

export function cpow(a: Complex, n: number): Complex {
  let r: Complex = [1, 0]
  for (let i = 0; i < n; i++) r = cmul(r, a)
  return r
}

/** Bryant–Kusner 映射: 单位圆盘上的复参数 w -> 空间点 */
export function boyFromComplex(w: Complex): Vec3 {
  const w3 = cpow(w, 3)
  const w4 = cpow(w, 4)
  const w6 = cpow(w, 6)
  // D = w⁶ + √5 w³ − 1
  const den: Complex = [w6[0] + SQRT5 * w3[0] - 1, w6[1] + SQRT5 * w3[1]]

  const g1 = -1.5 * cdiv(cmul(w, [1 - w4[0], -w4[1]]), den)[1]
  const g2 = -1.5 * cdiv(cmul(w, [1 + w4[0], w4[1]]), den)[0]
  const g3 = cdiv([1 + w6[0], w6[1]], den)[1] - 0.5

  const g = g1 * g1 + g2 * g2 + g3 * g3
  if (g < 1e-15) return [0, 0, 0]
  return [g1 / g, g2 / g, g3 / g]
}

/** 极坐标接口: r∈[0,1] 半径, theta∈[0,2π] 角度。供 sampleSurface 直接使用 */
export function boySurface(theta: number, r: number): Vec3 {
  // r 贴到 1 时分母可能极小, 留一点余量保证数值稳定
  const rr = Math.min(r, 0.999)
  return boyFromComplex([rr * Math.cos(theta), rr * Math.sin(theta)])
}

export const U_RANGE: [number, number] = [0, 2 * Math.PI]
export const V_RANGE: [number, number] = [0, 0.999]

/**
 * 对径点粘合偏差：边界 |w|=1 上 w 与 −w 应映到同一点。
 * 这是「它是 RP² 而非圆盘」的判据。
 */
export function antipodalGap(theta: number): number {
  const a = boyFromComplex([Math.cos(theta), Math.sin(theta)])
  const b = boyFromComplex([-Math.cos(theta), -Math.sin(theta)])
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/**
 * 三重旋转对称：w ↦ w·e^(2πi/3) 保持到原点的距离。
 * 返回两个像点半径之差。
 */
export function threefoldRadiusGap(theta: number, r: number): number {
  const p = boySurface(theta, r)
  const q = boySurface(theta + (2 * Math.PI) / 3, r)
  return Math.abs(Math.hypot(p[0], p[1], p[2]) - Math.hypot(q[0], q[1], q[2]))
}

/** 分支点个数。博伊曲面为 0 —— 这正是它区别于交叉帽与罗马曲面的关键 */
export const BRANCH_POINTS = 0

/** 三重点个数 */
export const TRIPLE_POINTS = 1

/** 欧拉示性数 χ(RP²)=1，不可定向 */
export const EULER_CHARACTERISTIC = 1
export const ORIENTABLE = false

/** 三种 RP² 浸入的对比数据，供讲解层展示 */
export const IMMERSIONS = [
  { name: '交叉帽', branch: 2, triple: 0, note: '最简单' },
  { name: '罗马曲面', branch: 6, triple: 1, note: '对称性强' },
  { name: '博伊曲面', branch: 0, triple: 1, note: '处处光滑' },
] as const
