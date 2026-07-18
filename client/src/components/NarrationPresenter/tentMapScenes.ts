/**
 * 帐篷映射讲解场景配置
 * 每句口播对应参数 mu 与起点 start（params.mu / params.start）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultTentMapState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const tentMapScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '帐篷映射', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-line', type: 'animation' }, lineState: { params: { mu: 2, start: 0.2 }, annotation: { text: '两段直线', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-tent', type: 'animation' }, lineState: { params: { mu: 2, start: 0.2 }, annotation: { text: '形如帐篷', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-shape', type: 'animation' }, lineState: { params: { mu: 1.5, start: 0.2 }, annotation: { text: '爬升再落下', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-formula', type: 'animation' }, lineState: { params: { mu: 1.5, start: 0.2 }, annotation: { text: 'mu·x / mu·(1-x)', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-mu', type: 'animation' }, lineState: { params: { mu: 1.5, start: 0.3 }, annotation: { text: 'mu 是帐篷高度', position: 'bottom' } } },

  // ===== fold (3) =====
  { lineId: 'fold-1', sectionId: 'fold', scene: { id: 'fold-stretch', type: 'animation' }, lineState: { params: { mu: 2, start: 0.15 }, annotation: { text: '拉伸再对折', position: 'top' } } },
  { lineId: 'fold-2', sectionId: 'fold', scene: { id: 'fold-mix', type: 'animation' }, lineState: { params: { mu: 2, start: 0.31 }, annotation: { text: '邻点迅速分开', position: 'bottom' } } },
  { lineId: 'fold-3', sectionId: 'fold', scene: { id: 'fold-knead', type: 'animation' }, lineState: { params: { mu: 2, start: 0.47 }, annotation: { text: '反复揉捏成混沌', position: 'bottom' } } },

  // ===== full (3) =====
  { lineId: 'full-1', sectionId: 'full', scene: { id: 'full-peak', type: 'animation' }, lineState: { params: { mu: 2, start: 0.2 }, annotation: { text: 'mu = 2 顶到最高', position: 'top' } } },
  { lineId: 'full-2', sectionId: 'full', scene: { id: 'full-chaos', type: 'animation' }, lineState: { params: { mu: 2, start: 0.23 }, annotation: { text: '满混沌', position: 'bottom' } } },
  { lineId: 'full-3', sectionId: 'full', scene: { id: 'full-fill', type: 'animation' }, lineState: { params: { mu: 2, start: 0.61 }, annotation: { text: '轨迹几乎填满', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-mu', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mu: 1.5, start: 0.2 }, annotation: { text: '拖动 mu', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-start', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mu: 2, start: 0.201 }, annotation: { text: '微调起点', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '拉伸与折叠', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-chaos', type: 'summary' }, lineState: { annotation: { text: 'mu=2 满混沌', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
