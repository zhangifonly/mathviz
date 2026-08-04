import { describe, it, expect } from 'vitest'
import {
  integrateVolume, volumeResidual, profileMismatch,
  makePrism, makeObliquePrism, makePyramid, makeCone,
  makeHemisphere, makeCylinderMinusCone, makeCylinder,
  sphereVolume, archimedesRatio, sceneOf, SCENE_IDS, TIMELINE,
} from './cavalieri'

describe('Cavalieri - 数值积分', () => {
  it('直棱柱体积 = 底面积 × 高', () => {
    const s = makePrism(6, 4)
    expect(s.volume).toBe(24)
    expect(volumeResidual(s)).toBeLessThan(1e-10)
  })

  it('棱锥体积 = 底面积 × 高 ÷ 3', () => {
    const s = makePyramid(6, 4)
    expect(s.volume).toBeCloseTo(8, 12)
    expect(volumeResidual(s, 20000)).toBeLessThan(1e-7)
  })

  it('圆锥体积 = πr²h/3', () => {
    const s = makeCone(2, 3)
    expect(s.volume).toBeCloseTo((Math.PI * 4 * 3) / 3, 10)
    expect(volumeResidual(s, 20000)).toBeLessThan(1e-7)
  })

  it('圆柱体积 = πr²h', () => {
    const s = makeCylinder(2, 5)
    expect(s.volume).toBeCloseTo(Math.PI * 4 * 5, 10)
    expect(volumeResidual(s)).toBeLessThan(1e-10)
  })

  it('半球体积 = 2πr³/3', () => {
    for (const r of [1, 2, 0.5]) {
      const s = makeHemisphere(r)
      expect(s.volume).toBeCloseTo((2 * Math.PI * r ** 3) / 3, 10)
      expect(volumeResidual(s, 20000)).toBeLessThan(1e-6)
    }
  })

  it('积分步数越多误差越小', () => {
    const s = makePyramid(6, 4)
    const coarse = volumeResidual(s, 100)
    const fine = volumeResidual(s, 10000)
    expect(fine).toBeLessThan(coarse)
  })

  it('积分结果收敛到解析值', () => {
    const s = makeCone(1, 2)
    expect(integrateVolume(s, 50000)).toBeCloseTo(s.volume, 6)
  })
})

describe('Cavalieri - 截面处处相等', () => {
  it('三个场景的截面都完全一致', () => {
    for (const id of SCENE_IDS) {
      const sc = sceneOf(id, 1)
      expect(profileMismatch(sc.left, sc.right, 500)).toBeLessThan(1e-12)
    }
  })

  it('截面相等 ⟹ 体积相等', () => {
    for (const id of SCENE_IDS) {
      const sc = sceneOf(id, 1)
      expect(sc.left.volume).toBeCloseTo(sc.right.volume, 10)
    }
  })

  it('高度不同则无从比较', () => {
    const a = makePrism(1, 2)
    const b = makePrism(1, 3)
    expect(profileMismatch(a, b)).toBe(Infinity)
  })

  it('截面不同的立体会被判出来', () => {
    const a = makePrism(6, 4)
    const b = makePyramid(6, 4)
    expect(profileMismatch(a, b, 200)).toBeGreaterThan(0.5)
    // 体积也确实不同
    expect(a.volume).not.toBeCloseTo(b.volume, 3)
  })

  it('斜棱柱与直棱柱截面恒等、体积相等', () => {
    const straight = makePrism(5, 3)
    for (const shear of [0.2, 0.6, 1.5]) {
      const oblique = makeObliquePrism(5, 3, shear)
      expect(profileMismatch(straight, oblique)).toBe(0)
      expect(oblique.volume).toBeCloseTo(straight.volume, 12)
    }
  })

  it('棱锥与同底同高的圆锥截面相等', () => {
    const r = 1.5
    const pyr = makePyramid(Math.PI * r * r, 3)
    const cone = makeCone(r, 3)
    expect(profileMismatch(pyr, cone, 300)).toBeLessThan(1e-12)
    expect(pyr.volume).toBeCloseTo(cone.volume, 12)
  })
})

describe('Cavalieri - 阿基米德的球体积', () => {
  it('半球与「圆柱挖去圆锥」截面处处相等', () => {
    for (const r of [1, 2, 0.5, 3.7]) {
      expect(profileMismatch(makeHemisphere(r), makeCylinderMinusCone(r), 500))
        .toBeLessThan(1e-12)
    }
  })

  it('两者体积相等', () => {
    for (const r of [1, 2, 0.5]) {
      expect(makeHemisphere(r).volume)
        .toBeCloseTo(makeCylinderMinusCone(r).volume, 12)
    }
  })

  it('碗的体积 = 圆柱 − 圆锥', () => {
    for (const r of [1, 2]) {
      const cyl = makeCylinder(r, r).volume
      const cone = cyl / 3
      expect(makeCylinderMinusCone(r).volume).toBeCloseTo(cyl - cone, 12)
    }
  })

  it('球 = 2 × 半球 = 4πr³/3', () => {
    for (const r of [1, 2, 0.5, 3]) {
      expect(2 * makeHemisphere(r).volume).toBeCloseTo(sphereVolume(r), 12)
    }
  })

  it('球 : 外接圆柱 = 2 : 3 —— 刻在墓碑上的那个比', () => {
    for (const r of [1, 3, 0.7, 100]) {
      expect(archimedesRatio(r)).toBeCloseTo(2 / 3, 12)
    }
  })

  it('这个比与半径无关', () => {
    const rs = [0.1, 1, 10, 1000]
    const ratios = rs.map(archimedesRatio)
    for (const x of ratios) expect(x).toBeCloseTo(ratios[0], 14)
  })

  it('截面公式: 半球是圆 π(r²−h²), 碗是环 πr²−πh²', () => {
    const r = 2
    const hemi = makeHemisphere(r)
    const bowl = makeCylinderMinusCone(r)
    for (const h of [0, 0.5, 1, 1.5, 1.99]) {
      const want = Math.PI * (r * r - h * h)
      expect(hemi.areaAt(h)).toBeCloseTo(want, 10)
      expect(bowl.areaAt(h)).toBeCloseTo(want, 10)
    }
  })

  it('两者截面积相同但形状不同 —— 圆 vs 环', () => {
    const r = 2
    const hemi = makeHemisphere(r)
    const bowl = makeCylinderMinusCone(r)
    // 面积相同
    expect(hemi.areaAt(1)).toBeCloseTo(bowl.areaAt(1), 10)
    // 但半球是实心圆，碗是环
    expect(hemi.shape ?? 'disk').toBe('disk')
    expect(bowl.shape).toBe('annulus')
    expect(bowl.innerRadiusAt).toBeDefined()
    expect(bowl.outerRadiusAt).toBeDefined()
  })

  it('碗的外半径恒为 r, 内孔半径等于高度', () => {
    const r = 2
    const bowl = makeCylinderMinusCone(r)
    for (const h of [0, 0.5, 1, 1.9]) {
      expect(bowl.outerRadiusAt!(h)).toBeCloseTo(r, 12)
      expect(bowl.innerRadiusAt!(h)).toBeCloseTo(h, 12)
      // 环面积 = π(外² − 内²) 必须与 areaAt 一致
      const ringArea = Math.PI * (r * r - h * h)
      expect(bowl.areaAt(h)).toBeCloseTo(ringArea, 10)
    }
  })

  it('半球的等效半径随高度收缩, 而碗的外径不变', () => {
    const r = 2
    const hemi = makeHemisphere(r)
    const bowl = makeCylinderMinusCone(r)
    const hemiR = (h: number) => Math.sqrt(hemi.areaAt(h) / Math.PI)
    // 半球：底部 r，顶部趋于 0
    expect(hemiR(0)).toBeCloseTo(r, 8)
    expect(hemiR(r * 0.99)).toBeLessThan(r * 0.2)
    // 碗：外径恒为 r
    expect(bowl.outerRadiusAt!(0)).toBeCloseTo(bowl.outerRadiusAt!(r * 0.9), 12)
  })

  it('顶部截面积趋于零, 底部等于 πr²', () => {
    const r = 1.5
    const hemi = makeHemisphere(r)
    expect(hemi.areaAt(0)).toBeCloseTo(Math.PI * r * r, 10)
    expect(hemi.areaAt(r)).toBeCloseTo(0, 10)
  })
})

describe('Cavalieri - 场景与年表', () => {
  it('三个场景都有完整数据', () => {
    for (const id of SCENE_IDS) {
      const sc = sceneOf(id, 1)
      expect(sc.id).toBe(id)
      expect(sc.label.length).toBeGreaterThan(2)
      expect(sc.claim.length).toBeGreaterThan(10)
      expect(sc.left.height).toBeCloseTo(sc.right.height, 12)
    }
  })

  it('sceneOf 对未知 id 兜底为棱柱', () => {
    expect(sceneOf('nope' as never).id).toBe('prism')
  })

  it('场景随半径缩放', () => {
    const a = sceneOf('sphere', 1)
    const b = sceneOf('sphere', 2)
    // 体积按 r³ 增长
    expect(b.left.volume / a.left.volume).toBeCloseTo(8, 8)
  })

  it('年表按时间排序', () => {
    expect(TIMELINE.length).toBe(3)
    for (let i = 1; i < TIMELINE.length; i++) {
      expect(TIMELINE[i].year).toBeGreaterThan(TIMELINE[i - 1].year)
    }
    expect(TIMELINE[0].year).toBeLessThan(0)
    expect(TIMELINE.some((t) => t.event.includes('阿基米德'))).toBe(true)
    expect(TIMELINE.some((t) => t.event.includes('卡瓦列里'))).toBe(true)
  })

  it('每个立体的 note 有内容', () => {
    for (const id of SCENE_IDS) {
      const sc = sceneOf(id, 1)
      expect(sc.left.note.length).toBeGreaterThan(3)
      expect(sc.right.note.length).toBeGreaterThan(3)
    }
  })
})
