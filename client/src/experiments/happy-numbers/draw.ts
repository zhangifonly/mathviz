/**
 * 快乐数 Canvas 绘制：把某数的迭代链画成折线 + 节点。
 * 快乐数收敛到 1（绿色），不快乐数陷入 8 数循环（红色）。
 */
import { happyChain, isHappy } from './happyNumbers'

export function drawHappyNumbers(canvas: HTMLCanvasElement, start: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const chain = happyChain(start)
  const happy = isHappy(start)
  const accent = happy ? '#22c55e' : '#ef4444'

  const n = chain.length
  const padX = 60
  const padY = 70
  const usableW = W - padX * 2
  const maxVal = Math.max(...chain, 1)
  const stepX = n > 1 ? usableW / (n - 1) : 0

  // 折线：横轴为迭代序号，纵轴为数值高度
  const px = (i: number) => padX + i * stepX
  const py = (v: number) => H - padY - (v / maxVal) * (H - padY * 2)

  ctx.strokeStyle = accent
  ctx.lineWidth = 2.5
  ctx.beginPath()
  chain.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))))
  ctx.stroke()

  // 节点 + 数值标签
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'
  chain.forEach((v, i) => {
    const isEnd = i === n - 1
    ctx.fillStyle = isEnd ? accent : '#6366f1'
    ctx.beginPath()
    ctx.arc(px(i), py(v), isEnd ? 9 : 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.fillText(String(v), px(i), py(v) - 14)
  })

  // 标题条
  ctx.fillStyle = accent
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'left'
  const verdict = happy ? '快乐数 → 收敛到 1' : '不快乐 → 陷入 8 数循环'
  ctx.fillText(`${start}: ${verdict}`, padX, 40)
}
