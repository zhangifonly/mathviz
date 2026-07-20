/**
 * 单摆相空间核心算法（纯函数，便于测试）
 *
 * 单摆运动方程: theta'' = -(g/L) sin(theta)
 * 令 omega = theta', 化为一阶方程组:
 *   theta' = omega
 *   omega' = -(g/L) sin(theta)
 * 用四阶龙格-库塔(RK4)积分, 得到 (theta, omega) 相空间轨迹。
 *
 * 小角度低能量 -> 闭合曲线(振荡);
 * 大能量越过顶点 -> 波浪线(翻转);
 * 分隔两者的临界轨线称为分界线(separatrix)。
 */

export interface State {
  theta: number
  omega: number
}

export const G = 9.8
export const L = 1

/** 相空间导数: (theta, omega) -> (theta', omega') */
export function derivative(s: State): State {
  return { theta: s.omega, omega: -(G / L) * Math.sin(s.theta) }
}

/** 单步 RK4 积分 */
export function rk4Step(s: State, dt: number): State {
  const k1 = derivative(s)
  const s2 = { theta: s.theta + 0.5 * dt * k1.theta, omega: s.omega + 0.5 * dt * k1.omega }
  const k2 = derivative(s2)
  const s3 = { theta: s.theta + 0.5 * dt * k2.theta, omega: s.omega + 0.5 * dt * k2.omega }
  const k3 = derivative(s3)
  const s4 = { theta: s.theta + dt * k3.theta, omega: s.omega + dt * k3.omega }
  const k4 = derivative(s4)
  return {
    theta: s.theta + (dt / 6) * (k1.theta + 2 * k2.theta + 2 * k3.theta + k4.theta),
    omega: s.omega + (dt / 6) * (k1.omega + 2 * k2.omega + 2 * k3.omega + k4.omega),
  }
}

/** 从初始状态积分 steps 步, 返回整条轨迹(含起点) */
export function simulate(theta0: number, omega0: number, steps: number, dt: number): State[] {
  let s: State = { theta: theta0, omega: omega0 }
  const path: State[] = [s]
  for (let i = 0; i < steps; i++) {
    s = rk4Step(s, dt)
    path.push(s)
  }
  return path
}

/** 系统能量(单位质量): E = 0.5*omega^2 + (g/L)*(1 - cos theta) */
export function energy(s: State): number {
  return 0.5 * s.omega * s.omega + (G / L) * (1 - Math.cos(s.theta))
}

/** 分界线能量: 恰好到达顶点(theta=pi, omega=0)的能量 = 2g/L */
export const SEPARATRIX_ENERGY = (2 * G) / L

/** 若干初始状态: 前几条振荡(闭合), 后几条翻转(越顶) */
export const INITIAL_STATES: State[] = [
  { theta: 0.5, omega: 0 },
  { theta: 1.2, omega: 0 },
  { theta: 2.2, omega: 0 },
  { theta: 0, omega: 6.5 },
  { theta: 0, omega: 8 },
]
