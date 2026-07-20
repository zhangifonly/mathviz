/**
 * 科赫雪花核心算法（纯函数，便于测试）
 *
 * 科赫曲线迭代规则：把每条线段三等分，中间那一段替换成
 * 一个向外凸的等边三角形的另外两条边，于是 1 段变成 4 段。
 * 从一个等边三角形出发反复迭代，就得到科赫雪花。
 * 周长按 (4/3)^n 发散到无穷，面积却收敛到初始三角形的 8/5。
 */

export interface Point {
  x: number
  y: number
}

/**
 * 对单条线段 a->b 做一次科赫替换，返回中间新增的三个点。
 * 顺序：三等分点 p1、外凸顶点 peak、三等分点 p2。
 */
function kochSegment(a: Point, b: Point): Point[] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const p1 = { x: a.x + dx / 3, y: a.y + dy / 3 }
  const p2 = { x: a.x + (dx * 2) / 3, y: a.y + (dy * 2) / 3 }
  // 把中间 1/3 段绕 p1 旋转 -60°（向外凸）得到尖顶
  const cos = Math.cos(-Math.PI / 3)
  const sin = Math.sin(-Math.PI / 3)
  const mx = dx / 3
  const my = dy / 3
  const peak = {
    x: p1.x + mx * cos - my * sin,
    y: p1.y + mx * sin + my * cos,
  }
  return [p1, peak, p2]
}

/** 对折线做一次迭代：每条线段中间 1/3 替换成等边三角形两边 */
export function kochIterate(points: Point[], times = 1): Point[] {
  let pts = points
  for (let t = 0; t < times; t++) {
    const next: Point[] = []
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i]
      const b = pts[(i + 1) % pts.length]
      next.push(a, ...kochSegment(a, b))
    }
    pts = next
  }
  return pts
}

/** 生成初始等边三角形（外接圆半径 r，圆心 cx,cy，顶点朝上） */
export function initialTriangle(cx: number, cy: number, r: number): Point[] {
  const pts: Point[] = []
  for (let i = 0; i < 3; i++) {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 3
    pts.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) })
  }
  return pts
}

/** 迭代 n 层的科赫雪花顶点序列 */
export function snowflake(cx: number, cy: number, r: number, n: number): Point[] {
  return kochIterate(initialTriangle(cx, cy, r), n)
}

/** 第 n 层雪花的周长（初始三角形边长为 side） */
export function perimeter(side: number, n: number): number {
  return 3 * side * Math.pow(4 / 3, n)
}

/** 第 n 层雪花的面积（初始三角形边长为 side），收敛到初始面积的 8/5 */
export function area(side: number, n: number): number {
  const a0 = (Math.sqrt(3) / 4) * side * side
  let sum = 1
  for (let k = 1; k <= n; k++) {
    sum += (3 / 9) * Math.pow(4 / 9, k - 1)
  }
  return a0 * sum
}

/** 演示用的迭代层数 */
export const LEVELS = [1, 3, 5]
