import { describe, it, expect } from 'vitest'
import {
  reflectPoint,
  sampleCurve,
  reflectCurve,
  getFunction,
  FUNCTIONS,
} from './inverseFunction'

describe('反函数', () => {
  it('reflectPoint 关于 y=x 交换坐标', () => {
    expect(reflectPoint({ x: 2, y: 5 })).toEqual({ x: 5, y: 2 })
    expect(reflectPoint({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 })
  })

  it('reflectPoint 两次反射回到原点', () => {
    const p = { x: 3, y: -7 }
    expect(reflectPoint(reflectPoint(p))).toEqual(p)
  })

  it('sampleCurve 采样点数量与端点正确', () => {
    const pts = sampleCurve((x) => 2 * x + 1, [-3, 3], 60)
    expect(pts.length).toBe(61)
    expect(pts[0]).toEqual({ x: -3, y: -5 })
    expect(pts[pts.length - 1]).toEqual({ x: 3, y: 7 })
  })

  it('sampleCurve 过滤非有限值', () => {
    const pts = sampleCurve((x) => Math.log(x), [-1, 2], 30)
    for (const p of pts) expect(Number.isFinite(p.y)).toBe(true)
  })

  it('reflectCurve 是原曲线的逐点镜像', () => {
    const src = sampleCurve((x) => x * x * x, [-1.8, 1.8], 40)
    const ref = reflectCurve(src)
    expect(ref.length).toBe(src.length)
    for (let i = 0; i < src.length; i++) {
      expect(ref[i]).toEqual({ x: src[i].y, y: src[i].x })
    }
  })

  it('每个函数 inv(fn(x)) 还原到 x', () => {
    for (const f of FUNCTIONS) {
      const [a, b] = f.domain
      const x = a + (b - a) * 0.37
      expect(f.inv(f.fn(x))).toBeCloseTo(x, 6)
    }
  })

  it('getFunction 按 key 取回，未知 key 回退首项', () => {
    expect(getFunction('exp').key).toBe('exp')
    expect(getFunction('nope')).toBe(FUNCTIONS[0])
  })
})
