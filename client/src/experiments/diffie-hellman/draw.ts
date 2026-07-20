/**
 * 迪菲-赫尔曼密钥交换 Canvas 绘制
 * 左 Alice、右 Bob、中间公开信道；展示各自计算与最终共享密钥。
 */
import { dhExchange } from './diffieHellman'

function party(
  ctx: CanvasRenderingContext2D,
  x: number,
  name: string,
  color: string,
  priv: number,
  pub: number,
  shared: number,
) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, 120, 34, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(name, x, 126)
  ctx.fillStyle = '#0f172a'
  ctx.font = '15px sans-serif'
  ctx.fillText(`私钥 = ${priv}`, x, 185)
  ctx.fillText(`公开值 = ${pub}`, x, 210)
  ctx.fillStyle = '#059669'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText(`共享密钥 = ${shared}`, x, 240)
}

export function drawDiffieHellman(
  canvas: HTMLCanvasElement,
  p: number,
  g: number,
  a: number,
  b: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const r = dhExchange(p, g, a, b)
  const leftX = W * 0.22
  const rightX = W * 0.78

  // 公开参数横幅
  ctx.fillStyle = '#eef2ff'
  ctx.fillRect(0, 0, W, 56)
  ctx.fillStyle = '#3730a3'
  ctx.font = 'bold 17px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`公开参数: p = ${p}   g = ${g}`, W / 2, 34)

  // 公开信道（交换公开值）
  ctx.strokeStyle = '#94a3b8'
  ctx.setLineDash([8, 6])
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(leftX + 40, 120)
  ctx.lineTo(rightX - 40, 120)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#64748b'
  ctx.font = '13px sans-serif'
  ctx.fillText('公开信道 (窃听者可见)', W / 2, 100)
  ctx.fillStyle = '#7c3aed'
  ctx.font = 'bold 14px sans-serif'
  ctx.fillText(`A = ${r.A} →`, W / 2, 132)
  ctx.fillText(`← B = ${r.B}`, W / 2, 150)

  party(ctx, leftX, 'Alice', '#6366f1', a, r.A, r.sharedAlice)
  party(ctx, rightX, 'Bob', '#ec4899', b, r.B, r.sharedBob)

  // 结论条
  ctx.fillStyle = r.agree ? '#ecfdf5' : '#fef2f2'
  ctx.fillRect(0, H - 60, W, 60)
  ctx.fillStyle = r.agree ? '#047857' : '#b91c1c'
  ctx.font = 'bold 20px sans-serif'
  const msg = r.agree
    ? `双方密钥相同 = ${r.sharedAlice}  (窃听者难以算出)`
    : '密钥不一致'
  ctx.fillText(msg, W / 2, H - 24)
}
