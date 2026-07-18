/**
 * Stern-Brocot 树核心算法（纯函数，便于测试）
 *
 * 在 0/1 与 1/0 两个"边界"之间，用中位数(mediant)递归生成分数：
 *   mediant(a/b, c/d) = (a+c)/(b+d)
 * 由此长出一棵二叉树，每个正既约分数恰好出现一次，
 * 从根到某节点的左右路径，正好对应该分数的连分数展开。
 */

export interface Frac {
  n: number // 分子
  d: number // 分母
}

export interface TreeNode {
  frac: Frac
  left: TreeNode | null
  right: TreeNode | null
}

/** 最大公约数（辗转相除） */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

/** 两个分数的中位数（分子相加、分母相加） */
export function mediant(a: Frac, b: Frac): Frac {
  return { n: a.n + b.n, d: a.d + b.d }
}

/** 分数是否既约（分子分母互质，含 1/0、0/1 边界） */
export function isReduced(f: Frac): boolean {
  return gcd(f.n, f.d) === 1
}

/**
 * 生成 depth 层的 Stern-Brocot 树（根为第 1 层，返回根节点）。
 * 每个节点是它左右边界的中位数；边界初始为 0/1 与 1/0。
 */
export function buildTree(depth: number): TreeNode | null {
  const build = (L: Frac, R: Frac, d: number): TreeNode | null => {
    if (d <= 0) return null
    const m = mediant(L, R)
    return {
      frac: m,
      left: build(L, m, d - 1),
      right: build(m, R, d - 1),
    }
  }
  return build({ n: 0, d: 1 }, { n: 1, d: 0 }, depth)
}

/** 中序遍历收集所有节点分数（从小到大） */
export function flatten(node: TreeNode | null): Frac[] {
  if (!node) return []
  return [...flatten(node.left), node.frac, ...flatten(node.right)]
}

/** depth 层满二叉树的节点总数 = 2^depth - 1 */
export function countNodes(depth: number): number {
  return Math.pow(2, depth) - 1
}

/**
 * 正分数 n/d 的连分数展开系数 [a0; a1, a2, ...]（辗转相除）。
 * 例如 7/3 -> [2, 3]，因为 7/3 = 2 + 1/3。
 */
export function continuedFraction(n: number, d: number): number[] {
  const out: number[] = []
  let a = n
  let b = d
  while (b !== 0) {
    out.push(Math.floor(a / b))
    ;[a, b] = [b, a - Math.floor(a / b) * b]
  }
  return out
}

/** 从根出发的左右路径('L'|'R')走到的分数（L 走左边界、R 走右边界） */
export function pathToFrac(path: string): Frac {
  let L: Frac = { n: 0, d: 1 }
  let R: Frac = { n: 1, d: 0 }
  let m = mediant(L, R)
  for (const step of path) {
    if (step === 'L') R = m
    else L = m
    m = mediant(L, R)
  }
  return m
}

/** 可选的树深度 */
export const DEPTHS = [3, 4]
