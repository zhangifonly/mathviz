/**
 * 中国剩余定理讲解场景配置
 * 每句口播对应一个样例索引（params.sample）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultChineseRemainderState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const chineseRemainderScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '中国剩余定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-count', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '韩信点兵', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-puzzle', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '物不知数', position: 'bottom' } } },

  // ===== concept (3) =====
  { lineId: 'def-1', sectionId: 'concept', scene: { id: 'def-cong', type: 'animation' }, lineState: { params: { sample: 0, cond: 0 }, annotation: { text: 'x ≡ 2 (mod 3)', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'concept', scene: { id: 'def-system', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '同余方程组', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'concept', scene: { id: 'def-common', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '公共解', position: 'bottom' } } },

  // ===== coprime (3) =====
  { lineId: 'pre-1', sectionId: 'coprime', scene: { id: 'pre-coprime', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '模两两互质', position: 'top' } } },
  { lineId: 'pre-2', sectionId: 'coprime', scene: { id: 'pre-period', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '周期 M = 105', position: 'bottom' } } },
  { lineId: 'pre-3', sectionId: 'coprime', scene: { id: 'pre-unique', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '解唯一', position: 'bottom' } } },

  // ===== construct (3) =====
  { lineId: 'con-1', sectionId: 'construct', scene: { id: 'con-inverse', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '扩展欧几里得求逆', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'construct', scene: { id: 'con-sum', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: '加权求和取模', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'construct', scene: { id: 'con-answer', type: 'animation' }, lineState: { params: { sample: 0 }, annotation: { text: 'x = 23', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sample: 1 }, annotation: { text: '拖动改余数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sample: 2 }, annotation: { text: '切换问题', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-merge', type: 'summary' }, lineState: { annotation: { text: '合并为唯一解', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: '古今皆用', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
