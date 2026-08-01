/**
 * 环面纽结管（纯函数，便于测试）
 *
 * 在环面表面上绕行 p 圈经线、q 圈纬线的闭曲线，套上圆管后得到实体纽结。
 * 三叶结是 (2,3)，五叶结是 (2,5)。
 *
 * 本实验与 trefoil-surface 的分工：那个聚焦「怎么证明打不开」（不变量），
 * 这个聚焦「(p,q) 与拓扑性质的对应关系」——
 *
 *   交叉数     min(p(q−1), q(p−1))    (p,q 互素时)
 *   亏格       (p−1)(q−1)/2           Seifert 曲面的亏格
 *   桥数       min(p, q)
 *   分支数     gcd(p, q)              =1 才是纽结, >1 是链环
 *
 * 这四个公式把「在环面上怎么绕」直接翻译成纽结不变量，
 * 是环面纽结成为纽结理论最好教材的原因：所有量都能算，不用查表。
 */

import type { Vec3 } from '../../lib/proj3d'

/** 最大公约数 */
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

/** 环面纽结的中心曲线。R 主半径, r 管半径(指环面的管, 非纽结管) */
export function knotCurve(t: number, p: number, q: number, R = 2, r = 0.75): Vec3 {
  const rad = R + r * Math.cos(p * t)
  return [rad * Math.cos(q * t), rad * Math.sin(q * t), r * Math.sin(p * t)]
}

export const T_RANGE: [number, number] = [0, 2 * Math.PI]

/** 分支数 = gcd(p,q)。为 1 时是纽结, 大于 1 时是链环 */
export function componentCount(p: number, q: number): number {
  return gcd(p, q)
}

export function isKnot(p: number, q: number): boolean {
  return gcd(p, q) === 1
}

/**
 * 交叉数 = min(p(q−1), q(p−1))，仅对互素的 (p,q) 有意义。
 * (2,3) 给 min(2·2, 3·1) = 3 ✓ 三叶结
 * (2,5) 给 min(2·4, 5·1) = 5 ✓ 五叶结
 * (3,4) 给 min(3·3, 4·2) = 8 ✓
 */
export function crossingNumber(p: number, q: number): number {
  if (!isKnot(p, q)) return 0
  return Math.min(p * (q - 1), q * (p - 1))
}

/**
 * Seifert 曲面的亏格 = (p−1)(q−1)/2。
 * (2,3) 给 1，说明三叶结的 Seifert 曲面是带一个洞的曲面。
 */
export function seifertGenus(p: number, q: number): number {
  if (!isKnot(p, q)) return 0
  return ((p - 1) * (q - 1)) / 2
}

/** 桥数 = min(p,q)。这是纽结能被分成几段「上跨」的最小值 */
export function bridgeNumber(p: number, q: number): number {
  if (!isKnot(p, q)) return 0
  return Math.min(p, q)
}

/**
 * (p,q) 与 (q,p) 给出同一个纽结类型（只是嵌入方式不同）。
 * 这条对称性可以从三个公式验证：交叉数、亏格、桥数都对称。
 */
export function isSymmetricPair(p: number, q: number): boolean {
  return crossingNumber(p, q) === crossingNumber(q, p)
    && seifertGenus(p, q) === seifertGenus(q, p)
    && bridgeNumber(p, q) === bridgeNumber(q, p)
}

/** 曲线闭合性检验 */
export function closureGap(p: number, q: number): number {
  const a = knotCurve(0, p, q)
  const b = knotCurve(2 * Math.PI, p, q)
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/** 曲线到环面中心圈的距离，应恒等于环面管半径 r */
export function torusDistance(t: number, p: number, q: number, R = 2, r = 0.75): number {
  const pt = knotCurve(t, p, q, R, r)
  const rho = Math.hypot(pt[0], pt[1])
  return Math.hypot(rho - R, pt[2])
}

export const KNOT_TABLE = [
  { p: 2, q: 3, label: '三叶结 (2,3)', note: '交叉 3 · 亏格 1' },
  { p: 2, q: 5, label: '五叶结 (2,5)', note: '交叉 5 · 亏格 2' },
  { p: 2, q: 7, label: '(2,7) 纽结', note: '交叉 7 · 亏格 3' },
  { p: 3, q: 4, label: '(3,4) 纽结', note: '交叉 8 · 亏格 3' },
  { p: 3, q: 5, label: '(3,5) 纽结', note: '交叉 10 · 亏格 4' },
  { p: 2, q: 6, label: '(2,6) 链环', note: 'gcd=2 · 两个分支' },
] as const
