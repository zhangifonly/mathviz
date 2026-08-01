/**
 * 三叶结（纯函数，便于测试）
 *
 * 最简单的非平凡纽结：三个交叉，无论怎么拉伸都消不掉。
 * 它是纽结理论的第一个非平凡例子，也是区分「打了结」与「没打结」的最小反例。
 *
 * 参数方程（(2,3) 环面纽结）：
 *   x = sin t + 2 sin 2t
 *   y = cos t − 2 cos 2t
 *   z = −sin 3t
 *
 * 两个可验证的不变量：
 *
 * 1. **交叉数 3**：平面投影上最少 3 个交叉点。三叶结是交叉数最小的
 *    非平凡纽结（交叉数 1、2 的纽结都是平凡的）。
 * 2. **亚历山大多项式** Δ(t) = t² − t + 1。平凡纽结的是常数 1，
 *    所以 Δ ≠ 1 就严格证明了三叶结打不开 —— 这是不变量的威力。
 *
 * 三叶结还有两个手性版本（左手结与右手结），它们不能通过连续变形互变，
 * 是最简单的手性纽结例子。
 */

import type { Vec3 } from '../../lib/proj3d'

export const T_RANGE: [number, number] = [0, 2 * Math.PI]

/** 三叶结中心曲线。handed = 1 右手结, -1 左手结 */
export function trefoilCurve(t: number, handed: 1 | -1 = 1): Vec3 {
  return [
    Math.sin(t) + 2 * Math.sin(2 * t),
    Math.cos(t) - 2 * Math.cos(2 * t),
    handed * -Math.sin(3 * t),
  ]
}

/**
 * (p,q) 环面纽结的一般形式：在环面上绕 p 圈经线、q 圈纬线。
 * 三叶结是 (2,3)。当 gcd(p,q)=1 时得到纽结, 否则得到链环。
 */
export function torusKnot(t: number, p = 2, q = 3, R = 2, r = 0.8): Vec3 {
  const phi = q * t
  const rad = R + r * Math.cos(p * t)
  return [rad * Math.cos(phi), rad * Math.sin(phi), r * Math.sin(p * t)]
}

/** 最大公约数, 用于判断 (p,q) 给出纽结还是链环 */
export function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

/** (p,q) 是否给出真正的纽结(单一闭曲线) */
export function isKnot(p: number, q: number): boolean {
  return gcd(p, q) === 1
}

/**
 * 亚历山大多项式的系数。三叶结为 t² − t + 1，即 [1, -1, 1]。
 * 平凡纽结为 [1]。系数不同即证明两纽结不等价。
 */
export const ALEXANDER_TREFOIL = [1, -1, 1]
export const ALEXANDER_UNKNOT = [1]

/** 在 t 处求亚历山大多项式的值 */
export function alexanderAt(coeffs: number[], t: number): number {
  return coeffs.reduce((s, c, i) => s + c * Math.pow(t, coeffs.length - 1 - i), 0)
}

/** 交叉数。三叶结为 3, 平凡纽结为 0 */
export const CROSSING_NUMBER = 3

/**
 * 数值统计平面投影(丢弃 z)上的交叉次数。
 * 用于验证交叉数确实是 3 —— 这不是靠图看出来的, 而是算出来的。
 */
export function countProjectionCrossings(steps = 1200, handed: 1 | -1 = 1): number {
  const pts: Array<[number, number]> = []
  for (let i = 0; i < steps; i++) {
    const p = trefoilCurve((2 * Math.PI * i) / steps, handed)
    pts.push([p[0], p[1]])
  }
  let count = 0
  const n = pts.length
  // 逐对线段判交, 跳过相邻段(它们必然共享端点)
  for (let i = 0; i < n; i++) {
    const a1 = pts[i]
    const a2 = pts[(i + 1) % n]
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue
      const b1 = pts[j]
      const b2 = pts[(j + 1) % n]
      if (segmentsIntersect(a1, a2, b1, b2)) count++
    }
  }
  return count
}

type P2 = [number, number]

function cross2(o: P2, a: P2, b: P2): number {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
}

function segmentsIntersect(a1: P2, a2: P2, b1: P2, b2: P2): boolean {
  const d1 = cross2(b1, b2, a1)
  const d2 = cross2(b1, b2, a2)
  const d3 = cross2(a1, a2, b1)
  const d4 = cross2(a1, a2, b2)
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0))
    && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
}

/** 曲线是否闭合 */
export function closureGap(handed: 1 | -1 = 1): number {
  const a = trefoilCurve(0, handed)
  const b = trefoilCurve(2 * Math.PI, handed)
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

export const KNOT_PRESETS = [
  { p: 2, q: 3, label: '三叶结 (2,3)', note: '交叉数 3 · 最简纽结' },
  { p: 2, q: 5, label: '五叶结 (2,5)', note: '交叉数 5' },
  { p: 3, q: 4, label: '(3,4) 纽结', note: '交叉数 8' },
  { p: 2, q: 4, label: '(2,4) 链环', note: 'gcd=2 · 不是纽结' },
] as const
