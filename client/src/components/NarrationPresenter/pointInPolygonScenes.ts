/**
 * 点在多边形内 讲解场景配置
 * 每句口播对应多边形(params.poly)与判定规则(params.rule)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPointInPolygonState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pointInPolygonScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '点在多边形内', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-need', type: 'animation' }, lineState: { params: { poly: 'convex', rule: 'ray' }, annotation: { text: '需要明确规则', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-two', type: 'animation' }, lineState: { params: { poly: 'concave', rule: 'ray' }, annotation: { text: '两种办法', position: 'bottom' } } },

  // ===== ray (3) =====
  { lineId: 'ray-1', sectionId: 'ray', scene: { id: 'ray-shoot', type: 'animation' }, lineState: { params: { poly: 'concave', rule: 'ray' }, annotation: { text: '向右发射线', position: 'top' } } },
  { lineId: 'ray-2', sectionId: 'ray', scene: { id: 'ray-count', type: 'animation' }, lineState: { params: { poly: 'concave', rule: 'ray' }, annotation: { text: '数穿过的边', position: 'bottom' } } },
  { lineId: 'ray-3', sectionId: 'ray', scene: { id: 'ray-parity', type: 'animation' }, lineState: { params: { poly: 'concave', rule: 'ray' }, annotation: { text: '奇内偶外', position: 'bottom' } } },

  // ===== winding (3) =====
  { lineId: 'wind-1', sectionId: 'winding', scene: { id: 'wind-look', type: 'animation' }, lineState: { params: { poly: 'convex', rule: 'winding' }, annotation: { text: '盯着边界走一圈', position: 'top' } } },
  { lineId: 'wind-2', sectionId: 'winding', scene: { id: 'wind-turns', type: 'animation' }, lineState: { params: { poly: 'convex', rule: 'winding' }, annotation: { text: '绕了几圈', position: 'bottom' } } },
  { lineId: 'wind-3', sectionId: 'winding', scene: { id: 'wind-nonzero', type: 'animation' }, lineState: { params: { poly: 'concave', rule: 'winding' }, annotation: { text: '非零即在内', position: 'bottom' } } },

  // ===== concave (3) =====
  { lineId: 'con-1', sectionId: 'concave', scene: { id: 'con-convex', type: 'animation' }, lineState: { params: { poly: 'convex', rule: 'ray' }, annotation: { text: '凸多边形一致', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'concave', scene: { id: 'con-star-ray', type: 'animation' }, lineState: { params: { poly: 'star', rule: 'ray' }, annotation: { text: '自交五角星', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'concave', scene: { id: 'con-star-wind', type: 'animation' }, lineState: { params: { poly: 'star', rule: 'winding' }, annotation: { text: '星芯结论相反', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-poly', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { poly: 'concave', rule: 'ray' }, annotation: { text: '切换多边形', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-rule', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { poly: 'star', rule: 'winding' }, annotation: { text: '切换规则看反转', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '两法判内外', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: '碰撞与落区', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
