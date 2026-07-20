/**
 * 幻方核心算法（纯函数，便于测试）
 *
 * 幻方是一个 n×n 的数字矩阵，填入 1..n² 且每行、每列、
 * 两条主对角线的和都相等，这个公共和叫幻常数。
 * 这里用暹罗法（楼梯法）生成奇数阶幻方。
 */

/**
 * 暹罗法（楼梯法）生成奇数阶幻方。
 * 规则：1 放在首行正中；每次向右上斜进一格（行-1、列+1，越界则环绕）；
 * 若目标格已被占，则改为在当前格正下方落子（行+1）。
 * @param n 阶数，必须为奇数
 */
export function siameseMagicSquare(n: number): number[][] {
  if (n < 1 || n % 2 === 0) {
    throw new Error('暹罗法仅适用于奇数阶')
  }
  const sq: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0))
  let row = 0
  let col = Math.floor(n / 2)
  for (let num = 1; num <= n * n; num++) {
    sq[row][col] = num
    const nr = (row - 1 + n) % n
    const nc = (col + 1) % n
    if (sq[nr][nc] !== 0) {
      row = (row + 1) % n
    } else {
      row = nr
      col = nc
    }
  }
  return sq
}

/** 幻常数 M(n) = n(n²+1)/2 */
export function magicConstant(n: number): number {
  return (n * (n * n + 1)) / 2
}

/** 校验矩阵所有行、列、两条对角线的和都等于幻常数 */
export function verifyMagic(square: number[][]): boolean {
  const n = square.length
  if (n === 0) return false
  const target = magicConstant(n)
  let diag = 0
  let anti = 0
  for (let i = 0; i < n; i++) {
    if (square[i].length !== n) return false
    let rowSum = 0
    let colSum = 0
    for (let j = 0; j < n; j++) {
      rowSum += square[i][j]
      colSum += square[j][i]
    }
    if (rowSum !== target || colSum !== target) return false
    diag += square[i][i]
    anti += square[i][n - 1 - i]
  }
  return diag === target && anti === target
}

/** 提取某条“线”的单元格坐标列表，用于高亮 */
export type LineKind = 'row' | 'col' | 'diag' | 'anti'
export function lineCells(n: number, kind: LineKind, index = 0): Array<[number, number]> {
  const cells: Array<[number, number]> = []
  for (let k = 0; k < n; k++) {
    if (kind === 'row') cells.push([index, k])
    else if (kind === 'col') cells.push([k, index])
    else if (kind === 'diag') cells.push([k, k])
    else cells.push([k, n - 1 - k])
  }
  return cells
}

export const ORDERS = [3, 5, 7]
