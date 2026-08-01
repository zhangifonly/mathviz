/**
 * 空间填充的 Canvas 绘制
 *
 * 本实验的核心是「堆起来有没有缝」，所以必须能画**多个副本平移堆叠**，
 * 而不只是单个多面体。通用 drawPolyhedron 画不出这个。
 *
 * 立方体与六棱柱的平移向量是显然的；截角八面体与菱形十二面体的
 * 填充格是体心立方（BCC）与面心立方（FCC），平移向量在下方注明。
 */

import {
  makeCamera, project, shade, rampColor, bounds, faceNormal,
  type Camera, type Vec3,
} from '../../lib/proj3d'
import { drawAxes3D } from '../../lib/draw3d'
import { faceCenter, type Polyhedron } from '../../lib/polyhedron'
import { platonicOf } from '../platonic-solids/platonicSolids'
import { truncate, idealT } from '../archimedean-solids/archimedeanSolids'
import { prism } from '../prism-antiprism/prismAntiprism'
import { DIHEDRAL_ANGLES, gapAngle, maxFitCount, type FillKind } from './spaceFillingSolids'

export interface DrawOptions {
  kind: FillKind
  /** 堆叠层数。1 = 只画一个 */
  copies?: number
  yaw?: number
  ramp?: string
  /** 展示正四面体绕棱堆 5 个留缝的反例 */
  showTetraGap?: boolean
  faceAlpha?: number
}

/** 菱形十二面体：立方体顶点 + 面心方向的顶点 */
function rhombicDodecahedron(): Polyhedron {
  const vertices: Vec3[] = [
    // 立方体的 8 个顶点
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
    // 6 个面心方向, 距离为 2
    [2, 0, 0], [-2, 0, 0], [0, 2, 0], [0, -2, 0], [0, 0, 2], [0, 0, -2],
  ]
  // 每个菱形面由两个立方体顶点与两个面心顶点组成
  const faces = [
    [8, 0, 12, 2], [8, 2, 11, 3], [8, 3, 13, 1], [8, 1, 10, 0],
    [9, 4, 10, 5], [9, 5, 13, 7], [9, 7, 11, 6], [9, 6, 12, 4],
    [10, 1, 13, 5], [10, 4, 12, 0], [11, 2, 12, 6], [11, 7, 13, 3],
  ]
  return { name: '菱形十二面体', vertices, faces }
}

/** 取多面体与它的平移向量组 */
export function fillCell(kind: FillKind): { poly: Polyhedron; shifts: Vec3[] } {
  switch (kind) {
    case 'cube': {
      const poly = platonicOf('cube')
      // 边长 2, 沿三轴各平移 2
      return { poly, shifts: [[2, 0, 0], [0, 2, 0], [0, 0, 2]] }
    }
    case 'hexPrism': {
      const poly = prism(6)
      // 六边形密铺的两个基向量 + 竖直
      const s = 2 * Math.sin(Math.PI / 6)
      const dx = Math.sqrt(3) * Math.cos(Math.PI / 6) * 2 * 0.866
      return {
        poly,
        shifts: [[dx, 0, 0], [dx / 2, 1.5, 0], [0, 0, s]],
      }
    }
    case 'truncatedOctahedron': {
      const poly = truncate(platonicOf('octahedron'), idealT('octahedron'))
      // BCC 格: 体心立方的平移向量
      return { poly, shifts: [[1, 1, 0], [1, 0, 1], [0, 1, 1]] }
    }
    case 'rhombicDodecahedron': {
      const poly = rhombicDodecahedron()
      // FCC 格
      return { poly, shifts: [[2, 2, 0], [2, 0, 2], [0, 2, 2]] }
    }
  }
}

export function drawSpaceFilling(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    kind, copies = 1, yaw = 0.6, ramp = 'viridis',
    showTetraGap = false, faceAlpha = 0.9,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  if (showTetraGap) {
    drawTetraGapDemo(ctx, W, H, yaw)
    return
  }

  const { poly, shifts } = fillCell(kind)
  // 生成堆叠副本的偏移量
  const offsets: Vec3[] = [[0, 0, 0]]
  if (copies > 1) {
    for (const s of shifts) offsets.push(s)
    if (copies > 4) {
      offsets.push([shifts[0][0] + shifts[1][0], shifts[0][1] + shifts[1][1],
        shifts[0][2] + shifts[1][2]])
    }
  }
  const used = offsets.slice(0, Math.max(1, Math.min(copies, offsets.length)))

  // 所有副本一起归一化, 保证相对位置正确
  const allPts = used.flatMap((o) => poly.vertices.map(
    (v) => [v[0] + o[0], v[1] + o[1], v[2] + o[2]] as Vec3,
  ))
  const { center, radius } = bounds(allPts)
  const k = 1 / Math.max(1e-9, radius)
  const cam = makeCamera({
    yaw, pitch: 0.3, scale: Math.min(W, H) * 0.34, cx: W / 2, cy: H / 2,
  })
  drawAxes3D(ctx, cam, 1.35)

  // 按副本深度排序, 远的先画
  const order = used
    .map((o, i) => ({
      o,
      i,
      d: project([
        (o[0] - center[0]) * k, (o[1] - center[1]) * k, (o[2] - center[2]) * k,
      ], cam).depth,
    }))
    .sort((a, b) => b.d - a.d)

  for (const { o, i } of order) {
    const nz = (p: Vec3): Vec3 => [
      (p[0] + o[0] - center[0]) * k,
      (p[1] + o[1] - center[1]) * k,
      (p[2] + o[2] - center[2]) * k,
    ]
    drawCell(ctx, cam, poly, nz, ramp, faceAlpha, i)
  }

  drawLabel(ctx, W, kind, used.length)
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  poly: Polyhedron,
  nz: (p: Vec3) => Vec3,
  ramp: string,
  alpha: number,
  copyIndex: number,
): void {
  const order = poly.faces
    .map((_, i) => ({ i, d: project(nz(faceCenter(poly, i)), cam).depth }))
    .sort((a, b) => b.d - a.d)
  ctx.save()
  ctx.globalAlpha = alpha
  for (const { i } of order) {
    const f = poly.faces[i]
    const pts = f.map((vi) => project(nz(poly.vertices[vi]), cam))
    const n = faceNormal(nz(poly.vertices[f[0]]), nz(poly.vertices[f[1]]),
      nz(poly.vertices[f[2]]))
    ctx.beginPath()
    pts.forEach((p, j) => (j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
    ctx.closePath()
    // 不同副本用配色带的不同段, 便于区分相邻胞
    const t = (copyIndex * 0.27 + i / Math.max(1, poly.faces.length)) % 1
    ctx.fillStyle = rampColor(t, ramp, shade(n))
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1
    ctx.stroke()
  }
  ctx.restore()
}

/** 正四面体绕棱堆 5 个留缝的反例演示（俯视二维示意） */
function drawTetraGapDemo(
  ctx: CanvasRenderingContext2D, W: number, H: number, yaw: number,
): void {
  const d = DIHEDRAL_ANGLES.tetrahedron
  const n = maxFitCount(d)
  const gap = gapAngle(d, n)
  const cx = W / 2
  const cy = H / 2 + 20
  const R = Math.min(W, H) * 0.32

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(yaw * 0.3)
  // 绕一条棱(垂直纸面)排布 n 个二面角扇形
  for (let i = 0; i < n; i++) {
    const a0 = (i * d * Math.PI) / 180
    const a1 = ((i + 1) * d * Math.PI) / 180
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, R, a0, a1)
    ctx.closePath()
    ctx.fillStyle = rampColor(i / n, 'viridis', 0.9)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.stroke()
  }
  // 缝隙用红色标出
  const g0 = (n * d * Math.PI) / 180
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, R, g0, 2 * Math.PI)
  ctx.closePath()
  ctx.fillStyle = 'rgba(239,68,68,0.85)'
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText('正四面体绕棱堆叠', 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`二面角 ${d.toFixed(4)}° × ${n} 个 = ${(d * n).toFixed(4)}°`, 18, 52)
  ctx.fillStyle = 'rgba(248,113,113,0.95)'
  ctx.fillText(`红色缝隙 ${gap.toFixed(4)}° —— 亚里士多德的千年错误`, 18, 74)
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number, kind: FillKind, count: number,
): void {
  const names: Record<FillKind, string> = {
    cube: '立方体',
    truncatedOctahedron: '截角八面体',
    rhombicDodecahedron: '菱形十二面体',
    hexPrism: '正六棱柱',
  }
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(names[kind], 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`堆叠 ${count} 个胞 · 无缝填充空间`, 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText('相邻胞用不同色区分', W - 18, 30)
  ctx.restore()
}
