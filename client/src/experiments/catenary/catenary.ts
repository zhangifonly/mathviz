/**
 * 悬链线核心算法（纯函数，便于测试）
 *
 * 一条只受重力、两端固定的柔软链条，自然下垂形成的曲线，
 * 就是悬链线：y = a * cosh(x / a)。
 * 参数 a 越小曲线越"深"，a 越大越平坦。
 * 视觉上它很像抛物线，但两者并不相同。
 */

/** 悬链线在横坐标 x 处的高度（顶点在 x=0，高度为 a） */
export function catenaryY(x: number, a: number): number {
  return a * Math.cosh(x / a)
}

/**
 * 与悬链线在顶点处二阶吻合的抛物线：y = a + x^2 / (2a)。
 * 这来自 cosh 的泰勒展开，用来直观展示"相近但不同"。
 */
export function matchingParabola(x: number, a: number): number {
  return a + (x * x) / (2 * a)
}

/**
 * 悬链线从 -x0 到 x0 的弧长：L = 2a * sinh(x0 / a)。
 * 这是悬链线一个漂亮的闭式结果。
 */
export function arcLength(a: number, x0: number): number {
  return 2 * a * Math.sinh(x0 / a)
}

/**
 * 已知两端点水平半距 halfSpan（即端点在 x=±halfSpan）与链长 length，
 * 数值求解参数 a，使 2a*sinh(halfSpan/a) = length。
 *
 * 令 f(a) = 2a*sinh(halfSpan/a) - length：
 *   a→0+ 时 f→+∞，a→∞ 时 f→2*halfSpan - length，
 * 当 length > 2*halfSpan（链长大于直线距离）时 f 单调递减且有唯一根，
 * 用二分法求解。链长不足则返回 NaN。
 */
export function solveA(halfSpan: number, length: number): number {
  if (!(length > 2 * halfSpan) || halfSpan <= 0) return NaN
  const f = (a: number) => 2 * a * Math.sinh(halfSpan / a) - length
  let lo = 1e-6
  let hi = halfSpan
  // 扩大 hi 直到 f(hi) < 0，保证区间包住根
  while (f(hi) > 0) hi *= 2
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2
    if (f(mid) > 0) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/** 悬链线顶点到端点的下垂量（弧顶与端点的高度差），即 a*(cosh(x0/a)-1) */
export function sag(a: number, x0: number): number {
  return a * (Math.cosh(x0 / a) - 1)
}

/** 可选的参数 a 档位：越小曲线越深，越大越平坦 */
export const A_VALUES = [40, 70, 120]
