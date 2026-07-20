/**
 * 反函数 Canvas 绘制
 * 画原函数曲线、反函数曲线、y=x 对称轴，并高亮一对对称点。
 */
import { sampleCurve, reflectCurve, type FnDef, type Pt } from './inverseFunction'

const RANGE = 6 // 坐标系可视半径：x,y ∈ [-RANGE, RANGE]

function makeTx(W: number, H: number) {
  const sx = W / (2 * RANGE)
  const sy = H / (2 * RANGE)
  return (p: Pt) => ({ px: (p.x + RANGE) * sx, py: H - (p.y + RANGE) * sy })
}

function drawPolyline(ctx: CanvasRenderingContext2D, pts: Pt[], tx: (p: Pt) => { px: number; py: number }) {
  ctx.beginPath()
  pts.forEach((p, i) => {
    const { px, py } = tx(p)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()
}

export function drawInverseFunction(canvas: HTMLCanvasElement, def: FnDef, showInverse = true) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const tx = makeTx(W, H)
  ctx.clearRect(0, 0, W, H)

  // 网格
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let g = -RANGE; g <= RANGE; g++) {
    drawPolyline(ctx, [{ x: g, y: -RANGE }, { x: g, y: RANGE }], tx)
    drawPolyline(ctx, [{ x: -RANGE, y: g }, { x: RANGE, y: g }], tx)
  }
  // 坐标轴
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  drawPolyline(ctx, [{ x: -RANGE, y: 0 }, { x: RANGE, y: 0 }], tx)
  drawPolyline(ctx, [{ x: 0, y: -RANGE }, { x: 0, y: RANGE }], tx)

  // y=x 对称轴（虚线）
  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 5])
  drawPolyline(ctx, [{ x: -RANGE, y: -RANGE }, { x: RANGE, y: RANGE }], tx)
  ctx.setLineDash([])

  // 原函数曲线
  const src = sampleCurve(def.fn, def.domain, 160)
  ctx.strokeStyle = '#4f46e5'
  ctx.lineWidth = 2.5
  drawPolyline(ctx, src, tx)

  // 反函数曲线（原曲线关于 y=x 镜像）
  if (showInverse) {
    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 2.5
    drawPolyline(ctx, reflectCurve(src), tx)
  }

  // 高亮一对对称点
  if (src.length > 0 && showInverse) {
    const a = src[Math.floor(src.length * 0.62)]
    const b = { x: a.y, y: a.x }
    const pa = tx(a)
    const pb = tx(b)
    ctx.strokeStyle = '#f59e0b'
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(pa.px, pa.py)
    ctx.lineTo(pb.px, pb.py)
    ctx.stroke()
    ctx.setLineDash([])
    for (const [pt, color] of [[pa, '#4f46e5'], [pb, '#ec4899']] as const) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(pt.px, pt.py, 5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}
