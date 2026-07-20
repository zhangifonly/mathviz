/**
 * 等宽曲线 Canvas 绘制：静态勒洛多边形 + 两平行线间滚动动画
 */
import { reuleauxArcs, reuleauxVertices, type Arc } from './reuleaux'

function pathArcs(ctx: CanvasRenderingContext2D, arcs: Arc[]) {
  ctx.beginPath()
  arcs.forEach((a, i) => {
    if (i === 0) {
      const sx = a.cx + a.r * Math.cos(a.start)
      const sy = a.cy + a.r * Math.sin(a.start)
      ctx.moveTo(sx, sy)
    }
    ctx.arc(a.cx, a.cy, a.r, a.start, a.end, a.ccw)
  })
  ctx.closePath()
}

/** 绘制居中的勒洛多边形，可选画出底层顶点与半径连线 */
export function drawReuleaux(
  canvas: HTMLCanvasElement,
  n: number,
  width: number,
  showFrame = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const cx = W / 2
  const cy = H / 2
  const arcs = reuleauxArcs(n, cx, cy, width)

  pathArcs(ctx, arcs)
  ctx.fillStyle = 'rgba(99,102,241,0.18)'
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = '#4f46e5'
  ctx.stroke()

  if (showFrame) {
    const v = reuleauxVertices(n, cx, cy, width)
    ctx.strokeStyle = 'rgba(148,163,184,0.7)'
    ctx.lineWidth = 1
    ctx.beginPath()
    v.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
    ctx.closePath()
    ctx.stroke()
    ctx.fillStyle = '#ec4899'
    for (const p of v) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}

/**
 * 滚动演示：在两条水平平行线（间距=width）之间滚动。
 * phase ∈ [0,1) 控制水平推进；曲线随滚动自转，形心上下颠簸但顶端恒贴上线。
 */
export function drawRolling(
  canvas: HTMLCanvasElement,
  n: number,
  width: number,
  phase: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const top = H / 2 - width / 2
  const bot = H / 2 + width / 2
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 2
  for (const y of [top, bot]) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  // 中心 x 平移，滚动角随之旋转
  const cx = 60 + phase * (W - 120)
  const cy = H / 2
  const angle = phase * 2 * Math.PI
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(angle)
  const arcs = reuleauxArcs(n, 0, 0, width)
  pathArcs(ctx, arcs)
  ctx.fillStyle = 'rgba(236,72,153,0.2)'
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = '#db2777'
  ctx.stroke()
  ctx.restore()

  // 标注形心轨迹点（说明中心会颠簸）
  ctx.fillStyle = '#4f46e5'
  ctx.beginPath()
  ctx.arc(cx, cy, 3, 0, 2 * Math.PI)
  ctx.fill()
}
