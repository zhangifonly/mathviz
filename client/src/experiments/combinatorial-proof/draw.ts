/**
 * 组合恒等式 Canvas 绘制
 *
 * 以帕斯卡三角为舞台，按当前恒等式高亮相关格子：
 *  - sum：高亮整行
 *  - symmetry：高亮第 n 行里 k 与 n-k 的对称一对
 *  - pascal：高亮某格及其上方两格
 *  - hockey：高亮一条斜线及落点
 */
import { binomialRow } from './combinatorialProof'

export interface DrawData {
  identity: 'sum' | 'symmetry' | 'pascal' | 'hockey'
  n: number
  k: number
  rows: number
}

const BG = '#0f172a'
const DIM = '#334155'
const TEXT = '#e2e8f0'
const HL = '#fbbf24'
const HL2 = '#ec4899'
const HL3 = '#22d3ee'

/** 判断格子 (i,j) 是否应被高亮，返回高亮色或 null。 */
function highlightColor(d: DrawData, i: number, j: number): string | null {
  const { identity, n, k } = d
  if (identity === 'sum') {
    return i === n ? HL : null
  }
  if (identity === 'symmetry') {
    if (i !== n) return null
    if (j === k) return HL
    if (j === n - k) return HL2
    return null
  }
  if (identity === 'pascal') {
    if (i === n && j === k) return HL
    if (i === n - 1 && j === k - 1) return HL2
    if (i === n - 1 && j === k) return HL3
    return null
  }
  if (identity === 'hockey') {
    // 斜线：从 (k,k) 沿右下累加到 (n,k)，落点 (n+1,k+1)
    if (j === k && i >= k && i <= n) return HL
    if (i === n + 1 && j === k + 1) return HL2
    return null
  }
  return null
}

/**
 * 绘制。
 * @param progress 0→1 逐行揭示
 */
export function drawCombinatorialProof(
  canvas: HTMLCanvasElement,
  data: DrawData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  const rows = Math.max(1, data.rows)
  const cell = Math.min(W / (rows + 1), (H - 20) / (rows + 1))
  const box = cell * 0.86
  const upto = Math.max(1, Math.floor(rows * progress + 0.001))
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${Math.max(8, Math.floor(box * 0.42))}px system-ui, sans-serif`

  for (let i = 0; i < upto; i++) {
    const row = binomialRow(i)
    const rowWidth = (i + 1) * cell
    const startX = (W - rowWidth) / 2
    const y = i * cell + 16
    for (let j = 0; j <= i; j++) {
      const cx = startX + j * cell + cell / 2
      const cy = y + box / 2
      const hl = highlightColor(data, i, j)
      ctx.fillStyle = hl ?? DIM
      ctx.globalAlpha = hl ? 1 : 0.35
      ctx.fillRect(cx - box / 2, cy - box / 2, box, box)
      ctx.globalAlpha = 1
      ctx.fillStyle = hl ? BG : TEXT
      const label = String(row[j])
      if (box > 12) ctx.fillText(label, cx, cy)
    }
  }
}
