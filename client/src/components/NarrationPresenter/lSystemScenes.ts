/**
 * L-系统植物讲解场景配置
 * 每句口播对应预设图形（params.preset）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLSystemState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lSystemScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'L-系统植物', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-lind', type: 'animation' }, lineState: { params: { preset: 'plant' }, annotation: { text: '林登迈尔 1968', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { preset: 'plant' }, annotation: { text: '替换再绘制', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-grow', type: 'animation' }, lineState: { params: { preset: 'plant' }, annotation: { text: '种出植物', position: 'bottom' } } },

  // ===== rewrite (3) =====
  { lineId: 'rw-1', sectionId: 'rewrite', scene: { id: 'rw-axiom', type: 'animation' }, lineState: { params: { preset: 'koch' }, annotation: { text: '公理', position: 'top' } } },
  { lineId: 'rw-2', sectionId: 'rewrite', scene: { id: 'rw-rule', type: 'animation' }, lineState: { params: { preset: 'koch' }, annotation: { text: '替换规则', position: 'top' } } },
  { lineId: 'rw-3', sectionId: 'rewrite', scene: { id: 'rw-iter', type: 'animation' }, lineState: { params: { preset: 'koch' }, annotation: { text: '迭代变长', position: 'bottom' } } },

  // ===== turtle (3) =====
  { lineId: 'tt-1', sectionId: 'turtle', scene: { id: 'tt-read', type: 'animation' }, lineState: { params: { preset: 'koch' }, annotation: { text: '海龟读字符', position: 'top' } } },
  { lineId: 'tt-2', sectionId: 'turtle', scene: { id: 'tt-move', type: 'animation' }, lineState: { params: { preset: 'sierpinski' }, annotation: { text: 'F前进 +-转向', position: 'bottom' } } },
  { lineId: 'tt-3', sectionId: 'turtle', scene: { id: 'tt-branch', type: 'animation' }, lineState: { params: { preset: 'plant' }, annotation: { text: '[ ] 实现分叉', position: 'bottom' } } },

  // ===== recursion (2) =====
  { lineId: 'rec-1', sectionId: 'recursion', scene: { id: 'rec-self', type: 'animation' }, lineState: { params: { preset: 'plant' }, annotation: { text: '枝似整树', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recursion', scene: { id: 'rec-fractal', type: 'animation' }, lineState: { params: { preset: 'plant' }, annotation: { text: '自相似秘密', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-preset', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'dragon' }, annotation: { text: '切换图形', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-rule', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'sierpinski' }, annotation: { text: '短规则·繁图形', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '重写+海龟', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-recur', type: 'summary' }, lineState: { annotation: { text: '分叉与递归', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
