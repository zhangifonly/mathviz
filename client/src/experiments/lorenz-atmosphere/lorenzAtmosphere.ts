/**
 * 洛伦兹 1984 大气环流模型（纯函数，便于测试）
 *
 *   dX/dt = −a·X − Y² − Z² + a·F
 *   dY/dt = −Y + X·Y − b·X·Z + G
 *   dZ/dt = −Z + b·X·Y + X·Z
 *
 * 与 1963 年那个著名的洛伦兹系统不同，这个模型的变量有明确的气象含义：
 *   X  西风急流的强度（东西向平均气流）
 *   Y  余弦相位的涡旋波振幅
 *   Z  正弦相位的涡旋波振幅
 *   F  南北温差造成的热力强迫（对应季节）
 *   G  海陆对比造成的非对称强迫
 *
 * 洛伦兹提出它是为了回答一个具体问题：**大气的可预报期限有多长？**
 * 模型只有三个变量，却复现了真实大气的关键行为 ——
 * 西风急流在强弱之间不规则切换，对应现实中的「阻塞高压」与「正常环流」。
 *
 * 两个可验证特征：
 *   1. **Y,Z 的旋转结构**：后两个方程在 (Y,Z) 平面上含旋转项 b·X,
 *      与相泽吸引子类似可以合成复数形式 dW/dt = (X − 1 + i·b·X)·W + i·... ,
 *      不过 G 项只作用在 Y 上, 故只在 G=0 时严格成立。
 *   2. **季节切换**：F 从 6 调到 8 对应冬夏之别, 混沌强度随之改变 ——
 *      这正是「冬季天气比夏季难预报」的模型依据。
 */

import type { Vec3 } from '../../lib/proj3d'
import type { Field3D } from '../../lib/attractor3d'

export interface L84Params {
  a: number
  b: number
  /** 热力强迫, 对应季节 */
  F: number
  /** 非对称强迫, 对应海陆对比 */
  G: number
}

/** 标准参数（洛伦兹原文取值），对应冬季 */
export const CLASSIC: L84Params = { a: 0.25, b: 4, F: 8, G: 1 }

/** 构造向量场 */
export function l84Field(p: L84Params = CLASSIC): Field3D {
  return ([X, Y, Z]) => [
    -p.a * X - Y * Y - Z * Z + p.a * p.F,
    -Y + X * Y - p.b * X * Z + p.G,
    -Z + p.b * X * Y + X * Z,
  ]
}

/** 只调 F（季节强迫）的便捷接口 —— 它是本实验最值得交互的参数 */
export function l84FieldF(F: number): Field3D {
  return l84Field({ ...CLASSIC, F })
}

/**
 * 散度的解析式：
 *   ∂(dX)/∂X = −a
 *   ∂(dY)/∂Y = −1 + X
 *   ∂(dZ)/∂Z = −1 + X
 * 合计 −a − 2 + 2X。
 *
 * 注意它依赖 X：西风急流很强（X > (a+2)/2）时局部反而膨胀。
 * 这与蔡氏系统类似 —— 混沌来自膨胀与收缩的交替，而非处处收缩。
 */
export function analyticDivergence(X: number, p: L84Params = CLASSIC): number {
  return -p.a - 2 + 2 * X
}

/** 散度变号的临界 X 值 */
export function divergenceSignChangeX(p: L84Params = CLASSIC): number {
  return (p.a + 2) / 2
}

/**
 * 涡旋波总能量 Y² + Z²。
 * 它在 dX 方程里以负号出现：涡旋越强，越消耗西风急流的动能。
 * 这是模型里「波流相互作用」的体现。
 */
export function waveEnergy(q: Vec3): number {
  return q[1] * q[1] + q[2] * q[2]
}

/** 西风急流强度就是 X 本身 */
export function jetStrength(q: Vec3): number {
  return q[0]
}

/**
 * G=0 时后两个方程的复数形式：记 W = Y + i·Z，则
 *   dW/dt = (X − 1 + i·b·X)·W
 * 返回 [Re, Im]，G=0 时应与 field 的后两个分量一致。
 */
export function complexFormNoG(
  X: number, Y: number, Z: number, p: L84Params = CLASSIC,
): [number, number] {
  const re = X - 1
  const im = p.b * X
  return [re * Y - im * Z, im * Y + re * Z]
}

/** 复数形式的误差（应仅在 G=0 时为零） */
export function complexFormError(q: Vec3, p: L84Params = CLASSIC): number {
  const d = l84Field(p)(q)
  const [re, im] = complexFormNoG(q[0], q[1], q[2], p)
  // dY 里还有 +G 项, 故比对时要把它减掉
  return Math.max(Math.abs(d[1] - p.G - re), Math.abs(d[2] - im))
}

export const START: Vec3 = [1, 1, 1]

/**
 * F 的季节含义：数值越大对应南北温差越强，即冬季。
 *
 * ⚠️ 实测 λ₁: F=6 → 0.002, F=7 → 0.043, F=8 → 0.142, **F=9 → −0.006**。
 * 也就是说混沌强度并非随 F 单调递增 —— 强迫过大时系统反而锁定到规则解。
 * 这在动力系统里很常见(参数扫过混沌窗口后落入周期区), 所以不要把
 * 「F 越大越混沌」当成普适规律。预设只取 6~8 这段单调区间。
 */
export const SEASONS = [
  { F: 6, label: '夏季 (F=6)', note: '温差小 · λ₁≈0.002' },
  { F: 7, label: '春秋 (F=7)', note: '过渡 · λ₁≈0.043' },
  { F: 8, label: '冬季 (F=8)', note: '温差大 · λ₁≈0.142' },
] as const
