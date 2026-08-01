/**
 * 空间填充多面体（纯函数，便于测试）
 *
 * 哪些多面体能不留缝隙地堆满整个空间？这个问题比平面镶嵌难得多。
 *
 * 平面上答案很干净：只有正三角形、正方形、正六边形三种正多边形能镶嵌，
 * 判据是内角能整除 360°。
 *
 * 空间里**只有立方体**一种柏拉图立体能做到。亚里士多德曾断言正四面体也行，
 * 这个错误流传了一千八百年，直到 15 世纪才被纠正 ——
 * 正四面体的二面角约 70.53°，而 360/70.53 ≈ 5.10 不是整数，
 * 绕一条棱堆五个会留下约 7.36° 的缝。
 *
 * 但放宽到非正多面体，答案就丰富了：
 *   立方体        二面角 90°，绕棱堆 4 个恰好合拢
 *   截角八面体    阿基米德立体中唯一能单独填充空间的
 *   菱形十二面体  面心立方堆积的 Voronoi 胞，蜂巢的三维版
 *   六棱柱        蜂巢结构的直接推广
 *
 * 本实验的核心可验证量是**二面角**：能绕棱填充的必要条件是
 * 360° / 二面角 为整数。
 */

/** 二面角（度）已知值 */
export const DIHEDRAL_ANGLES = {
  tetrahedron: (Math.acos(1 / 3) * 180) / Math.PI,
  cube: 90,
  octahedron: (Math.acos(-1 / 3) * 180) / Math.PI,
  dodecahedron: (Math.acos(-1 / Math.sqrt(5)) * 180) / Math.PI,
  icosahedron: (Math.acos(-Math.sqrt(5) / 3) * 180) / Math.PI,
} as const

export const FILL_KINDS = [
  'cube', 'truncatedOctahedron', 'rhombicDodecahedron', 'hexPrism',
] as const
export type FillKind = (typeof FILL_KINDS)[number]

export interface FillInfo {
  kind: FillKind
  label: string
  /** 是否能单独填充空间 */
  fills: boolean
  V: number
  E: number
  F: number
  note: string
}

export const FILL_INFO: FillInfo[] = [
  {
    kind: 'cube',
    label: '立方体',
    fills: true,
    V: 8, E: 12, F: 6,
    note: '唯一能填充的柏拉图立体',
  },
  {
    kind: 'truncatedOctahedron',
    label: '截角八面体',
    fills: true,
    V: 24, E: 36, F: 14,
    note: '唯一能填充的阿基米德立体',
  },
  {
    kind: 'rhombicDodecahedron',
    label: '菱形十二面体',
    fills: true,
    V: 14, E: 24, F: 12,
    note: '面心立方堆积的 Voronoi 胞',
  },
  {
    kind: 'hexPrism',
    label: '正六棱柱',
    fills: true,
    V: 12, E: 18, F: 8,
    note: '蜂巢结构的三维推广',
  },
]

/**
 * 绕一条棱能堆几个（360° / 二面角）。
 * 结果为整数是「能绕棱填充」的必要条件。
 */
export function edgeFitCount(dihedralDeg: number): number {
  return 360 / dihedralDeg
}

/** 是否整除（允许浮点误差） */
export function fitsAroundEdge(dihedralDeg: number, tol = 1e-6): boolean {
  const k = edgeFitCount(dihedralDeg)
  return Math.abs(k - Math.round(k)) < tol
}

/**
 * 堆 n 个后剩余的缝隙角度（度）。
 * 正四面体堆 5 个剩 ~7.36°，这就是亚里士多德错了 1800 年的地方。
 */
export function gapAngle(dihedralDeg: number, count: number): number {
  return 360 - dihedralDeg * count
}

/** 绕棱最多能堆几个不重叠 */
export function maxFitCount(dihedralDeg: number): number {
  return Math.floor(360 / dihedralDeg + 1e-9)
}

/**
 * 平面镶嵌的对照：正 n 边形内角是否整除 360°。
 * 只有 n=3,4,6 满足，这是平面镶嵌只有三种的原因。
 */
export function planarInteriorAngle(n: number): number {
  return 180 * (1 - 2 / n)
}

export function tilesPlane(n: number, tol = 1e-9): boolean {
  const k = 360 / planarInteriorAngle(n)
  return Math.abs(k - Math.round(k)) < tol
}

/** 枚举能镶嵌平面的正多边形边数 */
export function enumeratePlanarTilings(maxN = 20): number[] {
  const out: number[] = []
  for (let n = 3; n <= maxN; n++) if (tilesPlane(n)) out.push(n)
  return out
}

/**
 * 菱形十二面体的填充密度对照：
 * 它是面心立方（FCC）堆积的 Voronoi 胞，而 FCC 是球堆积的最密方式，
 * 密度 π/(3√2) ≈ 0.7405（开普勒猜想，1998 年 Hales 证明）。
 */
export const FCC_SPHERE_DENSITY = Math.PI / (3 * Math.SQRT2)

/** 空间填充体的体积占比恒为 1（无缝无重叠） */
export const FILL_DENSITY = 1

export function infoOf(kind: FillKind): FillInfo {
  return FILL_INFO.find((f) => f.kind === kind) ?? FILL_INFO[0]
}
