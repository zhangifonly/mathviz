/**
 * 卡尔曼滤波（一维标量，纯函数，便于测试）
 *
 * 卡尔曼滤波把「不准的预测」和「带噪声的测量」按各自的不确定度加权融合，
 * 得到方差最小的最优估计。核心是两步：
 *   预测：x_pred = x, P_pred = P + Q     （随机游走模型，过程噪声 Q）
 *   更新：K = P_pred / (P_pred + R)       （卡尔曼增益）
 *         x = x_pred + K * (z - x_pred)   （用测量修正预测）
 *         P = (1 - K) * P_pred            （融合后方差必然变小）
 */

/** 滤波器状态：估计值 x 与其方差 P */
export interface KalmanState {
  x: number
  P: number
}

/** 一次完整迭代的中间量与结果 */
export interface KalmanStep {
  z: number // 本次测量
  xPred: number // 预测值
  PPred: number // 预测方差
  K: number // 卡尔曼增益
  x: number // 融合后估计
  P: number // 融合后方差
}

/** 预测步：随机游走模型，方差随过程噪声 Q 增大 */
export function kalmanPredict(state: KalmanState, Q: number): KalmanState {
  return { x: state.x, P: state.P + Q }
}

/**
 * 更新步：用测量 z（测量噪声方差 R）修正预测。
 * 卡尔曼增益 K 落在 0 到 1 之间：R 越小越信测量，Q 越大越信测量。
 */
export function kalmanUpdate(
  pred: KalmanState,
  z: number,
  R: number,
): KalmanStep {
  const K = pred.P / (pred.P + R)
  const x = pred.x + K * (z - pred.x)
  const P = (1 - K) * pred.P
  return { z, xPred: pred.x, PPred: pred.P, K, x, P }
}

/** 预测 + 更新，合成一步 */
export function kalmanStep(
  state: KalmanState,
  z: number,
  Q: number,
  R: number,
): KalmanStep {
  return kalmanUpdate(kalmanPredict(state, Q), z, R)
}

/** 对一串测量顺序跑完整个滤波，返回每一步 */
export function runKalman(
  measurements: number[],
  init: KalmanState,
  Q: number,
  R: number,
): KalmanStep[] {
  const steps: KalmanStep[] = []
  let state = init
  for (const z of measurements) {
    const step = kalmanStep(state, z, Q, R)
    steps.push(step)
    state = { x: step.x, P: step.P }
  }
  return steps
}

/** Mulberry32 确定性随机数发生器（0 到 1） */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Box-Muller 生成标准正态样本，乘以标准差、加均值 */
export function gaussian(rng: () => number, mean: number, std: number): number {
  const u1 = Math.max(rng(), 1e-12)
  const u2 = rng()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + std * z
}

/** 一个演示数据集：真值曲线、带噪测量、以及滤波结果 */
export interface KalmanDataset {
  truth: number[]
  measurements: number[]
  steps: KalmanStep[]
  Q: number
  R: number
}

/**
 * 生成一段真值信号（正弦漂移）并叠加高斯测量噪声，然后跑卡尔曼滤波。
 * 用固定种子保证每次绘制一致、测试可复现。
 */
export function generateDataset(
  n: number,
  Q: number,
  R: number,
  seed = 12345,
): KalmanDataset {
  const rng = makeRng(seed)
  const truth: number[] = []
  const measurements: number[] = []
  const measStd = Math.sqrt(R)
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2
    const v = 3 * Math.sin(t) + 0.5 * t
    truth.push(v)
    measurements.push(gaussian(rng, v, measStd))
  }
  const init: KalmanState = { x: measurements[0] ?? 0, P: 1 }
  const steps = runKalman(measurements, init, Q, R)
  return { truth, measurements, steps, Q, R }
}

/** 一档预设参数（过程噪声 Q 与测量噪声 R 的搭配） */
export interface NoiseOption {
  id: string
  label: string
  Q: number
  R: number
  note: string
}

export const NOISE_OPTIONS: NoiseOption[] = [
  { id: 'trust-model', label: '信任模型', Q: 0.001, R: 1, note: '过程噪声小，估计平滑但反应慢' },
  { id: 'balanced', label: '均衡', Q: 0.02, R: 1, note: '预测与测量权衡，跟随适中' },
  { id: 'trust-measure', label: '信任测量', Q: 0.5, R: 1, note: '过程噪声大，紧跟测量但抖动' },
]
