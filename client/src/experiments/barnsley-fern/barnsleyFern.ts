/**
 * 巴恩斯利蕨核心算法（纯函数，便于测试）
 *
 * 迭代函数系统 (IFS)：从原点出发，每一步按给定概率随机挑选
 * 4 个仿射变换之一，作用到当前点上，得到下一个点。
 * 数以万计的迭代点最终勾勒出一片逼真的蕨类叶片。
 * 4 个变换分别对应：茎、主叶（不断收缩旋转）、左小叶、右小叶。
 */

export interface Point {
  x: number
  y: number
  kind: number // 落点由哪个变换生成，0..3
}

export interface Transform {
  a: number; b: number; c: number; d: number; e: number; f: number
  p: number // 选中概率
  name: string
}

/** 标准巴恩斯利蕨的 4 个仿射变换（含概率） */
export const FERN_TRANSFORMS: Transform[] = [
  { a: 0, b: 0, c: 0, d: 0.16, e: 0, f: 0, p: 0.01, name: '茎' },
  { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0, f: 1.6, p: 0.85, name: '主叶' },
  { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0, f: 1.6, p: 0.07, name: '左小叶' },
  { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0, f: 0.44, p: 0.07, name: '右小叶' },
]

/** 对点 (x,y) 应用第 i 个仿射变换 */
export function applyTransform(t: Transform, x: number, y: number): { x: number; y: number } {
  return { x: t.a * x + t.b * y + t.e, y: t.c * x + t.d * y + t.f }
}

/** 按累积概率挑选一个变换的索引，rand 取值 [0,1) */
export function pickTransform(transforms: Transform[], rand: number): number {
  let acc = 0
  for (let i = 0; i < transforms.length; i++) {
    acc += transforms[i].p
    if (rand < acc) return i
  }
  return transforms.length - 1
}

/** 生成蕨类点集：从原点迭代 n 次（可重复的伪随机种子） */
export function generateFern(n: number, seed = 1): Point[] {
  let s = seed >>> 0 || 1
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const pts: Point[] = []
  let x = 0
  let y = 0
  for (let i = 0; i < n; i++) {
    const k = pickTransform(FERN_TRANSFORMS, rand())
    const next = applyTransform(FERN_TRANSFORMS[k], x, y)
    x = next.x
    y = next.y
    pts.push({ x, y, kind: k })
  }
  return pts
}

export const POINT_COUNTS = [10000, 50000]
