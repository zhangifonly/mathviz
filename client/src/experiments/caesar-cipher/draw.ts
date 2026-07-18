/**
 * 凯撒密码 Canvas 绘制
 * 上半部：字母表移位环（明文环 + 密文环，连线示意 shift）
 * 下半部：密文字母频率柱状图，叠加英文标准频率折线，用于频率分析对比
 */
import { letterFrequency, ENGLISH_FREQ } from './caesarCipher'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/** 绘制字母表移位环 */
function drawRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, shift: number) {
  const rOuter = 88
  const rInner = 62
  ctx.font = '11px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < 26; i++) {
    const ang = (i / 26) * 2 * Math.PI - Math.PI / 2
    // 外环：明文
    ctx.fillStyle = '#6366f1'
    ctx.fillText(LETTERS[i], cx + Math.cos(ang) * rOuter, cy + Math.sin(ang) * rOuter)
    // 内环：密文（明文 i 加密为 i+shift）
    const c = (i + shift) % 26
    ctx.fillStyle = '#ec4899'
    ctx.fillText(LETTERS[c], cx + Math.cos(ang) * rInner, cy + Math.sin(ang) * rInner)
  }
  ctx.strokeStyle = '#cbd5e1'
  ctx.beginPath(); ctx.arc(cx, cy, rOuter, 0, 2 * Math.PI); ctx.stroke()
  ctx.beginPath(); ctx.arc(cx, cy, rInner, 0, 2 * Math.PI); ctx.stroke()
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 14px sans-serif'
  ctx.fillText('shift = ' + shift, cx, cy)
}

/** 绘制频率柱状图 + 英文标准频率折线 */
function drawFreqChart(
  ctx: CanvasRenderingContext2D,
  freq: number[],
  x0: number, y0: number, w: number, h: number,
) {
  const bw = w / 26
  const maxV = 14
  ctx.strokeStyle = '#e2e8f0'
  ctx.beginPath(); ctx.moveTo(x0, y0 + h); ctx.lineTo(x0 + w, y0 + h); ctx.stroke()
  // 密文频率柱
  ctx.fillStyle = '#ec4899'
  for (let i = 0; i < 26; i++) {
    const bh = Math.min(freq[i], maxV) / maxV * h
    ctx.fillRect(x0 + i * bw + 1, y0 + h - bh, bw - 2, bh)
  }
  // 英文标准频率折线
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < 26; i++) {
    const py = y0 + h - Math.min(ENGLISH_FREQ[i], maxV) / maxV * h
    const px = x0 + i * bw + bw / 2
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.lineWidth = 1
  // 字母轴标签
  ctx.fillStyle = '#64748b'
  ctx.font = '9px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  for (let i = 0; i < 26; i++) {
    ctx.fillText(LETTERS[i], x0 + i * bw + bw / 2, y0 + h + 3)
  }
}

/** 主绘制入口 */
export function drawCaesarCipher(
  canvas: HTMLCanvasElement,
  shift: number,
  cipherText: string,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  drawRing(ctx, W / 2, 120, ((shift % 26) + 26) % 26)

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 13px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('密文字母频率(粉柱) vs 英文标准频率(蓝线)', 30, 250)
  drawFreqChart(ctx, letterFrequency(cipherText), 30, 270, W - 60, H - 300)
}
