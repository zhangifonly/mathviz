/**
 * 雅可比矩阵 Canvas 绘制
 * 左侧：uv 平面上的均匀小网格方块
 * 右侧：经非线性映射后扭曲的网格，高亮某方块及其局部面积比
 */
import { getMapping, jacobianDet, GRID_STEPS, type Mapping } from './jacobian'

const U_MIN = 0.3
const U_MAX = 2.2
const V_MIN = -1.0
const V_MAX = 1.0

interface Box {
  panelX: number
  panelW: number
  H: number
  pad: number
}

function uvToPx(u: number, v: number, b: Box): [number, number] {
  const x = b.panelX + b.pad + ((u - U_MIN) / (U_MAX - U_MIN)) * (b.panelW - 2 * b.pad)
  const y = b.H - b.pad - ((v - V_MIN) / (V_MAX - V_MIN)) * (b.H - 2 * b.pad)
  return [x, y]
}

function mapToPx(T: Mapping, u: number, v: number, b: Box, sc: number, cx: number, cy: number): [number, number] {
  const [mx, my] = T(u, v)
  return [b.panelX + b.panelW / 2 + (mx - cx) * sc, cy - my * sc]
}

function fillCell(ctx: CanvasRenderingContext2D, pts: [number, number][], style: string) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  ctx.closePath()
  ctx.fillStyle = style
  ctx.fill()
}

export function drawJacobian(
  canvas: HTMLCanvasElement,
  mappingId: string,
  hi: number,
  hj: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  const T = getMapping(mappingId).T
  const n = GRID_STEPS
  const du = (U_MAX - U_MIN) / n
  const dv = (V_MAX - V_MIN) / n
  const left: Box = { panelX: 0, panelW: W / 2, H, pad: 24 }
  const right: Box = { panelX: W / 2, panelW: W / 2, H, pad: 24 }

  // 估算右侧缩放，让映射结果居中显示
  let maxR = 0.001
  for (let i = 0; i <= n; i++)
    for (let j = 0; j <= n; j++) {
      const [mx, my] = T(U_MIN + i * du, V_MIN + j * dv)
      maxR = Math.max(maxR, Math.abs(mx), Math.abs(my))
    }
  const sc = (right.panelW / 2 - right.pad) / maxR
  const cy = H / 2

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const u = U_MIN + i * du
      const v = V_MIN + j * dv
      const on = i === hi && j === hj
      const lc: [number, number][] = [
        uvToPx(u, v, left), uvToPx(u + du, v, left),
        uvToPx(u + du, v + dv, left), uvToPx(u, v + dv, left),
      ]
      fillCell(ctx, lc, on ? 'rgba(236,72,153,0.55)' : 'rgba(99,102,241,0.10)')
      const rc: [number, number][] = [
        mapToPx(T, u, v, right, sc, 0, cy), mapToPx(T, u + du, v, right, sc, 0, cy),
        mapToPx(T, u + du, v + dv, right, sc, 0, cy), mapToPx(T, u, v + dv, right, sc, 0, cy),
      ]
      fillCell(ctx, rc, on ? 'rgba(236,72,153,0.55)' : 'rgba(52,211,153,0.12)')
      ctx.strokeStyle = on ? '#be185d' : 'rgba(100,116,139,0.35)'
      ctx.lineWidth = on ? 2 : 0.6
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(lc[0][0], lc[0][1])
      lc.slice(1).forEach((p) => ctx.lineTo(p[0], p[1]))
      ctx.closePath()
      ctx.stroke()
    }
  }

  const uc = U_MIN + (hi + 0.5) * du
  const vc = V_MIN + (hj + 0.5) * dv
  const det = jacobianDet(T, uc, vc)
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 15px sans-serif'
  ctx.fillText('uv 平面（原始）', left.pad, 22)
  ctx.fillText('映射后（扭曲）', right.panelX + right.pad, 22)
  ctx.fillStyle = '#be185d'
  ctx.fillText(`局部面积比 |det J| ≈ ${Math.abs(det).toFixed(2)}`, right.panelX + right.pad, H - 12)
}
