/**
 * Rössler 吸引子讲解场景配置
 * 每句口播对应参数预设（params.preset）与积分步数（params.steps）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultRosslerAttractorState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const rosslerAttractorScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'Rössler吸引子', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-simple', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 3000 }, annotation: { text: '混沌可以很简洁', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-1976', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 5000 }, annotation: { text: 'Rössler 1976', position: 'bottom' } } },

  // ===== equation (3) =====
  { lineId: 'def-1', sectionId: 'equation', scene: { id: 'def-dx', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 5000 }, annotation: { text: 'dx = -y - z', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'equation', scene: { id: 'def-dy', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 5000 }, annotation: { text: 'dy = x + a·y', position: 'top' } } },
  { lineId: 'def-3', sectionId: 'equation', scene: { id: 'def-dz', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 6000 }, annotation: { text: 'dz = b + z(x-c)', position: 'bottom' } } },

  // ===== fold (3) =====
  { lineId: 'fold-1', sectionId: 'fold', scene: { id: 'fold-spiral', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 6000 }, annotation: { text: '平面螺旋外扩', position: 'top' } } },
  { lineId: 'fold-2', sectionId: 'fold', scene: { id: 'fold-lift', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 7000 }, annotation: { text: 'z 猛然折叠拉起', position: 'bottom' } } },
  { lineId: 'fold-3', sectionId: 'fold', scene: { id: 'fold-mix', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 8000 }, annotation: { text: '拉伸+折叠=混沌', position: 'bottom' } } },

  // ===== attractor (2) =====
  { lineId: 'att-1', sectionId: 'attractor', scene: { id: 'att-single', type: 'animation' }, lineState: { params: { preset: 'classic', steps: 9000 }, annotation: { text: '单卷奇怪吸引子', position: 'top' } } },
  { lineId: 'att-2', sectionId: 'attractor', scene: { id: 'att-sensitive', type: 'animation' }, lineState: { params: { preset: 'rich', steps: 9000 }, annotation: { text: '有界·永不闭合', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-period', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'period2', steps: 8000 }, annotation: { text: '调小 c → 周期环', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-chaos', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'rich', steps: 9000 }, annotation: { text: '调大 c → 混沌', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recipe', type: 'summary' }, lineState: { annotation: { text: '混沌的核心配方', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-mech', type: 'summary' }, lineState: { annotation: { text: '拉伸×折叠', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
