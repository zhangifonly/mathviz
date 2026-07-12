import { describe, it, expect } from 'vitest'
import {
  FIELD_OPTIONS,
  getField,
  lineIntegralCircle,
  curlIntegralDisk,
  diskArea,
} from './greenTheorem'

describe('格林公式数值内核', () => {
  it('旋转场 (-y, x): 线积分 = 2 倍面积 = 2πR²', () => {
    const f = getField('rotation')
    const R = 1.5
    const li = lineIntegralCircle(f, R)
    expect(li).toBeCloseTo(2 * Math.PI * R * R, 3)
  })

  it('面积场 (0, x): 线积分 = 圆盘面积 πR²', () => {
    const f = getField('area')
    const R = 2
    const li = lineIntegralCircle(f, R)
    expect(li).toBeCloseTo(diskArea(R), 3)
  })

  it('保守场 (x, y): 旋度为零, 闭曲线积分为零', () => {
    const f = getField('conservative')
    const li = lineIntegralCircle(f, 1.2)
    expect(Math.abs(li)).toBeLessThan(1e-6)
  })

  it('格林公式恒等式: 线积分 = 旋度二重积分 (对所有场)', () => {
    const R = 1.3
    for (const f of FIELD_OPTIONS) {
      const li = lineIntegralCircle(f, R)
      const di = curlIntegralDisk(f, R)
      expect(li).toBeCloseTo(di, 2)
    }
  })

  it('剪切场 (y², x²): 旋度 2x-2y 在圆盘上按奇对称积分为零', () => {
    const f = getField('shear')
    const di = curlIntegralDisk(f, 1)
    expect(Math.abs(di)).toBeLessThan(1e-3)
  })

  it('curl 解析值: 旋转场恒 2, 保守场恒 0, 剪切场 2x-2y', () => {
    expect(getField('rotation').curl(3, 7)).toBe(2)
    expect(getField('conservative').curl(3, 7)).toBe(0)
    expect(getField('shear').curl(3, 1)).toBe(2 * 3 - 2 * 1)
  })

  it('getField 未知 id 回退到第一个场', () => {
    expect(getField('nope').id).toBe(FIELD_OPTIONS[0].id)
  })

  it('FIELD_OPTIONS 每项字段完整且函数可调用', () => {
    expect(FIELD_OPTIONS.length).toBeGreaterThanOrEqual(4)
    for (const f of FIELD_OPTIONS) {
      expect(f.id).toBeTruthy()
      expect(f.label).toBeTruthy()
      expect(f.note).toBeTruthy()
      expect(typeof f.P(1, 1)).toBe('number')
      expect(typeof f.Q(1, 1)).toBe('number')
      expect(typeof f.curl(1, 1)).toBe('number')
    }
  })
})
