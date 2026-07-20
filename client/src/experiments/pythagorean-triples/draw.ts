/**
 * 勾股数 Canvas 绘制
 * 把每个本原勾股数 (a,b) 当作平面散点，斜边 c 越大颜色越冷，
 * 呈现经典的"勾股数树状/放射分布"。可选高亮某一个三元组。
 */
import { primitiveTriples, type Triple } from './pythagoreanTriples'

function colorFor(c: number, limit: number): string {
  const t = Math.min(1, c / limit)
  const hue = 260 - t * 200 // 大c偏紫蓝，小c偏红黄
  return `hsl(${hue}, 75%, 55%)`
}

export function drawPythagoreanTriples(
  canvas: HTMLCanvasElement,
  limit: number,
  highlight?: Triple | null,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const pad = 44
  const list = primitiveTriples(limit)
  const scale = (Math.min(W, H) - pad * 2) / limit
  const px = (a: number) => pad + a * scale
  const py = (b: number) => H - pad - b * scale

  // 坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, H - pad)
  ctx.lineTo(W - pad, H - pad)
  ctx.moveTo(pad, H - pad)
  ctx.lineTo(pad, pad)
  ctx.stroke()
  ctx.fillStyle = '#64748b'
  ctx.font = '12px sans-serif'
  ctx.fillText('直角边 a', W - pad - 46, H - pad + 18)
  ctx.save()
  ctx.translate(pad - 14, pad + 46)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('直角边 b', 0, 0)
  ctx.restore()

  // 散点
  for (const t of list) {
    const hot = highlight && t.a === highlight.a && t.b === highlight.b && t.c === highlight.c
    ctx.beginPath()
    ctx.arc(px(t.a), py(t.b), hot ? 6 : 3.2, 0, 2 * Math.PI)
    ctx.fillStyle = hot ? '#0f172a' : colorFor(t.c, limit)
    ctx.fill()
    if (hot) {
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  // 高亮标签
  if (highlight) {
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(
      `${highlight.a}² + ${highlight.b}² = ${highlight.c}²`,
      pad + 8,
      pad + 4,
    )
  }
  ctx.fillStyle = '#94a3b8'
  ctx.font = '12px sans-serif'
  ctx.fillText(`c ≤ ${limit}，共 ${list.length} 组本原勾股数`, pad + 8, pad + 24)
}
