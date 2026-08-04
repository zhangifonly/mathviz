/**
 * 闵可夫斯基和与斯坦纳公式的 Canvas 绘制
 *
 * 画原多面体的线框，加上"擦"出来的圆角体：面板、棱楔、顶点球片分别上色，
 * 让斯坦纳公式的四项在图上一一对应。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d'
import { drawAxes3D } from '../../lib/draw3d'
import { steinerTerms, faceNormal, type Solid } from './minkowskiSteiner'

export interface DrawOptions {
  solid: Solid
  /** 球半径 r */
  r: number
  yaw?: number
  /** 高亮哪一项：0 本体 1 面 2 棱 3 顶点 null 全部 */
  highlight?: 0 | 1 | 2 | 3 | null
  title?: string
  subtitle?: string
}

const COLORS = {
  body: 'rgba(96,165,250,0.9)',
  face: 'rgba(74,222,128,0.55)',
  edge: 'rgba(251,191,36,0.6)',
  vertex: 'rgba(248,113,113,0.65)',
}

export function drawMinkowski(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { solid, r, yaw = 0.6, highlight = null, title = '', subtitle = '' } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  // 视野要容纳整个圆角体：顶点到原点的最大距离再加球半径 r。
  // ⚠️ 不能按棱长估(写成 2+r)——立方体最远的是**顶点**, 距离是 √3 而非 2,
  // 那样算出的 scale 偏大, 立体会被截在画布外(截图里只剩上半个)。
  let vertexReach = 0
  for (const v of solid.vertices) {
    vertexReach = Math.max(vertexReach, Math.hypot(v[0], v[1], v[2]))
  }
  const reach = vertexReach + r
  const cam = makeCamera({
    yaw, pitch: 0.32, scale: (Math.min(W, H) * 0.40) / Math.max(1e-6, reach),
    cx: W / 2, cy: H / 2,
  })

  drawAxes3D(ctx, cam, reach * 0.95)

  const show = (k: 0 | 1 | 2 | 3) => highlight === null || highlight === k

  // 顶点球片（画在最外层，半透明）
  if (r > 1e-6 && show(3)) drawVertexBalls(ctx, cam, solid, r)
  // 棱楔（圆柱的一瓣，用一串平行线示意）
  if (r > 1e-6 && show(2)) drawEdgeWedges(ctx, cam, solid, r)
  // 面板（沿面法向外推）
  if (r > 1e-6 && show(1)) drawFaceSlabs(ctx, cam, solid, r)
  // 本体线框
  if (show(0)) drawWireframe(ctx, cam, solid)

  drawLabel(ctx, W, H, solid, r, highlight, title, subtitle)
}

/** 原多面体线框 */
function drawWireframe(
  ctx: CanvasRenderingContext2D, cam: Camera, K: Solid,
): void {
  ctx.save()
  ctx.strokeStyle = COLORS.body
  ctx.lineWidth = 2.4
  for (const [i, j] of K.edges) {
    const a = project(K.vertices[i], cam)
    const b = project(K.vertices[j], cam)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }
  ctx.fillStyle = COLORS.body
  for (const v of K.vertices) {
    const s = project(v, cam)
    ctx.beginPath()
    ctx.arc(s.x, s.y, 3.4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** 顶点处的球面片：每个顶点画一个小球的轮廓 */
function drawVertexBalls(
  ctx: CanvasRenderingContext2D, cam: Camera, K: Solid, r: number,
): void {
  ctx.save()
  ctx.strokeStyle = COLORS.vertex
  ctx.fillStyle = 'rgba(248,113,113,0.16)'
  ctx.lineWidth = 1.5
  for (const v of K.vertices) {
    const c = project(v, cam)
    // 用投影后的尺度近似球的视半径
    const edge = project([v[0] + r, v[1], v[2]], cam)
    const rad = Math.hypot(edge.x - c.x, edge.y - c.y)
    ctx.beginPath()
    ctx.arc(c.x, c.y, rad, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
  ctx.restore()
}

/** 棱外的圆柱楔：沿棱方向画一串偏移线，示意柱面 */
function drawEdgeWedges(
  ctx: CanvasRenderingContext2D, cam: Camera, K: Solid, r: number,
): void {
  ctx.save()
  ctx.strokeStyle = COLORS.edge
  ctx.lineWidth = 1.3
  for (const [i, j] of K.edges) {
    const p = K.vertices[i]
    const q = K.vertices[j]
    // 棱方向
    const d: Vec3 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]]
    const dn = Math.hypot(d[0], d[1], d[2]) || 1
    const u: Vec3 = [d[0] / dn, d[1] / dn, d[2] / dn]
    // 垂直于棱、朝外的两个方向（用棱中点的位置向量近似外法向）
    const mid: Vec3 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2]
    const mn = Math.hypot(mid[0], mid[1], mid[2]) || 1
    const out: Vec3 = [mid[0] / mn, mid[1] / mn, mid[2] / mn]
    // 去掉 out 在 u 上的分量
    const dotu = out[0] * u[0] + out[1] * u[1] + out[2] * u[2]
    const e1v: Vec3 = [out[0] - dotu * u[0], out[1] - dotu * u[1], out[2] - dotu * u[2]]
    const e1n = Math.hypot(e1v[0], e1v[1], e1v[2]) || 1
    const e1: Vec3 = [e1v[0] / e1n, e1v[1] / e1n, e1v[2] / e1n]
    const e2: Vec3 = [
      u[1] * e1[2] - u[2] * e1[1],
      u[2] * e1[0] - u[0] * e1[2],
      u[0] * e1[1] - u[1] * e1[0],
    ]
    // 楔面上几条母线
    for (let k = 0; k <= 4; k++) {
      const t = (Math.PI / 2) * (k / 4 - 0.5)
      const off: Vec3 = [
        (e1[0] * Math.cos(t) + e2[0] * Math.sin(t)) * r,
        (e1[1] * Math.cos(t) + e2[1] * Math.sin(t)) * r,
        (e1[2] * Math.cos(t) + e2[2] * Math.sin(t)) * r,
      ]
      const a = project([p[0] + off[0], p[1] + off[1], p[2] + off[2]], cam)
      const b = project([q[0] + off[0], q[1] + off[1], q[2] + off[2]], cam)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }
  ctx.restore()
}

/**
 * 面板：每个面整体沿**面法向**外推 r，画出外推后的面轮廓。
 *
 * ⚠️ 必须用面法向。早先按"棱中点的位置向量"当外法向，对立方体来说
 * 棱中点方向是斜的(如 (1,1,0)/√2)，推出去比面板远 √2 倍，
 * 画面上绿色面板会跑到黄色棱楔外面 —— 截图里一眼就看出不对。
 */
function drawFaceSlabs(
  ctx: CanvasRenderingContext2D, cam: Camera, K: Solid, r: number,
): void {
  ctx.save()
  ctx.strokeStyle = COLORS.face
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])
  for (const face of K.faces) {
    const n = faceNormal(K, face)
    const off: Vec3 = [n[0] * r, n[1] * r, n[2] * r]
    ctx.beginPath()
    face.forEach((vi, k) => {
      const v = K.vertices[vi]
      const s = project([v[0] + off[0], v[1] + off[1], v[2] + off[2]], cam)
      if (k === 0) ctx.moveTo(s.x, s.y)
      else ctx.lineTo(s.x, s.y)
    })
    ctx.closePath()
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  K: Solid, r: number, highlight: 0 | 1 | 2 | 3 | null,
  title: string, subtitle: string,
): void {
  const t = steinerTerms(K, r)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title || '闵可夫斯基和与斯坦纳公式', 18, 28)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  if (subtitle) ctx.fillText(subtitle, 18, 48)
  ctx.textAlign = 'right'
  ctx.fillText(`r = ${r.toFixed(3)}`, W - 18, 28)
  ctx.fillText(`V(r) = ${t.total.toFixed(4)}`, W - 18, 48)
  ctx.textAlign = 'left'

  // 四项图例
  const items: Array<[string, string, number]> = [
    ['本体 V', COLORS.body, t.body],
    ['面 S·r', COLORS.face, t.faces],
    ['棱 M·r²', COLORS.edge, t.edges],
    ['顶点 (4π/3)r³', COLORS.vertex, t.vertices],
  ]
  let y = H - 82
  ctx.font = '12px sans-serif'
  items.forEach(([name, color, val], idx) => {
    const dim = highlight !== null && highlight !== idx
    ctx.globalAlpha = dim ? 0.3 : 1
    ctx.fillStyle = color
    ctx.fillRect(18, y - 8, 11, 11)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(`${name} = ${val.toFixed(4)}`, 35, y + 1)
    y += 18
  })
  ctx.globalAlpha = 1
  ctx.restore()
}
