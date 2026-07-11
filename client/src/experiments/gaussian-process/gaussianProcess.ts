/**
 * 高斯过程回归（纯函数，便于测试）
 *
 * 高斯过程用一族函数上的高斯分布来刻画“对未知函数的信念”。
 * 核函数（这里用 RBF 平方指数核）决定两点函数值的相关性：
 *   k(a,b) = signalVar * exp( -(a-b)^2 / (2 * lengthScale^2) )
 * 观测若干训练点后，通过高斯条件公式得到后验均值与方差，
 * 均值即预测曲线，方差刻画不确定性（离数据越远越不确定）。
 */

export interface KernelOptions {
  /** 长度尺度，越大曲线越平滑 */
  lengthScale: number
  /** 信号方差，控制函数振幅 */
  signalVar: number
}

/** RBF（平方指数）核函数：距离为 0 时取到 signalVar，随距离单调衰减 */
export function rbfKernel(a: number, b: number, opt: KernelOptions): number {
  const d = a - b
  return opt.signalVar * Math.exp(-(d * d) / (2 * opt.lengthScale * opt.lengthScale))
}

/** 由点集与核构造协方差矩阵（对称、对角线为 signalVar） */
export function covarianceMatrix(xs: number[], opt: KernelOptions): number[][] {
  const n = xs.length
  const m: number[][] = []
  for (let i = 0; i < n; i++) {
    m.push([])
    for (let j = 0; j < n; j++) m[i].push(rbfKernel(xs[i], xs[j], opt))
  }
  return m
}

/** 两组点之间的交叉协方差矩阵，形状 rows.length × cols.length */
export function crossCovariance(rows: number[], cols: number[], opt: KernelOptions): number[][] {
  return rows.map((r) => cols.map((c) => rbfKernel(r, c, opt)))
}

/** Cholesky 分解，返回下三角 L 使得 L·Lᵀ = A（A 需对称正定） */
export function cholesky(A: number[][]): number[][] {
  const n = A.length
  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0
      for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k]
      if (i === j) L[i][j] = Math.sqrt(Math.max(1e-12, A[i][i] - sum))
      else L[i][j] = (A[i][j] - sum) / L[j][j]
    }
  }
  return L
}

/** 解下三角方程 L·y = b（前向替换） */
function forwardSolve(L: number[][], b: number[]): number[] {
  const n = L.length
  const y = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    let sum = b[i]
    for (let k = 0; k < i; k++) sum -= L[i][k] * y[k]
    y[i] = sum / L[i][i]
  }
  return y
}

/** 解上三角方程 Lᵀ·x = y（后向替换） */
function backSolve(L: number[][], y: number[]): number[] {
  const n = L.length
  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    let sum = y[i]
    for (let k = i + 1; k < n; k++) sum -= L[k][i] * x[k]
    x[i] = sum / L[i][i]
  }
  return x
}

export interface Posterior {
  /** 各测试点的后验均值（预测曲线） */
  mean: number[]
  /** 各测试点的后验方差（不确定性，非负） */
  variance: number[]
}

/**
 * 计算高斯过程后验：给定训练点 (xTrain,yTrain)，预测 xTest。
 * noise 为观测噪声方差，加在训练协方差对角线上保证数值稳定。
 */
export function gpPosterior(
  xTrain: number[],
  yTrain: number[],
  xTest: number[],
  opt: KernelOptions,
  noise = 1e-6,
): Posterior {
  const n = xTrain.length
  if (n === 0) {
    return {
      mean: xTest.map(() => 0),
      variance: xTest.map(() => opt.signalVar),
    }
  }
  const K = covarianceMatrix(xTrain, opt)
  for (let i = 0; i < n; i++) K[i][i] += noise
  const L = cholesky(K)
  const alpha = backSolve(L, forwardSolve(L, yTrain))
  const Ks = crossCovariance(xTest, xTrain, opt) // test × train
  const mean = Ks.map((row) => row.reduce((s, v, j) => s + v * alpha[j], 0))
  const variance = xTest.map((_, t) => {
    const v = forwardSolve(L, Ks[t]) // 解 L v = k_*
    const reduction = v.reduce((s, vi) => s + vi * vi, 0)
    return Math.max(0, opt.signalVar - reduction)
  })
  return { mean, variance }
}

export interface KernelChoice extends KernelOptions {
  label: string
  note: string
}

/** 可切换的核参数预设 */
export const KERNEL_OPTIONS: KernelChoice[] = [
  { lengthScale: 1.5, signalVar: 1, label: '长度尺度 1.5', note: '平滑，泛化范围大' },
  { lengthScale: 0.6, signalVar: 1, label: '长度尺度 0.6', note: '贴合数据，波动更快' },
  { lengthScale: 3, signalVar: 1.5, label: '长度尺度 3', note: '极平滑，大振幅' },
]
