/**
 * 排序算法讲解场景配置
 * 每句口播对应展示的算法（params.algo）与快照进度（params.progress 0..1）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSortingAlgorithmsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sortingAlgorithmsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '排序算法可视化', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-order', type: 'animation' }, lineState: { params: { algo: 'bubble', progress: 0 }, annotation: { text: '把乱序排好', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-speed', type: 'animation' }, lineState: { params: { algo: 'bubble', progress: 0.3 }, annotation: { text: '方法不同快慢差很多', position: 'bottom' } } },

  // ===== basic (3) =====
  { lineId: 'def-1', sectionId: 'basic', scene: { id: 'def-bubble', type: 'animation' }, lineState: { params: { algo: 'bubble', progress: 0.5 }, annotation: { text: '冒泡: 大的往后', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'basic', scene: { id: 'def-insert', type: 'animation' }, lineState: { params: { algo: 'insertion', progress: 0.5 }, annotation: { text: '插入: 像理扑克', position: 'top' } } },
  { lineId: 'def-3', sectionId: 'basic', scene: { id: 'def-n2', type: 'animation' }, lineState: { params: { algo: 'insertion', progress: 0.8 }, annotation: { text: 'O(n^2) 两层循环', position: 'bottom' } } },

  // ===== quick (3) =====
  { lineId: 'quick-1', sectionId: 'quick', scene: { id: 'quick-pivot', type: 'animation' }, lineState: { params: { algo: 'quick', progress: 0.3 }, annotation: { text: '选基准分左右', position: 'top' } } },
  { lineId: 'quick-2', sectionId: 'quick', scene: { id: 'quick-divide', type: 'animation' }, lineState: { params: { algo: 'quick', progress: 0.6 }, annotation: { text: '分而治之', position: 'bottom' } } },
  { lineId: 'quick-3', sectionId: 'quick', scene: { id: 'quick-fast', type: 'animation' }, lineState: { params: { algo: 'quick', progress: 1 }, annotation: { text: 'O(n log n)', position: 'bottom' } } },

  // ===== merge (2) =====
  { lineId: 'merge-1', sectionId: 'merge', scene: { id: 'merge-split', type: 'animation' }, lineState: { params: { algo: 'merge', progress: 0.3 }, annotation: { text: '一分为二', position: 'top' } } },
  { lineId: 'merge-2', sectionId: 'merge', scene: { id: 'merge-combine', type: 'animation' }, lineState: { params: { algo: 'merge', progress: 0.7 }, annotation: { text: '稳定合并', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { algo: 'quick', progress: 0.5 }, annotation: { text: '单步观察', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-play', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { algo: 'merge', progress: 1 }, annotation: { text: '播放动画', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '简单 vs 分治', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-choose', type: 'summary' }, lineState: { annotation: { text: '选对算法省时间', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
