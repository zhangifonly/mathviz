/**
 * 决策树核心算法（纯函数，便于测试）
 * 二分类 2D 数据：贪心选"信息增益"最大的轴对齐分裂建树，每叶=一块矩形区域。
 */
export interface Point { x: number; y: number; label: number } // label 为 0 或 1

export type TreeNode =
  | { leaf: true; label: number; count: number }
  | { leaf: false; axis: 0 | 1; threshold: number; left: TreeNode; right: TreeNode }

function tally(labels: number[]): Map<number, number> {
  const c = new Map<number, number>()
  for (const l of labels) c.set(l, (c.get(l) ?? 0) + 1)
  return c
}

/** 信息熵：labels 里各类别占比的 -Σ p·log2(p) */
export function entropy(labels: number[]): number {
  if (labels.length === 0) return 0
  let h = 0
  for (const c of tally(labels).values()) {
    const p = c / labels.length
    h -= p * Math.log2(p)
  }
  return h
}

function majority(labels: number[]): number {
  let best = labels[0] ?? 0
  let bestC = -1
  for (const [l, c] of tally(labels)) if (c > bestC) { bestC = c; best = l }
  return best
}

type Split = { axis: 0 | 1; threshold: number; gain: number }

/** 按 axis(0=x,1=y) 在 threshold 处分裂的信息增益 */
export function infoGain(points: Point[], axis: 0 | 1, threshold: number): number {
  const val = (p: Point) => (axis === 0 ? p.x : p.y)
  const left = points.filter((p) => val(p) <= threshold)
  const right = points.filter((p) => val(p) > threshold)
  if (left.length === 0 || right.length === 0) return 0
  const n = points.length
  const w = (g: Point[]) => (g.length / n) * entropy(g.map((p) => p.label))
  return entropy(points.map((p) => p.label)) - w(left) - w(right)
}

function bestSplit(points: Point[]): Split | null {
  let best: Split | null = null
  for (const axis of [0, 1] as const) {
    const vals = Array.from(new Set(points.map((p) => (axis === 0 ? p.x : p.y)))).sort((a, b) => a - b)
    for (let i = 0; i < vals.length - 1; i++) {
      const t = (vals[i] + vals[i + 1]) / 2
      const g = infoGain(points, axis, t)
      if (g > 0 && (!best || g > best.gain)) best = { axis, threshold: t, gain: g }
    }
  }
  return best
}

/** 用某棵树给坐标 (x,y) 分类 */
export function classify(tree: TreeNode, x: number, y: number): number {
  let node = tree
  while (!node.leaf) node = (node.axis === 0 ? x : y) <= node.threshold ? node.left : node.right
  return node.label
}

/** 贪心建树：递归到达 maxDepth、纯净或无有效分裂时收成叶子 */
export function buildTree(points: Point[], maxDepth: number): TreeNode {
  const labels = points.map((p) => p.label)
  const lab = majority(labels)
  const pure = new Set(labels).size <= 1
  if (maxDepth <= 0 || pure || points.length < 2) return { leaf: true, label: lab, count: points.length }
  const split = bestSplit(points)
  if (!split) return { leaf: true, label: lab, count: points.length }
  const val = (p: Point) => (split.axis === 0 ? p.x : p.y)
  const { axis, threshold } = split
  const left = buildTree(points.filter((p) => val(p) <= threshold), maxDepth - 1)
  const right = buildTree(points.filter((p) => val(p) > threshold), maxDepth - 1)
  return { leaf: false, axis, threshold, left, right }
}

/** 生成两类 2D 数据（坐标域 0..1），四团交错分布，需多次分裂才可分 */
function makeDataset(): Point[] {
  let s = 20260718
  const rand = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  const pts: Point[] = []
  const g = (m: number) => Math.min(0.97, Math.max(0.03, m + (rand() - 0.5) * 0.32))
  const add = (n: number, mx: number, my: number, lb: number) => {
    for (let i = 0; i < n; i++) pts.push({ x: g(mx), y: g(my), label: lb })
  }
  add(24, 0.3, 0.35, 0)
  add(24, 0.72, 0.68, 1)
  add(8, 0.72, 0.3, 0)
  add(8, 0.3, 0.72, 1)
  return pts
}

export const DATASET: Point[] = makeDataset()
export const MAX_DEPTH = 4
