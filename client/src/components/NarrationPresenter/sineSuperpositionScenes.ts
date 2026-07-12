/**
 * 波的叠加讲解场景配置
 * 每句口播对应一个叠加场景（params.scenario 指定预设）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSineSuperpositionState: SceneState = {
  waveType: 'sine',
  frequency: 3,
  amplitude: 1,
  terms: 2,
  isAnimating: true,
  highlightedElements: [],
}

export const sineSuperpositionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '波的叠加', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pass', type: 'animation' }, lineState: { params: { scenario: 'harmonics' }, annotation: { text: '穿过彼此', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-merge', type: 'animation' }, lineState: { params: { scenario: 'harmonics' }, annotation: { text: '叠加成新波形', position: 'bottom' } } },

  // ===== principle (3) =====
  { lineId: 'principle-1', sectionId: 'principle', scene: { id: 'principle-sum', type: 'animation' }, lineState: { params: { scenario: 'harmonics' }, annotation: { text: '位移的代数和', position: 'top' } } },
  { lineId: 'principle-2', sectionId: 'principle', scene: { id: 'principle-components', type: 'animation' }, lineState: { params: { scenario: 'harmonics' }, annotation: { text: '分量波', position: 'top' } } },
  { lineId: 'principle-3', sectionId: 'principle', scene: { id: 'principle-resultant', type: 'animation' }, lineState: { params: { scenario: 'harmonics' }, annotation: { text: '逐点相加', position: 'bottom' } } },

  // ===== interference (3) =====
  { lineId: 'interference-1', sectionId: 'interference', scene: { id: 'inter-constructive', type: 'animation' }, lineState: { params: { scenario: 'constructive' }, annotation: { text: '相长干涉', position: 'top' } } },
  { lineId: 'interference-2', sectionId: 'interference', scene: { id: 'inter-destructive', type: 'animation' }, lineState: { params: { scenario: 'destructive' }, annotation: { text: '相消干涉', position: 'top' } } },
  { lineId: 'interference-3', sectionId: 'interference', scene: { id: 'inter-phase', type: 'animation' }, lineState: { params: { scenario: 'constructive' }, annotation: { text: '相位决定结果', position: 'bottom' } } },

  // ===== beats (3) =====
  { lineId: 'beats-1', sectionId: 'beats', scene: { id: 'beats-close', type: 'animation' }, lineState: { params: { scenario: 'beats' }, annotation: { text: '频率相近', position: 'top' } } },
  { lineId: 'beats-2', sectionId: 'beats', scene: { id: 'beats-envelope', type: 'animation' }, lineState: { params: { scenario: 'beats' }, annotation: { text: '振幅缓慢起伏', position: 'bottom' } } },
  { lineId: 'beats-3', sectionId: 'beats', scene: { id: 'beats-tuning', type: 'animation' }, lineState: { params: { scenario: 'beats' }, annotation: { text: '调音的嗡鸣', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'interaction-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scenario: 'constructive' }, annotation: { text: '切换场景', position: 'top' } } },
  { lineId: 'interaction-2', sectionId: 'interaction', scene: { id: 'int-harmonics', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scenario: 'harmonics' }, annotation: { text: '谐波合成', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'summary-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '逐点相加', position: 'top' } } },
  { lineId: 'summary-2', sectionId: 'summary', scene: { id: 'sum-rules', type: 'summary' }, lineState: { annotation: { text: '相长/相消/拍频', position: 'bottom' } } },
  { lineId: 'summary-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
