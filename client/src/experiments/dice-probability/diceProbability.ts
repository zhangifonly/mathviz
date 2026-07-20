/**
 * 骰子与古典概率核心算法（纯函数，便于测试）
 *
 * 若干个均匀骰子点数之和的理论分布可由卷积精确算出；
 * 大量模拟投掷得到的频率会逐渐逼近该理论概率（大数定律）。
 */

/** 骰子面数 */
const FACES = 6

/**
 * n 个骰子点数和的理论概率分布。
 * 返回长度为 (6n - n + 1) 的数组，下标 0 对应和 = n。
 * 用逐次卷积：单个骰子分布反复与自身卷积。
 */
export function sumDistribution(numDice: number): number[] {
  // 单骰子：点数 1..6 各 1/6
  let dist = new Array(FACES).fill(1 / FACES)
  for (let d = 1; d < numDice; d++) {
    const next = new Array(dist.length + FACES - 1).fill(0)
    for (let i = 0; i < dist.length; i++) {
      for (let f = 0; f < FACES; f++) {
        next[i + f] += dist[i] / FACES
      }
    }
    dist = next
  }
  return dist
}

/** 分布数组下标转真实点数和：下标 0 = numDice */
export function sumOffset(numDice: number): number {
  return numDice
}

/** 线性同余伪随机（可复现） */
function makeRand(seed: number): () => number {
  let s = seed & 0x7fffffff
  if (s === 0) s = 1
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 模拟一次投掷 numDice 个骰子，返回点数之和 */
export function rollDice(numDice: number, seed: number): number {
  const rand = makeRand(seed)
  let sum = 0
  for (let i = 0; i < numDice; i++) {
    sum += Math.floor(rand() * FACES) + 1
  }
  return sum
}

/**
 * 模拟 trials 次投掷，返回各点数和出现的频数。
 * 数组下标 0 对应和 = numDice，与 sumDistribution 对齐。
 */
export function simulate(numDice: number, trials: number, seed: number): number[] {
  const rand = makeRand(seed)
  const len = numDice * (FACES - 1) + 1
  const counts = new Array(len).fill(0)
  for (let t = 0; t < trials; t++) {
    let sum = 0
    for (let i = 0; i < numDice; i++) {
      sum += Math.floor(rand() * FACES) + 1
    }
    counts[sum - numDice] += 1
  }
  return counts
}

export const DICE_COUNTS = [1, 2, 3]
