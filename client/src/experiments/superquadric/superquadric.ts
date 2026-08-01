/**
 * 超二次曲面（纯函数，便于测试）
 *
 * 把球面参数方程里的正弦余弦各自取一个可调指数：
 *
 *   x = a·sgn(cos v)|cos v|^n1 · sgn(cos u)|cos u|^n2
 *   y = b·sgn(cos v)|cos v|^n1 · sgn(sin u)|sin u|^n2
 *   z = c·sgn(sin v)|sin v|^n1
 *
 * 两个形状指数就能生成一整族立体：
 *   n1 = n2 = 1     标准椭球
 *   n1 = n2 → 0     立方体（指数越小越方）
 *   n1 = n2 = 2     双锥（八面体）
 *   n1 = n2 > 2     星形（面向内凹）
 *
 * 隐式方程：|x/a|^(2/n2) + |y/b|^(2/n2) 的 (n2/n1) 次方 + |z/c|^(2/n1) = 1
 *
 * Alan Barr 1981 年引入计算机图形学，是几何建模最省参数的基本砖块之一：
 * 两个数字覆盖从方到圆到星的连续谱，远比逐个建模高效。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [-Math.PI, Math.PI]
export const V_RANGE: [number, number] = [-Math.PI / 2, Math.PI / 2]

/** 带符号的幂：保留原符号，对绝对值取幂。避免负数开分数次幂得到 NaN */
export function signedPow(x: number, p: number): number {
  const a = Math.abs(x)
  // a=0 时任意正指数都给 0; 指数为 0 时约定给 0 避免 0^0 的歧义传播
  if (a < 1e-12) return 0
  return Math.sign(x) * Math.pow(a, p)
}

/** 超二次曲面参数方程。n1 控制纵向, n2 控制横向 */
export function superquadric(
  u: number, v: number, n1 = 1, n2 = 1, a = 1, b = 1, c = 1,
): Vec3 {
  const cv = signedPow(Math.cos(v), n1)
  const sv = signedPow(Math.sin(v), n1)
  return [
    a * cv * signedPow(Math.cos(u), n2),
    b * cv * signedPow(Math.sin(u), n2),
    c * sv,
  ]
}

/**
 * 隐式方程残差。参数化的点代进去应为 0。
 * 这是「参数化与隐式定义一致」的硬判据。
 */
export function implicitResidual(
  p: Vec3, n1 = 1, n2 = 1, a = 1, b = 1, c = 1,
): number {
  const [x, y, z] = p
  const t = Math.pow(Math.abs(x / a), 2 / n2) + Math.pow(Math.abs(y / b), 2 / n2)
  return Math.pow(t, n2 / n1) + Math.pow(Math.abs(z / c), 2 / n1) - 1
}

/**
 * 超椭球体积的解析式（Barr 1981）：
 *   V = 2·a·b·c·n1·n2·B(n1/2+1, n1)·B(n2/2, n2/2)
 * 这里只给出 n1=n2=1 的球体情形与数值积分对照，避免引入 Beta 函数依赖。
 */
export function volumeNumeric(
  n1 = 1, n2 = 1, a = 1, b = 1, c = 1, steps = 120,
): number {
  // 用参数化做散度定理式的体积积分较繁, 这里直接对隐式区域做蒙特卡洛式网格计数
  let inside = 0
  const total = steps * steps * steps
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      for (let k = 0; k < steps; k++) {
        const x = a * (-1 + (2 * (i + 0.5)) / steps)
        const y = b * (-1 + (2 * (j + 0.5)) / steps)
        const z = c * (-1 + (2 * (k + 0.5)) / steps)
        if (implicitResidual([x, y, z], n1, n2, a, b, c) <= 0) inside++
      }
    }
  }
  return (inside / total) * 8 * a * b * c
}

export interface ShapePreset {
  n1: number
  n2: number
  label: string
  note: string
}

export const PRESETS: ShapePreset[] = [
  { n1: 0.2, n2: 0.2, label: '立方体', note: '指数趋于 0' },
  { n1: 0.5, n2: 0.5, label: '圆角方块', note: '介于方与圆' },
  { n1: 1, n2: 1, label: '椭球', note: '标准球面' },
  { n1: 2, n2: 2, label: '八面体', note: '双锥' },
  { n1: 3.5, n2: 3.5, label: '星形', note: '面向内凹' },
  { n1: 1, n2: 0.3, label: '方柱', note: '纵圆横方' },
]
