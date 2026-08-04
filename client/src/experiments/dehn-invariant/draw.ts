/**
 * Dehn 不变量的 Canvas 绘制
 *
 * 画立体的线框，并在每条棱上标出二面角。用颜色区分：
 *   绿 = 二面角是 π 的有理倍数（这一项对 Dehn 不变量贡献为零）
 *   红 = 不可通约（这一项让 Dehn 不变量非零，剪拼被卡住）
 *
 * 这样"为什么立方体能剪成柱体、却剪不成四面体"就成了颜色对比。
 */

import { makeCamera, project, type Camera, type Vec3 } from '../../lib/proj3d'
import { rationalMultipleOfPi, type SolidSpec } from './dehnInvariant'

export interface DrawOptions {
  spec: SolidSpec
  /** 棱长 */
  edge?: number
  yaw?: number
  /** 标出二面角读数 */
  showAngles?: boolean
  title?: string
  subtitle?: string
}

const DEG = 180 / Math.PI
const RATIONAL = 'rgba(74,222,128,1)'
const IRRATIONAL = 'rgba(248,113,113,1)'

/** 各立体的顶点与棱（棱长归一） */
interface Wire {
  vertices: Vec3[]
  /** [i, j, 二面角所属的 term 下标] */
  edges: Array<[number, number, number]>
}

function wireOf(id: string): Wire {
  if (id === 'tetrahedron') {
    const s = 1 / (2 * Math.SQRT2)
    return {
      vertices: [[s, s, s], [s, -s, -s], [-s, s, -s], [-s, -s, s]],
      edges: [
        [0, 1, 0], [0, 2, 0], [0, 3, 0], [1, 2, 0], [1, 3, 0], [2, 3, 0],
      ],
    }
  }
  if (id === 'octahedron') {
    const c = 1 / Math.SQRT2
    return {
      vertices: [
        [c, 0, 0], [-c, 0, 0], [0, c, 0], [0, -c, 0], [0, 0, c], [0, 0, -c],
      ],
      edges: [
        [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0],
        [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0],
        [2, 4, 0], [2, 5, 0], [3, 4, 0], [3, 5, 0],
      ],
    }
  }
  if (id === 'prism') {
    // 正三棱柱：底面正三角形边长 1，高 1
    const r = 1 / Math.sqrt(3)
    const top: Vec3[] = [0, 1, 2].map((k) => {
      const a = (2 * Math.PI * k) / 3
      return [r * Math.cos(a), r * Math.sin(a), 0.5]
    })
    const bot: Vec3[] = [0, 1, 2].map((k) => {
      const a = (2 * Math.PI * k) / 3
      return [r * Math.cos(a), r * Math.sin(a), -0.5]
    })
    return {
      vertices: [...top, ...bot],
      edges: [
        // 3 条侧棱：二面角 = 底面内角 π/3，是 terms[0]
        [0, 3, 0], [1, 4, 0], [2, 5, 0],
        // 6 条底面棱：二面角 π/2，是 terms[1]
        [0, 1, 1], [1, 2, 1], [2, 0, 1],
        [3, 4, 1], [4, 5, 1], [5, 3, 1],
      ],
    }
  }
  // cube
  const h = 0.5
  return {
    vertices: [
      [-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h],
      [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h],
    ],
    edges: [
      [0, 1, 0], [1, 2, 0], [2, 3, 0], [3, 0, 0],
      [4, 5, 0], [5, 6, 0], [6, 7, 0], [7, 4, 0],
      [0, 4, 0], [1, 5, 0], [2, 6, 0], [3, 7, 0],
    ],
  }
}

export function drawDehn(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    spec, edge = 1, yaw = 0.6, showAngles = true, title = '', subtitle = '',
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  const wire = wireOf(spec.id)
  const terms = spec.terms(edge)
  // 顶点按棱长缩放
  const verts = wire.vertices.map(
    (v) => [v[0] * edge, v[1] * edge, v[2] * edge] as Vec3,
  )
  let reach = 0
  for (const v of verts) reach = Math.max(reach, Math.hypot(v[0], v[1], v[2]))
  const cam = makeCamera({
    yaw, pitch: 0.3, scale: (Math.min(W, H) * 0.36) / Math.max(1e-6, reach),
    cx: W / 2, cy: H / 2,
  })

  // 棱：按二面角是否有理上色
  ctx.save()
  for (const [i, j, ti] of wire.edges) {
    const t = terms[Math.min(ti, terms.length - 1)]
    const isRat = rationalMultipleOfPi(t.angle).rational
    ctx.strokeStyle = isRat ? RATIONAL : IRRATIONAL
    ctx.lineWidth = 2.6
    const a = project(verts[i], cam)
    const b = project(verts[j], cam)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }
  // 顶点
  ctx.fillStyle = 'rgba(226,232,240,0.9)'
  for (const v of verts) {
    const s = project(v, cam)
    ctx.beginPath()
    ctx.arc(s.x, s.y, 3, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  if (showAngles) drawAngleTags(ctx, cam, verts, wire, terms)
  drawLabel(ctx, W, H, spec, terms, title, subtitle)
}

/** 在每类棱的代表位置标出二面角 */
function drawAngleTags(
  ctx: CanvasRenderingContext2D, cam: Camera, verts: Vec3[],
  wire: Wire, terms: ReturnType<SolidSpec['terms']>,
): void {
  // 每个 term 只标一次，选该类中离观察者最近的一条棱
  const byTerm = new Map<number, { mid: Vec3; depth: number }>()
  for (const [i, j, ti] of wire.edges) {
    const mid: Vec3 = [
      (verts[i][0] + verts[j][0]) / 2,
      (verts[i][1] + verts[j][1]) / 2,
      (verts[i][2] + verts[j][2]) / 2,
    ]
    const d = project(mid, cam).depth
    const cur = byTerm.get(ti)
    if (!cur || d < cur.depth) byTerm.set(ti, { mid, depth: d })
  }
  ctx.save()
  ctx.font = 'bold 13px sans-serif'
  for (const [ti, { mid }] of byTerm) {
    const t = terms[Math.min(ti, terms.length - 1)]
    const r = rationalMultipleOfPi(t.angle)
    const s = project(mid, cam)
    const text = r.rational
      ? `${(t.angle * DEG).toFixed(1)}° = ${r.p === 1 ? '' : r.p}π/${r.q}`
      : `${(t.angle * DEG).toFixed(2)}° 无理`
    ctx.fillStyle = r.rational ? RATIONAL : IRRATIONAL
    ctx.fillText(text, s.x + 8, s.y - 6)
  }
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  spec: SolidSpec, terms: ReturnType<SolidSpec['terms']>,
  title: string, subtitle: string,
): void {
  const allRational = terms.every((t) => rationalMultipleOfPi(t.angle).rational)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(title || spec.label, 18, 28)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(subtitle || spec.note, 18, 48)
  ctx.textAlign = 'right'
  ctx.fillStyle = allRational ? RATIONAL : IRRATIONAL
  ctx.font = 'bold 15px sans-serif'
  ctx.fillText(
    allRational ? 'Dehn 不变量 = 0' : 'Dehn 不变量 ≠ 0',
    W - 18, 30,
  )
  ctx.font = '12px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText(
    allRational ? '可与立方体剪拼（无障碍）' : '与立方体剪不成',
    W - 18, 50,
  )
  ctx.textAlign = 'left'
  // 图例
  ctx.font = '12px sans-serif'
  ctx.fillStyle = RATIONAL
  ctx.fillRect(18, H - 40, 11, 11)
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.fillText('二面角是 π 的有理倍数（贡献为 0）', 35, H - 31)
  ctx.fillStyle = IRRATIONAL
  ctx.fillRect(18, H - 22, 11, 11)
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.fillText('与 π 不可通约（让不变量非零）', 35, H - 13)
  ctx.restore()
}
