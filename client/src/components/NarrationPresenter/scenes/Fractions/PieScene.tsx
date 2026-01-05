/**
 * 饼图场景 - 显示分数的饼图表示
 */

import { useEffect, useRef } from 'react'

interface Props {
  numerator: number
  denominator: number
  visualization: 'pie' | 'bar' | 'grid'
  sectionId: string
}

export default function PieScene({ numerator, denominator, visualization, sectionId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    const width = rect.width
    const height = rect.height

    ctx.clearRect(0, 0, width, height)

    // 根据可视化类型绘制
    if (visualization === 'pie') {
      drawPie(ctx, width, height, numerator, denominator)
    } else if (visualization === 'bar') {
      drawBar(ctx, width, height, numerator, denominator)
    } else {
      drawGrid(ctx, width, height, numerator, denominator)
    }

    // 绘制分数文字
    drawFractionText(ctx, width, height, numerator, denominator)
  }, [numerator, denominator, visualization])

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      />
    </div>
  )
}

// 绘制饼图
function drawPie(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  numerator: number,
  denominator: number
) {
  const centerX = width / 2
  const centerY = height / 2 - 30
  const radius = Math.min(width, height) * 0.3

  // 绘制每一份
  for (let i = 0; i < denominator; i++) {
    const startAngle = (i / denominator) * Math.PI * 2 - Math.PI / 2
    const endAngle = ((i + 1) / denominator) * Math.PI * 2 - Math.PI / 2

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()

    // 分子部分用蓝色，其余用灰色
    ctx.fillStyle = i < numerator ? '#3B82F6' : '#374151'
    ctx.fill()
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

// 绘制条形图
function drawBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  numerator: number,
  denominator: number
) {
  const barWidth = width * 0.7
  const barHeight = 60
  const startX = (width - barWidth) / 2
  const startY = height / 2 - 60
  const segmentWidth = barWidth / denominator

  for (let i = 0; i < denominator; i++) {
    ctx.fillStyle = i < numerator ? '#10B981' : '#374151'
    ctx.fillRect(startX + i * segmentWidth, startY, segmentWidth - 2, barHeight)
  }
}

// 绘制网格图
function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  numerator: number,
  denominator: number
) {
  const cols = Math.min(denominator, 5)
  const rows = Math.ceil(denominator / cols)
  const cellSize = Math.min(50, width / (cols + 2))
  const gridWidth = cols * cellSize
  const gridHeight = rows * cellSize
  const startX = (width - gridWidth) / 2
  const startY = (height - gridHeight) / 2 - 30

  for (let i = 0; i < denominator; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    ctx.fillStyle = i < numerator ? '#F59E0B' : '#374151'
    ctx.fillRect(startX + col * cellSize, startY + row * cellSize, cellSize - 2, cellSize - 2)
  }
}

// 绘制分数文字
function drawFractionText(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  numerator: number,
  denominator: number
) {
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 32px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${numerator}/${denominator}`, width / 2, height - 40)
}
