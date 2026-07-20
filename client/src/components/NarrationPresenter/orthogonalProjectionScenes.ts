/**
 * 正交投影讲解场景配置
 * 每句口播对应一个样例向量下标（params.sample）和直线角度（params.angle）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultOrthogonalProjectionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const orthogonalProjectionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '正交投影', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-shadow', type: 'animation' }, lineState: { params: { sample: 0, angle: 0 }, annotation: { text: '影子=投影', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-comp', type: 'animation' }, lineState: { params: { sample: 0, angle: 20 }, annotation: { text: '占多少分量？', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'def-1', sectionId: 'formula', scene: { id: 'def-formula', type: 'animation' }, lineState: { params: { sample: 0, angle: 20 }, annotation: { text: 'proj=(v·u/u·u)u', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'formula', scene: { id: 'def-coeff', type: 'animation' }, lineState: { params: { sample: 1, angle: 35 }, annotation: { text: '投影系数', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'formula', scene: { id: 'def-unit', type: 'animation' }, lineState: { params: { sample: 1, angle: 35 }, annotation: { text: '单位向量简化', position: 'bottom' } } },

  // ===== nearest (3) =====
  { lineId: 'near-1', sectionId: 'nearest', scene: { id: 'near-foot', type: 'animation' }, lineState: { params: { sample: 2, angle: 60 }, annotation: { text: '作垂线求垂足', position: 'top' } } },
  { lineId: 'near-2', sectionId: 'nearest', scene: { id: 'near-min', type: 'animation' }, lineState: { params: { sample: 2, angle: 60 }, annotation: { text: '垂足=最近点', position: 'bottom' } } },
  { lineId: 'near-3', sectionId: 'nearest', scene: { id: 'near-approx', type: 'animation' }, lineState: { params: { sample: 2, angle: 60 }, annotation: { text: '误差最小的近似', position: 'bottom' } } },

  // ===== residual (3) =====
  { lineId: 'res-1', sectionId: 'residual', scene: { id: 'res-def', type: 'animation' }, lineState: { params: { sample: 0, angle: 20 }, annotation: { text: '残差=v-proj', position: 'top' } } },
  { lineId: 'res-2', sectionId: 'residual', scene: { id: 'res-orth', type: 'animation' }, lineState: { params: { sample: 0, angle: 20 }, annotation: { text: '残差·方向=0', position: 'bottom' } } },
  { lineId: 'res-3', sectionId: 'residual', scene: { id: 'res-split', type: 'animation' }, lineState: { params: { sample: 1, angle: 35 }, annotation: { text: '正交分解', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-move', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sample: 3, angle: 0 }, annotation: { text: '换向量看影子', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-rotate', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sample: 2, angle: 90 }, annotation: { text: '转直线看垂直', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '方向分量+残差', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-lsq', type: 'summary' }, lineState: { annotation: { text: '最小二乘根基', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
