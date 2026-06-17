/**
 * 拓扑曲面参数方程（纯函数，便于测试）
 *
 * 生成 3D 网格点，供 Plotly surface/mesh 渲染。
 * - 莫比乌斯环：单侧曲面，沿中线走一圈会翻到"另一面"
 * - 克莱因瓶：无边界单侧闭曲面（4维物体在3维的浸入）
 * - 环面：作为"双侧曲面"对比
 */

export interface Surface {
  x: number[][]
  y: number[][]
  z: number[][]
}

/** 生成 (uSteps+1) × (vSteps+1) 的网格点 */
function buildGrid(
  uSteps: number,
  vSteps: number,
  uRange: [number, number],
  vRange: [number, number],
  fn: (u: number, v: number) => [number, number, number],
): Surface {
  const x: number[][] = []
  const y: number[][] = []
  const z: number[][] = []
  for (let i = 0; i <= uSteps; i++) {
    const u = uRange[0] + (uRange[1] - uRange[0]) * (i / uSteps)
    const rx: number[] = []
    const ry: number[] = []
    const rz: number[] = []
    for (let j = 0; j <= vSteps; j++) {
      const v = vRange[0] + (vRange[1] - vRange[0]) * (j / vSteps)
      const [px, py, pz] = fn(u, v)
      rx.push(px)
      ry.push(py)
      rz.push(pz)
    }
    x.push(rx)
    y.push(ry)
    z.push(rz)
  }
  return { x, y, z }
}

/** 莫比乌斯环：u∈[0,2π] 绕一圈，v∈[-w,w] 横跨带宽，半带宽扭转 u/2 */
export function mobius(uSteps = 120, vSteps = 20, width = 0.4): Surface {
  return buildGrid(uSteps, vSteps, [0, 2 * Math.PI], [-width, width], (u, v) => {
    const c = 1 + (v / 2) * Math.cos(u / 2)
    const x = c * Math.cos(u)
    const y = c * Math.sin(u)
    const z = (v / 2) * Math.sin(u / 2)
    return [x, y, z]
  })
}

/** 克莱因瓶（"8字"浸入形式），u,v∈[0,2π] */
export function kleinBottle(uSteps = 120, vSteps = 60, r = 2): Surface {
  return buildGrid(uSteps, vSteps, [0, 2 * Math.PI], [0, 2 * Math.PI], (u, v) => {
    const cv = Math.cos(v)
    const sv = Math.sin(v)
    const cu = Math.cos(u)
    const su = Math.sin(u)
    const t = u / 2
    const x = (r + cv * Math.sin(t) - sv * Math.sin(2 * t)) * cu
    const y = (r + cv * Math.sin(t) - sv * Math.sin(2 * t)) * su
    const z = cv * Math.cos(t) + sv * Math.cos(2 * t)
    return [x, y, z]
  })
}

/** 环面（双侧曲面对比），R 主半径 r 管半径 */
export function torus(uSteps = 80, vSteps = 40, R = 1, r = 0.4): Surface {
  return buildGrid(uSteps, vSteps, [0, 2 * Math.PI], [0, 2 * Math.PI], (u, v) => {
    const x = (R + r * Math.cos(v)) * Math.cos(u)
    const y = (R + r * Math.cos(v)) * Math.sin(u)
    const z = r * Math.sin(v)
    return [x, y, z]
  })
}

/** 沿莫比乌斯中线行走的蚂蚁位置（演示单侧性）：t∈[0,1] 走的比例 */
export function antOnMobius(t: number, side = 1, width = 0.4): [number, number, number] {
  const u = t * 4 * Math.PI // 走两圈才回到原位（单侧性的体现）
  const v = side * width * 0.7
  const c = 1 + (v / 2) * Math.cos(u / 2)
  return [c * Math.cos(u), c * Math.sin(u), (v / 2) * Math.sin(u / 2)]
}

export type SurfaceKind = 'mobius' | 'klein' | 'torus'

export const SURFACE_INFO: { kind: SurfaceKind; label: string; sided: string }[] = [
  { kind: 'mobius', label: '莫比乌斯环', sided: '单侧 · 1条边' },
  { kind: 'klein', label: '克莱因瓶', sided: '单侧 · 无边界' },
  { kind: 'torus', label: '环面(对比)', sided: '双侧 · 无边界' },
]

export function buildSurface(kind: SurfaceKind): Surface {
  if (kind === 'klein') return kleinBottle()
  if (kind === 'torus') return torus()
  return mobius()
}
