/**
 * 卡特兰数核心算法（纯函数，便于测试）
 *
 * 卡特兰数 C(n) 是组合数学里最著名的数列之一，它同时数着
 * 合法括号序列、二叉树形态、凸多边形三角剖分等许多看似无关的对象。
 * 递推式：C(0)=1, C(n+1)=Σ_{i=0..n} C(i)·C(n-i)
 * 闭式：  C(n) = C(2n,n)/(n+1)
 */

/** 用卷积递推计算前 n+1 项卡特兰数 C(0..n) */
export function catalanList(n: number): number[] {
  const c = [1]
  for (let k = 0; k < n; k++) {
    let sum = 0
    for (let i = 0; i <= k; i++) sum += c[i] * c[k - i]
    c.push(sum)
  }
  return c
}

/** 第 n 个卡特兰数 C(n) */
export function catalan(n: number): number {
  return catalanList(n)[n]
}

/**
 * 生成 n 对合法括号的全部序列（字典序）。
 * 数量恰好等于 C(n)。
 */
export function validParentheses(n: number): string[] {
  const out: string[] = []
  const build = (s: string, open: number, close: number) => {
    if (s.length === 2 * n) {
      out.push(s)
      return
    }
    if (open < n) build(s + '(', open + 1, close)
    if (close < open) build(s + ')', open, close + 1)
  }
  build('', 0, 0)
  return out
}

/** 检验一个括号串是否合法（配对且不越界） */
export function isBalanced(s: string): boolean {
  let bal = 0
  for (const ch of s) {
    bal += ch === '(' ? 1 : -1
    if (bal < 0) return false
  }
  return bal === 0
}

/** 凸 m 边形的三角剖分数 = C(m-2)（m>=3） */
export function triangulationCount(m: number): number {
  if (m < 3) return 0
  return catalan(m - 2)
}

/** 交互可选的 n 值 */
export const NS = [3, 4, 5]
