/**
 * L-系统（Lindenmayer System）核心算法（纯函数，便于测试）
 *
 * 用一套重写规则反复替换字符串，再用海龟作图(turtle)解释，
 * 能长出蕨类、树木、科赫曲线等自相似的植物形态。
 */

export interface LSystemRule {
  axiom: string // 公理（初始字符串）
  rules: Record<string, string> // 重写规则
  angle: number // 转角（度）
  iterations: number // 推荐迭代次数
}

/** 对公理迭代展开 n 次 */
export function expand(axiom: string, rules: Record<string, string>, n: number): string {
  let s = axiom
  for (let i = 0; i < n; i++) {
    let next = ''
    for (const ch of s) next += rules[ch] ?? ch
    s = next
  }
  return s
}

export interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
  depth: number
}

interface TurtleState {
  x: number
  y: number
  angle: number
}

/**
 * 海龟作图：解释 L-系统字符串生成线段集合。
 * 指令：F/G 前进画线；+ 左转；- 右转；[ 入栈；] 出栈。
 * @param str 展开后的字符串
 * @param angleDeg 转角（度）
 * @param step 每步长度
 * @param startAngle 起始朝向（度，默认 90 向上）
 */
export function turtle(
  str: string,
  angleDeg: number,
  step = 5,
  startAngle = 90,
): Segment[] {
  const segs: Segment[] = []
  const stack: TurtleState[] = []
  let { x, y, angle } = { x: 0, y: 0, angle: startAngle }
  const rad = (d: number) => (d * Math.PI) / 180
  let depth = 0
  for (const ch of str) {
    if (ch === 'F' || ch === 'G') {
      const nx = x + step * Math.cos(rad(angle))
      const ny = y + step * Math.sin(rad(angle))
      segs.push({ x1: x, y1: y, x2: nx, y2: ny, depth })
      x = nx
      y = ny
    } else if (ch === '+') {
      angle += angleDeg
    } else if (ch === '-') {
      angle -= angleDeg
    } else if (ch === '[') {
      stack.push({ x, y, angle })
      depth++
    } else if (ch === ']') {
      const s = stack.pop()
      if (s) {
        x = s.x
        y = s.y
        angle = s.angle
      }
      depth = Math.max(0, depth - 1)
    }
  }
  return segs
}

export const PRESETS: Record<string, { label: string; sys: LSystemRule }> = {
  plant: {
    label: '分形植物',
    sys: { axiom: 'X', rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' }, angle: 25, iterations: 5 },
  },
  koch: {
    label: '科赫曲线',
    sys: { axiom: 'F', rules: { F: 'F+F-F-F+F' }, angle: 90, iterations: 4 },
  },
  sierpinski: {
    label: '谢尔宾斯基',
    sys: { axiom: 'F-G-G', rules: { F: 'F-G+F+G-F', G: 'GG' }, angle: 120, iterations: 5 },
  },
  dragon: {
    label: '龙形曲线',
    sys: { axiom: 'FX', rules: { X: 'X+YF+', Y: '-FX-Y' }, angle: 90, iterations: 11 },
  },
}

export type PresetKey = keyof typeof PRESETS
