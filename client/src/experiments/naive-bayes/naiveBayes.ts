/**
 * 高斯朴素贝叶斯核心算法（纯函数，便于测试）
 *
 * 针对二维连续特征的两类分类问题：
 * 对每个类别、每个特征分别估计均值与方差，
 * 在"特征相互独立"的朴素假设下，用高斯似然的乘积乘以类先验，
 * 取后验最大的类别作为预测结果。
 */

export interface Point {
  x: number
  y: number
  label: number // 0 或 1
}

export interface ClassModel {
  prior: number   // 类先验 P(y)
  meanX: number
  meanY: number
  varX: number
  varY: number
}

/** 线性同余伪随机，保证可复现 */
function makeRand(seed: number) {
  let s = seed & 0x7fffffff
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** Box-Muller 标准正态采样 */
function gauss(rand: () => number): number {
  const u = Math.max(rand(), 1e-9)
  const v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/** 生成两类二维高斯训练数据（各 n 个点） */
export function makeDataset(n: number, seed = 1): Point[] {
  const rand = makeRand(seed)
  const pts: Point[] = []
  // 类 0 中心 (2.2, 2.4)，类 1 中心 (3.8, 3.6)，有一定重叠
  const centers = [
    { cx: 2.2, cy: 2.4, sx: 0.7, sy: 0.6 },
    { cx: 3.8, cy: 3.6, sx: 0.6, sy: 0.7 },
  ]
  for (let label = 0; label < 2; label++) {
    const c = centers[label]
    for (let i = 0; i < n; i++) {
      pts.push({ x: c.cx + gauss(rand) * c.sx, y: c.cy + gauss(rand) * c.sy, label })
    }
  }
  return pts
}

/** 一维高斯概率密度 */
export function gaussianPdf(v: number, mean: number, variance: number): number {
  const denom = Math.sqrt(2 * Math.PI * variance)
  const exponent = -((v - mean) ** 2) / (2 * variance)
  return Math.exp(exponent) / denom
}

/** 从训练集估计两类的高斯参数（均值、方差、先验） */
export function fit(train: Point[]): ClassModel[] {
  const models: ClassModel[] = []
  for (let label = 0; label < 2; label++) {
    const cls = train.filter((p) => p.label === label)
    const m = cls.length || 1
    const meanX = cls.reduce((a, p) => a + p.x, 0) / m
    const meanY = cls.reduce((a, p) => a + p.y, 0) / m
    const varX = cls.reduce((a, p) => a + (p.x - meanX) ** 2, 0) / m + 1e-6
    const varY = cls.reduce((a, p) => a + (p.y - meanY) ** 2, 0) / m + 1e-6
    models.push({ prior: cls.length / train.length, meanX, meanY, varX, varY })
  }
  return models
}

/** 对单点分类：返回预测标签（0/1）。朴素独立假设下似然相乘 */
export function classify(train: Point[], px: number, py: number): number {
  const models = fit(train)
  let best = 0
  let bestScore = -Infinity
  for (let label = 0; label < models.length; label++) {
    const mdl = models[label]
    // 用对数避免下溢：log(prior) + log pdf(x) + log pdf(y)
    const score =
      Math.log(mdl.prior + 1e-12) +
      Math.log(gaussianPdf(px, mdl.meanX, mdl.varX) + 1e-12) +
      Math.log(gaussianPdf(py, mdl.meanY, mdl.varY) + 1e-12)
    if (score > bestScore) {
      bestScore = score
      best = label
    }
  }
  return best
}

export const DATASETS = [20, 40, 80]
