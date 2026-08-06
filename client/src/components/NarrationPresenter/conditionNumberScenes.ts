/**
 * 矩阵条件数与数值稳定性 讲解场景配置
 *
 * params 直通 draw.ts 的 DrawOpts：presetId 选矩阵，showWorst 控制
 * 最坏扰动方向箭头，camYaw/camPitch 转视角。
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultConditionNumberState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const conditionNumberScenes: NarrationLineScene[] = [
  { lineId: 'pr-1', sectionId: 'problem', scene: { id: 'pr-1', type: 'title' }, lineState: { params: { presetId: 'identity', showWorst: false }, annotation: { text: '算得出来，未必算得准', position: 'top' } } },
  { lineId: 'pr-2', sectionId: 'problem', scene: { id: 'pr-2', type: 'animation' }, lineState: { params: { presetId: 'identity', showWorst: false }, annotation: { text: 'b 总带一点误差', position: 'bottom' } } },
  { lineId: 'pr-3', sectionId: 'problem', scene: { id: 'pr-3', type: 'animation' }, lineState: { params: { presetId: 'ill', showWorst: false }, annotation: { text: '有些矩阵会把误差放大上千倍', position: 'bottom' } } },
  { lineId: 'pr-4', sectionId: 'problem', scene: { id: 'pr-4', type: 'animation' }, lineState: { params: { presetId: 'ill', showWorst: true }, annotation: { text: '放大多少，由条件数 κ 决定', position: 'bottom' } } },

  { lineId: 'ge-1', sectionId: 'geometry', scene: { id: 'ge-1', type: 'animation' }, lineState: { params: { presetId: 'identity', showWorst: false }, annotation: { text: '所有长度为 1 的向量 = 单位球面', position: 'top' } } },
  { lineId: 'ge-2', sectionId: 'geometry', scene: { id: 'ge-2', type: 'animation' }, lineState: { params: { presetId: 'mild', showWorst: false }, annotation: { text: 'A 作用后：球变椭球', position: 'bottom' } } },
  { lineId: 'ge-3', sectionId: 'geometry', scene: { id: 'ge-3', type: 'animation' }, lineState: { params: { presetId: 'mild', showWorst: false }, annotation: { text: '三条半轴长 = 三个奇异值', position: 'bottom' } } },
  { lineId: 'ge-4', sectionId: 'geometry', scene: { id: 'ge-4', type: 'animation' }, lineState: { params: { presetId: 'mild', showWorst: false }, annotation: { text: 'κ = 最长半轴 ÷ 最短半轴', position: 'bottom' } } },
  { lineId: 'ge-5', sectionId: 'geometry', scene: { id: 'ge-5', type: 'animation' }, lineState: { params: { presetId: 'ill', showWorst: false }, annotation: { text: '两侧同一缩放，才看得出扁', position: 'bottom' } } },

  { lineId: 'wh-1', sectionId: 'why', scene: { id: 'wh-1', type: 'animation' }, lineState: { params: { presetId: 'ill', showWorst: false, camYaw: 1.1 }, annotation: { text: '球各向同性，椭球不是', position: 'top' } } },
  { lineId: 'wh-2', sectionId: 'why', scene: { id: 'wh-2', type: 'animation' }, lineState: { params: { presetId: 'ill', showWorst: true, camYaw: 1.1 }, annotation: { text: '压扁的方向 = 信息被抹平', position: 'bottom' } } },
  { lineId: 'wh-3', sectionId: 'why', scene: { id: 'wh-3', type: 'animation' }, lineState: { params: { presetId: 'ill', showWorst: true, camYaw: 1.5 }, annotation: { text: '反解要撑开，误差跟着撑开', position: 'bottom' } } },
  { lineId: 'wh-4', sectionId: 'why', scene: { id: 'wh-4', type: 'animation' }, lineState: { params: { presetId: 'ill', showWorst: true, camYaw: 1.5 }, annotation: { text: '相对误差 ≤ κ × 输入相对误差', position: 'bottom' } } },
  { lineId: 'wh-5', sectionId: 'why', scene: { id: 'wh-5', type: 'animation' }, lineState: { params: { presetId: 'ill', showWorst: true, camYaw: 1.9 }, annotation: { text: '最坏方向放大 1999 = κ，上界可取到', position: 'bottom' } } },

  { lineId: 'de-1', sectionId: 'det', scene: { id: 'de-1', type: 'animation' }, lineState: { params: { presetId: 'ill', showWorst: false }, annotation: { text: '「行列式小 = 病态」是错的', position: 'top' } } },
  { lineId: 'de-2', sectionId: 'det', scene: { id: 'de-2', type: 'animation' }, lineState: { params: { presetId: 'scaled', showWorst: false }, annotation: { text: 'det = 1e−9，非常小', position: 'bottom' } } },
  { lineId: 'de-3', sectionId: 'det', scene: { id: 'de-3', type: 'animation' }, lineState: { params: { presetId: 'scaled', showWorst: false }, annotation: { text: '但 κ = 1，球还是球，完美良态', position: 'bottom' } } },
  { lineId: 'de-4', sectionId: 'det', scene: { id: 'de-4', type: 'animation' }, lineState: { params: { presetId: 'skew', showWorst: true }, annotation: { text: 'det = 1 却 κ ≈ 5.8', position: 'bottom' } } },
  { lineId: 'de-5', sectionId: 'det', scene: { id: 'de-5', type: 'animation' }, lineState: { params: { presetId: 'skew', showWorst: true }, annotation: { text: 'det 是积，κ 是比', position: 'bottom' } } },

  { lineId: 'pa-1', sectionId: 'practice', scene: { id: 'pa-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'ill', showWorst: true }, annotation: { text: '双精度约 16 位有效数字', position: 'top' } } },
  { lineId: 'pa-2', sectionId: 'practice', scene: { id: 'pa-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'severe', showWorst: true }, annotation: { text: 'κ=10ᵏ 就丢 k 位', position: 'bottom' } } },
  { lineId: 'pa-3', sectionId: 'practice', scene: { id: 'pa-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'severe', showWorst: true, camYaw: 1.4 }, annotation: { text: 'Hilbert 矩阵：n=6 时 κ>10⁷', position: 'bottom' } } },
  { lineId: 'pa-4', sectionId: 'practice', scene: { id: 'pa-4', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'severe', showWorst: true, camYaw: 1.8 }, annotation: { text: '换算法 / 预条件 / 正则化', position: 'bottom' } } },
  { lineId: 'pa-5', sectionId: 'practice', scene: { id: 'pa-5', type: 'animation' }, lineState: { params: { presetId: 'mild', showWorst: false }, annotation: { text: 'AᵀA 会把条件数平方 —— 本课自己也踩了', position: 'bottom' } } },

  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'κ = σ₁/σ₃ = 椭球有多扁', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '上界可取到；κ=10ᵏ 丢 k 位', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'summary' }, lineState: { annotation: { text: '别拿行列式判断病态', position: 'bottom' } } },
  { lineId: 'sum-4', sectionId: 'summary', scene: { id: 'sum-4', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
