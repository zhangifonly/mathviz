import { describe, it, expect } from 'vitest'
import { PRESETS, clonePreset, BODY_COLORS } from './presets'
import { stepVerlet, type Body } from './physics'

describe('三体初始构型预设', () => {
  it('每个预设都有名称、标签和至少 3 个天体', () => {
    for (const p of PRESETS) {
      expect(p.name).toBeTruthy()
      expect(p.label).toBeTruthy()
      expect(p.bodies.length).toBeGreaterThanOrEqual(3)
      expect(p.G).toBeGreaterThan(0)
    }
  })

  it('预设名称唯一', () => {
    const names = PRESETS.map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('所有天体质量为正', () => {
    for (const p of PRESETS) {
      for (const b of p.bodies) {
        expect(b.mass).toBeGreaterThan(0)
      }
    }
  })

  it('clonePreset 深拷贝，修改副本不影响原始预设', () => {
    const preset = PRESETS[0]
    const cloned = clonePreset(preset)
    cloned[0].x = 999
    cloned[0].mass = 999
    expect(preset.bodies[0].x).not.toBe(999)
    expect(preset.bodies[0].mass).not.toBe(999)
  })

  it('8字解三体等质量且初速度非零', () => {
    const fig8 = PRESETS.find((p) => p.name === 'figure8')!
    const masses = fig8.bodies.map((b) => b.mass)
    expect(masses.every((m) => m === masses[0])).toBe(true)
    // 至少有天体在运动
    expect(fig8.bodies.some((b) => b.vx !== 0 || b.vy !== 0)).toBe(true)
  })

  it('BODY_COLORS 数量足够覆盖最大天体数', () => {
    const maxBodies = Math.max(...PRESETS.map((p) => p.bodies.length))
    expect(BODY_COLORS.length).toBeGreaterThanOrEqual(maxBodies)
  })

  it('所有构型长期演化保持有界（不飞出画布、不产生 NaN）', () => {
    // 渲染用 SCALE≈68，画布半高 280px => 安全轨道半径上限约 4.1
    const MAX_RADIUS = 4.1
    const cfg = { G: 1, softening: 0.05 }
    for (const p of PRESETS) {
      let bodies: Body[] = clonePreset(p)
      let maxR = 0
      // 3000 帧 × 4 子步，约等于实验页运行 50 秒
      for (let f = 0; f < 3000; f++) {
        for (let s = 0; s < 4; s++) bodies = stepVerlet(bodies, 0.005, cfg)
        for (const b of bodies) {
          const r = Math.hypot(b.x, b.y)
          expect(Number.isFinite(r)).toBe(true)
          if (r > maxR) maxR = r
        }
      }
      expect(maxR, `构型「${p.label}」最大轨道半径 ${maxR.toFixed(2)} 超出画布`).toBeLessThan(MAX_RADIUS)
    }
  })
})
