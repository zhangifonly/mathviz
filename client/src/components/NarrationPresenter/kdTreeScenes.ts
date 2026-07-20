/**
 * KD 树讲解场景配置
 * 每句口播对应点数量（params.count）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultKdTreeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const kdTreeScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'KD树', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-slow', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '逐个比较太慢', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-split', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '巧妙的切分', position: 'bottom' } } },

  // ===== axis (3) =====
  { lineId: 'axis-1', sectionId: 'axis', scene: { id: 'axis-vert', type: 'animation' }, lineState: { params: { count: 8 }, annotation: { text: '竖切分左右', position: 'top' } } },
  { lineId: 'axis-2', sectionId: 'axis', scene: { id: 'axis-horiz', type: 'animation' }, lineState: { params: { count: 8 }, annotation: { text: '横切分上下', position: 'bottom' } } },
  { lineId: 'axis-3', sectionId: 'axis', scene: { id: 'axis-alt', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '竖横交替', position: 'bottom' } } },

  // ===== build (3) =====
  { lineId: 'build-1', sectionId: 'build', scene: { id: 'build-median', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '切在中位数', position: 'top' } } },
  { lineId: 'build-2', sectionId: 'build', scene: { id: 'build-balance', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '两边点数相等', position: 'bottom' } } },
  { lineId: 'build-3', sectionId: 'build', scene: { id: 'build-logn', type: 'animation' }, lineState: { params: { count: 32 }, annotation: { text: '约 log n 层', position: 'bottom' } } },

  // ===== prune (3) =====
  { lineId: 'prune-1', sectionId: 'prune', scene: { id: 'prune-dive', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '先找候选点', position: 'top' } } },
  { lineId: 'prune-2', sectionId: 'prune', scene: { id: 'prune-skip', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '远的整块跳过', position: 'bottom' } } },
  { lineId: 'prune-3', sectionId: 'prune', scene: { id: 'prune-key', type: 'animation' }, lineState: { params: { count: 32 }, annotation: { text: '剪枝是关键', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-move', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 16 }, annotation: { text: '移动查询点', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-visited', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 32 }, annotation: { text: '访问节点很少', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '交替切分建平衡树', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-prune', type: 'summary' }, lineState: { annotation: { text: '剪枝对数时间', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
