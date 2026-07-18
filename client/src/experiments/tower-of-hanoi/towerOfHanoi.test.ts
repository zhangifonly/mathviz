import { describe, it, expect } from 'vitest'
import { solveHanoi, minMoves, applyMoves, DISK_COUNTS } from './towerOfHanoi'
import type { Peg } from './towerOfHanoi'

describe('汉诺塔', () => {
  it('minMoves 满足 2^n - 1', () => {
    expect(minMoves(0)).toBe(0)
    expect(minMoves(1)).toBe(1)
    expect(minMoves(3)).toBe(7)
    expect(minMoves(5)).toBe(31)
    expect(minMoves(10)).toBe(1023)
  })

  it('solveHanoi 步数等于 minMoves', () => {
    for (const n of DISK_COUNTS) {
      expect(solveHanoi(n, 'A', 'C', 'B').length).toBe(minMoves(n))
    }
  })

  it('solveHanoi 每步都合法：只移最上盘且不压小盘', () => {
    const n = 4
    const steps = solveHanoi(n, 'A', 'C', 'B')
    const pegs: Record<Peg, number[]> = { A: [], B: [], C: [] }
    for (let d = n; d >= 1; d--) pegs.A.push(d)
    for (const m of steps) {
      const top = pegs[m.from][pegs[m.from].length - 1]
      expect(top).toBe(m.disk)
      const dest = pegs[m.to]
      if (dest.length > 0) expect(dest[dest.length - 1]).toBeGreaterThan(m.disk)
      pegs[m.from].pop()
      pegs[m.to].push(m.disk)
    }
  })

  it('applyMoves 全部执行后盘子都到目标柱且有序', () => {
    const n = 5
    const steps = solveHanoi(n, 'A', 'C', 'B')
    const pegs = applyMoves(n, steps, steps.length)
    expect(pegs.A).toEqual([])
    expect(pegs.B).toEqual([])
    expect(pegs.C).toEqual([5, 4, 3, 2, 1])
  })

  it('applyMoves 第 0 步等于初始态，k 越界不报错', () => {
    const n = 3
    const steps = solveHanoi(n, 'A', 'C', 'B')
    expect(applyMoves(n, steps, 0).A).toEqual([3, 2, 1])
    const over = applyMoves(n, steps, 999)
    expect(over.C).toEqual([3, 2, 1])
  })

  it('每步盘子总数守恒', () => {
    const n = 4
    const steps = solveHanoi(n, 'A', 'C', 'B')
    for (let k = 0; k <= steps.length; k++) {
      const p = applyMoves(n, steps, k)
      expect(p.A.length + p.B.length + p.C.length).toBe(n)
    }
  })
})
