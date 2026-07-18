/**
 * 逻辑回归核心算法（纯函数，便于测试）
 *
 * 用 sigmoid 把线性得分 w0 + w1*x + w2*y 压到 (0,1) 作为属于正类的概率，
 * 以对数损失为目标，用批量梯度下降训练权重 [w0, w1, w2]。
 * 决策边界是 sigmoid = 0.5，即 w0 + w1*x + w2*y = 0 这条直线。
 */

export interface Point {
  x: number
  y: number
}

export type Weights = [number, number, number]

/** sigmoid 逻辑函数，把任意实数压到 (0,1) */
export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z))
}

/** 给定权重，预测点属于正类的概率 */
export function predict(w: Weights, p: Point): number {
  return sigmoid(w[0] + w[1] * p.x + w[2] * p.y)
}

/** 平均对数损失（交叉熵），加微小 eps 防止 log(0) */
export function logLoss(w: Weights, points: Point[], labels: number[]): number {
  const eps = 1e-9
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const p = predict(w, points[i])
    const y = labels[i]
    sum += -(y * Math.log(p + eps) + (1 - y) * Math.log(1 - p + eps))
  }
  return sum / points.length
}

export interface TrainStep {
  weights: Weights
  loss: number
}

/**
 * 批量梯度下降训练。返回每一步（含第 0 步初始值）的权重与损失。
 * 梯度：dL/dw = mean((p - y) * feature)。
 */
export function train(
  points: Point[],
  labels: number[],
  lr: number,
  epochs: number,
): TrainStep[] {
  let w: Weights = [0, 0, 0]
  const history: TrainStep[] = [{ weights: [...w] as Weights, loss: logLoss(w, points, labels) }]
  for (let e = 0; e < epochs; e++) {
    let g0 = 0
    let g1 = 0
    let g2 = 0
    for (let i = 0; i < points.length; i++) {
      const err = predict(w, points[i]) - labels[i]
      g0 += err
      g1 += err * points[i].x
      g2 += err * points[i].y
    }
    const n = points.length
    w = [w[0] - lr * g0 / n, w[1] - lr * g1 / n, w[2] - lr * g2 / n]
    history.push({ weights: [...w] as Weights, loss: logLoss(w, points, labels) })
  }
  return history
}

/** 两类线性可分的固定 2D 数据集（坐标范围约 [-4,4]） */
export const DATASET: { points: Point[]; labels: number[] } = {
  points: [
    { x: -3.2, y: -2.6 }, { x: -2.4, y: -3.1 }, { x: -3.0, y: -1.4 },
    { x: -1.8, y: -2.2 }, { x: -2.7, y: -0.8 }, { x: -1.2, y: -1.6 },
    { x: -2.1, y: -3.4 }, { x: -3.5, y: -2.0 }, { x: -1.5, y: -0.9 },
    { x: -2.9, y: -2.8 },
    { x: 2.6, y: 2.1 }, { x: 3.2, y: 1.4 }, { x: 1.8, y: 2.8 },
    { x: 2.3, y: 3.3 }, { x: 3.4, y: 2.6 }, { x: 1.4, y: 1.7 },
    { x: 2.9, y: 0.9 }, { x: 1.9, y: 2.4 }, { x: 3.1, y: 3.0 },
    { x: 2.2, y: 1.2 },
  ],
  labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}

export const LEARNING_RATE = 0.5

/** 预设的训练总步数档位 */
export const EPOCH_STOPS = [0, 20, 60, 150]
