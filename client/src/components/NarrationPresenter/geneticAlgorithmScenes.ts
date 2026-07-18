/**
 * 遗传算法讲解场景配置
 * 每句口播对应展示的代数（params.gen）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGeneticAlgorithmState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const geneticAlgorithmScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '遗传算法', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-evolve', type: 'animation' }, lineState: { params: { gen: 0 }, annotation: { text: '适者生存', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-search', type: 'animation' }, lineState: { params: { gen: 0 }, annotation: { text: '让计算机进化', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { gen: 2 }, annotation: { text: '向生命学优化', position: 'bottom' } } },

  // ===== fitness (3) =====
  { lineId: 'def-1', sectionId: 'fitness', scene: { id: 'def-terrain', type: 'animation' }, lineState: { params: { gen: 0 }, annotation: { text: '找最高的山峰', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'fitness', scene: { id: 'def-individual', type: 'animation' }, lineState: { params: { gen: 0 }, annotation: { text: '高度=适应度', position: 'top' } } },
  { lineId: 'def-3', sectionId: 'fitness', scene: { id: 'def-better', type: 'animation' }, lineState: { params: { gen: 1 }, annotation: { text: '越高越好', position: 'bottom' } } },

  // ===== operators (3) =====
  { lineId: 'op-1', sectionId: 'operators', scene: { id: 'op-select', type: 'animation' }, lineState: { params: { gen: 3 }, annotation: { text: '选择：优者留后', position: 'top' } } },
  { lineId: 'op-2', sectionId: 'operators', scene: { id: 'op-cross', type: 'animation' }, lineState: { params: { gen: 6 }, annotation: { text: '交叉：组合基因', position: 'bottom' } } },
  { lineId: 'op-3', sectionId: 'operators', scene: { id: 'op-mutate', type: 'animation' }, lineState: { params: { gen: 9 }, annotation: { text: '变异：保持多样', position: 'bottom' } } },

  // ===== converge (2) =====
  { lineId: 'con-1', sectionId: 'converge', scene: { id: 'con-gather', type: 'animation' }, lineState: { params: { gen: 18 }, annotation: { text: '聚拢到峰顶', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'converge', scene: { id: 'con-curve', type: 'animation' }, lineState: { params: { gen: 30 }, annotation: { text: '逼近全局最优', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { gen: 12 }, annotation: { text: '进化一代看聚集', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-reset', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { gen: 25 }, annotation: { text: '殊途同归', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '选择交叉变异', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-power', type: 'summary' }, lineState: { annotation: { text: '不依赖导数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
