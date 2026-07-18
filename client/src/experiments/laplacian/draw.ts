/**
 * 拉普拉斯算子 Canvas 绘制
 * 左半：函数 f 的热力图；右半：拉普拉斯值 ∇²f 热力图
 * （正=局部低谷 冷色，负=局部高峰 暖色）
 */
import { laplacianGrid, gridRange, type Grid } from './laplacian'

/** 蓝-白-红发散色：t∈[-1,1]，负→红，0→白，正→蓝 */
function diverging(t: number): [number, number, number] {
  const c = Math.max(-1, Math.min(1, t))
  if (c >= 0) return [Math.round(255 * (1 - c)), Math.round(255 * (1 - c)), 255]
  const a = -c
  return [255, Math.round(255 * (1 - a)), Math.round(255 * (1 - a))]
}

function paintGrid(
  ctx: CanvasRenderingContext2D,
  g: Grid,
  x0: number,
  y0: number,
  w: number,
  h: number,
  symmetric: boolean,
) {
  const rows = g.length
  const cols = g[0].length
  const [lo, hi] = gridRange(g)
  const span = symmetric ? Math.max(Math.abs(lo), Math.abs(hi)) || 1 : hi - lo || 1
  const cw = w / cols
  const ch = h / rows
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const v = g[i][j]
      const t = symmetric ? v / span : (v - lo) / span * 2 - 1
      const [r, gr, b] = diverging(t)
      ctx.fillStyle = `rgb(${r},${gr},${b})`
      ctx.fillRect(x0 + j * cw, y0 + i * ch, cw + 1, ch + 1)
    }
  }
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.fillStyle = 'rgba(15,23,42,0.75)'
  ctx.fillRect(x, y, ctx.measureText(text).width + 12, 22)
  ctx.fillStyle = '#ffffff'
  ctx.fillText(text, x + 6, y + 15)
}

/**
 * 绘制 f 与 ∇²f 并列热力图。
 * @param mode 'both' 双图 | 'field' 仅 f | 'lap' 仅拉普拉斯
 */
export function drawLaplacian(canvas: HTMLCanvasElement, field: Grid, mode: 'both' | 'field' | 'lap' = 'both') {
  const ctx = canvas.getContext('2d')
  if (!ctx || field.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.font = '13px system-ui, sans-serif'
  const lap = laplacianGrid(field)

  if (mode === 'both') {
    const gap = 12
    const w = (W - gap) / 2
    paintGrid(ctx, field, 0, 0, w, H, true)
    paintGrid(ctx, lap, w + gap, 0, w, H, true)
    label(ctx, '函数 f(x,y)', 8, 8)
    label(ctx, '拉普拉斯 ∇²f', w + gap + 8, 8)
  } else if (mode === 'field') {
    paintGrid(ctx, field, 0, 0, W, H, true)
    label(ctx, '函数 f(x,y)', 8, 8)
  } else {
    paintGrid(ctx, lap, 0, 0, W, H, true)
    label(ctx, '∇²f  蓝=低谷 红=高峰', 8, 8)
  }
}
