/**
 * 外观数列讲解场景配置
 * 每句口播对应展开到第几项（params.shown）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLookAndSayState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lookAndSayScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '外观数列', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-read', type: 'animation' }, lineState: { params: { shown: 1 }, annotation: { text: '读作：一个1', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-write', type: 'animation' }, lineState: { params: { shown: 2 }, annotation: { text: '写成 11', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { shown: 3 }, annotation: { text: '外观数列', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'def-1', sectionId: 'rule', scene: { id: 'def-count', type: 'animation' }, lineState: { params: { shown: 3 }, annotation: { text: '几个几', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'rule', scene: { id: 'def-step', type: 'animation' }, lineState: { params: { shown: 4 }, annotation: { text: '21 到 1211', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'rule', scene: { id: 'def-more', type: 'animation' }, lineState: { params: { shown: 5 }, annotation: { text: '越读越长', position: 'bottom' } } },

  // ===== grow (3) =====
  { lineId: 'grow-1', sectionId: 'grow', scene: { id: 'grow-longer', type: 'animation' }, lineState: { params: { shown: 6 }, annotation: { text: '项长变长', position: 'top' } } },
  { lineId: 'grow-2', sectionId: 'grow', scene: { id: 'grow-log', type: 'animation' }, lineState: { params: { shown: 7 }, annotation: { text: '对数近乎直线', position: 'bottom' } } },
  { lineId: 'grow-3', sectionId: 'grow', scene: { id: 'grow-rate', type: 'animation' }, lineState: { params: { shown: 8 }, annotation: { text: '固定倍数增长', position: 'bottom' } } },

  // ===== conway (3) =====
  { lineId: 'con-1', sectionId: 'conway', scene: { id: 'con-ratio', type: 'animation' }, lineState: { params: { shown: 8 }, annotation: { text: '长度比趋于定值', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'conway', scene: { id: 'con-const', type: 'animation' }, lineState: { params: { shown: 8 }, annotation: { text: '约 1.303577', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'conway', scene: { id: 'con-123', type: 'animation' }, lineState: { params: { shown: 8 }, annotation: { text: '只含 1、2、3', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-expand', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { shown: 5 }, annotation: { text: '逐项展开', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-curve', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { shown: 8 }, annotation: { text: '贴近康威斜率', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-rule', type: 'summary' }, lineState: { annotation: { text: '读出上一项', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-law', type: 'summary' }, lineState: { annotation: { text: '康威常数 1.303', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
