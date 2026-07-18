/**
 * 单摆相空间讲解场景配置
 * 每句口播对应相空间轨线条数(params.count)与高亮(params.highlight)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPendulumPhaseState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pendulumPhaseScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '单摆相空间', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-flip', type: 'animation' }, lineState: { params: { count: 6, highlight: -1 }, annotation: { text: '推猛了会翻圈', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-two', type: 'animation' }, lineState: { params: { count: 6, highlight: -1 }, annotation: { text: '同一方程两副面孔', position: 'bottom' } } },

  // ===== equation (3) =====
  { lineId: 'eq-1', sectionId: 'equation', scene: { id: 'eq-form', type: 'animation' }, lineState: { params: { count: 6, highlight: -1 }, annotation: { text: "θ''=-(g/L)sinθ", position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equation', scene: { id: 'eq-nonlin', type: 'animation' }, lineState: { params: { count: 6, highlight: -1 }, annotation: { text: 'sinθ 使其非线性', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equation', scene: { id: 'eq-rk4', type: 'animation' }, lineState: { params: { count: 6, highlight: -1 }, annotation: { text: 'RK4 逐步积分', position: 'bottom' } } },

  // ===== phase (3) =====
  { lineId: 'ph-1', sectionId: 'phase', scene: { id: 'ph-axes', type: 'animation' }, lineState: { params: { count: 6, highlight: -1 }, annotation: { text: '横θ 纵ω', position: 'top' } } },
  { lineId: 'ph-2', sectionId: 'phase', scene: { id: 'ph-point', type: 'animation' }, lineState: { params: { count: 6, highlight: 0 }, annotation: { text: '状态即一点', position: 'bottom' } } },
  { lineId: 'ph-3', sectionId: 'phase', scene: { id: 'ph-space', type: 'animation' }, lineState: { params: { count: 6, highlight: -1 }, annotation: { text: '相空间地图', position: 'bottom' } } },

  // ===== orbits (3) =====
  { lineId: 'orb-1', sectionId: 'orbits', scene: { id: 'orb-swing', type: 'animation' }, lineState: { params: { count: 6, highlight: 1 }, annotation: { text: '闭合=振荡', position: 'top' } } },
  { lineId: 'orb-2', sectionId: 'orbits', scene: { id: 'orb-flip', type: 'animation' }, lineState: { params: { count: 6, highlight: -1 }, annotation: { text: '波浪线=翻转', position: 'bottom' } } },
  { lineId: 'orb-3', sectionId: 'orbits', scene: { id: 'orb-sep', type: 'animation' }, lineState: { params: { count: 6, highlight: -1 }, annotation: { text: '红虚线=分界线', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 9, highlight: -1 }, annotation: { text: '调整轨线条数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-hi', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 9, highlight: 4 }, annotation: { text: '高亮追踪一条', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-rk4', type: 'summary' }, lineState: { annotation: { text: 'RK4 忠实轨迹', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-orbits', type: 'summary' }, lineState: { annotation: { text: '振荡·翻转·分界线', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
