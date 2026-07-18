import { describe, it, expect } from 'vitest'
import { makeSwarm, step, objective, SWARM_SIZE, PARAMS, BOUND } from './particleSwarm'

describe('粒子群优化', () => {
  it('makeSwarm 生成指定数量粒子,坐标在界内', () => {
    const s = makeSwarm(SWARM_SIZE, 1)
    expect(s.particles.length).toBe(SWARM_SIZE)
    for (const p of s.particles) {
      expect(Math.abs(p.x)).toBeLessThanOrEqual(BOUND)
      expect(Math.abs(p.y)).toBeLessThanOrEqual(BOUND)
      expect(p.bestVal).toBe(objective(p.bestX, p.bestY))
    }
  })

  it('makeSwarm 同种子可复现,不同种子不同', () => {
    expect(makeSwarm(10, 42)).toEqual(makeSwarm(10, 42))
    expect(makeSwarm(10, 42)).not.toEqual(makeSwarm(10, 99))
  })

  it('全局最优值等于所有粒子当前值的最小值', () => {
    const s = makeSwarm(20, 7)
    const minVal = Math.min(...s.particles.map((p) => objective(p.x, p.y)))
    expect(s.gBestVal).toBeCloseTo(minVal, 10)
  })

  it('多步迭代后全局最优不会变差(单调不增)', () => {
    let s = makeSwarm(SWARM_SIZE, 3)
    let prev = s.gBestVal
    for (let i = 0; i < 40; i++) {
      s = step(s, i + 1)
      expect(s.gBestVal).toBeLessThanOrEqual(prev + 1e-9)
      prev = s.gBestVal
    }
  })

  it('迭代能有效收敛,靠近全局最小(值明显下降)', () => {
    let s = makeSwarm(SWARM_SIZE, 5)
    const start = s.gBestVal
    for (let i = 0; i < 60; i++) s = step(s, i + 1)
    expect(s.gBestVal).toBeLessThan(start)
    expect(s.gBestVal).toBeLessThan(2)
  })

  it('step 返回新对象,不改动原 Swarm', () => {
    const s = makeSwarm(8, 2)
    const snapshot = JSON.parse(JSON.stringify(s))
    step(s, 1)
    expect(s).toEqual(snapshot)
  })

  it('PARAMS 含合理的惯性与学习因子', () => {
    expect(PARAMS.w).toBeGreaterThan(0)
    expect(PARAMS.w).toBeLessThan(1)
    expect(PARAMS.c1).toBeGreaterThan(0)
    expect(PARAMS.c2).toBeGreaterThan(0)
  })
})
