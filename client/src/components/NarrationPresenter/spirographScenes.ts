/**
 * 万花尺（内摆线）讲解场景配置
 * 每句口播对应一组 R/r/d 参数，驱动渲染器画出不同花纹
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSpirographState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const spirographScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '万花尺', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-roll', type: 'animation' }, lineState: { params: { R: 100, r: 40, d: 40 }, annotation: { text: '小圆内滚', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-curve', type: 'animation' }, lineState: { params: { R: 100, r: 40, d: 40 }, annotation: { text: '这就是内摆线', position: 'bottom' } } },

  // ===== equation (3) =====
  { lineId: 'def-1', sectionId: 'equation', scene: { id: 'def-params', type: 'animation' }, lineState: { params: { R: 105, r: 32, d: 50 }, annotation: { text: 'R、r、d', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'equation', scene: { id: 'def-x', type: 'animation' }, lineState: { params: { R: 105, r: 32, d: 50 }, annotation: { text: 'x 分量', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'equation', scene: { id: 'def-y', type: 'animation' }, lineState: { params: { R: 105, r: 32, d: 50 }, annotation: { text: 'y 分量', position: 'bottom' } } },

  // ===== petal (2) =====
  { lineId: 'pet-1', sectionId: 'petal', scene: { id: 'pet-ratio', type: 'animation' }, lineState: { params: { R: 96, r: 28, d: 44 }, annotation: { text: '齿数比', position: 'top' } } },
  { lineId: 'pet-2', sectionId: 'petal', scene: { id: 'pet-vary', type: 'animation' }, lineState: { params: { R: 120, r: 35, d: 60 }, annotation: { text: '花瓣随比值变', position: 'bottom' } } },

  // ===== closure (2) =====
  { lineId: 'clo-1', sectionId: 'closure', scene: { id: 'clo-gcd', type: 'animation' }, lineState: { params: { R: 100, r: 40, d: 40 }, annotation: { text: '花瓣数 = R / gcd', position: 'top' } } },
  { lineId: 'clo-2', sectionId: 'closure', scene: { id: 'clo-close', type: 'animation' }, lineState: { params: { R: 96, r: 28, d: 44 }, annotation: { text: '滚满整圈才闭合', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-tune', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { R: 120, r: 35, d: 60 }, annotation: { text: '调 R/r/d', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-flower', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { R: 105, r: 32, d: 50 }, annotation: { text: '独一无二的花', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '内摆线的轨迹', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-gcd', type: 'summary' }, lineState: { annotation: { text: '比值与 gcd', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
