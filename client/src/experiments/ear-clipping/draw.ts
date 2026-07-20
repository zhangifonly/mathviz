/**
 * 耳切三角剖分 Canvas 绘制
 * 按帧 shownSteps 展示逐个切下的三角形（不同色）+ 原多边形轮廓。
 */
import { earClipping, type Pt } from './earClipping'

const TRI_COLORS = [
  '#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24',
  '#f87171', '#34d399', '#a78bfa', '#fb923c', '#38bdf8',
]

/**
 * @param polygon 多边形顶点
 * @param shownSteps 已展示的切耳步数（0 = 只显示原多边形）
 * @param scale 坐标缩放（把内核坐标映射到画布）
 */
export function drawEarClipping(
  canvas: HTMLCanvasElement,
  polygon: Pt[],
  shownSteps: number,
  scale = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || polygon.length < 3) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const sx = (p: Pt) => p.x * scale
  const sy = (p: Pt) => p.y * scale

  const { triangles } = earClipping(polygon)
  const shown = Math.max(0, Math.min(shownSteps, triangles.length))

  // 已切下的三角形填充
  for (let i = 0; i < shown; i++) {
    const t = triangles[i]
    ctx.beginPath()
    ctx.moveTo(sx(t.a), sy(t.a))
    ctx.lineTo(sx(t.b), sy(t.b))
    ctx.lineTo(sx(t.c), sy(t.c))
    ctx.closePath()
    ctx.fillStyle = TRI_COLORS[i % TRI_COLORS.length] + 'cc'
    ctx.fill()
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 1.5
    ctx.stroke()
    // 序号标注三角形重心
    const cx = (sx(t.a) + sx(t.b) + sx(t.c)) / 3
    const cy = (sy(t.a) + sy(t.b) + sy(t.c)) / 3
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(i + 1), cx, cy)
  }

  // 原多边形轮廓
  ctx.beginPath()
  ctx.moveTo(sx(polygon[0]), sy(polygon[0]))
  for (let i = 1; i < polygon.length; i++) ctx.lineTo(sx(polygon[i]), sy(polygon[i]))
  ctx.closePath()
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // 顶点
  ctx.fillStyle = '#0f172a'
  for (const p of polygon) {
    ctx.beginPath()
    ctx.arc(sx(p), sy(p), 4, 0, 2 * Math.PI)
    ctx.fill()
  }
}
