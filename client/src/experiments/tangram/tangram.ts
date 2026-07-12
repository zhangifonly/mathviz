/**
 * 七巧板（纯函数数学内核，无 DOM，便于测试）
 *
 * 七巧板由一个正方形切成 7 块：2 个大三角、1 个中三角、2 个小三角、
 * 1 个正方形、1 个平行四边形。以边长 SIZE=4 的大正方形为基准，
 * 各块用小三角（面积 1）计量：小三角=1，正方形/中三角/平行四边形=2，大三角=4，
 * 合计 1+1+2+2+2+4+4 = 16 = 大正方形面积。这是七巧板的核心不变量：
 * 无论拼成什么图形，七块总面积恒等于原正方形面积。
 */

export interface Point {
  x: number
  y: number
}

export interface TangramPiece {
  id: string
  name: string
  color: string
  /** 该块在边长 SIZE 正方形内的顶点坐标 */
  vertices: Point[]
  /** 以最小三角形为单位的面积（小三角=1） */
  units: number
}

/** 大正方形边长 */
export const SIZE = 4

/** 七巧板标准剖分：7 块恰好铺满 [0,SIZE]×[0,SIZE] 正方形 */
export const TANGRAM_PIECES: TangramPiece[] = [
  { id: 'large1', name: '大三角形一', color: '#f87171', units: 4, vertices: [{ x: 0, y: 0 }, { x: 0, y: 4 }, { x: 2, y: 2 }] },
  { id: 'large2', name: '大三角形二', color: '#fb923c', units: 4, vertices: [{ x: 0, y: 4 }, { x: 4, y: 4 }, { x: 2, y: 2 }] },
  { id: 'medium', name: '中三角形', color: '#fbbf24', units: 2, vertices: [{ x: 2, y: 2 }, { x: 4, y: 4 }, { x: 4, y: 2 }] },
  { id: 'small1', name: '小三角形一', color: '#34d399', units: 1, vertices: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }] },
  { id: 'small2', name: '小三角形二', color: '#22d3ee', units: 1, vertices: [{ x: 2, y: 0 }, { x: 4, y: 0 }, { x: 3, y: 1 }] },
  { id: 'square', name: '正方形', color: '#a78bfa', units: 2, vertices: [{ x: 1, y: 1 }, { x: 2, y: 0 }, { x: 3, y: 1 }, { x: 2, y: 2 }] },
  { id: 'para', name: '平行四边形', color: '#f472b6', units: 2, vertices: [{ x: 3, y: 1 }, { x: 4, y: 0 }, { x: 4, y: 2 }, { x: 2, y: 2 }] },
]

/** 返回七块的副本（避免调用方误改共享数据） */
export function tangramPieces(): TangramPiece[] {
  return TANGRAM_PIECES.map((p) => ({ ...p, vertices: p.vertices.map((v) => ({ ...v })) }))
}

/** 鞋带公式：多边形有向面积的绝对值 */
export function polygonArea(vertices: Point[]): number {
  const n = vertices.length
  if (n < 3) return 0
  let sum = 0
  for (let i = 0; i < n; i++) {
    const a = vertices[i]
    const b = vertices[(i + 1) % n]
    sum += a.x * b.y - b.x * a.y
  }
  return Math.abs(sum) / 2
}

/** 多边形形心（顶点平均，用于标注/动画锚点） */
export function polygonCentroid(vertices: Point[]): Point {
  const n = vertices.length
  let x = 0
  let y = 0
  for (const p of vertices) {
    x += p.x
    y += p.y
  }
  return { x: x / n, y: y / n }
}

/** 绕 center 旋转 angleDeg 度（逆时针） */
export function rotatePolygon(vertices: Point[], angleDeg: number, center: Point): Point[] {
  const r = (angleDeg * Math.PI) / 180
  const cos = Math.cos(r)
  const sin = Math.sin(r)
  return vertices.map((p) => {
    const dx = p.x - center.x
    const dy = p.y - center.y
    return { x: center.x + dx * cos - dy * sin, y: center.y + dx * sin + dy * cos }
  })
}

/** 平移多边形 */
export function translatePolygon(vertices: Point[], dx: number, dy: number): Point[] {
  return vertices.map((p) => ({ x: p.x + dx, y: p.y + dy }))
}

/** 七块面积之和（应恒等于大正方形面积 SIZE²） */
export function totalArea(pieces: TangramPiece[] = TANGRAM_PIECES): number {
  return pieces.reduce((s, p) => s + polygonArea(p.vertices), 0)
}

export interface ShapeOption {
  id: string
  label: string
  note: string
  /** 目标轮廓多边形（面积恒为 SIZE²=16，与原正方形一致） */
  outline: Point[]
}

/** 可拼目标图形（轮廓），全部保持面积 16 —— 面积守恒是七巧板的根本规律 */
export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: 'square', label: '正方形', note: '七块的本源，边长 4', outline: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }] },
  { id: 'triangle', label: '大三角形', note: '直角边 4√2 的等腰直角三角形', outline: [{ x: 0, y: 0 }, { x: 4 * Math.SQRT2, y: 0 }, { x: 0, y: 4 * Math.SQRT2 }] },
  { id: 'rectangle', label: '长方形', note: '8×2 的长条', outline: [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 2 }, { x: 0, y: 2 }] },
  { id: 'parallelogram', label: '平行四边形', note: '底 4 高 4 的斜方', outline: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 8, y: 4 }, { x: 4, y: 4 }] },
  { id: 'trapezoid', label: '梯形', note: '上底 2 下底 6 高 4', outline: [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 4, y: 4 }, { x: 2, y: 4 }] },
]
