/**
 * 容斥原理 Canvas 绘制：三集合韦恩图 + 各区域数量标注
 */
import { vennRegions, type Sample } from './inclusionExclusion'

const COLORS = ['#6366f1', '#ec4899', '#22d3ee'] // A B C

/** 三个圆心（等边三角形排布），半径由画布决定 */
function circleLayout(W: number, H: number) {
  const cx = W / 2
  const cy = H / 2
  const R = Math.min(W, H) * 0.22
  const off = R * 0.62
  return {
    r: R,
    centers: [
      { x: cx, y: cy - off }, // A 上
      { x: cx - off, y: cy + off * 0.7 }, // B 左下
      { x: cx + off, y: cy + off * 0.7 }, // C 右下
    ],
  }
}

function label(ctx: CanvasRenderingContext2D, x: number, y: number, n: number) {
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(n), x, y)
}

/**
 * 绘制三集合韦恩图，标出 7 个区域的元素个数。
 */
export function drawInclusionExclusion(canvas: HTMLCanvasElement, sample: Sample) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const sets = sample.divisors.map((d) => {
    const arr: number[] = []
    for (let k = d; k <= sample.n; k += d) arr.push(k)
    return arr
  })
  const [a, b, c, ab, ac, bc, abc] = vennRegions(sets)
  const { r, centers } = circleLayout(W, H)

  // 半透明填充三个圆，叠加显示交集
  ctx.globalCompositeOperation = 'source-over'
  centers.forEach((ctr, i) => {
    ctx.beginPath()
    ctx.arc(ctr.x, ctr.y, r, 0, 2 * Math.PI)
    ctx.fillStyle = COLORS[i] + '55'
    ctx.fill()
    ctx.strokeStyle = COLORS[i]
    ctx.lineWidth = 2
    ctx.stroke()
  })

  // 集合标题
  ctx.font = 'bold 15px sans-serif'
  ctx.fillStyle = COLORS[0]
  ctx.fillText(sample.labels[0], centers[0].x, centers[0].y - r - 14)
  ctx.fillStyle = COLORS[1]
  ctx.fillText(sample.labels[1], centers[1].x - r * 0.5, centers[1].y + r + 16)
  ctx.fillStyle = COLORS[2]
  ctx.fillText(sample.labels[2], centers[2].x + r * 0.5, centers[2].y + r + 16)

  // 各区域数量（位置按几何估算）
  const [A, B, C] = centers
  const mid = { x: W / 2, y: (A.y + B.y + C.y) / 3 }
  label(ctx, A.x, A.y - r * 0.45, a)
  label(ctx, B.x - r * 0.4, B.y + r * 0.35, b)
  label(ctx, C.x + r * 0.4, C.y + r * 0.35, c)
  label(ctx, (A.x + B.x) / 2 - r * 0.15, (A.y + B.y) / 2 + r * 0.1, ab)
  label(ctx, (A.x + C.x) / 2 + r * 0.15, (A.y + C.y) / 2 + r * 0.1, ac)
  label(ctx, mid.x, B.y + r * 0.42, bc)
  label(ctx, mid.x, mid.y - r * 0.1, abc)
}
