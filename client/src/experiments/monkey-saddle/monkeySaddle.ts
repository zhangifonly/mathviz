/**
 * 猴鞍面（纯函数，便于测试）
 *
 *   z = x³ − 3xy²   （等价于极坐标下 z = r³·cos 3θ）
 *
 * 名字的来历：普通鞍面只有两个下坡（够放两条腿），这张面有三个下坡
 * 三个上坡交替排列，所以还能搁下猴子的尾巴。
 *
 * 两条关键性质：
 *
 * 1. **原点是退化临界点**：一阶偏导全为零，但 Hesse 矩阵也全为零，
 *    二阶判别法完全失效。必须看三阶项才知道它是什么 —— 这是
 *    「二阶判别法有局限」最标准的教学例子。
 *
 * 2. **三重对称**：极坐标下 z = r³cos3θ，转 120° 完全复原。
 *    θ 每增加 60° 上下坡交替一次，一圈六次。
 *
 * 推广：z = Re((x+iy)^n) 给出 n 重鞍面，n=2 是普通鞍面，n=3 就是猴鞍面。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [-1.2, 1.2]
export const V_RANGE: [number, number] = [-1.2, 1.2]

/** 直角坐标形式 z = x³ − 3xy²。order 为鞍面重数(3 即猴鞍) */
export function monkeySaddle(x: number, y: number, order = 3): Vec3 {
  return [x, y, realPart(x, y, order)]
}

/**
 * Re((x+iy)^n)。n=2 给 x²−y²(普通鞍面), n=3 给 x³−3xy²(猴鞍面)。
 * 用递推算复数幂的实部, 避免引入复数类型。
 */
export function realPart(x: number, y: number, n: number): number {
  let re = 1
  let im = 0
  for (let k = 0; k < n; k++) {
    const nre = re * x - im * y
    const nim = re * y + im * x
    re = nre
    im = nim
  }
  return re
}

/** 极坐标形式: z = r^n · cos(nθ)。与直角坐标形式应完全一致 */
export function polarForm(r: number, theta: number, order = 3): number {
  return Math.pow(r, order) * Math.cos(order * theta)
}

/** 一阶偏导 ∂z/∂x = 3x² − 3y², ∂z/∂y = −6xy（order=3） */
export function gradient(x: number, y: number, order = 3, h = 1e-6): [number, number] {
  const f = (a: number, b: number) => realPart(a, b, order)
  return [
    (f(x + h, y) - f(x - h, y)) / (2 * h),
    (f(x, y + h) - f(x, y - h)) / (2 * h),
  ]
}

/** Hesse 矩阵的三个分量 [zxx, zxy, zyy] */
export function hessian(
  x: number, y: number, order = 3, h = 1e-4,
): [number, number, number] {
  const f = (a: number, b: number) => realPart(a, b, order)
  const zxx = (f(x + h, y) - 2 * f(x, y) + f(x - h, y)) / (h * h)
  const zyy = (f(x, y + h) - 2 * f(x, y) + f(x, y - h)) / (h * h)
  const zxy = (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h))
    / (4 * h * h)
  return [zxx, zxy, zyy]
}

/**
 * Hesse 行列式。原点处为 0 说明二阶判别法失效（退化临界点）。
 * 普通鞍面(order=2)在原点 Hesse 行列式为 −4，判别法有效。
 */
export function hessianDet(x: number, y: number, order = 3): number {
  const [zxx, zxy, zyy] = hessian(x, y, order)
  return zxx * zyy - zxy * zxy
}

/**
 * 沿单位圆走一圈的高度值。order 重鞍面应有 order 个正峰与 order 个负谷，
 * 即符号变化 2·order 次。返回符号变化次数。
 */
export function signChanges(order = 3, steps = 720): number {
  let changes = 0
  let prev = Math.sign(polarForm(1, 0, order))
  for (let i = 1; i <= steps; i++) {
    const s = Math.sign(polarForm(1, (2 * Math.PI * i) / steps, order))
    if (s !== 0 && s !== prev) {
      changes++
      prev = s
    }
  }
  return changes
}

/** 高斯曲率。猴鞍面除原点外处处为负 */
export function gaussianCurvature(x: number, y: number, order = 3): number {
  const [zx, zy] = gradient(x, y, order)
  const [zxx, zxy, zyy] = hessian(x, y, order)
  const den = (1 + zx * zx + zy * zy) ** 2
  return (zxx * zyy - zxy * zxy) / den
}

export const PRESETS = [
  { order: 2, label: '普通鞍面', note: '两上两下 · 二阶判别有效' },
  { order: 3, label: '猴鞍面', note: '三上三下 · 判别法失效' },
  { order: 4, label: '四重鞍面', note: '四上四下' },
] as const
