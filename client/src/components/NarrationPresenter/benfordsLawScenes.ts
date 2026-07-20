/**
 * 本福特定律讲解场景配置
 * 每句口播对应数据集（params.dataset）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBenfordsLawState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const benfordsLawScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '本福特定律', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-guess', type: 'animation' }, lineState: { params: { dataset: 'random' }, annotation: { text: '以为都差不多？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-one', type: 'animation' }, lineState: { params: { dataset: 'powers2' }, annotation: { text: '1 开头占三成', position: 'top' } } },

  // ===== dist (3) =====
  { lineId: 'def-1', sectionId: 'dist', scene: { id: 'def-bars', type: 'animation' }, lineState: { params: { dataset: 'powers2' }, annotation: { text: '像一条滑梯', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'dist', scene: { id: 'def-decrease', type: 'animation' }, lineState: { params: { dataset: 'powers2' }, annotation: { text: '1 高 9 矮', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'dist', scene: { id: 'def-name', type: 'animation' }, lineState: { params: { dataset: 'fibonacci' }, annotation: { text: '本福特定律', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-log', type: 'animation' }, lineState: { params: { dataset: 'fibonacci' }, annotation: { text: 'log(1 + 1/d)', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-values', type: 'animation' }, lineState: { params: { dataset: 'fibonacci' }, annotation: { text: '30.1% vs 4.6%', position: 'top' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-fit', type: 'animation' }, lineState: { params: { dataset: 'powers2' }, annotation: { text: '贴向理论曲线', position: 'bottom' } } },

  // ===== fraud (2) =====
  { lineId: 'app-1', sectionId: 'fraud', scene: { id: 'app-fake', type: 'animation' }, lineState: { params: { dataset: 'random' }, annotation: { text: '造假露破绽', position: 'top' } } },
  { lineId: 'app-2', sectionId: 'fraud', scene: { id: 'app-audit', type: 'animation' }, lineState: { params: { dataset: 'random' }, annotation: { text: '审计筛查造假', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-fit', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { dataset: 'powers2' }, annotation: { text: '幂与斐波那契', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { dataset: 'random' }, annotation: { text: '随机数被拉平', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'log(1 + 1/d)', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-when', type: 'summary' }, lineState: { annotation: { text: '跨量级才服从', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
