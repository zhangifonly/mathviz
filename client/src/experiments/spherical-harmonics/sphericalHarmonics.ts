/**
 * 球谐函数（纯函数，便于测试）
 *
 * 球面上的「振动模态」，是拉普拉斯方程在球坐标下分离变量的角向解：
 *
 *   Y_l^m(θ,φ) = N · P_l^m(cos θ) · e^(imφ)
 *
 * 其中 P_l^m 是连带勒让德函数，l 是角量子数（决定节线总数），
 * m 是磁量子数（决定绕轴的周期）。
 *
 * 应用极广：原子轨道（s/p/d/f 就是 l=0/1/2/3）、地球重力场与地磁场展开、
 * 宇宙微波背景辐射的功率谱、计算机图形学的环境光照压缩。
 *
 * 三条可验证性质：
 *   1. **正交归一**：不同 (l,m) 在球面上积分为 0，同一 (l,m) 积分为 1
 *   2. **节线数**：实球谐 Y_l^m 有 l−|m| 条纬向节线与 |m| 条经向节线
 *   3. **拉普拉斯特征值**：ΔY_l^m = −l(l+1)·Y_l^m
 */

import type { Vec3 } from '../../lib/proj3d'

/** 阶乘（l 不会太大，直接循环） */
function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

/**
 * 连带勒让德函数 P_l^m(x)，用标准递推：
 *   P_m^m = (−1)^m (2m−1)!! (1−x²)^(m/2)
 *   P_{m+1}^m = x(2m+1) P_m^m
 *   (l−m) P_l^m = x(2l−1) P_{l−1}^m − (l+m−1) P_{l−2}^m
 */
export function legendreP(l: number, m: number, x: number): number {
  const am = Math.abs(m)
  if (am > l) return 0

  // P_m^m
  let pmm = 1
  if (am > 0) {
    const somx2 = Math.sqrt(Math.max(0, 1 - x * x))
    let fact = 1
    for (let i = 1; i <= am; i++) {
      pmm *= -fact * somx2
      fact += 2
    }
  }
  if (l === am) return pmm

  // P_{m+1}^m
  let pmmp1 = x * (2 * am + 1) * pmm
  if (l === am + 1) return pmmp1

  // 向上递推到 P_l^m
  let pll = 0
  for (let ll = am + 2; ll <= l; ll++) {
    pll = (x * (2 * ll - 1) * pmmp1 - (ll + am - 1) * pmm) / (ll - am)
    pmm = pmmp1
    pmmp1 = pll
  }
  return pll
}

/** 归一化系数 sqrt((2l+1)(l−|m|)! / (4π(l+|m|)!)) */
export function normalization(l: number, m: number): number {
  const am = Math.abs(m)
  return Math.sqrt(
    ((2 * l + 1) * factorial(l - am)) / (4 * Math.PI * factorial(l + am)),
  )
}

/**
 * 实球谐函数。m>0 取 cos(mφ) 分量，m<0 取 sin(|m|φ) 分量，
 * 并乘 √2 保持归一化。theta 为极角(0..π)，phi 为方位角(0..2π)。
 */
export function realSphericalHarmonic(
  l: number, m: number, theta: number, phi: number,
): number {
  const am = Math.abs(m)
  const base = normalization(l, m) * legendreP(l, am, Math.cos(theta))
  if (m === 0) return base
  const factor = Math.SQRT2 * (m > 0 ? Math.cos(am * phi) : Math.sin(am * phi))
  return base * factor
}

/**
 * 球谐曲面：以 |Y| 为半径画球面变形。
 * 这是可视化球谐最常见的方式，正负号用颜色区分。
 */
export function harmonicSurface(
  l: number, m: number, theta: number, phi: number, scale = 1,
): Vec3 {
  const y = realSphericalHarmonic(l, m, theta, phi)
  const r = scale * Math.abs(y)
  return [
    r * Math.sin(theta) * Math.cos(phi),
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(theta),
  ]
}

export const THETA_RANGE: [number, number] = [0.001, Math.PI - 0.001]
export const PHI_RANGE: [number, number] = [0, 2 * Math.PI]

/** 拉普拉斯特征值 −l(l+1) */
export function laplaceEigenvalue(l: number): number {
  return -l * (l + 1)
}

/** 节线总数：纬向 l−|m| 条 + 经向 |m| 条 */
export function nodalLines(l: number, m: number): { latitudinal: number; longitudinal: number } {
  const am = Math.abs(m)
  return { latitudinal: l - am, longitudinal: am }
}

/** 球面上两个球谐的内积（数值积分），用于验证正交归一性 */
export function innerProduct(
  l1: number, m1: number, l2: number, m2: number, n = 120,
): number {
  let s = 0
  const dTheta = Math.PI / n
  const dPhi = (2 * Math.PI) / (2 * n)
  for (let i = 0; i < n; i++) {
    const theta = dTheta * (i + 0.5)
    const sinT = Math.sin(theta)
    for (let j = 0; j < 2 * n; j++) {
      const phi = dPhi * (j + 0.5)
      s += realSphericalHarmonic(l1, m1, theta, phi)
        * realSphericalHarmonic(l2, m2, theta, phi)
        * sinT * dTheta * dPhi
    }
  }
  return s
}

export const ORBITALS = [
  { l: 0, m: 0, label: 's 轨道', note: 'l=0 · 球对称' },
  { l: 1, m: 0, label: 'p_z 轨道', note: 'l=1 · 一条纬向节线' },
  { l: 2, m: 0, label: 'd_z² 轨道', note: 'l=2 · 两条纬向节线' },
  { l: 2, m: 2, label: 'd_x²−y² 轨道', note: 'l=2 m=2 · 四叶' },
  { l: 3, m: 0, label: 'f 轨道', note: 'l=3 · 三条纬向节线' },
  { l: 4, m: 3, label: 'l=4 m=3', note: '高阶模态' },
] as const
