/**
 * 斯托克斯定理（平面特例即格林定理）核心算法（纯函数，便于测试）
 * 环量 ∮ F·dr = 区域内旋度二重积分 ∬(∂Q/∂x - ∂P/∂y) dA（线积分 = 网格累加，二者相等）。
 * 坐标为标准数学系（y 向上），边界取逆时针为正。
 */

export interface VectorField {
  id: string
  name: string
  P: (x: number, y: number) => number
  Q: (x: number, y: number) => number
}

export type Region =
  | { id: string; name: string; type: 'rect'; cx: number; cy: number; w: number; h: number }
  | { id: string; name: string; type: 'circle'; cx: number; cy: number; r: number }

/** 旋度密度 curl = ∂Q/∂x - ∂P/∂y（中心差分） */
export function curlDensity(field: VectorField, x: number, y: number, h = 1e-4): number {
  const dQdx = (field.Q(x + h, y) - field.Q(x - h, y)) / (2 * h)
  const dPdy = (field.P(x, y + h) - field.P(x, y - h)) / (2 * h)
  return dQdx - dPdy
}

/** 点是否落在区域内（含边界） */
export function pointInRegion(region: Region, x: number, y: number): boolean {
  if (region.type === 'rect') {
    return Math.abs(x - region.cx) <= region.w / 2 && Math.abs(y - region.cy) <= region.h / 2
  }
  const dx = x - region.cx, dy = y - region.cy
  return dx * dx + dy * dy <= region.r * region.r
}

/** 逆时针闭合边界采样点（首尾闭合） */
export function boundaryPoints(region: Region, steps = 720): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = []
  if (region.type === 'circle') {
    for (let i = 0; i <= steps; i++) {
      const t = (2 * Math.PI * i) / steps
      pts.push({ x: region.cx + region.r * Math.cos(t), y: region.cy + region.r * Math.sin(t) })
    }
    return pts
  }
  const hw = region.w / 2, hh = region.h / 2
  const corners = [
    { x: region.cx - hw, y: region.cy - hh },
    { x: region.cx + hw, y: region.cy - hh },
    { x: region.cx + hw, y: region.cy + hh },
    { x: region.cx - hw, y: region.cy + hh },
  ]
  const per = Math.max(1, Math.floor(steps / 4))
  for (let c = 0; c < 4; c++) {
    const a = corners[c], b = corners[(c + 1) % 4]
    for (let i = 0; i < per; i++) {
      const t = i / per
      pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
    }
  }
  pts.push({ ...corners[0] })
  return pts
}

/** 环量：逆时针边界线积分 ∮ P dx + Q dy（中点法） */
export function circulation(field: VectorField, region: Region, steps = 720): number {
  const p = boundaryPoints(region, steps)
  let sum = 0
  for (let i = 0; i < p.length - 1; i++) {
    const mx = (p[i].x + p[i + 1].x) / 2, my = (p[i].y + p[i + 1].y) / 2
    const dx = p[i + 1].x - p[i].x, dy = p[i + 1].y - p[i].y
    sum += field.P(mx, my) * dx + field.Q(mx, my) * dy
  }
  return sum
}

/** 旋度通量：区域内旋度的二重积分 ∬ curl dA（网格累加） */
export function curlIntegral(field: VectorField, region: Region, grid = 80): number {
  const ext = region.type === 'circle' ? region.r : Math.max(region.w, region.h) / 2
  const x0 = region.cx - ext, y0 = region.cy - ext
  const cell = (2 * ext) / grid
  const dA = cell * cell
  let sum = 0
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const x = x0 + (i + 0.5) * cell
      const y = y0 + (j + 0.5) * cell
      if (pointInRegion(region, x, y)) sum += curlDensity(field, x, y) * dA
    }
  }
  return sum
}
export const FIELDS: VectorField[] = [
  { id: 'rotation', name: '旋转场 (-y, x)', P: (_x, y) => -y, Q: (x) => x },
  { id: 'shear', name: '剪切场 (y, 0)', P: (_x, y) => y, Q: () => 0 },
  { id: 'source', name: '无旋源场 (x, y)', P: (x) => x, Q: (_x, y) => y },
  { id: 'nonuniform', name: '非均匀场 (0, x³/3)', P: () => 0, Q: (x) => (x * x * x) / 3 },
]
export const REGIONS: Region[] = [
  { id: 'rect', name: '矩形区域', type: 'rect', cx: 0, cy: 0, w: 4, h: 3 },
  { id: 'circle', name: '圆形区域', type: 'circle', cx: 0, cy: 0, r: 2 },
]
