/**
 * 韦达定理 Canvas 绘制：画多项式曲线、标注根、标出坐标轴。
 */
import { rootsToCoeffs, evalPoly } from './vietaFormulas'

/** 绘制由给定根生成的多项式曲线，并在 x 轴上标注根 */
export function drawVietaFormulas(
  canvas: HTMLCanvasElement,
  roots: number[],
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const coeffs = rootsToCoeffs(roots)
  // 坐标范围：x 覆盖根并留边距，y 自适应
  const rMin = Math.min(...roots)
  const rMax = Math.max(...roots)
  const pad = Math.max(1.5, (rMax - rMin) * 0.4)
  const xMin = rMin - pad
  const xMax = rMax + pad
  const N = 240
  let yMin = Infinity
  let yMax = -Infinity
  const pts: [number, number][] = []
  for (let i = 0; i <= N; i++) {
    const x = xMin + ((xMax - xMin) * i) / N
    const y = evalPoly(coeffs, x)
    pts.push([x, y])
    if (y < yMin) yMin = y
    if (y > yMax) yMax = y
  }
  const yPad = (yMax - yMin) * 0.15 || 1
  yMin -= yPad
  yMax += yPad

  const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * W
  const sy = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  const y0 = sy(0)
  ctx.moveTo(0, y0)
  ctx.lineTo(W, y0)
  const x0 = sx(0)
  ctx.moveTo(x0, 0)
  ctx.lineTo(x0, H)
  ctx.stroke()

  // 曲线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  pts.forEach(([x, y], i) => {
    const px = sx(x)
    const py = sy(y)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.stroke()

  // 标注根
  ctx.fillStyle = '#ec4899'
  ctx.font = '13px sans-serif'
  for (const r of roots) {
    const px = sx(r)
    const py = sy(0)
    ctx.beginPath()
    ctx.arc(px, py, 5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = '#be185d'
    ctx.fillText(`x=${r}`, px + 6, py - 8)
    ctx.fillStyle = '#ec4899'
  }
}
