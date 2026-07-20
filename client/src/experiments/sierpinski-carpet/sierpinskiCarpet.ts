/**
 * 谢尔宾斯基地毯核心算法（纯函数，便于测试）
 *
 * 从一个正方形出发，把它切成 3x3 共 9 个小正方形，
 * 挖去正中间那一格，对剩下的 8 格递归重复。
 * 无穷次后得到的图形即谢尔宾斯基地毯，
 * 它的豪斯多夫维数 = log8 / log3 ≈ 1.8928，介于线与面之间。
 */

export interface CarpetSquare {
  x: number
  y: number
  size: number
}

/**
 * 递归生成第 n 层保留下来的所有小正方形。
 * @param n 迭代层数（n=0 返回整块正方形）
 * @param x 左上角 x（默认 0）
 * @param y 左上角 y（默认 0）
 * @param size 边长（默认 1，单位正方形）
 */
export function carpetSquares(
  n: number,
  x = 0,
  y = 0,
  size = 1,
): CarpetSquare[] {
  if (n <= 0) return [{ x, y, size }]
  const s = size / 3
  const out: CarpetSquare[] = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      // 挖去正中心格 (row=1,col=1)
      if (row === 1 && col === 1) continue
      out.push(...carpetSquares(n - 1, x + col * s, y + row * s, s))
    }
  }
  return out
}

/** 第 n 层保留的正方形数量 = 8^n（每层每格分裂成 8 个） */
export function squareCount(n: number): number {
  return Math.pow(8, Math.max(0, Math.floor(n)))
}

/** 谢尔宾斯基地毯的分数维数 log8 / log3 */
export function fractalDimension(): number {
  return Math.log(8) / Math.log(3)
}

/** 可供交互切换的迭代层数 */
export const LEVELS = [2, 3, 4]
