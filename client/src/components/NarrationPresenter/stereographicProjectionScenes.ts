/**
 * 球极投影讲解场景配置
 * 每句口播对应球面旋转角 params.rot（弧度）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultStereographicProjectionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const stereographicProjectionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '球极投影', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { rot: 0.2 }, annotation: { text: '弯的球 vs 直的面', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { rot: 0.4 }, annotation: { text: '优雅的投影法', position: 'bottom' } } },

  // ===== project (4) =====
  { lineId: 'proj-1', sectionId: 'project', scene: { id: 'proj-north', type: 'animation' }, lineState: { params: { rot: 0.4 }, annotation: { text: '北极当光源', position: 'top' } } },
  { lineId: 'proj-2', sectionId: 'project', scene: { id: 'proj-ray', type: 'animation' }, lineState: { params: { rot: 0.6 }, annotation: { text: '射线穿到平面', position: 'bottom' } } },
  { lineId: 'proj-3', sectionId: 'project', scene: { id: 'proj-image', type: 'animation' }, lineState: { params: { rot: 0.6 }, annotation: { text: '交点就是像', position: 'bottom' } } },
  { lineId: 'proj-4', sectionId: 'project', scene: { id: 'proj-formula', type: 'animation' }, lineState: { params: { rot: 0.8 }, annotation: { text: 'X=x/(1-z)', position: 'top' } } },

  // ===== conformal (3) =====
  { lineId: 'conf-1', sectionId: 'conformal', scene: { id: 'conf-angle', type: 'animation' }, lineState: { params: { rot: 1.0 }, annotation: { text: '角度不变', position: 'top' } } },
  { lineId: 'conf-2', sectionId: 'conformal', scene: { id: 'conf-keep', type: 'animation' }, lineState: { params: { rot: 1.2 }, annotation: { text: '几度仍是几度', position: 'bottom' } } },
  { lineId: 'conf-3', sectionId: 'conformal', scene: { id: 'conf-name', type: 'animation' }, lineState: { params: { rot: 1.4 }, annotation: { text: '共形映射', position: 'bottom' } } },

  // ===== circle (3) =====
  { lineId: 'circ-1', sectionId: 'circle', scene: { id: 'circ-c2c', type: 'animation' }, lineState: { params: { rot: 1.6 }, annotation: { text: '圆映射成圆', position: 'top' } } },
  { lineId: 'circ-2', sectionId: 'circle', scene: { id: 'circ-line', type: 'animation' }, lineState: { params: { rot: 1.8 }, annotation: { text: '过北极的圆变直线', position: 'bottom' } } },
  { lineId: 'circ-3', sectionId: 'circle', scene: { id: 'circ-grid', type: 'animation' }, lineState: { params: { rot: 2.0 }, annotation: { text: '同心圆与放射线', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-rotate', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rot: 2.6 }, annotation: { text: '旋转球面', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-plane', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rot: 3.2 }, annotation: { text: '看平面上的像', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '北极投射', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-props', type: 'summary' }, lineState: { annotation: { text: '保角·圆变圆', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
