import { describe, it, expect } from 'vitest'
import {
  computeOutCode,
  clipLine,
  INSIDE,
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
  WINDOW,
  SEGMENTS,
} from './lineClipping'

const rect = { xmin: 0, ymin: 0, xmax: 100, ymax: 100 }

describe('Cohen-Sutherland 线段裁剪', () => {
  it('computeOutCode: 窗内点区域码为 0', () => {
    expect(computeOutCode(50, 50, rect)).toBe(INSIDE)
  })

  it('computeOutCode: 各方向位正确', () => {
    expect(computeOutCode(-10, 50, rect)).toBe(LEFT)
    expect(computeOutCode(110, 50, rect)).toBe(RIGHT)
    expect(computeOutCode(50, -10, rect)).toBe(BOTTOM)
    expect(computeOutCode(50, 110, rect)).toBe(TOP)
    expect(computeOutCode(-10, -10, rect)).toBe(LEFT | BOTTOM)
  })

  it('clipLine: 完全在内的线段原样返回', () => {
    const seg = { x1: 20, y1: 20, x2: 80, y2: 80 }
    expect(clipLine(seg, rect)).toEqual(seg)
  })

  it('clipLine: 同侧窗外的线段被拒绝返回 null', () => {
    expect(clipLine({ x1: -50, y1: 10, x2: -10, y2: 90 }, rect)).toBeNull()
    expect(clipLine({ x1: 10, y1: 110, x2: 90, y2: 150 }, rect)).toBeNull()
  })

  it('clipLine: 穿越线段裁到边界上', () => {
    const r = clipLine({ x1: -50, y1: 50, x2: 150, y2: 50 }, rect)
    expect(r).not.toBeNull()
    expect(r!.x1).toBeCloseTo(0)
    expect(r!.x2).toBeCloseTo(100)
    expect(r!.y1).toBeCloseTo(50)
    expect(r!.y2).toBeCloseTo(50)
  })

  it('clipLine: 裁剪结果端点都落在窗内(区域码为0)', () => {
    const r = clipLine({ x1: -20, y1: -20, x2: 120, y2: 120 }, rect)
    expect(r).not.toBeNull()
    expect(computeOutCode(r!.x1, r!.y1, rect)).toBe(INSIDE)
    expect(computeOutCode(r!.x2, r!.y2, rect)).toBe(INSIDE)
  })

  it('SEGMENTS 至少有一条能被 WINDOW 裁出可见部分', () => {
    const visible = SEGMENTS.filter((s) => clipLine(s, WINDOW) !== null)
    expect(visible.length).toBeGreaterThan(0)
  })
})
