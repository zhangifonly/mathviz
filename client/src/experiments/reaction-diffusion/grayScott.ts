/**
 * Gray-Scott 反应扩散模型（纯函数，便于测试）
 *
 * 两种化学物 U、V 在网格上扩散并反应：
 *   U + 2V -> 3V   (V 催化自身，消耗 U)
 *   ∂U/∂t = Du·∇²U − U·V² + f·(1−U)
 *   ∂V/∂t = Dv·∇²V + U·V² − (f+k)·V
 * 不同的 feed(f)/kill(k) 参数会自组织出豹纹、珊瑚、斑马纹等图案。
 */

export interface Field {
  u: Float32Array
  v: Float32Array
  width: number
  height: number
}

export interface GrayScottParams {
  Du: number   // U 扩散率
  Dv: number   // V 扩散率
  feed: number // 补给率 f
  kill: number // 消亡率 k
}

/** 经典图案预设（feed/kill 决定最终形态） */
export const RD_PRESETS: { name: string; label: string; feed: number; kill: number }[] = [
  { name: 'coral', label: '珊瑚生长', feed: 0.0545, kill: 0.062 },
  { name: 'spots', label: '斑点(豹纹)', feed: 0.035, kill: 0.065 },
  { name: 'stripes', label: '条纹(斑马)', feed: 0.022, kill: 0.051 },
  { name: 'maze', label: '迷宫', feed: 0.029, kill: 0.057 },
  { name: 'bubbles', label: '气泡分裂', feed: 0.012, kill: 0.05 },
]

/** 创建初始场：U 全为 1，中心区域注入 V=1 作为种子 */
export function createField(width: number, height: number, seed = 0.25): Field {
  const n = width * height
  const u = new Float32Array(n).fill(1)
  const v = new Float32Array(n).fill(0)
  // 在中心放几个随机方块作为扰动种子
  const cx = Math.floor(width / 2)
  const cy = Math.floor(height / 2)
  const r = Math.floor(Math.min(width, height) * seed * 0.2) + 4
  for (let y = cy - r; y < cy + r; y++) {
    for (let x = cx - r; x < cx + r; x++) {
      if (x < 0 || x >= width || y < 0 || y >= height) continue
      if (Math.random() < 0.5) {
        v[y * width + x] = 1
      }
    }
  }
  return { u, v, width, height }
}

/** 3x3 拉普拉斯卷积（环形边界），权重: 中心-1, 正交0.2, 对角0.05 */
function laplacian(arr: Float32Array, x: number, y: number, w: number, h: number): number {
  const xm = (x - 1 + w) % w, xp = (x + 1) % w
  const ym = (y - 1 + h) % h, yp = (y + 1) % h
  const c = arr[y * w + x]
  const orth = arr[y * w + xm] + arr[y * w + xp] + arr[ym * w + x] + arr[yp * w + x]
  const diag = arr[ym * w + xm] + arr[ym * w + xp] + arr[yp * w + xm] + arr[yp * w + xp]
  return -c + 0.2 * orth + 0.05 * diag
}

/** 推进一个时间步，返回新场（不修改输入）。dt 默认 1 */
export function step(field: Field, p: GrayScottParams, dt = 1): Field {
  const { u, v, width: w, height: h } = field
  const nu = new Float32Array(u.length)
  const nv = new Float32Array(v.length)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      const uvv = u[i] * v[i] * v[i]
      nu[i] = u[i] + (p.Du * laplacian(u, x, y, w, h) - uvv + p.feed * (1 - u[i])) * dt
      nv[i] = v[i] + (p.Dv * laplacian(v, x, y, w, h) + uvv - (p.feed + p.kill) * v[i]) * dt
      // 数值裁剪到 [0,1]，防止发散
      nu[i] = nu[i] < 0 ? 0 : nu[i] > 1 ? 1 : nu[i]
      nv[i] = nv[i] < 0 ? 0 : nv[i] > 1 ? 1 : nv[i]
    }
  }
  return { u: nu, v: nv, width: w, height: h }
}

/** 把 V 浓度映射为 RGBA 像素（写入 ImageData.data），用蓝紫→黄的色带 */
export function renderToImageData(field: Field, data: Uint8ClampedArray) {
  const { v } = field
  for (let i = 0; i < v.length; i++) {
    const t = v[i]
    // 简单色带：低=深蓝，中=青绿，高=亮黄
    const r = Math.floor(255 * Math.min(1, Math.max(0, t * 2 - 0.4)))
    const g = Math.floor(255 * Math.min(1, t * 1.6))
    const b = Math.floor(255 * Math.min(1, Math.max(0, 0.6 - t)))
    const j = i * 4
    data[j] = r
    data[j + 1] = g
    data[j + 2] = b
    data[j + 3] = 255
  }
}
