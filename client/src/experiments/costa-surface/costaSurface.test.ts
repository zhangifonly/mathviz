import { describe, it, expect } from 'vitest'
import {
  costaModel, fourFoldGap, periodGap, waistRadius, flareRatio,
  GENUS, END_COUNT, EULER_CHARACTERISTIC, SYMMETRY_ORDER,
  CLASSICAL_THREE, COSTA_INFO, PRESETS, U_RANGE, V_RANGE,
} from './costaSurface'

describe('科斯塔曲面 - 拓扑不变量', () => {
  it('亏格 1, 三个端', () => {
    expect(GENUS).toBe(1)
    expect(END_COUNT).toBe(3)
  })

  it('欧拉示性数 χ = 2 − 2g − n = −3', () => {
    expect(EULER_CHARACTERISTIC).toBe(-3)
    expect(EULER_CHARACTERISTIC).toBe(2 - 2 * GENUS - END_COUNT)
  })

  it('与经典三种曲面的区别: 亏格不为零', () => {
    for (const s of CLASSICAL_THREE) {
      expect(s.genus).toBe(0)
    }
    expect(COSTA_INFO.genus).toBe(1)
    // 这正是它成为「第四种」的原因。用 Number() 拆掉字面量类型,
    // 否则 tsc 认为 0 与 1 无重叠而拒绝这个比较
    const costaGenus: number = COSTA_INFO.genus
    expect(CLASSICAL_THREE.every((s) => Number(s.genus) !== costaGenus)).toBe(true)
  })

  it('经典三种各自的端点数与史实一致', () => {
    const plane = CLASSICAL_THREE.find((s) => s.name === '平面')
    const catenoid = CLASSICAL_THREE.find((s) => s.name === '悬链面')
    expect(plane?.ends).toBe(1)
    expect(catenoid?.ends).toBe(2)
    expect(catenoid?.year).toContain('1744')
  })

  it('科斯塔曲面的端点数多于经典三种中的任何一个', () => {
    for (const s of CLASSICAL_THREE) {
      expect(COSTA_INFO.ends).toBeGreaterThan(s.ends)
    }
  })

  it('四重对称', () => {
    expect(SYMMETRY_ORDER).toBe(4)
  })
})

describe('科斯塔曲面 - 结构模型', () => {
  const samples: Array<[number, number]> = [
    [0.3, 0.4], [1.5, -0.6], [3.0, 0.8], [5.0, -0.2],
  ]

  it('u 方向是 2π 周期的(曲面闭合)', () => {
    for (const [u, v] of samples) {
      expect(periodGap(u, v)).toBeLessThan(1e-12)
    }
  })

  it('四重对称: 转 π/2 后到轴距离不变', () => {
    for (const [u, v] of samples) {
      expect(fourFoldGap(u, v)).toBeLessThan(1e-12)
    }
  })

  it('转 π 与转 3π/2 同样保持半径(四重对称群)', () => {
    for (const [u, v] of samples) {
      const base = Math.hypot(...costaModel(u, v).slice(0, 2))
      for (const d of [Math.PI, (3 * Math.PI) / 2]) {
        const r = Math.hypot(...costaModel(u + d, v).slice(0, 2))
        expect(r).toBeCloseTo(base, 10)
      }
    }
  })

  it('腰部半径随 u 呈四叶变化(四个极大四个极小)', () => {
    // cos(4u) 在 u=0, π/2, π, 3π/2 取极大
    for (const u of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
      expect(waistRadius(u)).toBeCloseTo(0.55 * 1.28, 10)
    }
    // 在 u=π/4 等处取极小
    for (const u of [Math.PI / 4, (3 * Math.PI) / 4]) {
      expect(waistRadius(u)).toBeCloseTo(0.55 * 0.72, 10)
    }
  })

  it('端部向外张开: |v|=1 处半径大于腰部', () => {
    for (const u of [0.3, 1.7, 4.2]) {
      const waist = Math.hypot(...costaModel(u, 0).slice(0, 2))
      const end = Math.hypot(...costaModel(u, 1).slice(0, 2))
      expect(end).toBeGreaterThan(waist)
    }
  })

  it('张开比 = 1 + flare', () => {
    expect(flareRatio(1.35)).toBeCloseTo(2.35, 10)
    expect(flareRatio(0)).toBe(1)
  })

  it('关于 xy 平面对称(v 取反只翻转 z)', () => {
    for (const [u, v] of samples) {
      const a = costaModel(u, v)
      const b = costaModel(u, -v)
      expect(b[0]).toBeCloseTo(a[0], 12)
      expect(b[1]).toBeCloseTo(a[1], 12)
      expect(b[2]).toBeCloseTo(-a[2], 12)
    }
  })

  it('neckR 线性缩放水平半径, 不动 z', () => {
    for (const [u, v] of samples) {
      const a = costaModel(u, v, 0.5, 1.35)
      const b = costaModel(u, v, 1.0, 1.35)
      expect(Math.hypot(b[0], b[1])).toBeCloseTo(Math.hypot(a[0], a[1]) * 2, 10)
      expect(b[2]).toBeCloseTo(a[2], 12)
    }
  })

  it('flare 越大端部张开越明显', () => {
    const ratios = [0.8, 1.35, 2].map((f) => {
      const waist = Math.hypot(...costaModel(0.5, 0, 0.55, f).slice(0, 2))
      const end = Math.hypot(...costaModel(0.5, 1, 0.55, f).slice(0, 2))
      return end / waist
    })
    for (let i = 1; i < ratios.length; i++) {
      expect(ratios[i]).toBeGreaterThan(ratios[i - 1])
    }
  })

  it('参数域内坐标全部有限', () => {
    for (const u of U_RANGE) {
      for (const v of V_RANGE) {
        expect(costaModel(u, v).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('PRESETS 的 neckR 与 flare 都递增', () => {
    for (let i = 1; i < PRESETS.length; i++) {
      expect(PRESETS[i].neckR).toBeGreaterThan(PRESETS[i - 1].neckR)
      expect(PRESETS[i].flare).toBeGreaterThan(PRESETS[i - 1].flare)
    }
  })
})
