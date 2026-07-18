/**
 * 斯托克斯定理讲解场景配置
 * params.field 选向量场（rotation/shear/source/nonuniform），params.region 选区域（rect/circle）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultStokesTheoremState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const stokesTheoremScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '斯托克斯定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-loop', type: 'animation' }, lineState: { params: { field: 'rotation', region: 'circle' }, annotation: { text: '边界的转动', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-link', type: 'animation' }, lineState: { params: { field: 'rotation', region: 'circle' }, annotation: { text: '边界=内部之和', position: 'bottom' } } },

  // ===== circulation (3) =====
  { lineId: 'circ-1', sectionId: 'circulation', scene: { id: 'circ-walk', type: 'animation' }, lineState: { params: { field: 'rotation', region: 'rect' }, annotation: { text: '沿边界积分', position: 'top' } } },
  { lineId: 'circ-2', sectionId: 'circulation', scene: { id: 'circ-def', type: 'animation' }, lineState: { params: { field: 'rotation', region: 'rect' }, annotation: { text: '环量 ∮F·dr', position: 'bottom' } } },
  { lineId: 'circ-3', sectionId: 'circulation', scene: { id: 'circ-dir', type: 'animation' }, lineState: { params: { field: 'rotation', region: 'circle' }, annotation: { text: '逆时针为正', position: 'bottom' } } },

  // ===== curl (3) =====
  { lineId: 'curl-1', sectionId: 'curl', scene: { id: 'curl-point', type: 'animation' }, lineState: { params: { field: 'shear', region: 'rect' }, annotation: { text: '∂Q/∂x − ∂P/∂y', position: 'top' } } },
  { lineId: 'curl-2', sectionId: 'curl', scene: { id: 'curl-heat', type: 'animation' }, lineState: { params: { field: 'nonuniform', region: 'rect' }, annotation: { text: '红正蓝负', position: 'bottom' } } },
  { lineId: 'curl-3', sectionId: 'curl', scene: { id: 'curl-sum', type: 'animation' }, lineState: { params: { field: 'nonuniform', region: 'circle' }, annotation: { text: '旋度二重积分', position: 'bottom' } } },

  // ===== theorem (3) =====
  { lineId: 'thm-1', sectionId: 'theorem', scene: { id: 'thm-equal', type: 'animation' }, lineState: { params: { field: 'rotation', region: 'circle' }, annotation: { text: '环量 = 旋度积分', position: 'top' } } },
  { lineId: 'thm-2', sectionId: 'theorem', scene: { id: 'thm-green', type: 'animation' }, lineState: { params: { field: 'rotation', region: 'rect' }, annotation: { text: '格林定理', position: 'bottom' } } },
  { lineId: 'thm-3', sectionId: 'theorem', scene: { id: 'thm-cancel', type: 'animation' }, lineState: { params: { field: 'shear', region: 'rect' }, annotation: { text: '内部边界抵消', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'source', region: 'circle' }, annotation: { text: '切换向量场', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-verify', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'nonuniform', region: 'rect' }, annotation: { text: '两值始终相等', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '边界连内部', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-echo', type: 'summary' }, lineState: { annotation: { text: '微积分基本定理的回响', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '联系之美，下次再见！', position: 'bottom' } } },
]
