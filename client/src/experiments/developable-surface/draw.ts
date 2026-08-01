/**
 * 可展曲面的 Canvas 绘制
 *
 * 要同时显示两条判据的实时数值(代数行列式与几何曲率), 这是本实验的核心 ——
 * 让「可展」从一句结论变成两个能看的数字。
 */

import { makeCamera, sampleSurface, normalizeGrid, project } from '../../lib/proj3d'
import type { Camera } from '../../lib/proj3d'
import { drawSurface, drawAxes3D } from '../../lib/draw3d'
import {
  devSurface, developabilityDet, gaussianCurvature, infoOf, vRange,
  U_RANGE, type DevKind,
} from './developableSurface'

export interface DrawOptions {
  kind: DevKind
  yaw?: number
  ramp?: string
  /** 画出那族直线 */
  showRulings?: boolean
  /** 显示两条判据的实时数值 */
  showCriteria?: boolean
  surfaceAlpha?: number
}

export function drawDevelopable(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    kind, yaw = 0.6, ramp = 'ocean',
    showRulings = false, showCriteria = false, surfaceAlpha = 1,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw, pitch: 0.32, scale: Math.min(W, H) * 0.36, cx: W / 2, cy: H / 2,
  })

  const grid = normalizeGrid(
    sampleSurface((u, v) => devSurface(kind, u, v), U_RANGE, vRange(kind), 84, 18),
  )
  drawAxes3D(ctx, cam, 1.4)
  drawSurface(ctx, grid, cam, {
    ramp,
    colorBy: 'z',
    stroke: surfaceAlpha < 1 ? null : 'rgba(255,255,255,0.1)',
    alpha: surfaceAlpha,
  })

  if (showRulings) drawRulings(ctx, cam, grid)
  drawLabel(ctx, kind, W, showCriteria)
}

/** 采样网格每一行(固定 u)本身就是一条直线, 连首尾两点即可 */
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
  ctx: CanvasRenderingContext2D, kind: DevKind, W: number, showCriteria: boolean,
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
  ctx.fillText(info.developable ? '可展 · 能摊平' : '不可展 · 摊不平', W - 18, 30)
  if (showCriteria) {
    // 两条独立判据: 代数的行列式与几何的高斯曲率, 结论必须一致
    const det = Math.max(...[0.5, 1.5, 3, 4.5].map((u) => Math.abs(developabilityDet(kind, u))))
    const K = Math.max(...[[0.5, 0.4], [1.5, -0.3], [3, 0.6]].map(
      ([u, v]) => Math.abs(gaussianCurvature(kind, u, v)),
    ))
    const fmt = (x: number) => (x < 1e-6 ? '0' : x.toFixed(3))
    ctx.fillText(`|det| = ${fmt(det)}   |K| = ${fmt(K)}`, W - 18, 52)
  }
  ctx.restore()
}
