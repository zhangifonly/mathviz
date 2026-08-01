/**
 * 球面三角形（纯函数，便于测试）
 *
 * 球面几何是最容易上手的非欧几何：把「直线」理解成大圆就行。
 * 但它与欧氏几何的差异极其彻底：
 *
 *   欧氏                        球面
 *   内角和 = π                  内角和 > π，超出量即面积
 *   有相似三角形                没有 —— 角决定形状也决定大小
 *   c² = a² + b²                cos c = cos a·cos b
 *   过线外一点有唯一平行线      没有任何平行线（任两大圆必相交）
 *
 * 本实验给出几个典型三角形，让这些差异都变成屏幕上可读的数字。
 */

import type { Vec3 } from '../../lib/proj3d'
import { fromLatLon, sphericalExcess, triangleAngles, triangleSides, unit } from '../../lib/sphere3d'
import type { SphericalTriangle } from '../../lib/sphere3d'

export const TRIANGLE_KINDS = ['octant', 'small', 'large', 'rightAngled', 'hemisphere'] as const
export type TriangleKind = (typeof TRIANGLE_KINDS)[number]

export interface TriangleInfo {
  kind: TriangleKind
  label: string
  note: string
}

export const TRIANGLE_INFO: TriangleInfo[] = [
  {
    kind: 'small',
    label: '小三角形',
    note: '近似欧氏 · 内角和略大于 180°',
  },
  {
    kind: 'octant',
    label: '八分之一球面',
    note: '三个直角 · 内角和 270°',
  },
  {
    kind: 'rightAngled',
    label: '直角三角形',
    note: '验证球面勾股定理',
  },
  {
    kind: 'large',
    label: '大三角形',
    note: '内角和接近 3π',
  },
  {
    kind: 'hemisphere',
    label: '接近半球',
    note: '面积趋于 2π',
  },
]

/** 各类型的三个顶点 */
export function triangleOf(kind: TriangleKind): SphericalTriangle {
  switch (kind) {
    case 'octant':
      return { A: [1, 0, 0], B: [0, 1, 0], C: [0, 0, 1] }
    case 'small': {
      // 北极附近的小三角形, 边长约 0.15 弧度
      const r = 0.15
      return {
        A: fromLatLon(Math.PI / 2 - r, 0),
        B: fromLatLon(Math.PI / 2 - r, (2 * Math.PI) / 3),
        C: fromLatLon(Math.PI / 2 - r, (4 * Math.PI) / 3),
      }
    }
    case 'rightAngled': {
      // A 在北极, B 与 C 分别沿两条正交经线 → A 处为直角
      const A: Vec3 = [0, 0, 1]
      const B = unit([Math.sin(0.7), 0, Math.cos(0.7)])
      const C = unit([0, Math.sin(1.0), Math.cos(1.0)])
      return { A, B, C }
    }
    case 'large': {
      // 三个顶点接近赤道上等距分布 + 略偏北, 覆盖大部分半球
      const lat = 0.12
      return {
        A: fromLatLon(lat, 0),
        B: fromLatLon(lat, (2 * Math.PI) / 3),
        C: fromLatLon(lat, (4 * Math.PI) / 3),
      }
    }
    case 'hemisphere': {
      // 极接近赤道的三点 → 三角形趋于半球, 面积趋于 2π
      const lat = 0.004
      return {
        A: fromLatLon(lat, 0),
        B: fromLatLon(lat, (2 * Math.PI) / 3),
        C: fromLatLon(lat, (4 * Math.PI) / 3),
      }
    }
  }
}

/** 内角和（弧度） */
export function angleSum(t: SphericalTriangle): number {
  return triangleAngles(t).reduce((a, b) => a + b, 0)
}

/** 内角和相对 π 的超出量，等于面积（吉拉尔定理） */
export function excessOf(kind: TriangleKind): number {
  return sphericalExcess(triangleOf(kind))
}

/** 面积占整个球面（4π）的比例 */
export function areaFraction(kind: TriangleKind): number {
  return sphericalExcess(triangleOf(kind)) / (4 * Math.PI)
}

/**
 * 「没有相似三角形」的定量说明：
 * 把三角形按比例缩小（顶点向形心靠近），内角和会随之变化。
 * 欧氏几何里缩放不改变角度，球面几何里改变 —— 这就是没有相似形的原因。
 */
export function scaledTriangle(kind: TriangleKind, scale: number): SphericalTriangle {
  const t = triangleOf(kind)
  const c = unit([
    t.A[0] + t.B[0] + t.C[0],
    t.A[1] + t.B[1] + t.C[1],
    t.A[2] + t.B[2] + t.C[2],
  ])
  // 沿大圆把每个顶点朝形心移动 (1−scale) 的比例
  const pull = (p: Vec3): Vec3 => unit([
    c[0] + (p[0] - c[0]) * scale,
    c[1] + (p[1] - c[1]) * scale,
    c[2] + (p[2] - c[2]) * scale,
  ])
  return { A: pull(t.A), B: pull(t.B), C: pull(t.C) }
}

export function scaledAngleSum(kind: TriangleKind, scale: number): number {
  return angleSum(scaledTriangle(kind, scale))
}

/** 欧氏三角形的内角和恒为 π，用作对照 */
export const EUCLIDEAN_ANGLE_SUM = Math.PI

/** 球面三角形内角和的取值范围 (π, 3π) */
export const ANGLE_SUM_RANGE: [number, number] = [Math.PI, 3 * Math.PI]

/** 三条边长（弧度） */
export function sidesOf(kind: TriangleKind): [number, number, number] {
  return triangleSides(triangleOf(kind))
}

/** 三个内角（弧度） */
export function anglesOf(kind: TriangleKind): [number, number, number] {
  return triangleAngles(triangleOf(kind))
}

export function infoOf(kind: TriangleKind): TriangleInfo {
  return TRIANGLE_INFO.find((i) => i.kind === kind) ?? TRIANGLE_INFO[0]
}
