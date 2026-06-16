/**
 * 欧拉恒等式讲解场景配置
 * 每句口播对应精确的动画状态（theta 为关键参数）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEulerIdentityState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const eulerIdentityScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '欧拉恒等式', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-formula', type: 'formula' }, lineState: { annotation: { text: 'e^(iπ) + 1 = 0', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-constants', type: 'formula' }, lineState: { annotation: { text: '五大常数的统一', position: 'top' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-five', type: 'title' }, lineState: { annotation: { text: 'e · i · π · 1 · 0', position: 'bottom' } } },

  // ===== euler-formula (4) =====
  { lineId: 'ef-1', sectionId: 'euler-formula', scene: { id: 'ef-general', type: 'formula' }, lineState: { annotation: { text: 'e^(iθ)=cosθ+isinθ', position: 'top' } } },
  { lineId: 'ef-2', sectionId: 'euler-formula', scene: { id: 'ef-decompose', type: 'animation' }, lineState: { params: { theta: 0.8 }, annotation: { text: '实部 + 虚部', position: 'bottom' } } },
  { lineId: 'ef-3', sectionId: 'euler-formula', scene: { id: 'ef-bridge', type: 'formula' }, lineState: { annotation: { text: '指数 ↔ 三角', position: 'top' } } },
  { lineId: 'ef-4', sectionId: 'euler-formula', scene: { id: 'ef-circle', type: 'animation' }, lineState: { params: { theta: 1.2 }, annotation: { text: '单位圆上的点', position: 'top' } } },

  // ===== rotation (5) =====
  { lineId: 'rot-1', sectionId: 'rotation', scene: { id: 'rot-start', type: 'animation' }, lineState: { params: { theta: 0.5, animate: true }, annotation: { text: 'θ 增大，逆时针旋转', position: 'top' } } },
  { lineId: 'rot-2', sectionId: 'rotation', scene: { id: 'rot-project', type: 'animation' }, lineState: { params: { theta: 1.0 }, annotation: { text: 'cosθ 与 sinθ 投影', position: 'bottom' } } },
  { lineId: 'rot-3', sectionId: 'rotation', scene: { id: 'rot-half', type: 'animation' }, lineState: { params: { theta: 3.14159 }, highlight: ['minusOne'], annotation: { text: 'θ=π 抵达 −1', position: 'bottom' } } },
  { lineId: 'rot-4', sectionId: 'rotation', scene: { id: 'rot-identity', type: 'formula' }, lineState: { params: { theta: 3.14159 }, annotation: { text: 'e^(iπ)=−1 → +1=0', position: 'bottom' } } },
  { lineId: 'rot-5', sectionId: 'rotation', scene: { id: 'rot-unify', type: 'animation' }, lineState: { params: { theta: 3.14159 }, annotation: { text: '半圈旋转的奇迹', position: 'top' } } },

  // ===== interaction (3) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { theta: 2.0 }, annotation: { text: '拖动角度滑块', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-pi', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { theta: 3.14159 }, annotation: { text: '点击 π 按钮', position: 'bottom' } } },
  { lineId: 'int-3', sectionId: 'interaction', scene: { id: 'int-full', type: 'interactive', interactive: { allowAnimation: true } }, lineState: { params: { theta: 6.28, animate: true }, annotation: { text: '完整一圈回到 1', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-rotation', type: 'summary' }, lineState: { annotation: { text: '复指数 = 旋转', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-identity', type: 'summary' }, lineState: { annotation: { text: 'e^(iπ)+1=0', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
