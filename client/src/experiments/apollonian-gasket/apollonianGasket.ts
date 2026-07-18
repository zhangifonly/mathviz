/**
 * 阿波罗尼垫片核心算法（纯函数，便于测试）
 *
 * 基于笛卡尔圆定理（Descartes Circle Theorem）：
 * 四个两两相切圆的曲率 k 满足
 *   (k1+k2+k3+k4)^2 = 2(k1^2+k2^2+k3^2+k4^2)
 * 曲率 k = 1/r，外切为正、内含（包住其它圆）的大圆曲率取负。
 * 用复数版定理定位圆心，递归填满每个曲边三角形缝隙。
 */

export interface Circle {
  x: number
  y: number
  r: number
  k: number // 曲率（带符号）
}

/** 用笛卡尔定理由三圆曲率解出第四圆曲率，返回两个根（外切/内切） */
export function descartesCurvature(k1: number, k2: number, k3: number): [number, number] {
  const s = k1 + k2 + k3
  const inside = k1 * k2 + k2 * k3 + k3 * k1
  const disc = 2 * Math.sqrt(Math.max(0, inside))
  return [s + disc, s - disc]
}

/**
 * 复数版笛卡尔定理：已知三圆(带曲率)与其一个公切圆 old，
 * 反射得到另一个同时相切于三圆的圆。
 */
function secondSolution(c1: Circle, c2: Circle, c3: Circle, old: Circle): Circle {
  const k = 2 * (c1.k + c2.k + c3.k) - old.k
  // b*z 用复数：分别处理实部/虚部
  const zx = 2 * (c1.k * c1.x + c2.k * c2.x + c3.k * c3.x) - old.k * old.x
  const zy = 2 * (c1.k * c1.y + c2.k * c2.y + c3.k * c3.y) - old.k * old.y
  return { k, x: zx / k, y: zy / k, r: Math.abs(1 / k) }
}

// 经典 (-1,2,2,3) 种子：单位外圆 + 左右两个半径 1/2 圆 + 上下两个半径 1/3 圆
function seed(): { O: Circle; A: Circle; B: Circle; C: Circle } {
  const O: Circle = { k: -1, x: 0, y: 0, r: 1 }
  const A: Circle = { k: 2, x: -0.5, y: 0, r: 0.5 }
  const B: Circle = { k: 2, x: 0.5, y: 0, r: 0.5 }
  const C: Circle = { k: 3, x: 0, y: 2 / 3, r: 1 / 3 }
  return { O, A, B, C }
}

const MIN_R = 0.004 // 半径阈值，滤掉过小的圆
const MAX_CIRCLES = 6000

function recurse(
  out: Circle[],
  c1: Circle,
  c2: Circle,
  c3: Circle,
  c4: Circle,
  depth: number,
): void {
  if (depth <= 0 || out.length >= MAX_CIRCLES) return
  const triples: [Circle, Circle, Circle][] = [
    [c1, c2, c4],
    [c1, c3, c4],
    [c2, c3, c4],
  ]
  const replaced = [c3, c2, c1]
  for (let i = 0; i < 3; i++) {
    const cn = secondSolution(triples[i][0], triples[i][1], triples[i][2], replaced[i])
    if (cn.r < MIN_R || !isFinite(cn.x) || !isFinite(cn.y)) continue
    out.push(cn)
    recurse(out, triples[i][0], triples[i][1], triples[i][2], cn, depth - 1)
  }
}

/** 递归生成整张垫片，返回所有圆（含外圆），单位圆坐标系 [-1,1] */
export function generateGasket(depth: number): Circle[] {
  const { O, A, B, C } = seed()
  const D = secondSolution(O, A, B, C) // (0,-2/3) 半径 1/3
  const all: Circle[] = [O, A, B, C, D]
  recurse(all, O, A, B, C, depth)
  recurse(all, O, A, B, D, depth)
  return all
}

export const DEPTHS = [3, 4, 5]
