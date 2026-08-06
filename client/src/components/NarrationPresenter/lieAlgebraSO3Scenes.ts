/**
 * 矩阵指数与李代数 so(3) 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：omega 定切空间元素，t 走单参数子群，
 * mode 在「指数映射 / 闭式对级数 / 李括号」之间切，terms 控制级数项数。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultLieAlgebraSO3State: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

const Z = [0, 0, 1]
const DIAG = [0.577, 0.577, 0.577]
const TILT = [1.2, -0.6, 0.35]

export const lieAlgebraSO3Scenes: NarrationLineScene[] = [
  { lineId: 'wh-1', sectionId: 'where', scene: { id: 'wh-1', type: 'title' }, lineState: { params: { omega: Z, t: 0.8, mode: 'exp' }, annotation: { text: '旋转本身是从哪来的？', position: 'top' } } },
  { lineId: 'wh-2', sectionId: 'where', scene: { id: 'wh-2', type: 'animation' }, lineState: { params: { omega: Z, t: 1.2, mode: 'exp' }, annotation: { text: '从无穷小旋转指数出来', position: 'bottom' } } },
  { lineId: 'wh-3', sectionId: 'where', scene: { id: 'wh-3', type: 'animation' }, lineState: { params: { omega: Z, t: 0.3, mode: 'exp' }, annotation: { text: '在单位元处求导 = 切向量', position: 'bottom' } } },
  { lineId: 'wh-4', sectionId: 'where', scene: { id: 'wh-4', type: 'animation' }, lineState: { params: { omega: Z, t: 0.3, mode: 'exp' }, annotation: { text: 'RᵀR=I 求导 ⇒ Aᵀ + A = 0', position: 'bottom' } } },
  { lineId: 'wh-5', sectionId: 'where', scene: { id: 'wh-5', type: 'animation' }, lineState: { params: { omega: Z, t: 0.6, mode: 'exp' }, annotation: { text: 'so(3) = 全体反对称矩阵', position: 'bottom' } } },

  { lineId: 'ha-1', sectionId: 'hat', scene: { id: 'ha-1', type: 'animation' }, lineState: { params: { omega: DIAG, t: 1, mode: 'exp' }, annotation: { text: '反对称矩阵只有 3 个自由参数', position: 'top' } } },
  { lineId: 'ha-2', sectionId: 'hat', scene: { id: 'ha-2', type: 'animation' }, lineState: { params: { omega: DIAG, t: 1, mode: 'exp' }, annotation: { text: 'hat：把向量摆成矩阵', position: 'bottom' } } },
  { lineId: 'ha-3', sectionId: 'hat', scene: { id: 'ha-3', type: 'animation' }, lineState: { params: { omega: DIAG, t: 1.4, mode: 'exp' }, annotation: { text: '[ω]× v = ω × v：叉积即矩阵乘法', position: 'bottom' } } },
  { lineId: 'ha-4', sectionId: 'hat', scene: { id: 'ha-4', type: 'animation' }, lineState: { params: { omega: DIAG, t: 1.8, mode: 'exp' }, annotation: { text: 'ω 就是角速度：方向定轴，长度定速', position: 'bottom' } } },

  { lineId: 'ex-1', sectionId: 'exp', scene: { id: 'ex-1', type: 'animation' }, lineState: { params: { omega: Z, t: 1.5, mode: 'series', terms: 2 }, annotation: { text: '把标量指数的级数照抄给矩阵', position: 'top' } } },
  { lineId: 'ex-2', sectionId: 'exp', scene: { id: 'ex-2', type: 'animation' }, lineState: { params: { omega: Z, t: 1.5, mode: 'series', terms: 3 }, annotation: { text: 'I + A + A²/2! + A³/3! + …', position: 'bottom' } } },
  { lineId: 'ex-3', sectionId: 'exp', scene: { id: 'ex-3', type: 'animation' }, lineState: { params: { omega: Z, t: 2, mode: 'series', terms: 4 }, annotation: { text: '关键：K³ = −K', position: 'bottom' } } },
  { lineId: 'ex-4', sectionId: 'exp', scene: { id: 'ex-4', type: 'animation' }, lineState: { params: { omega: Z, t: 2, mode: 'series', terms: 6 }, annotation: { text: '奇次幂攒成 sin，偶次幂攒成 1−cos', position: 'bottom' } } },
  { lineId: 'ex-5', sectionId: 'exp', scene: { id: 'ex-5', type: 'animation' }, lineState: { params: { omega: Z, t: 2, mode: 'series', terms: 10 }, annotation: { text: 'exp = I + sinθ·K + (1−cosθ)·K²', position: 'bottom' } } },
  { lineId: 'ex-6', sectionId: 'exp', scene: { id: 'ex-6', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { omega: [0, 0, Math.PI], t: 1, mode: 'series', terms: 4 }, annotation: { text: '闭式是精确求和，不是近似', position: 'bottom' } } },

  { lineId: 'on-1', sectionId: 'oneparam', scene: { id: 'on-1', type: 'animation' }, lineState: { params: { omega: TILT, t: 0.6, mode: 'exp' }, annotation: { text: '固定 ω，让 t 走', position: 'top' } } },
  { lineId: 'on-2', sectionId: 'oneparam', scene: { id: 'on-2', type: 'animation' }, lineState: { params: { omega: TILT, t: 1.3, mode: 'exp' }, annotation: { text: 'exp(sω)exp(tω) = exp((s+t)ω)', position: 'bottom' } } },
  { lineId: 'on-3', sectionId: 'oneparam', scene: { id: 'on-3', type: 'animation' }, lineState: { params: { omega: TILT, t: 2.1, mode: 'exp' }, annotation: { text: '左边直线变长，右边曲线转圈', position: 'bottom' } } },
  { lineId: 'on-4', sectionId: 'oneparam', scene: { id: 'on-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { omega: TILT, t: 2.6, mode: 'exp' }, annotation: { text: '在 so(3) 上优化，再 exp 回群', position: 'bottom' } } },

  { lineId: 'br-1', sectionId: 'bracket', scene: { id: 'br-1', type: 'animation' }, lineState: { params: { omega: [0.9, 0, 0], t: 1, mode: 'bracket' }, annotation: { text: '不同轴呢？', position: 'top' } } },
  { lineId: 'br-2', sectionId: 'bracket', scene: { id: 'br-2', type: 'animation' }, lineState: { params: { omega: [0.9, 0, 0], t: 1, mode: 'bracket' }, annotation: { text: '换个次序，姿态就不一样', position: 'bottom' } } },
  { lineId: 'br-3', sectionId: 'bracket', scene: { id: 'br-3', type: 'animation' }, lineState: { params: { omega: [1.1, 0, 0], t: 1, mode: 'bracket' }, annotation: { text: '[A,B] = AB − BA', position: 'bottom' } } },
  { lineId: 'br-4', sectionId: 'bracket', scene: { id: 'br-4', type: 'animation' }, lineState: { params: { omega: [1.1, 0.3, 0], t: 1, mode: 'bracket' }, annotation: { text: '在 so(3) 上：括号就是叉积', position: 'bottom' } } },
  { lineId: 'br-5', sectionId: 'bracket', scene: { id: 'br-5', type: 'animation' }, lineState: { params: { omega: [0, 0, 1.2], t: 1, mode: 'bracket' }, annotation: { text: '轴平行 ⇒ 叉积为零 ⇒ 可换序', position: 'bottom' } } },
  { lineId: 'br-6', sectionId: 'bracket', scene: { id: 'br-6', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { omega: [0.9, 0, 0], t: 1, mode: 'bracket' }, annotation: { text: 'BCH 一阶修正 = ½[A,B]', position: 'bottom' } } },

  { lineId: 'us-1', sectionId: 'use', scene: { id: 'us-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { omega: TILT, t: 1.5, mode: 'exp' }, annotation: { text: '机器人：指数积公式 (PoE)', position: 'top' } } },
  { lineId: 'us-2', sectionId: 'use', scene: { id: 'us-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { omega: DIAG, t: 1.2, mode: 'exp' }, annotation: { text: 'SLAM：在 so(3) 上做增量', position: 'bottom' } } },
  { lineId: 'us-3', sectionId: 'use', scene: { id: 'us-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { omega: [0.8, 0.5, -1], t: 1.6, mode: 'exp' }, annotation: { text: '刚体动力学：角速度住在 so(3)', position: 'bottom' } } },
  { lineId: 'us-4', sectionId: 'use', scene: { id: 'us-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { omega: Z, t: 2, mode: 'exp' }, annotation: { text: 'su(2) ≅ so(3)：差别只在整体拓扑', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'so(3) = 反对称矩阵 ≅ 向量', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'K³=−K ⇒ Rodrigues 三项闭式', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '李括号 = 叉积 = 不可交换的度量', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
