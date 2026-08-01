import { describe, it, expect } from 'vitest'
import {
  cmul, cdiv, cpow, boyFromComplex, boySurface, antipodalGap,
  threefoldRadiusGap, BRANCH_POINTS, TRIPLE_POINTS, IMMERSIONS,
  EULER_CHARACTERISTIC, ORIENTABLE, U_RANGE, V_RANGE, type Complex,
} from './boySurface'

describe('博伊曲面 - 复数工具', () => {
  it('cmul 满足 i² = -1', () => {
    expect(cmul([0, 1], [0, 1])[0]).toBeCloseTo(-1, 12)
    expect(cmul([0, 1], [0, 1])[1]).toBeCloseTo(0, 12)
  })

  it('cdiv 是 cmul 的逆运算', () => {
    const a: Complex = [1.3, -0.7]
    const b: Complex = [0.4, 2.1]
    const q = cdiv(a, b)
    const back = cmul(q, b)
    expect(back[0]).toBeCloseTo(a[0], 10)
    expect(back[1]).toBeCloseTo(a[1], 10)
  })

  it('cdiv 除零有安全兜底', () => {
    expect(cdiv([1, 1], [0, 0])).toEqual([0, 0])
  })

  it('cpow 与反复相乘一致', () => {
    const w: Complex = [0.6, 0.4]
    let m: Complex = [1, 0]
    for (let i = 0; i < 6; i++) m = cmul(m, w)
    expect(cpow(w, 6)[0]).toBeCloseTo(m[0], 12)
    expect(cpow(w, 6)[1]).toBeCloseTo(m[1], 12)
  })

  it('cpow(w,0) 为 1', () => {
    expect(cpow([2.5, -1.1], 0)).toEqual([1, 0])
  })
})

describe('博伊曲面 - 几何性质', () => {
  it('是 RP² 的浸入: 边界上 w 与 -w 映到同一点', () => {
    for (const th of [0.3, 1.1, 2.2, 4.0, 5.5]) {
      expect(antipodalGap(th)).toBeLessThan(1e-9)
    }
  })

  it('三重旋转对称: 转 120° 后到原点距离不变', () => {
    for (const r of [0.3, 0.6, 0.9]) {
      for (const th of [0.4, 1.7, 3.1]) {
        expect(threefoldRadiusGap(th, r)).toBeLessThan(1e-9)
      }
    }
  })

  it('转 240° 同样保持半径(三重对称群)', () => {
    for (const th of [0.5, 2.3]) {
      const p = boySurface(th, 0.7)
      const q = boySurface(th + (4 * Math.PI) / 3, 0.7)
      expect(Math.hypot(...p)).toBeCloseTo(Math.hypot(...q), 9)
    }
  })

  it('圆盘内处处有限, 无奇点', () => {
    for (let i = 0; i <= 30; i++) {
      for (let j = 0; j <= 30; j++) {
        const p = boySurface((2 * Math.PI * j) / 30, (0.999 * i) / 30)
        expect(p.every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('像点被限制在有界区域内', () => {
    let maxR = 0
    for (let i = 0; i <= 40; i++) {
      for (let j = 0; j <= 40; j++) {
        const p = boySurface((2 * Math.PI * j) / 40, (0.999 * i) / 40)
        maxR = Math.max(maxR, Math.hypot(...p))
      }
    }
    expect(maxR).toBeLessThan(3)
    expect(maxR).toBeGreaterThan(0.5)
  })

  it('r 超出 1 时被夹住, 不产生发散', () => {
    const a = boySurface(0.8, 1.5)
    const b = boySurface(0.8, 0.999)
    expect(a.every(Number.isFinite)).toBe(true)
    a.forEach((c, i) => expect(c).toBeCloseTo(b[i], 12))
  })

  it('没有分支点 —— 区别于交叉帽与罗马曲面的关键', () => {
    expect(BRANCH_POINTS).toBe(0)
    expect(TRIPLE_POINTS).toBe(1)
  })

  it('三种浸入的分支点数依次为 2 / 6 / 0', () => {
    expect(IMMERSIONS.map((x) => x.branch)).toEqual([2, 6, 0])
    expect(IMMERSIONS.find((x) => x.name === '博伊曲面')?.branch).toBe(0)
  })

  it('射影平面: 欧拉示性数为 1 且不可定向', () => {
    expect(EULER_CHARACTERISTIC).toBe(1)
    expect(ORIENTABLE).toBe(false)
  })

  it('参数域常量取值合理', () => {
    expect(U_RANGE[1]).toBeCloseTo(2 * Math.PI, 10)
    expect(V_RANGE[0]).toBe(0)
    expect(V_RANGE[1]).toBeLessThan(1)
  })

  it('原点参数 w=0 给出有限点', () => {
    expect(boyFromComplex([0, 0]).every(Number.isFinite)).toBe(true)
  })
})
