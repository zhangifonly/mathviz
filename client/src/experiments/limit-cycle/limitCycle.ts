/**
 * 范德波尔振子核心算法（纯函数，便于测试）
 *
 * 方程 x'' - mu (1 - x^2) x' + x = 0
 * 令 y = x'，化为一阶系统：
 *   x' = y
 *   y' = mu (1 - x^2) y - x
 * 用四阶龙格库塔（RK4）积分。无论初值在极限环内还是外，
 * 轨线最终都螺旋收敛到同一条孤立闭轨（极限环）。
 */

export interface Point {
  x: number
  y: number
}

/** 系统导数：返回 [dx, dy] */
export function derivative(mu: number, x: number, y: number): [number, number] {
  return [y, mu * (1 - x * x) * y - x]
}

/** 单步 RK4 积分，返回下一状态 */
export function rk4Step(mu: number, x: number, y: number, dt: number): Point {
  const [k1x, k1y] = derivative(mu, x, y)
  const [k2x, k2y] = derivative(mu, x + 0.5 * dt * k1x, y + 0.5 * dt * k1y)
  const [k3x, k3y] = derivative(mu, x + 0.5 * dt * k2x, y + 0.5 * dt * k2y)
  const [k4x, k4y] = derivative(mu, x + dt * k3x, y + dt * k3y)
  return {
    x: x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
    y: y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y),
  }
}

/** 从初值 (x0,y0) 积分 steps 步，返回相平面轨迹点序列 */
export function simulate(
  mu: number,
  x0: number,
  y0: number,
  steps: number,
  dt: number,
): Point[] {
  const path: Point[] = [{ x: x0, y: y0 }]
  let x = x0
  let y = y0
  for (let i = 0; i < steps; i++) {
    const next = rk4Step(mu, x, y, dt)
    x = next.x
    y = next.y
    path.push({ x, y })
  }
  return path
}

/** 轨迹后半段的最大半径，近似极限环幅度，用于验证收敛 */
export function orbitRadius(path: Point[]): number {
  let max = 0
  const start = Math.floor(path.length / 2)
  for (let i = start; i < path.length; i++) {
    const r = Math.hypot(path[i].x, path[i].y)
    if (r > max) max = r
  }
  return max
}

export const MU_VALUES = [0.5, 1, 2, 3]
