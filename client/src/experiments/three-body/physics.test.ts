import { describe, it, expect } from 'vitest'
import { computeAccelerations, stepVerlet, totalEnergy, type Body } from './physics'
import { PRESETS, clonePreset } from './presets'

const cfg = { G: 1, softening: 0.05 }

describe('三体引力物理', () => {
  it('两体引力方向相互吸引', () => {
    const bodies: Body[] = [
      { x: -1, y: 0, vx: 0, vy: 0, mass: 1 },
      { x: 1, y: 0, vx: 0, vy: 0, mass: 1 },
    ]
    const acc = computeAccelerations(bodies, cfg)
    // 左侧天体应被向右吸引（ax > 0），右侧向左（ax < 0）
    expect(acc[0].ax).toBeGreaterThan(0)
    expect(acc[1].ax).toBeLessThan(0)
    // 等质量对称，加速度大小相等方向相反
    expect(acc[0].ax).toBeCloseTo(-acc[1].ax, 10)
  })

  it('stepVerlet 不修改输入数组（纯函数）', () => {
    const bodies = clonePreset(PRESETS[0])
    const snapshot = JSON.stringify(bodies)
    stepVerlet(bodies, 0.01, cfg)
    expect(JSON.stringify(bodies)).toBe(snapshot)
  })

  it('能量在长时间积分后近似守恒（Verlet 特性）', () => {
    let bodies = clonePreset(PRESETS[0]) // 8字解
    const e0 = totalEnergy(bodies, cfg)
    for (let i = 0; i < 2000; i++) {
      bodies = stepVerlet(bodies, 0.002, cfg)
    }
    const e1 = totalEnergy(bodies, cfg)
    // 辛积分器能量漂移应很小（相对误差 < 5%）
    expect(Math.abs((e1 - e0) / e0)).toBeLessThan(0.05)
  })

  it('8字解保持有界（不飞散）', () => {
    let bodies = clonePreset(PRESETS[0])
    for (let i = 0; i < 1000; i++) {
      bodies = stepVerlet(bodies, 0.002, cfg)
    }
    // 所有天体应仍在合理范围内（8字轨道尺度约 ±1.5）
    for (const b of bodies) {
      expect(Math.abs(b.x)).toBeLessThan(3)
      expect(Math.abs(b.y)).toBeLessThan(3)
    }
  })

  it('totalEnergy = 动能 + 势能，势能为负', () => {
    const bodies: Body[] = [
      { x: 0, y: 0, vx: 0, vy: 0, mass: 1 },
      { x: 1, y: 0, vx: 0, vy: 0, mass: 1 },
    ]
    // 静止时动能为 0，总能量应等于势能（负值）
    expect(totalEnergy(bodies, cfg)).toBeLessThan(0)
  })
})
