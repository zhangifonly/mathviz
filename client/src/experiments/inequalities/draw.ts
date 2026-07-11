/**
 * 不等式与数轴 Canvas 绘制
 *
 * 在数轴上画出解集：边界点（实心=含等号，空心=不含），
 * 以及朝左/朝右的射线阴影，progress 控制射线延伸动画。
 */

import type { Solution } from './inequalities'
import { boundInclusive, pointsRight } from './inequalities'

const AXIS_COLOR = '#94a3b8'
const RAY_COLOR = '#6366f1'
const POINT_COLOR = '#ec4899'
const TICK_MIN = -10
const TICK_MAX = 10

/**
 * 绘制数轴与解集。
 * @param sol 解集（solveLinear 的结果）
 * @param progress 0→1，射线从边界点向外延伸的动画进度
 */
export function drawInequalities(
  canvas: HTMLCanvasElement,
  sol: Solution,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const pad = 40
  const y = H / 2
  const x0 = pad
  const x1 = W - pad
  const span = TICK_MAX - TICK_MIN
  const toX = (v: number) => x0 + ((v - TICK_MIN) / span) * (x1 - x0)

  // 全体实数：整条轴高亮
  const p = Math.max(0, Math.min(1, progress))

  if (sol.all) {
    ctx.fillStyle = 'rgba(99,102,241,0.25)'
    ctx.fillRect(x0, y - 14, (x1 - x0) * p, 28)
  } else if (!sol.empty) {
    const bx = toX(clamp(sol.bound, TICK_MIN, TICK_MAX))
    const right = pointsRight(sol.op)
    const end = right ? x1 : x0
    const cur = bx + (end - bx) * p
    ctx.fillStyle = 'rgba(99,102,241,0.25)'
    const rx = Math.min(bx, cur)
    ctx.fillRect(rx, y - 14, Math.abs(cur - bx), 28)
  }

  // 数轴主线
  ctx.strokeStyle = AXIS_COLOR
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x0, y)
  ctx.lineTo(x1, y)
  ctx.stroke()
  drawArrow(ctx, x1, y, 1)
  drawArrow(ctx, x0, y, -1)

  // 刻度与数字
  ctx.fillStyle = AXIS_COLOR
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  for (let v = TICK_MIN; v <= TICK_MAX; v++) {
    const tx = toX(v)
    ctx.beginPath()
    ctx.moveTo(tx, y - 5)
    ctx.lineTo(tx, y + 5)
    ctx.strokeStyle = AXIS_COLOR
    ctx.stroke()
    if (v % 2 === 0) ctx.fillText(String(v), tx, y + 22)
  }

  // 解集射线（在阴影之上再画一条实心射线线段）
  if (!sol.all && !sol.empty) {
    const bx = toX(clamp(sol.bound, TICK_MIN, TICK_MAX))
    const right = pointsRight(sol.op)
    const end = right ? x1 : x0
    const cur = bx + (end - bx) * p
    ctx.strokeStyle = RAY_COLOR
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(bx, y)
    ctx.lineTo(cur, y)
    ctx.stroke()
    drawArrow(ctx, cur, y, right ? 1 : -1, RAY_COLOR)

    // 边界点：实心/空心
    drawBound(ctx, bx, y, boundInclusive(sol.op))
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: 1 | -1,
  color = AXIS_COLOR,
) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - dir * 10, y - 5)
  ctx.lineTo(x - dir * 10, y + 5)
  ctx.closePath()
  ctx.fill()
}

function drawBound(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  filled: boolean,
) {
  ctx.beginPath()
  ctx.arc(x, y, 7, 0, Math.PI * 2)
  if (filled) {
    ctx.fillStyle = POINT_COLOR
    ctx.fill()
  } else {
    ctx.fillStyle = '#0f172a'
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = POINT_COLOR
    ctx.stroke()
  }
}
