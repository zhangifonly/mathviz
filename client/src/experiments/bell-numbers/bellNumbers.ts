/**
 * 贝尔数核心算法（纯函数，便于测试）
 *
 * 贝尔数 B(n) 表示把 n 个元素的集合划分成若干非空子集的所有方式总数。
 * 我们用「贝尔三角」（又称 Aitken 阵列 / Peirce 三角）递推生成：
 *   - 第 0 行只有一个 1；
 *   - 每一行的首元素 = 上一行的末元素；
 *   - 其余每个元素 = 它左边的元素 + 左上方的元素。
 * 于是第 n 行的首元素就是 B(n)，每一行的末元素则是 B(n+1)。
 */

export const MAX_N = 12

/**
 * 生成贝尔三角的前 n+1 行（行 0 到行 n），共 n+1 行。
 * 返回二维数组 tri，tri[i] 长度为 i+1。
 */
export function bellTriangle(n: number): number[][] {
  const rows = Math.max(0, Math.min(n, MAX_N))
  const tri: number[][] = [[1]]
  for (let i = 1; i <= rows; i++) {
    const prev = tri[i - 1]
    const row: number[] = [prev[prev.length - 1]]
    for (let j = 1; j <= i; j++) {
      row.push(row[j - 1] + prev[j - 1])
    }
    tri.push(row)
  }
  return tri
}

/** 第 n 个贝尔数 B(n) = 贝尔三角第 n 行的首元素 */
export function bellNumber(n: number): number {
  const tri = bellTriangle(n)
  return tri[tri.length - 1][0]
}

/** 返回 B(0)..B(n) 的贝尔数序列 */
export function bellSequence(n: number): number[] {
  const tri = bellTriangle(n)
  return tri.map((row) => row[0])
}

/** 可选的展示行数档位（类似模板的 SITE_COUNTS） */
export const ROW_COUNTS = [5, 8, 12]
