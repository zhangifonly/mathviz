import { describe, it, expect } from 'vitest'
import {
  kleinFigure8, figure8Section, gluingGap, naiveGap, sectionRotation,
  sectionSelfIntersections, EULER_CHARACTERISTIC, ORIENTABLE, COMPARISON,
  PRESETS, U_RANGE, V_RANGE,
} from './kleinBottleFigure8'

describe('8 字形克莱因瓶', () => {
  const samples: Array<[number, number]> = [
    [0.3, 0.7], [1.5, 2.0], [3.0, 4.5], [5.0, 1.2],
  ]

  it('克莱因瓶的粘合关系 (u,v) ~ (u+2π, −v) 精确成立', () => {
    for (const a of [1.6, 2, 2.6]) {
      for (const [u, v] of samples) {
        expect(gluingGap(u, v, a)).toBeLessThan(1e-12)
      }
    }
  })

  it('朴素闭合(不翻转 v)不成立 —— 这正是不可定向的来源', () => {
    for (const [u, v] of samples) {
      expect(naiveGap(u, v)).toBeGreaterThan(1)
    }
  })

  it('v 方向是 2π 周期的', () => {
    for (const [u, v] of samples) {
      const p = kleinFigure8(u, v)
      const q = kleinFigure8(u, v + 2 * Math.PI)
      expect(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])).toBeLessThan(1e-12)
    }
  })

  it('8 字截面就是 (sin v, sin 2v)', () => {
    for (const v of [0.4, 1.1, 2.8, 5.0]) {
      expect(figure8Section(v)).toEqual([Math.sin(v), Math.sin(2 * v)])
    }
  })

  it('8 字截面在 v=0 与 v=π 处自交(都到原点)', () => {
    for (const v of sectionSelfIntersections()) {
      const [s, t] = figure8Section(v)
      expect(Math.abs(s)).toBeLessThan(1e-12)
      expect(Math.abs(t)).toBeLessThan(1e-12)
    }
  })

  it('同一 u 下 v=0 与 v=π 映到同一点(截面自交的后果)', () => {
    for (const u of [0.5, 2.0, 4.0]) {
      const p = kleinFigure8(u, 0)
      const q = kleinFigure8(u, Math.PI)
      expect(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])).toBeLessThan(1e-12)
    }
  })

  it('截面转角为 u/2: 绕一整圈只翻半圈', () => {
    expect(sectionRotation(0)).toBe(0)
    expect(sectionRotation(2 * Math.PI)).toBeCloseTo(Math.PI, 12)
    expect(sectionRotation(4 * Math.PI)).toBeCloseTo(2 * Math.PI, 12)
  })

  it('8 字截面的取值范围有界', () => {
    for (let i = 0; i <= 100; i++) {
      const [s, t] = figure8Section((2 * Math.PI * i) / 100)
      expect(Math.abs(s)).toBeLessThanOrEqual(1)
      expect(Math.abs(t)).toBeLessThanOrEqual(1)
    }
  })

  it('a 只平移径向, 不改变竖直坐标', () => {
    for (const [u, v] of samples) {
      const p1 = kleinFigure8(u, v, 2)
      const p2 = kleinFigure8(u, v, 3)
      expect(p2[2]).toBeCloseTo(p1[2], 12)
      // 径向距离差恰为 a 的差
      const r1 = Math.hypot(p1[0], p1[1])
      const r2 = Math.hypot(p2[0], p2[1])
      expect(r2 - r1).toBeCloseTo(1, 10)
    }
  })

  it('χ = 0 与环面相同, 但不可定向 —— 这是关键区别', () => {
    expect(EULER_CHARACTERISTIC).toBe(0)
    expect(ORIENTABLE).toBe(false)
    const torus = COMPARISON.find((c) => c.name === '环面')
    const klein = COMPARISON.find((c) => c.name === '克莱因瓶')
    expect(torus?.euler).toBe(klein?.euler)
    expect(torus?.orientable).not.toBe(klein?.orientable)
  })

  it('对比数据只含环面与克莱因瓶两项', () => {
    expect(COMPARISON.length).toBe(2)
    expect(COMPARISON.filter((c) => c.orientable).length).toBe(1)
  })

  it('参数域内坐标全部有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(kleinFigure8(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 的 a 递增且为正', () => {
    for (let i = 0; i < PRESETS.length; i++) {
      expect(PRESETS[i].a).toBeGreaterThan(0)
      if (i > 0) expect(PRESETS[i].a).toBeGreaterThan(PRESETS[i - 1].a)
    }
  })
})
