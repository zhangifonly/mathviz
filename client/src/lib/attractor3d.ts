/**
 * 三维混沌吸引子的共享内核（纯函数，便于测试）
 *
 * 六个吸引子实验共用这套积分与诊断工具，各自只需提供方程 f(x,y,z) → 导数。
 * 不该每个实验各写一份 RK4 与李雅普诺夫估计。
 *
 * 提供三样东西：
 *   1. RK4 定步长积分（比欧拉法稳得多，混沌系统对精度敏感）
 *   2. 轨道生成（含丢弃暂态）
 *   3. 混沌诊断：最大李雅普诺夫指数估计、包围盒、轨道有界性检验
 *
 * 判断「是不是混沌」不能靠画面看着乱 —— 最大李雅普诺夫指数为正才是判据。
 */

import type { Vec3 } from './proj3d'

/** 向量场：给定位置返回导数 */
export type Field3D = (p: Vec3) => Vec3

/** RK4 单步。dt 过大会让混沌系统发散, 一般取 0.001~0.01 */
export function rk4Step(f: Field3D, p: Vec3, dt: number): Vec3 {
  const k1 = f(p)
  const p2: Vec3 = [p[0] + (dt / 2) * k1[0], p[1] + (dt / 2) * k1[1], p[2] + (dt / 2) * k1[2]]
  const k2 = f(p2)
  const p3: Vec3 = [p[0] + (dt / 2) * k2[0], p[1] + (dt / 2) * k2[1], p[2] + (dt / 2) * k2[2]]
  const k3 = f(p3)
  const p4: Vec3 = [p[0] + dt * k3[0], p[1] + dt * k3[1], p[2] + dt * k3[2]]
  const k4 = f(p4)
  return [
    p[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    p[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    p[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ]
}

export interface OrbitOptions {
  start: Vec3
  dt: number
  steps: number
  /** 丢弃前若干步(暂态), 让轨道先落到吸引子上 */
  skip?: number
}

/** 生成一条轨道 */
export function orbit(f: Field3D, opts: OrbitOptions): Vec3[] {
  const { start, dt, steps, skip = 0 } = opts
  let p = start
  for (let i = 0; i < skip; i++) {
    p = rk4Step(f, p, dt)
    if (!isFinite3(p)) return []
  }
  const out: Vec3[] = []
  for (let i = 0; i < steps; i++) {
    p = rk4Step(f, p, dt)
    if (!isFinite3(p)) break
    out.push(p)
  }
  return out
}

export function isFinite3(p: Vec3): boolean {
  return Number.isFinite(p[0]) && Number.isFinite(p[1]) && Number.isFinite(p[2])
}

/**
 * 最大李雅普诺夫指数的估计（Benettin 重正交化法）。
 *
 * 取两条初始相距 d₀ 的轨道，同步演化一小段后测量分离量 d₁，
 * 累加 ln(d₁/d₀) 再除以总时间。每步把扰动轨道拉回到 d₀ 距离上，
 * 避免分离量饱和到吸引子尺度。
 *
 * λ > 0 ⟺ 混沌（相邻轨道指数分离）。这是「是不是混沌」的严格判据。
 */
export function lyapunovExponent(
  f: Field3D, start: Vec3, dt = 0.005, steps = 20000, d0 = 1e-8,
): number {
  let p = start
  // 先跑一段暂态
  for (let i = 0; i < 2000; i++) p = rk4Step(f, p, dt)
  if (!isFinite3(p)) return NaN

  let q: Vec3 = [p[0] + d0, p[1], p[2]]
  let sum = 0
  let n = 0
  for (let i = 0; i < steps; i++) {
    p = rk4Step(f, p, dt)
    q = rk4Step(f, q, dt)
    if (!isFinite3(p) || !isFinite3(q)) break
    const d = Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2])
    if (d < 1e-300) continue
    sum += Math.log(d / d0)
    n++
    // 重正交化: 把 q 拉回到距 p 恰好 d0 处, 方向保持
    const k = d0 / d
    q = [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, p[2] + (q[2] - p[2]) * k]
  }
  return n === 0 ? NaN : sum / (n * dt)
}

/** 轨道包围盒的对角长度，用于判断轨道是否有界 */
export function orbitExtent(pts: Vec3[]): number {
  if (pts.length === 0) return 0
  const lo: Vec3 = [Infinity, Infinity, Infinity]
  const hi: Vec3 = [-Infinity, -Infinity, -Infinity]
  for (const p of pts) {
    for (let k = 0; k < 3; k++) {
      if (p[k] < lo[k]) lo[k] = p[k]
      if (p[k] > hi[k]) hi[k] = p[k]
    }
  }
  return Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2])
}

/**
 * 散度 ∇·f。耗散系统的散度为负（相空间体积收缩），
 * 这是「存在吸引子」的必要条件。
 */
export function divergence(f: Field3D, p: Vec3, h = 1e-5): number {
  let s = 0
  for (let k = 0; k < 3; k++) {
    const a: Vec3 = [...p] as Vec3
    const b: Vec3 = [...p] as Vec3
    a[k] -= h
    b[k] += h
    s += (f(b)[k] - f(a)[k]) / (2 * h)
  }
  return s
}
