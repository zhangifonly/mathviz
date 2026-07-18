/**
 * 贝塞尔函数 Canvas 绘制：J_0,J_1,J_2 衰减振荡曲线 + 零点标记
 */
import { sampleBessel, besselZeros } from './besselFunctions'

const COLORS = ['#6366f1', '#ec4899', '#22d3ee', '#fbbf24']

/**
 * 绘制若干阶的第一类贝塞尔函数曲线。
 * @param orders 要画的阶数数组，如 [0,1,2]
 * @param xMax x 轴范围
 * @param showZeros 是否标出零点
 */
export function drawBesselFunctions(
  canvas: HTMLCanvasElement,
  orders: number[],
  xMax = 20,
  showZeros = true,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const padL = 44
  const padB = 34
  const padT = 16
  const yMin = -0.5
  const yMax = 1.05
  const sx = (x: number) => padL + (x / xMax) * (W - padL - 12)
  const sy = (y: number) => padT + (1 - (y - yMin) / (yMax - yMin)) * (H - padT - padB)

  // 网格与坐标轴
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let gx = 0; gx <= xMax; gx += 5) {
    ctx.beginPath(); ctx.moveTo(sx(gx), padT); ctx.lineTo(sx(gx), H - padB); ctx.stroke()
  }
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(padL, sy(0)); ctx.lineTo(W - 12, sy(0)); ctx.stroke() // y=0 轴
  ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.stroke() // y 轴

  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('0', padL - 10, sy(0) - 4)
  ctx.fillText('1', padL - 16, sy(1) + 4)
  ctx.fillText('x', W - 20, sy(0) + 20)

  // 曲线
  orders.forEach((n, i) => {
    const color = COLORS[n % COLORS.length]
    const pts = sampleBessel(n, xMax, 500)
    ctx.strokeStyle = color
    ctx.lineWidth = 2.4
    ctx.beginPath()
    pts.forEach((p, k) => {
      const X = sx(p.x)
      const Y = sy(p.y)
      if (k === 0) ctx.moveTo(X, Y)
      else ctx.lineTo(X, Y)
    })
    ctx.stroke()

    // 图例
    ctx.fillStyle = color
    ctx.fillText(`J${n}(x)`, W - 74, padT + 14 + i * 18)

    if (showZeros) {
      ctx.fillStyle = color
      for (const z of besselZeros(n, 5, xMax)) {
        ctx.beginPath()
        ctx.arc(sx(z), sy(0), 3.5, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  })
}
