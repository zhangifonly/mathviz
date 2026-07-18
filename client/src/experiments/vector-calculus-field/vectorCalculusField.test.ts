import { describe, it, expect } from 'vitest'
import {
  curl,
  isConservative,
  workAlongPath,
  potentialWork,
  straightPath,
  cornerPath,
  FIELDS,
  START,
  END,
} from './vectorCalculusField'

const grad = FIELDS[0]
const rot = FIELDS[1]

describe('保守场与势函数', () => {
  it('梯度场旋度处处近零，旋转场旋度约为 2', () => {
    expect(Math.abs(curl(grad, 0.3, -0.7))).toBeLessThan(1e-3)
    expect(curl(rot, 0.3, -0.7)).toBeCloseTo(2, 3)
  })

  it('isConservative 正确区分两种场', () => {
    expect(isConservative(grad)).toBe(true)
    expect(isConservative(rot)).toBe(false)
  })

  it('保守场做功与路径无关：直线与折线相等', () => {
    const wLine = workAlongPath(grad, straightPath(START, END))
    const wCorner = workAlongPath(grad, cornerPath(START, END))
    expect(wLine).toBeCloseTo(wCorner, 4)
  })

  it('保守场线积分等于势函数差', () => {
    const wLine = workAlongPath(grad, straightPath(START, END, 400))
    expect(wLine).toBeCloseTo(potentialWork(grad, START, END), 3)
  })

  it('非保守场做功依赖路径：两条路径不相等', () => {
    const wLine = workAlongPath(rot, straightPath(START, END))
    const wCorner = workAlongPath(rot, cornerPath(START, END))
    expect(Math.abs(wLine - wCorner)).toBeGreaterThan(0.1)
  })

  it('非保守场没有势函数时 potentialWork 抛错', () => {
    expect(() => potentialWork(rot, START, END)).toThrow()
  })

  it('straightPath / cornerPath 端点正确', () => {
    const sp = straightPath(START, END, 10)
    expect(sp[0]).toEqual(START)
    expect(sp[sp.length - 1]).toEqual(END)
    const cp = cornerPath(START, END, 10)
    expect(cp[0]).toEqual(START)
    expect(cp[cp.length - 1]).toEqual(END)
  })
})
