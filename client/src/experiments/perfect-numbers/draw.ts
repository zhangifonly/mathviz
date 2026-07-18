/**
 * 完全数 Canvas 绘制：把某数的真因数画成累加的方块，
 * 并在下方显示真因数之和是否等于自身。
 */
import { properDivisors, divisorSum, classify } from './perfectNumbers'

const CLASS_COLOR: Record<string, string> = {
  perfect: '#22c55e',
  abundant: '#f97316',
  deficient: '#38bdf8',
}

const CLASS_LABEL: Record<string, string> = {
  perfect: '完全数 (和 = 自身)',
  abundant: '盈数 (和 > 自身)',
  deficient: '亏数 (和 < 自身)',
}

/** 绘制数 n 的真因数分解方块与求和结论 */
export function drawPerfectNumbers(canvas: HTMLCanvasElement, n: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const divs = properDivisors(n)
  const sum = divisorSum(n)
  const cls = classify(n)
  const color = CLASS_COLOR[cls]

  // 标题
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 26px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`n = ${n}`, W / 2, 44)

  // 逐个真因数：画一列小方块表示该因数大小，累加成条
  const marginX = 40
  const barY = 90
  const cell = 14
  const gap = 6
  let x = marginX
  ctx.font = '13px sans-serif'
  for (const d of divs) {
    const rows = Math.min(d, 8)
    for (let r = 0; r < d; r++) {
      const col = Math.floor(r / rows)
      const row = r % rows
      ctx.fillStyle = color
      ctx.fillRect(x + col * (cell + 2), barY + row * (cell + 2), cell, cell)
    }
    const cols = Math.ceil(d / rows)
    const groupW = cols * (cell + 2)
    ctx.fillStyle = '#334155'
    ctx.textAlign = 'center'
    ctx.fillText(`${d}`, x + groupW / 2, barY + rows * (cell + 2) + 16)
    x += groupW + gap + 18
    if (x > W - 60) x = marginX
  }

  // 求和公式
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'
  const expr = divs.join(' + ')
  const cmp = sum === n ? '=' : sum > n ? '>' : '<'
  ctx.fillText(`${expr} = ${sum} ${cmp} ${n}`, W / 2, H - 70)

  // 结论徽章
  ctx.fillStyle = color
  ctx.fillRect(W / 2 - 120, H - 52, 240, 34)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px sans-serif'
  ctx.fillText(CLASS_LABEL[cls], W / 2, H - 30)
}
