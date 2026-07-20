/**
 * 二次型等高线 Canvas 绘制
 *
 * 把画布坐标映射到 [-R, R] x [-R, R] 的数学平面，逐像素算 Q(x,y)，
 * 按 |Q| 的对数做填色（暖色=正、冷色=负），再叠等高线描边，直观区分类型。
 */
import { evalQuadratic, classify, classInfo, type QuadraticForm } from './quadraticForm'

const R = 4

function shade(q: number, scale: number): [number, number, number] {
  // q>0 偏蓝紫(正)，q<0 偏粉红(负)，接近 0 偏白
  const t = Math.max(-1, Math.min(1, q / scale))
  if (t >= 0) {
    return [Math.round(255 - t * 155), Math.round(255 - t * 100), 255]
  }
  const a = -t
  return [255, Math.round(255 - a * 130), Math.round(255 - a * 130)]
}

export function drawQuadraticForm(canvas: HTMLCanvasElement, form: QuadraticForm, step = 2) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const scale = (Math.abs(form.a) + Math.abs(form.b) + Math.abs(form.c) + 0.5) * R * R
  const img = ctx.createImageData(W, H)
  const data = img.data
  const levels = 7

  for (let py = 0; py < H; py += step) {
    for (let px = 0; px < W; px += step) {
      const x = (px / W) * 2 * R - R
      const y = R - (py / H) * 2 * R
      const q = evalQuadratic(form, x, y)
      const [r, g, b] = shade(q, scale)
      // 等高线：|Q| 落在整数环带边缘时压暗，勾出轮廓
      const band = (Math.abs(q) / scale) * levels
      const edge = Math.abs(band - Math.round(band)) < 0.06 ? 60 : 0
      for (let dy = 0; dy < step && py + dy < H; dy++) {
        for (let dx = 0; dx < step && px + dx < W; dx++) {
          const p = ((py + dy) * W + (px + dx)) * 4
          data[p] = Math.max(0, r - edge)
          data[p + 1] = Math.max(0, g - edge)
          data[p + 2] = Math.max(0, b - edge)
          data[p + 3] = 255
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)

  // 坐标轴
  ctx.strokeStyle = 'rgba(15,23,42,0.35)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2, 0)
  ctx.lineTo(W / 2, H)
  ctx.moveTo(0, H / 2)
  ctx.lineTo(W, H / 2)
  ctx.stroke()

  // 类型标注
  const info = classInfo(classify(form))
  ctx.fillStyle = 'rgba(15,23,42,0.9)'
  ctx.fillRect(10, 10, 12, 12)
  ctx.fillStyle = info.color
  ctx.fillRect(11, 11, 10, 10)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 16px system-ui, sans-serif'
  ctx.fillText(info.label, 30, 22)
}
