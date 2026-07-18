/**
 * 万花尺（内摆线）Canvas 绘制。
 * 采样内核纯函数得到曲线点，居中自适应缩放，用渐变色描边。
 */
import { sampleCurve, maxRadius, type SpiroParams } from './spirograph'

/**
 * 绘制内摆线花纹。
 * @param progress 0~1，控制画出的曲线比例（用于生长动画），默认 1 全画
 */
export function drawSpirograph(
  canvas: HTMLCanvasElement,
  p: SpiroParams,
  progress = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 深色底衬托彩色曲线
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const pts = sampleCurve(p, 2400)
  const scale = (Math.min(W, H) * 0.44) / (maxRadius(p) || 1)
  const cx = W / 2
  const cy = H / 2
  const last = Math.max(1, Math.floor(pts.length * Math.min(1, Math.max(0, progress))))

  ctx.lineWidth = 1.6
  ctx.lineJoin = 'round'
  for (let i = 1; i < last; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    // 沿曲线渐变着色（HSL 环）
    const hue = (i / pts.length) * 360
    ctx.strokeStyle = `hsl(${hue}, 85%, 62%)`
    ctx.beginPath()
    ctx.moveTo(cx + a.x * scale, cy + a.y * scale)
    ctx.lineTo(cx + b.x * scale, cy + b.y * scale)
    ctx.stroke()
  }

  // 画出当前笔尖位置
  if (last > 1 && last < pts.length) {
    const tip = pts[last - 1]
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(cx + tip.x * scale, cy + tip.y * scale, 3.5, 0, 2 * Math.PI)
    ctx.fill()
  }
}
