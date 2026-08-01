/**
 * 双曲抛物面（马鞍面，纯函数，便于测试）
 *
 *   z = (x²/a² − y²/b²)
 *
 * 两个关键性质：
 *
 * 1. **处处是鞍点**：高斯曲率 K < 0 处处成立。沿 x 方向是上凸的抛物线，
 *    沿 y 方向是下凹的抛物线，两个主曲率符号相反。
 *
 * 2. **双直纹面**：虽然弯曲，却能被两族直线完全铺满 —— 而且是两族，
 *    每点恰好有两条直线穿过。这让它成为建筑上最好用的曲面之一：
 *    弯曲的屋顶可以用笔直的钢梁搭起来。
 *
 * 直纹参数化（u 沿直线走，v 选哪条直线）：
 *   第一族: (u, v, u²/a² − v²/b²) 固定 v 变 u   —— 不是直线, 需换参数
 * 用「和差」参数化才显式看出直线:
 *   x = a(s+t), y = b(s−t), z = 4st
 * 固定 t 变 s 是一条直线, 固定 s 变 t 是另一族的一条直线。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [-1, 1]
export const V_RANGE: [number, number] = [-1, 1]

/** 显式形式 z = x²/a² − y²/b²。直接按 (x,y) 网格采样 */
export function saddle(x: number, y: number, a = 1, b = 1): Vec3 {
  return [x, y, (x * x) / (a * a) - (y * y) / (b * b)]
}

/**
 * 直纹参数化：x = a(s+t), y = b(s−t), z = 4st。
 * 固定 t 变 s（或反之）都得到空间中的一条直线。
 */
export function ruled(s: number, t: number, a = 1, b = 1): Vec3 {
  return [a * (s + t), b * (s - t), 4 * s * t]
}

/** 验证直纹参数化确实落在 z = x²/a² − y²/b² 上，返回残差 */
export function ruledResidual(s: number, t: number, a = 1, b = 1): number {
  const [x, y, z] = ruled(s, t, a, b)
  return z - ((x * x) / (a * a) - (y * y) / (b * b))
}

/**
 * 第一族直线：固定 t，参数 s 走一遍。
 * 返回起止两点，中间任意点都应共线。
 */
export function firstFamilyLine(t: number, a = 1, b = 1, sMin = -1, sMax = 1): Vec3[] {
  return [ruled(sMin, t, a, b), ruled(sMax, t, a, b)]
}

/** 第二族直线：固定 s，参数 t 走一遍 */
export function secondFamilyLine(s: number, a = 1, b = 1, tMin = -1, tMax = 1): Vec3[] {
  return [ruled(s, tMin, a, b), ruled(s, tMax, a, b)]
}

/**
 * 共线偏差：三点是否共线，用叉积模长衡量。
 * 用来验证「固定 t 变 s 得到的确实是直线」。
 */
export function collinearityError(p: Vec3, q: Vec3, r: Vec3): number {
  const e1: Vec3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]]
  const e2: Vec3 = [r[0] - p[0], r[1] - p[1], r[2] - p[2]]
  const c: Vec3 = [
    e1[1] * e2[2] - e1[2] * e2[1],
    e1[2] * e2[0] - e1[0] * e2[2],
    e1[0] * e2[1] - e1[1] * e2[0],
  ]
  return Math.hypot(c[0], c[1], c[2])
}

/**
 * 高斯曲率解析式：K = −4/(a²b²·(1 + 4x²/a⁴ + 4y²/b⁴)²)。
 * 处处为负 —— 这是「处处鞍点」的严格表述。
 */
export function gaussianCurvature(x: number, y: number, a = 1, b = 1): number {
  const zx = (2 * x) / (a * a)
  const zy = (-2 * y) / (b * b)
  const zxx = 2 / (a * a)
  const zyy = -2 / (b * b)
  const zxy = 0
  const den = (1 + zx * zx + zy * zy) ** 2
  return (zxx * zyy - zxy * zxy) / den
}

/** 平均曲率。原点处为 0，但别处一般不为零(它不是极小曲面) */
export function meanCurvature(x: number, y: number, a = 1, b = 1): number {
  const zx = (2 * x) / (a * a)
  const zy = (-2 * y) / (b * b)
  const zxx = 2 / (a * a)
  const zyy = -2 / (b * b)
  const s = 1 + zx * zx + zy * zy
  return ((1 + zy * zy) * zxx + (1 + zx * zx) * zyy) / (2 * Math.pow(s, 1.5))
}

export const PRESETS = [
  { a: 1, b: 1, label: '对称马鞍', note: 'a = b' },
  { a: 1.5, b: 0.7, label: '沿 x 拉长', note: 'a > b' },
  { a: 0.7, b: 1.5, label: '沿 y 拉长', note: 'a < b' },
] as const
