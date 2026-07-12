/**
 * 双摆混沌 - 核心物理（纯函数，便于测试，无任何 DOM 依赖）
 *
 * 双摆由两根无质量刚性杆和两个质点组成：第一根杆固定在支点，
 * 第二根杆挂在第一个质点下方。系统只有两个自由度（两个摆角），
 * 却表现出对初值极端敏感的确定性混沌。
 *
 * 采用拉格朗日力学推导的标准运动方程，配合四阶龙格库塔（RK4）积分，
 * 能长时间较好地保持总能量守恒。
 */

/** 系统瞬时状态：两摆角与两角速度（弧度 / 弧度每秒） */
export interface PendulumState {
  th1: number // 第一摆角（竖直向下为 0）
  th2: number // 第二摆角
  w1: number // 第一角速度
  w2: number // 第二角速度
}

/** 物理参数：两段杆长、两质点质量、重力加速度 */
export interface PendulumParams {
  l1: number
  l2: number
  m1: number
  m2: number
  g: number
}

export const DEFAULT_PARAMS: PendulumParams = { l1: 1, l2: 1, m1: 1, m2: 1, g: 9.81 }

/**
 * 计算状态对时间的导数（即 th1'、th2'、w1'、w2'）。
 * 角加速度来自双摆的解析运动方程。
 */
export function derivatives(s: PendulumState, p: PendulumParams): PendulumState {
  const { th1, th2, w1, w2 } = s
  const { l1, l2, m1, m2, g } = p
  const d = th1 - th2
  const cosD = Math.cos(d)
  const sinD = Math.sin(d)
  // 公共分母，随两摆角差变化
  const den = 2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2)

  const num1 =
    -g * (2 * m1 + m2) * Math.sin(th1) -
    m2 * g * Math.sin(th1 - 2 * th2) -
    2 * sinD * m2 * (w2 * w2 * l2 + w1 * w1 * l1 * cosD)
  const a1 = num1 / (l1 * den)

  const num2 =
    2 *
    sinD *
    (w1 * w1 * l1 * (m1 + m2) +
      g * (m1 + m2) * Math.cos(th1) +
      w2 * w2 * l2 * m2 * cosD)
  const a2 = num2 / (l2 * den)

  return { th1: w1, th2: w2, w1: a1, w2: a2 }
}

/** 状态线性组合的小工具（用于 RK4 中间量） */
function add(s: PendulumState, k: PendulumState, h: number): PendulumState {
  return {
    th1: s.th1 + k.th1 * h,
    th2: s.th2 + k.th2 * h,
    w1: s.w1 + k.w1 * h,
    w2: s.w2 + k.w2 * h,
  }
}

/** 用四阶龙格库塔推进一个时间步 dt，返回新状态（不修改输入） */
export function rk4Step(s: PendulumState, p: PendulumParams, dt: number): PendulumState {
  const k1 = derivatives(s, p)
  const k2 = derivatives(add(s, k1, dt / 2), p)
  const k3 = derivatives(add(s, k2, dt / 2), p)
  const k4 = derivatives(add(s, k3, dt), p)
  return {
    th1: s.th1 + (dt / 6) * (k1.th1 + 2 * k2.th1 + 2 * k3.th1 + k4.th1),
    th2: s.th2 + (dt / 6) * (k1.th2 + 2 * k2.th2 + 2 * k3.th2 + k4.th2),
    w1: s.w1 + (dt / 6) * (k1.w1 + 2 * k2.w1 + 2 * k3.w1 + k4.w1),
    w2: s.w2 + (dt / 6) * (k1.w2 + 2 * k2.w2 + 2 * k3.w2 + k4.w2),
  }
}

/** 两个质点的笛卡尔坐标（支点在原点，y 向下为正） */
export interface Positions {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** 由摆角与杆长换算两质点位置 */
export function positions(s: PendulumState, p: PendulumParams): Positions {
  const x1 = p.l1 * Math.sin(s.th1)
  const y1 = p.l1 * Math.cos(s.th1)
  const x2 = x1 + p.l2 * Math.sin(s.th2)
  const y2 = y1 + p.l2 * Math.cos(s.th2)
  return { x1, y1, x2, y2 }
}

/**
 * 系统总能量（动能 + 势能），用于验证积分器守恒性。
 * 势能以支点为零势能面，质点越低势能越小（取向下为正 y，故用 -y）。
 */
export function totalEnergy(s: PendulumState, p: PendulumParams): number {
  const { th1, th2, w1, w2 } = s
  const { l1, l2, m1, m2, g } = p
  // 两质点速度分量
  const v1x = l1 * w1 * Math.cos(th1)
  const v1y = -l1 * w1 * Math.sin(th1)
  const v2x = v1x + l2 * w2 * Math.cos(th2)
  const v2y = v1y - l2 * w2 * Math.sin(th2)
  const ke =
    0.5 * m1 * (v1x * v1x + v1y * v1y) +
    0.5 * m2 * (v2x * v2x + v2y * v2y)
  const y1 = -l1 * Math.cos(th1)
  const y2 = y1 - l2 * Math.cos(th2)
  const pe = m1 * g * y1 + m2 * g * y2
  return ke + pe
}

/** 预设初始状态选项，供 UI 与讲解切换 */
export interface PresetOption {
  id: string
  label: string
  note: string
  state: PendulumState
}

const D2R = Math.PI / 180

export const PRESET_OPTIONS: PresetOption[] = [
  {
    id: 'gentle',
    label: '温和摆动',
    note: '小角度，近似规则的准周期运动',
    state: { th1: 20 * D2R, th2: 25 * D2R, w1: 0, w2: 0 },
  },
  {
    id: 'chaotic',
    label: '典型混沌',
    note: '大角度释放，轨迹杂乱不可预测',
    state: { th1: 120 * D2R, th2: 120 * D2R, w1: 0, w2: 0 },
  },
  {
    id: 'flip',
    label: '翻转狂舞',
    note: '接近水平释放，下摆频繁翻越顶点',
    state: { th1: 170 * D2R, th2: 170 * D2R, w1: 0, w2: 0 },
  },
]

