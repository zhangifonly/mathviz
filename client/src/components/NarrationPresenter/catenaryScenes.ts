/**
 * 悬链线讲解场景配置
 * 每句口播对应参数 a（params.a）与是否倒置（params.invert）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCatenaryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const catenaryScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '悬链线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-hang', type: 'animation' }, lineState: { params: { a: 70 }, annotation: { text: '两端翘起，中间最低', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { a: 70 }, annotation: { text: '它叫悬链线', position: 'bottom' } } },

  // ===== cosh (3) =====
  { lineId: 'def-1', sectionId: 'cosh', scene: { id: 'def-eq', type: 'animation' }, lineState: { params: { a: 70 }, annotation: { text: 'y=a·cosh(x/a)', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'cosh', scene: { id: 'def-cosh', type: 'animation' }, lineState: { params: { a: 70 }, annotation: { text: '(eˣ+e⁻ˣ)/2', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'cosh', scene: { id: 'def-a', type: 'animation' }, lineState: { params: { a: 40 }, annotation: { text: 'a 小则垂得更深', position: 'bottom' } } },

  // ===== parabola (3) =====
  { lineId: 'par-1', sectionId: 'parabola', scene: { id: 'par-guess', type: 'animation' }, lineState: { params: { a: 70, parabola: 1 }, annotation: { text: '不是抛物线', position: 'top' } } },
  { lineId: 'par-2', sectionId: 'parabola', scene: { id: 'par-diff', type: 'animation' }, lineState: { params: { a: 70, parabola: 1 }, annotation: { text: '两端上升更快', position: 'bottom' } } },
  { lineId: 'par-3', sectionId: 'parabola', scene: { id: 'par-galileo', type: 'animation' }, lineState: { params: { a: 120, parabola: 1 }, annotation: { text: '伽利略也曾猜错', position: 'bottom' } } },

  // ===== arch (3) =====
  { lineId: 'arc-1', sectionId: 'arch', scene: { id: 'arc-flip', type: 'animation' }, lineState: { params: { a: 70, invert: 1 }, annotation: { text: '倒置成拱', position: 'top' } } },
  { lineId: 'arc-2', sectionId: 'arch', scene: { id: 'arc-force', type: 'animation' }, lineState: { params: { a: 70, invert: 1 }, annotation: { text: '只受压，最省力', position: 'bottom' } } },
  { lineId: 'arc-3', sectionId: 'arch', scene: { id: 'arc-gaudi', type: 'animation' }, lineState: { params: { a: 120, invert: 1 }, annotation: { text: '高迪的圣家堂', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-a', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 40 }, annotation: { text: '调整参数 a', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-flip', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 70, parabola: 1, invert: 1 }, annotation: { text: '对比并倒置', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '双曲余弦曲线', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-arch', type: 'summary' }, lineState: { annotation: { text: '倒置即最优拱', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
