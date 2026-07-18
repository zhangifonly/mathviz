import { describe, it, expect } from 'vitest'
import {
  invertPoint, invertCircle, invertLine, invertShape, sampleShape,
  DEMO_SHAPES, ORIGIN, INVERSION_RADIUS,
  type CircleShape, type LineShape,
} from './inversiveGeometry'

const O = { x: 0, y: 0 }
const R = 10

describe('反演几何', () => {
  it('invertPoint 满足 |OP\'|*|OP|=R^2 且同向', () => {
    const p = { x: 4, y: 0 }
    const q = invertPoint(p, O, R)
    const dp = Math.hypot(p.x, p.y)
    const dq = Math.hypot(q.x, q.y)
    expect(dp * dq).toBeCloseTo(R * R, 6)
    // 同向：反演像在 O->P 射线上
    expect(q.x).toBeGreaterThan(0)
    expect(q.y).toBeCloseTo(0, 6)
  })

  it('invertPoint 是对合：反演两次回到原点', () => {
    const p = { x: 3, y: 5 }
    const back = invertPoint(invertPoint(p, O, R), O, R)
    expect(back.x).toBeCloseTo(p.x, 6)
    expect(back.y).toBeCloseTo(p.y, 6)
  })

  it('反演中心 O 映射到无穷远', () => {
    const q = invertPoint(O, O, R)
    expect(q.x).toBe(Infinity)
    expect(q.y).toBe(Infinity)
  })

  it('过 O 的圆反演成直线', () => {
    const c: CircleShape = { kind: 'circle', cx: 5, cy: 0, r: 5 } // 过原点
    const img = invertShape(c, O, R)
    expect(img.kind).toBe('line')
  })

  it('不过 O 的圆反演成圆，且采样点逐点吻合', () => {
    const c: CircleShape = { kind: 'circle', cx: 20, cy: 0, r: 5 }
    const img = invertCircle(c, O, R)
    expect(img.kind).toBe('circle')
    for (const pt of sampleShape(c, 8)) {
      const ip = invertPoint(pt, O, R)
      const ic = img as CircleShape
      expect(Math.hypot(ip.x - ic.cx, ip.y - ic.cy)).toBeCloseTo(ic.r, 4)
    }
  })

  it('不过 O 的直线反演成过 O 的圆', () => {
    const l: LineShape = { kind: 'line', nx: 1, ny: 0, c: 4 }
    const img = invertLine(l, O, R) as CircleShape
    expect(img.kind).toBe('circle')
    // 该圆过反演中心 O
    expect(Math.hypot(img.cx - O.x, img.cy - O.y)).toBeCloseTo(img.r, 6)
  })

  it('过 O 的直线反演为自身', () => {
    const l: LineShape = { kind: 'line', nx: 0, ny: 1, c: 0 }
    const img = invertLine(l, O, R)
    expect(img.kind).toBe('line')
  })

  it('DEMO_SHAPES 全部可反演且常量就绪', () => {
    expect(INVERSION_RADIUS).toBeGreaterThan(0)
    expect(ORIGIN).toEqual({ x: 0, y: 0 })
    for (const s of DEMO_SHAPES) {
      const img = invertShape(s, O, R)
      expect(img.kind === 'circle' || img.kind === 'line').toBe(true)
    }
  })
})
