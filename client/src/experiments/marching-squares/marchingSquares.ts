/**
 * 行进方块（Marching Squares）核心算法（纯函数，便于测试）
 *
 * 给定一张标量场网格，把每个 2x2 单元的 4 个角与阈值比较，
 * 得到 0-15 共 16 种「内外」组合(case)，再查表连出等高线段，
 * 交点由线性插值确定。这样就能从离散网格里提取平滑的等高线。
 */

export type Field = number[][]

export interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** 单元 4 条边：0=上(TL-TR) 1=右(TR-BR) 2=下(BR-BL) 3=左(BL-TL) */
const EDGE_CORNERS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0]]

/** 16 种 case 对应要连接的边对（saddle 5/10 有两段） */
export const EDGE_TABLE: number[][][] = [
  [], [[3, 2]], [[1, 2]], [[3, 1]],
  [[0, 1]], [[0, 1], [3, 2]], [[0, 2]], [[0, 3]],
  [[0, 3]], [[0, 2]], [[0, 3], [1, 2]], [[0, 1]],
  [[3, 1]], [[1, 2]], [[3, 2]], [],
]

/** 生成两座高斯峰叠加而成的标量场，值域约 0-1.3 */
export function makeField(cols: number, rows: number): Field {
  const peaks = [
    { cx: 0.32, cy: 0.36, a: 1, s: 0.17 },
    { cx: 0.68, cy: 0.64, a: 0.9, s: 0.2 },
  ]
  const field: Field = []
  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      const nx = c / (cols - 1)
      const ny = r / (rows - 1)
      let v = 0
      for (const p of peaks) {
        const d = (nx - p.cx) ** 2 + (ny - p.cy) ** 2
        v += p.a * Math.exp(-d / (2 * p.s * p.s))
      }
      row.push(v)
    }
    field.push(row)
  }
  return field
}

/** 计算单元的 case 索引：bit3=TL bit2=TR bit1=BR bit0=BL（>=阈值记 1） */
export function cellCase(tl: number, tr: number, br: number, bl: number, t: number): number {
  return (
    (tl >= t ? 8 : 0) | (tr >= t ? 4 : 0) | (br >= t ? 2 : 0) | (bl >= t ? 1 : 0)
  )
}

/** 边 e 在阈值处的插值交点（网格分数坐标 col,row） */
function edgePoint(e: number, c: number, r: number, vals: number[], t: number): [number, number] {
  const [a, b] = EDGE_CORNERS[e]
  // 角坐标：0=TL 1=TR 2=BR 3=BL
  const pos: [number, number][] = [
    [c, r], [c + 1, r], [c + 1, r + 1], [c, r + 1],
  ]
  const va = vals[a]
  const vb = vals[b]
  const f = Math.abs(vb - va) < 1e-9 ? 0.5 : (t - va) / (vb - va)
  return [pos[a][0] + f * (pos[b][0] - pos[a][0]), pos[a][1] + f * (pos[b][1] - pos[a][1])]
}

/** 提取等高线：遍历每个单元查表连段，返回线段列表（网格坐标） */
export function marchingSquares(field: Field, threshold: number): Segment[] {
  const rows = field.length
  const cols = field[0]?.length ?? 0
  const segs: Segment[] = []
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const tl = field[r][c]
      const tr = field[r][c + 1]
      const br = field[r + 1][c + 1]
      const bl = field[r + 1][c]
      const idx = cellCase(tl, tr, br, bl, threshold)
      const vals = [tl, tr, br, bl]
      for (const [e1, e2] of EDGE_TABLE[idx]) {
        const [x1, y1] = edgePoint(e1, c, r, vals, threshold)
        const [x2, y2] = edgePoint(e2, c, r, vals, threshold)
        segs.push({ x1, y1, x2, y2 })
      }
    }
  }
  return segs
}

export const THRESHOLDS = [0.25, 0.45, 0.65, 0.85]
