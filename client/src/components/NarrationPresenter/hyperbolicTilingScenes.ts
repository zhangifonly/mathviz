/**
 * 双曲镶嵌讲解场景配置
 * 每句口播对应镶嵌类型（params.p / params.q）与翻折层数（params.layers）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHyperbolicTilingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const hyperbolicTilingScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '双曲镶嵌', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-plane', type: 'animation' }, lineState: { params: { p: 5, q: 4, layers: 2 }, annotation: { text: '双曲平面', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-fill', type: 'animation' }, lineState: { params: { p: 5, q: 4, layers: 3 }, annotation: { text: '铺满圆盘', position: 'bottom' } } },

  // ===== plane (3) =====
  { lineId: 'def-1', sectionId: 'plane', scene: { id: 'def-disk', type: 'animation' }, lineState: { params: { p: 5, q: 4, layers: 2 }, annotation: { text: '庞加莱圆盘', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'plane', scene: { id: 'def-boundary', type: 'animation' }, lineState: { params: { p: 5, q: 4, layers: 4 }, annotation: { text: '边界=无穷远', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'plane', scene: { id: 'def-geodesic', type: 'animation' }, lineState: { params: { p: 7, q: 3, layers: 2 }, annotation: { text: '直线是圆弧', position: 'bottom' } } },

  // ===== tiling (3) =====
  { lineId: 'pq-1', sectionId: 'tiling', scene: { id: 'pq-notation', type: 'animation' }, lineState: { params: { p: 5, q: 4, layers: 3 }, annotation: { text: '{p,q} 记号', position: 'top' } } },
  { lineId: 'pq-2', sectionId: 'tiling', scene: { id: 'pq-flat', type: 'animation' }, lineState: { params: { p: 7, q: 3, layers: 2 }, annotation: { text: '平面仅三种', position: 'bottom' } } },
  { lineId: 'pq-3', sectionId: 'tiling', scene: { id: 'pq-cond', type: 'animation' }, lineState: { params: { p: 7, q: 3, layers: 3 }, annotation: { text: '(p-2)(q-2)>4', position: 'bottom' } } },

  // ===== equal (3) =====
  { lineId: 'eq-1', sectionId: 'equal', scene: { id: 'eq-look', type: 'animation' }, lineState: { params: { p: 5, q: 4, layers: 4 }, annotation: { text: '看似大小不一', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equal', scene: { id: 'eq-same', type: 'animation' }, lineState: { params: { p: 5, q: 4, layers: 4 }, annotation: { text: '双曲下全等大', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equal', scene: { id: 'eq-invert', type: 'animation' }, lineState: { params: { p: 7, q: 3, layers: 4 }, annotation: { text: '圆反演翻折', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 7, q: 3, layers: 3 }, annotation: { text: '切换镶嵌型', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-layers', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 5, q: 4, layers: 4 }, annotation: { text: '增加层数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-finite', type: 'summary' }, lineState: { annotation: { text: '有限装无限', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-tiling', type: 'summary' }, lineState: { annotation: { text: '{p,q} 铺满', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
