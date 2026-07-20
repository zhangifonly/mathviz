import { describe, it, expect } from 'vitest'
import { apply, classify, trajectory, SYSTEMS, type Matrix2 } from './phasePortrait'

describe('相图分析', () => {
  it('apply 计算矩阵向量乘正确', () => {
    const A: Matrix2 = [1, 2, 3, 4]
    expect(apply(A, [1, 0])).toEqual([1, 3])
    expect(apply(A, [0, 1])).toEqual([2, 4])
    expect(apply(A, [1, 1])).toEqual([3, 7])
  })

  it('classify 判别四类平衡点', () => {
    expect(classify([-1, 0, 0, -2]).type).toBe('node')
    expect(classify([1, 0, 0, -1]).type).toBe('saddle')
    expect(classify([-0.4, -1, 1, -0.4]).type).toBe('focus')
    expect(classify([0, -1, 1, 0]).type).toBe('center')
  })

  it('classify 稳定性与迹行列式一致', () => {
    const c = classify([-1, 0, 0, -2])
    expect(c.trace).toBe(-3)
    expect(c.det).toBe(2)
    expect(c.stable).toBe(true)
    expect(classify([1, 0, 0, 2]).stable).toBe(false) // 不稳定结点
    expect(classify([1, 0, 0, -1]).stable).toBe(false) // 鞍点不稳定
  })

  it('trajectory: 稳定结点轨线收敛到原点', () => {
    const pts = trajectory([-1, 0, 0, -2], [3, 3], 400, 0.05)
    const last = pts[pts.length - 1]
    expect(Math.hypot(last[0], last[1])).toBeLessThan(0.1)
    expect(pts.length).toBeGreaterThan(1)
  })

  it('trajectory: 中心轨线保持有界（近似闭合）', () => {
    const r0 = 2
    const pts = trajectory([0, -1, 1, 0], [r0, 0], 200, 0.05)
    for (const p of pts) {
      expect(Math.hypot(p[0], p[1])).toBeLessThan(r0 + 0.2)
    }
  })

  it('SYSTEMS 覆盖四种类型且分类自洽', () => {
    expect(SYSTEMS.length).toBe(4)
    for (const s of SYSTEMS) {
      expect(classify(s.A).type).toBe(s.key)
    }
  })
})
