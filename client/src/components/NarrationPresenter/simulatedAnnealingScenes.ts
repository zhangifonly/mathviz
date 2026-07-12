/**
 * 模拟退火讲解场景配置
 * 每句口播对应能量地形（params.energyId）与降温策略（params.schedule）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSimulatedAnnealingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const simulatedAnnealingScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '模拟退火', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-trap', type: 'animation' }, lineState: { params: { energyId: 'multi-well', schedule: 'geometric' }, annotation: { text: '困在小坑', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-local', type: 'animation' }, lineState: { params: { energyId: 'multi-well', schedule: 'geometric' }, annotation: { text: '局部 vs 全局', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { energyId: 'multi-well', schedule: 'geometric' }, annotation: { text: '爬出小坑', position: 'bottom' } } },

  // ===== energy (3) =====
  { lineId: 'energy-1', sectionId: 'energy', scene: { id: 'energy-landscape', type: 'animation' }, lineState: { params: { energyId: 'ripple', schedule: 'geometric' }, annotation: { text: '能量地形', position: 'top' } } },
  { lineId: 'energy-2', sectionId: 'energy', scene: { id: 'energy-value', type: 'animation' }, lineState: { params: { energyId: 'ripple', schedule: 'geometric' }, annotation: { text: '越低越好', position: 'top' } } },
  { lineId: 'energy-3', sectionId: 'energy', scene: { id: 'energy-start', type: 'animation' }, lineState: { params: { energyId: 'ripple', schedule: 'geometric' }, annotation: { text: '随机出发', position: 'bottom' } } },

  // ===== metropolis (4) =====
  { lineId: 'metro-1', sectionId: 'metropolis', scene: { id: 'metro-accept', type: 'animation' }, lineState: { params: { energyId: 'multi-well', schedule: 'geometric' }, annotation: { text: '更低就接受', position: 'top' } } },
  { lineId: 'metro-2', sectionId: 'metropolis', scene: { id: 'metro-badstep', type: 'animation' }, lineState: { params: { energyId: 'multi-well', schedule: 'geometric' }, annotation: { text: '偶尔走坏棋', position: 'top' } } },
  { lineId: 'metro-3', sectionId: 'metropolis', scene: { id: 'metro-prob', type: 'formula' }, lineState: { annotation: { text: 'P = exp(-ΔE/T)', position: 'bottom' } } },
  { lineId: 'metro-4', sectionId: 'metropolis', scene: { id: 'metro-jump', type: 'animation' }, lineState: { params: { energyId: 'multi-well', schedule: 'geometric' }, annotation: { text: '翻过山脊', position: 'bottom' } } },

  // ===== cooling (3) =====
  { lineId: 'cool-1', sectionId: 'cooling', scene: { id: 'cool-hot', type: 'animation' }, lineState: { params: { energyId: 'twin-valley', schedule: 'geometric' }, annotation: { text: '高温大胆探索', position: 'top' } } },
  { lineId: 'cool-2', sectionId: 'cooling', scene: { id: 'cool-cold', type: 'animation' }, lineState: { params: { energyId: 'twin-valley', schedule: 'geometric' }, annotation: { text: '低温精细收敛', position: 'bottom' } } },
  { lineId: 'cool-3', sectionId: 'cooling', scene: { id: 'cool-metal', type: 'summary' }, lineState: { annotation: { text: '金属退火的智慧', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-terrain', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { energyId: 'twin-valley', schedule: 'geometric' }, annotation: { text: '切换地形', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-schedule', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { energyId: 'ripple', schedule: 'exponential' }, annotation: { text: '调整降温', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-temp', type: 'summary' }, lineState: { annotation: { text: '温度控制探索', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-badstep', type: 'summary' }, lineState: { annotation: { text: '接受坏棋跳出局部', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
