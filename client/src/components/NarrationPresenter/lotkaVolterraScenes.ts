/**
 * 捕食者猎物模型 讲解场景配置
 * 每句口播对应初始兔子数（params.prey）与被捕食率（params.beta）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLotkaVolterraState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lotkaVolterraScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '捕食者猎物模型', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-forest', type: 'animation' }, lineState: { params: { prey: 10 }, annotation: { text: '兔子与狐狸', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { prey: 10 }, annotation: { text: '数量如何起伏？', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-prey', type: 'animation' }, lineState: { params: { prey: 10 }, annotation: { text: '猎物方程', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-pred', type: 'animation' }, lineState: { params: { prey: 10 }, annotation: { text: '捕食者方程', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-system', type: 'animation' }, lineState: { params: { prey: 12 }, annotation: { text: '相互牵制', position: 'bottom' } } },

  // ===== oscillate (3) =====
  { lineId: 'osc-1', sectionId: 'oscillate', scene: { id: 'osc-rise', type: 'animation' }, lineState: { params: { prey: 12 }, annotation: { text: '兔多狐涨', position: 'top' } } },
  { lineId: 'osc-2', sectionId: 'oscillate', scene: { id: 'osc-fall', type: 'animation' }, lineState: { params: { prey: 12 }, annotation: { text: '狐多兔消', position: 'bottom' } } },
  { lineId: 'osc-3', sectionId: 'oscillate', scene: { id: 'osc-lag', type: 'animation' }, lineState: { params: { prey: 15 }, annotation: { text: '峰值滞后', position: 'bottom' } } },

  // ===== phase (3) =====
  { lineId: 'phase-1', sectionId: 'phase', scene: { id: 'phase-axes', type: 'animation' }, lineState: { params: { prey: 10 }, annotation: { text: '状态轨迹', position: 'top' } } },
  { lineId: 'phase-2', sectionId: 'phase', scene: { id: 'phase-loop', type: 'animation' }, lineState: { params: { prey: 10 }, annotation: { text: '闭合的环', position: 'bottom' } } },
  { lineId: 'phase-3', sectionId: 'phase', scene: { id: 'phase-conserve', type: 'animation' }, lineState: { params: { prey: 15 }, annotation: { text: '守恒量不变', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-prey', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { prey: 15 }, annotation: { text: '调初始兔数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-beta', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { prey: 10 }, annotation: { text: '调被捕食率', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '周期振荡', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-loop', type: 'summary' }, lineState: { annotation: { text: '闭合轨道', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '探索数学之美！', position: 'bottom' } } },
]
