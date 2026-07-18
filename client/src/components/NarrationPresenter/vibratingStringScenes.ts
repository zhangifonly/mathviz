/**
 * 弦振动讲解场景配置
 * 每句口播对应参与叠加的模态列表（params.modes）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultVibratingStringState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: true,
  highlightedElements: [],
}

export const vibratingStringScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '弦振动', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fixed', type: 'animation' }, lineState: { params: { modes: [1] }, annotation: { text: '两端固定', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-math', type: 'animation' }, lineState: { params: { modes: [1] }, annotation: { text: '藏着数学', position: 'bottom' } } },

  // ===== wave-eq (3) =====
  { lineId: 'wave-1', sectionId: 'wave-eq', scene: { id: 'wave-accel', type: 'animation' }, lineState: { params: { modes: [1] }, annotation: { text: '加速度∝弯曲', position: 'top' } } },
  { lineId: 'wave-2', sectionId: 'wave-eq', scene: { id: 'wave-eq', type: 'animation' }, lineState: { params: { modes: [1] }, annotation: { text: '波动方程', position: 'bottom' } } },
  { lineId: 'wave-3', sectionId: 'wave-eq', scene: { id: 'wave-sol', type: 'animation' }, lineState: { params: { modes: [2] }, annotation: { text: '解=驻波族', position: 'bottom' } } },

  // ===== standing (3) =====
  { lineId: 'stand-1', sectionId: 'standing', scene: { id: 'stand-osc', type: 'animation' }, lineState: { params: { modes: [2] }, annotation: { text: '原地起伏', position: 'top' } } },
  { lineId: 'stand-2', sectionId: 'standing', scene: { id: 'stand-node', type: 'animation' }, lineState: { params: { modes: [3] }, annotation: { text: '节点与腹', position: 'bottom' } } },
  { lineId: 'stand-3', sectionId: 'standing', scene: { id: 'stand-count', type: 'animation' }, lineState: { params: { modes: [3] }, annotation: { text: 'n阶=n-1节点', position: 'bottom' } } },

  // ===== harmonics (3) =====
  { lineId: 'harm-1', sectionId: 'harmonics', scene: { id: 'harm-base', type: 'animation' }, lineState: { params: { modes: [1] }, annotation: { text: '基频定音高', position: 'top' } } },
  { lineId: 'harm-2', sectionId: 'harmonics', scene: { id: 'harm-over', type: 'animation' }, lineState: { params: { modes: [3] }, annotation: { text: '泛音=整数倍', position: 'bottom' } } },
  { lineId: 'harm-3', sectionId: 'harmonics', scene: { id: 'harm-timbre', type: 'animation' }, lineState: { params: { modes: [1, 2, 3] }, annotation: { text: '配比定音色', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-single', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { modes: [2] }, annotation: { text: '单个模态', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-mix', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { modes: [1, 2, 3] }, annotation: { text: '叠加成复杂弦形', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-modes', type: 'summary' }, lineState: { annotation: { text: '一族驻波模态', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-timbre', type: 'summary' }, lineState: { annotation: { text: '基频+泛音', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
