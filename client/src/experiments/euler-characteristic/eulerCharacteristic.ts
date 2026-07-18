/**
 * 欧拉示性数核心（纯函数，便于测试）
 *
 * 对任意凸多面体，顶点数 V、棱数 E、面数 F 满足
 * 欧拉公式：V - E + F = 2。这个 2 是球面的拓扑不变量，
 * 与多面体的具体形状无关。环面（甜甜圈）则 χ = 0。
 */

export interface Polyhedron {
  name: string
  V: number
  E: number
  F: number
  color: string
}

/** 欧拉示性数 χ = V - E + F */
export function eulerChar(V: number, E: number, F: number): number {
  return V - E + F
}

/** 由某个多面体对象计算 χ */
export function polyhedronChar(p: Polyhedron): number {
  return eulerChar(p.V, p.E, p.F)
}

/** 是否满足凸多面体欧拉公式（χ = 2） */
export function isConvexEuler(p: Polyhedron): boolean {
  return polyhedronChar(p) === 2
}

/** 五种正多面体（柏拉图立体）的 V/E/F */
export const POLYHEDRA: Polyhedron[] = [
  { name: '四面体', V: 4, E: 6, F: 4, color: '#6366f1' },
  { name: '立方体', V: 8, E: 12, F: 6, color: '#ec4899' },
  { name: '八面体', V: 6, E: 12, F: 8, color: '#22d3ee' },
  { name: '十二面体', V: 20, E: 30, F: 12, color: '#fbbf24' },
  { name: '二十面体', V: 12, E: 30, F: 20, color: '#34d399' },
]

/** 环面（甜甜圈）的示性数，用一个规则四边形网格划分：χ = 0 */
export const TORUS: Polyhedron = {
  name: '环面', V: 16, E: 32, F: 16, color: '#a78bfa',
}

/** 亏格 g 的可定向闭曲面示性数 χ = 2 - 2g */
export function genusChar(g: number): number {
  return 2 - 2 * g
}
