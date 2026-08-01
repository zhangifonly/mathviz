/**
 * 蔡氏电路吸引子（纯函数，便于测试）
 *
 * 蔡少棠 1983 年设计的电路：两个电容、一个电感、一个线性电阻，
 * 外加一个**分段线性的非线性电阻**（蔡氏二极管）。它是第一个
 * 在物理硬件上被确认的混沌系统 —— 之前的混沌都是数值模拟。
 *
 * 无量纲化后的方程：
 *   dx/dt = α·(y − x − h(x))
 *   dy/dt = x − y + z
 *   dz/dt = −β·y
 * 其中 h(x) = m₁·x + (m₀−m₁)/2·(|x+1| − |x−1|) 是分段线性函数。
 *
 * 双涡卷结构：两个不稳定平衡点各自带一个涡卷，轨道在两者间不规则跳转。
 * 这个「跳转」正是混沌的来源。
 *
 * ⚠️ 值得注意的是它**不是处处耗散**的。散度 div = −α(1+h′(x)) − 1，
 * 内段 h′=m₀=−1.143 使 div = +1.23（相空间体积膨胀），
 * 外段 h′=m₁=−0.714 使 div = −5.46（收缩）。
 * 内段推开轨道、外段拉回来，两者交替正是双涡卷的形成机制 ——
 * 若处处收缩，轨道会塌到一个点上，根本不会有混沌。
 *
 * 历史意义：混沌不再是数学玩具 —— 一块面包板就能做出来。
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Field3D } from '../../lib/attractor3d'

export interface ChuaParams {
  alpha: number
  beta: number
  /** 蔡氏二极管的两段斜率 */
  m0: number
  m1: number
}

/** 经典参数，给出双涡卷吸引子 */
export const CLASSIC: ChuaParams = { alpha: 15.6, beta: 28, m0: -1.143, m1: -0.714 }

/** 蔡氏二极管的分段线性特征函数 h(x) */
export function chuaDiode(x: number, m0: number, m1: number): number {
  return m1 * x + ((m0 - m1) / 2) * (Math.abs(x + 1) - Math.abs(x - 1))
}

/** 构造向量场 */
export function chuaField(p: ChuaParams = CLASSIC): Field3D {
  return ([x, y, z]) => [
    p.alpha * (y - x - chuaDiode(x, p.m0, p.m1)),
    x - y + z,
    -p.beta * y,
  ]
}

/**
 * 平衡点。解 dx=dy=dz=0：
 *   z = 0 由 dz=0 得 y=0；代入 dy=0 得 x = -z = 0... 需分段讨论。
 *
 * 在 |x|<1 的内段与 |x|>1 的外段各有解：
 *   内段：原点 (0,0,0)
 *   外段：x = ±(m0−m1)/(1+m1)，y=0，z=−x
 */
export function equilibria(p: ChuaParams = CLASSIC): Vec3[] {
  const k = (p.m0 - p.m1) / (1 + p.m1)
  return [[0, 0, 0], [k, 0, -k], [-k, 0, k]]
}

/** 平衡点处的残差，用于验证 equilibria 算得对 */
export function equilibriumResidual(q: Vec3, p: ChuaParams = CLASSIC): number {
  const d = chuaField(p)(q)
  return Math.hypot(d[0], d[1], d[2])
}

/** 分段线性的三段斜率：外段 m1，内段 m0，外段 m1 */
export function diodeSlope(x: number, p: ChuaParams = CLASSIC, h = 1e-7): number {
  return (chuaDiode(x + h, p.m0, p.m1) - chuaDiode(x - h, p.m0, p.m1)) / (2 * h)
}

export const START: Vec3 = [0.7, 0, 0]

export const PRESETS = [
  { alpha: 15.6, beta: 28, label: '经典双涡卷', note: 'α=15.6 β=28' },
  { alpha: 10, beta: 28, label: '单涡卷', note: 'α 降低' },
  { alpha: 18, beta: 33, label: '强混沌', note: 'α,β 提高' },
] as const

/** 由预设构造完整参数 */
export function paramsOf(alpha: number, beta: number): ChuaParams {
  return { ...CLASSIC, alpha, beta }
}
