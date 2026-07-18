/**
 * 朴素贝叶斯讲解场景配置
 * 每句口播对应训练样本规模（params.count）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNaiveBayesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const naiveBayesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '朴素贝叶斯', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-new', type: 'animation' }, lineState: { params: { count: 40 }, annotation: { text: '新点属于哪一类？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-prob', type: 'animation' }, lineState: { params: { count: 40 }, annotation: { text: '用概率来回答', position: 'bottom' } } },

  // ===== bayes (3) =====
  { lineId: 'def-1', sectionId: 'bayes', scene: { id: 'def-posterior', type: 'animation' }, lineState: { params: { count: 40 }, annotation: { text: '后验 ∝ 先验 × 似然', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'bayes', scene: { id: 'def-terms', type: 'animation' }, lineState: { params: { count: 40 }, annotation: { text: '先验与似然', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'bayes', scene: { id: 'def-decide', type: 'animation' }, lineState: { params: { count: 40 }, annotation: { text: '后验大者胜', position: 'bottom' } } },

  // ===== naive (3) =====
  { lineId: 'naive-1', sectionId: 'naive', scene: { id: 'naive-joint', type: 'animation' }, lineState: { params: { count: 40 }, annotation: { text: '联合似然难估', position: 'top' } } },
  { lineId: 'naive-2', sectionId: 'naive', scene: { id: 'naive-indep', type: 'animation' }, lineState: { params: { count: 80 }, annotation: { text: '特征独立→相乘', position: 'bottom' } } },
  { lineId: 'naive-3', sectionId: 'naive', scene: { id: 'naive-work', type: 'animation' }, lineState: { params: { count: 80 }, annotation: { text: '简单却好用', position: 'bottom' } } },

  // ===== gauss (2) =====
  { lineId: 'gauss-1', sectionId: 'gauss', scene: { id: 'gauss-fit', type: 'animation' }, lineState: { params: { count: 80 }, annotation: { text: '高斯拟合均值方差', position: 'top' } } },
  { lineId: 'gauss-2', sectionId: 'gauss', scene: { id: 'gauss-boundary', type: 'animation' }, lineState: { params: { count: 80 }, annotation: { text: '决策边界', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 80 }, annotation: { text: '调整样本数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-query', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 40 }, annotation: { text: '移动查询点', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '先验×似然=后验', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-boundary', type: 'summary' }, lineState: { annotation: { text: '高斯决策边界', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
