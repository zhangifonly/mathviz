/**
 * Rössler 吸引子（纯函数数学内核，无 DOM）
 *
 * Rössler 系统是 Otto Rössler 于 1976 年提出的一组三维常微分方程，
 * 比洛伦兹系统更简单，只有一个非线性项（z*x）：
 *   dx/dt = -y - z
 *   dy/dt = x + a * y
 *   dz/dt = b + z * (x - c)
 * 在经典参数 a=0.2, b=0.2, c=5.7 下，轨迹在 xy 平面上螺旋盘绕，
 * 每隔一段又被 z 方向猛地折叠拉起，形成单卷混沌吸引子。
 */

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface RosslerParams {
  a: number
  b: number
  c: number
}

/** 经典参数：Rössler 1976 原始设定 */
export const PARAMS: RosslerParams = { a: 0.2, b: 0.2, c: 5.7 }

/** Rössler 系统的导数（相空间速度场），纯函数 */
export function rosslerDeriv(s: Vec3, p: RosslerParams): Vec3 {
  return {
    x: -s.y - s.z,
    y: s.x + p.a * s.y,
    z: p.b + s.z * (s.x - p.c),
  }
}

/** 四阶龙格库塔（RK4）单步积分，dt 为步长，纯函数 */
export function rk4Step(s: Vec3, p: RosslerParams, dt: number): Vec3 {
  const k1 = rosslerDeriv(s, p)
  const s2 = { x: s.x + (dt / 2) * k1.x, y: s.y + (dt / 2) * k1.y, z: s.z + (dt / 2) * k1.z }
  const k2 = rosslerDeriv(s2, p)
  const s3 = { x: s.x + (dt / 2) * k2.x, y: s.y + (dt / 2) * k2.y, z: s.z + (dt / 2) * k2.z }
  const k3 = rosslerDeriv(s3, p)
  const s4 = { x: s.x + dt * k3.x, y: s.y + dt * k3.y, z: s.z + dt * k3.z }
  const k4 = rosslerDeriv(s4, p)
  return {
    x: s.x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    y: s.y + (dt / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
    z: s.z + (dt / 6) * (k1.z + 2 * k2.z + 2 * k3.z + k4.z),
  }
}

/**
 * 从初始点积分出整条轨迹（simulate）。
 * @param init 初始状态
 * @param p 系统参数
 * @param steps 积分步数
 * @param dt 步长（默认 0.02）
 * @returns 轨迹点序列，长度为 steps+1
 */
export function simulate(
  init: Vec3,
  p: RosslerParams,
  steps: number,
  dt = 0.02,
): Vec3[] {
  const pts: Vec3[] = [init]
  let cur = init
  for (let i = 0; i < steps; i++) {
    cur = rk4Step(cur, p, dt)
    pts.push(cur)
  }
  return pts
}

/** 正交投影到 2D 平面：默认取 xy 平面（丢弃 z） */
export function projectXY(pts: Vec3[]): Array<[number, number]> {
  return pts.map((v) => [v.x, v.y])
}

export interface RosslerPreset {
  id: string
  label: string
  params: RosslerParams
  note: string
}

/** 可选参数预设：展示不同 c 下从周期到混沌的分岔 */
export const ROSSLER_PRESETS: RosslerPreset[] = [
  { id: 'classic', label: '经典混沌 (c=5.7)', params: { a: 0.2, b: 0.2, c: 5.7 }, note: '标准单卷混沌吸引子' },
  { id: 'period2', label: '周期倍化 (c=4)', params: { a: 0.2, b: 0.2, c: 4 }, note: 'c 较小，轨迹呈两圈周期环' },
  { id: 'rich', label: '更繁混沌 (c=9)', params: { a: 0.2, b: 0.2, c: 9 }, note: '大 c 下折叠更剧烈，结构更丰富' },
]
