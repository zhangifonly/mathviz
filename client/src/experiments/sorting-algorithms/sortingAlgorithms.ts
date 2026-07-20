/**
 * 排序算法核心（纯函数）。每个排序真实执行并记录每步快照帧：
 * 一帧 = 当前数组 + 正在比较/交换的索引 + 已就位索引。冒泡/插入/快速/归并。
 */

import { quickSort, mergeSort } from './sortingDivide'

export interface SortStep {
  array: number[]
  compare: number[]
  swap: number[]
  sorted: number[]
}

export interface AlgoInfo { key: string; name: string; complexity: string; stable: boolean }

export const ALGORITHMS: AlgoInfo[] = [
  { key: 'bubble', name: '冒泡排序', complexity: 'O(n^2)', stable: true },
  { key: 'insertion', name: '插入排序', complexity: 'O(n^2)', stable: true },
  { key: 'quick', name: '快速排序', complexity: 'O(n log n)', stable: false },
  { key: 'merge', name: '归并排序', complexity: 'O(n log n)', stable: true },
]

export const ARRAY_SIZE = 12

/** 生成一个可复现的乱序数组（1..n 打乱） */
export function makeArray(n = ARRAY_SIZE, seed = 7): number[] {
  let s = seed
  const rand = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  const arr = Array.from({ length: n }, (_, i) => i + 1)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function snap(arr: number[], compare: number[], swap: number[], sorted: number[]): SortStep {
  return { array: arr.slice(), compare: compare.slice(), swap: swap.slice(), sorted: sorted.slice() }
}

/** 冒泡排序：相邻比较交换，每轮把最大值冒到末尾 */
export function bubbleSort(input: number[]): SortStep[] {
  const arr = input.slice()
  const n = arr.length
  const steps: SortStep[] = [snap(arr, [], [], [])]
  const sorted: number[] = []
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push(snap(arr, [j, j + 1], [], sorted))
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        steps.push(snap(arr, [], [j, j + 1], sorted))
      }
    }
    sorted.unshift(n - 1 - i)
  }
  sorted.unshift(0)
  steps.push(snap(arr, [], [], sorted))
  return steps
}

/** 插入排序：把每个元素插入到前面已排好的序列中 */
export function insertionSort(input: number[]): SortStep[] {
  const arr = input.slice()
  const n = arr.length
  const steps: SortStep[] = [snap(arr, [], [], [0])]
  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1
    steps.push(snap(arr, [i], [], range(0, i)))
    while (j >= 0 && arr[j] > key) {
      steps.push(snap(arr, [j, j + 1], [], range(0, i)))
      arr[j + 1] = arr[j]
      j--
      steps.push(snap(arr, [], [j + 1, j + 2], range(0, i)))
    }
    arr[j + 1] = key
    steps.push(snap(arr, [], [], range(0, i + 1)))
  }
  steps.push(snap(arr, [], [], range(0, n)))
  return steps
}

function range(a: number, b: number): number[] {
  return Array.from({ length: b - a }, (_, i) => a + i)
}

export { quickSort, mergeSort }

/** 按算法 key 生成步骤帧数组 */
export function runSort(key: string, input: number[]): SortStep[] {
  const map: Record<string, (a: number[]) => SortStep[]> = {
    bubble: bubbleSort, insertion: insertionSort, quick: quickSort, merge: mergeSort,
  }
  return (map[key] || bubbleSort)(input)
}
