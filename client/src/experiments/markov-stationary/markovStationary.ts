/**
 * 马氏链稳态分布核心算法（纯函数，便于测试）
 *
 * 给定一个行随机的转移矩阵 P（每行之和为 1），
 * 从任意初始分布出发反复作用 P，分布会收敛到唯一的稳态分布。
 * 稳态 pi 满足 pi = pi P，即转移矩阵特征值 1 对应的左特征向量。
 * 这里用 3 状态天气模型：晴(0) / 阴(1) / 雨(2)。
 */

export type Vector = number[]
export type Matrix = number[][]

/** 3 状态天气模型的转移矩阵（行随机：P[i][j]=从状态 i 转到 j 的概率） */
export const TRANSITION_MATRIX: Matrix = [
  [0.7, 0.2, 0.1], // 晴 -> 晴/阴/雨
  [0.3, 0.4, 0.3], // 阴 -> 晴/阴/雨
  [0.2, 0.45, 0.35], // 雨 -> 晴/阴/雨
]

export const STATE_NAMES = ['晴', '阴', '雨']

/** 几组不同的初始分布，用于展示殊途同归 */
export const INITIAL_DISTS: Vector[] = [
  [1, 0, 0], // 从晴天出发
  [0, 0, 1], // 从雨天出发
  [1 / 3, 1 / 3, 1 / 3], // 均匀出发
]

/** 分布左乘转移矩阵一步：next[j] = sum_i dist[i] * P[i][j] */
export function step(P: Matrix, dist: Vector): Vector {
  const n = dist.length
  const next: Vector = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      next[j] += dist[i] * P[i][j]
    }
  }
  return next
}

/** 反复作用 steps 次，返回每一步的分布（含初始，共 steps+1 个） */
export function iterate(P: Matrix, dist: Vector, steps: number): Vector[] {
  const history: Vector[] = [dist.slice()]
  let cur = dist.slice()
  for (let k = 0; k < steps; k++) {
    cur = step(P, cur)
    history.push(cur)
  }
  return history
}

/** 用幂迭代求稳态分布（收敛到 pi = pi P） */
export function stationary(P: Matrix, iters = 200): Vector {
  const n = P.length
  let dist: Vector = new Array(n).fill(1 / n)
  for (let k = 0; k < iters; k++) {
    dist = step(P, dist)
  }
  return dist
}
