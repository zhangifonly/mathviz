/**
 * N 体引力仿真（纯函数数学内核，无 DOM）
 *
 * 牛顿万有引力：两个质点之间的引力大小为 F = G·m1·m2 / r²，方向沿连线。
 * 采用带软化因子 ε 的加速度公式 a_i = Σ_j G·m_j·(r_j − r_i) / (|r_j − r_i|² + ε²)^{3/2}，
 * 用速度 Verlet（leapfrog）积分，能较好地守恒能量。
 */

export interface Body {
  x: number
  y: number
  vx: number
  vy: number
  mass: number
}

export interface SimParams {
  /** 引力常数（仿真单位，可调） */
  G: number
  /** 软化因子，避免两体极近时加速度发散 */
  softening: number
  /** 时间步长 */
  dt: number
}

/** 计算每个天体所受的合加速度 */
export function accelerations(bodies: Body[], G: number, softening: number): { ax: number; ay: number }[] {
  const eps2 = softening * softening
  return bodies.map((bi, i) => {
    let ax = 0
    let ay = 0
    for (let j = 0; j < bodies.length; j++) {
      if (j === i) continue
      const bj = bodies[j]
      const dx = bj.x - bi.x
      const dy = bj.y - bi.y
      const dist2 = dx * dx + dy * dy + eps2
      const invDist3 = 1 / (dist2 * Math.sqrt(dist2))
      const f = G * bj.mass * invDist3
      ax += f * dx
      ay += f * dy
    }
    return { ax, ay }
  })
}

/** 速度 Verlet 单步推进，返回新的天体数组（不修改入参） */
export function step(bodies: Body[], params: SimParams): Body[] {
  const { G, softening, dt } = params
  const a0 = accelerations(bodies, G, softening)
  // 半步：先按当前加速度更新位置
  const moved = bodies.map((b, i) => ({
    ...b,
    x: b.x + b.vx * dt + 0.5 * a0[i].ax * dt * dt,
    y: b.y + b.vy * dt + 0.5 * a0[i].ay * dt * dt,
  }))
  const a1 = accelerations(moved, G, softening)
  return moved.map((b, i) => ({
    ...b,
    vx: b.vx + 0.5 * (a0[i].ax + a1[i].ax) * dt,
    vy: b.vy + 0.5 * (a0[i].ay + a1[i].ay) * dt,
  }))
}

/** 系统总动能 Σ ½ m v² */
export function kineticEnergy(bodies: Body[]): number {
  return bodies.reduce((s, b) => s + 0.5 * b.mass * (b.vx * b.vx + b.vy * b.vy), 0)
}

/** 系统总引力势能 −Σ_{i<j} G·m_i·m_j / |r_ij|（含软化） */
export function potentialEnergy(bodies: Body[], G: number, softening: number): number {
  const eps2 = softening * softening
  let u = 0
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const dx = bodies[j].x - bodies[i].x
      const dy = bodies[j].y - bodies[i].y
      const r = Math.sqrt(dx * dx + dy * dy + eps2)
      u -= (G * bodies[i].mass * bodies[j].mass) / r
    }
  }
  return u
}

/** 系统总能量（动能 + 势能） */
export function totalEnergy(bodies: Body[], G: number, softening: number): number {
  return kineticEnergy(bodies) + potentialEnergy(bodies, G, softening)
}

/** 系统质心坐标 */
export function centerOfMass(bodies: Body[]): { x: number; y: number } {
  let m = 0
  let x = 0
  let y = 0
  for (const b of bodies) {
    m += b.mass
    x += b.mass * b.x
    y += b.mass * b.y
  }
  return m === 0 ? { x: 0, y: 0 } : { x: x / m, y: y / m }
}

/** 系统总动量 */
export function totalMomentum(bodies: Body[]): { px: number; py: number } {
  let px = 0
  let py = 0
  for (const b of bodies) {
    px += b.mass * b.vx
    py += b.mass * b.vy
  }
  return { px, py }
}

/** 圆轨道所需环绕速度 v = sqrt(G·M / r) */
export function circularOrbitVelocity(G: number, centralMass: number, r: number): number {
  return Math.sqrt((G * centralMass) / r)
}

export interface PresetOption {
  id: string
  label: string
  note: string
  G: number
  softening: number
  dt: number
  bodies: Body[]
}

const G_DEFAULT = 1

/** 双星：等质量互绕，动量为零，质心静止 */
function binaryPreset(): Body[] {
  const m = 1
  const r = 1
  const v = 0.5 * circularOrbitVelocity(G_DEFAULT, m, 2 * r)
  return [
    { x: -r, y: 0, vx: 0, vy: -v, mass: m },
    { x: r, y: 0, vx: 0, vy: v, mass: m },
  ]
}

/** 恒星—行星：大质量中心 + 圆轨道行星 */
function starPlanetPreset(): Body[] {
  const M = 40
  const r = 2
  const v = circularOrbitVelocity(G_DEFAULT, M, r)
  return [
    { x: 0, y: 0, vx: 0, vy: 0, mass: M },
    { x: r, y: 0, vx: 0, vy: v, mass: 0.01 },
  ]
}

/** 三体：经典 8 字周期解（Chenciner–Montgomery），等质量 */
function figureEightPreset(): Body[] {
  const m = 1
  const vx = 0.347111
  const vy = 0.532728
  return [
    { x: -0.97000436, y: 0.24308753, vx, vy, mass: m },
    { x: 0.97000436, y: -0.24308753, vx, vy, mass: m },
    { x: 0, y: 0, vx: -2 * vx, vy: -2 * vy, mass: m },
  ]
}

export const PRESET_OPTIONS: PresetOption[] = [
  { id: 'binary', label: '双星系统', note: '等质量两体互绕，质心静止', G: G_DEFAULT, softening: 0.05, dt: 0.005, bodies: binaryPreset() },
  { id: 'star-planet', label: '恒星-行星', note: '大质量中心 + 圆轨道行星', G: G_DEFAULT, softening: 0.05, dt: 0.005, bodies: starPlanetPreset() },
  { id: 'figure-eight', label: '三体 8 字解', note: '著名的周期性三体轨道', G: G_DEFAULT, softening: 0.001, dt: 0.002, bodies: figureEightPreset() },
]
