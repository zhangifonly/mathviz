/**
 * 弦振动核心算法（纯函数，便于测试）
 *
 * 两端固定的理想弦，其振动可分解为一系列本征模态（驻波）的叠加。
 * 第 n 个模态：mode_n(x,t) = sin(nπx/L)·cos(nπct/L)
 *   - 空间部分 sin(nπx/L) 决定弦形（有 n-1 个内部节点）
 *   - 时间部分 cos(nπct/L) 决定该模态随时间的整体伸缩
 * 任意初始形状可按正弦级数展开成各模态之和。
 */

export interface Mode {
  n: number       // 模态阶数（1 为基频）
  amp: number     // 振幅系数
}

/** 单个本征模态在 (x,t) 处的位移，L 为弦长，c 为波速 */
export function modeShape(n: number, x: number, t: number, L: number, c: number): number {
  return Math.sin((n * Math.PI * x) / L) * Math.cos((n * Math.PI * c * t) / L)
}

/** 多个模态叠加后在 (x,t) 处的弦位移 */
export function standingWave(modes: Mode[], x: number, t: number, L: number, c: number): number {
  let sum = 0
  for (const m of modes) {
    sum += m.amp * modeShape(m.n, x, t, L, c)
  }
  return sum
}

/** 在 [0,L] 上均匀采样 samples+1 个点，返回时刻 t 的弦形 {x,y} 数组 */
export function sampleString(
  modes: Mode[],
  samples: number,
  t: number,
  L: number,
  c: number,
): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = []
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * L
    pts.push({ x, y: standingWave(modes, x, t, L, c) })
  }
  return pts
}

/** 第 n 阶模态的内部节点位置（不含两端固定点），共 n-1 个 */
export function modeNodes(n: number, L: number): number[] {
  const ns: number[] = []
  for (let k = 1; k < n; k++) {
    ns.push((k * L) / n)
  }
  return ns
}

/**
 * 把任意初始形状 f(x) 分解为前 count 阶正弦级数系数（数值积分）。
 * b_n = (2/L) ∫₀ᴸ f(x) sin(nπx/L) dx
 */
export function decompose(f: (x: number) => number, count: number, L: number, steps = 200): Mode[] {
  const modes: Mode[] = []
  const dx = L / steps
  for (let n = 1; n <= count; n++) {
    let integral = 0
    for (let i = 0; i < steps; i++) {
      const x = (i + 0.5) * dx
      integral += f(x) * Math.sin((n * Math.PI * x) / L) * dx
    }
    modes.push({ n, amp: (2 / L) * integral })
  }
  return modes
}

export const MODES = [1, 2, 3]
