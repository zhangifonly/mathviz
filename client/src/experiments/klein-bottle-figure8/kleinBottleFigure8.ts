/**
 * 8 字形克莱因瓶（纯函数，便于测试）
 *
 * 克莱因瓶在三维空间中有两种常见浸入：
 *
 *   瓶状浸入   经典形象，瓶口穿过瓶身（mathviz 的 torus-klein 已有）
 *   8 字形浸入 把 8 字形截面沿圆周搬运一圈，途中翻转半圈
 *
 * 8 字形版本的参数方程（u 绕圈，v 走 8 字截面）：
 *   x = (a + cos(u/2)·sin v − sin(u/2)·sin 2v)·cos u
 *   y = (a + cos(u/2)·sin v − sin(u/2)·sin 2v)·sin u
 *   z = sin(u/2)·sin v + cos(u/2)·sin 2v
 *
 * 关键结构：截面形状由 (sin v, sin 2v) 给出，这是一条 8 字曲线（双纽线）。
 * u/2 使得绕行一整圈后截面翻转半圈 —— 与莫比乌斯带同一个机制，
 * 正是这半圈的错位让曲面变成不可定向的。
 *
 * 拓扑不变量：χ = 0（与环面相同），但不可定向 ——
 * 这正是它区别于环面的地方：同样的欧拉示性数，可定向性不同。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [0, 2 * Math.PI]
export const V_RANGE: [number, number] = [0, 2 * Math.PI]

/** 8 字形截面曲线（双纽线形状）。返回截面局部坐标 (s, t) */
export function figure8Section(v: number): [number, number] {
  return [Math.sin(v), Math.sin(2 * v)]
}

/** 8 字形克莱因瓶参数方程。a 控制主半径 */
export function kleinFigure8(u: number, v: number, a = 2): Vec3 {
  const half = u / 2
  const [s, t] = figure8Section(v)
  // 截面在 (法向, 竖直) 平面内旋转 u/2 —— 绕一圈翻半圈
  const radial = a + Math.cos(half) * s - Math.sin(half) * t
  const height = Math.sin(half) * s + Math.cos(half) * t
  return [radial * Math.cos(u), radial * Math.sin(u), height]
}

/**
 * u 方向的闭合性：u 与 u+2π 应映到同一点，但需配合 v 的对应变换。
 *
 * 直接比较 (u,v) 与 (u+2π,v) 会发现不重合 —— 因为截面翻了半圈。
 * 正确的粘合关系是 (u, v) ~ (u+2π, −v)，这正是克莱因瓶的定义性粘合。
 */
export function gluingGap(u: number, v: number, a = 2): number {
  const p = kleinFigure8(u, v, a)
  const q = kleinFigure8(u + 2 * Math.PI, -v, a)
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
}

/** 朴素闭合（不翻转 v）的偏差，用于说明「必须翻转」 */
export function naiveGap(u: number, v: number, a = 2): number {
  const p = kleinFigure8(u, v, a)
  const q = kleinFigure8(u + 2 * Math.PI, v, a)
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])
}

/**
 * 截面翻转角度。绕行 u 时截面转过 u/2，
 * 故 u 走一整圈(2π)时截面只转半圈(π)。
 */
export function sectionRotation(u: number): number {
  return u / 2
}

/** 8 字截面的自交点：v=0 与 v=π 处 (sin v, sin 2v) 都是 (0,0) */
export function sectionSelfIntersections(): number[] {
  return [0, Math.PI]
}

/** 欧拉示性数。克莱因瓶 χ=0，与环面相同 */
export const EULER_CHARACTERISTIC = 0

/** 不可定向 —— 这是它区别于环面的地方 */
export const ORIENTABLE = false

/** 与环面的对比数据，供讲解层展示 */
export const COMPARISON = [
  { name: '环面', euler: 0, orientable: true, note: '双侧曲面' },
  { name: '克莱因瓶', euler: 0, orientable: false, note: '单侧曲面' },
] as const

export const PRESETS = [
  { a: 1.6, label: '紧凑型', note: '主半径小' },
  { a: 2, label: '标准', note: '经典 8 字形' },
  { a: 2.6, label: '舒展型', note: '主半径大' },
] as const
