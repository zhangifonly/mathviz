/**
 * 地图投影与失真（纯函数，便于测试）
 *
 * 高斯绝妙定理说：曲率不为零的曲面无法不失真地摊平。球面曲率恒为 1，
 * 所以**任何地图投影都必然失真** —— 这不是制图技术不够好，是几何上的不可能。
 *
 * 能选择的只是「失真什么」：
 *   等角（conformal）  保角度、不保面积 —— 墨卡托，航海用
 *   等积（equal-area） 保面积、不保角度 —— 兰伯特、摩尔魏特，统计地图用
 *   等距（equidistant）保某方向距离   —— 方位等距，测距用
 *   折中（compromise） 都不保、都不太差 —— 罗宾逊，教学挂图用
 *
 * **Tissot 指示椭圆**把失真量化：球面上一个无穷小圆，投影后变成椭圆。
 * 两个半轴 h（沿经线）与 k（沿纬线）就是两个方向的伸缩率。
 *   面积失真 = h·k        （等积投影恒为 1）
 *   角度失真 = |h−k|/(h+k)（等角投影恒为 0，因为 h=k）
 *
 * 这两个量给出严格判据，本实验用它验证每种投影「保什么」。
 */

export const PROJECTIONS = [
  'mercator', 'equirectangular', 'lambertCylindrical', 'sinusoidal',
  'azimuthalEquidistant', 'orthographic',
] as const
export type ProjectionKind = (typeof PROJECTIONS)[number]

export type DistortionType = '等角' | '等积' | '等距' | '折中' | '透视'

export interface ProjectionInfo {
  kind: ProjectionKind
  label: string
  type: DistortionType
  /** 保什么 */
  preserves: string
  note: string
}

export const PROJECTION_INFO: ProjectionInfo[] = [
  {
    kind: 'mercator',
    label: '墨卡托',
    type: '等角',
    preserves: '角度（h=k）',
    note: '1569 · 等角航线成直线 · 高纬面积暴增',
  },
  {
    kind: 'lambertCylindrical',
    label: '兰伯特圆柱等积',
    type: '等积',
    preserves: '面积（h·k=1）',
    note: '面积精确 · 高纬形状被压扁',
  },
  {
    kind: 'sinusoidal',
    label: '正弦曲线（桑逊）',
    type: '等积',
    preserves: '面积（h·k=1）',
    note: '等积 · 边缘角度失真大',
  },
  {
    kind: 'equirectangular',
    label: '等距圆柱',
    type: '折中',
    preserves: '经线距离',
    note: '最简单 · 角度面积都不保',
  },
  {
    kind: 'azimuthalEquidistant',
    label: '方位等距',
    type: '等距',
    preserves: '到中心的距离',
    note: '联合国徽章用的就是它',
  },
  {
    kind: 'orthographic',
    label: '正交（透视）',
    type: '透视',
    preserves: '视觉真实',
    note: '像从太空看 · 只能看半球',
  },
]

/** 投影结果：平面坐标 */
export interface PlanePoint {
  x: number
  y: number
}

/**
 * 各投影的正向公式。输入经纬度（弧度），输出平面坐标。
 * 单位球，中心经线取 0。
 */
export function project(kind: ProjectionKind, lat: number, lon: number): PlanePoint {
  switch (kind) {
    case 'mercator':
      // y = ln(tan(π/4 + φ/2)), 在极点发散
      return { x: lon, y: Math.log(Math.tan(Math.PI / 4 + lat / 2)) }
    case 'equirectangular':
      return { x: lon, y: lat }
    case 'lambertCylindrical':
      // y = sin φ, 这个「压扁」正是保面积的关键
      return { x: lon, y: Math.sin(lat) }
    case 'sinusoidal':
      // x 按 cos φ 收窄, 保面积
      return { x: lon * Math.cos(lat), y: lat }
    case 'azimuthalEquidistant': {
      // 以北极为中心: 半径 = 到北极的球面距离
      const rho = Math.PI / 2 - lat
      return { x: rho * Math.sin(lon), y: -rho * Math.cos(lon) }
    }
    case 'orthographic':
      // 从 (0,0) 方向看的正交投影, 只有可见半球有意义
      return { x: Math.cos(lat) * Math.sin(lon), y: Math.sin(lat) }
  }
}

/** 投影在该点是否有定义（墨卡托在极点发散、正交只覆盖半球） */
export function isDefined(kind: ProjectionKind, lat: number, lon: number): boolean {
  if (kind === 'mercator') return Math.abs(lat) < Math.PI / 2 - 1e-6
  if (kind === 'orthographic') return Math.cos(lat) * Math.cos(lon) > 0
  return true
}

/**
 * Tissot 指示椭圆的两个半轴。
 *
 *   h = 沿经线方向的伸缩率 = |∂(x,y)/∂φ|
 *   k = 沿纬线方向的伸缩率 = |∂(x,y)/∂λ| / cos φ
 *
 * 分母的 cos φ 是因为球面上纬线的弧长元是 cos φ·dλ 而非 dλ。
 * 少了这个因子，等角投影就检验不出 h=k（我一开始漏了，数值立刻不对）。
 */
export function tissot(
  kind: ProjectionKind, lat: number, lon: number, eps = 1e-6,
): { h: number; k: number } {
  const dLat = derivative(kind, lat, lon, eps, true)
  const dLon = derivative(kind, lat, lon, eps, false)
  const h = Math.hypot(dLat.x, dLat.y)
  const cosLat = Math.cos(lat)
  const k = cosLat < 1e-9 ? Infinity : Math.hypot(dLon.x, dLon.y) / cosLat
  return { h, k }
}

function derivative(
  kind: ProjectionKind, lat: number, lon: number, eps: number, wrtLat: boolean,
): PlanePoint {
  const a = wrtLat
    ? project(kind, lat - eps, lon)
    : project(kind, lat, lon - eps)
  const b = wrtLat
    ? project(kind, lat + eps, lon)
    : project(kind, lat, lon + eps)
  return { x: (b.x - a.x) / (2 * eps), y: (b.y - a.y) / (2 * eps) }
}

/**
 * 面积失真因子：|det J| / cos φ，其中 J 是 (φ,λ) → (x,y) 的 Jacobian。
 * 分母 cos φ 是球面的面积元。等积投影下这个比值恒为 1。
 *
 * ⚠️ **不能用 h·k**。那个式子只在投影后经纬网格仍正交时才等于面积因子。
 * 正弦投影的网格是斜的（经线被 cos φ 收窄，不再垂直于纬线），
 * h·k 在北纬 60° 给 1.0897，而真实面积比是 1.0000 ——
 * 我第一版就是这么误判它「不等积」的，是 Jacobian 算出来纠正的。
 */
export function areaDistortion(kind: ProjectionKind, lat: number, lon: number): number {
  const dLat = derivative(kind, lat, lon, 1e-6, true)
  const dLon = derivative(kind, lat, lon, 1e-6, false)
  const det = Math.abs(dLat.x * dLon.y - dLat.y * dLon.x)
  const cosLat = Math.cos(lat)
  if (cosLat < 1e-9) return Infinity
  return det / cosLat
}

/** h·k（正交网格下才等于面积因子，保留供对照） */
export function hkProduct(kind: ProjectionKind, lat: number, lon: number): number {
  const { h, k } = tissot(kind, lat, lon)
  return h * k
}

/**
 * 投影后经纬网格是否正交（h·k 能否当面积因子用的前提）。
 * 返回两个方向切向量的夹角偏离 90° 的程度。
 */
export function gridSkew(kind: ProjectionKind, lat: number, lon: number): number {
  const dLat = derivative(kind, lat, lon, 1e-6, true)
  const dLon = derivative(kind, lat, lon, 1e-6, false)
  const na = Math.hypot(dLat.x, dLat.y)
  const nb = Math.hypot(dLon.x, dLon.y)
  if (na < 1e-12 || nb < 1e-12) return 0
  const cosAng = (dLat.x * dLon.x + dLat.y * dLon.y) / (na * nb)
  return Math.abs(Math.acos(Math.max(-1, Math.min(1, cosAng))) - Math.PI / 2)
}

/**
 * 角度失真 |h−k|/(h+k)。等角投影恒为 0。
 * 取值 0 到 1，越大形状扭曲越严重。
 */
export function angleDistortion(kind: ProjectionKind, lat: number, lon: number): number {
  const { h, k } = tissot(kind, lat, lon)
  if (!Number.isFinite(h) || !Number.isFinite(k)) return 1
  return Math.abs(h - k) / (h + k)
}

/** 是否等角（所有采样点的角度失真都为零） */
export function isConformal(kind: ProjectionKind, tol = 1e-6): boolean {
  return sampleLatLon().every(([lat, lon]) => {
    if (!isDefined(kind, lat, lon)) return true
    return angleDistortion(kind, lat, lon) < tol
  })
}

/** 是否等积（所有采样点的面积失真都为 1） */
export function isEqualArea(kind: ProjectionKind, tol = 1e-5): boolean {
  return sampleLatLon().every(([lat, lon]) => {
    if (!isDefined(kind, lat, lon)) return true
    return Math.abs(areaDistortion(kind, lat, lon) - 1) < tol
  })
}

/** 采样点（避开极点与边界） */
export function sampleLatLon(): Array<[number, number]> {
  const out: Array<[number, number]> = []
  for (const latDeg of [-60, -30, 0, 30, 60]) {
    for (const lonDeg of [-100, -40, 0, 40, 100]) {
      out.push([(latDeg * Math.PI) / 180, (lonDeg * Math.PI) / 180])
    }
  }
  return out
}

/**
 * 格陵兰放大倍数：墨卡托在纬度 φ 处的面积失真是 1/cos²φ。
 * 格陵兰中心约北纬 72°，故放大 1/cos²72° ≈ 10.5 倍（线性 3.24 倍）。
 */
export function mercatorAreaInflation(lat: number): number {
  const c = Math.cos(lat)
  return 1 / (c * c)
}

/** 几个地区的中心纬度，用来展示墨卡托的面积失真 */
export const REGIONS = [
  { name: '格陵兰', lat: 72, realAreaMkm2: 2.17 },
  { name: '非洲', lat: 0, realAreaMkm2: 30.37 },
  { name: '俄罗斯', lat: 60, realAreaMkm2: 17.10 },
  { name: '巴西', lat: -10, realAreaMkm2: 8.52 },
] as const

/** 墨卡托地图上的视觉面积（相对真实面积的倍数） */
export function apparentArea(regionLat: number): number {
  return mercatorAreaInflation((regionLat * Math.PI) / 180)
}

export function infoOf(kind: ProjectionKind): ProjectionInfo {
  return PROJECTION_INFO.find((p) => p.kind === kind) ?? PROJECTION_INFO[0]
}
