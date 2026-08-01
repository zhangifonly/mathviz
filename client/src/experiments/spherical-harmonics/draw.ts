/**
 * 球谐函数的 Canvas 绘制
 *
 * 球谐可视化的惯例是「以 |Y| 为半径、按 Y 的正负分色」: 正叶暖色负叶冷色。
 * 通用的 drawSurface 只按 z/radius 上色, 做不到按函数符号分色, 所以这里
 * 自己实现面片绘制。
 */

import {
  makeCamera, buildQuads, project, shade, bounds, type Camera, type Vec3,
} from '../../lib/proj3d'
import { drawAxes3D } from '../../lib/draw3d'
import {
  harmonicSurface, realSphericalHarmonic, nodalLines, laplaceEigenvalue,
  THETA_RANGE, PHI_RANGE,
} from './sphericalHarmonics'

export interface DrawOptions {
  l: number
  m: number
  yaw?: number
  /** 显示节线数与特征值 */
  showInfo?: boolean
}

export function drawHarmonic(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { l, m, yaw = 0.6, showInfo = false } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const cam = makeCamera({
    yaw, pitch: 0.3, scale: Math.min(W, H) * 0.38, cx: W / 2, cy: H / 2,
  })

  // 同时记录每个网格点的符号, 供分色使用
  const grid: Vec3[][] = []
  const signs: number[][] = []
  const nT = 60
  const nP = 96
  for (let i = 0; i <= nT; i++) {
    const th = THETA_RANGE[0] + ((THETA_RANGE[1] - THETA_RANGE[0]) * i) / nT
    const row: Vec3[] = []
    const srow: number[] = []
    for (let j = 0; j <= nP; j++) {
      const ph = PHI_RANGE[0] + ((PHI_RANGE[1] - PHI_RANGE[0]) * j) / nP
      row.push(harmonicSurface(l, m, th, ph, 1))
      srow.push(Math.sign(realSphericalHarmonic(l, m, th, ph)))
    }
    grid.push(row)
    signs.push(srow)
  }

  const { radius } = bounds(grid.flat())
  const k = 1 / Math.max(1e-9, radius)
  const norm = grid.map((row) => row.map((p) => [p[0] * k, p[1] * k, p[2] * k] as Vec3))

  drawAxes3D(ctx, cam, 1.4)
  drawSignedSurface(ctx, norm, signs, cam)
  drawLabel(ctx, l, m, W, showInfo)
}

/** 按 Y 的符号分色: 正叶暖色(红), 负叶冷色(蓝) */
function drawSignedSurface(
  ctx: CanvasRenderingContext2D,
  grid: Vec3[][],
  signs: number[][],
  cam: Camera,
): void {
  const cols = grid[0].length
  // buildQuads 按行优先遍历, 面片索引可反推回网格下标 (i,j)
  const tagged = buildQuads(grid).map((q, idx) => ({
    q,
    s: signs[Math.floor(idx / (cols - 1))][idx % (cols - 1)],
  }))
  // 自己按深度排序, 才能把符号一路带到绘制时
  const order = tagged
    .map((t) => ({ ...t, d: project(t.q.center, cam).depth }))
    .sort((a, b) => b.d - a.d)

  ctx.save()
  ctx.lineJoin = 'round'
  for (const { q, s } of order) {
    const br = shade(q.normal)
    ctx.beginPath()
    q.corners.forEach((c, kk) => {
      const p = project(c, cam)
      if (kk === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.closePath()
    const rgb = s >= 0
      ? [Math.round(235 * br), Math.round(90 * br), Math.round(80 * br)]
      : [Math.round(70 * br), Math.round(130 * br), Math.round(235 * br)]
    ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 0.4
    ctx.stroke()
  }
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, l: number, m: number, W: number, showInfo: boolean,
): void {
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(`Y(l=${l}, m=${m})`, 18, 30)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText('半径 = |Y| · 红为正叶, 蓝为负叶', 18, 52)
  if (showInfo) {
    const n = nodalLines(l, m)
    ctx.textAlign = 'right'
    ctx.fillText(`节线: 纬向 ${n.latitudinal} 条 · 经向 ${n.longitudinal} 条`, W - 18, 30)
    ctx.fillText(`拉普拉斯特征值 ${laplaceEigenvalue(l)}`, W - 18, 52)
  }
  ctx.restore()
}
