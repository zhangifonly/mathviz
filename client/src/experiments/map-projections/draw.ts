/**
 * 地图投影的 Canvas 绘制
 *
 * 这个实验画的是**平面地图**而非球面，所以不用 drawSphere。
 * 画面三层：经纬网格 + Tissot 指示椭圆 + 失真热力底色。
 *
 * Tissot 椭圆是本实验的主角：在若干格点上画出「球面小圆投影后的样子」，
 * 一眼能看出哪里被拉长、哪里被压扁。等角投影的椭圆全是圆（只是大小不同），
 * 等积投影的椭圆面积全相同（只是形状不同）。
 */

import {
  project, tissot, areaDistortion, angleDistortion, isDefined, infoOf,
  type ProjectionKind,
} from './mapProjections'

export interface DrawOptions {
  kind: ProjectionKind
  /** 画 Tissot 指示椭圆 */
  showTissot?: boolean
  /** 失真热力底色：面积失真或角度失真 */
  heatmap?: 'none' | 'area' | 'angle'
  /** 经纬网格间隔（度） */
  gridStep?: number
  /** 高亮某个纬度带 */
  highlightLat?: number | null
}

const RAD = Math.PI / 180

/** 各投影在画布上的显示范围，用来定缩放 */
function planeExtent(kind: ProjectionKind): { w: number; h: number } {
  switch (kind) {
    case 'mercator':
      // 墨卡托在极点发散, 截到 ±80°
      return { w: Math.PI, h: Math.log(Math.tan(Math.PI / 4 + 80 * RAD / 2)) }
    case 'equirectangular':
      return { w: Math.PI, h: Math.PI / 2 }
    case 'lambertCylindrical':
      return { w: Math.PI, h: 1 }
    case 'sinusoidal':
      return { w: Math.PI, h: Math.PI / 2 }
    case 'azimuthalEquidistant':
      return { w: Math.PI, h: Math.PI }
    case 'orthographic':
      return { w: 1, h: 1 }
  }
}

/** 纬度上界（墨卡托要截断） */
function latLimit(kind: ProjectionKind): number {
  return kind === 'mercator' ? 80 * RAD : 90 * RAD
}

export function drawMap(canvas: HTMLCanvasElement, opts: DrawOptions): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const {
    kind, showTissot = true, heatmap = 'none', gridStep = 20,
    highlightLat = null,
  } = opts
  const { width: W, height: H } = canvas

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0a0f1e'
  ctx.fillRect(0, 0, W, H)

  const ext = planeExtent(kind)
  const pad = 40
  const scale = Math.min((W - pad * 2) / (2 * ext.w), (H - pad * 2) / (2 * ext.h))
  const toScreen = (lat: number, lon: number) => {
    const p = project(kind, lat, lon)
    return { x: W / 2 + p.x * scale, y: H / 2 - p.y * scale }
  }

  if (heatmap !== 'none') drawHeatmap(ctx, kind, toScreen, heatmap)
  drawGraticule(ctx, kind, toScreen, gridStep, highlightLat)
  if (showTissot) drawTissotEllipses(ctx, kind, toScreen, scale)
  drawLabel(ctx, W, H, kind, heatmap)
}

type ToScreen = (lat: number, lon: number) => { x: number; y: number }

/** 失真热力底色：按面积或角度失真给每个小格上色 */
function drawHeatmap(
  ctx: CanvasRenderingContext2D, kind: ProjectionKind,
  toScreen: ToScreen, mode: 'area' | 'angle',
): void {
  const limit = latLimit(kind)
  const nLat = 60
  const nLon = 90
  ctx.save()
  for (let i = 0; i < nLat; i++) {
    const lat0 = -limit + (2 * limit * i) / nLat
    const lat1 = -limit + (2 * limit * (i + 1)) / nLat
    for (let j = 0; j < nLon; j++) {
      const lon0 = -Math.PI + (2 * Math.PI * j) / nLon
      const lon1 = -Math.PI + (2 * Math.PI * (j + 1)) / nLon
      const midLat = (lat0 + lat1) / 2
      const midLon = (lon0 + lon1) / 2
      if (!isDefined(kind, midLat, midLon)) continue
      const v = mode === 'area'
        ? Math.min(1, Math.log(Math.max(1e-6, areaDistortion(kind, midLat, midLon))) / Math.log(20))
        : angleDistortion(kind, midLat, midLon)
      const a = toScreen(lat0, lon0)
      const b = toScreen(lat0, lon1)
      const c = toScreen(lat1, lon1)
      const d = toScreen(lat1, lon0)
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.lineTo(c.x, c.y)
      ctx.lineTo(d.x, d.y)
      ctx.closePath()
      ctx.fillStyle = heatColor(Math.max(0, Math.min(1, v)))
      ctx.fill()
    }
  }
  ctx.restore()
}

/** 蓝(无失真) → 黄 → 红(严重失真) */
function heatColor(t: number): string {
  const r = t < 0.5 ? Math.round(60 + t * 2 * 195) : 255
  const g = t < 0.5 ? Math.round(90 + t * 2 * 130) : Math.round(220 - (t - 0.5) * 2 * 180)
  const b = t < 0.5 ? Math.round(200 - t * 2 * 140) : Math.round(60 - (t - 0.5) * 2 * 50)
  return `rgba(${r}, ${g}, ${b}, 0.55)`
}

/** 经纬网格 */
function drawGraticule(
  ctx: CanvasRenderingContext2D, kind: ProjectionKind, toScreen: ToScreen,
  stepDeg: number, highlightLat: number | null,
): void {
  const limit = latLimit(kind)
  ctx.save()
  ctx.lineWidth = 1
  // 纬线
  for (let d = -80; d <= 80; d += stepDeg) {
    const lat = d * RAD
    if (Math.abs(lat) > limit) continue
    const hl = highlightLat !== null && Math.abs(d - highlightLat) < 0.5
    ctx.strokeStyle = hl ? 'rgba(253,224,71,0.95)' : 'rgba(148,163,184,0.45)'
    ctx.lineWidth = hl ? 2.4 : 1
    strokePath(ctx, kind, toScreen, (t) => [lat, -Math.PI + 2 * Math.PI * t], 120)
  }
  // 经线
  for (let d = -180; d <= 180; d += stepDeg) {
    const lon = d * RAD
    ctx.strokeStyle = 'rgba(148,163,184,0.4)'
    ctx.lineWidth = 1
    strokePath(ctx, kind, toScreen, (t) => [-limit + 2 * limit * t, lon], 90)
  }
  // 赤道加粗
  ctx.strokeStyle = 'rgba(226,232,240,0.8)'
  ctx.lineWidth = 1.8
  strokePath(ctx, kind, toScreen, (t) => [0, -Math.PI + 2 * Math.PI * t], 120)
  ctx.restore()
}

/** 沿参数曲线描线，跳过无定义处 */
function strokePath(
  ctx: CanvasRenderingContext2D, kind: ProjectionKind, toScreen: ToScreen,
  at: (t: number) => [number, number], steps: number,
): void {
  let started = false
  ctx.beginPath()
  for (let i = 0; i <= steps; i++) {
    const [lat, lon] = at(i / steps)
    if (!isDefined(kind, lat, lon)) {
      started = false
      continue
    }
    const p = toScreen(lat, lon)
    if (!started) {
      ctx.moveTo(p.x, p.y)
      started = true
    } else {
      ctx.lineTo(p.x, p.y)
    }
  }
  ctx.stroke()
}

/**
 * Tissot 指示椭圆。
 *
 * 在格点上画出球面小圆的投影像：半轴分别是 h（沿经线，屏幕竖直方向）
 * 与 k（沿纬线，屏幕水平方向）。为了看得清，统一乘一个基准尺寸。
 */
function drawTissotEllipses(
  ctx: CanvasRenderingContext2D, kind: ProjectionKind, toScreen: ToScreen,
  scale: number,
): void {
  const limit = latLimit(kind)
  const base = scale * 0.13
  ctx.save()
  for (let d = -60; d <= 60; d += 30) {
    const lat = d * RAD
    if (Math.abs(lat) > limit - 0.05) continue
    for (let ld = -150; ld <= 150; ld += 50) {
      const lon = ld * RAD
      if (!isDefined(kind, lat, lon)) continue
      const { h, k } = tissot(kind, lat, lon)
      if (!Number.isFinite(h) || !Number.isFinite(k)) continue
      const p = toScreen(lat, lon)
      // 椭圆的朝向：沿经线方向在屏幕上的角度
      const eps = 1e-4
      const pLat = toScreen(lat + eps, lon)
      const ang = Math.atan2(pLat.y - p.y, pLat.x - p.x)
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(ang)
      ctx.beginPath()
      ctx.ellipse(0, 0, base * h, base * k, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(253,224,71,0.3)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(253,224,71,0.95)'
      ctx.lineWidth = 1.4
      ctx.stroke()
      ctx.restore()
    }
  }
  ctx.restore()
}

function drawLabel(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  kind: ProjectionKind, heatmap: string,
): void {
  const info = infoOf(kind)
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = 'bold 17px sans-serif'
  ctx.fillText(`${info.label}投影`, 18, 28)
  ctx.font = '13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.fillText(`${info.type} · 保 ${info.preserves}`, 18, 48)
  ctx.textAlign = 'right'
  ctx.fillText(info.note, W - 18, 28)
  if (heatmap !== 'none') {
    ctx.textAlign = 'left'
    ctx.fillText(
      heatmap === 'area' ? '底色：面积失真（蓝小红大）' : '底色：角度失真（蓝小红大）',
      18, H - 16,
    )
  }
  ctx.restore()
}
