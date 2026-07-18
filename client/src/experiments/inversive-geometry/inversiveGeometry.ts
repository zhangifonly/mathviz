/**
 * 反演几何核心算法（纯函数，便于测试）
 * 关于反演圆(圆心 O, 半径 R) 的反演：点 P -> P'，满足 |OP'|*|OP|=R^2 且同向。
 * 反演把过 O 的圆变直线、不过 O 的圆变圆，实现圆与直线的互换。
 */

export interface Point { x: number; y: number }

export interface CircleShape {
  kind: 'circle'
  cx: number; cy: number; r: number
  label?: string; color?: string
}

export interface LineShape {
  kind: 'line'
  // 直线方程 nx*x + ny*y = c（法向量 (nx,ny)）
  nx: number; ny: number; c: number
  label?: string; color?: string
}

export type Shape = CircleShape | LineShape

const EPS = 1e-6

/** 点关于反演圆 (O,R) 的反演：|OP'|*|OP|=R^2，同向 */
export function invertPoint(p: Point, o: Point, r: number): Point {
  const dx = p.x - o.x
  const dy = p.y - o.y
  const d2 = dx * dx + dy * dy
  if (d2 < EPS) return { x: Infinity, y: Infinity } // O 映到无穷远
  const k = (r * r) / d2
  return { x: o.x + dx * k, y: o.y + dy * k }
}

/** 圆的反演：过 O 的圆 -> 直线；否则 -> 圆 */
export function invertCircle(c: CircleShape, o: Point, r: number): Shape {
  const nx = c.cx - o.x
  const ny = c.cy - o.y
  const s2 = nx * nx + ny * ny
  const k = r * r
  if (Math.abs(s2 - c.r * c.r) < EPS) {
    // O 落在圆上 -> 像为直线
    return { kind: 'line', nx, ny, c: k / 2 + nx * o.x + ny * o.y }
  }
  const ratio = k / (s2 - c.r * c.r)
  return { kind: 'circle', cx: o.x + nx * ratio, cy: o.y + ny * ratio, r: Math.abs(ratio) * c.r }
}

/** 直线的反演：过 O 的直线 -> 自身；否则 -> 过 O 的圆 */
export function invertLine(l: LineShape, o: Point, r: number): Shape {
  const cp = l.c - (l.nx * o.x + l.ny * o.y) // 以 O 为原点的偏移
  if (Math.abs(cp) < EPS) return { ...l } // 过 O 的直线映射为自身
  const t = (r * r) / (2 * cp)
  const rad = Math.abs(t) * Math.hypot(l.nx, l.ny)
  return { kind: 'circle', cx: o.x + l.nx * t, cy: o.y + l.ny * t, r: rad }
}

/** 通用反演：按类型分派 */
export function invertShape(shape: Shape, o: Point, r: number): Shape {
  return shape.kind === 'circle' ? invertCircle(shape, o, r) : invertLine(shape, o, r)
}

/** 采样法：在形状上取 n 个点（供绘制/交叉验证反演结果） */
export function sampleShape(shape: Shape, n: number, span = 400): Point[] {
  const pts: Point[] = []
  if (shape.kind === 'circle') {
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI * i) / n
      pts.push({ x: shape.cx + shape.r * Math.cos(a), y: shape.cy + shape.r * Math.sin(a) })
    }
  } else {
    const len = Math.hypot(shape.nx, shape.ny) || 1
    const ux = shape.nx / len
    const uy = shape.ny / len
    const bx = ux * (shape.c / len) // 直线上一点
    const by = uy * (shape.c / len)
    for (let i = 0; i < n; i++) {
      const t = (i / (n - 1) - 0.5) * span
      pts.push({ x: bx - uy * t, y: by + ux * t })
    }
  }
  return pts
}

export const INVERSION_RADIUS = 110
export const ORIGIN: Point = { x: 0, y: 0 }

/** 演示图形（世界坐标，反演中心 O=(0,0)），覆盖线↔圆的四种情形 */
export const DEMO_SHAPES: Shape[] = [
  { kind: 'line', nx: 1, ny: 0, c: 60, label: '直线（不过 O）', color: '#6366f1' },
  { kind: 'circle', cx: 90, cy: 0, r: 90, label: '过 O 的圆', color: '#ec4899' },
  { kind: 'circle', cx: 190, cy: 0, r: 45, label: '圆（不过 O）', color: '#22d3ee' },
  { kind: 'circle', cx: 30, cy: 25, r: 85, label: '圆（含 O）', color: '#fbbf24' },
]
