/**
 * 帕斯卡三角染色 Canvas 绘制
 */

/**
 * 非零余数的调色板。余数 0（被整除）已在绘制时跳过留暗，
 * 故这里只放可见颜色；余数 v≥1 映射到 PALETTE[(v-1) % len]，
 * 保证任意 mod（含未来扩展的 mod 7/11）下可见格子都拿到真实颜色，
 * 不会因索引偏移被涂成透明。
 */
const PALETTE = ['#fbbf24', '#ec4899', '#22d3ee', '#a3e635', '#c084fc', '#f87171']

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
      ctx.fillStyle = PALETTE[(v - 1) % PALETTE.length]
      ctx.fillRect(startX + j * cell, y, Math.max(1, cell - 0.5), Math.max(1, cell - 0.5))
    }
  }
}
