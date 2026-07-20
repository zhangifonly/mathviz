/**
 * 反演几何 Canvas 绘制：反演圆 + 原图形 + 反演像。
 * 世界坐标以反演中心 O=(0,0) 为原点，映射到画布中心。
 */
import { invertShape, type Shape, type Point } from './inversiveGeometry'

/** 世界坐标 -> 屏幕坐标（O 居中，y 向下不翻转） */
function toScreen(p: Point, w: number, h: number): Point {
  return { x: w / 2 + p.x, y: h / 2 + p.y }
}

function strokeShape(ctx: CanvasRenderingContext2D, s: Shape, w: number, h: number) {
  ctx.beginPath()
  if (s.kind === 'circle') {
    const c = toScreen({ x: s.cx, y: s.cy }, w, h)
    ctx.arc(c.x, c.y, Math.min(s.r, 4000), 0, 2 * Math.PI)
  } else {
    // 直线 nx*x+ny*y=c：取直线上一点，沿方向延伸
    const len = Math.hypot(s.nx, s.ny) || 1
    const bx = (s.nx * s.c) / (len * len)
    const by = (s.ny * s.c) / (len * len)
    const dx = -s.ny / len
    const dy = s.nx / len
    const a = toScreen({ x: bx - dx * 2000, y: by - dy * 2000 }, w, h)
    const b = toScreen({ x: bx + dx * 2000, y: by + dy * 2000 }, w, h)
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
  }
  ctx.stroke()
}

/**
 * 绘制反演演示。
 * @param shapes 原图形数组
 * @param radius 反演圆半径 R
 * @param showImage 是否绘制反演像
 */
export function drawInversiveGeometry(
  canvas: HTMLCanvasElement,
  shapes: Shape[],
  radius: number,
  showImage = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2)
  ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H)
  ctx.stroke()

  // 反演圆
  const o = toScreen({ x: 0, y: 0 }, W, H)
  ctx.strokeStyle = '#94a3b8'
  ctx.setLineDash([6, 4])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(o.x, o.y, radius, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.setLineDash([])

  const O = { x: 0, y: 0 }
  for (const s of shapes) {
    // 原图形（实线）
    ctx.strokeStyle = s.color || '#6366f1'
    ctx.lineWidth = 2.5
    strokeShape(ctx, s, W, H)
    // 反演像（虚线，同色淡显）
    if (showImage) {
      const img = invertShape(s, O, radius)
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.75
      strokeShape(ctx, img, W, H)
      ctx.globalAlpha = 1
      ctx.setLineDash([])
    }
  }

  // 反演中心 O
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(o.x, o.y, 4, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = '#0f172a'
  ctx.font = '13px sans-serif'
  ctx.fillText('O', o.x + 7, o.y - 7)
  ctx.fillStyle = '#64748b'
  ctx.fillText('R = ' + radius, o.x + 8, o.y + radius + 16)
}
