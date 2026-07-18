/**
 * 最大流最小割讲解场景配置
 * 每句口播对应网络的展示状态（params.showFlow / params.highlightCut）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultNetworkFlowState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const networkFlowScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '最大流最小割', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-cap', type: 'animation' }, lineState: { params: { showFlow: false }, annotation: { text: '管道有粗细', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { showFlow: false }, annotation: { text: '最多能送多少?', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-cap', type: 'animation' }, lineState: { params: { showFlow: false }, annotation: { text: '边=容量上限', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-ratio', type: 'animation' }, lineState: { params: { showFlow: true }, annotation: { text: '流量/容量', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-conserve', type: 'animation' }, lineState: { params: { showFlow: true }, annotation: { text: '流入=流出', position: 'bottom' } } },

  // ===== augment (3) =====
  { lineId: 'aug-1', sectionId: 'augment', scene: { id: 'aug-path', type: 'animation' }, lineState: { params: { showFlow: false }, annotation: { text: '还有剩余的通路', position: 'top' } } },
  { lineId: 'aug-2', sectionId: 'augment', scene: { id: 'aug-bfs', type: 'animation' }, lineState: { params: { showFlow: false }, annotation: { text: 'BFS 找最短路', position: 'bottom' } } },
  { lineId: 'aug-3', sectionId: 'augment', scene: { id: 'aug-push', type: 'animation' }, lineState: { params: { showFlow: true }, annotation: { text: '推送瓶颈流量', position: 'bottom' } } },

  // ===== theorem (3) =====
  { lineId: 'thm-1', sectionId: 'theorem', scene: { id: 'thm-cut', type: 'animation' }, lineState: { params: { showFlow: true, highlightCut: true }, annotation: { text: '割开两侧', position: 'top' } } },
  { lineId: 'thm-2', sectionId: 'theorem', scene: { id: 'thm-cap', type: 'animation' }, lineState: { params: { showFlow: true, highlightCut: true }, annotation: { text: '割的容量', position: 'bottom' } } },
  { lineId: 'thm-3', sectionId: 'theorem', scene: { id: 'thm-eq', type: 'animation' }, lineState: { params: { showFlow: true, highlightCut: true }, annotation: { text: '最大流=最小割', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-solve', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { showFlow: true }, annotation: { text: '求解最大流', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-cut', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { showFlow: true, highlightCut: true }, annotation: { text: '高亮最小割', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '容量下的最大输送', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-thm', type: 'summary' }, lineState: { annotation: { text: '增广路径与定理', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
