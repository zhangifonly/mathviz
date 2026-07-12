import { describe, it, expect } from 'vitest'
import { makeSites, dist2, nearestSite, SITE_COUNTS } from './voronoi'

describe('沃罗诺伊图', () => {
  it('makeSites 生成指定数量站点，坐标在范围内', () => {
    const sites = makeSites(16, 600, 400, 1)
    expect(sites.length).toBe(16)
    for (const s of sites) {
      expect(s.x).toBeGreaterThanOrEqual(0)
      expect(s.x).toBeLessThanOrEqual(600)
      expect(s.y).toBeGreaterThanOrEqual(0)
      expect(s.y).toBeLessThanOrEqual(400)
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('makeSites 同种子可复现，不同种子不同', () => {
    const a = makeSites(8, 600, 400, 42)
    const b = makeSites(8, 600, 400, 42)
    const c = makeSites(8, 600, 400, 99)
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  it('dist2 计算正确', () => {
    expect(dist2(0, 0, 3, 4)).toBe(25)
    expect(dist2(1, 1, 1, 1)).toBe(0)
  })

  it('nearestSite: 站点自身位置最近的是自己', () => {
    const sites = makeSites(10, 600, 400, 7)
    for (let i = 0; i < sites.length; i++) {
      expect(nearestSite(sites, sites[i].x, sites[i].y)).toBe(i)
    }
  })

  it('nearestSite: 明确两点时归属正确', () => {
    const sites = [
      { x: 0, y: 0, color: '#000000' },
      { x: 100, y: 0, color: '#ffffff' },
    ]
    expect(nearestSite(sites, 10, 0)).toBe(0)
    expect(nearestSite(sites, 90, 0)).toBe(1)
    expect(nearestSite(sites, 49, 0)).toBe(0)
  })

  it('SITE_COUNTS 都能正常生成', () => {
    for (const n of SITE_COUNTS) {
      expect(makeSites(n, 500, 500, 1).length).toBe(n)
    }
  })
})
