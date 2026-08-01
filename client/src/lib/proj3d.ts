/**
 * Canvas 3D 投影内核(纯函数, 不依赖 DOM)
 *
 * 讲解层的场景渲染器统一用 Canvas 2D 手绘, 但曲面/空间曲线/多面体/向量场这类
 * 主题必须在三维里看才讲得清。这里提供共享的旋转 + 透视投影 + 采样工具,
 * 让讲解层也能画出会自转的 3D 画面 —— 不引入 WebGL, 也不占用 GL 上下文
 * (300+ 实验若都上 canvas3d, 浏览器的 GL 上下文数量根本不够)。
 *
 * 实验页那一侧仍用 react-plotly.js 的 surface/scatter3d(用户可拖拽旋转),
 * 两边共用同一批参数方程内核, 保证讲解与实操看到的是同一个几何体。
 */

export type Vec3 = [number, number, number]

/** 相机。yaw 绕 z 轴自转, pitch 抬头俯视, dist 越小透视越夸张 */
export interface Camera {
  yaw: number
  pitch: number
  dist: number
  scale: number
  cx: number
  cy: number
}

export function makeCamera(partial: Partial<Camera> = {}): Camera {
  return { yaw: 0.6, pitch: 0.35, dist: 6, scale: 140, cx: 0, cy: 0, ...partial }
}

/** 先绕 z 轴转 yaw, 再绕 x 轴转 pitch。返回值的 y 分量作为深度(朝屏幕里为正) */
export function rotate([x, y, z]: Vec3, yaw: number, pitch: number): Vec3 {
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const x1 = x * cy - y * sy
  const y1 = x * sy + y * cy
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  return [x1, y1 * cp - z * sp, y1 * sp + z * cp]
}

export interface Projected {
  x: number
  y: number
  /** 旋转后的深度, 越大越远, 用于画家算法排序 */
  depth: number
  /** 透视缩放系数, 可用来调线宽/点径 */
  f: number
}

/** 透视投影到屏幕坐标(y 轴向下, 已做翻转) */
export function project(p: Vec3, cam: Camera): Projected {
  const [rx, ry, rz] = rotate(p, cam.yaw, cam.pitch)
  const f = cam.dist / Math.max(0.25, cam.dist + ry)
  return {
    x: cam.cx + rx * cam.scale * f,
    y: cam.cy - rz * cam.scale * f,
    depth: ry,
    f,
  }
}

/** 在 (u,v) 矩形域上采样参数曲面, 返回 (uSteps+1)×(vSteps+1) 网格 */
export function sampleSurface(
  fn: (u: number, v: number) => Vec3,
  uRange: [number, number],
  vRange: [number, number],
  uSteps = 40,
  vSteps = 40,
): Vec3[][] {
  const grid: Vec3[][] = []
  for (let i = 0; i <= uSteps; i++) {
    const u = uRange[0] + ((uRange[1] - uRange[0]) * i) / uSteps
    const row: Vec3[] = []
    for (let j = 0; j <= vSteps; j++) {
      const v = vRange[0] + ((vRange[1] - vRange[0]) * j) / vSteps
      row.push(fn(u, v))
    }
    grid.push(row)
  }
  return grid
}

/** 采样空间曲线 */
export function sampleCurve(
  fn: (t: number) => Vec3,
  tRange: [number, number],
  steps = 400,
): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    pts.push(fn(tRange[0] + ((tRange[1] - tRange[0]) * i) / steps))
  }
  return pts
}

/** 网格上的一个四边形面片 */
export interface Quad {
  corners: [Vec3, Vec3, Vec3, Vec3]
  /** 面心, 用于深度排序与打光 */
  center: Vec3
  normal: Vec3
  /** 归一化的参数坐标(0~1), 供上色 */
  u: number
  v: number
}

/** 三点定法向(单位化)。退化三角形返回 +z, 避免除零 */
export function faceNormal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  const e1: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const e2: Vec3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  const n: Vec3 = [
    e1[1] * e2[2] - e1[2] * e2[1],
    e1[2] * e2[0] - e1[0] * e2[2],
    e1[0] * e2[1] - e1[1] * e2[0],
  ]
  const len = Math.hypot(n[0], n[1], n[2])
  if (len < 1e-12) return [0, 0, 1]
  return [n[0] / len, n[1] / len, n[2] / len]
}

/** 把采样网格切成四边形面片 */
export function buildQuads(grid: Vec3[][]): Quad[] {
  const quads: Quad[] = []
  const rows = grid.length
  if (rows < 2) return quads
  const cols = grid[0].length
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < cols - 1; j++) {
      const a = grid[i][j]
      const b = grid[i + 1][j]
      const c = grid[i + 1][j + 1]
      const d = grid[i][j + 1]
      quads.push({
        corners: [a, b, c, d],
        center: [
          (a[0] + b[0] + c[0] + d[0]) / 4,
          (a[1] + b[1] + c[1] + d[1]) / 4,
          (a[2] + b[2] + c[2] + d[2]) / 4,
        ],
        normal: faceNormal(a, b, c),
        u: i / (rows - 1),
        v: j / (cols - 1),
      })
    }
  }
  return quads
}

/**
 * 画家算法排序: 远的先画。
 * 先算一遍深度再排, 不在比较器里调 rotate —— 那样每个面片会被算 O(log n) 次。
 */
export function depthSortQuads(quads: Quad[], cam: Camera): Quad[] {
  return quads
    .map(q => ({ q, d: rotate(q.center, cam.yaw, cam.pitch)[1] }))
    .sort((m, n) => n.d - m.d)
    .map(m => m.q)
}

/** 朗伯光照。取绝对值使单侧曲面(莫比乌斯环等)两面都亮 */
export function shade(normal: Vec3, light: Vec3 = [0.4, -0.7, 0.6]): number {
  const len = Math.hypot(light[0], light[1], light[2]) || 1
  const dot = (normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2]) / len
  return 0.35 + 0.65 * Math.abs(dot)
}

/** 配色带: 名称 -> 若干 RGB 停靠点 */
export const RAMPS: Record<string, Array<[number, number, number]>> = {
  viridis: [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]],
  plasma: [[13, 8, 135], [126, 3, 168], [204, 71, 120], [248, 149, 64], [240, 249, 33]],
  coolwarm: [[59, 76, 192], [144, 178, 254], [220, 220, 220], [245, 156, 125], [180, 4, 38]],
  ocean: [[8, 29, 88], [34, 94, 168], [65, 182, 196], [161, 218, 180], [255, 255, 217]],
}

/** 取配色带上 t∈[0,1] 处的颜色, 线性插值。brightness 用于叠加光照 */
export function rampColor(t: number, ramp = 'viridis', brightness = 1): string {
  const stops = RAMPS[ramp] ?? RAMPS.viridis
  const x = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0)) * (stops.length - 1)
  const i = Math.min(stops.length - 2, Math.floor(x))
  const f = x - i
  const c = stops[i].map((v, k) => v + (stops[i + 1][k] - v) * f)
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * brightness)))
  return `rgb(${clamp(c[0])}, ${clamp(c[1])}, ${clamp(c[2])})`
}

/** 点集的轴对齐包围盒 */
export function bounds(pts: Vec3[]): { min: Vec3; max: Vec3; center: Vec3; radius: number } {
  const min: Vec3 = [Infinity, Infinity, Infinity]
  const max: Vec3 = [-Infinity, -Infinity, -Infinity]
  for (const p of pts) {
    for (let k = 0; k < 3; k++) {
      if (p[k] < min[k]) min[k] = p[k]
      if (p[k] > max[k]) max[k] = p[k]
    }
  }
  if (!Number.isFinite(min[0])) return { min: [0, 0, 0], max: [0, 0, 0], center: [0, 0, 0], radius: 1 }
  const center: Vec3 = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]
  const radius = Math.max(1e-6, Math.hypot(max[0] - min[0], max[1] - min[1], max[2] - min[2]) / 2)
  return { min, max, center, radius }
}

/**
 * 把点集平移到原点并缩放到单位半径。
 * 各实验坐标量级差异极大(洛伦兹吸引子几十, 单位球 1), 归一化后同一套
 * 相机 scale 通用, 不必逐个实验手调。
 */
export function normalizePoints(pts: Vec3[], targetRadius = 1): Vec3[] {
  const { center, radius } = bounds(pts)
  const k = targetRadius / radius
  return pts.map(p => [(p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k] as Vec3)
}

/** 网格版归一化: 保持行列结构 */
export function normalizeGrid(grid: Vec3[][], targetRadius = 1): Vec3[][] {
  const { center, radius } = bounds(grid.flat())
  const k = targetRadius / radius
  return grid.map(row =>
    row.map(p => [(p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k] as Vec3),
  )
}
