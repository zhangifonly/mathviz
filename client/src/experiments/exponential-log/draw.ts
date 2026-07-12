/**
 * 指数与对数 Canvas 绘制
 *
 * 在同一坐标系中画出指数曲线 y = a^x、对数曲线 y = log_a(x)
 * 以及对称轴 y = x，直观展现两者互为反函数、关于 y=x 对称。
 */

import { sampleExp, sampleLog, type Point } from './exponentialLog'

export interface DrawData {
  base: number
  showExp: boolean
  showLog: boolean
  showMirror: boolean
}

// 数学坐标范围（正方形视口，保证 y=x 呈 45 度）
const RANGE = 6 // 显示 [-RANGE, RANGE]
const EXP_COLOR = '#6366f1'
const LOG_COLOR = '#ec4899'
const MIRROR_COLOR = '#94a3b8'

/** 绘制指数与对数图像。progress 0→1 控制曲线由左向右逐步揭示。 */
export function drawExponentialLog(
  canvas: HTMLCanvasElement,
  data: DrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const toPx = (x: number, y: number): Point => ({
    x: ((x + RANGE) / (2 * RANGE)) * W,
    y: H - ((y + RANGE) / (2 * RANGE)) * H,
  })

  drawGrid(ctx, W, H, toPx)

  // 对称轴 y = x
  if (data.showMirror) {
    ctx.strokeStyle = MIRROR_COLOR
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 6])
    const a = toPx(-RANGE, -RANGE)
    const b = toPx(RANGE, RANGE)
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
    ctx.setLineDash([])
  }

  const clamp = Math.max(0, Math.min(1, progress))

  if (data.showExp) {
    const pts = sampleExp(data.base, -RANGE, RANGE, 240)
    drawCurve(ctx, pts, toPx, EXP_COLOR, clamp)
  }
  if (data.showLog) {
    const pts = sampleLog(data.base, RANGE, 240)
    drawCurve(ctx, pts, toPx, LOG_COLOR, clamp)
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  toPx: (x: number, y: number) => Point,
) {
  ctx.strokeStyle = 'rgba(148,163,184,0.15)'
  ctx.lineWidth = 1
  for (let g = -RANGE; g <= RANGE; g++) {
    const v = toPx(g, 0)
    const h = toPx(0, g)
    ctx.beginPath()
    ctx.moveTo(v.x, 0)
    ctx.lineTo(v.x, H)
    ctx.moveTo(0, h.y)
    ctx.lineTo(W, h.y)
    ctx.stroke()
  }
  // 坐标轴
  ctx.strokeStyle = 'rgba(226,232,240,0.6)'
  ctx.lineWidth = 1.5
  const o = toPx(0, 0)
  ctx.beginPath()
  ctx.moveTo(0, o.y)
  ctx.lineTo(W, o.y)
  ctx.moveTo(o.x, 0)
  ctx.lineTo(o.x, H)
  ctx.stroke()
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  toPx: (x: number, y: number) => Point,
  color: string,
  progress: number,
) {
  const upto = Math.max(2, Math.floor(pts.length * progress))
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.beginPath()
  let started = false
  for (let i = 0; i < upto; i++) {
    const p = pts[i]
    if (!Number.isFinite(p.y) || Math.abs(p.y) > RANGE * 3) {
      started = false
      continue
    }
    const px = toPx(p.x, p.y)
    if (!started) {
      ctx.moveTo(px.x, px.y)
      started = true
    } else {
      ctx.lineTo(px.x, px.y)
    }
  }
  ctx.stroke()
}
