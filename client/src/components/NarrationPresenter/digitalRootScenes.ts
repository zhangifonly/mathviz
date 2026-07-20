/**
 * 数字根讲解场景配置
 * 每句口播对应展示的数字（params.n）或验算算式（params.a/b/op）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDigitalRootState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const digitalRootScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '数字根与弃九验算', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-sum', type: 'animation' }, lineState: { params: { n: 12345 }, annotation: { text: '各位相加', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-fold', type: 'animation' }, lineState: { params: { n: 12345 }, annotation: { text: '直到一位数', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-root', type: 'animation' }, lineState: { params: { n: 98765 }, annotation: { text: '这就是数字根', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-collapse', type: 'animation' }, lineState: { params: { n: 88888 }, annotation: { text: '总落在1到9', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-fold2', type: 'animation' }, lineState: { params: { n: 99999 }, annotation: { text: '折叠到最简', position: 'bottom' } } },

  // ===== mod9 (3) =====
  { lineId: 'mod-1', sectionId: 'mod9', scene: { id: 'mod-weight', type: 'animation' }, lineState: { params: { n: 100 }, annotation: { text: '10 除 9 余 1', position: 'top' } } },
  { lineId: 'mod-2', sectionId: 'mod9', scene: { id: 'mod-cong', type: 'animation' }, lineState: { params: { n: 12345 }, annotation: { text: '数字根 = 模9', position: 'bottom' } } },
  { lineId: 'mod-3', sectionId: 'mod9', scene: { id: 'mod-nine', type: 'animation' }, lineState: { params: { n: 18 }, annotation: { text: '余0记作9', position: 'bottom' } } },

  // ===== casting (3) =====
  { lineId: 'cast-1', sectionId: 'casting', scene: { id: 'cast-intro', type: 'animation' }, lineState: { params: { a: 1234, b: 5678, op: 'add' }, annotation: { text: '弃九验算', position: 'top' } } },
  { lineId: 'cast-2', sectionId: 'casting', scene: { id: 'cast-both', type: 'animation' }, lineState: { params: { a: 1234, b: 5678, op: 'add' }, annotation: { text: '两边各求根', position: 'bottom' } } },
  { lineId: 'cast-3', sectionId: 'casting', scene: { id: 'cast-check', type: 'animation' }, lineState: { params: { a: 123, b: 456, op: 'mul' }, annotation: { text: '不一致就是错', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-n', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 98765 }, annotation: { text: '输入数字', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-cast', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 123, b: 456, op: 'mul' }, annotation: { text: '验算算式', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '反复各位求和', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-mod', type: 'summary' }, lineState: { annotation: { text: '数字根 = 模9', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
