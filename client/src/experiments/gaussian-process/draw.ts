/**
 * 高斯过程回归 Canvas 绘制
 *
 * 画出后验均值曲线、±2 标准差的置信带、以及训练观测点。
 * progress 0→1 控制曲线与置信带从左到右逐步揭示。
 */

import { gpPosterior, type KernelOptions } from './gaussianProcess'

export interface GPData {
  /** 训练输入 */
  xTrain: number[]
  /** 训练观测值 */
  yTrain: number[]
  /** 核参数 */
  opt: KernelOptions
  /** 定义域 [xMin, xMax] */
  domain: [number, number]
}

const N_TEST = 200
const Y_MIN = -3
const Y_MAX = 3

/** 绘制高斯过程后验 */
export function drawGaussianProcess(
  canvas: HTMLCanvasElement,
  data: GPData,
  progress: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  const [xMin, xMax] = data.domain
  const pad = 40
  const toPx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad)
  const toPy = (y: number) => H - pad - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * pad)

  // 采样测试点并求后验
  const xTest: number[] = []
  for (let i = 0; i < N_TEST; i++) xTest.push(xMin + ((xMax - xMin) * i) / (N_TEST - 1))
  const post = gpPosterior(data.xTrain, data.yTrain, xTest, data.opt, 1e-6)

  // 网格与 0 轴
  ctx.strokeStyle = 'rgba(148,163,184,0.15)'
  ctx.lineWidth = 1
  for (let g = 0; g <= 6; g++) {
    const gy = pad + ((H - 2 * pad) * g) / 6
    ctx.beginPath()
    ctx.moveTo(pad, gy)
    ctx.lineTo(W - pad, gy)
    ctx.stroke()
  }
  const y0 = toPy(0)
  ctx.strokeStyle = 'rgba(148,163,184,0.4)'
  ctx.beginPath()
  ctx.moveTo(pad, y0)
  ctx.lineTo(W - pad, y0)
  ctx.stroke()

  const upto = Math.max(2, Math.floor(N_TEST * progress))

  // ±2 标准差置信带
  ctx.beginPath()
  for (let i = 0; i < upto; i++) {
    const sd = Math.sqrt(post.variance[i])
    const px = toPx(xTest[i])
    const py = toPy(post.mean[i] + 2 * sd)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  for (let i = upto - 1; i >= 0; i--) {
    const sd = Math.sqrt(post.variance[i])
    ctx.lineTo(toPx(xTest[i]), toPy(post.mean[i] - 2 * sd))
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(99,102,241,0.25)'
  ctx.fill()

  // 后验均值曲线
  ctx.beginPath()
  for (let i = 0; i < upto; i++) {
    const px = toPx(xTest[i])
    const py = toPy(post.mean[i])
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.strokeStyle = '#a5b4fc'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // 训练观测点
  for (let i = 0; i < data.xTrain.length; i++) {
    const px = toPx(data.xTrain[i])
    const py = toPy(data.yTrain[i])
    ctx.beginPath()
    ctx.arc(px, py, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#fbbf24'
    ctx.fill()
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}
