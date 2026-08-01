/**
 * 高斯曲率（纯函数，便于测试）
 *
 * 曲面在一点的弯曲程度由两个主曲率 κ₁、κ₂ 刻画。它们的乘积
 *   K = κ₁·κ₂
 * 叫高斯曲率，符号决定局部形状：
 *   K > 0  椭圆点（碗形，两个方向同向弯）
 *   K < 0  双曲点（鞍形，两个方向反向弯）
 *   K = 0  抛物点（柱形，一个方向是直的）
 *
 * 对 z = f(x,y) 型曲面：
 *   K = (f_xx·f_yy − f_xy²) / (1 + f_x² + f_y²)²
 *   H = ((1+f_y²)f_xx − 2f_x f_y f_xy + (1+f_x²)f_yy) / (2(1+f_x²+f_y²)^{3/2})
 *
 * **高斯绝妙定理**（Theorema Egregium）：K 是内蕴量，
 * 只由曲面上的距离测量决定，与它如何嵌入空间无关。
 * 推论：K≠0 的曲面无法不失真地摊平 —— 这就是地图必然变形的根本原因。
 *
 * 主曲率由 K 与 H 反解：κ = H ± √(H² − K)。
 */

import type { Vec3 } from '../../lib/proj3d'

export const SURFACES = [
  'sphere', 'saddle', 'cylinder', 'torus', 'egg', 'volcano',
] as const
export type SurfaceKind = (typeof SURFACES)[number]

export interface SurfaceInfo {
  kind: SurfaceKind
  label: string
  /** 高斯曲率的符号特征 */
  sign: string
  note: string
}

export const SURFACE_INFO: SurfaceInfo[] = [
  { kind: 'sphere', label: '球冠', sign: 'K > 0 处处', note: '椭圆点 · 碗形' },
  { kind: 'saddle', label: '鞍面', sign: 'K < 0 处处', note: '双曲点 · 马鞍形' },
  { kind: 'cylinder', label: '柱面', sign: 'K = 0 处处', note: '抛物点 · 可摊平' },
  { kind: 'torus', label: '环面', sign: 'K 变号', note: '外侧正 · 内侧负' },
  { kind: 'egg', label: '蛋形', sign: 'K > 0 但不均匀', note: '尖端曲率大' },
  { kind: 'volcano', label: '火山口', sign: 'K 变号', note: '口沿处过零' },
]

/** 高度函数 z = f(x,y) */
export function heightFn(kind: SurfaceKind, x: number, y: number): number {
  const r2 = x * x + y * y
  switch (kind) {
    case 'sphere':
      // 上半球冠, 半径 1.6
      return Math.sqrt(Math.max(0.01, 2.56 - r2))
    case 'saddle':
      return 0.6 * (x * x - y * y)
    case 'cylinder':
      // 沿 y 方向是直的, 沿 x 方向弯 —— 一个主曲率为零
      return Math.sqrt(Math.max(0.01, 1.6 - x * x))
    case 'torus':
      // 环面上半部分: 到中心圈距离为 r 的圆
      return Math.sqrt(Math.max(0.01, 0.36 - (Math.sqrt(r2) - 1) ** 2))
    case 'egg':
      return 1.4 * Math.sqrt(Math.max(0.01, 1 - r2 / 2.25)) * (1 + 0.25 * y)
    case 'volcano':
      return 0.9 * Math.exp(-r2 / 0.8) * (r2 - 0.35)
  }
}

export function domainRange(kind: SurfaceKind): [number, number] {
  if (kind === 'torus') return [-1.55, 1.55]
  if (kind === 'sphere') return [-1.4, 1.4]
  if (kind === 'cylinder') return [-1.1, 1.4]
  return [-1.3, 1.3]
}

/** 曲面点 */
export function surfacePoint(kind: SurfaceKind, x: number, y: number): Vec3 {
  return [x, y, heightFn(kind, x, y)]
}

interface Derivs {
  fx: number
  fy: number
  fxx: number
  fyy: number
  fxy: number
}

/** 数值一阶与二阶偏导 */
export function derivatives(kind: SurfaceKind, x: number, y: number, h = 1e-4): Derivs {
  const f = (a: number, b: number) => heightFn(kind, a, b)
  const f0 = f(x, y)
  return {
    fx: (f(x + h, y) - f(x - h, y)) / (2 * h),
    fy: (f(x, y + h) - f(x, y - h)) / (2 * h),
    fxx: (f(x + h, y) - 2 * f0 + f(x - h, y)) / (h * h),
    fyy: (f(x, y + h) - 2 * f0 + f(x, y - h)) / (h * h),
    fxy: (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h))
      / (4 * h * h),
  }
}

/** 高斯曲率 K = (f_xx f_yy − f_xy²)/(1+f_x²+f_y²)² */
export function gaussianCurvature(kind: SurfaceKind, x: number, y: number): number {
  const { fx, fy, fxx, fyy, fxy } = derivatives(kind, x, y)
  return (fxx * fyy - fxy * fxy) / (1 + fx * fx + fy * fy) ** 2
}

/** 平均曲率 H */
export function meanCurvature(kind: SurfaceKind, x: number, y: number): number {
  const { fx, fy, fxx, fyy, fxy } = derivatives(kind, x, y)
  const s = 1 + fx * fx + fy * fy
  return ((1 + fy * fy) * fxx - 2 * fx * fy * fxy + (1 + fx * fx) * fyy)
    / (2 * Math.pow(s, 1.5))
}

/** 两个主曲率 κ = H ± √(H²−K)。K>H² 时开方为负, 说明数值噪声, 夹到 0 */
export function principalCurvatures(
  kind: SurfaceKind, x: number, y: number,
): [number, number] {
  const K = gaussianCurvature(kind, x, y)
  const H = meanCurvature(kind, x, y)
  const disc = Math.sqrt(Math.max(0, H * H - K))
  return [H + disc, H - disc]
}

/** 局部形状分类 */
export function pointType(kind: SurfaceKind, x: number, y: number): '椭圆点' | '双曲点' | '抛物点' {
  const K = gaussianCurvature(kind, x, y)
  if (K > 1e-3) return '椭圆点'
  if (K < -1e-3) return '双曲点'
  return '抛物点'
}

export function infoOf(kind: SurfaceKind): SurfaceInfo {
  return SURFACE_INFO.find((s) => s.kind === kind) ?? SURFACE_INFO[0]
}
