/**
 * 洛伦兹吸引子（纯函数数学内核，无 DOM）
 *
 * 洛伦兹系统是一组三维常微分方程，由气象学家 Lorenz 于 1963 年提出：
 *   dx/dt = sigma * (y - x)
 *   dy/dt = x * (rho - z) - y
 *   dz/dt = x * y - beta * z
 * 在经典参数 sigma=10, rho=28, beta=8/3 下，轨迹收敛到一个奇怪吸引子，
 * 呈现蝴蝶状的分形结构，并对初值极度敏感（确定性混沌）。
 */

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface LorenzParams {
  sigma: number
  rho: number
  beta: number
}

/** 经典参数：Lorenz 1963 原始设定 */
export const CLASSIC_PARAMS: LorenzParams = { sigma: 10, rho: 28, beta: 8 / 3 }

/** 洛伦兹系统的导数（相空间速度场），纯函数 */
export function lorenzDeriv(s: Vec3, p: LorenzParams): Vec3 {
  return {
    x: p.sigma * (s.y - s.x),
    y: s.x * (p.rho - s.z) - s.y,
    z: s.x * s.y - p.beta * s.z,
  }
}

/** 四阶龙格库塔（RK4）单步积分，dt 为步长，纯函数 */
export function rk4Step(s: Vec3, p: LorenzParams, dt: number): Vec3 {
  const k1 = lorenzDeriv(s, p)
  const s2 = { x: s.x + (dt / 2) * k1.x, y: s.y + (dt / 2) * k1.y, z: s.z + (dt / 2) * k1.z }
  const k2 = lorenzDeriv(s2, p)
  const s3 = { x: s.x + (dt / 2) * k2.x, y: s.y + (dt / 2) * k2.y, z: s.z + (dt / 2) * k2.z }
  const k3 = lorenzDeriv(s3, p)
  const s4 = { x: s.x + dt * k3.x, y: s.y + dt * k3.y, z: s.z + dt * k3.z }
  const k4 = lorenzDeriv(s4, p)
  return {
    x: s.x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    y: s.y + (dt / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
    z: s.z + (dt / 6) * (k1.z + 2 * k2.z + 2 * k3.z + k4.z),
  }
}

/**
 * 从初始点积分出整条轨迹。
 * @param init 初始状态
 * @param p 系统参数
 * @param steps 积分步数
 * @param dt 步长（默认 0.01）
 * @returns 轨迹点序列，长度为 steps+1
 */
export function integrateLorenz(
  init: Vec3,
  p: LorenzParams,
  steps: number,
  dt = 0.01,
): Vec3[] {
  const pts: Vec3[] = [init]
  let cur = init
  for (let i = 0; i < steps; i++) {
    cur = rk4Step(cur, p, dt)
    pts.push(cur)
  }
  return pts
}

/** 两条轨迹在每一步的欧氏距离，用于展示对初值的敏感依赖（蝴蝶效应） */
export function trajectoryDivergence(a: Vec3[], b: Vec3[]): number[] {
  const n = Math.min(a.length, b.length)
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    const dx = a[i].x - b[i].x
    const dy = a[i].y - b[i].y
    const dz = a[i].z - b[i].z
    out.push(Math.sqrt(dx * dx + dy * dy + dz * dz))
  }
  return out
}

export interface LorenzPreset {
  id: string
  label: string
  params: LorenzParams
  note: string
}

/** 可选参数预设：展示不同 rho 下系统行为的巨大差异 */
export const LORENZ_PRESETS: LorenzPreset[] = [
  { id: 'classic', label: '经典蝴蝶 (rho=28)', params: { sigma: 10, rho: 28, beta: 8 / 3 }, note: '标准奇怪吸引子，混沌' },
  { id: 'stable', label: '稳定收敛 (rho=14)', params: { sigma: 10, rho: 14, beta: 8 / 3 }, note: 'rho 较小，轨迹螺旋收敛到定点' },
  { id: 'periodic', label: '周期窗口 (rho=100.5)', params: { sigma: 10, rho: 100.5, beta: 8 / 3 }, note: '大 rho 下出现周期轨道' },
]
