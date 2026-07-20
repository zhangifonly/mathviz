import { describe, it, expect } from 'vitest'
import {
  makeArray, bubbleSort, insertionSort, quickSort, mergeSort,
  runSort, ALGORITHMS, ARRAY_SIZE, type SortStep,
} from './sortingAlgorithms'

function lastArray(steps: SortStep[]): number[] {
  return steps[steps.length - 1].array
}

function isSorted(a: number[]): boolean {
  return a.every((v, i) => i === 0 || a[i - 1] <= v)
}

describe('排序算法', () => {
  it('makeArray 生成 1..n 的一个排列，可复现', () => {
    const a = makeArray(ARRAY_SIZE, 7)
    const b = makeArray(ARRAY_SIZE, 7)
    expect(a).toEqual(b)
    expect(a.length).toBe(ARRAY_SIZE)
    expect(a.slice().sort((x, y) => x - y)).toEqual(
      Array.from({ length: ARRAY_SIZE }, (_, i) => i + 1),
    )
  })

  it('四种排序最终结果都正确升序', () => {
    const input = makeArray(ARRAY_SIZE, 42)
    const expected = input.slice().sort((x, y) => x - y)
    for (const fn of [bubbleSort, insertionSort, quickSort, mergeSort]) {
      expect(lastArray(fn(input))).toEqual(expected)
    }
  })

  it('每帧长度恒定；交换型排序全程保持排列，插入/归并末帧为完整排列', () => {
    const input = makeArray(ARRAY_SIZE, 3)
    const key = input.slice().sort((x, y) => x - y)
    // 冒泡、快排靠交换，每一帧都是原数组的一个排列
    for (const fn of [bubbleSort, quickSort]) {
      for (const step of fn(input)) {
        expect(step.array.length).toBe(ARRAY_SIZE)
        expect(step.array.slice().sort((x, y) => x - y)).toEqual(key)
      }
    }
    // 插入、归并靠移位/缓冲回写，中间帧可能出现暂态，仅保证长度不变、末帧完整
    for (const fn of [insertionSort, mergeSort]) {
      const steps = fn(input)
      for (const step of steps) expect(step.array.length).toBe(ARRAY_SIZE)
      expect(steps[steps.length - 1].array.slice().sort((x, y) => x - y)).toEqual(key)
    }
  })

  it('排序不修改输入数组（纯函数）', () => {
    const input = makeArray(8, 5)
    const copy = input.slice()
    bubbleSort(input)
    quickSort(input)
    expect(input).toEqual(copy)
  })

  it('最后一帧标记所有索引已就位', () => {
    const input = makeArray(6, 9)
    for (const fn of [bubbleSort, insertionSort, quickSort]) {
      const steps = fn(input)
      expect(steps[steps.length - 1].sorted.slice().sort((a, b) => a - b))
        .toEqual([0, 1, 2, 3, 4, 5])
    }
  })

  it('runSort 按 key 派发，未知 key 回退冒泡且结果有序', () => {
    const input = makeArray(ARRAY_SIZE, 11)
    for (const algo of ALGORITHMS) {
      expect(isSorted(lastArray(runSort(algo.key, input)))).toBe(true)
    }
    expect(isSorted(lastArray(runSort('unknown', input)))).toBe(true)
  })

  it('已排好序的数组各算法仍返回有序结果', () => {
    const sorted = [1, 2, 3, 4, 5]
    for (const fn of [bubbleSort, insertionSort, quickSort, mergeSort]) {
      expect(lastArray(fn(sorted))).toEqual(sorted)
    }
  })
})
