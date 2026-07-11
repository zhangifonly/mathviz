/**
 * 抛物线与光学讲解场景配置
 * 每句口播对应焦准距 params.p，与 narration 的 section/line id 一一对应
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultParabolaOpticsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 8,
  isAnimating: false,
  highlightedElements: [],
}

export const parabolaOpticsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-light', type: 'title' }, lineState: { annotation: { text: '抛物线与光学', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-dish', type: 'animation' }, lineState: { params: { p: 1, rays: 9 }, annotation: { text: '卫星天线聚信号', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-curve', type: 'animation' }, lineState: { params: { p: 1, rays: 9 }, annotation: { text: '答案是抛物线', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-dist', type: 'animation' }, lineState: { params: { p: 1, rays: 0 }, annotation: { text: '到焦点=到准线', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-fd', type: 'animation' }, lineState: { params: { p: 1, rays: 0 }, annotation: { text: '焦点与准线', position: 'top' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-std', type: 'animation' }, lineState: { params: { p: 1, rays: 0 }, annotation: { text: 'x²=4py', position: 'bottom' } } },

  // ===== reflect (3) =====
  { lineId: 'refl-1', sectionId: 'reflect', scene: { id: 'refl-in', type: 'animation' }, lineState: { params: { p: 1, rays: 9 }, annotation: { text: '平行光竖直射入', position: 'top' } } },
  { lineId: 'refl-2', sectionId: 'reflect', scene: { id: 'refl-bounce', type: 'animation' }, lineState: { params: { p: 1, rays: 9 }, annotation: { text: '入射角=反射角', position: 'top' } } },
  { lineId: 'refl-3', sectionId: 'reflect', scene: { id: 'refl-focus', type: 'animation' }, lineState: { params: { p: 1, rays: 9 }, annotation: { text: '全部汇聚焦点', position: 'bottom' } } },

  // ===== why (2) =====
  { lineId: 'why-1', sectionId: 'why', scene: { id: 'why-tan', type: 'animation' }, lineState: { params: { p: 1, rays: 5 }, annotation: { text: '切线角度的奥秘', position: 'top' } } },
  { lineId: 'why-2', sectionId: 'why', scene: { id: 'why-lamp', type: 'animation' }, lineState: { params: { p: 1, rays: 9 }, annotation: { text: '倒过来就是探照灯', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-p', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 2, rays: 9 }, annotation: { text: '调节焦准距 p', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-keep', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 0.5, rays: 9 }, annotation: { text: '始终聚于焦点', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-def', type: 'summary' }, lineState: { annotation: { text: '焦点=准线等距', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-refl', type: 'summary' }, lineState: { annotation: { text: '平行光↔焦点', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
