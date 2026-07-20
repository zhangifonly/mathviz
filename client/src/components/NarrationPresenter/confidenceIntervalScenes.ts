/**
 * 置信区间讲解场景配置
 * 每句口播对应置信水平（params.level）与随机种子（params.seed）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultConfidenceIntervalState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const confidenceIntervalScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '置信区间', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-sample', type: 'animation' }, lineState: { params: { level: 0.95, seed: 2 }, annotation: { text: '用样本估计', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-single', type: 'animation' }, lineState: { params: { level: 0.95, seed: 3 }, annotation: { text: '一个数字靠谱吗？', position: 'bottom' } } },

  // ===== estimate (3) =====
  { lineId: 'def-1', sectionId: 'estimate', scene: { id: 'def-range', type: 'animation' }, lineState: { params: { level: 0.95, seed: 4 }, annotation: { text: '给出一段范围', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'estimate', scene: { id: 'def-formula', type: 'animation' }, lineState: { params: { level: 0.95, seed: 5 }, annotation: { text: '均值 ± z·标准误', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'estimate', scene: { id: 'def-se', type: 'animation' }, lineState: { params: { level: 0.95, seed: 6 }, annotation: { text: '样本越多越窄', position: 'bottom' } } },

  // ===== meaning (3) =====
  { lineId: 'mean-1', sectionId: 'meaning', scene: { id: 'mean-fixed', type: 'animation' }, lineState: { params: { level: 0.95, seed: 7 }, annotation: { text: '真值固定，区间随机', position: 'top' } } },
  { lineId: 'mean-2', sectionId: 'meaning', scene: { id: 'mean-wrong', type: 'animation' }, lineState: { params: { level: 0.95, seed: 8 }, annotation: { text: '不是单次的概率', position: 'bottom' } } },
  { lineId: 'mean-3', sectionId: 'meaning', scene: { id: 'mean-longrun', type: 'animation' }, lineState: { params: { level: 0.95, seed: 9 }, annotation: { text: '长期约95%罩住', position: 'bottom' } } },

  // ===== coverage (2) =====
  { lineId: 'cov-1', sectionId: 'coverage', scene: { id: 'cov-color', type: 'animation' }, lineState: { params: { level: 0.95, seed: 10 }, annotation: { text: '绿盖住·红错过', position: 'top' } } },
  { lineId: 'cov-2', sectionId: 'coverage', scene: { id: 'cov-ratio', type: 'animation' }, lineState: { params: { level: 0.95, seed: 11 }, annotation: { text: '绿条比例≈置信水平', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-resample', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { level: 0.95, seed: 12 }, annotation: { text: '多抽几轮', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-level', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { level: 0.99, seed: 13 }, annotation: { text: '调到99%', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '表达不确定性', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-longrun', type: 'summary' }, lineState: { annotation: { text: '长期覆盖率', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '让数据会说话！', position: 'bottom' } } },
]
