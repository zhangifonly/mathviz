/**
 * 容斥原理讲解场景配置
 * 每句口播对应样本下标（params.idx）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultInclusionExclusionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const inclusionExclusionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '容斥原理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-add', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '能直接相加吗？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-dup', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '重复计数了', position: 'bottom' } } },

  // ===== venn (3) =====
  { lineId: 'venn-1', sectionId: 'venn', scene: { id: 'venn-circles', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '三圆表三集合', position: 'top' } } },
  { lineId: 'venn-2', sectionId: 'venn', scene: { id: 'venn-overlap', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '重叠被多算', position: 'bottom' } } },
  { lineId: 'venn-3', sectionId: 'venn', scene: { id: 'venn-count', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '数清重复次数', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-sub', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '加单个减两两', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-add', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '补回三三交', position: 'bottom' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-full', type: 'animation' }, lineState: { params: { idx: 2 }, annotation: { text: '加减交替', position: 'bottom' } } },

  // ===== general (2) =====
  { lineId: 'gen-1', sectionId: 'general', scene: { id: 'gen-sign', type: 'animation' }, lineState: { params: { idx: 2 }, annotation: { text: '奇加偶减', position: 'top' } } },
  { lineId: 'gen-2', sectionId: 'general', scene: { id: 'gen-why', type: 'animation' }, lineState: { params: { idx: 2 }, annotation: { text: '逐层修正', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-n', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 0 }, annotation: { text: '切换范围 N', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-verify', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 2 }, annotation: { text: '验证并集', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '消除重复计数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-general', type: 'summary' }, lineState: { annotation: { text: '奇加偶减', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
