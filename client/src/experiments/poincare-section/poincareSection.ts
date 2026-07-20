/**
 * 庞加莱截面核心算法（纯函数，便于测试）
 *
 * 对受迫 Duffing 振子做数值积分：
 *   x'' + delta x' + alpha x + beta x^3 = gamma cos(omega t)
 * 化为一阶系统 (x, v)，用四阶龙格库塔(RK4)积分。
 * 每经过一个驱动周期 T = 2*pi/omega，就对相空间频闪采样一个点，
 * 得到庞加莱截面：周期解坍缩成少数几个点，混沌解散成分形点云。
 */

export interface DuffingParams {
  delta: number // 阻尼
  alpha: number // 线性刚度
  beta: number // 非线性刚度
  gamma: number // 驱动幅度
  omega: number // 驱动角频率
  x0: number // 初位置
  v0: number // 初速度
}

export interface PoincarePoint {
  x: number
  v: number
}

/** 相空间导数 (x'=v, v'=...) */
export function deriv(
  x: number,
  v: number,
  t: number,
  p: DuffingParams,
): [number, number] {
  const dx = v
  const dv =
    -p.delta * v - p.alpha * x - p.beta * x * x * x +
    p.gamma * Math.cos(p.omega * t)
  return [dx, dv]
}

/** 单步 RK4 积分，返回新的 (x, v) */
export function rk4Step(
  x: number,
  v: number,
  t: number,
  dt: number,
  p: DuffingParams,
): [number, number] {
  const [k1x, k1v] = deriv(x, v, t, p)
  const [k2x, k2v] = deriv(x + 0.5 * dt * k1x, v + 0.5 * dt * k1v, t + 0.5 * dt, p)
  const [k3x, k3v] = deriv(x + 0.5 * dt * k2x, v + 0.5 * dt * k2v, t + 0.5 * dt, p)
  const [k4x, k4v] = deriv(x + dt * k3x, v + dt * k3v, t + dt, p)
  const nx = x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x)
  const nv = v + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v)
  return [nx, nv]
}

/**
 * 计算庞加莱截面点云。
 * @param steps 采样的驱动周期数（每周期得到一个点）
 * @param subN 每个驱动周期的积分子步数（越大越精确）
 * @param transient 丢弃的前若干个周期（去掉暂态）
 */
export function poincareMap(
  p: DuffingParams,
  steps: number,
  subN = 60,
  transient = 20,
): PoincarePoint[] {
  const T = (2 * Math.PI) / p.omega
  const dt = T / subN
  let x = p.x0
  let v = p.v0
  let t = 0
  const pts: PoincarePoint[] = []
  const total = steps + transient
  for (let period = 0; period < total; period++) {
    for (let i = 0; i < subN; i++) {
      ;[x, v] = rk4Step(x, v, t, dt, p)
      t += dt
    }
    if (period >= transient) pts.push({ x, v })
  }
  return pts
}

/** 周期解与混沌解两组参数（Holmes 型 Duffing 振子） */
export const PARAM_SETS: Record<string, DuffingParams> = {
  periodic: { delta: 0.3, alpha: -1, beta: 1, gamma: 0.2, omega: 1, x0: 1, v0: 0 },
  chaotic: { delta: 0.25, alpha: -1, beta: 1, gamma: 0.3, omega: 1, x0: 1, v0: 0 },
}

export const SET_NAMES = ['periodic', 'chaotic'] as const
