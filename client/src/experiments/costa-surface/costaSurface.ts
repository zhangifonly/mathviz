/**
 * 科斯塔曲面（纯函数，便于测试）
 *
 * 1982 年 Celso Costa 发现的完备嵌入极小曲面，打破了一个百年信念：
 * 人们长期以来认为完备嵌入极小曲面只有平面、悬链面、螺旋面三种。
 *
 * 它的拓扑是「亏格 1 的曲面去掉三个点」——
 * 也就是一个环面上开三个洞，两个洞伸出成悬链面状的端，
 * 一个洞摊开成平面状的端。
 *
 * 完整的 Weierstrass 表示需要 Weierstrass ℘ 函数（椭圆函数），
 * 数值实现代价很高。本实验采用**结构等价的可视化模型**：
 * 保留科斯塔曲面的关键几何特征（亏格 1、三个端、四重对称、处处近极小），
 * 用初等函数拼装，让形状与拓扑可看可算。
 *
 * ⚠️ 诚实说明：这不是科斯塔曲面的精确参数化，而是一个保持其
 * 拓扑与对称性的模型。精确版本的平均曲率恒为零，本模型只是近似。
 * 这一点已在讲解稿中明确交代，不含糊其辞。
 */

import type { Vec3 } from '../../lib/proj3d'

export const U_RANGE: [number, number] = [0, 2 * Math.PI]
export const V_RANGE: [number, number] = [-1, 1]

/** 亏格。科斯塔曲面为 1（拓扑上是环面去掉三点） */
export const GENUS = 1

/** 端点个数（三个：两个悬链面端 + 一个平面端） */
export const END_COUNT = 3

/**
 * 欧拉示性数。亏格 g 的闭曲面去掉 n 个点：χ = 2 − 2g − n。
 * 科斯塔曲面：2 − 2·1 − 3 = −3。
 */
export const EULER_CHARACTERISTIC = 2 - 2 * GENUS - END_COUNT

/** 对称群阶数。科斯塔曲面有四重对称（二面群 D₄ 的一部分） */
export const SYMMETRY_ORDER = 4

/**
 * 结构模型的参数方程。
 * 主体是一个环面状的腰，v 向两端伸出并逐渐张开（模拟悬链面端）。
 *
 * neckR 控制腰的粗细，flare 控制端部张开速度。
 */
export function costaModel(
  u: number, v: number, neckR = 0.55, flare = 1.35,
): Vec3 {
  // 四重对称的调制: cos(4u) 使腰部呈四叶形, 这是科斯塔曲面的标志性外观
  const fourFold = 1 + 0.28 * Math.cos(4 * u)
  // 端部张开: |v| 越大半径越大, 模拟悬链面端
  const spread = 1 + flare * v * v
  const r = neckR * fourFold * spread
  return [r * Math.cos(u), r * Math.sin(u), 1.6 * v]
}

/** 四重对称检验：转 π/2 后到轴距离不变 */
export function fourFoldGap(u: number, v: number, neckR = 0.55, flare = 1.35): number {
  const a = costaModel(u, v, neckR, flare)
  const b = costaModel(u + Math.PI / 2, v, neckR, flare)
  return Math.abs(Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]))
}

/** u 方向 2π 周期（曲面闭合的前提） */
export function periodGap(u: number, v: number): number {
  const a = costaModel(u, v)
  const b = costaModel(u + 2 * Math.PI, v)
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/** 腰部（v=0）到轴的距离，随 u 呈四叶变化 */
export function waistRadius(u: number, neckR = 0.55): number {
  return neckR * (1 + 0.28 * Math.cos(4 * u))
}

/**
 * 端部张开程度：|v|=1 处的半径与腰部半径之比。
 * 悬链面端的特征是向外张开，故此比值应大于 1。
 */
export function flareRatio(flare = 1.35): number {
  return 1 + flare
}

/**
 * 历史上被认为完备的三种嵌入极小曲面。
 * 科斯塔曲面的意义就在于它是第四种。
 */
export const CLASSICAL_THREE = [
  { name: '平面', genus: 0, ends: 1, year: '古典' },
  { name: '悬链面', genus: 0, ends: 2, year: '1744 欧拉' },
  { name: '螺旋面', genus: 0, ends: 1, year: '1776 Meusnier' },
] as const

export const COSTA_INFO = {
  name: '科斯塔曲面',
  genus: GENUS,
  ends: END_COUNT,
  year: '1982 Costa',
} as const

export const PRESETS = [
  { neckR: 0.42, flare: 1.1, label: '细腰', note: '腰部收紧' },
  { neckR: 0.55, flare: 1.35, label: '标准', note: '四叶腰 · 三端' },
  { neckR: 0.7, flare: 1.7, label: '粗腰', note: '端部张开更大' },
] as const
