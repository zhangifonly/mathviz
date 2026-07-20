/**
 * 牛顿分形 Canvas 绘制
 * 复平面每像素做牛顿迭代，按收敛的根染色，亮度表示收敛速度。
 */
import { newtonEscape, ROOTS } from './newtonFractal'

// 每个根一种基色 (r,g,b)
const ROOT_RGB: [number, number, number][] = [
  [239, 68, 68],
  [59, 130, 246],
  [34, 197, 94],
  [234, 179, 8],
]

/**
 * 绘制牛顿分形。
 * @param poly 多项式
 * @param cx,cy 视图中心（复平面坐标）
 * @param scale 半宽（复平面范围为 cx±scale）
 * @param maxIter 最大迭代次数
 */
export function drawNewtonFractal(
  canvas: HTMLCanvasElement,
  poly: string,
  cx = 0,
  cy = 0,
  scale = 1.6,
  maxIter = 40,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const roots = ROOTS[poly] ?? ROOTS['z^3-1']
  const aspect = H / W
  const img = ctx.createImageData(W, H)
  const data = img.data
  for (let py = 0; py < H; py++) {
    const zy = cy + (py / H - 0.5) * 2 * scale * aspect
    for (let px = 0; px < W; px++) {
      const zx = cx + (px / W - 0.5) * 2 * scale
      const { root, iter } = newtonEscape(poly, zx, zy, maxIter)
      const p = (py * W + px) * 4
      if (root < 0) {
        data[p] = data[p + 1] = data[p + 2] = 10
      } else {
        const base = ROOT_RGB[root % ROOT_RGB.length]
        // 收敛越快越亮，越慢（靠近分形边界）越暗
        const b = Math.max(0.2, 1 - iter / maxIter)
        data[p] = Math.round(base[0] * b)
        data[p + 1] = Math.round(base[1] * b)
        data[p + 2] = Math.round(base[2] * b)
      }
      data[p + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)

  // 标记根的位置
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#0f172a'
  for (const rt of roots) {
    const sx = ((rt.re - cx) / (2 * scale) + 0.5) * W
    const sy = ((rt.im - cy) / (2 * scale * aspect) + 0.5) * H
    ctx.beginPath()
    ctx.arc(sx, sy, 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }
}
