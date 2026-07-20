/**
 * 拉普拉斯算子核心算法（纯函数，便于测试）
 *
 * 2D 拉普拉斯算子 ∇²f = ∂²f/∂x² + ∂²f/∂y²，用二阶中心差分离散：
 *   ∇²f(i,j) ≈ f(i+1,j)+f(i-1,j)+f(i,j+1)+f(i,j-1) - 4·f(i,j)
 * 这正是「四个邻居之和 减去 中心值的四倍」，也等价于
 *   4·(邻域平均 - 中心值)
 * 因此拉普拉斯度量的是「一点比它周围邻域平均偏低还是偏高」：
 *   ∇²f > 0 表示局部低谷（比邻居低），∇²f < 0 表示局部高峰。
 * 调和函数满足 ∇²f = 0，处处等于邻域平均，没有局部极值。
 */

export type Grid = number[][]

/** 采样函数生成 rows×cols 网格，(x,y) 归一化到 [-1,1] */
export function sampleField(
  fn: (x: number, y: number) => number,
  rows: number,
  cols: number,
): Grid {
  const g: Grid = []
  for (let i = 0; i < rows; i++) {
    const row: number[] = []
    for (let j = 0; j < cols; j++) {
      const x = (j / (cols - 1)) * 2 - 1
      const y = (i / (rows - 1)) * 2 - 1
      row.push(fn(x, y))
    }
    g.push(row)
  }
  return g
}

/** 单点五点模板拉普拉斯：邻居和 - 4·中心（边界用 clamp 复制边缘） */
export function laplacianAt(g: Grid, i: number, j: number): number {
  const rows = g.length
  const cols = g[0].length
  const at = (a: number, b: number) =>
    g[Math.max(0, Math.min(rows - 1, a))][Math.max(0, Math.min(cols - 1, b))]
  return at(i - 1, j) + at(i + 1, j) + at(i, j - 1) + at(i, j + 1) - 4 * g[i][j]
}

/** 对整个网格求拉普拉斯值 */
export function laplacianGrid(g: Grid): Grid {
  const out: Grid = []
  for (let i = 0; i < g.length; i++) {
    const row: number[] = []
    for (let j = 0; j < g[0].length; j++) row.push(laplacianAt(g, i, j))
    out.push(row)
  }
  return out
}

/** 热扩散一步：u += alpha·∇²u（显式欧拉，alpha<0.25 稳定） */
export function diffuseStep(g: Grid, alpha: number): Grid {
  const lap = laplacianGrid(g)
  const out: Grid = []
  for (let i = 0; i < g.length; i++) {
    const row: number[] = []
    for (let j = 0; j < g[0].length; j++) row.push(g[i][j] + alpha * lap[i][j])
    out.push(row)
  }
  return out
}

/** 网格数值范围 [min,max]，供着色归一化 */
export function gridRange(g: Grid): [number, number] {
  let lo = Infinity
  let hi = -Infinity
  for (const row of g) for (const v of row) {
    if (v < lo) lo = v
    if (v > hi) hi = v
  }
  return [lo, hi]
}

export interface FieldDef {
  key: string
  label: string
  fn: (x: number, y: number) => number
}

/** 可选的被作用函数 f(x,y) */
export const FUNCTIONS: FieldDef[] = [
  { key: 'bump', label: '高斯鼓包 e^-(r²)', fn: (x, y) => Math.exp(-4 * (x * x + y * y)) },
  { key: 'saddle', label: '鞍面 x²-y²', fn: (x, y) => x * x - y * y },
  { key: 'harmonic', label: '调和函数 x²-y²+xy', fn: (x, y) => x * x - y * y + x * y },
  { key: 'wave', label: '波纹 sin(3x)cos(3y)', fn: (x, y) => Math.sin(3 * x) * Math.cos(3 * y) },
]
