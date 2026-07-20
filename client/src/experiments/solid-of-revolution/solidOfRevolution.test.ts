import { describe, it, expect } from 'vitest'
import {
  simpson,
  diskVolume,
  shellVolume,
  maxValue,
  lengthAtHeight,
  FUNCTIONS,
  INTERVALS,
} from './solidOfRevolution'

describe('旋转体体积', () => {
  it('simpson 对多项式精确积分', () => {
    // ∫[0,2] x^2 dx = 8/3
    expect(simpson((x) => x * x, 0, 2, 100)).toBeCloseTo(8 / 3, 6)
  })

  it('diskVolume: f(x)=x 绕 x 轴在 [0,h] 得圆锥 V=πh³/3', () => {
    const h = 2
    expect(diskVolume((x) => x, 0, h, 400)).toBeCloseTo((Math.PI * h ** 3) / 3, 3)
  })

  it('diskVolume: f(x)=r 常函数得圆柱 V=πr²·L', () => {
    const r = 3
    expect(diskVolume(() => r, 0, 5, 200)).toBeCloseTo(Math.PI * r * r * 5, 4)
  })

  it('shellVolume 与 diskVolume 对同一图形结果一致', () => {
    for (const c of FUNCTIONS) {
      const b = 2
      const disk = diskVolume(c.fn, 0, b, 600)
      const shell = shellVolume(c.fn, 0, b, 600)
      // 壳层法为数值离散，允许 3% 相对误差
      expect(Math.abs(disk - shell)).toBeLessThan(disk * 0.03 + 0.05)
    }
  })

  it('maxValue 找到区间最大值', () => {
    expect(maxValue((x) => x, 0, 4, 100)).toBeCloseTo(4, 2)
    expect(maxValue((x) => 0.4 * x * (4 - x), 0, 4, 400)).toBeCloseTo(1.6, 1)
  })

  it('lengthAtHeight: y=0 时长度等于整个区间', () => {
    expect(lengthAtHeight((x) => x, 0, 4, 0, 400)).toBeCloseTo(4, 1)
  })

  it('FUNCTIONS/INTERVALS 常量可用且非负', () => {
    expect(FUNCTIONS.length).toBeGreaterThanOrEqual(3)
    expect(INTERVALS.length).toBeGreaterThanOrEqual(2)
    for (const c of FUNCTIONS) {
      expect(c.fn(1)).toBeGreaterThanOrEqual(0)
    }
  })
})
