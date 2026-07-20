/**
 * 感知机核心算法（纯函数，便于测试）
 * 最简人工神经元：加权求和经符号激活，输出 +1/-1 两类。
 * 对线性可分数据按误分类更新权重，收敛定理保证有限步分开两类。
 */

/** 带标签的二维样本点，label 取 +1 或 -1 */
export interface Point { x: number; y: number; label: number }

/** 决策边界 w0*x + w1*y + b = 0 */
export interface Boundary { w0: number; w1: number; b: number }

/** 学习率 η */
export const LEARNING_RATE = 0.1

/** 线性同余伪随机，保证同种子可复现 */
function makeRand(seed: number): () => number {
  let s = seed & 0x7fffffff
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 生成 n 个线性可分的两类点（特征坐标在 [0,1]，带间隔保证可分） */
export function generateDataset(n: number, seed = 1): Point[] {
  const rand = makeRand(seed)
  // 随机一条真实分隔线，过中心附近
  const ta = rand() * 2 - 1
  const tb = rand() * 2 - 1
  const tc = -(ta + tb) * 0.5
  const points: Point[] = []
  let guard = 0
  while (points.length < n && guard < n * 200) {
    guard++
    const x = rand()
    const y = rand()
    const s = ta * x + tb * y + tc
    if (Math.abs(s) < 0.12) continue // 落在间隔带里的丢弃，确保可分
    points.push({ x, y, label: s > 0 ? 1 : -1 })
  }
  return points
}

/** 感知机预测：加权求和经符号激活，返回 +1 或 -1 */
export function predict(b: Boundary, p: Point): number {
  return b.w0 * p.x + b.w1 * p.y + b.b > 0 ? 1 : -1
}

/** 单步更新：误分类则 w += η·y·x，b += η·y；返回新边界与是否更新 */
export function perceptronStep(b: Boundary, p: Point, lr = LEARNING_RATE): { boundary: Boundary; updated: boolean } {
  const activation = b.w0 * p.x + b.w1 * p.y + b.b
  if (p.label * activation <= 0) {
    return {
      boundary: {
        w0: b.w0 + lr * p.label * p.x,
        w1: b.w1 + lr * p.label * p.y,
        b: b.b + lr * p.label,
      },
      updated: true,
    }
  }
  return { boundary: b, updated: false }
}

/** 训练全过程：返回每次权重更新后的决策边界（含初始零边界） */
export function trainPerceptron(points: Point[], lr = LEARNING_RATE, maxEpochs = 100): Boundary[] {
  let b: Boundary = { w0: 0, w1: 0, b: 0 }
  const history: Boundary[] = [{ ...b }]
  for (let epoch = 0; epoch < maxEpochs; epoch++) {
    let mistakes = 0
    for (const p of points) {
      const r = perceptronStep(b, p, lr)
      if (r.updated) {
        b = r.boundary
        history.push({ ...b })
        mistakes++
      }
    }
    if (mistakes === 0) break
  }
  return history
}

/** 当前边界在数据集上的分类正确率 [0,1] */
export function accuracy(b: Boundary, points: Point[]): number {
  if (points.length === 0) return 1
  let ok = 0
  for (const p of points) if (predict(b, p) === p.label) ok++
  return ok / points.length
}

/** 预设数据集（名称、点数、随机种子） */
export const DATASETS = [
  { name: '简单', count: 20, seed: 3 },
  { name: '中等', count: 40, seed: 7 },
  { name: '密集', count: 80, seed: 11 },
]
