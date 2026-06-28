/**
 * 沃罗诺伊图 Canvas 绘制（像素级最近站点着色）
 */
import { nearestSite, type Site } from './voronoi'

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/**
 * 绘制沃罗诺伊图。用降采样步长 step 控制性能（每 step 像素算一次）。
 * @param showSites 是否画出站点圆点
 */
export function drawVoronoi(
  canvas: HTMLCanvasElement,
  sites: Site[],
  step = 3,
  showSites = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || sites.length === 0) return
  const W = canvas.width
  const H = canvas.height
  const rgbCache = sites.map((s) => hexToRgb(s.color))

  const img = ctx.createImageData(W, H)
  const data = img.data
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const idx = nearestSite(sites, x, y)
      const [r, g, b] = rgbCache[idx]
      // 填充 step×step 块
      for (let dy = 0; dy < step && y + dy < H; dy++) {
        for (let dx = 0; dx < step && x + dx < W; dx++) {
          const p = ((y + dy) * W + (x + dx)) * 4
          data[p] = r
          data[p + 1] = g
          data[p + 2] = b
          data[p + 3] = 90 // 半透明，叠出柔和分区
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)

  if (showSites) {
    ctx.fillStyle = '#0f172a'
    for (const s of sites) {
      ctx.beginPath()
      ctx.arc(s.x, s.y, 3.5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}
