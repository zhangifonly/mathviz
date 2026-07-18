/**
 * 分治算法讲解场景配置
 * params.depth 高亮递归层，params.merge 表示进入合并阶段
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDivideConquerState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const divideConquerScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '分治算法', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-split', type: 'animation' }, lineState: { params: { depth: 0, merge: 0 }, annotation: { text: '一分为二', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-cards', type: 'animation' }, lineState: { params: { depth: 1, merge: 0 }, annotation: { text: '分堆再合并', position: 'bottom' } } },

  // ===== divide (3) =====
  { lineId: 'div-1', sectionId: 'divide', scene: { id: 'div-cut', type: 'animation' }, lineState: { params: { depth: 1, merge: 0 }, annotation: { text: '从中间切开', position: 'top' } } },
  { lineId: 'div-2', sectionId: 'divide', scene: { id: 'div-deep', type: 'animation' }, lineState: { params: { depth: 2, merge: 0 }, annotation: { text: '继续二分', position: 'bottom' } } },
  { lineId: 'div-3', sectionId: 'divide', scene: { id: 'div-leaf', type: 'animation' }, lineState: { params: { depth: 3, merge: 0 }, annotation: { text: '单元素=递归终点', position: 'bottom' } } },

  // ===== conquer (2) =====
  { lineId: 'con-1', sectionId: 'conquer', scene: { id: 'con-same', type: 'animation' }, lineState: { params: { depth: 2, merge: 0 }, annotation: { text: '同法解子问题', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'conquer', scene: { id: 'con-tree', type: 'animation' }, lineState: { params: { depth: -1, merge: 0 }, annotation: { text: '完整递归树', position: 'bottom' } } },

  // ===== merge (3) =====
  { lineId: 'mer-1', sectionId: 'merge', scene: { id: 'mer-pair', type: 'animation' }, lineState: { params: { depth: 3, merge: 1 }, annotation: { text: '两段拼一段', position: 'top' } } },
  { lineId: 'mer-2', sectionId: 'merge', scene: { id: 'mer-ptr', type: 'animation' }, lineState: { params: { depth: 2, merge: 1 }, annotation: { text: '双指针归并', position: 'bottom' } } },
  { lineId: 'mer-3', sectionId: 'merge', scene: { id: 'mer-root', type: 'animation' }, lineState: { params: { depth: 0, merge: 1 }, annotation: { text: '合并回根', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-expand', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 3, merge: 0 }, annotation: { text: '逐层展开', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-collect', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 0, merge: 1 }, annotation: { text: '合并回收', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '分解·求解·合并', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apps', type: 'summary' }, lineState: { annotation: { text: '经典应用', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '化整为零，聚零为整！', position: 'bottom' } } },
]
