/**
 * 部分分式分解 Canvas 绘制
 *
 * 在 x∈[-X,X] 上叠画：原有理式曲线（粗）与分解后各简单分式曲线（细/彩），
 * 直观展示"原式 = 各分式之和"。在渐近线（根处）断开曲线。
 */
import { decompose, evalRational, type FractionTerm } from './partialFractions'

const COLORS = ['#ec4899', '#22d3ee', '#a3e635', '#fbbf24', '#a78bfa']
const X_RANGE = 6
const Y_CLIP = 8

function toPx(x: number, y: number, W: number, H: number): [number, number] {
  const px = ((x + X_RANGE) / (2 * X_RANGE)) * W
  const py = H / 2 - (y / Y_CLIP) * (H / 2)
  return [px, py]
}

/** 画一条函数曲线，遇到根附近的跳变自动断笔 */
function plot(
  ctx: CanvasRenderingContext2D,
  f: (x: number) => number,
  roots: number[],
  W: number, H: number,
  color: string, width: number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  let pen = false
  for (let px = 0; px <= W; px++) {
    const x = (px / W) * 2 * X_RANGE - X_RANGE
    const nearPole = roots.some((r) => Math.abs(x - r) < 0.06)
    const y = f(x)
    if (nearPole || !Number.isFinite(y) || Math.abs(y) > Y_CLIP) {
      pen = false
      continue
    }
    const [cx, cy] = toPx(x, y, W, H)
    if (!pen) { ctx.moveTo(cx, cy); pen = true } else ctx.lineTo(cx, cy)
  }
  ctx.stroke()
}

/** 绘制坐标轴与渐近线 */
function drawAxes(ctx: CanvasRenderingContext2D, roots: number[], W: number, H: number) {
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2)
  ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H)
  ctx.stroke()
  ctx.strokeStyle = '#e2e8f0'
  ctx.setLineDash([4, 4])
  for (const r of roots) {
    const [rx] = toPx(r, 0, W, H)
    ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx, H); ctx.stroke()
  }
  ctx.setLineDash([])
}

/**
 * @param showParts 是否叠画分解后的各简单分式曲线
 */
export function drawPartialFractions(
  canvas: HTMLCanvasElement,
  numer: number[],
  roots: number[],
  showParts = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  drawAxes(ctx, roots, W, H)

  if (showParts) {
    const terms: FractionTerm[] = decompose(numer, roots)
    terms.forEach((t, i) => {
      plot(ctx, (x) => t.coeff / (x - t.root), [t.root], W, H, COLORS[i % COLORS.length], 1.6)
    })
  }
  // 原有理式最后画，粗黑压在上层
  plot(ctx, (x) => evalRational(numer, roots, x), roots, W, H, '#0f172a', 2.6)
}
