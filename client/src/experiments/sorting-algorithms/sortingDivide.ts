/**
 * 分治类排序：快速排序与归并排序（记录每步快照）
 */
import type { SortStep } from './sortingAlgorithms'

function snap(arr: number[], compare: number[], swap: number[], sorted: number[]): SortStep {
  return { array: arr.slice(), compare: compare.slice(), swap: swap.slice(), sorted: sorted.slice() }
}

/** 快速排序：选基准，小的放左大的放右，递归分区（Lomuto 分区） */
export function quickSort(input: number[]): SortStep[] {
  const arr = input.slice()
  const steps: SortStep[] = [snap(arr, [], [], [])]
  const sorted: number[] = []
  const partition = (lo: number, hi: number): number => {
    const pivot = arr[hi]
    let i = lo
    for (let j = lo; j < hi; j++) {
      steps.push(snap(arr, [j, hi], [], sorted))
      if (arr[j] < pivot) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        steps.push(snap(arr, [], [i, j], sorted))
        i++
      }
    }
    ;[arr[i], arr[hi]] = [arr[hi], arr[i]]
    steps.push(snap(arr, [], [i, hi], sorted))
    return i
  }
  const qsort = (lo: number, hi: number) => {
    if (lo > hi) return
    if (lo === hi) { sorted.push(lo); return }
    const p = partition(lo, hi)
    sorted.push(p)
    qsort(lo, p - 1)
    qsort(p + 1, hi)
  }
  qsort(0, arr.length - 1)
  steps.push(snap(arr, [], [], arr.map((_, i) => i)))
  return steps
}

/** 归并排序：稳定地两两合并有序子序列 */
export function mergeSort(input: number[]): SortStep[] {
  const arr = input.slice()
  const steps: SortStep[] = [snap(arr, [], [], [])]
  const msort = (lo: number, hi: number) => {
    if (hi - lo < 1) return
    const mid = (lo + hi) >> 1
    msort(lo, mid)
    msort(mid + 1, hi)
    merge(lo, mid, hi)
  }
  const merge = (lo: number, mid: number, hi: number) => {
    const left = arr.slice(lo, mid + 1)
    const right = arr.slice(mid + 1, hi + 1)
    let i = 0
    let j = 0
    let k = lo
    while (i < left.length && j < right.length) {
      steps.push(snap(arr, [lo + i, mid + 1 + j], [], []))
      if (left[i] <= right[j]) arr[k++] = left[i++]
      else arr[k++] = right[j++]
      steps.push(snap(arr, [], [k - 1], []))
    }
    while (i < left.length) { arr[k++] = left[i++]; steps.push(snap(arr, [], [k - 1], [])) }
    while (j < right.length) { arr[k++] = right[j++]; steps.push(snap(arr, [], [k - 1], [])) }
  }
  msort(0, arr.length - 1)
  steps.push(snap(arr, [], [], arr.map((_, i) => i)))
  return steps
}
