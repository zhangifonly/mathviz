import { describe, it, expect } from 'vitest'
import {
  accelerations,
  step,
  kineticEnergy,
  potentialEnergy,
  totalEnergy,
  centerOfMass,
  totalMomentum,
  circularOrbitVelocity,
  PRESET_OPTIONS,
  type Body,
} from './nbodySimulation'

describe('N 体引力仿真内核', () => {
  it('单体不受力，加速度为零', () => {
    const bodies: Body[] = [{ x: 0, y: 0, vx: 0, vy: 0, mass: 1 }]
    const a = accelerations(bodies, 1, 0.01)
    expect(a[0].ax).toBe(0)
    expect(a[0].ay).toBe(0)
  })

  it('两体相互吸引，加速度方向沿连线且大小相符', () => {
    const bodies: Body[] = [
      { x: 0, y: 0, vx: 0, vy: 0, mass: 2 },
      { x: 1, y: 0, vx: 0, vy: 0, mass: 3 },
    ]
    // 无软化时 F/m_i = G·m_j / r²，r = 1
    const a = accelerations(bodies, 1, 0)
    expect(a[0].ax).toBeCloseTo(3, 10) // 指向 +x（被质量 3 吸引）
    expect(a[0].ay).toBeCloseTo(0, 10)
    expect(a[1].ax).toBeCloseTo(-2, 10) // 指向 -x
    expect(a[1].ay).toBeCloseTo(0, 10)
  })

  it('牛顿第三定律：合外力为零（m_i·a_i 相加抵消）', () => {
    const bodies: Body[] = [
      { x: 0, y: 0, vx: 0, vy: 0, mass: 2 },
      { x: 1, y: 0, vx: 0, vy: 0, mass: 3 },
    ]
    const a = accelerations(bodies, 1, 0)
    const fx = bodies[0].mass * a[0].ax + bodies[1].mass * a[1].ax
    const fy = bodies[0].mass * a[0].ay + bodies[1].mass * a[1].ay
    expect(fx).toBeCloseTo(0, 10)
    expect(fy).toBeCloseTo(0, 10)
  })

  it('step 守恒总动量（对称双星系统动量始终约为零）', () => {
    let bodies: Body[] = [
      { x: -1, y: 0, vx: 0, vy: -0.5, mass: 1 },
      { x: 1, y: 0, vx: 0, vy: 0.5, mass: 1 },
    ]
    const p0 = totalMomentum(bodies)
    for (let i = 0; i < 200; i++) bodies = step(bodies, { G: 1, softening: 0.05, dt: 0.005 })
    const p1 = totalMomentum(bodies)
    expect(p1.px).toBeCloseTo(p0.px, 6)
    expect(p1.py).toBeCloseTo(p0.py, 6)
  })

  it('step 大致守恒总能量（Verlet 积分，误差小）', () => {
    let bodies: Body[] = [
      { x: -1, y: 0, vx: 0, vy: -0.5, mass: 1 },
      { x: 1, y: 0, vx: 0, vy: 0.5, mass: 1 },
    ]
    const e0 = totalEnergy(bodies, 1, 0.05)
    for (let i = 0; i < 500; i++) bodies = step(bodies, { G: 1, softening: 0.05, dt: 0.005 })
    const e1 = totalEnergy(bodies, 1, 0.05)
    expect(Math.abs(e1 - e0)).toBeLessThan(0.05 * Math.abs(e0) + 0.01)
  })

  it('kineticEnergy 与 potentialEnergy 计算正确', () => {
    const bodies: Body[] = [
      { x: 0, y: 0, vx: 3, vy: 4, mass: 2 },
      { x: 1, y: 0, vx: 0, vy: 0, mass: 2 },
    ]
    // 动能 = ½·2·(9+16) = 25
    expect(kineticEnergy(bodies)).toBeCloseTo(25, 10)
    // 势能 = -G·m1·m2 / r = -1·2·2 / 1 = -4（softening=0）
    expect(potentialEnergy(bodies, 1, 0)).toBeCloseTo(-4, 10)
  })

  it('centerOfMass 按质量加权', () => {
    const bodies: Body[] = [
      { x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
      { x: 3, y: 0, vx: 0, vy: 0, mass: 3 },
    ]
    const c = centerOfMass(bodies)
    expect(c.x).toBeCloseTo(2.25, 10)
    expect(c.y).toBeCloseTo(0, 10)
  })

  it('circularOrbitVelocity: v = sqrt(GM/r)', () => {
    expect(circularOrbitVelocity(1, 4, 1)).toBeCloseTo(2, 10)
    expect(circularOrbitVelocity(2, 8, 2)).toBeCloseTo(Math.sqrt(8), 10)
  })

  it('恒星-行星预设：行星近似圆轨道（半径基本不变）', () => {
    const preset = PRESET_OPTIONS.find((p) => p.id === 'star-planet')!
    let bodies = preset.bodies.map((b) => ({ ...b }))
    const r0 = Math.hypot(bodies[1].x - bodies[0].x, bodies[1].y - bodies[0].y)
    for (let i = 0; i < 300; i++) bodies = step(bodies, { G: preset.G, softening: preset.softening, dt: preset.dt })
    const r1 = Math.hypot(bodies[1].x - bodies[0].x, bodies[1].y - bodies[0].y)
    expect(Math.abs(r1 - r0) / r0).toBeLessThan(0.15)
  })

  it('PRESET_OPTIONS 都有效（至少两体、正质量、参数为正）', () => {
    expect(PRESET_OPTIONS.length).toBeGreaterThanOrEqual(3)
    for (const p of PRESET_OPTIONS) {
      expect(p.bodies.length).toBeGreaterThanOrEqual(2)
      expect(p.G).toBeGreaterThan(0)
      expect(p.dt).toBeGreaterThan(0)
      expect(p.softening).toBeGreaterThanOrEqual(0)
      for (const b of p.bodies) expect(b.mass).toBeGreaterThan(0)
    }
  })
})
