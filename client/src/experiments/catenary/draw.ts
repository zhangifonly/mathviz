/**
 * 悬链线 Canvas 绘制。
 * 以画布中心为坐标原点，向下垂挂画悬链线，可选叠加对比抛物线，
 * 也可倒置成拱形（invert=true）展示最优受力拱。
 */
import { catenaryY, matchingParabola } from './catenary'

export function drawCatenary(
  canvas: HTMLCanvasElement,
  a: number,
  showParabola = true,
  invert = false,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const cx = W / 2
  const halfSpan = W * 0.4
  const sign = invert ? -1 : 1
  // 竖直基准线：下垂时贴上方，倒拱时贴下方
  const baseY = invert ? H * 0.82 : H * 0.28
  const toY = (x: number, fn: (x: number, a: number) => number) =>
    baseY + sign * (fn(x, a) - a)

  // 顶点/端点辅助线
  ctx.strokeStyle = '#cbd5e1'
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()
  ctx.setLineDash([])

  // 对比抛物线（虚线橙色）
  if (showParabola) {
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 5])
    ctx.beginPath()
    for (let px = -halfSpan; px <= halfSpan; px += 2) {
      const y = toY(px, matchingParabola)
      if (px === -halfSpan) ctx.moveTo(cx + px, y)
      else ctx.lineTo(cx + px, y)
    }
    ctx.stroke()
    ctx.setLineDash([])
  }

  // 悬链线（实线靛蓝）
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 3
  ctx.beginPath()
  for (let px = -halfSpan; px <= halfSpan; px += 2) {
    const y = toY(px, catenaryY)
    if (px === -halfSpan) ctx.moveTo(cx + px, y)
    else ctx.lineTo(cx + px, y)
  }
  ctx.stroke()

  // 两端固定点
  ctx.fillStyle = '#0f172a'
  for (const px of [-halfSpan, halfSpan]) {
    ctx.beginPath()
    ctx.arc(cx + px, toY(px, catenaryY), 5, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 顶点标注
  ctx.fillStyle = '#6366f1'
  ctx.beginPath()
  ctx.arc(cx, toY(0, catenaryY), 4, 0, 2 * Math.PI)
  ctx.fill()

  // 图例
  ctx.font = '13px sans-serif'
  ctx.fillStyle = '#6366f1'
  ctx.fillText(invert ? '悬链拱 y=a·cosh(x/a)' : '悬链线 y=a·cosh(x/a)', 12, 20)
  if (showParabola) {
    ctx.fillStyle = '#f97316'
    ctx.fillText('对比抛物线（虚线）', 12, 38)
  }
}
