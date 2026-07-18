/**
 * 霍普夫纤维化核心算法（纯函数，便于测试）
 *
 * 霍普夫映射 h: S3 -> S2 把三维球面上的每个点映到二维球面上一点，
 * 而 S2 上一个点的原像（纤维）是 S3 中的一整个圆。逆霍普夫映射把这个
 * 圆参数化到 4D，再用球极投影降到 3D，即可在空间中看到互相环绕的圆。
 */

export type Vec3 = [number, number, number]
export type Vec4 = [number, number, number, number]

export interface BasePoint {
  theta: number // S2 极角（从北极量起）
  phi: number   // S2 方位角
  color: string
}

/** 霍普夫映射 S3 -> S2：(z1,z2) 视作两个复数，返回 S2 上单位向量 */
export function hopfMap(p: Vec4): Vec3 {
  const [a, b, c, d] = p // z1 = a+bi, z2 = c+di
  // x+iy = 2 z1 * conj(z2)
  const x = 2 * (a * c + b * d)
  const y = 2 * (b * c - a * d)
  const z = a * a + b * b - (c * c + d * d)
  return [x, y, z]
}

/** S2 上由 (theta,phi) 给出的单位点 */
export function s2Point(theta: number, phi: number): Vec3 {
  return [
    Math.sin(theta) * Math.cos(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(theta),
  ]
}

/**
 * 逆霍普夫映射：S2 上一点 (theta,phi) 的纤维圆，参数 psi 采样 steps 个 4D 点。
 * z1 = cos(theta/2) e^{i psi}, z2 = sin(theta/2) e^{i(psi - phi)}，
 * 恒在 S3 上，且 hopfMap 结果恒为该 base 点。
 */
export function inverseHopfCircle(theta: number, phi: number, steps: number): Vec4[] {
  const ca = Math.cos(theta / 2)
  const sa = Math.sin(theta / 2)
  const pts: Vec4[] = []
  for (let i = 0; i <= steps; i++) {
    const psi = (i / steps) * 2 * Math.PI
    pts.push([
      ca * Math.cos(psi),
      ca * Math.sin(psi),
      sa * Math.cos(psi - phi),
      sa * Math.sin(psi - phi),
    ])
  }
  return pts
}

/** 球极投影 S3 -> R3，从北极 (0,0,0,1) 投影 */
export function stereographic(p: Vec4): Vec3 {
  const [x, y, z, w] = p
  const denom = 1 - w
  const k = 1 / (Math.abs(denom) < 1e-6 ? 1e-6 : denom)
  return [x * k, y * k, z * k]
}

/** 纤维：base 点 -> 投影到 3D 的圆点序列 */
export function hopfFiber(base: BasePoint, steps: number): Vec3[] {
  return inverseHopfCircle(base.theta, base.phi, steps).map(stereographic)
}

const PALETTE = [
  '#f87171', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa', '#ec4899',
]

/** 同一纬度圈上均匀分布的 base 点，其纤维互相环绕（维拉索圆） */
export const BASE_POINTS: BasePoint[] = Array.from({ length: 6 }, (_, i) => ({
  theta: Math.PI / 3,
  phi: (i / 6) * 2 * Math.PI,
  color: PALETTE[i % PALETTE.length],
}))

export const FIBER_COUNTS = [2, 4, 6]
