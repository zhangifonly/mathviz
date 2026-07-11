/**
 * SIR 传染病模型讲解场景配置
 * 每句口播对应一组参数（params.beta / params.gamma）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEpidemicSirState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const epidemicSirScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-hook', type: 'title' }, lineState: { annotation: { text: 'SIR 传染病模型', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-three', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: '只分三类人', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-curves', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: '三条曲线看疫情', position: 'bottom' } } },

  // ===== compartments (3) =====
  { lineId: 'comp-1', sectionId: 'compartments', scene: { id: 'comp-si', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: '易感 S / 感染 I', position: 'top' } } },
  { lineId: 'comp-2', sectionId: 'compartments', scene: { id: 'comp-r', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: '康复 R 获得免疫', position: 'top' } } },
  { lineId: 'comp-3', sectionId: 'compartments', scene: { id: 'comp-flow', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: 'S → I → R', position: 'bottom' } } },

  // ===== equations (3) =====
  { lineId: 'eq-1', sectionId: 'equations', scene: { id: 'eq-infect', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: '新增 = beta·s·i', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equations', scene: { id: 'eq-recover', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: '康复 = gamma·i', position: 'top' } } },
  { lineId: 'eq-3', sectionId: 'equations', scene: { id: 'eq-bell', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: '感染呈钟形曲线', position: 'bottom' } } },

  // ===== r0 (3) =====
  { lineId: 'r0-1', sectionId: 'r0', scene: { id: 'r0-def', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: 'R0 = beta / gamma', position: 'top' } } },
  { lineId: 'r0-2', sectionId: 'r0', scene: { id: 'r0-mean', type: 'animation' }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: '一人平均传几人', position: 'top' } } },
  { lineId: 'r0-3', sectionId: 'r0', scene: { id: 'r0-threshold', type: 'animation' }, lineState: { params: { beta: 0.08, gamma: 0.1 }, annotation: { text: 'R0 < 1 疫情消退', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-beta', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { beta: 0.6, gamma: 0.1 }, annotation: { text: '调高传染率', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-herd', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { beta: 0.3, gamma: 0.1 }, annotation: { text: '群体免疫阈值', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '三类人群 + 两条速率', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-r0', type: 'summary' }, lineState: { annotation: { text: '压低传染率 → 压低 R0', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
