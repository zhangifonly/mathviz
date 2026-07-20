/**
 * 球极投影核心算法（纯函数，便于测试）
 *
 * 以单位球为例，从北极 N=(0,0,1) 把球面上除北极外的点
 * 投射到赤道平面 z=0：射线 N->P 与平面的交点即投影像。
 * 该映射是保角的（共形），圆映射成圆或直线。
 */

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface Vec2 {
  X: number
  Y: number
}

/** 由经度 lon、纬度 lat（弧度）得到单位球面上的 3D 点 */
export function sphere(lon: number, lat: number): Vec3 {
  const cl = Math.cos(lat)
  return { x: cl * Math.cos(lon), y: cl * Math.sin(lon), z: Math.sin(lat) }
}

/**
 * 球极投影：从北极 (0,0,1) 投到平面 z=0。
 * 公式 (X,Y) = (x/(1-z), y/(1-z))。北极附近 z->1 时像趋于无穷。
 */
export function project(p: Vec3): Vec2 {
  const d = 1 - p.z
  const k = Math.abs(d) < 1e-9 ? 1e9 : 1 / d
  return { X: p.x * k, Y: p.y * k }
}

/** 逆投影：平面点 (X,Y) 映回单位球面上的点 */
export function unproject(q: Vec2): Vec3 {
  const s = q.X * q.X + q.Y * q.Y
  const d = s + 1
  return { x: (2 * q.X) / d, y: (2 * q.Y) / d, z: (s - 1) / d }
}

/** 绕竖直轴旋转球面点（经度方向），用于交互旋转 */
export function rotateZ(p: Vec3, ang: number): Vec3 {
  const c = Math.cos(ang)
  const s = Math.sin(ang)
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z }
}

/** 一条纬线（固定 lat）上的采样点，经度均匀取样 */
export function parallel(lat: number, n = 64): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i <= n; i++) {
    const lon = (i / n) * 2 * Math.PI
    out.push(sphere(lon, lat))
  }
  return out
}

/** 一条经线（固定 lon）上的采样点，纬度从南到北取样 */
export function meridian(lon: number, n = 48): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i <= n; i++) {
    const lat = -Math.PI / 2 + (i / n) * Math.PI
    out.push(sphere(lon, lat))
  }
  return out
}

/** 讲解可选的纬线密度（每半球格数） */
export const GRID_COUNTS = [4, 6, 8]
