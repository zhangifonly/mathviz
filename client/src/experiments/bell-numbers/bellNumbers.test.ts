import { describe, it, expect } from 'vitest'
import { bellTriangle, bellNumber, bellSequence, ROW_COUNTS, MAX_N } from './bellNumbers'

describe('贝尔数', () => {
  it('bellTriangle 行数与每行长度正确', () => {
    const tri = bellTriangle(4)
    expect(tri.length).toBe(5)
    for (let i = 0; i < tri.length; i++) {
      expect(tri[i].length).toBe(i + 1)
    }
  })

  it('贝尔三角前几行数值精确', () => {
    const tri = bellTriangle(4)
    expect(tri[0]).toEqual([1])
    expect(tri[1]).toEqual([1, 2])
    expect(tri[2]).toEqual([2, 3, 5])
    expect(tri[3]).toEqual([5, 7, 10, 15])
    expect(tri[4]).toEqual([15, 20, 27, 37, 52])
  })

  it('每行首元素=上行末元素；其余=左元素+左上元素', () => {
    const tri = bellTriangle(MAX_N)
    for (let i = 1; i < tri.length; i++) {
      const prev = tri[i - 1]
      expect(tri[i][0]).toBe(prev[prev.length - 1])
      for (let j = 1; j <= i; j++) {
        expect(tri[i][j]).toBe(tri[i][j - 1] + prev[j - 1])
      }
    }
  })

  it('bellNumber 匹配已知贝尔数序列', () => {
    const expected = [1, 1, 2, 5, 15, 52, 203, 877, 4140, 21147, 115975]
    for (let n = 0; n < expected.length; n++) {
      expect(bellNumber(n)).toBe(expected[n])
    }
  })

  it('每行末元素等于 B(n+1)', () => {
    const tri = bellTriangle(8)
    for (let i = 0; i < tri.length - 1; i++) {
      const last = tri[i][tri[i].length - 1]
      expect(last).toBe(bellNumber(i + 1))
    }
  })

  it('bellSequence 与 ROW_COUNTS 都能正常生成', () => {
    expect(bellSequence(5)).toEqual([1, 1, 2, 5, 15, 52])
    for (const n of ROW_COUNTS) {
      expect(bellTriangle(n).length).toBe(n + 1)
    }
  })
})
