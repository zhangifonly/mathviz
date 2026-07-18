/**
 * B样条曲线讲解场景配置
 * 每句口播对应一个高亮的控制点(params.highlight)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBSplineState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const bSplineScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'B样条曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-jag', type: 'animation' }, lineState: { params: { highlight: -1 }, annotation: { text: '直连会有折角', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { highlight: -1 }, annotation: { text: '光滑又可控', position: 'bottom' } } },

  // ===== control (3) =====
  { lineId: 'ctrl-1', sectionId: 'control', scene: { id: 'ctrl-poly', type: 'animation' }, lineState: { params: { highlight: 0 }, annotation: { text: '控制多边形', position: 'top' } } },
  { lineId: 'ctrl-2', sectionId: 'control', scene: { id: 'ctrl-attract', type: 'animation' }, lineState: { params: { highlight: 2 }, annotation: { text: '曲线不过控制点', position: 'bottom' } } },
  { lineId: 'ctrl-3', sectionId: 'control', scene: { id: 'ctrl-shape', type: 'animation' }, lineState: { params: { highlight: 4 }, annotation: { text: '决定走向', position: 'bottom' } } },

  // ===== basis (3) =====
  { lineId: 'basis-1', sectionId: 'basis', scene: { id: 'basis-weight', type: 'animation' }, lineState: { params: { highlight: 1 }, annotation: { text: '每点一条基函数', position: 'top' } } },
  { lineId: 'basis-2', sectionId: 'basis', scene: { id: 'basis-unity', type: 'animation' }, lineState: { params: { highlight: 3 }, annotation: { text: '求和恒为1', position: 'bottom' } } },
  { lineId: 'basis-3', sectionId: 'basis', scene: { id: 'basis-local', type: 'animation' }, lineState: { params: { highlight: 3 }, annotation: { text: '局部支撑', position: 'bottom' } } },

  // ===== compare (3) =====
  { lineId: 'cmp-1', sectionId: 'compare', scene: { id: 'cmp-bezier', type: 'animation' }, lineState: { params: { highlight: -1 }, annotation: { text: '贝塞尔:全局影响', position: 'top' } } },
  { lineId: 'cmp-2', sectionId: 'compare', scene: { id: 'cmp-bspline', type: 'animation' }, lineState: { params: { highlight: 2 }, annotation: { text: 'B样条:只动局部', position: 'bottom' } } },
  { lineId: 'cmp-3', sectionId: 'compare', scene: { id: 'cmp-complex', type: 'animation' }, lineState: { params: { highlight: 5 }, annotation: { text: '复杂形状更从容', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { highlight: 2 }, annotation: { text: '拖动控制点', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-local', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { highlight: 1 }, annotation: { text: '远端不动', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '控制点+基函数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-local', type: 'summary' }, lineState: { annotation: { text: '局部支撑更灵活', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
