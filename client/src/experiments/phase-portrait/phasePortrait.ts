/**
 * 相图分析核心算法（纯函数，便于测试）
 *
 * 研究 2D 线性自治系统 x' = A x（A 为 2x2 矩阵）。
 * 不解析求解，而是通过特征值判断原点这个平衡点的类型，
 * 并用 RK4 数值积分画出若干轨线，直观呈现系统行为。
 */

export type Matrix2 = [number, number, number, number] // [a, b, c, d] 行优先
export type Vec2 = [number, number]

export type EqType = 'node' | 'saddle' | 'focus' | 'center'

export interface Classification {
  trace: number
  det: number
  disc: number // 判别式 trace^2 - 4 det
  type: EqType
  stable: boolean // 是否渐近稳定（实部 < 0）
  detail: string
}

/** 矩阵作用于向量：A x */
export function apply(A: Matrix2, v: Vec2): Vec2 {
  return [A[0] * v[0] + A[1] * v[1], A[2] * v[0] + A[3] * v[1]]
}

/**
 * 分类平衡点：由迹 tr 与行列式 det 判断。
 * det<0 鞍点；det>0 时 disc>0 结点、disc<0 焦点（tr=0 则中心）。
 */
export function classify(A: Matrix2): Classification {
  const trace = A[0] + A[3]
  const det = A[0] * A[3] - A[1] * A[2]
  const disc = trace * trace - 4 * det
  let type: EqType
  let detail: string
  if (det < 0) {
    type = 'saddle'
    detail = '特征值一正一负，鞍点，多数轨线先近后远。'
  } else if (Math.abs(trace) < 1e-9 && disc < 0) {
    type = 'center'
    detail = '特征值为纯虚数，中心，轨线是闭合的椭圆。'
  } else if (disc >= 0) {
    type = 'node'
    detail = trace < 0 ? '两实特征值同号为负，稳定结点。' : '两实特征值同号为正，不稳定结点。'
  } else {
    type = 'focus'
    detail = trace < 0 ? '共轭复特征值实部为负，稳定焦点，轨线螺旋收敛。' : '共轭复特征值实部为正，不稳定焦点，轨线螺旋发散。'
  }
  return { trace, det, disc, type, stable: trace < 0 && det > 0, detail }
}

/** 用四阶龙格库塔积分一条轨线：x' = A x，返回点序列 */
export function trajectory(A: Matrix2, x0: Vec2, steps: number, dt: number): Vec2[] {
  const pts: Vec2[] = [x0]
  let x = x0
  for (let i = 0; i < steps; i++) {
    const k1 = apply(A, x)
    const k2 = apply(A, [x[0] + (dt / 2) * k1[0], x[1] + (dt / 2) * k1[1]])
    const k3 = apply(A, [x[0] + (dt / 2) * k2[0], x[1] + (dt / 2) * k2[1]])
    const k4 = apply(A, [x[0] + dt * k3[0], x[1] + dt * k3[1]])
    x = [
      x[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
      x[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    ]
    if (!isFinite(x[0]) || !isFinite(x[1]) || Math.abs(x[0]) > 1e6 || Math.abs(x[1]) > 1e6) break
    pts.push(x)
  }
  return pts
}

/** 四类典型系统的 A 矩阵，供交互切换 */
export const SYSTEMS: { key: EqType; label: string; A: Matrix2 }[] = [
  { key: 'node', label: '稳定结点', A: [-1, 0, 0, -2] },
  { key: 'saddle', label: '鞍点', A: [1, 0, 0, -1] },
  { key: 'focus', label: '稳定焦点', A: [-0.4, -1, 1, -0.4] },
  { key: 'center', label: '中心', A: [0, -1, 1, 0] },
]
