/**
 * 幻方讲解场景配置
 * 每句口播对应方阵阶数（params.order）与高亮线（params.line/params.index）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMagicSquareState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const magicSquareScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-luoshu', type: 'title' }, lineState: { annotation: { text: '洛书传说', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '三阶幻方', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-equal', type: 'animation' }, lineState: { params: { order: 3, line: 'row', index: 0 }, annotation: { text: '横竖斜都相等', position: 'bottom' } } },

  // ===== build (3) =====
  { lineId: 'build-1', sectionId: 'build', scene: { id: 'build-siamese', type: 'animation' }, lineState: { params: { order: 5 }, annotation: { text: '暹罗法·楼梯法', position: 'top' } } },
  { lineId: 'build-2', sectionId: 'build', scene: { id: 'build-start', type: 'animation' }, lineState: { params: { order: 5 }, annotation: { text: '1 放首行正中', position: 'bottom' } } },
  { lineId: 'build-3', sectionId: 'build', scene: { id: 'build-rule', type: 'animation' }, lineState: { params: { order: 5 }, annotation: { text: '右上斜进·遇占下移', position: 'bottom' } } },

  // ===== verify (3) =====
  { lineId: 'verify-1', sectionId: 'verify', scene: { id: 'verify-row', type: 'animation' }, lineState: { params: { order: 5, line: 'row', index: 2 }, annotation: { text: '某一行之和', position: 'top' } } },
  { lineId: 'verify-2', sectionId: 'verify', scene: { id: 'verify-diag', type: 'animation' }, lineState: { params: { order: 5, line: 'diag' }, annotation: { text: '列与对角也相等', position: 'bottom' } } },
  { lineId: 'verify-3', sectionId: 'verify', scene: { id: 'verify-const', type: 'animation' }, lineState: { params: { order: 5, line: 'anti' }, annotation: { text: '公共和=幻常数', position: 'bottom' } } },

  // ===== property (2) =====
  { lineId: 'prop-1', sectionId: 'property', scene: { id: 'prop-formula', type: 'animation' }, lineState: { params: { order: 3, line: 'col', index: 1 }, annotation: { text: 'M = n(n²+1)/2', position: 'top' } } },
  { lineId: 'prop-2', sectionId: 'property', scene: { id: 'prop-values', type: 'animation' }, lineState: { params: { order: 7, line: 'diag' }, annotation: { text: '15 · 65 · 175', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-order', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 7 }, annotation: { text: '切换阶数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-line', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 5, line: 'anti' }, annotation: { text: '点亮不同线', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '行列对角皆相等', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-history', type: 'summary' }, lineState: { annotation: { text: '洛书到暹罗法', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
