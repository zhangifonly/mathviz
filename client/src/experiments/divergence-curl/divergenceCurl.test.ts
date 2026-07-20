import { describe, it, expect } from 'vitest'
import {
  FIELDS,
  getField,
  divergence,
  curl,
  sampleField,
  GRID_SIZES,
} from './divergenceCurl'

describe('散度与旋度', () => {
  it('FIELDS 含四种经典场且 id 正确', () => {
    expect(FIELDS.map((f) => f.id)).toEqual(['source', 'rotation', 'shear', 'sink'])
    for (const f of FIELDS) {
      expect(typeof f.fn(0.3, 0.4)[0]).toBe('number')
      expect(f.name.length).toBeGreaterThan(0)
    }
  })

  it('源场 F=[x,y]：散度=2，旋度=0', () => {
    const f = getField('source').fn
    expect(divergence(f, 0.2, 0.5)).toBeCloseTo(2, 3)
    expect(curl(f, 0.2, 0.5)).toBeCloseTo(0, 3)
  })

  it('汇场 F=[-x,-y]：散度=-2（负=汇）', () => {
    const f = getField('sink').fn
    expect(divergence(f, -0.3, 0.6)).toBeCloseTo(-2, 3)
    expect(curl(f, -0.3, 0.6)).toBeCloseTo(0, 3)
  })

  it('旋转场 F=[-y,x]：散度=0，旋度=2（纯旋度）', () => {
    const f = getField('rotation').fn
    expect(divergence(f, 0.4, -0.1)).toBeCloseTo(0, 3)
    expect(curl(f, 0.4, -0.1)).toBeCloseTo(2, 3)
  })

  it('剪切场 F=[y,0]：散度=0，旋度=-1', () => {
    const f = getField('shear').fn
    expect(divergence(f, 0.1, 0.7)).toBeCloseTo(0, 3)
    expect(curl(f, 0.1, 0.7)).toBeCloseTo(-1, 3)
  })

  it('sampleField 网格数量正确，向量与模长一致', () => {
    const f = getField('rotation').fn
    const arrows = sampleField(f, 7)
    expect(arrows.length).toBe(49)
    for (const a of arrows) {
      expect(a.mag).toBeCloseTo(Math.hypot(a.u, a.v), 6)
      expect(a.x).toBeGreaterThanOrEqual(-1)
      expect(a.x).toBeLessThanOrEqual(1)
    }
  })

  it('getField 未知 id 抛错；GRID_SIZES 均可采样', () => {
    // @ts-expect-error 故意传非法 id
    expect(() => getField('nope')).toThrow()
    for (const g of GRID_SIZES) {
      expect(sampleField(getField('source').fn, g).length).toBe(g * g)
    }
  })
})
