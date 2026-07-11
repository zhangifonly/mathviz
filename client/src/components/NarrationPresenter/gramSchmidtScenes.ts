/**
 * 施密特正交化讲解场景配置
 * 每句口播对应一个示例向量组（params.example）与动画阶段
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGramSchmidtState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gramSchmidtScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '施密特正交化', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-need', type: 'animation' }, lineState: { params: { example: 'classic' }, annotation: { text: '希望基互相垂直', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-machine', type: 'animation' }, lineState: { params: { example: 'classic' }, annotation: { text: '把歪斜的基扶正', position: 'bottom' } } },

  // ===== projection (3) =====
  { lineId: 'proj-1', sectionId: 'projection', scene: { id: 'proj-shadow', type: 'animation' }, lineState: { params: { example: 'steep' }, annotation: { text: '向量的影子', position: 'top' } } },
  { lineId: 'proj-2', sectionId: 'projection', scene: { id: 'proj-formula', type: 'formula' }, lineState: { annotation: { text: '投影公式', position: 'top' } } },
  { lineId: 'proj-3', sectionId: 'projection', scene: { id: 'proj-subtract', type: 'animation' }, lineState: { params: { example: 'steep' }, annotation: { text: '减去投影得垂直', position: 'bottom' } } },

  // ===== orthogonalize (3) =====
  { lineId: 'orth-1', sectionId: 'orthogonalize', scene: { id: 'orth-first', type: 'animation' }, lineState: { params: { example: 'classic' }, annotation: { text: '第一个原样保留', position: 'top' } } },
  { lineId: 'orth-2', sectionId: 'orthogonalize', scene: { id: 'orth-second', type: 'animation' }, lineState: { params: { example: 'classic' }, annotation: { text: '第二个减去投影', position: 'bottom' } } },
  { lineId: 'orth-3', sectionId: 'orthogonalize', scene: { id: 'orth-rest', type: 'animation' }, lineState: { params: { example: 'wide' }, annotation: { text: '依次两两垂直', position: 'bottom' } } },

  // ===== normalize (2) =====
  { lineId: 'norm-1', sectionId: 'normalize', scene: { id: 'norm-lengths', type: 'animation' }, lineState: { params: { example: 'classic' }, annotation: { text: '长度各不相同', position: 'top' } } },
  { lineId: 'norm-2', sectionId: 'normalize', scene: { id: 'norm-unit', type: 'animation' }, lineState: { params: { example: 'classic' }, annotation: { text: '除以模长 → 长度为一', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { example: 'steep' }, annotation: { text: '切换输入向量', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-perp', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { example: 'wide' }, annotation: { text: '最终总是垂直', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '减去投影扶正', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-normal', type: 'summary' }, lineState: { annotation: { text: '单位化 → 标准正交基', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
