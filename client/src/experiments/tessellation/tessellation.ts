/**
 * 密铺镶嵌核心算法（纯函数，便于测试）
 *
 * 单一正多边形能否铺满平面，取决于其内角能否整除 360 度。
 * 正三角形(60)、正方形(90)、正六边形(120) 满足条件，其余不行。
 */

export type TilingType = 'triangle' | 'square' | 'hexagon'

export interface Cell {
  points: Array<{ x: number; y: number }>
  color: string
}

const PALETTE = [
  '#6366f1', '#ec4899', '#22d3ee', '#a3e635', '#fbbf24',
  '#f87171', '#34d399', '#a78bfa', '#fb923c', '#38bdf8',
]

/** 正 n 边形的内角（度） */
export function interiorAngle(n: number): number {
  return ((n - 2) * 180) / n
}

/** 单一正 n 边形能否密铺：顶点处角度和为 360，即 360 能被内角整除 */
export function canTessellate(n: number): boolean {
  if (n < 3) return false
  const angle = interiorAngle(n)
  return Math.abs((360 / angle) - Math.round(360 / angle)) < 1e-9
}

function color(i: number): string {
  return PALETTE[((i % PALETTE.length) + PALETTE.length) % PALETTE.length]
}

/** 生成正方形密铺网格 */
function squareCells(cols: number, rows: number, s: number): Cell[] {
  const cells: Cell[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * s
      const y = r * s
      cells.push({
        points: [
          { x, y }, { x: x + s, y },
          { x: x + s, y: y + s }, { x, y: y + s },
        ],
        color: color(r + c),
      })
    }
  }
  return cells
}

/** 生成正三角形密铺网格（上下交替） */
function triangleCells(cols: number, rows: number, s: number): Cell[] {
  const cells: Cell[] = []
  const h = (s * Math.sqrt(3)) / 2
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c * s) / 2
      const y = r * h
      const up = (r + c) % 2 === 0
      const pts = up
        ? [{ x, y: y + h }, { x: x + s, y: y + h }, { x: x + s / 2, y }]
        : [{ x, y }, { x: x + s, y }, { x: x + s / 2, y: y + h }]
      cells.push({ points: pts, color: color(r + c) })
    }
  }
  return cells
}

/** 生成正六边形蜂窝密铺网格 */
function hexCells(cols: number, rows: number, s: number): Cell[] {
  const cells: Cell[] = []
  const w = Math.sqrt(3) * s
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * w + (r % 2 ? w / 2 : 0) + w / 2
      const cy = r * 1.5 * s + s
      const pts = []
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 180) * (60 * k - 90)
        pts.push({ x: cx + s * Math.cos(a), y: cy + s * Math.sin(a) })
      }
      cells.push({ points: pts, color: color(r + c) })
    }
  }
  return cells
}

/** 按类型生成密铺多边形顶点网格 */
export function tilingCells(type: TilingType, cols: number, rows: number, s = 40): Cell[] {
  if (type === 'triangle') return triangleCells(cols, rows, s)
  if (type === 'hexagon') return hexCells(cols, rows, s)
  return squareCells(cols, rows, s)
}

export const TILINGS: TilingType[] = ['triangle', 'square', 'hexagon']
