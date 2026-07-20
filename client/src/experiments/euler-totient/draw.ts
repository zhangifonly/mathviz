/**
 * 欧拉函数 Canvas 绘制：把 1..n 排成一个数环，
 * 与 n 互质的数高亮，非互质的数灰显，中央显示 phi(n)。
 */
import { gcd, totient } from './eulerTotient'

/**
 * 绘制 1..n 的数环。
 * @param n 上限
 */
export function drawEulerTotient(canvas: HTMLCanvasElement, n: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx || n < 1) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const cx = W / 2
  const cy = H / 2
  const radius = Math.min(W, H) / 2 - 34
  const phi = totient(n)

  // 环上的每个数
  const dotR = n <= 24 ? 15 : n <= 60 ? 10 : 6
  const fontSize = n <= 24 ? 13 : n <= 60 ? 10 : 8
  for (let k = 1; k <= n; k++) {
    const angle = (-Math.PI / 2) + (2 * Math.PI * (k - 1)) / n
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    const coprime = gcd(k, n) === 1

    ctx.beginPath()
    ctx.arc(x, y, dotR, 0, 2 * Math.PI)
    ctx.fillStyle = coprime ? '#6366f1' : '#e2e8f0'
    ctx.fill()
    if (coprime) {
      ctx.strokeStyle = '#4338ca'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    if (n <= 100) {
      ctx.fillStyle = coprime ? '#ffffff' : '#94a3b8'
      ctx.font = `${fontSize}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(k), x, y)
    }
  }

  // 中央信息
  ctx.fillStyle = '#0f172a'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 30px sans-serif'
  ctx.fillText(`n = ${n}`, cx, cy - 16)
  ctx.fillStyle = '#4f46e5'
  ctx.font = 'bold 34px sans-serif'
  ctx.fillText(`φ(${n}) = ${phi}`, cx, cy + 22)
}
