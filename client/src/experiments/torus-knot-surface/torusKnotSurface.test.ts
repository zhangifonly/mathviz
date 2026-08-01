import { describe, it, expect } from 'vitest'
import {
  gcd, knotCurve, componentCount, isKnot, crossingNumber, seifertGenus,
  bridgeNumber, isSymmetricPair, closureGap, torusDistance, KNOT_TABLE,
  T_RANGE,
} from './torusKnotSurface'

describe('环面纽结管', () => {
  it('gcd 计算正确', () => {
    expect(gcd(2, 3)).toBe(1)
    expect(gcd(2, 6)).toBe(2)
    expect(gcd(3, 6)).toBe(3)
    expect(gcd(4, 6)).toBe(2)
  })

  it('分支数等于 gcd(p,q), 为 1 才是纽结', () => {
    expect(componentCount(2, 3)).toBe(1)
    expect(componentCount(2, 6)).toBe(2)
    expect(componentCount(3, 6)).toBe(3)
    expect(isKnot(2, 3)).toBe(true)
    expect(isKnot(2, 6)).toBe(false)
  })

  it('交叉数公式给出已知纽结的正确值', () => {
    expect(crossingNumber(2, 3)).toBe(3)
    expect(crossingNumber(2, 5)).toBe(5)
    expect(crossingNumber(2, 7)).toBe(7)
    expect(crossingNumber(3, 4)).toBe(8)
    expect(crossingNumber(3, 5)).toBe(10)
  })

  it('亏格公式 (p−1)(q−1)/2 给出正确值', () => {
    expect(seifertGenus(2, 3)).toBe(1)
    expect(seifertGenus(2, 5)).toBe(2)
    expect(seifertGenus(2, 7)).toBe(3)
    expect(seifertGenus(3, 4)).toBe(3)
    expect(seifertGenus(3, 5)).toBe(4)
  })

  it('桥数等于 min(p,q)', () => {
    expect(bridgeNumber(2, 3)).toBe(2)
    expect(bridgeNumber(3, 5)).toBe(3)
    expect(bridgeNumber(2, 7)).toBe(2)
  })

  it('链环情形下三个不变量都返回 0(公式不适用)', () => {
    for (const [p, q] of [[2, 6], [3, 6], [4, 6]]) {
      expect(crossingNumber(p, q)).toBe(0)
      expect(seifertGenus(p, q)).toBe(0)
      expect(bridgeNumber(p, q)).toBe(0)
    }
  })

  it('(p,q) 与 (q,p) 给出相同的不变量', () => {
    for (const [p, q] of [[2, 3], [3, 4], [3, 5], [2, 7]]) {
      expect(isSymmetricPair(p, q)).toBe(true)
    }
  })

  it('亏格随 p,q 增大单调增', () => {
    const gs = [[2, 3], [2, 5], [2, 7], [3, 5]].map(([p, q]) => seifertGenus(p, q))
    for (let i = 1; i < gs.length; i++) expect(gs[i]).toBeGreaterThan(gs[i - 1])
  })

  it('曲线在 t∈[0,2π] 上闭合', () => {
    for (const [p, q] of [[2, 3], [3, 5], [2, 6]]) {
      expect(closureGap(p, q)).toBeLessThan(1e-12)
    }
  })

  it('曲线落在环面上: 到中心圈距离恒为管半径', () => {
    for (const [p, q] of [[2, 3], [3, 5], [2, 6]]) {
      for (let i = 0; i <= 30; i++) {
        const t = (2 * Math.PI * i) / 30
        expect(torusDistance(t, p, q)).toBeCloseTo(0.75, 10)
      }
    }
  })

  it('绕 q 圈纬线: 方位角走 2πq', () => {
    for (const q of [3, 5, 7]) {
      // 方位角 = q·t, t 走 2π 则方位角走 2πq
      const p0 = knotCurve(0, 2, q)
      const pHalf = knotCurve(Math.PI / q, 2, q)
      // 转过 π 后方位角反向
      expect(Math.sign(p0[0]) !== Math.sign(pHalf[0]) || Math.abs(pHalf[0]) < 0.1).toBe(true)
    }
  })

  it('绕 p 圈经线: z 分量有 p 个完整周期', () => {
    for (const p of [2, 3]) {
      // z = r·sin(p·t), 在 t∈[0,2π] 上过零 2p 次
      let zeros = 0
      let prev = Math.sign(knotCurve(0, p, 5)[2])
      for (let i = 1; i <= 2000; i++) {
        const s = Math.sign(knotCurve((2 * Math.PI * i) / 2000, p, 5)[2])
        if (s !== 0 && s !== prev) {
          zeros++
          prev = s
        }
      }
      expect(zeros).toBe(2 * p)
    }
  })

  it('参数域内坐标全部有限', () => {
    for (const { p, q } of KNOT_TABLE) {
      for (const t of T_RANGE) {
        expect(knotCurve(t, p, q).every(Number.isFinite)).toBe(true)
      }
    }
  })

  it('KNOT_TABLE 的标注与公式一致', () => {
    for (const row of KNOT_TABLE) {
      if (isKnot(row.p, row.q)) {
        // note 形如「交叉 3 · 亏格 1」, 从中提取数字核对
        const nums = row.note.match(/\d+/g)?.map(Number) ?? []
        expect(nums[0]).toBe(crossingNumber(row.p, row.q))
        expect(nums[1]).toBe(seifertGenus(row.p, row.q))
      } else {
        expect(row.note).toContain('gcd')
      }
    }
  })

  it('KNOT_TABLE 含五个纽结与一个链环', () => {
    expect(KNOT_TABLE.filter((k) => isKnot(k.p, k.q)).length).toBe(5)
    expect(KNOT_TABLE.filter((k) => !isKnot(k.p, k.q)).length).toBe(1)
  })
})
