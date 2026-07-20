/**
 * 希尔密码 Canvas 绘制
 * 展示：密钥矩阵 × 明文向量 = 密文向量（模 26）
 */
import { charToNum, numToChar, applyMatrix, cleanText, type Matrix2 } from './hillCipher'

/** 绘制第 blockIdx 个字母块的矩阵-向量乘法运算 */
export function drawHillCipher(
  canvas: HTMLCanvasElement,
  text: string,
  key: Matrix2,
  blockIdx = 0,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const s = cleanText(text)
  const blocks = Math.max(1, s.length / 2)
  const bi = Math.min(blockIdx, blocks - 1)
  const a = s[bi * 2] || 'X'
  const b = s[bi * 2 + 1] || 'X'
  const v: [number, number] = [charToNum(a), charToNum(b)]
  const r = applyMatrix(key, v)

  const cy = H / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 密钥矩阵
  drawMatrix(ctx, 90, cy, [[key[0][0], key[0][1]], [key[1][0], key[1][1]]], '#6366f1')
  drawTimes(ctx, 195, cy, '#64748b')
  // 明文向量
  drawMatrix(ctx, 255, cy, [[v[0]], [v[1]]], '#0ea5e9')
  drawEq(ctx, 335, cy)
  // 密文向量
  drawMatrix(ctx, 400, cy, [[r[0]], [r[1]]], '#ec4899')

  // 字母标注
  ctx.font = 'bold 20px monospace'
  ctx.fillStyle = '#0ea5e9'
  ctx.fillText(`${a}=${v[0]}`, 255, cy - 78)
  ctx.fillText(`${b}=${v[1]}`, 255, cy + 78)
  ctx.fillStyle = '#ec4899'
  ctx.fillText(`${numToChar(r[0])} ${numToChar(r[1])}`, 500, cy)
  ctx.font = 'bold 15px sans-serif'
  ctx.fillStyle = '#475569'
  ctx.fillText(`明文块 ${a}${b}  第 ${bi + 1}/${blocks} 块`, W / 2, 34)
  ctx.fillText('矩阵 × 向量 (mod 26) = 密文', W / 2, H - 26)
}

function drawMatrix(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rows: number[][],
  color: string,
) {
  const cols = rows[0].length
  const cw = 40
  const ch = 40
  const w = cols * cw
  const h = rows.length * ch
  const left = cx - w / 2
  const top = cy - h / 2
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  // 左右方括号
  ctx.beginPath()
  ctx.moveTo(left - 8, top - 8); ctx.lineTo(left - 8, top + h + 8); ctx.moveTo(left - 8, top - 8); ctx.lineTo(left + 2, top - 8)
  ctx.moveTo(left - 8, top + h + 8); ctx.lineTo(left + 2, top + h + 8)
  ctx.moveTo(left + w + 8, top - 8); ctx.lineTo(left + w + 8, top + h + 8); ctx.moveTo(left + w + 8, top - 8); ctx.lineTo(left + w - 2, top - 8)
  ctx.moveTo(left + w + 8, top + h + 8); ctx.lineTo(left + w - 2, top + h + 8)
  ctx.stroke()
  ctx.font = 'bold 22px monospace'
  ctx.fillStyle = color
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < cols; j++) {
      ctx.fillText(String(rows[i][j]), left + j * cw + cw / 2, top + i * ch + ch / 2)
    }
  }
}

function drawTimes(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.font = 'bold 26px sans-serif'
  ctx.fillStyle = color
  ctx.fillText('×', x, y)
}

function drawEq(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.font = 'bold 26px sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText('=', x, y)
}
