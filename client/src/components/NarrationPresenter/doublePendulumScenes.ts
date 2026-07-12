/**
 * 双摆混沌讲解场景配置
 * 每句口播对应一个预设初始状态（params.preset），驱动渲染器重置模拟
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDoublePendulumState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: true,
  highlightedElements: [],
}

export const doublePendulumScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '双摆混沌', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-complex', type: 'animation' }, lineState: { params: { preset: 'chaotic' }, annotation: { text: '简单结构，复杂运动', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-model', type: 'animation' }, lineState: { params: { preset: 'chaotic' }, annotation: { text: '经典混沌模型', position: 'bottom' } } },

  // ===== equations (4) =====
  { lineId: 'eq-1', sectionId: 'equations', scene: { id: 'eq-dof', type: 'animation' }, lineState: { params: { preset: 'gentle' }, annotation: { text: '两个自由度', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equations', scene: { id: 'eq-lagrange', type: 'animation' }, lineState: { params: { preset: 'gentle' }, annotation: { text: '拉格朗日方程', position: 'top' } } },
  { lineId: 'eq-3', sectionId: 'equations', scene: { id: 'eq-nonlinear', type: 'animation' }, lineState: { params: { preset: 'gentle' }, annotation: { text: '非线性耦合', position: 'bottom' } } },
  { lineId: 'eq-4', sectionId: 'equations', scene: { id: 'eq-rk4', type: 'animation' }, lineState: { params: { preset: 'chaotic' }, annotation: { text: 'RK4 数值积分', position: 'bottom' } } },

  // ===== chaos (3) =====
  { lineId: 'chaos-1', sectionId: 'chaos', scene: { id: 'chaos-twin', type: 'animation' }, lineState: { params: { preset: 'chaotic' }, annotation: { text: '初值差万分之一', position: 'top' } } },
  { lineId: 'chaos-2', sectionId: 'chaos', scene: { id: 'chaos-diverge', type: 'animation' }, lineState: { params: { preset: 'chaotic' }, annotation: { text: '轨迹迅速分离', position: 'bottom' } } },
  { lineId: 'chaos-3', sectionId: 'chaos', scene: { id: 'chaos-butterfly', type: 'animation' }, lineState: { params: { preset: 'flip' }, annotation: { text: '蝴蝶效应', position: 'bottom' } } },

  // ===== interaction (3) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-preset', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'flip' }, annotation: { text: '切换初始状态', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-trail', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'chaotic' }, annotation: { text: '几乎永不重复的轨迹', position: 'bottom' } } },
  { lineId: 'int-3', sectionId: 'interaction', scene: { id: 'int-deterministic', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'chaotic' }, annotation: { text: '确定却不可预测', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '简单结构演示混沌', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-sensitive', type: 'summary' }, lineState: { annotation: { text: '确定但不可预测', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '探索非线性之美！', position: 'bottom' } } },
]
