/**
 * 勾股数讲解场景配置
 * 每句口播对应斜边上限（params.limit），交互段允许改参数
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPythagoreanTriplesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pythagoreanTriplesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '勾股数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-345', type: 'animation' }, lineState: { params: { limit: 60 }, annotation: { text: '3²+4²=5²', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { limit: 60 }, annotation: { text: '满足勾股定理的整数', position: 'bottom' } } },

  // ===== concept (3) =====
  { lineId: 'def-1', sectionId: 'concept', scene: { id: 'def-eq', type: 'animation' }, lineState: { params: { limit: 60 }, annotation: { text: 'a²+b²=c²', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'concept', scene: { id: 'def-more', type: 'animation' }, lineState: { params: { limit: 120 }, annotation: { text: '5,12,13 · 8,15,17', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'concept', scene: { id: 'def-howmany', type: 'animation' }, lineState: { params: { limit: 120 }, annotation: { text: '有多少组？', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-mn', type: 'animation' }, lineState: { params: { limit: 120 }, annotation: { text: '取 m > n > 0', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-eq', type: 'animation' }, lineState: { params: { limit: 120 }, annotation: { text: 'a=m²-n², b=2mn, c=m²+n²', position: 'top' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-gen', type: 'animation' }, lineState: { params: { limit: 220 }, annotation: { text: '源源不断地生成', position: 'bottom' } } },

  // ===== primitive (2) =====
  { lineId: 'prim-1', sectionId: 'primitive', scene: { id: 'prim-coprime', type: 'animation' }, lineState: { params: { limit: 120 }, annotation: { text: '互质+一奇一偶=本原', position: 'top' } } },
  { lineId: 'prim-2', sectionId: 'primitive', scene: { id: 'prim-derive', type: 'animation' }, lineState: { params: { limit: 220 }, annotation: { text: '整数倍得派生解', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-limit', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { limit: 220 }, annotation: { text: '调大斜边上限', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-pick', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { limit: 120 }, annotation: { text: '点开验证平方和', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'a²+b²=c²', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-formula', type: 'summary' }, lineState: { annotation: { text: '欧几里得公式全生成', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
