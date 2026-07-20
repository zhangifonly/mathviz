/**
 * 反向传播核心算法（纯函数，便于测试）
 *
 * 一个 2-2-1 的小神经网络：2 个输入 -> 2 个隐藏神经元 -> 1 个输出，
 * 全部用 sigmoid 激活。forward 做前向传播，trainStep 用链式法则算出
 * 每个权重的梯度并做一步梯度下降。可用于学习 XOR 等简单模式。
 */

export interface Network {
  w1: number[][] // 隐藏层权重 [隐藏神经元 j][输入 i]，形状 2x2
  b1: number[] // 隐藏层偏置，长度 2
  w2: number[] // 输出层权重 [隐藏神经元 j]，长度 2
  b2: number // 输出偏置
}

export interface Forward {
  z1: number[] // 隐藏层加权和
  a1: number[] // 隐藏层激活
  z2: number // 输出加权和
  a2: number // 网络输出
}

export interface Grads {
  dw1: number[][]
  db1: number[]
  dw2: number[]
  db2: number
}

export const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x))

/** sigmoid 关于净输入的导数，输入为已算出的激活值 a */
export const dsigmoid = (a: number): number => a * (1 - a)

/** 前向传播：算出各层加权和与激活 */
export function forward(net: Network, input: number[]): Forward {
  const z1 = [0, 0]
  const a1 = [0, 0]
  for (let j = 0; j < 2; j++) {
    z1[j] = net.b1[j] + net.w1[j][0] * input[0] + net.w1[j][1] * input[1]
    a1[j] = sigmoid(z1[j])
  }
  const z2 = net.b2 + net.w2[0] * a1[0] + net.w2[1] * a1[1]
  const a2 = sigmoid(z2)
  return { z1, a1, z2, a2 }
}

/** 均方损失 L = 0.5 * (a2 - target)^2 */
export const loss = (a2: number, target: number): number => 0.5 * (a2 - target) * (a2 - target)

/**
 * 单步训练：前向 + 用链式法则反向求梯度 + 梯度下降更新。
 * 返回本步梯度、更新后的新网络、以及更新前的损失。
 */
export function trainStep(net: Network, input: number[], target: number, lr: number) {
  const fwd = forward(net, input)
  const { a1, a2 } = fwd
  // 输出层：dL/dz2 = (a2 - target) * sigmoid'(z2)
  const dz2 = (a2 - target) * dsigmoid(a2)
  const dw2 = [dz2 * a1[0], dz2 * a1[1]]
  const db2 = dz2
  // 隐藏层：链式法则回传 dz1[j] = dz2 * w2[j] * sigmoid'(z1[j])
  const dz1 = [dz2 * net.w2[0] * dsigmoid(a1[0]), dz2 * net.w2[1] * dsigmoid(a1[1])]
  const dw1 = [
    [dz1[0] * input[0], dz1[0] * input[1]],
    [dz1[1] * input[0], dz1[1] * input[1]],
  ]
  const db1 = [dz1[0], dz1[1]]
  const grads: Grads = { dw1, db1, dw2, db2 }
  const next: Network = {
    w1: [
      [net.w1[0][0] - lr * dw1[0][0], net.w1[0][1] - lr * dw1[0][1]],
      [net.w1[1][0] - lr * dw1[1][0], net.w1[1][1] - lr * dw1[1][1]],
    ],
    b1: [net.b1[0] - lr * db1[0], net.b1[1] - lr * db1[1]],
    w2: [net.w2[0] - lr * dw2[0], net.w2[1] - lr * dw2[1]],
    b2: net.b2 - lr * db2,
  }
  return { fwd, grads, next, loss: loss(a2, target) }
}

/** 初始网络权重（固定种子，便于复现与测试） */
export const NETWORK: Network = {
  w1: [[0.15, 0.2], [0.25, 0.3]],
  b1: [0.35, 0.35],
  w2: [0.4, 0.45],
  b2: 0.6,
}

export const LEARNING_RATE = 0.5

/** XOR 训练样本 */
export const XOR_SAMPLES: { input: number[]; target: number }[] = [
  { input: [0, 0], target: 0 },
  { input: [0, 1], target: 1 },
  { input: [1, 0], target: 1 },
  { input: [1, 1], target: 0 },
]
