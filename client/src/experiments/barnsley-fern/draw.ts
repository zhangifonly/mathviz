/**
 * 巴恩斯利蕨 Canvas 绘制（点云）
 * 把 IFS 生成的点集从数学坐标映射到画布像素，逐点着色成绿色蕨叶。
 */
import { generateFern, type Point } from './barnsleyFern'

// 四个变换对应的深浅绿色，可选高亮某一类
const KIND_COLORS = ['#065f46', '#16a34a', '#4ade80', '#86efac']

/** 把蕨类数学坐标 (x∈[-3,3], y∈[0,11]) 映射到画布像素 */
function project(p: Point, W: number, H: number): [number, number] {
  const px = W / 2 + (p.x / 6) * W * 0.92
  const py = H - (p.y / 11) * H * 0.96
  return [px, py]
}

/**
 * 绘制蕨类点云。
 * @param highlightKind 若为 0..3 则只高亮该变换生成的点，其余淡出
 */
export function drawBarnsleyFern(
  canvas: HTMLCanvasElement,
  n: number,
  seed = 1,
  highlightKind = -1,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, W, H)

  const pts = generateFern(n, seed)
  for (const p of pts) {
    const [px, py] = project(p, W, H)
    if (highlightKind >= 0) {
      ctx.fillStyle = p.kind === highlightKind ? KIND_COLORS[p.kind] : 'rgba(148,163,184,0.25)'
    } else {
      ctx.fillStyle = KIND_COLORS[p.kind]
    }
    ctx.fillRect(px, py, 1, 1)
  }
}
