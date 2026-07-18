import { describe, it, expect } from 'vitest'
import {
  det2,
  det3,
  transformUnitSquare,
  signedArea,
  SAMPLE_MATRICES,
  type Matrix2,
} from './determinantGeometry'

describe('行列式的几何意义', () => {
  it('det2 计算正确，恒等矩阵为 1', () => {
    expect(det2([[1, 0], [0, 1]])).toBe(1)
    expect(det2([[2, 0], [0, 3]])).toBe(6)
    expect(det2([[1, 2], [3, 4]])).toBe(-2)
  })

  it('det2: 剪切不改变面积，退化矩阵为 0', () => {
    expect(det2([[1, 1], [0, 1]])).toBe(1)
    expect(det2([[2, 1], [4, 2]])).toBe(0)
  })

  it('det2 符号：定向翻转时为负', () => {
    expect(det2([[1, 0], [0, -1]])).toBe(-1)
    expect(det2([[0, 1], [1, 0]])).toBe(-1)
  })

  it('det3 计算正确，对角矩阵为对角元乘积', () => {
    expect(det3([[1, 0, 0], [0, 1, 0], [0, 0, 1]])).toBe(1)
    expect(det3([[2, 0, 0], [0, 3, 0], [0, 0, 4]])).toBe(24)
    expect(det3([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toBe(0)
  })

  it('transformUnitSquare 返回四个顶点，恒等映射保持单位正方形', () => {
    const pts = transformUnitSquare([[1, 0], [0, 1]])
    expect(pts.length).toBe(4)
    expect(pts[0]).toEqual({ x: 0, y: 0 })
    expect(pts[1]).toEqual({ x: 1, y: 0 })
    expect(pts[2]).toEqual({ x: 1, y: 1 })
    expect(pts[3]).toEqual({ x: 0, y: 1 })
  })

  it('transformUnitSquare 顶点等于列向量线性组合', () => {
    const m: Matrix2 = [[2, 1], [0, 3]]
    const pts = transformUnitSquare(m)
    // col1=(2,0), col2=(1,3)
    expect(pts[1]).toEqual({ x: 2, y: 0 })
    expect(pts[3]).toEqual({ x: 1, y: 3 })
    expect(pts[2]).toEqual({ x: 3, y: 3 })
  })

  it('signedArea 等于 det2', () => {
    for (const { matrix } of SAMPLE_MATRICES) {
      expect(signedArea(matrix)).toBe(det2(matrix))
    }
  })

  it('SAMPLE_MATRICES 含退化样例(det=0)与翻转样例(det<0)', () => {
    const dets = SAMPLE_MATRICES.map((s) => det2(s.matrix))
    expect(dets.some((d) => d === 0)).toBe(true)
    expect(dets.some((d) => d < 0)).toBe(true)
    expect(dets.some((d) => d > 1)).toBe(true)
  })
})
