/**
 * 约瑟夫问题核心算法（纯函数，便于测试）
 *
 * n 个人围成一圈，从第 1 个人开始报数，每数到第 k 个人就让其出局，
 * 然后从下一个人继续报数，直到只剩一人。该幸存者的位置即为所求。
 *
 * 递推公式（0 基编号）：J(1,k)=0, J(n,k)=(J(n-1,k)+k)%n。
 * 对外返回 1 基位置，更符合直觉。
 */

/** 计算幸存者位置（1 基编号），使用递推公式 J(n,k)=(J(n-1,k)+k)%n */
export function josephusSurvivor(n: number, k: number): number {
  if (n < 1 || k < 1) return 0
  let r = 0 // J(1,k)=0
  for (let i = 2; i <= n; i++) {
    r = (r + k) % i
  }
  return r + 1 // 转成 1 基
}

/**
 * 返回完整出局顺序（1 基编号数组），最后一个元素为幸存者。
 * 用环形链表思想的数组模拟：真实按 k 报数逐个剔除。
 */
export function josephusOrder(n: number, k: number): number[] {
  const order: number[] = []
  if (n < 1 || k < 1) return order
  const alive: number[] = []
  for (let i = 1; i <= n; i++) alive.push(i)
  let idx = 0
  while (alive.length > 0) {
    idx = (idx + k - 1) % alive.length
    order.push(alive[idx])
    alive.splice(idx, 1)
    // 删除后 idx 已指向下一个待报数者，无需前移
  }
  return order
}

/** 出局序列去掉最后一人即为出局者，最后一人是幸存者 */
export function josephusEliminated(n: number, k: number): number[] {
  const order = josephusOrder(n, k)
  return order.slice(0, Math.max(0, order.length - 1))
}

export const SAMPLES: { n: number; k: number }[] = [
  { n: 7, k: 3 },
  { n: 12, k: 2 },
  { n: 20, k: 5 },
]
