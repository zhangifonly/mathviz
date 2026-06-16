import { describe, it, expect } from 'vitest'
import { createField, step, renderToImageData, RD_PRESETS, type GrayScottParams } from './grayScott'

const coral: GrayScottParams = { Du: 0.16, Dv: 0.08, feed: 0.0545, kill: 0.062 }

describe('Gray-Scott 反应扩散', () => {
  it('createField: U 初始全为 1，V 有种子', () => {
    const f = createField(40, 40)
    expect(f.u.length).toBe(1600)
    expect([...f.u].every(x => x === 1)).toBe(true)
    expect([...f.v].some(x => x > 0)).toBe(true)
  })

  it('step 不修改输入场（纯函数）', () => {
    const f = createField(20, 20)
    const uSnap = f.u.slice()
    step(f, coral)
    expect([...f.u]).toEqual([...uSnap])
  })

  it('演化数百步后 U/V 始终保持在 [0,1] 不发散', () => {
    let f = createField(48, 48)
    for (let i = 0; i < 300; i++) f = step(f, coral)
    for (let i = 0; i < f.u.length; i++) {
      expect(f.u[i]).toBeGreaterThanOrEqual(0)
      expect(f.u[i]).toBeLessThanOrEqual(1)
      expect(Number.isFinite(f.v[i])).toBe(true)
      expect(f.v[i]).toBeGreaterThanOrEqual(0)
      expect(f.v[i]).toBeLessThanOrEqual(1)
    }
  })

  it('演化会产生空间图案（V 分布出现高低差异，非均匀）', () => {
    let f = createField(48, 48)
    for (let i = 0; i < 400; i++) f = step(f, coral)
    const vals = [...f.v]
    const max = Math.max(...vals)
    const min = Math.min(...vals)
    expect(max - min).toBeGreaterThan(0.1)
  })

  it('renderToImageData 填满 RGBA 且 alpha 全不透明', () => {
    const f = createField(16, 16)
    const data = new Uint8ClampedArray(16 * 16 * 4)
    renderToImageData(f, data)
    for (let i = 3; i < data.length; i += 4) {
      expect(data[i]).toBe(255)
    }
  })

  it('5 个预设的 feed/kill 均为合理正值且名称唯一', () => {
    for (const p of RD_PRESETS) {
      expect(p.feed).toBeGreaterThan(0)
      expect(p.kill).toBeGreaterThan(0)
      expect(p.feed).toBeLessThan(0.1)
      expect(p.kill).toBeLessThan(0.1)
    }
    expect(new Set(RD_PRESETS.map(p => p.name)).size).toBe(RD_PRESETS.length)
  })
})
