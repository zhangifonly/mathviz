/**
 * 大数定律核心算法（纯函数，便于测试）
 *
 * 大数定律：当独立同分布的样本量 n 增大时，
 * 样本均值 (X1+...+Xn)/n 会收敛到理论期望 E[X]。
 * 这里实现多种分布的采样、累计样本均值序列，供可视化收敛过程。
 */

export interface Distribution {
  id: string
  label: string
  /** 理论期望 E[X] */
  mean: number
  /** 给定 [0,1) 随机数，产出一次采样值 */
  sample: (u: number) => number
}

/** 三种可选分布：掷骰子、伯努利(抛硬币)、均匀分布 */
export const DISTRIBUTIONS: Distribution[] = [
  {
    id: 'dice',
    label: '掷骰子 (1~6)',
    mean: 3.5,
    sample: (u) => Math.floor(u * 6) + 1,
  },
  {
    id: 'bernoulli',
    label: '抛硬币 (0/1)',
    mean: 0.5,
    sample: (u) => (u < 0.5 ? 0 : 1),
  },
  {
    id: 'uniform',
    label: '均匀分布 [0,1]',
    mean: 0.5,
    sample: (u) => u,
  },
]

/** 按 id 查找分布，找不到则回退到第一个 */
export function getDistribution(id: string): Distribution {
  return DISTRIBUTIONS.find((d) => d.id === id) || DISTRIBUTIONS[0]
}

/** 线性同余伪随机数发生器，保证同种子可复现 */
export function makeRng(seed = 1): () => number {
  let s = seed & 0x7fffffff
  if (s === 0) s = 1
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 从指定分布采样 n 个独立样本 */
export function sampleFrom(distId: string, n: number, seed = 1): number[] {
  const dist = getDistribution(distId)
  const rand = makeRng(seed)
  const out: number[] = []
  for (let i = 0; i < n; i++) out.push(dist.sample(rand()))
  return out
}

/**
 * 累计样本均值序列：第 k 项 = 前 k 个样本的平均值。
 * 返回长度与输入相同的数组，随 n 增大应收敛到期望。
 */
export function runningMean(samples: number[]): number[] {
  const means: number[] = []
  let sum = 0
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i]
    means.push(sum / (i + 1))
  }
  return means
}

/** 直接生成一条累计均值轨迹（采样 + 累计均值） */
export function meanTrajectory(distId: string, n: number, seed = 1): number[] {
  return runningMean(sampleFrom(distId, n, seed))
}

export const SAMPLE_COUNTS = [50, 200, 1000]
