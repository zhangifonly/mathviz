/**
 * 列维C形曲线讲解场景配置
 * 每句口播对应递归阶数（params.order）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLevyCCurveState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const levyCCurveScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '列维C形曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { order: 12 }, annotation: { text: '保罗·列维', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-simple', type: 'animation' }, lineState: { params: { order: 8 }, annotation: { text: '规则极简', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'def-1', sectionId: 'rule', scene: { id: 'def-hypot', type: 'animation' }, lineState: { params: { order: 1 }, annotation: { text: '线段=斜边', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'rule', scene: { id: 'def-legs', type: 'animation' }, lineState: { params: { order: 2 }, annotation: { text: '换成两直角边', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'rule', scene: { id: 'def-stroke', type: 'animation' }, lineState: { params: { order: 4 }, annotation: { text: '基本笔画', position: 'bottom' } } },

  // ===== recurse (3) =====
  { lineId: 'rec-1', sectionId: 'recurse', scene: { id: 'rec-repeat', type: 'animation' }, lineState: { params: { order: 6 }, annotation: { text: '重复替换', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recurse', scene: { id: 'rec-double', type: 'animation' }, lineState: { params: { order: 10 }, annotation: { text: '线段翻倍', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'recurse', scene: { id: 'rec-self', type: 'animation' }, lineState: { params: { order: 14 }, annotation: { text: '处处自相似', position: 'bottom' } } },

  // ===== dimension (2) =====
  { lineId: 'dim-1', sectionId: 'dimension', scene: { id: 'dim-fill', type: 'animation' }, lineState: { params: { order: 16 }, annotation: { text: '维数≈2', position: 'top' } } },
  { lineId: 'dim-2', sectionId: 'dimension', scene: { id: 'dim-complex', type: 'animation' }, lineState: { params: { order: 16 }, annotation: { text: '一维近二维', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-order', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 12 }, annotation: { text: '调整阶数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-detail', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 16 }, annotation: { text: '细节无穷', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '两条直角边', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-fractal', type: 'summary' }, lineState: { annotation: { text: '递归成分形', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '简单孕育复杂！', position: 'bottom' } } },
]
