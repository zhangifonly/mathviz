/**
 * 斯坦纳链核心算法（纯函数，便于测试，禁止依赖 DOM）
 *
 * 斯坦纳链：在两个圆之间填入一圈首尾相切的小圆，每个小圆同时与
 * 内外两圆相切，且与左右邻居相切。
 *
 * 构造思路（反演）：
 *   1. 先在同心圆环里均匀放 n 个相切圆（最简单情形），此时闭合条件
 *      可解析求出：sin(pi/n) = (R - r) / (R + r)。
 *   2. 再用圆反演把同心情形映射到一般的两不同心圆之间——反演保持
 *      相切关系，所以链条依旧闭合（斯坦纳定理 / Steiner porism）。
 */

export interface Circle {
  x: number
  y: number
  r: number
}

export interface Chain {
  outer: Circle
  inner: Circle
  circles: Circle[]
}

/** 闭合同心链的内外半径比 r_inner / r_outer（由闭合条件反解） */
export function chainRatio(n: number): number {
  const s = Math.sin(Math.PI / n)
  return (1 - s) / (1 + s)
}

/**
 * 生成同心情形的 n 个相切圆。
 * 外圆半径 outerR，内圆半径由闭合条件确定，链圆圆心在半径 d 的圆周上。
 * @param rotation 整条链绕圆心旋转的角度（弧度），闭合链可自由转动
 */
export function concentricChain(n: number, outerR = 1, rotation = 0): Chain {
  const s = Math.sin(Math.PI / n)
  const innerR = (outerR * (1 - s)) / (1 + s)
  const d = (outerR + innerR) / 2
  const a = (outerR - innerR) / 2
  const circles: Circle[] = []
  for (let i = 0; i < n; i++) {
    const theta = rotation + (2 * Math.PI * i) / n
    circles.push({ x: d * Math.cos(theta), y: d * Math.sin(theta), r: a })
  }
  return { outer: { x: 0, y: 0, r: outerR }, inner: { x: 0, y: 0, r: innerR }, circles }
}

/**
 * 圆的反演变换（关于圆心 (ox,oy)、半径 k 的反演圆）。
 * 不经过反演中心的圆仍映射为圆：
 *   s = k^2 / (|OC|^2 - rho^2)，新圆心 = O + s*(C - O)，新半径 = |s|*rho。
 */
export function invertCircle(c: Circle, ox: number, oy: number, k: number): Circle {
  const dx = c.x - ox
  const dy = c.y - oy
  const s = (k * k) / (dx * dx + dy * dy - c.r * c.r)
  return { x: ox + s * dx, y: oy + s * dy, r: Math.abs(s) * c.r }
}

/**
 * 一般（非同心）斯坦纳链：先造同心链再整体反演。
 * 反演中心放在外圆之外，保证所有圆都不过反演中心，映射结果均为圆。
 */
export function steinerChain(n: number, rotation = 0, outerR = 1): Chain {
  const base = concentricChain(n, outerR, rotation)
  const ox = outerR * 1.6
  const oy = 0
  const k = outerR * 2.2
  const inv = (c: Circle) => invertCircle(c, ox, oy, k)
  return { outer: inv(base.outer), inner: inv(base.inner), circles: base.circles.map(inv) }
}

/** 两圆是否相切（外切，中心距约等于半径之和），tol 为相对容差 */
export function areTangent(a: Circle, b: Circle, tol = 1e-6): boolean {
  const d = Math.hypot(a.x - b.x, a.y - b.y)
  return Math.abs(d - (a.r + b.r)) <= tol * (a.r + b.r)
}

/** 预设链数：均为可闭合的经典配置 */
export const CHAIN_COUNTS = [5, 6, 8]
