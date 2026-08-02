/**
 * 双曲三角形的 Canvas 绘制
 *
 * 画在庞加莱圆盘里：边界圆 + 测地线三角形 + 可选的测地线网格。
 * 三角形内部用「细分成小三角片」填充 —— 直接连三个顶点会画出欧氏直边，
 * 把测地线的弯曲吃掉，看起来就不是双曲三角形了。
 */

import {
  geodesicPath, geodesicThrough, triangleAngles, angleSum, angularDefect,
  triangleSides, hypot2, type HPoint, type HTriangle,
} from '../../lib/hyperbolic2d'

export interface DrawOptions {
  triangle: HTriangle
  /** 画背景测地线网格 */
  showGrid?: boolean
  /** 标出顶点与角度 */
  showAngles?: boolean
  title?: string
  subtitle?: string
  readout?: string
}

const DEG = 180 / Math.PI

export function drawHyperbolic(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    triangle, showGrid = true, showAngles = true,
    title = '', subtitle = '', readout = '',
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  const R = Math.min(W, H) * 0.42
  const cx = W / 2
  const cy = H / 2
  const toScreen = (p: HPoint) => ({ x: cx + p.x * R, y: cy - p.y * R })

  // 边界圆（无穷远处）
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(30, 41, 59, 0.75)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(148,163,184,0.85)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.restore()

  if (showGrid) drawGeodesicGrid(ctx, toScreen)
  fillTriangle(ctx, triangle, toScreen)
  drawEdges(ctx, triangle, toScreen)
  if (showAngles) drawVertices(ctx, triangle, toScreen)
  drawLabel(ctx, W, H, title, subtitle, readout)
}

type ToScreen = (p: HPoint) => { x: number; y: number }

/** 背景测地线网格：若干条穿过圆盘的测地线 */
function drawGeodesicGrid(ctx: CanvasRenderingContext2D, toScreen: ToScreen): void {
  ctx.save()
  ctx.strokeStyle = 'rgba(148,163,184,0.22)'
  ctx.lineWidth = 1
  // 一族过原点的直径
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI * k) / 6
    const p: HPoint = { x: 0.97 * Math.cos(a), y: 0.97 * Math.sin(a) }
    const q: HPoint = { x: -p.x, y: -p.y }
    strokePath(ctx, geodesicPath(p, q, 40), toScreen)
  }
  // 一族不过原点的测地线弧
  for (let k = 0; k < 12; k++) {
    const a = (2 * Math.PI * k) / 12
    const p: HPoint = { x: 0.96 * Math.cos(a), y: 0.96 * Math.sin(a) }
    const q: HPoint = {
      x: 0.96 * Math.cos(a + 1.2), y: 0.96 * Math.sin(a + 1.2),
    }
    strokePath(ctx, geodesicPath(p, q, 40), toScreen)
  }
  ctx.restore()
}

function strokePath(
  ctx: CanvasRenderingContext2D, pts: HPoint[], toScreen: ToScreen,
): void {
  ctx.beginPath()
  pts.forEach((p, i) => {
    const s = toScreen(p)
    if (i === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  })
  ctx.stroke()
}

/**
 * 填充三角形：递归细分成小三角片。
 *
 * 每一层把三条边的中点连起来，得到 4 个子三角形。中点取**测地线中点**
 * （沿测地线路径取参数中点），这样边界才贴合测地线的弯曲。
 */
function fillTriangle(
  ctx: CanvasRenderingContext2D, t: HTriangle, toScreen: ToScreen,
): void {
  ctx.save()
  ctx.fillStyle = 'rgba(129, 230, 217, 0.42)'
  const emit = (a: HPoint, b: HPoint, c: HPoint) => {
    const sa = toScreen(a)
    const sb = toScreen(b)
    const sc = toScreen(c)
    ctx.beginPath()
    ctx.moveTo(sa.x, sa.y)
    ctx.lineTo(sb.x, sb.y)
    ctx.lineTo(sc.x, sc.y)
    ctx.closePath()
    ctx.fill()
  }
  subdivide(t.A, t.B, t.C, 4, emit)
  ctx.restore()
}

/** 测地线中点：沿测地线路径取参数中点 */
function geodesicMid(p: HPoint, q: HPoint): HPoint {
  const path = geodesicPath(p, q, 2)
  return path[1]
}

function subdivide(
  a: HPoint, b: HPoint, c: HPoint, depth: number,
  emit: (a: HPoint, b: HPoint, c: HPoint) => void,
): void {
  if (depth <= 0) {
    emit(a, b, c)
    return
  }
  const ab = geodesicMid(a, b)
  const bc = geodesicMid(b, c)
  const ca = geodesicMid(c, a)
  subdivide(a, ab, ca, depth - 1, emit)
  subdivide(ab, b, bc, depth - 1, emit)
  subdivide(ca, bc, c, depth - 1, emit)
  subdivide(ab, bc, ca, depth - 1, emit)
}

/** 三条边（测地线弧） */
function drawEdges(
  ctx: CanvasRenderingContext2D, t: HTriangle, toScreen: ToScreen,
): void {
  ctx.save()
  ctx.strokeStyle = 'rgba(251,191,36,1)'
  ctx.lineWidth = 2.6
  for (const [p, q] of [[t.A, t.B], [t.B, t.C], [t.C, t.A]] as Array<[HPoint, HPoint]>) {
    strokePath(ctx, geodesicPath(p, q, 80), toScreen)
  }
  ctx.restore()
}

/** 顶点与角度标注 */
function drawVertices(
  ctx: CanvasRenderingContext2D, t: HTriangle, toScreen: ToScreen,
): void {
  const angs = triangleAngles(t)
  const names = ['A', 'B', 'C']
  const pts = [t.A, t.B, t.C]
  ctx.save()
  pts.forEach((p, i) => {
    const s = toScreen(p)
    ctx.beginPath()
    ctx.arc(s.x, s.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(253,224,71,1)'
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(`${names[i]} ${(angs[i] * DEG).toFixed(1)}°`, s.x + 9, s.y - 8)
  })
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  title: string, subtitle: string, readout: string,
): void {
  ctx.save()
  if (title) {
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.font = 'bold 17px sans-serif'
    ctx.fillText(title, 18, 28)
  }
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  if (subtitle) ctx.fillText(subtitle, 18, 48)
  if (readout) {
    ctx.textAlign = 'right'
    ctx.fillText(readout, W - 18, 28)
  }
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(148,163,184,0.7)'
  ctx.fillText('边界圆在无穷远处 · 边是垂直于边界的测地线', 18, H - 16)
  ctx.restore()
}

/** 供外壳读取的诊断量 */
export function diagnostics(t: HTriangle): {
  angles: [number, number, number]
  sum: number
  defect: number
  sides: [number, number, number]
  maxR: number
} {
  return {
    angles: triangleAngles(t),
    sum: angleSum(t),
    defect: angularDefect(t),
    sides: triangleSides(t),
    maxR: Math.max(hypot2(t.A), hypot2(t.B), hypot2(t.C)),
  }
}

export { geodesicThrough }
