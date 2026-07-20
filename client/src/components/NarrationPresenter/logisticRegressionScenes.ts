/**
 * 逻辑回归讲解场景配置
 * 每句口播对应训练步数（params.step），驱动决策边界随迭代移动
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLogisticRegressionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const logisticRegressionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '逻辑回归', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-prob', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '多大概率属于红类？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-model', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '从数据学出概率', position: 'bottom' } } },

  // ===== sigmoid (3) =====
  { lineId: 'sig-1', sectionId: 'sigmoid', scene: { id: 'sig-score', type: 'animation' }, lineState: { params: { step: 5 }, annotation: { text: '线性得分', position: 'top' } } },
  { lineId: 'sig-2', sectionId: 'sigmoid', scene: { id: 'sig-curve', type: 'animation' }, lineState: { params: { step: 15 }, annotation: { text: 'S形压到 0~1', position: 'bottom' } } },
  { lineId: 'sig-3', sectionId: 'sigmoid', scene: { id: 'sig-half', type: 'animation' }, lineState: { params: { step: 15 }, annotation: { text: '得分0处概率0.5', position: 'bottom' } } },

  // ===== loss (2) =====
  { lineId: 'loss-1', sectionId: 'loss', scene: { id: 'loss-def', type: 'animation' }, lineState: { params: { step: 25 }, annotation: { text: '对数损失=交叉熵', position: 'top' } } },
  { lineId: 'loss-2', sectionId: 'loss', scene: { id: 'loss-cost', type: 'animation' }, lineState: { params: { step: 40 }, annotation: { text: '判错代价很大', position: 'bottom' } } },

  // ===== gradient (3) =====
  { lineId: 'grad-1', sectionId: 'gradient', scene: { id: 'grad-adjust', type: 'animation' }, lineState: { params: { step: 50 }, annotation: { text: '逐步减小损失', position: 'top' } } },
  { lineId: 'grad-2', sectionId: 'gradient', scene: { id: 'grad-update', type: 'animation' }, lineState: { params: { step: 80 }, annotation: { text: '沿梯度反方向', position: 'bottom' } } },
  { lineId: 'grad-3', sectionId: 'gradient', scene: { id: 'grad-move', type: 'animation' }, lineState: { params: { step: 110 }, annotation: { text: '边界缓缓摆正', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { step: 60 }, annotation: { text: '单步训练看边界', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-converge', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { step: 150 }, annotation: { text: '收敛后干净分开', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'sigmoid 出概率', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-train', type: 'summary' }, lineState: { annotation: { text: '梯度下降学边界', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '分类的基石！', position: 'bottom' } } },
]
