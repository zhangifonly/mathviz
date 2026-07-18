import { describe, it, expect } from 'vitest'
import { doubleIntegral, valueRange, FUNCTIONS, DOMAINS, GRID_SIZES } from './multipleIntegral'

describe('二重积分', () => {
  it('常函数 f=1 的体积等于矩形域面积', () => {
    const r = doubleIntegral(() => 1, 0, 2, 0, 3, 10)
    expect(r.volume).toBeCloseTo(6, 6)
    expect(r.cells.length).toBe(100)
  })

  it('中点法对线性函数精确：f=x+y 在 [0,2]² 上体积为 8', () => {
    // ∫∫(x+y) over [0,2]² = 8，中点法对一次函数精确
    const r = doubleIntegral((x, y) => x + y, 0, 2, 0, 2, 4)
    expect(r.volume).toBeCloseTo(8, 6)
  })

  it('网格越密越接近真实值：f=4-x²-y² 在 [-1,1]² 上应趋近 40/3', () => {
    const exact = 40 / 3
    const coarse = doubleIntegral((x, y) => 4 - x * x - y * y, -1, 1, -1, 1, 4)
    const fine = doubleIntegral((x, y) => 4 - x * x - y * y, -1, 1, -1, 1, 64)
    expect(Math.abs(fine.volume - exact)).toBeLessThan(Math.abs(coarse.volume - exact))
    expect(fine.volume).toBeCloseTo(exact, 2)
  })

  it('dx/dy/dA 与单元数量正确', () => {
    const r = doubleIntegral(() => 1, 0, 4, 0, 2, 8)
    expect(r.dx).toBeCloseTo(0.5, 10)
    expect(r.dy).toBeCloseTo(0.25, 10)
    expect(r.dA).toBeCloseTo(0.125, 10)
    expect(r.cells.length).toBe(64)
  })

  it('单元中心落在各自小格内', () => {
    const r = doubleIntegral(() => 0, 0, 2, 0, 2, 2)
    for (const c of r.cells) {
      expect(c.cx).toBeGreaterThan(c.i)
      expect(c.cx).toBeLessThan(c.i + 1)
      expect(c.cy).toBeGreaterThan(c.j)
      expect(c.cy).toBeLessThan(c.j + 1)
    }
  })

  it('valueRange 返回最小最大取值', () => {
    const r = doubleIntegral((x, y) => x + y, 0, 2, 0, 2, 4)
    const [lo, hi] = valueRange(r.cells)
    expect(lo).toBeLessThan(hi)
  })

  it('导出常量 FUNCTIONS / DOMAINS / GRID_SIZES 可用', () => {
    expect(FUNCTIONS.length).toBeGreaterThanOrEqual(3)
    expect(DOMAINS.length).toBeGreaterThanOrEqual(3)
    for (const fn of FUNCTIONS) expect(typeof fn.f(0.3, 0.4)).toBe('number')
    for (const d of DOMAINS) expect(d.xb).toBeGreaterThan(d.xa)
    expect(GRID_SIZES).toContain(8)
  })
})
