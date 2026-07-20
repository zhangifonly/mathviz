import { describe, it, expect } from 'vitest'
import {
  merge, mergeSortTree, treeDepth, levels, maxSubArray,
  makeArray, SAMPLE_ARRAY, ARRAY_SIZES,
} from './divideConquer'

describe('分治算法', () => {
  it('merge 合并两个有序数组仍有序', () => {
    expect(merge([1, 3, 5], [2, 4, 6])).toEqual([1, 2, 3, 4, 5, 6])
    expect(merge([], [1, 2])).toEqual([1, 2])
    expect(merge([7], [])).toEqual([7])
  })

  it('mergeSortTree 根节点结果是完全有序的', () => {
    const tree = mergeSortTree(SAMPLE_ARRAY)
    const expected = [...SAMPLE_ARRAY].sort((a, b) => a - b)
    expect(tree.sorted).toEqual(expected)
    expect(tree.values).toEqual(SAMPLE_ARRAY)
  })

  it('mergeSortTree 叶子节点为单元素且已排序', () => {
    const tree = mergeSortTree([5, 2, 9])
    const leaves = levels(tree).flat().filter((n) => !n.left && !n.right)
    for (const leaf of leaves) {
      expect(leaf.values.length).toBeLessThanOrEqual(1)
      expect(leaf.sorted).toEqual(leaf.values)
    }
  })

  it('treeDepth 与 levels 层数一致，8 元素深度为 3', () => {
    const tree = mergeSortTree(makeArray(8, 3))
    expect(treeDepth(tree)).toBe(3)
    expect(levels(tree).length).toBe(4)
  })

  it('maxSubArray 分治求最大子数组和正确', () => {
    expect(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6)
    expect(maxSubArray([1, 2, 3])).toBe(6)
    expect(maxSubArray([-5, -2, -8])).toBe(-2)
  })

  it('makeArray 同种子可复现，尺寸正确', () => {
    expect(makeArray(8, 42)).toEqual(makeArray(8, 42))
    expect(makeArray(8, 1)).not.toEqual(makeArray(8, 2))
    for (const n of ARRAY_SIZES) expect(makeArray(n, 1).length).toBe(n)
  })
})
