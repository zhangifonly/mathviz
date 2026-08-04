/**
 * Cavalieri 原理（纯函数，便于测试）
 *
 * **两个立体，若被任意平行平面所截得的截面面积总相等，则体积相等。**
 * 卡瓦列里在 1635 年提出，比微积分早半个世纪 —— 它其实就是
 * "体积 = 截面积的积分"这件事的几何说法。
 *
 * 三个经典应用，本实验逐个用数值验证：
 *
 * 1. **斜棱柱与直棱柱等体积**。把一摞纸推歪，每层纸面积不变，总体积也不变。
 *    这是原理最直白的形象。
 *
 * 2. **棱锥体积 = 底面积 × 高 ÷ 3**。三个等底等高的棱锥能拼成一个棱柱，
 *    而"÷3"正是从这里来的。用截面积 A(h) = S·(1−h/H)² 积分同样得到 1/3。
 *
 * 3. **球体积 = 4πr³/3**（阿基米德的证法）。
 *    半球在高度 h 处的截面是半径 √(r²−h²) 的圆，面积 π(r²−h²)；
 *    而"圆柱挖去圆锥"在同一高度的截面是环，面积也是 π(r²−h²)。
 *    两者截面处处相等 ⟹ 体积相等 ⟹ 半球 = 圆柱 − 圆锥 = πr³ − πr³/3 = 2πr³/3。
 *
 * 这个证法漂亮在：它把球的体积化归成两个更简单立体的差，
 * 全靠"截面积相等"这一条，不需要极限。
 */

/** 一个立体：由"高度 → 截面积"的函数刻画 */
export interface SolidProfile {
  id: string
  label: string
  /** 高度范围 [0, height] */
  height: number
  /** 高度 h 处的截面积 */
  areaAt: (h: number) => number
  /** 解析体积（用于校验数值积分） */
  volume: number
  note: string
  /**
   * 截面的**形状**（不影响面积，只用于绘制）。
   * 'disk' 是实心圆，'annulus' 是环 —— 后者要额外给出内半径。
   *
   * ⚠️ 这个字段是为了画图而加的，但它承载了这一课的要害：
   * 半球与「圆柱挖去圆锥」的截面**面积相同而形状不同**（圆 vs 环）。
   * 若都画成圆，两个立体看起来一模一样，反而把最精彩的地方藏起来了。
   */
  shape?: 'disk' | 'annulus'
  /** 环的内半径（shape 为 annulus 时有效） */
  innerRadiusAt?: (h: number) => number
  /** 外轮廓半径（绘制用；默认由面积反推） */
  outerRadiusAt?: (h: number) => number
}

/** 数值积分求体积（中点法） */
export function integrateVolume(s: SolidProfile, steps = 2000): number {
  const dh = s.height / steps
  let v = 0
  for (let i = 0; i < steps; i++) {
    v += s.areaAt((i + 0.5) * dh) * dh
  }
  return v
}

/** 数值体积与解析值的相对误差 */
export function volumeResidual(s: SolidProfile, steps = 2000): number {
  const num = integrateVolume(s, steps)
  return Math.abs(num - s.volume) / Math.max(1e-12, s.volume)
}

/**
 * 两个立体的截面积是否处处相等（Cavalieri 的前提）。
 * 返回最大相对偏差。
 */
export function profileMismatch(
  a: SolidProfile, b: SolidProfile, steps = 400,
): number {
  if (Math.abs(a.height - b.height) > 1e-9) return Infinity
  let worst = 0
  for (let i = 0; i <= steps; i++) {
    const h = (a.height * i) / steps
    const va = a.areaAt(h)
    const vb = b.areaAt(h)
    const scale = Math.max(Math.abs(va), Math.abs(vb), 1e-12)
    worst = Math.max(worst, Math.abs(va - vb) / scale)
  }
  return worst
}

// ============ 应用一：斜棱柱 vs 直棱柱 ============

/** 直棱柱：截面恒为底面积 */
export function makePrism(baseArea: number, height: number): SolidProfile {
  return {
    id: 'prism',
    label: '直棱柱',
    height,
    areaAt: () => baseArea,
    volume: baseArea * height,
    note: '截面恒等于底面积',
  }
}

/**
 * 斜棱柱：整体被推歪，但每一层的截面完全一样。
 * 截面积与直棱柱相同 —— 这正是 Cavalieri 的前提。
 */
export function makeObliquePrism(
  baseArea: number, height: number, shear: number,
): SolidProfile {
  return {
    id: 'oblique',
    label: `斜棱柱（推歪 ${shear.toFixed(1)}）`,
    height,
    // 推歪不改变任何一层的截面积
    areaAt: () => baseArea,
    volume: baseArea * height,
    note: '推歪后每层截面不变，体积也不变',
  }
}

// ============ 应用二：棱锥的 1/3 ============

/**
 * 棱锥：高度 h 处的截面是底面的相似缩放，比例 (1 − h/H)，
 * 故面积为 S·(1−h/H)²。积分给出 S·H/3。
 */
export function makePyramid(baseArea: number, height: number): SolidProfile {
  return {
    id: 'pyramid',
    label: '棱锥',
    height,
    areaAt: (h) => {
      const k = 1 - h / height
      return baseArea * k * k
    },
    volume: (baseArea * height) / 3,
    note: '截面按 (1−h/H)² 收缩，积分得 1/3',
  }
}

/** 圆锥（与棱锥同型，只是底面是圆） */
export function makeCone(radius: number, height: number): SolidProfile {
  const baseArea = Math.PI * radius * radius
  return {
    id: 'cone',
    label: '圆锥',
    height,
    areaAt: (h) => {
      const k = 1 - h / height
      return baseArea * k * k
    },
    volume: (baseArea * height) / 3,
    note: '与棱锥同样的 1/3',
  }
}

// ============ 应用三：阿基米德的球体积 ============

/** 半球：高度 h 处截面是半径 √(r²−h²) 的圆 */
export function makeHemisphere(r: number): SolidProfile {
  return {
    id: 'hemisphere',
    label: '半球',
    height: r,
    areaAt: (h) => Math.PI * Math.max(0, r * r - h * h),
    volume: (2 * Math.PI * r ** 3) / 3,
    note: '截面 π(r²−h²)',
  }
}

/**
 * 圆柱挖去圆锥（"碗"）：同高度处截面是一个环。
 * 外圆半径恒为 r，内圆半径等于 h（圆锥在该高度的半径）。
 * 环面积 = πr² − πh² = π(r²−h²) —— 与半球处处相同。
 */
export function makeCylinderMinusCone(r: number): SolidProfile {
  return {
    id: 'bowl',
    label: '圆柱挖去圆锥',
    height: r,
    areaAt: (h) => Math.PI * (r * r - Math.min(h, r) ** 2),
    volume: Math.PI * r ** 3 - (Math.PI * r ** 3) / 3,
    note: '截面是环，面积也是 π(r²−h²)',
    // 外轮廓恒为 r（圆柱侧面），内孔半径等于 h（圆锥在该高度的半径）
    shape: 'annulus',
    outerRadiusAt: () => r,
    innerRadiusAt: (h) => Math.min(h, r),
  }
}

/** 完整圆柱（作对照） */
export function makeCylinder(r: number, height: number): SolidProfile {
  return {
    id: 'cylinder',
    label: '圆柱',
    height,
    areaAt: () => Math.PI * r * r,
    volume: Math.PI * r * r * height,
    note: '截面恒为 πr²',
  }
}

/** 球体积公式 4πr³/3 */
export function sphereVolume(r: number): number {
  return (4 * Math.PI * r ** 3) / 3
}

/**
 * 阿基米德关系：球 : 圆柱 = 2 : 3（等底等高时）。
 * 他为此自豪到刻在墓碑上。
 */
export function archimedesRatio(r: number): number {
  const sphere = sphereVolume(r)
  // 外接圆柱：半径 r，高 2r
  const cylinder = Math.PI * r * r * (2 * r)
  return sphere / cylinder
}

export type SceneId = 'prism' | 'pyramid' | 'sphere'

export interface CavalieriScene {
  id: SceneId
  label: string
  left: SolidProfile
  right: SolidProfile
  claim: string
}

/** 三个对照场景 */
export function sceneOf(id: SceneId, r = 1): CavalieriScene {
  if (id === 'pyramid') {
    return {
      id,
      label: '棱锥的 1/3',
      left: makePyramid(Math.PI * r * r, r * 2),
      right: makeCone(r, r * 2),
      claim: '同底同高的棱锥与圆锥体积相等，都是底面积×高÷3',
    }
  }
  if (id === 'sphere') {
    return {
      id,
      label: '阿基米德的球体积',
      left: makeHemisphere(r),
      right: makeCylinderMinusCone(r),
      claim: '半球与「圆柱挖去圆锥」截面处处相等，故体积相等',
    }
  }
  return {
    id: 'prism',
    label: '斜棱柱等体积',
    left: makePrism(Math.PI * r * r, r * 2),
    right: makeObliquePrism(Math.PI * r * r, r * 2, 0.6),
    claim: '把一摞纸推歪，每层面积不变，总体积也不变',
  }
}

export const SCENE_IDS: SceneId[] = ['prism', 'pyramid', 'sphere']

/** 卡瓦列里原理的年表 */
export const TIMELINE = [
  { year: -250, event: '阿基米德用截面法算出球体积，写在《方法论》里' },
  { year: 1635, event: '卡瓦列里提出「不可分量」原理' },
  { year: 1665, event: '牛顿与莱布尼茨建立微积分，把它变成积分' },
] as const
