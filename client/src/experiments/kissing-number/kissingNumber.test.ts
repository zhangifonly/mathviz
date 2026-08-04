import { describe, it, expect } from 'vitest'
import {
  dot, norm, unit, angularDistance, capSolidAngle, naiveUpperBound,
  minPairAngle, isValidArrangement, icosahedralDirections,
  cuboctahedralDirections, octahedralDirections, arrangementOf,
  findExtraSphere, slack, capCoverage, kissing2DAngles, kissing2DGap,
  MIN_ANGLE, CAP_HALF_ANGLE, OCTAHEDRAL_BEST_GAP, ARRANGEMENTS, KNOWN_KISSING,
} from './kissingNumber'

const DEG = 180 / Math.PI

describe('接吻数 - 角距判据', () => {
  it('贴住的最小角距是 60°', () => {
    expect(MIN_ANGLE * DEG).toBeCloseTo(60, 10)
  })

  it('球冠半角是 30°(最小角距的一半)', () => {
    expect(CAP_HALF_ANGLE * DEG).toBeCloseTo(30, 10)
    expect(CAP_HALF_ANGLE * 2).toBeCloseTo(MIN_ANGLE, 12)
  })

  it('角距计算正确', () => {
    expect(angularDistance([1, 0, 0], [0, 1, 0]) * DEG).toBeCloseTo(90, 9)
    expect(angularDistance([1, 0, 0], [-1, 0, 0]) * DEG).toBeCloseTo(180, 9)
    expect(angularDistance([1, 0, 0], [1, 0, 0]) * DEG).toBeCloseTo(0, 6)
  })

  it('角距与向量长度无关', () => {
    expect(angularDistance([2, 0, 0], [0, 5, 0]))
      .toBeCloseTo(angularDistance([1, 0, 0], [0, 1, 0]), 10)
  })

  it('向量工具正确', () => {
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)
    expect(norm([3, 4, 0])).toBeCloseTo(5, 12)
    expect(norm(unit([3, 4, 0]))).toBeCloseTo(1, 12)
  })
})

describe('接吻数 - 三种排列', () => {
  it('二十面体排列有 12 个方向且合法', () => {
    const d = icosahedralDirections()
    expect(d.length).toBe(12)
    expect(isValidArrangement(d)).toBe(true)
  })

  it('二十面体角距 63.43°, 比 60° 富余 3.43°', () => {
    const d = icosahedralDirections()
    expect(minPairAngle(d) * DEG).toBeCloseTo(63.4349, 3)
    expect(slack(d) * DEG).toBeCloseTo(3.4349, 3)
    expect(slack(d)).toBeGreaterThan(0)
  })

  it('立方八面体角距恰好 60°, 零余量', () => {
    const d = cuboctahedralDirections()
    expect(d.length).toBe(12)
    expect(minPairAngle(d) * DEG).toBeCloseTo(60, 8)
    expect(Math.abs(slack(d))).toBeLessThan(1e-9)
    expect(isValidArrangement(d)).toBe(true)
  })

  it('所有方向都是单位向量', () => {
    for (const id of ARRANGEMENTS) {
      for (const v of arrangementOf(id).dirs) {
        expect(norm(v)).toBeCloseTo(1, 10)
      }
    }
  })

  it('两种 12 球排列的球冠覆盖率相同(约 80%)', () => {
    const a = capCoverage(icosahedralDirections())
    const b = capCoverage(cuboctahedralDirections())
    expect(a).toBeCloseTo(b, 12)
    expect(a * 100).toBeCloseTo(80.38, 1)
    // 还剩约 20% 空隙 —— 看着够第 13 个球
    expect(a).toBeLessThan(1)
  })

  it('二十面体的方向两两不同', () => {
    const d = icosahedralDirections()
    for (let i = 0; i < d.length; i++) {
      for (let j = i + 1; j < d.length; j++) {
        expect(angularDistance(d[i], d[j])).toBeGreaterThan(1e-6)
      }
    }
  })

  it('arrangementOf 三种都能取到, 未知兜底为二十面体', () => {
    for (const id of ARRANGEMENTS) expect(arrangementOf(id).id).toBe(id)
    expect(arrangementOf('nope' as never).id).toBe('icosahedral')
  })
})

describe('接吻数 - 塞不下第 13 个球', () => {
  it('二十面体排列加不进第 13 个', () => {
    const r = findExtraSphere(icosahedralDirections(), 20000)
    expect(r.found).toBeNull()
    // 最佳空位远不到 60°
    expect(r.bestAngle * DEG).toBeLessThan(45)
  })

  it('立方八面体排列也加不进', () => {
    const r = findExtraSphere(cuboctahedralDirections(), 20000)
    expect(r.found).toBeNull()
    expect(r.bestAngle).toBeLessThan(MIN_ANGLE)
  })

  it('六球排列虽只有 6 个球却已卡死(局部最优)', () => {
    const r = findExtraSphere(octahedralDirections(), 20000)
    expect(r.found).toBeNull()
    // 最大空位在体对角线, 理论值 arccos(1/√3) = 54.7356°。
    // 采样是离散的, 20000 点只能逼近到 0.2° 以内 —— 这是采样误差不是算错,
    // 精确值由下一条测试用解析方式验证。
    expect(Math.abs(r.bestAngle * DEG - 54.7356)).toBeLessThan(0.2)
    expect(r.bestAngle).toBeLessThan(MIN_ANGLE)
  })

  it('采样加密后更逼近理论值', () => {
    const coarse = findExtraSphere(octahedralDirections(), 5000).bestAngle
    const fine = findExtraSphere(octahedralDirections(), 60000).bestAngle
    const exact = OCTAHEDRAL_BEST_GAP
    // 都不超过理论上界
    expect(coarse).toBeLessThanOrEqual(exact + 1e-9)
    expect(fine).toBeLessThanOrEqual(exact + 1e-9)
    // 加密后误差不增大
    expect(Math.abs(fine - exact)).toBeLessThanOrEqual(Math.abs(coarse - exact) + 1e-9)
  })

  it('体对角线确实是六球排列的最佳空位', () => {
    expect(OCTAHEDRAL_BEST_GAP * DEG).toBeCloseTo(54.7356, 3)
    expect(OCTAHEDRAL_BEST_GAP).toBeLessThan(MIN_ANGLE)
    // 手工验证：(1,1,1)/√3 到各坐标轴的角距
    const d = 1 / Math.sqrt(3)
    for (const axis of octahedralDirections()) {
      const a = angularDistance([d, d, d], axis)
      expect(a).toBeGreaterThanOrEqual(OCTAHEDRAL_BEST_GAP - 1e-9)
    }
  })

  it('空排列或单球时可以随便加', () => {
    expect(findExtraSphere([], 500).found).not.toBeNull()
    expect(findExtraSphere([[0, 0, 1]], 2000).found).not.toBeNull()
  })

  it('球少时余量大: 6 球的最小角距大于 12 球的', () => {
    expect(minPairAngle(octahedralDirections()))
      .toBeGreaterThan(minPairAngle(icosahedralDirections()))
  })
})

describe('接吻数 - 上界与已知值', () => {
  it('球冠立体角 = 2π(1−cos30°)', () => {
    expect(capSolidAngle())
      .toBeCloseTo(2 * Math.PI * (1 - Math.cos(Math.PI / 6)), 12)
  })

  it('朴素上界 14.93 —— 挡不住 13, 这就是争论的根源', () => {
    const b = naiveUpperBound()
    expect(b).toBeCloseTo(14.9282, 3)
    expect(b).toBeGreaterThan(13)
    // 上界大于真实值 12
    expect(b).toBeGreaterThan(12)
  })

  it('12 个球的球冠加起来小于整个球面', () => {
    expect(12 * capSolidAngle()).toBeLessThan(4 * Math.PI)
    // 但 15 个就超了
    expect(15 * capSolidAngle()).toBeGreaterThan(4 * Math.PI)
  })

  it('已知接吻数表正确', () => {
    const m = new Map(KNOWN_KISSING.map((k) => [k.dim, k.tau]))
    expect(m.get(1)).toBe(2)
    expect(m.get(2)).toBe(6)
    expect(m.get(3)).toBe(12)
    expect(m.get(4)).toBe(24)
    expect(m.get(8)).toBe(240)
    expect(m.get(24)).toBe(196560)
  })

  it('接吻数随维度递增', () => {
    for (let i = 1; i < KNOWN_KISSING.length; i++) {
      expect(KNOWN_KISSING[i].tau).toBeGreaterThan(KNOWN_KISSING[i - 1].tau)
      expect(KNOWN_KISSING[i].dim).toBeGreaterThan(KNOWN_KISSING[i - 1].dim)
    }
  })

  it('二维接吻数 6: 六个方向恰好等分圆周', () => {
    const a = kissing2DAngles()
    expect(a.length).toBe(6)
    expect(kissing2DGap() * DEG).toBeCloseTo(60, 10)
    // 六个 60° 正好一圈
    expect(6 * kissing2DGap()).toBeCloseTo(2 * Math.PI, 10)
  })

  it('二维恰好没有余量(与三维的 3.43° 形成对比)', () => {
    // 2D 的 60° 恰好用尽 360°, 而 3D 的 63.43° 却塞不下第 13 个
    expect(kissing2DGap()).toBeCloseTo(MIN_ANGLE, 12)
  })
})
