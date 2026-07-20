/**
 * 拉丁方讲解场景配置
 * 每句口播对应展示的阶数（params.n）与移位（params.shift）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLatinSquareState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const latinSquareScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '拉丁方', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-ancestor', type: 'animation' }, lineState: { params: { n: 4, shift: 1 }, annotation: { text: '数独的祖先', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-euler', type: 'animation' }, lineState: { params: { n: 5, shift: 1 }, annotation: { text: '欧拉的研究', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-square', type: 'animation' }, lineState: { params: { n: 4, shift: 1 }, annotation: { text: 'n×n 方阵', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-rowcol', type: 'animation' }, lineState: { params: { n: 5, shift: 1 }, annotation: { text: '每行每列全用到', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-norepeat', type: 'animation' }, lineState: { params: { n: 5, shift: 1 }, annotation: { text: '绝不重复', position: 'bottom' } } },

  // ===== construct (3) =====
  { lineId: 'con-1', sectionId: 'construct', scene: { id: 'con-shift', type: 'animation' }, lineState: { params: { n: 5, shift: 1 }, annotation: { text: '逐行右移', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'construct', scene: { id: 'con-formula', type: 'animation' }, lineState: { params: { n: 6, shift: 1 }, annotation: { text: '(i+j) mod n', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'construct', scene: { id: 'con-mod', type: 'animation' }, lineState: { params: { n: 6, shift: 1 }, annotation: { text: '取余轮一遍', position: 'bottom' } } },

  // ===== orthogonal (2) =====
  { lineId: 'ort-1', sectionId: 'orthogonal', scene: { id: 'ort-pair', type: 'animation' }, lineState: { params: { n: 5, shift: 2 }, annotation: { text: '两方叠加', position: 'top' } } },
  { lineId: 'ort-2', sectionId: 'orthogonal', scene: { id: 'ort-design', type: 'animation' }, lineState: { params: { n: 5, shift: 2 }, annotation: { text: '实验设计', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-order', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 6, shift: 1 }, annotation: { text: '调整阶数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-shift', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 5, shift: 1 }, annotation: { text: '换一种移位', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '行列不重复', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-ortho', type: 'summary' }, lineState: { annotation: { text: '正交与构造', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
