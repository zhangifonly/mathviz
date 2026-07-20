/**
 * 帐篷映射核心算法（纯函数，便于测试）
 *
 * 帐篷映射是最简单的一维混沌系统之一：
 *   tent(x, mu) = mu * x              当 x < 0.5
 *   tent(x, mu) = mu * (1 - x)        当 x >= 0.5
 * 图像形如一顶帐篷，参数 mu 控制帐篷的高度（斜率）。
 * 当 mu = 2 时系统处于满混沌，把 [0,1] 均匀拉伸再折叠。
 */

/** 帐篷映射单步迭代，x 属于 [0,1]，mu 属于 [0,2] */
export function tent(x: number, mu: number): number {
  return x < 0.5 ? mu * x : mu * (1 - x)
}

/** 从起点 x0 迭代 n 步，返回长度 n+1 的序列（含起点） */
export function iterate(x0: number, mu: number, n: number): number[] {
  const seq: number[] = [x0]
  let x = x0
  for (let i = 0; i < n; i++) {
    x = tent(x, mu)
    seq.push(x)
  }
  return seq
}

/**
 * 构造蛛网图折线的顶点序列。
 * 从 (x0, 0) 出发，反复在曲线 y=tent(x) 与对角线 y=x 之间弹跳，
 * 得到点列 [(x0,0),(x0,f0),(f0,f0),(f0,f1),(f1,f1),...]。
 */
export function cobwebPath(x0: number, mu: number, n: number): [number, number][] {
  const pts: [number, number][] = [[x0, 0]]
  let x = x0
  for (let i = 0; i < n; i++) {
    const y = tent(x, mu)
    pts.push([x, y]) // 竖直到曲线
    pts.push([y, y]) // 水平到对角线
    x = y
  }
  return pts
}

/** 常用 mu 取值：1.5 周期/收敛，2 满混沌 */
export const MU_VALUES = [1.5, 2]
