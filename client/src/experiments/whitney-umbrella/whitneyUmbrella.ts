/**
 * 惠特尼伞（纯函数，便于测试）
 *
 *   (u, v) ↦ (u·v, u, v²)
 *
 * 光滑映射从平面到三维空间时，一般位置下只会出现两类稳定奇点：
 * 横截自交（两片相交成一条线）与**惠特尼伞点**（自交线终止于一个尖点）。
 * 惠特尼 1944 年证明了这个分类，本曲面就是后者的标准模型。
 *
 * 三条可验证的结构性质：
 *
 * 1. **自交线**：(u, v) 与 (−u, −v)... 实际上是 u=0 时 (0, 0, v²)，
 *    即 z 轴正半轴。参数 (0, v) 与 (0, −v) 映到同一点 (0,0,v²)。
 * 2. **伞点**：原点。自交线在此终止，曲面在这里不是浸入。
 * 3. **雅可比退化**：原点处雅可比矩阵的秩从 2 掉到 1，
 *    这正是「不是浸入」的严格表述。
 *
 * 隐式方程：x² = y²·z（在 z ≥ 0 部分）。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [-1.3, 1.3]
export const V_RANGE: [number, number] = [-1.3, 1.3]

/** 惠特尼伞参数方程 (u,v) -> (uv, u, v²)。scale 仅整体缩放 */
export function whitneyUmbrella(u: number, v: number, scale = 1): Vec3 {
  return [scale * u * v, scale * u, scale * v * v]
}

/** 隐式方程残差 x² − y²·z。参数化的点应恒为 0 */
export function implicitResidual(p: Vec3): number {
  const [x, y, z] = p
  return x * x - y * y * z
}

/**
 * 自交线：u=0 时映到 (0, 0, v²)，即 z 轴。
 * (0,v) 与 (0,−v) 给出同一点，这就是自交。
 */
export function selfIntersectionGap(v: number, scale = 1): number {
  const a = whitneyUmbrella(0, v, scale)
  const b = whitneyUmbrella(0, -v, scale)
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/** 自交线的采样点（z 轴正半轴） */
export function selfIntersectionLine(steps = 30, scale = 1): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    const v = (V_RANGE[1] * i) / steps
    pts.push(whitneyUmbrella(0, v, scale))
  }
  return pts
}

/** 伞点（尖点）：原点。自交线在此终止 */
export const UMBRELLA_POINT: Vec3 = [0, 0, 0]

/**
 * 雅可比矩阵 [∂f/∂u, ∂f/∂v]，返回两个列向量。
 *   ∂f/∂u = (v, 1, 0)
 *   ∂f/∂v = (u, 0, 2v)
 */
export function jacobianColumns(u: number, v: number): { du: Vec3; dv: Vec3 } {
  return { du: [v, 1, 0], dv: [u, 0, 2 * v] }
}

/**
 * 雅可比矩阵的秩。两列叉积的模长为 0 说明秩 ≤ 1（退化）。
 * 原点处 dv = (0,0,0)，秩掉到 1 —— 这就是「不是浸入」。
 */
export function jacobianRankDefect(u: number, v: number): number {
  const { du, dv } = jacobianColumns(u, v)
  const c: Vec3 = [
    du[1] * dv[2] - du[2] * dv[1],
    du[2] * dv[0] - du[0] * dv[2],
    du[0] * dv[1] - du[1] * dv[0],
  ]
  return Math.hypot(c[0], c[1], c[2])
}

/** 是否为浸入点（雅可比满秩） */
export function isImmersive(u: number, v: number): boolean {
  return jacobianRankDefect(u, v) > 1e-12
}

/**
 * 横截自交与伞点的区别：
 * 沿自交线走，两片曲面的夹角在伞点处趋于 0（两片贴合），
 * 而普通横截自交处夹角保持有限。返回该夹角（弧度）。
 */
export function sheetAngle(v: number): number {
  if (Math.abs(v) < 1e-9) return 0
  // z=v² 处两片对应参数 (u, v) 与 (u, −v) 附近, 法向量夹角
  const n1 = surfaceNormal(0.001, v)
  const n2 = surfaceNormal(0.001, -v)
  const d = n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2]
  return Math.acos(Math.max(-1, Math.min(1, Math.abs(d))))
}

function surfaceNormal(u: number, v: number): Vec3 {
  const { du, dv } = jacobianColumns(u, v)
  const c: Vec3 = [
    du[1] * dv[2] - du[2] * dv[1],
    du[2] * dv[0] - du[0] * dv[2],
    du[0] * dv[1] - du[1] * dv[0],
  ]
  const n = Math.hypot(c[0], c[1], c[2])
  if (n < 1e-12) return [0, 0, 1]
  return [c[0] / n, c[1] / n, c[2] / n]
}

export const PRESETS = [
  { scale: 0.7, label: '收紧', note: '伞点更明显' },
  { scale: 1, label: '标准', note: '经典惠特尼伞' },
  { scale: 1.4, label: '放大', note: '自交线更长' },
] as const
