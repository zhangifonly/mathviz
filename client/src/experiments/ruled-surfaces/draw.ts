/**
 * 直纹曲面的 Canvas 绘制
 *
 * 本实验的看点是「那族直线」本身, 所以必须能把直线单独描出来,
 * 并显示可展判据的实时数值。
 */

import { makeCamera, normalizeGrid, sampleSurface, project } from '../../lib/proj3d'
import type { Camera } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import {
  ruledSurface, developabilityDet, infoOf, vRange, U_RANGE, type RuledKind,
} from './ruledSurfaces'

export interface DrawOptions {
  kind: RuledKind
  yaw?: number
  ramp?: string
  /** 画出那族直线 */
  showRulings?: boolean
  /** 显示可展判据行列式的实时值 */
  showDet?: boolean
  surfaceAlpha?: number
}

export function drawRuled(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    kind, yaw = 0.6, ramp = 'plasma',
    showRulings = false, showDet = false, surfaceAlpha = 1,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw, pitch: 0.32, scale: Math.min(W, H) * 0.36, cx: W / 2, cy: H / 2,
  })

  const vr = vRange(kind)
  const grid = normalizeGrid(
    sampleSurface((u, v) => ruledSurface(kind, u, v), U_RANGE, vr, 84, 20),
  )
  drawAxes3D(ctx, cam, 1.4)
  drawSurface(ctx, grid, cam, {
    ramp,
    colorBy: 'z',
    stroke: surfaceAlpha < 1 ? null : 'rgba(255,255,255,0.1)',
    alpha: surfaceAlpha,
  })

  if (showRulings) drawRulings(ctx, cam, grid)
  drawLabel(ctx, kind, W, showDet)
}

/**
 * 描出那族直线。采样网格的每一行(固定 u)本身就是一条空间直线,
 * 所以只连首尾两点即可 —— 中间点必然共线。
 */
function drawRulings(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  grid: ReturnType<typeof normalizeGrid>,
): void {
  ctx.save()
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.9)'
  ctx.lineWidth = 1.4
  for (let i = 0; i < grid.length; i += 3) {
    const row = grid[i]
    const p = project(row[0], cam)
    const q = project(row[row.length - 1], cam)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(q.x, q.y)
    ctx.stroke()
  }
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, kind: RuledKind, W: number, showDet: boolean,
): void {
  const info = infoOf(kind)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(info.label, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(info.note, 18, 52)
  ctx.textAlign = 'right'
  ctx.fillText(info.developable ? '可展 · K ≡ 0' : '不可展 · K < 0', W - 18, 30)
  if (showDet) {
    ctx.textAlign = 'left'
    // 取几个 u 上判据的最大绝对值, 0 说明可展
    const mx = Math.max(...[0, 1, 2, 3, 4.5].map((u) => Math.abs(developabilityDet(kind, u))))
    ctx.fillText(`可展判据 |det| = ${mx < 1e-6 ? '0' : mx.toFixed(3)}`, 18, 74)
  }
  ctx.restore()
}
