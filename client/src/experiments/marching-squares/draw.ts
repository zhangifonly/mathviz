/**
 * 行进方块 Canvas 绘制：标量场热力图 + 提取的等高线
 */
import { makeField, marchingSquares, type Field } from './marchingSquares'

/** 值(0-1.3)映射到蓝-青-黄-红热力色 */
function heat(v: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, v / 1.3))
  const stops: [number, [number, number, number]][] = [
    [0, [30, 58, 138]],
    [0.4, [34, 211, 238]],
    [0.7, [251, 191, 36]],
    [1, [239, 68, 68]],
  ]
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1]
      const [t1, c1] = stops[i]
      const f = (t - t0) / (t1 - t0)
      return [0, 1, 2].map((k) => Math.round(c0[k] + f * (c1[k] - c0[k]))) as [number, number, number]
    }
  }
  return stops[stops.length - 1][1]
}

/**
 * 绘制标量场热力图与等高线。
 * @param cols/rows 网格分辨率
 * @param thresholds 要提取的等高线阈值数组
 */
export function drawMarchingSquares(
  canvas: HTMLCanvasElement,
  cols = 48,
  rows = 40,
  thresholds: number[] = [0.45],
  fieldIn?: Field,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const field = fieldIn ?? makeField(cols, rows)
  const ac = field[0].length
  const ar = field.length

  // 热力图
  const img = ctx.createImageData(W, H)
  const data = img.data
  for (let y = 0; y < H; y++) {
    const gy = (y / (H - 1)) * (ar - 1)
    const r0 = Math.min(ar - 1, Math.floor(gy))
    for (let x = 0; x < W; x++) {
      const gx = (x / (W - 1)) * (ac - 1)
      const c0 = Math.min(ac - 1, Math.floor(gx))
      const [r, g, b] = heat(field[r0][c0])
      const p = (y * W + x) * 4
      data[p] = r
      data[p + 1] = g
      data[p + 2] = b
      data[p + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)

  // 等高线
  const sx = W / (ac - 1)
  const sy = H / (ar - 1)
  const colors = ['#ffffff', '#e0f2fe', '#fde68a', '#fecaca']
  thresholds.forEach((t, i) => {
    ctx.strokeStyle = colors[i % colors.length]
    ctx.lineWidth = 2
    ctx.beginPath()
    for (const s of marchingSquares(field, t)) {
      ctx.moveTo(s.x1 * sx, s.y1 * sy)
      ctx.lineTo(s.x2 * sx, s.y2 * sy)
    }
    ctx.stroke()
  })
}
