/**
 * 等宽曲线 勒洛多边形 讲解场景配置
 * 每句口播对应边数(params.sides) 与是否滚动(params.roll)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultReuleauxState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const reuleauxScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '等宽曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-notcircle', type: 'animation' }, lineState: { params: { sides: 3 }, annotation: { text: '不止是圆', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-tri', type: 'animation' }, lineState: { params: { sides: 3 }, annotation: { text: '鼓肚子三角形', position: 'bottom' } } },

  // ===== construct (3) =====
  { lineId: 'def-1', sectionId: 'construct', scene: { id: 'def-arc', type: 'animation' }, lineState: { params: { sides: 3 }, annotation: { text: '以顶点为圆心画弧', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'construct', scene: { id: 'def-join', type: 'animation' }, lineState: { params: { sides: 3 }, annotation: { text: '三弧相接', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'construct', scene: { id: 'def-odd', type: 'animation' }, lineState: { params: { sides: 5 }, annotation: { text: '五边、七边亦可', position: 'bottom' } } },

  // ===== width (3) =====
  { lineId: 'wid-1', sectionId: 'width', scene: { id: 'wid-clamp', type: 'animation' }, lineState: { params: { sides: 3 }, annotation: { text: '两平行线夹住', position: 'top' } } },
  { lineId: 'wid-2', sectionId: 'width', scene: { id: 'wid-const', type: 'animation' }, lineState: { params: { sides: 3 }, annotation: { text: '任意方向等宽', position: 'bottom' } } },
  { lineId: 'wid-3', sectionId: 'width', scene: { id: 'wid-barbier', type: 'animation' }, lineState: { params: { sides: 5 }, annotation: { text: '周长 = π·宽', position: 'bottom' } } },

  // ===== roll (3) =====
  { lineId: 'roll-1', sectionId: 'roll', scene: { id: 'roll-go', type: 'animation' }, lineState: { params: { sides: 3, roll: true }, annotation: { text: '高度不变', position: 'top' } } },
  { lineId: 'roll-2', sectionId: 'roll', scene: { id: 'roll-wobble', type: 'animation' }, lineState: { params: { sides: 3, roll: true }, annotation: { text: '形心颠簸', position: 'bottom' } } },
  { lineId: 'roll-3', sectionId: 'roll', scene: { id: 'roll-apply', type: 'animation' }, lineState: { params: { sides: 7 }, annotation: { text: '钻方孔·异形硬币', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-sides', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sides: 5 }, annotation: { text: '切换边数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-roll', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sides: 3, roll: true }, annotation: { text: '观察滚动', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '处处等宽', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-barbier', type: 'summary' }, lineState: { annotation: { text: '巴比尔定理', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
