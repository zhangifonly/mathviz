import { describe, it, expect } from 'vitest'
import {
  jacobianMatrix,
  jacobianDet,
  det2,
  getMapping,
  MAPPINGS,
  MAPPING_IDS,
} from './jacobian'

describe('雅可比矩阵', () => {
  it('恒等映射的雅可比是单位矩阵，行列式为 1', () => {
    const id = (u: number, v: number): [number, number] => [u, v]
    const J = jacobianMatrix(id, 2, 3)
    expect(J[0][0]).toBeCloseTo(1, 5)
    expect(J[0][1]).toBeCloseTo(0, 5)
    expect(J[1][0]).toBeCloseTo(0, 5)
    expect(J[1][1]).toBeCloseTo(1, 5)
    expect(jacobianDet(id, 2, 3)).toBeCloseTo(1, 5)
  })

  it('缩放映射 (2u,3v) 行列式为 6', () => {
    const scale = (u: number, v: number): [number, number] => [2 * u, 3 * v]
    expect(jacobianDet(scale, 1, 1)).toBeCloseTo(6, 4)
  })

  it('极坐标映射行列式等于半径 u', () => {
    const polar = getMapping('polar').T
    expect(jacobianDet(polar, 1, 0.5)).toBeCloseTo(1, 3)
    expect(jacobianDet(polar, 3, 1.2)).toBeCloseTo(3, 3)
  })

  it('复平方 z² 行列式等于 4(u²+v²)', () => {
    const sq = getMapping('square').T
    const u = 1.5
    const v = 0.7
    expect(jacobianDet(sq, u, v)).toBeCloseTo(4 * (u * u + v * v), 2)
  })

  it('det2 计算正确', () => {
    expect(det2([[1, 2], [3, 4]])).toBe(-2)
    expect(det2([[2, 0], [0, 5]])).toBe(10)
  })

  it('MAPPINGS 都可调用且返回有限行列式', () => {
    for (const m of MAPPINGS) {
      const d = jacobianDet(m.T, 1.1, 0.6)
      expect(Number.isFinite(d)).toBe(true)
    }
    expect(MAPPING_IDS.length).toBe(MAPPINGS.length)
  })

  it('getMapping 未知 id 回退到第一个映射', () => {
    expect(getMapping('nope').id).toBe(MAPPINGS[0].id)
  })
})
