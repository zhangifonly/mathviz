/**
 * 散度与旋度 Canvas 绘制
 * 画出向量场箭头，并在标注点显示散度（源红/汇蓝）与旋度（逆/顺时针）。
 */
import { sampleField, divergence, curl, type FieldDef } from './divergenceCurl'

/** 数据坐标 [-1,1] → 画布像素 */
function toPx(x: number, y: number, W: number, H: number, pad: number): [number, number] {
  const px = pad + ((x + 1) / 2) * (W - 2 * pad)
  const py = pad + ((1 - y) / 2) * (H - 2 * pad) // y 轴向上
  return [px, py]
}

function drawArrow(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
  const ang = Math.atan2(y1 - y0, x1 - x0)
  const head = 5
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - head * Math.cos(ang - 0.4), y1 - head * Math.sin(ang - 0.4))
  ctx.lineTo(x1 - head * Math.cos(ang + 0.4), y1 - head * Math.sin(ang + 0.4))
  ctx.closePath()
  ctx.fill()
}

/**
 * 绘制向量场。
 * @param mark 是否在场中一点标注散度/旋度（默认中心偏移点）
 */
export function drawDivergenceCurl(
  canvas: HTMLCanvasElement,
  field: FieldDef,
  grid = 11,
  mark = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const pad = 28
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const arrows = sampleField(field.fn, grid)
  let maxMag = 1e-6
  for (const a of arrows) maxMag = Math.max(maxMag, a.mag)
  const cell = (W - 2 * pad) / grid
  const scale = (cell * 0.42) / maxMag

  for (const a of arrows) {
    const [px, py] = toPx(a.x, a.y, W, H, pad)
    const t = a.mag / maxMag
    const r = Math.round(60 + 160 * t)
    ctx.strokeStyle = `rgb(${r},90,${Math.round(200 - 120 * t)})`
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = 1.6
    drawArrow(ctx, px, py, px + a.u * scale, py - a.v * scale)
  }

  if (mark) {
    const mx = 0.45
    const my = 0.35
    const div = divergence(field.fn, mx, my)
    const cur = curl(field.fn, mx, my)
    const [px, py] = toPx(mx, my, W, H, pad)
    ctx.fillStyle = div >= 0 ? '#ef4444' : '#3b82f6'
    ctx.beginPath()
    ctx.arc(px, py, 7, 0, 2 * Math.PI)
    ctx.fill()
    ctx.font = '13px sans-serif'
    ctx.fillStyle = '#0f172a'
    const spin = cur > 0 ? '逆时针↺' : cur < 0 ? '顺时针↻' : '无旋'
    const kind = div > 0 ? '源' : div < 0 ? '汇' : '无源汇'
    ctx.fillText(`散度=${div.toFixed(2)} (${kind})`, 12, H - 26)
    ctx.fillText(`旋度=${cur.toFixed(2)} (${spin})`, 12, H - 10)
  }
}
