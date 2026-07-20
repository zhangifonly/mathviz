/**
 * 行进方块讲解场景配置
 * 每句口播对应一个等高线阈值（params.threshold）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMarchingSquaresState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const marchingSquaresScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '行进方块', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-grid', type: 'animation' }, lineState: { params: { threshold: 0.45 }, annotation: { text: '离散的数值网格', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-contour', type: 'animation' }, lineState: { params: { threshold: 0.45 }, annotation: { text: '连成平滑等高线', position: 'bottom' } } },

  // ===== sample (3) =====
  { lineId: 'def-1', sectionId: 'sample', scene: { id: 'def-cells', type: 'animation' }, lineState: { params: { threshold: 0.45 }, annotation: { text: '切成小方格', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'sample', scene: { id: 'def-height', type: 'animation' }, lineState: { params: { threshold: 0.45 }, annotation: { text: '格点=海拔高度', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'sample', scene: { id: 'def-thresh', type: 'animation' }, lineState: { params: { threshold: 0.65 }, annotation: { text: '设定阈值', position: 'bottom' } } },

  // ===== lookup (3) =====
  { lineId: 'case-1', sectionId: 'lookup', scene: { id: 'case-bits', type: 'animation' }, lineState: { params: { threshold: 0.45 }, annotation: { text: '四角记 0 或 1', position: 'top' } } },
  { lineId: 'case-2', sectionId: 'lookup', scene: { id: 'case-16', type: 'animation' }, lineState: { params: { threshold: 0.45 }, annotation: { text: '共 16 种组合', position: 'bottom' } } },
  { lineId: 'case-3', sectionId: 'lookup', scene: { id: 'case-table', type: 'animation' }, lineState: { params: { threshold: 0.45 }, annotation: { text: '查表决定连边', position: 'bottom' } } },

  // ===== interp (3) =====
  { lineId: 'lerp-1', sectionId: 'interp', scene: { id: 'lerp-where', type: 'animation' }, lineState: { params: { threshold: 0.45 }, annotation: { text: '交点在哪？', position: 'top' } } },
  { lineId: 'lerp-2', sectionId: 'interp', scene: { id: 'lerp-interp', type: 'animation' }, lineState: { params: { threshold: 0.45 }, annotation: { text: '端点值线性插值', position: 'bottom' } } },
  { lineId: 'lerp-3', sectionId: 'interp', scene: { id: 'lerp-smooth', type: 'animation' }, lineState: { params: { threshold: 0.55 }, annotation: { text: '锯齿变顺滑', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { threshold: 0.35 }, annotation: { text: '拖动阈值', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-peak', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { threshold: 0.85 }, annotation: { text: '贴近山峰', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '判角·查表·插值', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: '等高·等压·等值面', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
