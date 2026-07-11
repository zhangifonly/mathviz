/**
 * 曼德博集 / 朱利亚集 Canvas 绘制
 *
 * 逐像素计算逃逸时间，用平滑着色映射到 HSL 色轮。
 * progress 从 0 到 1 控制从上到下逐行揭示，配合逐帧动画。
 */

import { smoothEscape } from './mandelbrotJulia'

export interface FractalData {
  mode: 'mandelbrot' | 'julia'
  cx: number // julia 模式下固定的参数 c 实部（mandelbrot 模式忽略）
  cy: number
  centerX: number // 复平面视图中心
  centerY: number
  scale: number // 复平面上视图半宽（半高按纵横比缩放）
  maxIter: number
}

/** 逃逸时间 -> RGB。未逃逸（内部）返回近黑色。 */
function colorFor(t: number, maxIter: number): [number, number, number] {
  if (t >= maxIter) return [8, 10, 20]
  // 平滑值取对数压缩后映射到色相，形成连续渐变
  const hue = (Math.pow(t / maxIter, 0.4) * 360 + 200) % 360
  const sat = 0.85
  const light = t < maxIter ? 0.55 : 0
  return hslToRgb(hue / 360, sat, light)
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255)
    return [v, v, v]
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hk = (n: number) => {
    let tc = h + n
    if (tc < 0) tc += 1
    if (tc > 1) tc -= 1
    if (tc < 1 / 6) return p + (q - p) * 6 * tc
    if (tc < 1 / 2) return q
    if (tc < 2 / 3) return p + (q - p) * (2 / 3 - tc) * 6
    return p
  }
  return [
    Math.round(hk(1 / 3) * 255),
    Math.round(hk(0) * 255),
    Math.round(hk(-1 / 3) * 255),
  ]
}

/**
 * 绘制分形。
 * @param progress 0->1 从上到下逐行揭示
 */
export function drawMandelbrotJulia(
  canvas: HTMLCanvasElement,
  data: FractalData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const img = ctx.getImageData(0, 0, W, H)
  const buf = img.data

  const aspect = W / H
  const halfW = data.scale * aspect
  const halfH = data.scale
  const upto = Math.max(1, Math.floor(H * Math.min(1, Math.max(0, progress))))

  for (let py = 0; py < upto; py++) {
    const y0 = data.centerY - halfH + (py / H) * 2 * halfH
    for (let px = 0; px < W; px++) {
      const x0 = data.centerX - halfW + (px / W) * 2 * halfW
      let t: number
      if (data.mode === 'mandelbrot') {
        // 参数 c = (x0, y0)，初值 z0 = 0
        t = smoothEscape(x0, y0, 0, 0, data.maxIter)
      } else {
        // 初值 z0 = (x0, y0)，参数 c 固定
        t = smoothEscape(data.cx, data.cy, x0, y0, data.maxIter)
      }
      const [r, g, b] = colorFor(t, data.maxIter)
      const idx = (py * W + px) * 4
      buf[idx] = r
      buf[idx + 1] = g
      buf[idx + 2] = b
      buf[idx + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
}
