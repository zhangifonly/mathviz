/**
 * 康威生命游戏讲解场景配置
 * 每句口播对应精确的动画状态
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGameOfLifeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gameOfLifeScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '康威生命游戏', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-history', type: 'title' }, lineState: { annotation: { text: '1970 · John Conway', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-cell', type: 'animation' }, lineState: { show: { grid: true }, annotation: { text: '细胞：活 or 死', position: 'top' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-emerge', type: 'animation' }, lineState: { show: { grid: true }, params: { pattern: 'pulsar' }, annotation: { text: '简单规则，复杂涌现', position: 'bottom' } } },

  // ===== rules (5) =====
  { lineId: 'rules-1', sectionId: 'rules', scene: { id: 'rules-neighbors', type: 'animation' }, lineState: { show: { neighbors: true }, annotation: { text: '八个邻居', position: 'top' } } },
  { lineId: 'rules-2', sectionId: 'rules', scene: { id: 'rules-survive', type: 'formula' }, lineState: { show: { neighbors: true }, annotation: { text: '存活: n ∈ {2,3}', position: 'bottom' } } },
  { lineId: 'rules-3', sectionId: 'rules', scene: { id: 'rules-balance', type: 'animation' }, lineState: { show: { neighbors: true }, annotation: { text: '太少孤独，太多拥挤', position: 'bottom' } } },
  { lineId: 'rules-4', sectionId: 'rules', scene: { id: 'rules-birth', type: 'formula' }, lineState: { show: { neighbors: true }, annotation: { text: '出生: n = 3', position: 'bottom' } } },
  { lineId: 'rules-5', sectionId: 'rules', scene: { id: 'rules-b3s23', type: 'animation' }, lineState: { show: { grid: true }, params: { pattern: 'blinker' }, annotation: { text: 'B3/S23 同步更新', position: 'top' } } },

  // ===== patterns (5) =====
  { lineId: 'pat-1', sectionId: 'patterns', scene: { id: 'pat-glider', type: 'animation' }, lineState: { show: { grid: true }, params: { pattern: 'glider' }, annotation: { text: '滑翔机', position: 'top' } } },
  { lineId: 'pat-2', sectionId: 'patterns', scene: { id: 'pat-glider-move', type: 'animation' }, lineState: { show: { grid: true }, params: { pattern: 'glider' }, annotation: { text: '每4代前进一格', position: 'bottom' } } },
  { lineId: 'pat-3', sectionId: 'patterns', scene: { id: 'pat-blinker', type: 'animation' }, lineState: { show: { grid: true }, params: { pattern: 'blinker' }, annotation: { text: '闪烁灯（振荡器）', position: 'top' } } },
  { lineId: 'pat-4', sectionId: 'patterns', scene: { id: 'pat-pulsar', type: 'animation' }, lineState: { show: { grid: true }, params: { pattern: 'pulsar' }, annotation: { text: '脉冲星（周期3）', position: 'top' } } },
  { lineId: 'pat-5', sectionId: 'patterns', scene: { id: 'pat-gun', type: 'animation' }, lineState: { show: { grid: true }, params: { pattern: 'gosper' }, annotation: { text: '高斯帕滑翔机枪', position: 'top' } } },

  // ===== emergence (4) =====
  { lineId: 'emg-1', sectionId: 'emergence', scene: { id: 'emg-concept', type: 'animation' }, lineState: { show: { grid: true }, params: { pattern: 'random' }, annotation: { text: '涌现：局部→整体', position: 'top' } } },
  { lineId: 'emg-2', sectionId: 'emergence', scene: { id: 'emg-noleader', type: 'animation' }, lineState: { show: { grid: true }, params: { pattern: 'random' }, annotation: { text: '没有指挥者', position: 'bottom' } } },
  { lineId: 'emg-3', sectionId: 'emergence', scene: { id: 'emg-turing', type: 'title' }, lineState: { annotation: { text: '图灵完备', position: 'top' } } },
  { lineId: 'emg-4', sectionId: 'emergence', scene: { id: 'emg-nature', type: 'application' }, lineState: { annotation: { text: '蚁群·大脑·星系', position: 'bottom' } } },

  // ===== interaction (3) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-click', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { show: { grid: true }, annotation: { text: '点击创造生命', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { show: { grid: true }, params: { pattern: 'random' }, annotation: { text: '试试随机初始', position: 'bottom' } } },
  { lineId: 'int-3', sectionId: 'interaction', scene: { id: 'int-speed', type: 'interactive', interactive: { allowAnimation: true } }, lineState: { show: { grid: true }, annotation: { text: '调节演化速度', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-rules', type: 'summary' }, lineState: { annotation: { text: 'B3/S23 元胞自动机', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-patterns', type: 'summary' }, lineState: { annotation: { text: '滑翔机·脉冲星', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
