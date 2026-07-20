/**
 * 假设检验讲解场景配置
 * 每句口播对应一组检验参数（params.mean / params.alpha）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHypothesisTestingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const hypothesisTestingScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '假设检验', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-doubt', type: 'animation' }, lineState: { params: { mean: 103, alpha: 0.05 }, annotation: { text: '真有效还是运气？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-method', type: 'animation' }, lineState: { params: { mean: 106, alpha: 0.05 }, annotation: { text: '严谨的裁决', position: 'bottom' } } },

  // ===== hypothesis (3) =====
  { lineId: 'hyp-1', sectionId: 'hypothesis', scene: { id: 'hyp-null', type: 'animation' }, lineState: { params: { mean: 100, alpha: 0.05 }, annotation: { text: 'H0: 均值不变', position: 'top' } } },
  { lineId: 'hyp-2', sectionId: 'hypothesis', scene: { id: 'hyp-alt', type: 'animation' }, lineState: { params: { mean: 106, alpha: 0.05 }, annotation: { text: 'H1: 均值改变', position: 'top' } } },
  { lineId: 'hyp-3', sectionId: 'hypothesis', scene: { id: 'hyp-logic', type: 'animation' }, lineState: { params: { mean: 106, alpha: 0.05 }, annotation: { text: '先假定 H0 成立', position: 'bottom' } } },

  // ===== statistic (3) =====
  { lineId: 'stat-1', sectionId: 'statistic', scene: { id: 'stat-z', type: 'animation' }, lineState: { params: { mean: 106, alpha: 0.05 }, annotation: { text: 'z = (x̄-μ0)/标准误', position: 'top' } } },
  { lineId: 'stat-2', sectionId: 'statistic', scene: { id: 'stat-normal', type: 'animation' }, lineState: { params: { mean: 106, alpha: 0.05 }, annotation: { text: 'H0 下服从标准正态', position: 'bottom' } } },
  { lineId: 'stat-3', sectionId: 'statistic', scene: { id: 'stat-far', type: 'animation' }, lineState: { params: { mean: 110, alpha: 0.05 }, annotation: { text: '离零越远越反常', position: 'bottom' } } },

  // ===== pvalue (3) =====
  { lineId: 'pval-1', sectionId: 'pvalue', scene: { id: 'pval-area', type: 'animation' }, lineState: { params: { mean: 106, alpha: 0.05 }, annotation: { text: 'p 值 = 尾部面积', position: 'top' } } },
  { lineId: 'pval-2', sectionId: 'pvalue', scene: { id: 'pval-alpha', type: 'animation' }, lineState: { params: { mean: 106, alpha: 0.05 }, annotation: { text: 'α = 0.05 门槛', position: 'bottom' } } },
  { lineId: 'pval-3', sectionId: 'pvalue', scene: { id: 'pval-reject', type: 'animation' }, lineState: { params: { mean: 108, alpha: 0.05 }, annotation: { text: 'p<α 则拒绝', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-mean', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mean: 108, alpha: 0.05 }, annotation: { text: '调整样本均值', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-alpha', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mean: 106, alpha: 0.01 }, annotation: { text: '收紧显著性水平', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '统计量衡量反常', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-rule', type: 'summary' }, lineState: { annotation: { text: 'p<α 则拒绝', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '让数据说话！', position: 'bottom' } } },
]
