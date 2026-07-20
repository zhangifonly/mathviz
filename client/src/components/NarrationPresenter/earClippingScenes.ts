/**
 * 耳切三角剖分讲解场景配置
 * params.poly 选多边形，params.step 表示展示到第几步切耳
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEarClippingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const earClippingScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '耳切三角剖分', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-poly', type: 'animation' }, lineState: { params: { poly: 'L形', step: 0 }, annotation: { text: '复杂的凹多边形', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-goal', type: 'animation' }, lineState: { params: { poly: 'L形', step: 0 }, annotation: { text: '能否切成三角形？', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-ear', type: 'animation' }, lineState: { params: { poly: 'L形', step: 1 }, annotation: { text: '寻找一只耳朵', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-what', type: 'animation' }, lineState: { params: { poly: 'L形', step: 1 }, annotation: { text: '凸顶点+空三角', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-safe', type: 'animation' }, lineState: { params: { poly: 'L形', step: 2 }, annotation: { text: '放心切下', position: 'bottom' } } },

  // ===== clip (3) =====
  { lineId: 'clip-1', sectionId: 'clip', scene: { id: 'clip-one', type: 'animation' }, lineState: { params: { poly: 'L形', step: 2 }, annotation: { text: '顶点减一', position: 'top' } } },
  { lineId: 'clip-2', sectionId: 'clip', scene: { id: 'clip-again', type: 'animation' }, lineState: { params: { poly: 'L形', step: 3 }, annotation: { text: '继续找、继续切', position: 'bottom' } } },
  { lineId: 'clip-3', sectionId: 'clip', scene: { id: 'clip-done', type: 'animation' }, lineState: { params: { poly: 'L形', step: 4 }, annotation: { text: '剖分完成', position: 'bottom' } } },

  // ===== count (2) =====
  { lineId: 'cnt-1', sectionId: 'count', scene: { id: 'cnt-two', type: 'animation' }, lineState: { params: { poly: '五角星', step: 3 }, annotation: { text: '至少两只耳', position: 'top' } } },
  { lineId: 'cnt-2', sectionId: 'count', scene: { id: 'cnt-formula', type: 'animation' }, lineState: { params: { poly: '五角星', step: 8 }, annotation: { text: 'n - 2 个三角形', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { poly: 'L形', step: 2 }, annotation: { text: '单步切耳', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-star', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { poly: '五角星', step: 5 }, annotation: { text: '换成五角星', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '贪心切耳', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-classic', type: 'summary' }, lineState: { annotation: { text: '图形学经典', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
