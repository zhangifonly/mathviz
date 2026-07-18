/**
 * 汉诺塔核心算法（纯函数，便于测试）
 *
 * 三根柱子 A/B/C，n 个大小递减的盘子最初全在起点柱，
 * 每次只能移动最上面的一个盘子，且大盘不能压在小盘上。
 * 目标：把所有盘子移到目标柱。经典递归：先把上面 n-1 个借助
 * 中转柱移走，再移最大盘，最后把 n-1 个搬到目标柱。
 */

export type Peg = 'A' | 'B' | 'C'

export interface Move {
  disk: number
  from: Peg
  to: Peg
}

/** 盘子颜色调色板，索引 = 盘号-1（小盘用暖色，大盘用冷色） */
const PALETTE = [
  '#f87171', '#fbbf24', '#a3e635', '#34d399',
  '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6',
]

export function diskColor(disk: number): string {
  return PALETTE[(disk - 1) % PALETTE.length]
}

/** 递归求解，返回移动步骤序列 [{disk, from, to}] */
export function solveHanoi(n: number, from: Peg, to: Peg, via: Peg): Move[] {
  if (n <= 0) return []
  const moves: Move[] = []
  const rec = (k: number, a: Peg, c: Peg, b: Peg) => {
    if (k === 0) return
    rec(k - 1, a, b, c)
    moves.push({ disk: k, from: a, to: c })
    rec(k - 1, b, c, a)
  }
  rec(n, from, to, via)
  return moves
}

/** 最少移动步数：2^n - 1 */
export function minMoves(n: number): number {
  if (n <= 0) return 0
  return 2 ** n - 1
}

/**
 * 应用前 k 步后，三根柱各自的盘子栈（数组底端为最大盘）。
 * 初始所有盘子都在 'A' 柱。
 */
export function applyMoves(
  n: number,
  steps: Move[],
  k: number,
): Record<Peg, number[]> {
  const pegs: Record<Peg, number[]> = { A: [], B: [], C: [] }
  for (let d = n; d >= 1; d--) pegs.A.push(d)
  const count = Math.max(0, Math.min(k, steps.length))
  for (let i = 0; i < count; i++) {
    const m = steps[i]
    const disk = pegs[m.from].pop()
    if (disk !== undefined) pegs[m.to].push(disk)
  }
  return pegs
}

export const DISK_COUNTS = [3, 4, 5]
