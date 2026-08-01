import { describe, it, expect } from 'vitest'
import {
  monkeySaddle, realPart, polarForm, gradient, hessian, hessianDet,
  signChanges, gaussianCurvature, PRESETS, U_RANGE, V_RANGE,
} from './monkeySaddle'

describe('猴鞍面', () => {
  it('n=3 时就是 z = x³ − 3xy²', () => {
    for (const [x, y] of [[1, 0], [0.5, 0.3], [-0.7, 0.9], [0.2, -1.1]]) {
      expect(realPart(x, y, 3)).toBeCloseTo(x ** 3 - 3 * x * y * y, 12)
    }
  })

  it('n=2 时退化为普通鞍面 z = x² − y²', () => {
    for (const [x, y] of [[0.8, 0.4], [-1.1, 0.6]]) {
      expect(realPart(x, y, 2)).toBeCloseTo(x * x - y * y, 12)
    }
  })

  it('直角坐标与极坐标形式完全一致', () => {
    for (const n of [2, 3, 4]) {
      for (let i = 1; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          const r = 0.1 + (1.1 * i) / 20
          const th = (2 * Math.PI * j) / 20
          const rect = realPart(r * Math.cos(th), r * Math.sin(th), n)
          expect(rect).toBeCloseTo(polarForm(r, th, n), 10)
        }
      }
    }
  })

  it('原点是临界点: 一阶偏导全为零', () => {
    for (const n of [2, 3, 4]) {
      const [zx, zy] = gradient(0, 0, n)
      expect(Math.abs(zx)).toBeLessThan(1e-8)
      expect(Math.abs(zy)).toBeLessThan(1e-8)
    }
  })

  it('猴鞍面原点是退化临界点: Hesse 矩阵全为零', () => {
    const [zxx, zxy, zyy] = hessian(0, 0, 3)
    expect(Math.abs(zxx)).toBeLessThan(1e-6)
    expect(Math.abs(zxy)).toBeLessThan(1e-6)
    expect(Math.abs(zyy)).toBeLessThan(1e-6)
    expect(Math.abs(hessianDet(0, 0, 3))).toBeLessThan(1e-6)
  })

  it('普通鞍面原点 Hesse 行列式为 -4, 二阶判别法有效', () => {
    expect(hessianDet(0, 0, 2)).toBeCloseTo(-4, 4)
    const [zxx, , zyy] = hessian(0, 0, 2)
    expect(zxx).toBeCloseTo(2, 4)
    expect(zyy).toBeCloseTo(-2, 4)
  })

  it('n 重鞍面沿单位圆符号变化 2n 次', () => {
    expect(signChanges(2)).toBe(4)
    expect(signChanges(3)).toBe(6)
    expect(signChanges(4)).toBe(8)
  })

  it('三重对称: 转 120° 后高度完全复原', () => {
    for (const th of [0.3, 1.1, 2.5, 4.0]) {
      expect(polarForm(1, th, 3)).toBeCloseTo(polarForm(1, th + (2 * Math.PI) / 3, 3), 10)
      expect(polarForm(1, th, 3)).toBeCloseTo(polarForm(1, th + (4 * Math.PI) / 3, 3), 10)
    }
  })

  it('转 60° 上下坡交替(符号反转)', () => {
    for (const th of [0.2, 0.9, 1.7]) {
      const a = polarForm(1, th, 3)
      const b = polarForm(1, th + Math.PI / 3, 3)
      expect(Math.sign(a)).toBe(-Math.sign(b))
    }
  })

  it('三个上坡方向: θ = 0, 120°, 240° 处取到极大', () => {
    for (const th of [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]) {
      expect(polarForm(1, th, 3)).toBeCloseTo(1, 10)
    }
  })

  it('三个下坡方向: θ = 60°, 180°, 300° 处取到极小', () => {
    for (const th of [Math.PI / 3, Math.PI, (5 * Math.PI) / 3]) {
      expect(polarForm(1, th, 3)).toBeCloseTo(-1, 10)
    }
  })

  it('除原点外高斯曲率为负', () => {
    for (const [x, y] of [[0.5, 0.3], [-0.8, 0.6], [1, 1], [0.2, -0.9]]) {
      expect(gaussianCurvature(x, y, 3)).toBeLessThan(0)
    }
  })

  it('monkeySaddle 返回的 x,y 就是输入值', () => {
    const p = monkeySaddle(0.6, -0.4)
    expect(p[0]).toBe(0.6)
    expect(p[1]).toBe(-0.4)
    expect(p[2]).toBeCloseTo(0.6 ** 3 - 3 * 0.6 * 0.16, 12)
  })

  it('参数域内坐标全部有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(monkeySaddle(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 覆盖 2/3/4 重鞍面', () => {
    expect(PRESETS.map((p) => p.order)).toEqual([2, 3, 4])
  })
})
