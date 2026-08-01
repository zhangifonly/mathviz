/**
 * 二次曲面分类（纯函数，便于测试）
 *
 * 三元二次方程 Ax²+By²+Cz²+... = 0 经过平移与旋转（合同变换）后，
 * 总能化成标准形。非退化的实二次曲面只有 6 类，这里全部给出参数化：
 *
 *   椭球面      x²/a²+y²/b²+z²/c² = 1     闭合有界
 *   单叶双曲面  x²/a²+y²/b²−z²/c² = 1     连通, 是直纹面
 *   双叶双曲面  x²/a²−y²/b²−z²/c² = 1     两片分离
 *   椭圆抛物面  z = x²/a²+y²/b²           碗形
 *   双曲抛物面  z = x²/a²−y²/b²           马鞍形, 是直纹面
 *   二次锥面    x²/a²+y²/b²−z²/c² = 0     顶点处不光滑
 *
 * 判别依据是三个系数的符号组合：全同号得椭球，一负得单叶，两负得双叶。
 * 这正是「二次型的惯性指数」在几何上的体现 —— 符号数决定曲面类型，
 * 而系数大小只改变胖瘦，不改变分类。
 */

import type { Vec3 } from '../../lib/proj3d'

export const KINDS = [
  'ellipsoid', 'hyperboloid1', 'hyperboloid2',
  'paraboloid', 'saddle', 'cone',
] as const
export type QuadricKind = (typeof KINDS)[number]

export interface QuadricInfo {
  kind: QuadricKind
  label: string
  equation: string
  /** 是否为直纹面(能被直线铺满) */
  ruled: boolean
  /** 连通分支数 */
  pieces: number
  note: string
}

export const QUADRIC_INFO: QuadricInfo[] = [
  { kind: 'ellipsoid', label: '椭球面', equation: 'x²/a² + y²/b² + z²/c² = 1', ruled: false, pieces: 1, note: '闭合有界' },
  { kind: 'hyperboloid1', label: '单叶双曲面', equation: 'x²/a² + y²/b² − z²/c² = 1', ruled: true, pieces: 1, note: '直纹面 · 冷却塔' },
  { kind: 'hyperboloid2', label: '双叶双曲面', equation: 'x²/a² − y²/b² − z²/c² = 1', ruled: false, pieces: 2, note: '两片分离' },
  { kind: 'paraboloid', label: '椭圆抛物面', equation: 'z = x²/a² + y²/b²', ruled: false, pieces: 1, note: '碗形 · 卫星天线' },
  { kind: 'saddle', label: '双曲抛物面', equation: 'z = x²/a² − y²/b²', ruled: true, pieces: 1, note: '马鞍形 · 双直纹' },
  { kind: 'cone', label: '二次锥面', equation: 'x²/a² + y²/b² − z²/c² = 0', ruled: true, pieces: 1, note: '顶点不光滑' },
]

/** u,v 参数域（按曲面类型不同） */
export function paramRange(kind: QuadricKind): { u: [number, number]; v: [number, number] } {
  const twoPi: [number, number] = [0, 2 * Math.PI]
  if (kind === 'ellipsoid') return { u: twoPi, v: [0, Math.PI] }
  if (kind === 'hyperboloid1' || kind === 'cone') return { u: twoPi, v: [-1.2, 1.2] }
  if (kind === 'hyperboloid2') return { u: twoPi, v: [0.01, 1.2] }
  return { u: twoPi, v: [0, 1.2] }
}

/**
 * 统一参数化接口。u 一般是绕轴的角度，v 是沿轴/径向的参数。
 * 双叶双曲面只返回上半片（下半片由 z 取反得到）。
 */
export function quadric(
  kind: QuadricKind, u: number, v: number,
  a = 1, b = 1, c = 1,
): Vec3 {
  const cu = Math.cos(u)
  const su = Math.sin(u)
  switch (kind) {
    case 'ellipsoid':
      // v 为极角: x=a sin v cos u, y=b sin v sin u, z=c cos v
      return [a * Math.sin(v) * cu, b * Math.sin(v) * su, c * Math.cos(v)]
    case 'hyperboloid1':
      // cosh/sinh: 满足 cosh²−sinh²=1
      return [a * Math.cosh(v) * cu, b * Math.cosh(v) * su, c * Math.sinh(v)]
    case 'hyperboloid2':
      // x²/a²−y²/b²−z²/c²=1 的上片: 沿 x 轴张开
      return [a * Math.cosh(v), b * Math.sinh(v) * cu, c * Math.sinh(v) * su]
    case 'paraboloid':
      return [a * v * cu, b * v * su, v * v]
    case 'saddle':
      return [a * (v * cu), b * (v * su), (v * cu) ** 2 - (v * su) ** 2]
    case 'cone':
      return [a * v * cu, b * v * su, c * v]
  }
}

/**
 * 隐式方程残差。每种曲面有各自的标准形，参数化的点代进去应为 0。
 * 这是「参数化没抄错」的硬判据。
 */
export function implicitResidual(
  kind: QuadricKind, p: Vec3, a = 1, b = 1, c = 1,
): number {
  const [x, y, z] = p
  const X = (x / a) ** 2
  const Y = (y / b) ** 2
  const Z = (z / c) ** 2
  switch (kind) {
    case 'ellipsoid': return X + Y + Z - 1
    case 'hyperboloid1': return X + Y - Z - 1
    case 'hyperboloid2': return X - Y - Z - 1
    case 'paraboloid': return (x / a) ** 2 + (y / b) ** 2 - z
    case 'saddle': return (x / a) ** 2 - (y / b) ** 2 - z
    case 'cone': return X + Y - Z
  }
}

/** 三个平方项的符号组合，决定曲面类型（二次型的惯性指数） */
export function signature(kind: QuadricKind): [number, number, number] {
  switch (kind) {
    case 'ellipsoid': return [1, 1, 1]
    case 'hyperboloid1': return [1, 1, -1]
    case 'hyperboloid2': return [1, -1, -1]
    case 'cone': return [1, 1, -1]
    default: return [1, -1, 0]
  }
}

export function infoOf(kind: QuadricKind): QuadricInfo {
  return QUADRIC_INFO.find((q) => q.kind === kind) ?? QUADRIC_INFO[0]
}
