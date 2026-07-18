/**
 * 决策树讲解场景配置
 * 每句口播对应一个树深（params.depth），驱动分类区域从粗到细
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDecisionTreeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const decisionTreeScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '决策树', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-ask', type: 'animation' }, lineState: { params: { depth: 1 }, annotation: { text: '左边还是右边？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-narrow', type: 'animation' }, lineState: { params: { depth: 1 }, annotation: { text: '每问一次就变纯', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { depth: 2 }, annotation: { text: '层层提问的分类', position: 'bottom' } } },

  // ===== entropy (3) =====
  { lineId: 'ent-1', sectionId: 'entropy', scene: { id: 'ent-measure', type: 'animation' }, lineState: { params: { depth: 0 }, annotation: { text: '有多混乱？', position: 'top' } } },
  { lineId: 'ent-2', sectionId: 'entropy', scene: { id: 'ent-max', type: 'animation' }, lineState: { params: { depth: 0 }, annotation: { text: '各半时熵=1', position: 'bottom' } } },
  { lineId: 'ent-3', sectionId: 'entropy', scene: { id: 'ent-min', type: 'animation' }, lineState: { params: { depth: 4 }, annotation: { text: '纯净时熵=0', position: 'bottom' } } },

  // ===== gain (3) =====
  { lineId: 'gain-1', sectionId: 'gain', scene: { id: 'gain-split', type: 'animation' }, lineState: { params: { depth: 1 }, annotation: { text: '画一刀分两边', position: 'top' } } },
  { lineId: 'gain-2', sectionId: 'gain', scene: { id: 'gain-formula', type: 'animation' }, lineState: { params: { depth: 1 }, annotation: { text: '父熵-加权子熵', position: 'bottom' } } },
  { lineId: 'gain-3', sectionId: 'gain', scene: { id: 'gain-greedy', type: 'animation' }, lineState: { params: { depth: 2 }, annotation: { text: '贪心挑最大增益', position: 'bottom' } } },

  // ===== region (2) =====
  { lineId: 'reg-1', sectionId: 'region', scene: { id: 'reg-rect', type: 'animation' }, lineState: { params: { depth: 3 }, annotation: { text: '轴对齐矩形块', position: 'top' } } },
  { lineId: 'reg-2', sectionId: 'region', scene: { id: 'reg-leaf', type: 'animation' }, lineState: { params: { depth: 3 }, annotation: { text: '叶子=多数类', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-depth', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 4 }, annotation: { text: '调大树深', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-overfit', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 4 }, annotation: { text: '太深=过拟合', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '熵与信息增益', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-region', type: 'summary' }, lineState: { annotation: { text: '可解释的区域', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
