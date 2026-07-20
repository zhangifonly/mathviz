import { describe, it, expect } from 'vitest'
import {
  sampleField,
  laplacianAt,
  laplacianGrid,
  diffuseStep,
  gridRange,
  FUNCTIONS,
} from './laplacian'

describe('拉普拉斯算子', () => {
  it('sampleField 生成指定尺寸网格且角点归一化到 [-1,1]', () => {
    const g = sampleField((x, y) => x + y, 5, 5)
    expect(g.length).toBe(5)
    expect(g[0].length).toBe(5)
    expect(g[0][0]).toBeCloseTo(-2) // (-1)+(-1)
    expect(g[4][4]).toBeCloseTo(2) // 1+1
  })

  it('常数场处处拉普拉斯为 0（邻域平均等于自身）', () => {
    const g = sampleField(() => 3.5, 6, 6)
    const lap = laplacianGrid(g)
    for (const row of lap) for (const v of row) expect(v).toBeCloseTo(0)
  })

  it('线性场 f=ax+by 拉普拉斯为 0（二阶导为零）', () => {
    const g = sampleField((x, y) => 2 * x - 3 * y, 7, 7)
    // 取内部点，避开 clamp 边界
    expect(laplacianAt(g, 3, 3)).toBeCloseTo(0)
  })

  it('局部低谷拉普拉斯为正：中心低于四邻居', () => {
    const g = [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0],
    ]
    // 邻居和 = 1+1+1+1 = 4，减去 4*(-4) = -16 → 20 > 0
    expect(laplacianAt(g, 1, 1)).toBe(20)
    expect(laplacianAt(g, 1, 1)).toBeGreaterThan(0)
  })

  it('diffuseStep 让极值向邻域平均靠拢（低谷回升）', () => {
    const g = [
      [0, 0, 0],
      [0, -1, 0],
      [0, 0, 0],
    ]
    const next = diffuseStep(g, 0.2)
    // 中心是低谷，∇²>0，扩散后应上升
    expect(next[1][1]).toBeGreaterThan(g[1][1])
  })

  it('gridRange 返回正确的最小最大值', () => {
    const g = [
      [1, 5],
      [-2, 3],
    ]
    expect(gridRange(g)).toEqual([-2, 5])
  })

  it('调和函数 x²-y² 在内部拉普拉斯接近 0', () => {
    const g = sampleField((x, y) => x * x - y * y, 21, 21)
    expect(laplacianAt(g, 10, 10)).toBeCloseTo(0, 5)
  })

  it('FUNCTIONS 每个都能采样出有限值网格', () => {
    for (const f of FUNCTIONS) {
      const g = sampleField(f.fn, 8, 8)
      for (const row of g) for (const v of row) expect(Number.isFinite(v)).toBe(true)
    }
  })
})
