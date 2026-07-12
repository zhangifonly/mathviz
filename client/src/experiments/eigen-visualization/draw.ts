/**
 * 特征值与特征向量 Canvas 绘制
 *
 * 展示：一圈随机方向的向量在矩阵变换下如何改变方向，
 * 而特征向量始终保持在同一条直线上，仅按特征值缩放。
 */
import { applyMatrix, eigen2x2, type Matrix2, type Vec2 } from './eigenVisualization'

const BG = '#0f172a'
const GRID = 'rgba(148, 163, 184, 0.18)'
const PROBE = 'rgba(96, 165, 250, 0.55)'
const EIGEN_COLORS = ['#fbbf24', '#f472b6']

function toScreen(v: Vec2, cx: number, cy: number, scale: number): Vec2 {
  return [cx + v[0] * scale, cy - v[1] * scale]
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: Vec2,
  to: Vec2,
  color: string,
  width: number,
) {
  const [x1, y1] = from
  const [x2, y2] = to
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  if (len < 6) return
  const ux = dx / len
  const uy = dy / len
  const head = 10
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - head * ux - head * 0.5 * uy, y2 - head * uy + head * 0.5 * ux)
  ctx.lineTo(x2 - head * ux + head * 0.5 * uy, y2 - head * uy - head * 0.5 * ux)
  ctx.closePath()
  ctx.fill()
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number, cx: number, cy: number, scale: number) {
  ctx.strokeStyle = GRID
  ctx.lineWidth = 1
  for (let g = -4; g <= 4; g++) {
    ctx.beginPath()
    ctx.moveTo(cx + g * scale, 0)
    ctx.lineTo(cx + g * scale, H)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, cy + g * scale)
    ctx.lineTo(W, cy + g * scale)
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.5)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(W, cy)
  ctx.moveTo(cx, 0)
  ctx.lineTo(cx, H)
  ctx.stroke()
}

/**
 * 绘制矩阵变换下的向量场与特征向量。
 * @param progress 0→1 控制从原始向量插值到变换后向量
 */
export function drawEigenVisualization(
  canvas: HTMLCanvasElement,
  matrix: Matrix2,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const cx = W / 2
  const cy = H / 2
  const scale = Math.min(W, H) / 8

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)
  drawGrid(ctx, W, H, cx, cy, scale)

  const t = Math.max(0, Math.min(1, progress))
  const probes = 16
  for (let i = 0; i < probes; i++) {
    const ang = (i / probes) * Math.PI * 2
    const base: Vec2 = [Math.cos(ang) * 1.6, Math.sin(ang) * 1.6]
    const mapped = applyMatrix(matrix, base)
    const cur: Vec2 = [base[0] + (mapped[0] - base[0]) * t, base[1] + (mapped[1] - base[1]) * t]
    drawArrow(ctx, [cx, cy], toScreen(cur, cx, cy, scale), PROBE, 1.5)
  }

  const result = eigen2x2(matrix)
  result.pairs.forEach((pair, idx) => {
    const color = EIGEN_COLORS[idx % EIGEN_COLORS.length]
    const dir = pair.vector
    const gv: Vec2 = [dir[0] * 3.2, dir[1] * 3.2]
    drawArrow(ctx, toScreen([-gv[0], -gv[1]], cx, cy, scale), toScreen(gv, cx, cy, scale), 'rgba(251,191,36,0.25)', 1)
    const base: Vec2 = [dir[0] * 1.6, dir[1] * 1.6]
    const scaled: Vec2 = [base[0] * pair.value, base[1] * pair.value]
    const cur: Vec2 = [base[0] + (scaled[0] - base[0]) * t, base[1] + (scaled[1] - base[1]) * t]
    drawArrow(ctx, [cx, cy], toScreen(cur, cx, cy, scale), color, 3)
    ctx.fillStyle = color
    ctx.font = '14px sans-serif'
    const [lx, ly] = toScreen(cur, cx, cy, scale)
    ctx.fillText('λ=' + pair.value.toFixed(2), lx + 8, ly - 6)
  })

  if (!result.real) {
    ctx.fillStyle = '#f87171'
    ctx.font = '15px sans-serif'
    ctx.fillText('无实特征向量（复数特征值）', 16, H - 18)
  }
}
