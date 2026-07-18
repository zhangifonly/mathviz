/**
 * 皮克定理讲解场景配置
 * 每句口播对应预设多边形索引（params.idx）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPickTheoremState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pickTheoremScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '皮克定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-count', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '数格点即可求面积', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '这就是皮克定理', position: 'bottom' } } },

  // ===== points (3) =====
  { lineId: 'def-1', sectionId: 'points', scene: { id: 'def-interior', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '内部点(实心)', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'points', scene: { id: 'def-boundary', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '边界点(空心)', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'points', scene: { id: 'def-ib', type: 'animation' }, lineState: { params: { idx: 2 }, annotation: { text: 'I 与 B', position: 'bottom' } } },

  // ===== formula (3) =====
  { lineId: 'form-1', sectionId: 'formula', scene: { id: 'form-main', type: 'animation' }, lineState: { params: { idx: 2 }, annotation: { text: 'A = I + B/2 - 1', position: 'top' } } },
  { lineId: 'form-2', sectionId: 'formula', scene: { id: 'form-weight', type: 'animation' }, lineState: { params: { idx: 2 }, annotation: { text: '边界点算半份', position: 'bottom' } } },
  { lineId: 'form-3', sectionId: 'formula', scene: { id: 'form-minus1', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '闭合修正 -1', position: 'bottom' } } },

  // ===== shoelace (3) =====
  { lineId: 'sl-1', sectionId: 'shoelace', scene: { id: 'sl-intro', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '鞋带公式', position: 'top' } } },
  { lineId: 'sl-2', sectionId: 'shoelace', scene: { id: 'sl-cross', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '坐标交叉相乘', position: 'bottom' } } },
  { lineId: 'sl-3', sectionId: 'shoelace', scene: { id: 'sl-match', type: 'animation' }, lineState: { params: { idx: 2 }, annotation: { text: '两者分毫不差', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 3 }, annotation: { text: '切换多边形', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-verify', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 3 }, annotation: { text: '面积始终相等', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '面积连接格点', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: 'I + B/2 - 1', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
