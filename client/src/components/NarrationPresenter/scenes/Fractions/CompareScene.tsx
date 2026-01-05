/**
 * 比较场景 - 并排显示两个分数进行比较
 */

import { useEffect, useRef } from 'react'

interface Props {
  n1: number
  d1: number
  n2: number
  d2: number
}

export default function CompareScene({ n1, d1, n2, d2 }: Props) {
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

    // 绘制两个饼图
    const radius = Math.min(width / 4, height / 3) * 0.8
    drawPie(ctx, width / 4, height / 2 - 20, radius, n1, d1)
    drawPie(ctx, (width * 3) / 4, height / 2 - 20, radius, n2, d2)

    // 比较符号
    const v1 = n1 / d1
    const v2 = n2 / d2
    const symbol = v1 > v2 ? '>' : v1 < v2 ? '<' : '='

    ctx.fillStyle = '#F59E0B'
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(symbol, width / 2, height / 2)

    // 分数文字
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(`${n1}/${d1}`, width / 4, height - 30)
    ctx.fillText(`${n2}/${d2}`, (width * 3) / 4, height - 30)
  }, [n1, d1, n2, d2])

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

function drawPie(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  numerator: number,
  denominator: number
) {
  for (let i = 0; i < denominator; i++) {
    const start = (i / denominator) * Math.PI * 2 - Math.PI / 2
    const end = ((i + 1) / denominator) * Math.PI * 2 - Math.PI / 2

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, radius, start, end)
    ctx.closePath()

    ctx.fillStyle = i < numerator ? '#3B82F6' : '#374151'
    ctx.fill()
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2
    ctx.stroke()
  }
}
