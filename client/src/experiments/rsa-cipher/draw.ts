/**
 * RSA 加密 Canvas 绘制：密钥生成流程 + 消息加解密链路
 */
import { generateKeys, encrypt, decrypt } from './rsaCipher'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function chip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, label: string, val: string, color: string) {
  ctx.fillStyle = color
  roundRect(ctx, x, y, w, 44, 8)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 13px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, x + w / 2, y + 17)
  ctx.font = 'bold 16px monospace'
  ctx.fillText(val, x + w / 2, y + 36)
}

/**
 * 绘制 RSA 全流程。
 * @param p q 素数对；msg 要加密的数字消息
 * @param mode 高亮阶段：0=密钥,1=加密,2=解密
 */
export function drawRsaCipher(
  canvas: HTMLCanvasElement,
  p: number,
  q: number,
  msg: number,
  mode = 2,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const keys = generateKeys(p, q)
  const m = ((msg % keys.n) + keys.n) % keys.n
  const c = encrypt(m, keys)
  const back = decrypt(c, keys)
  const cx = W / 2

  // 标题
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 18px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('RSA 密钥生成', cx, 28)

  // 密钥生成行
  const dim = mode === 0 ? 1 : 0.5
  ctx.globalAlpha = dim < 1 ? 0.9 : 1
  chip(ctx, cx - 250, 44, 100, 'p', String(p), '#6366f1')
  chip(ctx, cx - 130, 44, 100, 'q', String(q), '#6366f1')
  chip(ctx, cx - 10, 44, 120, 'n = p·q', String(keys.n), '#8b5cf6')
  chip(ctx, cx + 130, 44, 120, 'φ=(p-1)(q-1)', String(keys.phi), '#8b5cf6')
  chip(ctx, cx - 130, 100, 110, '公钥 e', String(keys.e), '#0ea5e9')
  chip(ctx, cx + 0, 100, 130, '私钥 d = e⁻¹', String(keys.d), '#ef4444')
  ctx.globalAlpha = 1

  // 加解密链路
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 15px system-ui, sans-serif'
  ctx.fillText('消息加解密', cx, 190)

  const y = 210
  ctx.globalAlpha = mode === 1 ? 1 : mode === 2 ? 1 : 0.55
  chip(ctx, cx - 260, y, 120, '明文 m', String(m), '#22c55e')
  chip(ctx, cx - 70, y, 150, '密文 c = mᵉ mod n', String(c), '#f59e0b')
  chip(ctx, cx + 150, y, 120, '还原 m', String(back), '#22c55e')
  ctx.globalAlpha = 1

  // 箭头
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - 140, y + 22)
  ctx.lineTo(cx - 70, y + 22)
  ctx.moveTo(cx + 80, y + 22)
  ctx.lineTo(cx + 150, y + 22)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '12px system-ui, sans-serif'
  ctx.fillText('用 e 加密', cx - 105, y + 12)
  ctx.fillText('用 d 解密', cx + 115, y + 12)

  ctx.fillStyle = back === m ? '#16a34a' : '#dc2626'
  ctx.font = 'bold 14px system-ui, sans-serif'
  ctx.fillText(back === m ? '✓ 解密成功，明文完整还原' : '解密不一致', cx, y + 72)
}
