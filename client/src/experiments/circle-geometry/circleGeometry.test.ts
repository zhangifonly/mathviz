import { describe, it, expect } from 'vitest'
import {
  circumference,
  area,
  arcLength,
  sectorArea,
  chordLength,
  inscribedAngle,
  degToRad,
  radToDeg,
  isPointInside,
  circleMeasures,
  CIRCLE_TOPICS,
} from './circleGeometry'

describe('圆的几何', () => {
  it('周长 C = 2πr', () => {
    expect(circumference(1)).toBeCloseTo(2 * Math.PI)
    expect(circumference(0)).toBe(0)
    expect(circumference(5)).toBeCloseTo(10 * Math.PI)
  })

  it('面积 S = πr²', () => {
    expect(area(1)).toBeCloseTo(Math.PI)
    expect(area(0)).toBe(0)
    expect(area(2)).toBeCloseTo(4 * Math.PI)
  })

  it('整圆弧长等于周长', () => {
    const r = 3
    expect(arcLength(r, 2 * Math.PI)).toBeCloseTo(circumference(r))
  })

  it('整圆扇形面积等于圆面积', () => {
    const r = 4
    expect(sectorArea(r, 2 * Math.PI)).toBeCloseTo(area(r))
  })

  it('半圆弧长为周长一半，扇形面积为圆面积一半', () => {
    const r = 2
    expect(arcLength(r, Math.PI)).toBeCloseTo(Math.PI * r)
    expect(sectorArea(r, Math.PI)).toBeCloseTo(area(r) / 2)
  })

  it('直径处弦长等于 2r（θ = π）', () => {
    expect(chordLength(5, Math.PI)).toBeCloseTo(10)
  })

  it('弦长边界：θ = 0 时弦长为 0', () => {
    expect(chordLength(5, 0)).toBeCloseTo(0)
  })

  it('圆周角定理：圆周角是圆心角的一半', () => {
    expect(inscribedAngle(Math.PI)).toBeCloseTo(Math.PI / 2)
    expect(inscribedAngle(degToRad(100))).toBeCloseTo(degToRad(50))
  })

  it('角度与弧度互转', () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI)
    expect(radToDeg(Math.PI)).toBeCloseTo(180)
    expect(radToDeg(degToRad(37))).toBeCloseTo(37)
  })

  it('点在圆内判断（含边界）', () => {
    expect(isPointInside(0, 0, 0, 0, 5)).toBe(true)
    expect(isPointInside(5, 0, 0, 0, 5)).toBe(true) // 边界上
    expect(isPointInside(6, 0, 0, 0, 5)).toBe(false)
    expect(isPointInside(3, 4, 0, 0, 5)).toBe(true) // 3-4-5 恰在圆上
  })

  it('circleMeasures 综合结果自洽', () => {
    const r = 6
    const theta = degToRad(90)
    const m = circleMeasures(r, theta)
    expect(m.circumference).toBeCloseTo(circumference(r))
    expect(m.area).toBeCloseTo(area(r))
    expect(m.arcLength).toBeCloseTo(arcLength(r, theta))
    expect(m.sectorArea).toBeCloseTo(sectorArea(r, theta))
    expect(m.chordLength).toBeCloseTo(chordLength(r, theta))
    expect(m.inscribedAngle).toBeCloseTo(theta / 2)
  })

  it('CIRCLE_TOPICS 选项有效', () => {
    expect(CIRCLE_TOPICS.length).toBeGreaterThan(0)
    const ids = new Set<string>()
    for (const t of CIRCLE_TOPICS) {
      expect(t.id).toBeTruthy()
      expect(t.label).toBeTruthy()
      expect(t.note).toBeTruthy()
      expect(t.angleDeg).toBeGreaterThan(0)
      expect(t.angleDeg).toBeLessThanOrEqual(360)
      expect(ids.has(t.id)).toBe(false)
      ids.add(t.id)
    }
  })
})
