/**
 * 费马小定理 Canvas 绘制
 * 画出 a^k mod p 的幂表：行=底数 a(1..p-1)，列=指数 k(0..p-1)，
 * 高亮 k=p-1 那一列（费马小定理保证该列恒为 1）。
 */
import { powMod } from './fermatLittle'

/**
 * 绘制模幂表格。
 * @param p 素数模数
 * @param highlightA 需要重点标记的底数行（可选）
 */
export function drawFermatLittle(
  canvas: HTMLCanvasElement,
  p: number,
  highlightA = 0,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const rows = p - 1 // 底数 1..p-1
  const cols = p // 指数 0..p-1
  const padL = 44
  const padT = 40
  const cw = (W - padL - 16) / cols
  const ch = (H - padT - 16) / rows

  ctx.font = '12px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 列标题（指数 k）
  for (let k = 0; k < cols; k++) {
    const cx = padL + k * cw + cw / 2
    ctx.fillStyle = k === p - 1 ? '#dc2626' : '#64748b'
    ctx.fillText(`k=${k}`, cx, padT - 18)
  }

  for (let ai = 0; ai < rows; ai++) {
    const a = ai + 1
    const cy = padT + ai * ch + ch / 2
    // 行标题（底数 a）
    ctx.fillStyle = a === highlightA ? '#7c3aed' : '#334155'
    ctx.textAlign = 'right'
    ctx.fillText(`a=${a}`, padL - 6, cy)
    ctx.textAlign = 'center'

    for (let k = 0; k < cols; k++) {
      const v = powMod(a, k, p)
      const x = padL + k * cw
      const y = padT + ai * ch
      // 单元背景：p-1 列且值为1 用绿色高亮；余项按值淡染
      let bg = '#f8fafc'
      if (k === p - 1 && v === 1) bg = '#bbf7d0'
      else if (v === 1 && k > 0) bg = '#e0f2fe'
      if (a === highlightA) bg = k === p - 1 ? '#86efac' : '#ede9fe'
      ctx.fillStyle = bg
      ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2)

      ctx.fillStyle = v === 1 ? '#166534' : '#475569'
      ctx.fillText(String(v), x + cw / 2, y + ch / 2)
    }
  }

  // 右上角说明
  ctx.textAlign = 'right'
  ctx.fillStyle = '#dc2626'
  ctx.font = 'bold 13px system-ui, sans-serif'
  ctx.fillText(`模 p=${p} · 末列 a^(p-1)≡1`, W - 8, 16)
}
