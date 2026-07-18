/**
 * 粒子群优化(PSO)核心算法(纯函数,便于测试)
 *
 * 灵感来自鸟群觅食:每只鸟(粒子)记住自己找到的最好位置(个体最优),
 * 也知道整群找到的最好位置(全局最优)。速度由三部分合成:
 * 惯性(保持原方向) + 认知(飞向个体最优) + 社会(飞向全局最优)。
 * 在 2D 定义域上求目标函数的最小值。
 */

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  bestX: number
  bestY: number
  bestVal: number
}

export interface Swarm {
  particles: Particle[]
  gBestX: number
  gBestY: number
  gBestVal: number
}

/** 目标函数:带多个凹坑的地形,全局最小在中心附近。值越小越好。 */
export function objective(x: number, y: number): number {
  const r2 = x * x + y * y
  return r2 * 0.06 - 3 * Math.cos(x) * Math.cos(y) + 3
}

/** 线性同余伪随机,保证同种子可复现 */
function makeRand(seed: number) {
  let s = seed & 0x7fffffff
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 在 [-BOUND, BOUND]^2 内初始化 n 个粒子 */
export function makeSwarm(n: number, seed = 1): Swarm {
  const rand = makeRand(seed)
  const particles: Particle[] = []
  let gBestVal = Infinity
  let gBestX = 0
  let gBestY = 0
  for (let i = 0; i < n; i++) {
    const x = (rand() * 2 - 1) * BOUND
    const y = (rand() * 2 - 1) * BOUND
    const val = objective(x, y)
    particles.push({
      x, y,
      vx: (rand() * 2 - 1) * 2,
      vy: (rand() * 2 - 1) * 2,
      bestX: x, bestY: y, bestVal: val,
    })
    if (val < gBestVal) { gBestVal = val; gBestX = x; gBestY = y }
  }
  return { particles, gBestX, gBestY, gBestVal }
}

/** 迭代一步:更新每个粒子的速度与位置,并刷新个体/全局最优。返回新 Swarm(不改原对象)。 */
export function step(swarm: Swarm, seed = 1): Swarm {
  const rand = makeRand(seed)
  const { w, c1, c2 } = PARAMS
  let { gBestX, gBestY, gBestVal } = swarm
  const particles = swarm.particles.map((p) => {
    const r1 = rand()
    const r2 = rand()
    let vx = w * p.vx + c1 * r1 * (p.bestX - p.x) + c2 * r2 * (swarm.gBestX - p.x)
    let vy = w * p.vy + c1 * r1 * (p.bestY - p.y) + c2 * r2 * (swarm.gBestY - p.y)
    vx = Math.max(-VMAX, Math.min(VMAX, vx))
    vy = Math.max(-VMAX, Math.min(VMAX, vy))
    const x = Math.max(-BOUND, Math.min(BOUND, p.x + vx))
    const y = Math.max(-BOUND, Math.min(BOUND, p.y + vy))
    const val = objective(x, y)
    let { bestX, bestY, bestVal } = p
    if (val < bestVal) { bestVal = val; bestX = x; bestY = y }
    if (val < gBestVal) { gBestVal = val; gBestX = x; gBestY = y }
    return { x, y, vx, vy, bestX, bestY, bestVal }
  })
  return { particles, gBestX, gBestY, gBestVal }
}

export const BOUND = 6
export const VMAX = 3
export const SWARM_SIZE = 24
export const PARAMS = { w: 0.72, c1: 1.5, c2: 1.5 }
