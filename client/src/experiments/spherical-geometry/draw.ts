/**
 * 球面几何 Canvas 绘制（正交投影）
 * 画经纬网格 + 大圆弧 + 球面三角形。绕 Y 轴旋转 rot 弧度看不同侧面。
 */
import {
  toVec3, greatCircleArc, sphericalTriangleAngleSum,
  type Vec3, type GeoPoint,
} from './sphericalGeometry'

function rotY(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: c * v.x + s * v.z, y: v.y, z: -s * v.x + c * v.z }
}
// 倾斜视角：再绕 X 轴抬 25 度，让北极偏上
function rotX(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: v.x, y: c * v.y - s * v.z, z: s * v.y + c * v.z }
}

export function drawSphericalGeometry(
  canvas: HTMLCanvasElement,
  points: GeoPoint[],
  rot = 0,
  showTriangle = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width, H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.4
  const view = (v: Vec3) => rotX(rotY(v, rot), -0.44)
  const proj = (v: Vec3) => ({ px: cx + view(v).x * R, py: cy - view(v).z * R, front: view(v).y > -0.02 })

  // 球体轮廓
  ctx.fillStyle = '#eef2ff'
  ctx.strokeStyle = '#c7d2fe'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.fill(); ctx.stroke()

  // 经纬网格
  ctx.strokeStyle = 'rgba(99,102,241,0.28)'
  ctx.lineWidth = 1
  for (let lat = -60; lat <= 60; lat += 30) drawSphLine(ctx, proj, lonLine(lat, true))
  for (let lon = 0; lon < 360; lon += 30) drawSphLine(ctx, proj, lonLine(lon, false))

  if (showTriangle && points.length >= 3) drawTriangle(ctx, proj, points)
  drawPoints(ctx, proj, points)

  if (showTriangle && points.length >= 3) {
    const [a, b, c] = points.map((p) => toVec3(p.lat, p.lon))
    const sum = sphericalTriangleAngleSum(a, b, c)
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 15px system-ui'
    ctx.fillText(`内角和 ${sum.toFixed(1)}° · 盈余 ${(sum - 180).toFixed(1)}°`, 14, H - 16)
  }
}

// 生成一条纬线(isLat=true)或经线的采样向量
function lonLine(deg: number, isLat: boolean): Vec3[] {
  const pts: Vec3[] = []
  for (let t = 0; t <= 360; t += 6) {
    pts.push(isLat ? toVec3(deg, t) : toVec3(t - 90, deg))
  }
  return pts
}

type Proj = (v: Vec3) => { px: number; py: number; front: boolean }

function drawSphLine(ctx: CanvasRenderingContext2D, proj: Proj, pts: Vec3[]) {
  for (let i = 1; i < pts.length; i++) {
    const p0 = proj(pts[i - 1]), p1 = proj(pts[i])
    if (!p0.front && !p1.front) continue
    ctx.globalAlpha = p0.front && p1.front ? 1 : 0.35
    ctx.beginPath(); ctx.moveTo(p0.px, p0.py); ctx.lineTo(p1.px, p1.py); ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawTriangle(ctx: CanvasRenderingContext2D, proj: Proj, points: GeoPoint[]) {
  const v = points.map((p) => toVec3(p.lat, p.lon))
  ctx.strokeStyle = '#dc2626'
  ctx.lineWidth = 2.5
  for (let i = 0; i < 3; i++) {
    const arc = greatCircleArc(v[i], v[(i + 1) % 3], 48)
    drawSphLine(ctx, proj, arc)
  }
}

function drawPoints(ctx: CanvasRenderingContext2D, proj: Proj, points: GeoPoint[]) {
  ctx.font = '13px system-ui'
  for (const p of points) {
    const q = proj(toVec3(p.lat, p.lon))
    if (!q.front) continue
    ctx.fillStyle = '#7c3aed'
    ctx.beginPath(); ctx.arc(q.px, q.py, 5, 0, 2 * Math.PI); ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.fillText(p.name, q.px + 8, q.py - 6)
  }
}
