/**
 * 运算场景 - 显示分数加法、乘法、约分
 */

import { useEffect, useRef } from 'react'

interface Props {
  n1: number
  d1: number
  n2: number
  d2: number
  operation: 'add' | 'multiply' | 'simplify'
}

export default function OperationScene({ n1, d1, n2, d2, operation }: Props) {
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

    if (operation === 'add') {
      drawAddition(ctx, width, height, n1, d1, n2, d2)
    } else if (operation === 'multiply') {
      drawMultiplication(ctx, width, height, n1, d1, n2, d2)
    } else {
      drawSimplify(ctx, width, height, n1, d1)
    }
  }, [n1, d1, n2, d2, operation])

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

// 绘制加法
function drawAddition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  n1: number,
  d1: number,
  n2: number,
  d2: number
) {
  // 通分
  const lcd = d1 * d2
  const newN1 = n1 * d2
  const newN2 = n2 * d1
  const resultN = newN1 + newN2

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 28px sans-serif'
  ctx.textAlign = 'center'

  // 显示计算过程
  ctx.fillText(`${n1}/${d1} + ${n2}/${d2}`, width / 2, height / 3)
  ctx.fillText(`= ${newN1}/${lcd} + ${newN2}/${lcd}`, width / 2, height / 2)

  ctx.fillStyle = '#10B981'
  ctx.fillText(`= ${resultN}/${lcd}`, width / 2, height * 2 / 3)
}

// 绘制乘法
function drawMultiplication(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  n1: number,
  d1: number,
  n2: number,
  d2: number
) {
  const resultN = n1 * n2
  const resultD = d1 * d2

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 28px sans-serif'
  ctx.textAlign = 'center'

  ctx.fillText(`${n1}/${d1} × ${n2}/${d2}`, width / 2, height / 3)
  ctx.fillText(`= (${n1}×${n2}) / (${d1}×${d2})`, width / 2, height / 2)

  ctx.fillStyle = '#F59E0B'
  ctx.fillText(`= ${resultN}/${resultD}`, width / 2, height * 2 / 3)
}

// 绘制约分
function drawSimplify(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  n: number,
  d: number
) {
  const g = gcd(n, d)
  const simpN = n / g
  const simpD = d / g

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 28px sans-serif'
  ctx.textAlign = 'center'

  ctx.fillText(`${n}/${d}`, width / 2, height / 3)
  ctx.fillText(`÷ ${g}`, width / 2, height / 2)

  ctx.fillStyle = '#3B82F6'
  ctx.fillText(`= ${simpN}/${simpD}`, width / 2, height * 2 / 3)
}

// 最大公约数
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}
