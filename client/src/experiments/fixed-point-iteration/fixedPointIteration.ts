/**
 * 不动点迭代核心算法（纯函数，便于测试）
 *
 * 反复代入 x_{n+1} = g(x_n)，若收敛则极限满足 g(x*) = x*，
 * 即 x* 是 g 的不动点。收敛的充分条件是在不动点附近 |g'(x)| < 1。
 */

export interface IterFunc {
  key: string
  label: string
  g: (x: number) => number
  x0: number
  fixed: number       // 理论不动点（用于标注）
  converges: boolean  // 该起点下是否收敛
}

/** 迭代 steps 次，返回长度 steps+1 的序列 [x0, x1, ...] */
export function iterate(
  g: (x: number) => number,
  x0: number,
  steps: number,
): number[] {
  const seq: number[] = [x0]
  let x = x0
  for (let i = 0; i < steps; i++) {
    x = g(x)
    if (!Number.isFinite(x)) {
      seq.push(x)
      break
    }
    seq.push(x)
  }
  return seq
}

/** 数值估计 g 在 x 处的导数（中心差分），用于判断收敛 */
export function derivative(g: (x: number) => number, x: number, h = 1e-6): number {
  return (g(x + h) - g(x - h)) / (2 * h)
}

/** 判断在不动点附近是否满足收敛条件 |g'(x*)| < 1 */
export function isContractive(g: (x: number) => number, xStar: number): boolean {
  return Math.abs(derivative(g, xStar)) < 1
}

/**
 * 一组示例函数：包含收敛与发散的经典例子。
 * cos 收敛到 Dottie 数约 0.739；半分收敛到 2；平方在 (1,∞) 发散。
 */
export const FUNCTIONS: IterFunc[] = [
  {
    key: 'cos',
    label: 'g(x)=cos x  收敛',
    g: (x) => Math.cos(x),
    x0: 1,
    fixed: 0.7390851332,
    converges: true,
  },
  {
    key: 'half',
    label: 'g(x)=(x+2)/2  收敛',
    g: (x) => (x + 2) / 2,
    x0: 5,
    fixed: 2,
    converges: true,
  },
  {
    key: 'sqrt',
    label: 'g(x)=√(x+1)  收敛(黄金比)',
    g: (x) => Math.sqrt(x + 1),
    x0: 0.2,
    fixed: 1.6180339887,
    converges: true,
  },
  {
    key: 'square',
    label: 'g(x)=x²  发散',
    g: (x) => x * x,
    x0: 1.2,
    fixed: 1,
    converges: false,
  },
]

/** 按 key 查函数 */
export function findFunc(key: string): IterFunc {
  return FUNCTIONS.find((f) => f.key === key) ?? FUNCTIONS[0]
}
