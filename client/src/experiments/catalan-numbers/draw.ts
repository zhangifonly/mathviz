/** 卡特兰数 Canvas 绘制：paren 括号序列 / poly 三角剖分 / tree 二叉树 */
import { validParentheses, catalan } from './catalanNumbers'

export type CatalanMode = 'paren' | 'poly' | 'tree'

function clear(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)
}

function drawParen(ctx: CanvasRenderingContext2D, n: number, W: number) {
  const seqs = validParentheses(n)
  ctx.font = 'bold 20px monospace'
  ctx.textBaseline = 'middle'
  const cols = Math.ceil(Math.sqrt(seqs.length))
  const cellW = W / cols
  const cellH = 46
  seqs.forEach((s, i) => {
    const cx = (i % cols) * cellW + 14
    const cy = 40 + Math.floor(i / cols) * cellH
    ctx.fillStyle = '#e0e7ff'
    ctx.fillRect(cx - 6, cy - 18, cellW - 16, 36)
    ctx.fillStyle = '#4338ca'
    ctx.fillText(s, cx, cy)
  })
}

/** 画凸 m 边形并给出其中一种三角剖分（从顶点0扇形连接） */
function drawPoly(ctx: CanvasRenderingContext2D, m: number, W: number, H: number) {
  const cx = W / 2
  const cy = H / 2 + 12
  const R = Math.min(W, H) * 0.36
  const pts: [number, number][] = []
  for (let i = 0; i < m; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / m
    pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
  }
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  ctx.closePath()
  ctx.stroke()
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 1.5
  for (let i = 2; i < m - 1; i++) {
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    ctx.lineTo(pts[i][0], pts[i][1])
    ctx.stroke()
  }
  ctx.fillStyle = '#4338ca'
  pts.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })
}

/** 递归画一棵满二叉展开的示意树（左偏其中一种形态） */
function drawTree(ctx: CanvasRenderingContext2D, n: number, W: number) {
  const draw = (x: number, y: number, span: number, depth: number) => {
    ctx.fillStyle = '#4338ca'
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.fill()
    if (depth <= 0) return
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1.5
    for (const dir of [-1, 1]) {
      const nx = x + dir * span
      const ny = y + 60
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nx, ny)
      ctx.stroke()
      draw(nx, ny, span / 2, depth - 1)
    }
  }
  draw(W / 2, 60, W / 4.5, n)
}

export function drawCatalanNumbers(
  canvas: HTMLCanvasElement,
  n: number,
  mode: CatalanMode = 'poly',
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  clear(ctx, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 22px sans-serif'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(`C(${n}) = ${catalan(n)}`, 16, 26)
  if (mode === 'paren') drawParen(ctx, n, W)
  else if (mode === 'poly') drawPoly(ctx, n + 2, W, H)
  else drawTree(ctx, n, W)
}
