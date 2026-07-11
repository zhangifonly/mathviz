/**
 * 对称之美 —— 纯函数数学内核（不涉及 DOM）
 *
 * 对称由「对称群」刻画：
 *  - 旋转对称：把图形绕中心转 360/n 度能与自身重合，称 n 重旋转对称（循环群 C_n）。
 *  - 镜像对称：存在一条对称轴，沿轴翻折两半完全重合。
 *  - 同时具备 n 重旋转和镜像，则为二面体群 D_n，共有 2n 个对称操作。
 */

export interface Point {
  x: number
  y: number
}

/** 绕原点逆时针旋转 angle 弧度 */
export function rotatePoint(p: Point, angle: number): Point {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c }
}

/** 关于竖直对称轴（y 轴）做镜像翻折：(x, y) → (-x, y) */
export function reflectPoint(p: Point): Point {
  return { x: -p.x, y: p.y }
}

/** 点到原点的距离（旋转与镜像都保持该距离不变） */
export function pointRadius(p: Point): number {
  return Math.hypot(p.x, p.y)
}

/** 一个对称图案总共有多少份「基元」拷贝：镜像存在则为 2n，否则为 n */
export function symmetryCopyCount(order: number, mirror: boolean): number {
  return mirror ? 2 * order : order
}

/**
 * 生成一片「花瓣」基元曲线（指向 +x 方向），作为对称操作作用的基本单元。
 * samples 越大曲线越平滑；结果确定，便于测试与复现。
 */
export function petalMotif(samples: number): Point[] {
  const n = Math.max(2, Math.floor(samples))
  const pts: Point[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const spread = (t - 0.5) * 0.9
    const r = 0.35 + 0.65 * Math.sin(Math.PI * t)
    pts.push({ x: r * Math.cos(spread), y: r * Math.sin(spread) })
  }
  return pts
}

/**
 * 把基元按对称群展开成完整图案。
 * 先绕中心旋转出 order 份，若有镜像再把每份翻折一次。
 * 返回每一份拷贝的点集数组，长度等于 symmetryCopyCount。
 */
export function buildSymmetricPattern(
  motif: Point[],
  order: number,
  mirror: boolean,
): Point[][] {
  const copies: Point[][] = []
  const n = Math.max(1, Math.floor(order))
  for (let k = 0; k < n; k++) {
    const angle = (2 * Math.PI * k) / n
    copies.push(motif.map((p) => rotatePoint(p, angle)))
    if (mirror) {
      copies.push(motif.map((p) => rotatePoint(reflectPoint(p), angle)))
    }
  }
  return copies
}

export interface SymmetryOption {
  id: string
  label: string
  order: number
  mirror: boolean
  icon: string
  note: string
}

/** 可选的对称图案：涵盖镜像、纯旋转、以及二面体（旋转+镜像） */
export const SYMMETRY_OPTIONS: SymmetryOption[] = [
  { id: 'butterfly', label: '蝴蝶 · 镜像对称', order: 1, mirror: true, icon: '🦋', note: '左右两半完全一样' },
  { id: 'pinwheel', label: '风车 · 四重旋转', order: 4, mirror: false, icon: '🎡', note: '只旋转不翻折' },
  { id: 'starfish', label: '海星 · 五重对称', order: 5, mirror: true, icon: '⭐', note: '五个方向一模一样' },
  { id: 'snowflake', label: '雪花 · 六重对称', order: 6, mirror: true, icon: '❄️', note: '六片花瓣两两对称' },
  { id: 'triangle', label: '三叶 · 三重旋转', order: 3, mirror: false, icon: '🔺', note: '转 120 度重合' },
]
