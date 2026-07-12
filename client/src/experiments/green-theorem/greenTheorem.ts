/**
 * 格林公式（Green's Theorem）纯函数数学内核（无 DOM，便于测试）
 *
 * 格林公式把平面闭曲线 C 上的线积分, 与它围成区域 D 上的二重积分联系起来:
 *   ∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA
 * 其中 (∂Q/∂x - ∂P/∂y) 称为向量场 (P, Q) 的旋度(标量), 记为 curl。
 * 本内核以「圆」作为闭曲线 D=以原点为心、半径 radius 的圆盘, 数值验证公式两边相等。
 */

export interface VectorField {
  id: string
  label: string
  note: string
  /** P(x, y): 向量场的 x 分量 */
  P: (x: number, y: number) => number
  /** Q(x, y): 向量场的 y 分量 */
  Q: (x: number, y: number) => number
  /** 解析旋度 ∂Q/∂x - ∂P/∂y */
  curl: (x: number, y: number) => number
}

export const FIELD_OPTIONS: VectorField[] = [
  {
    id: 'rotation',
    label: '旋转场 (-y, x)',
    note: '旋度恒为 2, 线积分 = 2 倍面积',
    P: (_x, y) => -y,
    Q: (x) => x,
    curl: () => 2,
  },
  {
    id: 'area',
    label: '面积场 (0, x)',
    note: '旋度恒为 1, 线积分 = 区域面积',
    P: () => 0,
    Q: (x) => x,
    curl: () => 1,
  },
  {
    id: 'conservative',
    label: '保守场 (x, y)',
    note: '旋度恒为 0, 沿闭曲线积分为零',
    P: (x) => x,
    Q: (_x, y) => y,
    curl: () => 0,
  },
  {
    id: 'shear',
    label: '剪切场 (y², x²)',
    note: '旋度 = 2x - 2y, 处处变化',
    P: (_x, y) => y * y,
    Q: (x) => x * x,
    curl: (x, y) => 2 * x - 2 * y,
  },
]

/** 按 id 取向量场, 找不到则回退到第一个 */
export function getField(id: string): VectorField {
  return FIELD_OPTIONS.find((f) => f.id === id) ?? FIELD_OPTIONS[0]
}

/**
 * 沿半径 radius 的圆(逆时针)数值计算线积分 ∮(P dx + Q dy)。
 * 圆参数化: x = R cosθ, y = R sinθ, dx = -R sinθ dθ, dy = R cosθ dθ。
 */
export function lineIntegralCircle(field: VectorField, radius: number, segments = 1440): number {
  const dt = (2 * Math.PI) / segments
  let sum = 0
  for (let i = 0; i < segments; i++) {
    const t = (i + 0.5) * dt
    const x = radius * Math.cos(t)
    const y = radius * Math.sin(t)
    const dx = -radius * Math.sin(t)
    const dy = radius * Math.cos(t)
    sum += (field.P(x, y) * dx + field.Q(x, y) * dy) * dt
  }
  return sum
}

/**
 * 在半径 radius 的圆盘上数值计算旋度的二重积分 ∬ curl dA。
 * 采用极坐标网格: dA = r dr dθ。
 */
export function curlIntegralDisk(field: VectorField, radius: number, nr = 400, ntheta = 720): number {
  const dr = radius / nr
  const dth = (2 * Math.PI) / ntheta
  let sum = 0
  for (let i = 0; i < nr; i++) {
    const r = (i + 0.5) * dr
    for (let j = 0; j < ntheta; j++) {
      const th = (j + 0.5) * dth
      sum += field.curl(r * Math.cos(th), r * Math.sin(th)) * r * dr * dth
    }
  }
  return sum
}

/** 圆盘面积(用于对照) */
export function diskArea(radius: number): number {
  return Math.PI * radius * radius
}
