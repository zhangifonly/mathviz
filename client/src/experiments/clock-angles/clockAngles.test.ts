import { describe, it, expect } from 'vitest'
import {
  hourHandAngle,
  minuteHandAngle,
  angleBetween,
  isRightAngle,
  TIME_OPTIONS,
} from './clockAngles'

describe('时钟与角度', () => {
  it('分针角度：每分钟 6 度', () => {
    expect(minuteHandAngle(0)).toBe(0)
    expect(minuteHandAngle(15)).toBe(90)
    expect(minuteHandAngle(30)).toBe(180)
    expect(minuteHandAngle(45)).toBe(270)
  })

  it('时针角度：整点每小时 30 度', () => {
    expect(hourHandAngle(0, 0)).toBe(0)
    expect(hourHandAngle(3, 0)).toBe(90)
    expect(hourHandAngle(6, 0)).toBe(180)
    expect(hourHandAngle(12, 0)).toBe(0)
  })

  it('时针每分钟额外走 0.5 度', () => {
    // 3:30 时针应在 90 + 30*0.5 = 105 度
    expect(hourHandAngle(3, 30)).toBe(105)
  })

  it('3:00 夹角为 90 度（标准直角）', () => {
    expect(angleBetween(3, 0)).toBe(90)
    expect(isRightAngle(3, 0)).toBe(true)
  })

  it('6:00 夹角为 180 度', () => {
    expect(angleBetween(6, 0)).toBe(180)
  })

  it('12:00 两针重合，夹角为 0 度', () => {
    expect(angleBetween(12, 0)).toBe(0)
  })

  it('夹角恒在 0 到 180 度之间', () => {
    for (let h = 0; h < 12; h++)
      for (let m = 0; m < 60; m++) {
        const a = angleBetween(h, m)
        expect(a).toBeGreaterThanOrEqual(0)
        expect(a).toBeLessThanOrEqual(180)
      }
  })

  it('输入越界会被归一化（负数与超范围）', () => {
    expect(minuteHandAngle(60)).toBe(0)
    expect(minuteHandAngle(-15)).toBe(270)
    expect(hourHandAngle(15, 0)).toBe(90)
  })

  it('3:15 夹角为 7.5 度', () => {
    // 分针 90 度，时针 90 + 15*0.5 = 97.5 度，差 7.5
    expect(angleBetween(3, 15)).toBeCloseTo(7.5, 9)
  })

  it('TIME_OPTIONS 都在合法范围且夹角有效', () => {
    for (const opt of TIME_OPTIONS) {
      expect(opt.hour).toBeGreaterThanOrEqual(0)
      expect(opt.hour).toBeLessThanOrEqual(12)
      expect(opt.minute).toBeGreaterThanOrEqual(0)
      expect(opt.minute).toBeLessThan(60)
      const a = angleBetween(opt.hour, opt.minute)
      expect(a).toBeGreaterThanOrEqual(0)
      expect(a).toBeLessThanOrEqual(180)
    }
  })
})
