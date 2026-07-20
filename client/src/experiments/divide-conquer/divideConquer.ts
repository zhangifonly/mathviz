/**
 * 分治算法核心（纯函数，便于测试）
 *
 * 分治(Divide and Conquer)三步：把大问题二分成子问题(divide)，
 * 递归求解每个子问题(conquer)，再把子解合并成整体解(merge)。
 * 这里以归并排序为例，构建完整的分治递归树。
 */

export interface MergeTreeNode {
  values: number[]        // 该子问题当前持有的数组
  sorted: number[]        // 该子问题排好序后的结果
  lo: number              // 在原数组中的起始下标
  hi: number              // 结束下标（不含）
  depth: number           // 递归深度，根为 0
  left?: MergeTreeNode    // 左子问题
  right?: MergeTreeNode   // 右子问题
}

/** 合并两个有序数组（归并排序的 merge 步骤） */
export function merge(a: number[], b: number[]): number[] {
  const out: number[] = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) out.push(a[i++])
    else out.push(b[j++])
  }
  while (i < a.length) out.push(a[i++])
  while (j < b.length) out.push(b[j++])
  return out
}

/** 构建归并排序的分治递归树，记录每层的分解与合并 */
export function mergeSortTree(arr: number[], lo = 0, hi = arr.length, depth = 0): MergeTreeNode {
  const values = arr.slice(lo, hi)
  if (values.length <= 1) {
    return { values, sorted: values.slice(), lo, hi, depth }
  }
  const mid = (lo + hi) >> 1
  const left = mergeSortTree(arr, lo, mid, depth + 1)
  const right = mergeSortTree(arr, mid, hi, depth + 1)
  const sorted = merge(left.sorted, right.sorted)
  return { values, sorted, lo, hi, depth, left, right }
}

/** 递归树的最大深度（用于布局） */
export function treeDepth(node: MergeTreeNode): number {
  if (!node.left && !node.right) return node.depth
  const l = node.left ? treeDepth(node.left) : node.depth
  const r = node.right ? treeDepth(node.right) : node.depth
  return Math.max(l, r)
}

/** 展平成按深度分组的节点列表，便于逐层可视化 */
export function levels(node: MergeTreeNode): MergeTreeNode[][] {
  const out: MergeTreeNode[][] = []
  const walk = (n: MergeTreeNode) => {
    ;(out[n.depth] ||= []).push(n)
    if (n.left) walk(n.left)
    if (n.right) walk(n.right)
  }
  walk(node)
  return out
}

/** 最大子数组和（分治法，Kadane 之外的经典分治范例） */
export function maxSubArray(arr: number[], lo = 0, hi = arr.length - 1): number {
  if (lo === hi) return arr[lo]
  const mid = (lo + hi) >> 1
  const left = maxSubArray(arr, lo, mid)
  const right = maxSubArray(arr, mid + 1, hi)
  let leftSum = -Infinity
  let sum = 0
  for (let i = mid; i >= lo; i--) { sum += arr[i]; leftSum = Math.max(leftSum, sum) }
  let rightSum = -Infinity
  sum = 0
  for (let i = mid + 1; i <= hi; i++) { sum += arr[i]; rightSum = Math.max(rightSum, sum) }
  return Math.max(left, right, leftSum + rightSum)
}

export const SAMPLE_ARRAY = [38, 27, 43, 3, 9, 82, 10, 1]
export const ARRAY_SIZES = [4, 8, 16]

/** 生成可复现的随机整数数组 */
export function makeArray(n: number, seed = 1): number[] {
  let s = seed
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
  return Array.from({ length: n }, () => Math.floor(rand() * 99) + 1)
}
