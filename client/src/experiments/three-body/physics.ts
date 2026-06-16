/**
 * 三体/N体引力模拟 - 核心物理（纯函数，便于测试）
 *
 * 牛顿万有引力 + 速度Verlet 数值积分
 */

export interface Body {
  x: number
  y: number
  vx: number
  vy: number
  mass: number
}

export interface SimConfig {
  G: number        // 引力常数
  softening: number // 软化因子，避免距离过近时力发散
}

/** 计算所有天体受到的加速度 */
export function computeAccelerations(bodies: Body[], cfg: SimConfig): { ax: number; ay: number }[] {
  const { G, softening } = cfg
  const acc = bodies.map(() => ({ ax: 0, ay: 0 }))
  for (let i = 0; i < bodies.length; i++) {
    for (let j = 0; j < bodies.length; j++) {
      if (i === j) continue
      const dx = bodies[j].x - bodies[i].x
      const dy = bodies[j].y - bodies[i].y
      const distSq = dx * dx + dy * dy + softening * softening
      const dist = Math.sqrt(distSq)
      const f = (G * bodies[j].mass) / distSq
      acc[i].ax += (f * dx) / dist
      acc[i].ay += (f * dy) / dist
    }
  }
  return acc
}

/** 用速度Verlet 推进一步，返回新的天体数组（不修改输入） */
export function stepVerlet(bodies: Body[], dt: number, cfg: SimConfig): Body[] {
  const acc = computeAccelerations(bodies, cfg)
  // 半步速度 + 位置更新
  const halfStepped = bodies.map((b, i) => ({
    ...b,
    x: b.x + b.vx * dt + 0.5 * acc[i].ax * dt * dt,
    y: b.y + b.vy * dt + 0.5 * acc[i].ay * dt * dt,
  }))
  const newAcc = computeAccelerations(halfStepped, cfg)
  return halfStepped.map((b, i) => ({
    ...b,
    vx: b.vx + 0.5 * (acc[i].ax + newAcc[i].ax) * dt,
    vy: b.vy + 0.5 * (acc[i].ay + newAcc[i].ay) * dt,
  }))
}

/** 系统总能量（动能 + 势能），用于验证守恒性 */
export function totalEnergy(bodies: Body[], cfg: SimConfig): number {
  const { G, softening } = cfg
  let kinetic = 0
  for (const b of bodies) {
    kinetic += 0.5 * b.mass * (b.vx * b.vx + b.vy * b.vy)
  }
  let potential = 0
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const dx = bodies[j].x - bodies[i].x
      const dy = bodies[j].y - bodies[i].y
      const dist = Math.sqrt(dx * dx + dy * dy + softening * softening)
      potential -= (G * bodies[i].mass * bodies[j].mass) / dist
    }
  }
  return kinetic + potential
}
