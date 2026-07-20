/**
 * 燃烧船分形 Canvas 绘制（按逃逸时间染色）
 */
import { escapeTime, normEscape, type ViewRegion } from './burningShip'

/** 逃逸时间 -> 火焰色（HSL 由深蓝到橙黄红），t 在 [0,1] */
function fireColor(t: number, inSet: boolean): [number, number, number] {
  if (inSet) return [8, 8, 20] // 集合内部近黑
  // 火焰渐变：低迭代深红，高迭代亮黄，收尾泛白
  const r = Math.min(255, Math.floor(40 + 900 * t))
  const g = Math.min(255, Math.floor(-60 + 700 * t))
  const b = Math.min(255, Math.floor(20 + 260 * t * t))
  return [r, g, b]
}

/**
 * 绘制燃烧船分形。以 region 定位复平面窗口，逐像素按逃逸时间染色。
 * @param step 降采样步长（每 step 像素算一次），控制性能。
 */
export function drawBurningShip(
  canvas: HTMLCanvasElement,
  region: ViewRegion,
  maxIter: number,
  step = 2,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const spanX = region.scale
  const spanY = (region.scale * H) / W
  const x0 = region.cx - spanX / 2
  const y0 = region.cy - spanY / 2

  const img = ctx.createImageData(W, H)
  const data = img.data
  for (let py = 0; py < H; py += step) {
    // 屏幕 y 向下，映射到复平面虚轴（向上为正）
    const cy = y0 + (spanY * (H - py)) / H
    for (let px = 0; px < W; px += step) {
      const cx = x0 + (spanX * px) / W
      const iter = escapeTime(cx, cy, maxIter)
      const inSet = iter >= maxIter
      const [r, g, b] = fireColor(normEscape(iter, maxIter), inSet)
      for (let dy = 0; dy < step && py + dy < H; dy++) {
        for (let dx = 0; dx < step && px + dx < W; dx++) {
          const p = ((py + dy) * W + (px + dx)) * 4
          data[p] = r
          data[p + 1] = g
          data[p + 2] = b
          data[p + 3] = 255
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)
}
