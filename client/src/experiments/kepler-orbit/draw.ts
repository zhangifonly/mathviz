/**
 * 开普勒轨道 Canvas 绘制
 * 画椭圆轨道 + 太阳(焦点) + 行星，并用等时扇形演示相等面积。
 */
import { orbitPoints, positionAtTime, focusX, type Vec2 } from './keplerOrbit'

const FAN_COLORS = ['#fca5a5', '#fdba74', '#fde047', '#86efac', '#7dd3fc', '#c4b5fd']

/**
 * @param a 半长轴（世界单位）
 * @param e 离心率
 * @param t 当前时刻比例 [0,1]，行星所在位置
 * @param segments 等时扇形段数（演示第二定律）
 */
export function drawKeplerOrbit(
  canvas: HTMLCanvasElement,
  a: number,
  e: number,
  t = 0,
  segments = 12,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  // 世界坐标 -> 屏幕：焦点(太阳)置于画布中心
  const scale = Math.min(W, H) * 0.32 / a
  const cx = focusX(a, e)
  const toS = (p: Vec2) => ({ x: W / 2 + (p.x - cx) * scale, y: H / 2 - p.y * scale })
  const sun = toS({ x: cx, y: 0 })

  // 等时扇形：把一个周期切成 segments 段，画出行星与太阳围出的扇形
  const activeSeg = Math.floor(((t % 1) + 1) % 1 * segments)
  for (let i = 0; i < segments; i++) {
    const p1 = toS(positionAtTime(a, e, i / segments))
    const p2 = toS(positionAtTime(a, e, (i + 1) / segments))
    ctx.beginPath()
    ctx.moveTo(sun.x, sun.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.closePath()
    ctx.fillStyle = FAN_COLORS[i % FAN_COLORS.length]
    ctx.globalAlpha = i === activeSeg ? 0.75 : 0.28
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // 椭圆轨道线
  const pts = orbitPoints(a, e, 160).map(toS)
  ctx.beginPath()
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
  ctx.closePath()
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 2
  ctx.stroke()

  // 太阳
  const sunGrad = ctx.createRadialGradient(sun.x, sun.y, 2, sun.x, sun.y, 14)
  sunGrad.addColorStop(0, '#fef08a')
  sunGrad.addColorStop(1, '#f59e0b')
  ctx.fillStyle = sunGrad
  ctx.beginPath()
  ctx.arc(sun.x, sun.y, 12, 0, 2 * Math.PI)
  ctx.fill()

  // 行星（当前时刻位置）及其到太阳的连线
  const planet = toS(positionAtTime(a, e, t))
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(sun.x, sun.y)
  ctx.lineTo(planet.x, planet.y)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#2563eb'
  ctx.beginPath()
  ctx.arc(planet.x, planet.y, 7, 0, 2 * Math.PI)
  ctx.fill()
}
