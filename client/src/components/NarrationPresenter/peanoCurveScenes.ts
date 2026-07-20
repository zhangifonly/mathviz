/**
 * 皮亚诺曲线讲解场景配置
 * 每句口播对应曲线阶数（params.order）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPeanoCurveState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const peanoCurveScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '皮亚诺曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fill', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '一条线填满正方形？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-1890', type: 'animation' }, lineState: { params: { order: 2 }, annotation: { text: '皮亚诺 1890', position: 'bottom' } } },

  // ===== recursion (3) =====
  { lineId: 'rec-1', sectionId: 'recursion', scene: { id: 'rec-grid', type: 'animation' }, lineState: { params: { order: 1 }, annotation: { text: '3x3 九宫格', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recursion', scene: { id: 'rec-self', type: 'animation' }, lineState: { params: { order: 2 }, annotation: { text: '每格重复花样', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'recursion', scene: { id: 'rec-dense', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '每阶点数九倍', position: 'bottom' } } },

  // ===== continuous (3) =====
  { lineId: 'con-1', sectionId: 'continuous', scene: { id: 'con-conn', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '一笔画成', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'continuous', scene: { id: 'con-corner', type: 'animation' }, lineState: { params: { order: 4 }, annotation: { text: '处处急转弯', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'continuous', scene: { id: 'con-nondiff', type: 'animation' }, lineState: { params: { order: 4 }, annotation: { text: '连续不可导', position: 'bottom' } } },

  // ===== hilbert (3) =====
  { lineId: 'hil-1', sectionId: 'hilbert', scene: { id: 'hil-2x2', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '希尔伯特 2x2', position: 'top' } } },
  { lineId: 'hil-2', sectionId: 'hilbert', scene: { id: 'hil-same', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '都是空间填充', position: 'bottom' } } },
  { lineId: 'hil-3', sectionId: 'hilbert', scene: { id: 'hil-index', type: 'animation' }, lineState: { params: { order: 4 }, annotation: { text: '用于图像索引', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-order', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 4 }, annotation: { text: '调整阶数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-color', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 3 }, annotation: { text: '看遍历顺序', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '3x3 自相似填充', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-nondiff', type: 'summary' }, lineState: { annotation: { text: '连续却不可导', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
