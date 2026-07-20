/**
 * 二次型核心算法（纯函数，便于测试）
 *
 * 二次型 Q(x,y) = a x^2 + 2b xy + c y^2，对应对称矩阵 M = [[a, b], [b, c]]。
 * 有 Q(v) = v^T M v。矩阵的两个特征值符号决定二次型的类型：
 * 都正=正定(碗形，等高线是椭圆)，都负=负定(倒碗)，一正一负=不定(等高线是双曲线)。
 */

export interface QuadraticForm {
  a: number
  b: number
  c: number
}

export type FormClass =
  | 'positive-definite'
  | 'negative-definite'
  | 'indefinite'
  | 'positive-semidefinite'
  | 'negative-semidefinite'
  | 'zero'

/** 计算 Q(x, y) = a x^2 + 2b xy + c y^2 */
export function evalQuadratic(q: QuadraticForm, x: number, y: number): number {
  return q.a * x * x + 2 * q.b * x * y + q.c * y * y
}

/**
 * 求 2x2 对称矩阵 [[a, b], [b, c]] 的两个特征值。
 * 特征方程 lambda^2 - (a+c) lambda + (ac - b^2) = 0，
 * 判别式 (a-c)^2 + 4 b^2 >= 0 恒非负，故实对称矩阵特征值必为实数。
 * 返回按升序排列的 [lambdaMin, lambdaMax]。
 */
export function eigenvalues2x2(q: QuadraticForm): [number, number] {
  const { a, b, c } = q
  const trace = a + c
  const disc = Math.sqrt((a - c) * (a - c) + 4 * b * b)
  const l1 = (trace - disc) / 2
  const l2 = (trace + disc) / 2
  return [l1, l2]
}

/** 依据两个特征值的符号判定二次型类型 */
export function classify(q: QuadraticForm, eps = 1e-9): FormClass {
  const [lo, hi] = eigenvalues2x2(q)
  const loPos = lo > eps
  const loNeg = lo < -eps
  const hiPos = hi > eps
  const hiNeg = hi < -eps
  if (loPos && hiPos) return 'positive-definite'
  if (loNeg && hiNeg) return 'negative-definite'
  if ((loPos && hiNeg) || (loNeg && hiPos)) return 'indefinite'
  if (hiPos && !loNeg) return 'positive-semidefinite'
  if (loNeg && !hiPos) return 'negative-semidefinite'
  return 'zero'
}

/** 类型对应的中文名与配色 */
export function classInfo(cls: FormClass): { label: string; color: string } {
  const map: Record<FormClass, { label: string; color: string }> = {
    'positive-definite': { label: '正定 · 碗形椭圆', color: '#6366f1' },
    'negative-definite': { label: '负定 · 倒碗椭圆', color: '#ec4899' },
    'indefinite': { label: '不定 · 鞍面双曲线', color: '#f59e0b' },
    'positive-semidefinite': { label: '半正定 · 退化槽', color: '#22d3ee' },
    'negative-semidefinite': { label: '半负定 · 退化脊', color: '#a78bfa' },
    'zero': { label: '零型 · 恒为零', color: '#94a3b8' },
  }
  return map[cls]
}

/** 三个代表性样例：正定、不定、半正定 */
export const SAMPLES: { name: string; form: QuadraticForm }[] = [
  { name: '正定', form: { a: 2, b: 0.5, c: 1 } },
  { name: '不定', form: { a: 1, b: 0, c: -1 } },
  { name: '半正定', form: { a: 1, b: 1, c: 1 } },
]
