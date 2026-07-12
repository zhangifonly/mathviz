/**
 * 二元一次方程组 Canvas 绘制
 * 在直角坐标系里画出两条直线，并在唯一解时高亮交点。
 */

import type { LinearEquation, Solution } from './linearSystem'
import { yAt, isVertical } from './linearSystem'

export interface LinearSystemDrawData {
  eq1: LinearEquation
  eq2: LinearEquation
  solution: Solution
}

const RANGE = 8 // 坐标范围 [-RANGE, RANGE]

/** 世界坐标 → 屏幕坐标 */
function makeMapper(W: number, H: number) {
  const pad = 24
  const scale = Math.min(W - pad * 2, H - pad * 2) / (RANGE * 2)
  const cx = W / 2
  const cy = H / 2
  return {
    sx: (x: number) => cx + x * scale,
    sy: (y: number) => cy - y * scale,
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, m: ReturnType<typeof makeMapper>) {
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1
  for (let i = -RANGE; i <= RANGE; i++) {
    ctx.beginPath()
    ctx.moveTo(m.sx(i), m.sy(-RANGE))
    ctx.lineTo(m.sx(i), m.sy(RANGE))
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(m.sx(-RANGE), m.sy(i))
    ctx.lineTo(m.sx(RANGE), m.sy(i))
    ctx.stroke()
  }
  // 坐标轴
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(m.sx(-RANGE), m.sy(0))
  ctx.lineTo(m.sx(RANGE), m.sy(0))
  ctx.moveTo(m.sx(0), m.sy(-RANGE))
  ctx.lineTo(m.sx(0), m.sy(RANGE))
  ctx.stroke()
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  eq: LinearEquation,
  color: string,
  m: ReturnType<typeof makeMapper>,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  if (isVertical(eq)) {
    const x = eq.c / eq.a
    ctx.moveTo(m.sx(x), m.sy(-RANGE))
    ctx.lineTo(m.sx(x), m.sy(RANGE))
  } else {
    const y1 = yAt(eq, -RANGE)!
    const y2 = yAt(eq, RANGE)!
    ctx.moveTo(m.sx(-RANGE), m.sy(y1))
    ctx.lineTo(m.sx(RANGE), m.sy(y2))
  }
  ctx.stroke()
}

/**
 * 绘制方程组。
 * @param progress 0→1：先画网格，再逐渐画出两条直线，最后弹出交点
 */
export function drawLinearSystem(
  canvas: HTMLCanvasElement,
  data: LinearSystemDrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const m = makeMapper(W, H)
  drawGrid(ctx, m)

  // 直线随 progress 淡入
  ctx.globalAlpha = Math.min(1, progress * 1.5)
  drawLine(ctx, data.eq1, '#38bdf8', m)
  drawLine(ctx, data.eq2, '#f472b6', m)
  ctx.globalAlpha = 1

  // 唯一解时高亮交点（progress 后半段弹出）
  const { solution } = data
  if (solution.type === 'unique' && solution.x !== undefined && solution.y !== undefined && progress > 0.6) {
    const t = (progress - 0.6) / 0.4
    const r = 4 + 4 * Math.min(1, t)
    const px = m.sx(solution.x)
    const py = m.sy(solution.y)
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(px, py, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fde68a'
    ctx.font = '14px sans-serif'
    ctx.fillText(`(${solution.x.toFixed(1)}, ${solution.y.toFixed(1)})`, px + 10, py - 10)
  }

  if (solution.type !== 'unique' && progress > 0.9) {
    ctx.fillStyle = '#94a3b8'
    ctx.font = '16px sans-serif'
    ctx.fillText(solution.type === 'none' ? '两线平行：无解' : '两线重合：无穷多解', 16, 28)
  }
}
