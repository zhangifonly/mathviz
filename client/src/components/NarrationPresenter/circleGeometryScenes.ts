/**
 * 圆的几何讲解场景配置
 * 每句口播对应一个主题（params.topicId）与圆心角（params.angleDeg）
 * lineId / sectionId 与 narration 脚本 circle-geometry.ts 一一对应
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCircleGeometryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const circleGeometryScenes: NarrationLineScene[] = [
  // ===== intro (2) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '圆的几何', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-overview', type: 'animation' }, lineState: { params: { topicId: 'circumference', angleDeg: 360 }, annotation: { text: '公式与定理', position: 'top' } } },

  // ===== circumference (3) =====
  { lineId: 'circ-1', sectionId: 'circumference', scene: { id: 'circ-perimeter', type: 'animation' }, lineState: { params: { topicId: 'circumference', angleDeg: 360 }, annotation: { text: 'C = 2πr', position: 'top' } } },
  { lineId: 'circ-2', sectionId: 'circumference', scene: { id: 'circ-area', type: 'animation' }, lineState: { params: { topicId: 'circumference', angleDeg: 360 }, annotation: { text: 'S = πr²', position: 'bottom' } } },
  { lineId: 'circ-3', sectionId: 'circumference', scene: { id: 'circ-grow', type: 'animation' }, lineState: { params: { topicId: 'circumference', angleDeg: 360 }, annotation: { text: '面积按平方增长', position: 'bottom' } } },

  // ===== arc (3) =====
  { lineId: 'arc-1', sectionId: 'arc', scene: { id: 'arc-central', type: 'animation' }, lineState: { params: { topicId: 'arc', angleDeg: 90 }, annotation: { text: '圆心角', position: 'top' } } },
  { lineId: 'arc-2', sectionId: 'arc', scene: { id: 'arc-length', type: 'animation' }, lineState: { params: { topicId: 'arc', angleDeg: 120 }, annotation: { text: 'L = rθ', position: 'top' } } },
  { lineId: 'arc-3', sectionId: 'arc', scene: { id: 'arc-sector', type: 'animation' }, lineState: { params: { topicId: 'arc', angleDeg: 120 }, annotation: { text: '扇形 S = ½r²θ', position: 'bottom' } } },

  // ===== chord (2) =====
  { lineId: 'chord-1', sectionId: 'chord', scene: { id: 'chord-def', type: 'animation' }, lineState: { params: { topicId: 'chord', angleDeg: 120 }, annotation: { text: '弦', position: 'top' } } },
  { lineId: 'chord-2', sectionId: 'chord', scene: { id: 'chord-formula', type: 'animation' }, lineState: { params: { topicId: 'chord', angleDeg: 150 }, annotation: { text: '2r·sin(θ/2)', position: 'bottom' } } },

  // ===== inscribed (2) =====
  { lineId: 'insc-1', sectionId: 'inscribed', scene: { id: 'insc-angles', type: 'animation' }, lineState: { params: { topicId: 'inscribed', angleDeg: 100 }, annotation: { text: '圆心角与圆周角', position: 'top' } } },
  { lineId: 'insc-2', sectionId: 'inscribed', scene: { id: 'insc-theorem', type: 'animation' }, lineState: { params: { topicId: 'inscribed', angleDeg: 100 }, annotation: { text: '圆周角 = 一半', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { topicId: 'arc', angleDeg: 120 }, annotation: { text: '切换主题', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-angle', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { topicId: 'inscribed', angleDeg: 140 }, annotation: { text: '拉大圆心角', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-formulas', type: 'summary' }, lineState: { annotation: { text: 'C=2πr, S=πr²', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-theorems', type: 'summary' }, lineState: { annotation: { text: '弧长/扇形/圆周角', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
