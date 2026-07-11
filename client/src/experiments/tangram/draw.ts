/**
 * 七巧板 Canvas 绘制
 */
import { TANGRAM_PIECES, polygonCentroid, type Point, type TangramPiece } from './tangram'

/** 世界坐标（0..SIZE）→ 画布像素，居中留边 */
function makeTransform(canvas: HTMLCanvasElement, size: number) {
  const W = canvas.width
  const H = canvas.height
  const pad = Math.min(W, H) * 0.1
  const scale = (Math.min(W, H) - pad * 2) / size
  const offX = (W - size * scale) / 2
  const offY = (H - size * scale) / 2
  return (p: Point) => ({ x: offX + p.x * scale, y: offY + p.y * scale })
}

function drawPiece(
  ctx: CanvasRenderingContext2D,
  piece: TangramPiece,
  tf: (p: Point) => Point,
  alpha: number,
) {
  if (piece.vertices.length < 3) return
  ctx.globalAlpha = alpha
  ctx.beginPath()
  const first = tf(piece.vertices[0])
  ctx.moveTo(first.x, first.y)
  for (let i = 1; i < piece.vertices.length; i++) {
    const p = tf(piece.vertices[i])
    ctx.lineTo(p.x, p.y)
  }
  ctx.closePath()
  ctx.fillStyle = piece.color
  ctx.fill()
  ctx.globalAlpha = Math.min(1, alpha + 0.2)
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.globalAlpha = 1
}

/**
 * 绘制七巧板。
 * @param pieces 七块（已可能经过旋转/平移）
 * @param progress 0→1 逐块揭示
 */
export function drawTangram(
  canvas: HTMLCanvasElement,
  pieces: TangramPiece[] = TANGRAM_PIECES,
  progress = 1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)
  if (pieces.length === 0) return

  const tf = makeTransform(canvas, 4)
  const total = pieces.length
  const shown = Math.max(0, Math.min(total, progress * total))

  for (let i = 0; i < total; i++) {
    // 每块用 [i, i+1) 的进度区间做淡入
    const local = Math.max(0, Math.min(1, shown - i))
    if (local <= 0) continue
    drawPiece(ctx, pieces[i], tf, local)
  }

  // 全部显示后标注面积单位数，直观呈现「面积守恒」
  if (progress >= 1) {
    ctx.fillStyle = '#f8fafc'
    ctx.font = 'bold 14px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const piece of pieces) {
      const c = tf(polygonCentroid(piece.vertices))
      ctx.fillText(String(piece.units), c.x, c.y)
    }
  }
}
