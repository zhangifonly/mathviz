/**
 * 感知机讲解场景配置
 * 每句口播对应训练到第几步（params.step），驱动决策直线转动
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPerceptronState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const perceptronScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '感知机', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-neuron', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '最简人工神经元', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-origin', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '深度学习的起点', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-weight', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '输入加权求和', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-bias', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '加偏置得分数', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-sign', type: 'animation' }, lineState: { params: { step: 2 }, annotation: { text: '符号激活分两类', position: 'bottom' } } },

  // ===== update (3) =====
  { lineId: 'upd-1', sectionId: 'update', scene: { id: 'upd-zero', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '权重从零开始', position: 'top' } } },
  { lineId: 'upd-2', sectionId: 'update', scene: { id: 'upd-push', type: 'animation' }, lineState: { params: { step: 3 }, annotation: { text: '朝分错的点推一把', position: 'bottom' } } },
  { lineId: 'upd-3', sectionId: 'update', scene: { id: 'upd-rule', type: 'animation' }, lineState: { params: { step: 6 }, annotation: { text: 'w += η·y·x', position: 'bottom' } } },

  // ===== converge (2) =====
  { lineId: 'conv-1', sectionId: 'converge', scene: { id: 'conv-sep', type: 'animation' }, lineState: { params: { step: 10 }, annotation: { text: '线性可分', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'converge', scene: { id: 'conv-done', type: 'animation' }, lineState: { params: { step: 999 }, annotation: { text: '有限步必收敛', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { step: 5 }, annotation: { text: '单步看直线转动', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-full', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { step: 999 }, annotation: { text: '正确率100%', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '加权求和+激活', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-learn', type: 'summary' }, lineState: { annotation: { text: '误分类更新', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
