/**
 * 蒙提霍尔问题核心算法（纯函数，便于测试）
 *
 * 三扇门后一扇有奖，玩家先选一扇，主持人打开另一扇有羊的门，
 * 再让玩家决定换或不换。用蒙特卡洛模拟验证：换=2/3，不换=1/3。
 */

export type Strategy = 'switch' | 'stay'

export const STRATEGIES: Strategy[] = ['switch', 'stay']

/** 理论胜率 */
export const THEORY: Record<Strategy, number> = {
  switch: 2 / 3,
  stay: 1 / 3,
}

/** 线性同余伪随机，返回 [0,1)，保证可复现 */
export function makeRng(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** 用给定随机源玩一局，返回是否中奖 */
export function playWithRng(strategy: Strategy, rand: () => number): boolean {
  const prize = Math.floor(rand() * 3)
  const pick = Math.floor(rand() * 3)

  // 主持人从既非玩家所选、也非奖品的门中开一扇（有羊）
  const closed = [0, 1, 2].filter((d) => d !== pick && d !== prize)
  const host = closed[Math.floor(rand() * closed.length)]

  if (strategy === 'stay') return pick === prize
  // 换门：选那扇既不是原选、也没被主持人打开的门
  const final = [0, 1, 2].find((d) => d !== pick && d !== host) as number
  return final === prize
}

/** 用固定种子玩一局（自带随机源） */
export function playOnce(strategy: Strategy, seed = 1): boolean {
  return playWithRng(strategy, makeRng(seed))
}

/** 模拟 trials 局，返回胜率（0~1） */
export function simulate(strategy: Strategy, trials: number, seed = 1): number {
  if (trials <= 0) return 0
  const rand = makeRng(seed)
  let wins = 0
  for (let i = 0; i < trials; i++) {
    if (playWithRng(strategy, rand)) wins++
  }
  return wins / trials
}

/** 返回累计胜率曲线（长度 trials，每个元素是前 i+1 局的累计胜率） */
export function simulateCurve(strategy: Strategy, trials: number, seed = 1): number[] {
  const rand = makeRng(seed)
  const curve: number[] = []
  let wins = 0
  for (let i = 0; i < trials; i++) {
    if (playWithRng(strategy, rand)) wins++
    curve.push(wins / (i + 1))
  }
  return curve
}

export const TRIAL_COUNTS = [50, 200, 1000]
