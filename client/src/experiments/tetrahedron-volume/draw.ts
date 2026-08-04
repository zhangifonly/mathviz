/**
 * 四面体体积的 Canvas 绘制
 *
 * 同时画**平行六面体（半透明）与其中的四面体（实色）**，
 * 让「四面体是六面体的 1/6」这个关系用图说出来 —— 只画四面体看不出比例。
 * 三条棱向量用不同颜色标出，方便对应到行列式的三列。
 */

import { makeCamera, project, shade, bounds, faceNormal, type Camera, type Vec3 } from '../../lib/proj3d'
import { drawAxes3D } from '../../lib/draw3d'
import {
  tripleProduct, parallelepipedVolume, tetrahedronVolume, areCoplanar,
} from './tetrahedronVolume'

export interface DrawOptions {
  a: Vec3
  b: Vec3
  c: Vec3
  yaw?: number
  /** 画出包含它的平行六面体 */
  showParallelepiped?: boolean
  /** 把六面体切成 6 个四面体来显示 */
  showSixParts?: boolean
  title?: string
  subtitle?: string
}

const EDGE_COLORS = ['rgba(248,113,113,1)', 'rgba(74,222,128,1)', 'rgba(96,165,250,1)']

export function drawTetra(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    a, b, c, yaw = 0.6, showParallelepiped = true, showSixParts = false,
    title = '', subtitle = '',
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  // 八个顶点：原点 + 三棱的所有组合
  const O: Vec3 = [0, 0, 0]
  const corners: Vec3[] = [
    O, a, b, c,
    add(a, b), add(b, c), add(a, c), add(add(a, b), c),
  ]
  const { center, radius } = bounds(corners)
  const k = 1 / Math.max(1e-6, radius)
  const nz = (p: Vec3): Vec3 => [
    (p[0] - center[0]) * k, (p[1] - center[1]) * k, (p[2] - center[2]) * k,
  ]
  const cam = makeCamera({
    yaw, pitch: 0.3, scale: Math.min(W, H) * 0.33, cx: W / 2, cy: H / 2,
  })
  drawAxes3D(ctx, cam, 1.3)

  if (showParallelepiped) drawBox(ctx, cam, O, a, b, c, nz)
  if (showSixParts) drawSixTetrahedra(ctx, cam, O, a, b, c, nz)
  else drawOneTetra(ctx, cam, O, a, b, c, nz)
  drawEdgeVectors(ctx, cam, O, [a, b, c], nz)
  drawLabel(ctx, W, H, a, b, c, title, subtitle)
}

function add(p: Vec3, q: Vec3): Vec3 {
  return [p[0] + q[0], p[1] + q[1], p[2] + q[2]]
}

/** 平行六面体的六个面，半透明线框 */
function drawBox(
  ctx: CanvasRenderingContext2D, cam: Camera,
  o: Vec3, a: Vec3, b: Vec3, c: Vec3, nz: (p: Vec3) => Vec3,
): void {
  const v = [
    o, a, add(a, b), b,
    c, add(a, c), add(add(a, b), c), add(b, c),
  ]
  const faces = [
    [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4],
    [3, 2, 6, 7], [1, 2, 6, 5], [0, 3, 7, 4],
  ]
  const order = faces
    .map((f, i) => {
      const mid = f.reduce(
        (s, vi) => add(s, nz(v[vi])), [0, 0, 0] as Vec3,
      ).map((x) => x / f.length) as Vec3
      return { f, i, d: project(mid, cam).depth }
    })
    .sort((x, y) => y.d - x.d)
  ctx.save()
  for (const { f } of order) {
    const pts = f.map((vi) => project(nz(v[vi]), cam))
    const n = faceNormal(nz(v[f[0]]), nz(v[f[1]]), nz(v[f[2]]))
    ctx.beginPath()
    pts.forEach((p, j) => (j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
    ctx.closePath()
    const br = shade(n)
    ctx.fillStyle = `rgba(${Math.round(90 * br)}, ${Math.round(110 * br)}, ${Math.round(150 * br)}, 0.22)`
    ctx.fill()
    ctx.strokeStyle = 'rgba(148,163,184,0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
  }
  ctx.restore()
}

/** 主四面体（实色） */
function drawOneTetra(
  ctx: CanvasRenderingContext2D, cam: Camera,
  o: Vec3, a: Vec3, b: Vec3, c: Vec3, nz: (p: Vec3) => Vec3,
): void {
  fillTetra(ctx, cam, [o, a, b, c], nz, 'rgba(129,230,217,0.62)',
    'rgba(45,212,191,1)')
}

/**
 * 六个四面体的切分。
 *
 * 标准切法：立方体 [0,1]³ 按坐标排序切成 6 个四面体，
 * 每个对应一个置换 σ，顶点是 0 → e_σ1 → e_σ1+e_σ2 → e_σ1+e_σ2+e_σ3。
 * 这里把它仿射变换到 (a,b,c) 张成的六面体上。
 */
function drawSixTetrahedra(
  ctx: CanvasRenderingContext2D, cam: Camera,
  o: Vec3, a: Vec3, b: Vec3, c: Vec3, nz: (p: Vec3) => Vec3,
): void {
  const basis = [a, b, c]
  const perms = [
    [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0],
  ]
  const colors = [
    'rgba(129,230,217,0.55)', 'rgba(251,191,36,0.5)', 'rgba(248,113,113,0.5)',
    'rgba(167,139,250,0.5)', 'rgba(74,222,128,0.5)', 'rgba(96,165,250,0.5)',
  ]
  // 按深度排序整块画, 避免穿插
  const parts = perms.map((perm, i) => {
    const v1 = basis[perm[0]]
    const v2 = add(v1, basis[perm[1]])
    const v3 = add(v2, basis[perm[2]])
    const verts: Vec3[] = [o, v1, v2, v3]
    const mid = verts.reduce((s, p) => add(s, nz(p)), [0, 0, 0] as Vec3)
      .map((x) => x / 4) as Vec3
    return { verts, color: colors[i], d: project(mid, cam).depth }
  }).sort((x, y) => y.d - x.d)

  for (const p of parts) {
    fillTetra(ctx, cam, p.verts, nz, p.color, 'rgba(255,255,255,0.35)')
  }
}

/** 画一个四面体的四个面 */
function fillTetra(
  ctx: CanvasRenderingContext2D, cam: Camera, verts: Vec3[],
  nz: (p: Vec3) => Vec3, fill: string, stroke: string,
): void {
  const faces = [[0, 2, 1], [0, 1, 3], [0, 3, 2], [1, 2, 3]]
  const order = faces
    .map((f) => {
      const mid = f.reduce((s, vi) => add(s, nz(verts[vi])), [0, 0, 0] as Vec3)
        .map((x) => x / 3) as Vec3
      return { f, d: project(mid, cam).depth }
    })
    .sort((x, y) => y.d - x.d)
  ctx.save()
  for (const { f } of order) {
    const pts = f.map((vi) => project(nz(verts[vi]), cam))
    const n = faceNormal(nz(verts[f[0]]), nz(verts[f[1]]), nz(verts[f[2]]))
    ctx.beginPath()
    pts.forEach((p, j) => (j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
    ctx.closePath()
    // 用 shade 调明暗, 保留 fill 的色调
    const br = shade(n)
    ctx.globalAlpha = 1
    ctx.fillStyle = fill.replace(
      /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/,
      (_m, r, g, bl, al) => `rgba(${Math.round(+r * br)}, ${Math.round(+g * br)}, ${Math.round(+bl * br)}, ${al})`,
    )
    ctx.fill()
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1.6
    ctx.stroke()
  }
  ctx.restore()
}

/** 三条棱向量用不同颜色画出，对应行列式的三列 */
function drawEdgeVectors(
  ctx: CanvasRenderingContext2D, cam: Camera, o: Vec3, edges: Vec3[],
  nz: (p: Vec3) => Vec3,
): void {
  const names = ['a', 'b', 'c']
  const so = project(nz(o), cam)
  ctx.save()
  edges.forEach((e, i) => {
    const se = project(nz(e), cam)
    ctx.strokeStyle = EDGE_COLORS[i]
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(so.x, so.y)
    ctx.lineTo(se.x, se.y)
    ctx.stroke()
    ctx.fillStyle = EDGE_COLORS[i]
    ctx.beginPath()
    ctx.arc(se.x, se.y, 4.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = 'bold 15px sans-serif'
    ctx.fillText(names[i], se.x + 9, se.y - 8)
  })
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  a: Vec3, b: Vec3, c: Vec3, title: string, subtitle: string,
): void {
  const tp = tripleProduct(a, b, c)
  const box = parallelepipedVolume(a, b, c)
  const tet = tetrahedronVolume(a, b, c)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title || '四面体与平行六面体', 18, 28)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  if (subtitle) ctx.fillText(subtitle, 18, 48)
  ctx.textAlign = 'right'
  ctx.fillText(`det = ${tp.toFixed(4)}`, W - 18, 28)
  ctx.fillText(`六面体 ${box.toFixed(4)} · 四面体 ${tet.toFixed(4)}`, W - 18, 48)
  ctx.textAlign = 'left'
  ctx.fillStyle = areCoplanar(a, b, c)
    ? 'rgba(248,113,113,0.95)'
    : 'rgba(148,163,184,0.7)'
  ctx.fillText(
    areCoplanar(a, b, c) ? '三棱共面 · 四面体退化成平面图形' : 'a 红 · b 绿 · c 蓝，对应行列式的三列',
    18, H - 16,
  )
  ctx.restore()
}
