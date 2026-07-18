import { describe as descTest, it, expect } from 'vitest'
import {
  fitness,
  makePopulation,
  describe as summarize,
  evolve,
  runGA,
  POP_SIZE,
  MUTATION_RATE,
  GENERATION_COUNTS,
} from './geneticAlgorithm'

descTest('遗传算法', () => {
  it('常量取值合理', () => {
    expect(POP_SIZE).toBeGreaterThan(0)
    expect(MUTATION_RATE).toBeGreaterThan(0)
    expect(MUTATION_RATE).toBeLessThan(1)
  })

  it('fitness 全局最优在 x≈0.72 附近', () => {
    const peak = fitness(0.72)
    expect(peak).toBeGreaterThan(fitness(0.2))
    expect(peak).toBeGreaterThan(fitness(0.5))
    expect(peak).toBeGreaterThan(fitness(0.0))
    expect(peak).toBeGreaterThan(fitness(1.0))
  })

  it('makePopulation 数量正确且同种子可复现', () => {
    const a = makePopulation(POP_SIZE, 42)
    const b = makePopulation(POP_SIZE, 42)
    const c = makePopulation(POP_SIZE, 7)
    expect(a.length).toBe(POP_SIZE)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
    for (const x of a) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(1)
    }
  })

  it('evolve 保留精英，最优不退化且种群规模不变', () => {
    const pop = makePopulation(POP_SIZE, 3)
    const before = summarize(pop).bestFit
    const gen = evolve(pop, 5)
    expect(gen.pop.length).toBe(POP_SIZE)
    expect(gen.bestFit).toBeGreaterThanOrEqual(before - 1e-9)
    for (const x of gen.pop) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(1)
    }
  })

  it('runGA 多代进化后逼近全局最优', () => {
    const history = runGA(POP_SIZE, 30, 1)
    expect(history.length).toBe(31)
    const first = history[0].bestFit
    const last = history[history.length - 1].bestFit
    expect(last).toBeGreaterThanOrEqual(first)
    expect(history[history.length - 1].best).toBeGreaterThan(0.6)
    expect(history[history.length - 1].best).toBeLessThan(0.85)
  })

  it('GENERATION_COUNTS 各档都能跑出完整历史', () => {
    for (const g of GENERATION_COUNTS) {
      expect(runGA(POP_SIZE, g, 2).length).toBe(g + 1)
    }
  })
})
