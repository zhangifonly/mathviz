/**
 * K 近邻分类核心算法（纯函数，便于测试）
 * 找训练集中离查询点最近的 k 个样本，多数投票得类别。惰性学习，无需训练。
 */

export interface LabeledPoint {
  x: number
  y: number
  label: number
}

// 各类别的配色（下标即 label）
export const CLASS_COLORS = ['#6366f1', '#ec4899', '#22d3ee']

/** 欧氏距离平方（比较大小足够，省去开方） */
export function dist2(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx
  const dy = ay - by
  return dx * dx + dy * dy
}

/** 找出离 query 最近的 k 个训练点的下标（按距离升序） */
export function nearestK(
  train: LabeledPoint[],
  qx: number,
  qy: number,
  k: number,
): number[] {
  const idx = train.map((p, i) => ({ i, d: dist2(qx, qy, p.x, p.y) }))
  idx.sort((a, b) => a.d - b.d)
  return idx.slice(0, Math.min(k, idx.length)).map((o) => o.i)
}

/**
 * 对 query 点做 KNN 分类：取最近 k 个邻居多数投票。
 * 平票时选下标更小（即更近）的类别，保证结果确定。
 */
export function classify(
  train: LabeledPoint[],
  qx: number,
  qy: number,
  k: number,
): number {
  const neighbors = nearestK(train, qx, qy, k)
  const votes: Record<number, number> = {}
  for (const i of neighbors) {
    const lab = train[i].label
    votes[lab] = (votes[lab] || 0) + 1
  }
  let best = -1
  let bestCount = -1
  for (const i of neighbors) {
    const lab = train[i].label
    if (votes[lab] > bestCount) {
      bestCount = votes[lab]
      best = lab
    }
  }
  return best
}

/** 线性同余伪随机，保证数据集可复现 */
function makeRand(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 生成数据集：nClasses 个类别，每类围绕一个中心散布 */
export function makeDataset(
  nClasses: number,
  perClass: number,
  width: number,
  height: number,
  seed = 1,
): LabeledPoint[] {
  const rand = makeRand(seed)
  const pts: LabeledPoint[] = []
  const spread = Math.min(width, height) * 0.14
  for (let c = 0; c < nClasses; c++) {
    const angle = (2 * Math.PI * c) / nClasses
    const cx = width / 2 + Math.cos(angle) * width * 0.26
    const cy = height / 2 + Math.sin(angle) * height * 0.26
    for (let j = 0; j < perClass; j++) {
      const x = cx + (rand() - 0.5) * spread * 2
      const y = cy + (rand() - 0.5) * spread * 2
      pts.push({ x, y, label: c })
    }
  }
  return pts
}

export const K_VALUES = [1, 3, 5, 9]
export const DATASETS = [
  { name: '两类', classes: 2, perClass: 14 },
  { name: '三类', classes: 3, perClass: 12 },
]
