/**
 * 偏导数与梯度讲解场景配置
 * 每句口播对应曲面(params.fnId)与采样点(params.px, params.py)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPartialDerivativeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const partialDerivativeScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '偏导数与梯度', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-slope', type: 'animation' }, lineState: { params: { fnId: 'ripple', px: 1.2, py: 0.8 }, annotation: { text: '往哪走上坡？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-need', type: 'animation' }, lineState: { params: { fnId: 'bowl', px: 1.5, py: 1 }, annotation: { text: '需要变化率工具', position: 'bottom' } } },

  // ===== partial (3) =====
  { lineId: 'def-1', sectionId: 'partial', scene: { id: 'def-x', type: 'animation' }, lineState: { params: { fnId: 'bowl', px: 1.5, py: 0.6 }, annotation: { text: '∂f/∂x 沿东西', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'partial', scene: { id: 'def-y', type: 'animation' }, lineState: { params: { fnId: 'bowl', px: 0.6, py: 1.5 }, annotation: { text: '∂f/∂y 沿南北', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'partial', scene: { id: 'def-const', type: 'animation' }, lineState: { params: { fnId: 'saddle', px: 1.2, py: 0.8 }, annotation: { text: '另一变量当常数', position: 'bottom' } } },

  // ===== gradient (3) =====
  { lineId: 'grad-1', sectionId: 'gradient', scene: { id: 'grad-vec', type: 'animation' }, lineState: { params: { fnId: 'saddle', px: 1.4, py: 0.5 }, annotation: { text: '梯度 [fx, fy]', position: 'top' } } },
  { lineId: 'grad-2', sectionId: 'gradient', scene: { id: 'grad-mag', type: 'animation' }, lineState: { params: { fnId: 'bowl', px: 2, py: 1.4 }, annotation: { text: '模长=最陡坡度', position: 'bottom' } } },
  { lineId: 'grad-3', sectionId: 'gradient', scene: { id: 'grad-arrow', type: 'animation' }, lineState: { params: { fnId: 'ripple', px: 1, py: 1.2 }, annotation: { text: '白箭头即梯度', position: 'bottom' } } },

  // ===== steepest (2) =====
  { lineId: 'steep-1', sectionId: 'steepest', scene: { id: 'steep-perp', type: 'animation' }, lineState: { params: { fnId: 'bowl', px: 1.6, py: 1.1 }, annotation: { text: '垂直于等高线', position: 'top' } } },
  { lineId: 'steep-2', sectionId: 'steepest', scene: { id: 'steep-dir', type: 'animation' }, lineState: { params: { fnId: 'monkey', px: 1.2, py: 0.9 }, annotation: { text: '上升最快方向', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-click', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnId: 'ripple', px: 0.8, py: 1.5 }, annotation: { text: '点击探索', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fnId: 'saddle', px: 1.3, py: 1.3 }, annotation: { text: '切换曲面', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '偏导合成梯度', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-perp', type: 'summary' }, lineState: { annotation: { text: '垂直等高线', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
