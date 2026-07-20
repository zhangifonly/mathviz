/**
 * 中国剩余定理 Canvas 绘制
 * 在 0..M 数轴上标出满足各同余条件的点，公共解高亮为大红点。
 */
import { crt, satisfies } from './chineseRemainder'

const COND_COLORS = ['#6366f1', '#ec4899', '#22d3ee', '#f59e0b']

/**
 * 绘制数轴与同余点。
 * @param highlightCond -1=显示全部条件, >=0=只高亮该条件, 传 moduli.length 表示只画公共解
 */
export function drawChineseRemainder(
  canvas: HTMLCanvasElement,
  remainders: number[],
  moduli: number[],
  highlightCond = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  let M: number
  let solution: number
  try {
    const r = crt(remainders, moduli)
    M = r.M
    solution = r.x
  } catch {
    ctx.fillStyle = '#ef4444'
    ctx.font = '16px sans-serif'
    ctx.fillText('模必须两两互质', 20, H / 2)
    return
  }

  const padX = 40
  const axisY = H - 60
  const spanW = W - padX * 2
  const xOf = (v: number) => padX + (v / M) * spanW

  // 主数轴
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(padX, axisY)
  ctx.lineTo(W - padX, axisY)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('0', padX - 4, axisY + 20)
  ctx.fillText(String(M), W - padX - 10, axisY + 20)

  // 每个条件一行满足点
  const showAll = highlightCond === -1
  for (let c = 0; c < moduli.length; c++) {
    if (!showAll && highlightCond < moduli.length && highlightCond !== c) continue
    const y = 40 + c * 42
    ctx.fillStyle = COND_COLORS[c % COND_COLORS.length]
    ctx.font = '13px sans-serif'
    ctx.fillText(`x ≡ ${remainders[c]} (mod ${moduli[c]})`, 4, y - 12)
    for (let v = 0; v < M; v++) {
      if (((v % moduli[c]) + moduli[c]) % moduli[c] === ((remainders[c] % moduli[c]) + moduli[c]) % moduli[c]) {
        ctx.beginPath()
        ctx.arc(xOf(v), y, 3, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }

  // 公共解：在主数轴上找出所有满足全部条件的点（0..M 内唯一）
  ctx.fillStyle = '#dc2626'
  for (let v = 0; v < M; v++) {
    if (satisfies(v, remainders, moduli)) {
      ctx.beginPath()
      ctx.arc(xOf(v), axisY, 7, 0, 2 * Math.PI)
      ctx.fill()
      ctx.font = 'bold 15px sans-serif'
      ctx.fillText(`x = ${v}`, xOf(v) - 18, axisY - 14)
    }
  }
  void solution
}
