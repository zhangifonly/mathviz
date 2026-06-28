/**
 * 帕斯卡三角染色 Canvas 绘制
 */

/** 不同余数的颜色（索引 0 = 被整除，留暗） */
const COLORS = ['transparent', '#fbbf24', '#ec4899', '#22d3ee', '#a3e635']

/**
 * 绘制 mod 染色的帕斯卡三角。
 * @param tri pascalMod 生成的余数三角
 * @param progress 0→1 逐行揭示
 */
export function drawPascal(
  canvas: HTMLCanvasElement,
  tri: number[][],
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx || tri.length === 0) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const rows = tri.length
  const cell = Math.min(W / rows, H / rows)
  const upto = Math.max(1, Math.floor(rows * progress))

  for (let i = 0; i < upto; i++) {
    const row = tri[i]
    // 行 i 有 i+1 个元素，居中排列
    const rowWidth = (i + 1) * cell
    const startX = (W - rowWidth) / 2
    const y = i * cell + 4
    for (let j = 0; j <= i; j++) {
      const v = row[j]
      if (v === 0) continue
      ctx.fillStyle = COLORS[v % COLORS.length] || '#fbbf24'
      ctx.fillRect(startX + j * cell, y, Math.max(1, cell - 0.5), Math.max(1, cell - 0.5))
    }
  }
}
