/**
 * 罗马数字讲解场景配置
 * 每句口播通过 params.value 指定当前展示的数字
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultRomanNumeralsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const romanNumeralsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '罗马数字', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-letters', type: 'animation' }, lineState: { params: { value: 8 }, annotation: { text: '用字母记数', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-goal', type: 'animation' }, lineState: { params: { value: 1000 }, annotation: { text: '千以内', position: 'bottom' } } },

  // ===== symbols (3) =====
  { lineId: 'symbols-1', sectionId: 'symbols', scene: { id: 'symbols-seven', type: 'animation' }, lineState: { params: { value: 1 }, annotation: { text: '七个符号', position: 'top' } } },
  { lineId: 'symbols-2', sectionId: 'symbols', scene: { id: 'symbols-low', type: 'animation' }, lineState: { params: { value: 50 }, annotation: { text: 'I V X L', position: 'top' } } },
  { lineId: 'symbols-3', sectionId: 'symbols', scene: { id: 'symbols-high', type: 'animation' }, lineState: { params: { value: 1000 }, annotation: { text: 'C D M', position: 'bottom' } } },

  // ===== add-rule (3) =====
  { lineId: 'add-1', sectionId: 'add-rule', scene: { id: 'add-order', type: 'animation' }, lineState: { params: { value: 26 }, annotation: { text: '从大到小相加', position: 'top' } } },
  { lineId: 'add-2', sectionId: 'add-rule', scene: { id: 'add-example', type: 'animation' }, lineState: { params: { value: 28 }, annotation: { text: '28 = XXVIII', position: 'top' } } },
  { lineId: 'add-3', sectionId: 'add-rule', scene: { id: 'add-limit', type: 'animation' }, lineState: { params: { value: 3 }, annotation: { text: '最多连写三次', position: 'bottom' } } },

  // ===== sub-rule (3) =====
  { lineId: 'sub-1', sectionId: 'sub-rule', scene: { id: 'sub-idea', type: 'animation' }, lineState: { params: { value: 4 }, annotation: { text: '小在左表示减', position: 'top' } } },
  { lineId: 'sub-2', sectionId: 'sub-rule', scene: { id: 'sub-49', type: 'animation' }, lineState: { params: { value: 9 }, annotation: { text: 'IV=4  IX=9', position: 'top' } } },
  { lineId: 'sub-3', sectionId: 'sub-rule', scene: { id: 'sub-combos', type: 'animation' }, lineState: { params: { value: 900 }, annotation: { text: 'XL XC CD CM', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slider', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { value: 49 }, annotation: { text: '拖动选数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-year', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { value: 2024 }, annotation: { text: '2024 = MMXXIV', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-rules', type: 'summary' }, lineState: { annotation: { text: '加法 + 减法', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-range', type: 'summary' }, lineState: { annotation: { text: '1 到 3999', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
