/**
 * 双曲三角形与角亏（纯函数，便于测试）
 *
 * 本实验的主题是把三种几何的面积公式统一起来：
 *
 *   球面 (K=+1)   Area = 内角和 − π      内角和 > π   盈余
 *   欧氏 (K=0)    与角无关               内角和 = π   零
 *   双曲 (K=−1)   Area = π − 内角和      内角和 < π   角亏
 *
 * 三者可写成一个式子：**Area = |内角和 − π| / |K|**（K≠0 时）。
 * 这正是高斯–博内定理的三种特例。
 *
 * 双曲情形有个球面没有的性质：**面积有上界 π**。三个角都趋于 0 时
 * （顶点趋于边界，即无穷远）面积趋于 π 但永不达到。
 * 所以双曲平面上「任意大的三角形」不存在 —— 反直觉但可算。
 */

import {
  angleSum, angularDefect, triangleArea, triangleAngles, triangleSides,
  hyperbolicDistance, MAX_TRIANGLE_AREA, type HPoint, type HTriangle,
} from '../../lib/hyperbolic2d'

export const TRIANGLE_PRESETS = [
  {
    id: 'small',
    label: '小三角形',
    note: '近似欧氏 · 内角和接近 180°',
    scale: 0.15,
  },
  {
    id: 'medium',
    label: '中等三角形',
    note: '角亏明显',
    scale: 0.5,
  },
  {
    id: 'large',
    label: '大三角形',
    note: '内角和显著小于 180°',
    scale: 0.8,
  },
  {
    id: 'ideal',
    label: '理想三角形',
    note: '顶点趋于边界 · 三角趋于 0 · 面积趋于 π',
    scale: 0.995,
  },
] as const

export type PresetId = (typeof TRIANGLE_PRESETS)[number]['id']

/** 由缩放参数生成等边（在双曲意义下）三角形：三顶点在同一欧氏半径上均匀分布 */
export function triangleOf(scale: number): HTriangle {
  const r = Math.max(0.01, Math.min(0.9999, scale))
  return {
    A: { x: 0, y: r },
    B: { x: -r * Math.sin((2 * Math.PI) / 3), y: r * Math.cos((2 * Math.PI) / 3) },
    C: { x: -r * Math.sin((4 * Math.PI) / 3), y: r * Math.cos((4 * Math.PI) / 3) },
  }
}

/** 按预设取三角形 */
export function presetTriangle(id: PresetId): HTriangle {
  const p = TRIANGLE_PRESETS.find((x) => x.id === id) ?? TRIANGLE_PRESETS[0]
  return triangleOf(p.scale)
}

/** 三种几何的面积公式对照 */
export const GEOMETRY_COMPARISON = [
  { name: '球面', curvature: 1, areaFormula: '内角和 − π', angleSum: '> π' },
  { name: '欧氏', curvature: 0, areaFormula: '与角度无关', angleSum: '= π' },
  { name: '双曲', curvature: -1, areaFormula: 'π − 内角和', angleSum: '< π' },
] as const

/**
 * 统一公式 Area = |内角和 − π| / |K|。
 * 对 K=−1 的双曲平面，即 π − 内角和。
 */
export function unifiedArea(angleSumValue: number, curvature: number): number {
  if (curvature === 0) return NaN
  return Math.abs(angleSumValue - Math.PI) / Math.abs(curvature)
}

/** 面积占上界 π 的比例 */
export function areaFraction(t: HTriangle): number {
  return triangleArea(t) / MAX_TRIANGLE_AREA
}

/** 等边双曲三角形的边长（三边应相等） */
export function edgeLengthSpread(t: HTriangle): number {
  const s = triangleSides(t)
  return Math.max(...s) - Math.min(...s)
}

/** 三个内角是否相等（等边三角形的必要条件） */
export function angleSpread(t: HTriangle): number {
  const a = triangleAngles(t)
  return Math.max(...a) - Math.min(...a)
}

/**
 * 欧氏对照：若把三顶点当欧氏点，内角和恒为 π。
 * 用来突出双曲的差异。
 */
export function euclideanAngleSum(t: HTriangle): number {
  const ang = (p: HPoint, q: HPoint, r: HPoint) => {
    const v1 = { x: q.x - p.x, y: q.y - p.y }
    const v2 = { x: r.x - p.x, y: r.y - p.y }
    const c = (v1.x * v2.x + v1.y * v2.y)
      / (Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y))
    return Math.acos(Math.max(-1, Math.min(1, c)))
  }
  return ang(t.A, t.B, t.C) + ang(t.B, t.C, t.A) + ang(t.C, t.A, t.B)
}

export {
  angleSum, angularDefect, triangleArea, triangleAngles, triangleSides,
  hyperbolicDistance, MAX_TRIANGLE_AREA,
}
export type { HPoint, HTriangle }
