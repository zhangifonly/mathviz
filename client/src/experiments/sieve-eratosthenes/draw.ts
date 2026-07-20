/**
 * 埃氏筛法 Canvas 绘制：数字网格，素数高亮，合数按最小质因子着色
 */
import { sieve, smallestFactor } from './sieveEratosthenes'

// 按最小质因子取色，素数用醒目金色高亮
const PRIME_COLOR = '#fbbf24'
const FACTOR_COLORS: Record<number, string> = {
  2: '#f87171', 3: '#34d399', 5: '#60a5fa', 7: '#a78bfa',
  11: '#fb923c', 13: '#22d3ee', 17: '#f472b6', 19: '#a3e635',
}
const OTHER_COLOR = '#cbd5e1'

function colorFor(i: number, isPrime: boolean, spf: number): string {
  if (i < 2) return '#e2e8f0'
  if (isPrime) return PRIME_COLOR
  return FACTOR_COLORS[spf] || OTHER_COLOR
}

/**
 * 绘制 0..n 的网格。cols 为每行列数。
 * @param revealUpTo 只把已筛处理到的素数的倍数染色（动画用）；<2 表示全部揭示
 */
export function drawSieveEratosthenes(
  canvas: HTMLCanvasElement,
  n: number,
  cols = 10,
  revealUpTo = 0,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const isPrime = sieve(n)
  const spf = smallestFactor(n)
  const rows = Math.ceil((n + 1) / cols)
  const cell = Math.min(W / cols, H / rows)
  const gap = Math.max(1, cell * 0.06)
  const ox = (W - cell * cols) / 2
  const oy = (H - cell * rows) / 2

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${Math.floor(cell * 0.36)}px system-ui, sans-serif`

  for (let i = 0; i <= n; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    const x = ox + c * cell
    const y = oy + r * cell
    // 动画阶段：合数只在其最小质因子已被处理时才染色
    const revealed = revealUpTo < 2 || isPrime[i] || spf[i] <= revealUpTo
    ctx.fillStyle = revealed ? colorFor(i, isPrime[i], spf[i]) : '#f1f5f9'
    ctx.beginPath()
    ctx.roundRect(x + gap, y + gap, cell - gap * 2, cell - gap * 2, cell * 0.15)
    ctx.fill()
    if (isPrime[i] && revealed) {
      ctx.lineWidth = 2
      ctx.strokeStyle = '#d97706'
      ctx.stroke()
    }
    ctx.fillStyle = i < 2 ? '#94a3b8' : '#1e293b'
    ctx.fillText(String(i), x + cell / 2, y + cell / 2)
  }
}
