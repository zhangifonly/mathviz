/**
 * 神经网络前向传播核心算法（纯函数，便于测试）
 *
 * 给定网络结构（各层权重 W、偏置 b、激活函数），
 * forward 从输入层出发，逐层计算 a = activation(W·x + b)，
 * 返回每一层的激活值。这里用固定小网络（2-3-2）演示信号流动。
 */

export type Activation = 'sigmoid' | 'relu'

export interface Layer {
  /** 权重矩阵：weights[j] 为第 j 个神经元对上一层所有输入的权重 */
  weights: number[][]
  /** 偏置：每个神经元一个 */
  biases: number[]
  activation: Activation
}

/** sigmoid：把任意实数压缩到 (0,1) */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

/** relu：负数归零，正数保留 */
export function relu(x: number): number {
  return x > 0 ? x : 0
}

/** 按类型施加激活函数 */
export function applyActivation(x: number, kind: Activation): number {
  return kind === 'relu' ? relu(x) : sigmoid(x)
}

/** 单个神经元：加权求和再加偏置（即 z = w·x + b） */
export function weightedSum(inputs: number[], weights: number[], bias: number): number {
  let s = bias
  for (let i = 0; i < weights.length; i++) s += weights[i] * inputs[i]
  return s
}

/**
 * 前向传播：返回每一层的激活值。
 * result[0] 为输入本身，result[k] 为第 k 层输出。
 */
export function forward(input: number[], layers: Layer[]): number[][] {
  const acts: number[][] = [input.slice()]
  let cur = input
  for (const layer of layers) {
    const next: number[] = []
    for (let j = 0; j < layer.weights.length; j++) {
      const z = weightedSum(cur, layer.weights[j], layer.biases[j])
      next.push(applyActivation(z, layer.activation))
    }
    acts.push(next)
    cur = next
  }
  return acts
}

/** 各层神经元数量（含输入层），用于绘图布局 */
export function layerSizes(input: number[], layers: Layer[]): number[] {
  return [input.length, ...layers.map((l) => l.weights.length)]
}

/** 固定小网络：2-3-2，权重手工设定，能跑出有意义的激活分布 */
export const NETWORK: Layer[] = [
  {
    weights: [
      [1.5, -2.0],
      [-1.0, 1.8],
      [0.8, 0.9],
    ],
    biases: [0.2, -0.3, 0.1],
    activation: 'sigmoid',
  },
  {
    weights: [
      [2.0, -1.5, 1.2],
      [-1.8, 2.2, -0.6],
    ],
    biases: [-0.5, 0.4],
    activation: 'sigmoid',
  },
]

/** 预设输入，供交互切换（类似模板的 SITE_COUNTS） */
export const INPUT_PRESETS: number[][] = [
  [1, 0],
  [0, 1],
  [1, 1],
]
