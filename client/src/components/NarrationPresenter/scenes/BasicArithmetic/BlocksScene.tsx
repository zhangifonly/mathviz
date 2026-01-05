/**
 * 方块演示场景 - Khan Academy 风格
 * 支持逐句动画状态配置
 */

import { useEffect, useRef } from 'react'
import type { LineAnimationState } from '../../types'

interface Props {
  sceneId: string
  sectionId: string
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division'
  num1: number
  num2: number
  lineState?: LineAnimationState
  isInteractive: boolean
}

// 方块颜色
const COLORS = {
  group1: '#3B82F6',      // 蓝色
  group1Highlight: '#60A5FA',
  group2: '#10B981',      // 绿色
  group2Highlight: '#34D399',
  result: '#F59E0B',      // 橙色
  removed: '#EF4444',     // 红色
  dimmed: '#374151',      // 暗灰
}

export default function BlocksScene({
  sectionId,
  operation,
  num1,
  num2,
  lineState,
  isInteractive,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布大小（高清）
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    const width = rect.width
    const height = rect.height

    ctx.clearRect(0, 0, width, height)

    // 从 lineState 获取参数，否则使用默认值
    const params = lineState?.params || {}
    const actualNum1 = params.num1 ?? num1
    const actualNum2 = params.num2 ?? num2
    const actualOp = params.operation ?? operation

    // 绘制参数
    const blockSize = Math.min(40, width / 15)
    const gap = 8

    // 根据 lineState.show 决定显示什么
    const show = lineState?.show || { group1: true, group2: true, formula: true }
    const highlight = lineState?.highlight || []
    const annotation = lineState?.annotation

    // 绘制场景
    drawScene(ctx, {
      width,
      height,
      blockSize,
      gap,
      num1: actualNum1,
      num2: actualNum2,
      operation: actualOp,
      show,
      highlight,
      annotation,
    })
  }, [sectionId, operation, num1, num2, lineState])

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

// 场景绘制参数接口
interface DrawParams {
  width: number
  height: number
  blockSize: number
  gap: number
  num1: number
  num2: number
  operation: string
  show: LineAnimationState['show']
  highlight: string[]
  annotation?: LineAnimationState['annotation']
}

// 绘制整个场景
function drawScene(ctx: CanvasRenderingContext2D, params: DrawParams) {
  const { width, height, blockSize, gap, num1, num2, operation, show, highlight, annotation } = params
  const centerY = height / 2 - 20

  // 根据运算类型绘制
  switch (operation) {
    case 'addition':
      drawAddition(ctx, { ...params, centerY })
      break
    case 'subtraction':
      drawSubtraction(ctx, { ...params, centerY })
      break
    case 'multiplication':
      drawMultiplication(ctx, { ...params, centerY })
      break
    case 'division':
      drawDivision(ctx, { ...params, centerY })
      break
  }

  // 绘制标注
  if (annotation) {
    drawAnnotation(ctx, width, height, annotation)
  }
}

// 绘制加法
function drawAddition(
  ctx: CanvasRenderingContext2D,
  params: DrawParams & { centerY: number }
) {
  const { width, blockSize, gap, num1, num2, show, highlight, centerY } = params

  // 计算显示数量
  const showNum1 = show?.group1 === true ? num1 : (typeof show?.group1 === 'number' ? show.group1 : 0)
  const showNum2 = show?.group2 === true ? num2 : (typeof show?.group2 === 'number' ? show.group2 : 0)
  const showFormula = show?.formula !== false

  const totalBlocks = showNum1 + showNum2
  const totalWidth = totalBlocks * (blockSize + gap) - gap
  const startX = (width - totalWidth) / 2

  // 绘制第一组方块
  const isGroup1Highlighted = highlight.includes('group1')
  for (let i = 0; i < showNum1; i++) {
    const color = isGroup1Highlighted ? COLORS.group1Highlight : COLORS.group1
    drawBlock(ctx, startX + i * (blockSize + gap), centerY, blockSize, color)
  }

  // 绘制第二组方块
  const isGroup2Highlighted = highlight.includes('group2')
  for (let i = 0; i < showNum2; i++) {
    const color = isGroup2Highlighted ? COLORS.group2Highlight : COLORS.group2
    drawBlock(ctx, startX + (showNum1 + i) * (blockSize + gap), centerY, blockSize, color)
  }

  // 绘制公式
  if (showFormula && (showNum1 > 0 || showNum2 > 0)) {
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${num1} + ${num2} = ${num1 + num2}`, width / 2, centerY + blockSize + 50)
  }
}

// 绘制减法
function drawSubtraction(
  ctx: CanvasRenderingContext2D,
  params: DrawParams & { centerY: number }
) {
  const { width, blockSize, gap, num1, num2, show, highlight, centerY } = params

  const showNum1 = show?.group1 === true ? num1 : (typeof show?.group1 === 'number' ? show.group1 : 0)
  const showFormula = show?.formula !== false
  const remaining = Math.max(0, num1 - num2)

  const totalWidth = showNum1 * (blockSize + gap) - gap
  const startX = (width - totalWidth) / 2

  // 绘制保留的方块
  for (let i = 0; i < Math.min(remaining, showNum1); i++) {
    const color = highlight.includes('group1') ? COLORS.group1Highlight : COLORS.group1
    drawBlock(ctx, startX + i * (blockSize + gap), centerY, blockSize, color)
  }

  // 绘制被移除的方块（半透明红色）
  if (show?.group2 !== false) {
    for (let i = remaining; i < showNum1; i++) {
      drawBlock(ctx, startX + i * (blockSize + gap), centerY, blockSize, COLORS.removed, 0.4)
    }
  }

  // 绘制公式
  if (showFormula && showNum1 > 0) {
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${num1} - ${num2} = ${remaining}`, width / 2, centerY + blockSize + 50)
  }
}

// 绘制乘法（矩阵排列）
function drawMultiplication(
  ctx: CanvasRenderingContext2D,
  params: DrawParams & { centerY: number }
) {
  const { width, blockSize, gap, num1, num2, show, highlight, centerY } = params

  const showFormula = show?.formula !== false
  const rows = Math.min(num2, 5)
  const cols = Math.min(num1, 8)

  const totalWidth = cols * (blockSize + gap) - gap
  const totalHeight = rows * (blockSize + gap) - gap
  const startX = (width - totalWidth) / 2
  const startY = centerY - totalHeight / 2

  // 绘制方块矩阵
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * (blockSize + gap)
      const y = startY + row * (blockSize + gap)
      const color = highlight.includes('group1') ? COLORS.group1Highlight : COLORS.group1
      drawBlock(ctx, x, y, blockSize, color)
    }
  }

  // 绘制公式
  if (showFormula) {
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${num1} × ${num2} = ${num1 * num2}`, width / 2, startY + totalHeight + 50)
  }
}

// 绘制除法（分组排列）
function drawDivision(
  ctx: CanvasRenderingContext2D,
  params: DrawParams & { centerY: number }
) {
  const { width, blockSize, gap, num1, num2, show, centerY } = params

  if (num2 === 0) {
    ctx.fillStyle = '#EF4444'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('除数不能为 0', width / 2, centerY)
    return
  }

  const showFormula = show?.formula !== false
  const quotient = Math.floor(num1 / num2)
  const remainder = num1 % num2
  const groups = Math.min(num2, 5)
  const perGroup = Math.min(quotient, 8)

  const groupWidth = perGroup * (blockSize + gap) - gap
  const totalWidth = groups * (groupWidth + gap * 3)
  const startX = (width - totalWidth) / 2

  // 绘制分组
  for (let g = 0; g < groups; g++) {
    const groupX = startX + g * (groupWidth + gap * 3)
    for (let i = 0; i < perGroup; i++) {
      drawBlock(ctx, groupX + i * (blockSize + gap), centerY, blockSize, COLORS.group1)
    }
  }

  // 绘制余数
  if (remainder > 0 && show?.result !== false) {
    const remainderX = startX + groups * (groupWidth + gap * 3)
    for (let i = 0; i < Math.min(remainder, 3); i++) {
      drawBlock(ctx, remainderX + i * (blockSize + gap), centerY, blockSize, COLORS.result, 0.6)
    }
  }

  // 绘制公式
  if (showFormula) {
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    const text = remainder > 0
      ? `${num1} ÷ ${num2} = ${quotient} ... ${remainder}`
      : `${num1} ÷ ${num2} = ${quotient}`
    ctx.fillText(text, width / 2, centerY + blockSize + 50)
  }
}

// 绘制单个方块
function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha = 1
) {
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(x, y, size, size, 6)
  ctx.fill()

  // 高光效果
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.beginPath()
  ctx.roundRect(x + 3, y + 3, size - 6, size / 3, 3)
  ctx.fill()

  ctx.globalAlpha = 1
}

// 绘制标注文字
function drawAnnotation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  annotation: NonNullable<LineAnimationState['annotation']>
) {
  const { text, position } = annotation

  ctx.fillStyle = '#F59E0B'
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'

  let y: number
  switch (position) {
    case 'top':
      y = 40
      break
    case 'bottom':
      // 调整位置，避免被播放控制栏遮挡
      y = height - 80
      break
    default:
      y = height / 2
  }

  ctx.fillText(text, width / 2, y)
}
