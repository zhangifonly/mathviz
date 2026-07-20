/**
 * 吉布斯现象讲解场景配置
 * 每句口播对应部分和项数（params.terms）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGibbsPhenomenonState: SceneState = {
  waveType: 'square',
  frequency: 1,
  amplitude: 1,
  terms: 15,
  isAnimating: false,
  highlightedElements: [],
}

export const gibbsPhenomenonScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '吉布斯现象', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-build', type: 'animation' }, lineState: { params: { terms: 3 }, annotation: { text: '用正弦拼方波', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-more', type: 'animation' }, lineState: { params: { terms: 5 }, annotation: { text: '叠加更多正弦', position: 'bottom' } } },

  // ===== partial (3) =====
  { lineId: 'def-1', sectionId: 'partial', scene: { id: 'def-odd', type: 'animation' }, lineState: { params: { terms: 3 }, annotation: { text: '只含奇次谐波', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'partial', scene: { id: 'def-sum', type: 'animation' }, lineState: { params: { terms: 5 }, annotation: { text: '前 n 项部分和', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'partial', scene: { id: 'def-flat', type: 'animation' }, lineState: { params: { terms: 15 }, annotation: { text: '平坦段更平', position: 'bottom' } } },

  // ===== overshoot (3) =====
  { lineId: 'ovs-1', sectionId: 'overshoot', scene: { id: 'ovs-over', type: 'animation' }, lineState: { params: { terms: 15 }, annotation: { text: '冲过了头', position: 'top' } } },
  { lineId: 'ovs-2', sectionId: 'overshoot', scene: { id: 'ovs-ring', type: 'animation' }, lineState: { params: { terms: 15 }, annotation: { text: '跳变处振铃', position: 'bottom' } } },
  { lineId: 'ovs-3', sectionId: 'overshoot', scene: { id: 'ovs-peak', type: 'animation' }, lineState: { params: { terms: 15 }, annotation: { text: '顶峰超出电平', position: 'bottom' } } },

  // ===== gibbs (3) =====
  { lineId: 'gib-1', sectionId: 'gibbs', scene: { id: 'gib-nine', type: 'animation' }, lineState: { params: { terms: 15 }, annotation: { text: '约 9% 跳变量', position: 'top' } } },
  { lineId: 'gib-2', sectionId: 'gibbs', scene: { id: 'gib-stub', type: 'animation' }, lineState: { params: { terms: 50 }, annotation: { text: '五十项仍 9%', position: 'bottom' } } },
  { lineId: 'gib-3', sectionId: 'gibbs', scene: { id: 'gib-narrow', type: 'animation' }, lineState: { params: { terms: 50 }, annotation: { text: '振铃越挤越窄', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-terms', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { terms: 50 }, annotation: { text: '调大项数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-peak', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { terms: 50 }, annotation: { text: '尖峰不倒', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '固定的过冲', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-uniform', type: 'summary' }, lineState: { annotation: { text: '逐点≠一致', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
