/**
 * 帕斯卡三角与模染色（纯函数，便于测试）
 *
 * 帕斯卡三角的每个数是上方两数之和（二项式系数）。
 * 按 mod n 染色后，会涌现出谢尔宾斯基三角等分形图案。
 */

/** 生成帕斯卡三角的前 rows 行（用 BigInt 避免大数溢出，返回 number 的 mod 余数更实用） */
export function pascalRows(rows: number): number[][] {
  const tri: number[][] = []
  for (let i = 0; i < rows; i++) {
    const row: number[] = [1]
    if (tri[i - 1]) {
      for (let j = 1; j < i; j++) row.push(tri[i - 1][j - 1] + tri[i - 1][j])
      row.push(1)
    }
    tri.push(row)
  }
  return tri
}

/**
 * 生成帕斯卡三角每个元素对 mod 取余的结果。
 * 直接用递推计算余数，避免大数：C(i,j) mod m = (C(i-1,j-1)+C(i-1,j)) mod m
 */
export function pascalMod(rows: number, mod: number): number[][] {
  const tri: number[][] = []
  for (let i = 0; i < rows; i++) {
    const row: number[] = [1 % mod]
    if (tri[i - 1]) {
      for (let j = 1; j < i; j++) row.push((tri[i - 1][j - 1] + tri[i - 1][j]) % mod)
      row.push(1 % mod)
    }
    tri.push(row)
  }
  return tri
}

/** 统计 mod 染色后非零（即不被 mod 整除）的元素个数 */
export function countNonZero(tri: number[][]): number {
  let c = 0
  for (const row of tri) for (const v of row) if (v !== 0) c++
  return c
}

export interface ModOption {
  mod: number
  label: string
  note: string
}

export const MOD_OPTIONS: ModOption[] = [
  { mod: 2, label: 'mod 2', note: '奇偶染色 → 谢尔宾斯基三角' },
  { mod: 3, label: 'mod 3', note: '更精细的自相似图案' },
  { mod: 5, label: 'mod 5', note: '五进制分形结构' },
]
