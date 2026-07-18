/**
 * 一次一密 Canvas 绘制：明文/密钥/密文的位（异或对齐），及密钥重用的危险
 */
import { toBytes, encrypt, bitsOf, reuseLeak } from './oneTimePad'
const CELL = 18

function drawBitRow(
  ctx: CanvasRenderingContext2D,
  bytes: number[],
  x0: number,
  y: number,
  color: string,
) {
  ctx.font = '11px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let cx = x0
  for (const byte of bytes) {
    for (const bit of bitsOf(byte)) {
      ctx.fillStyle = bit ? color : '#e2e8f0'
      ctx.fillRect(cx, y, CELL - 2, CELL - 2)
      ctx.fillStyle = bit ? '#ffffff' : '#94a3b8'
      ctx.fillText(String(bit), cx + (CELL - 2) / 2, y + (CELL - 2) / 2)
      cx += CELL
    }
    cx += 4
  }
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.fillStyle = '#334155'
  ctx.font = 'bold 13px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}

const X0 = 90
const ROW = 46

/** 位级异或：明文 XOR 密钥 = 密文；mode='reuse' 展示密钥重用泄露 */
export function drawOneTimePad(
  canvas: HTMLCanvasElement,
  plainText: string,
  keyBytes: number[],
  mode: 'encrypt' | 'reuse' = 'encrypt',
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const plain = toBytes(plainText)
  const key = keyBytes.slice(0, plain.length)

  if (mode === 'reuse') {
    drawReuse(ctx, plain, key)
    return
  }

  const cipher = encrypt(plain, key)
  const top = 40
  label(ctx, '明文 P', 12, top + 8)
  drawBitRow(ctx, plain, X0, top, '#6366f1')
  label(ctx, '密钥 K', 12, top + ROW + 8)
  drawBitRow(ctx, key, X0, top + ROW, '#f59e0b')
  ctx.fillStyle = '#64748b'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('XOR ⊕', X0, top + ROW * 1.75)
  label(ctx, '密文 C', 12, top + ROW * 2.5 + 8)
  drawBitRow(ctx, cipher, X0, top + ROW * 2.5, '#10b981')

  ctx.fillStyle = '#334155'
  ctx.font = '13px sans-serif'
  ctx.fillText('对密文再异或同一密钥，即可还原明文（异或对合）', 12, top + ROW * 4)
}

function drawReuse(ctx: CanvasRenderingContext2D, p1: number[], key: number[]) {
  const p2 = toBytes('WORLD').slice(0, p1.length)
  const c1 = encrypt(p1, key)
  const c2 = encrypt(p2, key)
  const leak = reuseLeak(c1, c2)
  const top = 30
  label(ctx, '密文 C1', 12, top + 8)
  drawBitRow(ctx, c1, X0, top, '#10b981')
  label(ctx, '密文 C2', 12, top + ROW + 8)
  drawBitRow(ctx, c2, X0, top + ROW, '#0ea5e9')
  ctx.fillStyle = '#dc2626'
  ctx.font = 'bold 16px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('C1 ⊕ C2 = P1 ⊕ P2（密钥被抵消！）', 12, top + ROW * 2)
  label(ctx, '泄露', 12, top + ROW * 2.7 + 8)
  drawBitRow(ctx, leak, X0, top + ROW * 2.7, '#dc2626')
  ctx.fillStyle = '#334155'
  ctx.font = '13px sans-serif'
  ctx.fillText('重用密钥，攻击者无需破译即可得到两明文的异或。', 12, top + ROW * 4)
}

