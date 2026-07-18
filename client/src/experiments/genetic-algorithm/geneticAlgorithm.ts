/**
 * 遗传算法核心（纯函数，便于测试）
 *
 * 用进化的方式求一维函数的最大值：
 * 个体 = 候选解 x（区间 [0,1]），适应度 = 函数值 fitness(x)。
 * 一代进化 = 锦标赛选择 + 算术交叉 + 变异 + 精英保留。
 */

/** 种群规模 */
export const POP_SIZE = 40
/** 变异概率 */
export const MUTATION_RATE = 0.12

/** 多峰适应度地形：全局最优在 x≈0.72，另有两个局部峰 */
export function fitness(x: number): number {
  const a = 0.6 * Math.exp(-((x - 0.2) ** 2) / 0.02)
  const b = 1.0 * Math.exp(-((x - 0.72) ** 2) / 0.008)
  const c = 0.45 * Math.exp(-((x - 0.95) ** 2) / 0.01)
  return a + b + c
}

/** 线性同余伪随机，保证可复现 */
function makeRng(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** 生成初始种群（size 个随机候选解，可复现） */
export function makePopulation(size: number, seed = 1): number[] {
  const rand = makeRng(seed)
  const pop: number[] = []
  for (let i = 0; i < size; i++) pop.push(rand())
  return pop
}

export interface Generation {
  pop: number[]     // 该代所有个体
  best: number      // 最优个体的 x
  bestFit: number   // 最优适应度
  avgFit: number    // 平均适应度
}

/** 统计一个种群的最优个体与平均适应度 */
export function describe(pop: number[]): Generation {
  let best = pop[0]
  let sum = 0
  for (const x of pop) {
    const f = fitness(x)
    sum += f
    if (f > fitness(best)) best = x
  }
  return { pop, best, bestFit: fitness(best), avgFit: sum / pop.length }
}

/** 锦标赛选择：随机取 3 个个体，返回适应度最高者 */
function tournament(pop: number[], rand: () => number): number {
  let winner = pop[Math.floor(rand() * pop.length)]
  for (let k = 0; k < 2; k++) {
    const c = pop[Math.floor(rand() * pop.length)]
    if (fitness(c) > fitness(winner)) winner = c
  }
  return winner
}

/** 进化一代：返回下一代种群及其统计（精英保留最优个体） */
export function evolve(pop: number[], seed = 1): Generation {
  const rand = makeRng(seed)
  const size = pop.length
  let elite = pop[0]
  for (const x of pop) if (fitness(x) > fitness(elite)) elite = x
  const next: number[] = [elite]
  while (next.length < size) {
    const p1 = tournament(pop, rand)
    const p2 = tournament(pop, rand)
    const alpha = rand()
    let child = alpha * p1 + (1 - alpha) * p2
    if (rand() < MUTATION_RATE) child += (rand() - 0.5) * 0.3
    next.push(Math.max(0, Math.min(1, child)))
  }
  return describe(next)
}

/** 连续进化 generations 代，返回每代统计历史（含第 0 代初始种群） */
export function runGA(size: number, generations: number, seed = 1): Generation[] {
  let pop = makePopulation(size, seed)
  const history: Generation[] = [describe(pop)]
  for (let g = 1; g <= generations; g++) {
    const gen = evolve(pop, seed + g * 101)
    history.push(gen)
    pop = gen.pop
  }
  return history
}

/** 可选代数档位 */
export const GENERATION_COUNTS = [5, 15, 30]
