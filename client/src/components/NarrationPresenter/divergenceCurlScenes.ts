/**
 * 散度与旋度讲解场景配置
 * 每句口播对应向量场（params.field）与网格密度（params.grid）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDivergenceCurlState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const divergenceCurlScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '散度与旋度', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-arrows', type: 'animation' }, lineState: { params: { field: 'source', grid: 7 }, annotation: { text: '每点一支箭头', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-ask', type: 'animation' }, lineState: { params: { field: 'rotation', grid: 11 }, annotation: { text: '喷发还是打旋？', position: 'bottom' } } },

  // ===== divergence (3) =====
  { lineId: 'div-1', sectionId: 'divergence', scene: { id: 'div-def', type: 'animation' }, lineState: { params: { field: 'source', grid: 11 }, annotation: { text: '发散或汇聚', position: 'top' } } },
  { lineId: 'div-2', sectionId: 'divergence', scene: { id: 'div-source', type: 'animation' }, lineState: { params: { field: 'source', grid: 11 }, annotation: { text: '正散度=源(红)', position: 'bottom' } } },
  { lineId: 'div-3', sectionId: 'divergence', scene: { id: 'div-sink', type: 'animation' }, lineState: { params: { field: 'sink', grid: 11 }, annotation: { text: '负散度=汇(蓝)', position: 'bottom' } } },

  // ===== curl (3) =====
  { lineId: 'curl-1', sectionId: 'curl', scene: { id: 'curl-def', type: 'animation' }, lineState: { params: { field: 'rotation', grid: 11 }, annotation: { text: '流动爱打转', position: 'top' } } },
  { lineId: 'curl-2', sectionId: 'curl', scene: { id: 'curl-sign', type: 'animation' }, lineState: { params: { field: 'rotation', grid: 11 }, annotation: { text: '逆时针为正', position: 'bottom' } } },
  { lineId: 'curl-3', sectionId: 'curl', scene: { id: 'curl-leaf', type: 'animation' }, lineState: { params: { field: 'rotation', grid: 15 }, annotation: { text: '小叶子的自转', position: 'bottom' } } },

  // ===== fields (3) =====
  { lineId: 'field-1', sectionId: 'fields', scene: { id: 'field-src', type: 'animation' }, lineState: { params: { field: 'source', grid: 11 }, annotation: { text: '源场:散度正', position: 'top' } } },
  { lineId: 'field-2', sectionId: 'fields', scene: { id: 'field-rot', type: 'animation' }, lineState: { params: { field: 'rotation', grid: 11 }, annotation: { text: '旋转场:旋度不零', position: 'bottom' } } },
  { lineId: 'field-3', sectionId: 'fields', scene: { id: 'field-shear', type: 'animation' }, lineState: { params: { field: 'shear', grid: 11 }, annotation: { text: '剪切场:藏旋度', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'sink', grid: 11 }, annotation: { text: '切换看变化', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-grid', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'shear', grid: 15 }, annotation: { text: '加密网格', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '源汇与涡旋', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-physics', type: 'summary' }, lineState: { annotation: { text: '物理的语言', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
