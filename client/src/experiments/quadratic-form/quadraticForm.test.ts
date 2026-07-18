import { describe, it, expect } from 'vitest'
import {
  evalQuadratic,
  eigenvalues2x2,
  classify,
  classInfo,
  SAMPLES,
} from './quadraticForm'

describe('二次型', () => {
  it('evalQuadratic 计算含交叉项的值', () => {
    const q = { a: 2, b: 0.5, c: 1 }
    // 2*1 + 2*0.5*1*1 + 1*1 = 2 + 1 + 1 = 4
    expect(evalQuadratic(q, 1, 1)).toBeCloseTo(4)
    expect(evalQuadratic(q, 0, 0)).toBe(0)
    // 纯 y 项：c*y^2
    expect(evalQuadratic({ a: 0, b: 0, c: 3 }, 0, 2)).toBe(12)
  })

  it('eigenvalues2x2 对角矩阵直接给对角元', () => {
    const [lo, hi] = eigenvalues2x2({ a: 3, b: 0, c: 1 })
    expect(lo).toBeCloseTo(1)
    expect(hi).toBeCloseTo(3)
  })

  it('eigenvalues2x2 满足迹与行列式关系', () => {
    const q = { a: 2, b: 0.5, c: 1 }
    const [lo, hi] = eigenvalues2x2(q)
    // 和=trace=a+c
    expect(lo + hi).toBeCloseTo(q.a + q.c)
    // 积=det=ac-b^2
    expect(lo * hi).toBeCloseTo(q.a * q.c - q.b * q.b)
    expect(lo).toBeLessThanOrEqual(hi)
  })

  it('classify 正确区分正定/负定/不定', () => {
    expect(classify({ a: 2, b: 0.5, c: 1 })).toBe('positive-definite')
    expect(classify({ a: -2, b: 0, c: -1 })).toBe('negative-definite')
    expect(classify({ a: 1, b: 0, c: -1 })).toBe('indefinite')
  })

  it('classify 识别半正定（一个特征值为零）', () => {
    // [[1,1],[1,1]] 特征值 0 和 2
    expect(classify({ a: 1, b: 1, c: 1 })).toBe('positive-semidefinite')
  })

  it('classInfo 每种类型都有中文标签和颜色', () => {
    for (const s of SAMPLES) {
      const info = classInfo(classify(s.form))
      expect(info.label.length).toBeGreaterThan(0)
      expect(info.color).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('SAMPLES 三个样例类型符合命名', () => {
    expect(classify(SAMPLES[0].form)).toBe('positive-definite')
    expect(classify(SAMPLES[1].form)).toBe('indefinite')
    expect(classify(SAMPLES[2].form)).toBe('positive-semidefinite')
  })
})
