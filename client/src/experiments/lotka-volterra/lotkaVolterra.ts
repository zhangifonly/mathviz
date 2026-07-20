/**
 * 洛特卡-沃尔泰拉 捕食者-猎物模型（纯函数，便于测试）
 *
 * 方程组：
 *   dx/dt = alpha * x - beta * x * y   （猎物：兔子）
 *   dy/dt = delta * x * y - gamma * y  （捕食者：狐狸）
 * 用四阶龙格-库塔法（RK4）数值积分，得到随时间演化的种群曲线。
 */

export interface LVParams {
  alpha: number // 猎物自然增长率
  beta: number // 被捕食率
  delta: number // 捕食者因进食的增长率
  gamma: number // 捕食者自然死亡率
}

export interface LVPoint {
  t: number
  prey: number // 猎物数量 x
  pred: number // 捕食者数量 y
}

/** 默认参数：经典狐狸-兔子设定 */
export const PARAMS: LVParams = {
  alpha: 1.1,
  beta: 0.4,
  delta: 0.1,
  gamma: 0.4,
}

/** 可选初始猎物数量预设（供交互选择） */
export const PREY_STARTS = [6, 10, 15]

/** 计算导数 [dx/dt, dy/dt] */
export function derivatives(
  p: LVParams,
  x: number,
  y: number,
): [number, number] {
  const dx = p.alpha * x - p.beta * x * y
  const dy = p.delta * x * y - p.gamma * y
  return [dx, dy]
}

/**
 * RK4 单步积分，从 (x,y) 前进 dt。
 */
export function rk4Step(
  p: LVParams,
  x: number,
  y: number,
  dt: number,
): [number, number] {
  const [k1x, k1y] = derivatives(p, x, y)
  const [k2x, k2y] = derivatives(p, x + (dt / 2) * k1x, y + (dt / 2) * k1y)
  const [k3x, k3y] = derivatives(p, x + (dt / 2) * k2x, y + (dt / 2) * k2y)
  const [k4x, k4y] = derivatives(p, x + dt * k3x, y + dt * k3y)
  const nx = x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x)
  const ny = y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y)
  return [nx, ny]
}

/**
 * 模拟整个时间序列。
 * @returns 长度为 steps+1 的时间序列（含初始点）
 */
export function simulate(
  p: LVParams,
  x0: number,
  y0: number,
  steps: number,
  dt: number,
): LVPoint[] {
  const out: LVPoint[] = [{ t: 0, prey: x0, pred: y0 }]
  let x = x0
  let y = y0
  for (let i = 1; i <= steps; i++) {
    ;[x, y] = rk4Step(p, x, y, dt)
    // 种群不为负
    x = Math.max(0, x)
    y = Math.max(0, y)
    out.push({ t: i * dt, prey: x, pred: y })
  }
  return out
}

/**
 * 守恒量 V = delta*x - gamma*ln(x) + beta*y - alpha*ln(y)
 * LV 系统沿轨迹守恒，可用来验证相平面轨道闭合。
 */
export function conserved(p: LVParams, x: number, y: number): number {
  return p.delta * x - p.gamma * Math.log(x) + p.beta * y - p.alpha * Math.log(y)
}

/** 非零不动点（共存平衡点） */
export function equilibrium(p: LVParams): [number, number] {
  return [p.gamma / p.delta, p.alpha / p.beta]
}
