/**
 * 阻尼振荡讲解场景配置
 * 每句口播对应高亮的阻尼比（params.zeta），undefined 表示三种对比
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDampedOscillationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const dampedOscillationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '阻尼振荡', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-loss', type: 'animation' }, lineState: { params: { zeta: 0.2 }, annotation: { text: '能量被偷走', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { annotation: { text: '带阻力的振动', position: 'bottom' } } },

  // ===== zeta (3) =====
  { lineId: 'def-1', sectionId: 'zeta', scene: { id: 'def-eq', type: 'animation' }, lineState: { annotation: { text: 'm x″+c x′+k x=0', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'zeta', scene: { id: 'def-zeta', type: 'animation' }, lineState: { annotation: { text: 'ζ = c / 2√(mk)', position: 'top' } } },
  { lineId: 'def-3', sectionId: 'zeta', scene: { id: 'def-fate', type: 'animation' }, lineState: { annotation: { text: 'ζ 决定命运', position: 'bottom' } } },

  // ===== under (3) =====
  { lineId: 'und-1', sectionId: 'under', scene: { id: 'und-cross', type: 'animation' }, lineState: { params: { zeta: 0.2 }, annotation: { text: '穿越平衡点', position: 'top' } } },
  { lineId: 'und-2', sectionId: 'under', scene: { id: 'und-decay', type: 'animation' }, lineState: { params: { zeta: 0.2 }, annotation: { text: '指数衰减包络', position: 'bottom' } } },
  { lineId: 'und-3', sectionId: 'under', scene: { id: 'und-name', type: 'animation' }, lineState: { params: { zeta: 0.2 }, annotation: { text: '欠阻尼 ζ<1', position: 'bottom' } } },

  // ===== critover (3) =====
  { lineId: 'co-1', sectionId: 'critover', scene: { id: 'co-crit', type: 'animation' }, lineState: { params: { zeta: 1 }, annotation: { text: '临界 ζ=1 最快', position: 'top' } } },
  { lineId: 'co-2', sectionId: 'critover', scene: { id: 'co-over', type: 'animation' }, lineState: { params: { zeta: 2 }, annotation: { text: '过阻尼 ζ>1 更慢', position: 'top' } } },
  { lineId: 'co-3', sectionId: 'critover', scene: { id: 'co-car', type: 'animation' }, lineState: { params: { zeta: 1 }, annotation: { text: '汽车悬挂', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { annotation: { text: '切换阻尼比', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-flat', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { zeta: 1 }, annotation: { text: '波浪被抹平', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '一个 ζ 三种命运', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-three', type: 'summary' }, lineState: { annotation: { text: '振荡·最快·缓慢', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
