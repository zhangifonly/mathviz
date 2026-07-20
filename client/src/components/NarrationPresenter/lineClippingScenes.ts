/**
 * 线段裁剪讲解场景配置
 * params.showOutside 控制是否显示窗外原始线段（灰色虚线）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLineClippingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lineClippingScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '线段裁剪', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-outside', type: 'animation' }, lineState: { params: { showOutside: 1 }, annotation: { text: '窗外部分要剪掉', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-inside', type: 'animation' }, lineState: { params: { showOutside: 0 }, annotation: { text: '只保留窗内', position: 'bottom' } } },

  // ===== concept-code (3) =====
  { lineId: 'code-1', sectionId: 'concept-code', scene: { id: 'code-nine', type: 'animation' }, lineState: { params: { showOutside: 1 }, annotation: { text: '九个区域', position: 'top' } } },
  { lineId: 'code-2', sectionId: 'concept-code', scene: { id: 'code-bits', type: 'animation' }, lineState: { params: { showOutside: 1 }, annotation: { text: '四位区域码', position: 'top' } } },
  { lineId: 'code-3', sectionId: 'concept-code', scene: { id: 'code-zero', type: 'animation' }, lineState: { params: { showOutside: 0 }, annotation: { text: '窗内全是零', position: 'bottom' } } },

  // ===== concept-trivial (3) =====
  { lineId: 'triv-1', sectionId: 'concept-trivial', scene: { id: 'triv-accept', type: 'animation' }, lineState: { params: { showOutside: 0 }, annotation: { text: '整段在内=接受', position: 'top' } } },
  { lineId: 'triv-2', sectionId: 'concept-trivial', scene: { id: 'triv-reject', type: 'animation' }, lineState: { params: { showOutside: 1 }, annotation: { text: '同侧窗外=拒绝', position: 'bottom' } } },
  { lineId: 'triv-3', sectionId: 'concept-trivial', scene: { id: 'triv-fast', type: 'animation' }, lineState: { params: { showOutside: 1 }, annotation: { text: '位运算极快', position: 'bottom' } } },

  // ===== concept-iterate (3) =====
  { lineId: 'iter-1', sectionId: 'concept-iterate', scene: { id: 'iter-cross', type: 'animation' }, lineState: { params: { showOutside: 1 }, annotation: { text: '求交点', position: 'top' } } },
  { lineId: 'iter-2', sectionId: 'concept-iterate', scene: { id: 'iter-replace', type: 'animation' }, lineState: { params: { showOutside: 1 }, annotation: { text: '换端点再判断', position: 'bottom' } } },
  { lineId: 'iter-3', sectionId: 'concept-iterate', scene: { id: 'iter-done', type: 'animation' }, lineState: { params: { showOutside: 0 }, annotation: { text: '几步收窄', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-move', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { showOutside: 1 }, annotation: { text: '移动端点', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-reject', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { showOutside: 1 }, annotation: { text: '拖到窗外被拒绝', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-code', type: 'summary' }, lineState: { annotation: { text: '区域码快筛', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-iter', type: 'summary' }, lineState: { annotation: { text: '迭代求交', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
