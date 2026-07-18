/**
 * 行列式的几何意义讲解场景配置
 * 每句口播对应一个示例矩阵索引（params.matrixIndex，见 SAMPLE_MATRICES）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDeterminantGeometryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const determinantGeometryScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '行列式的几何意义', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-shear', type: 'animation' }, lineState: { params: { matrixIndex: 2 }, annotation: { text: '正方形变形', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-scale', type: 'animation' }, lineState: { params: { matrixIndex: 1 }, annotation: { text: '大小=行列式', position: 'bottom' } } },

  // ===== area (3) =====
  { lineId: 'def-1', sectionId: 'area', scene: { id: 'area-cols', type: 'animation' }, lineState: { params: { matrixIndex: 1 }, annotation: { text: '两列=两边向量', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'area', scene: { id: 'area-value', type: 'animation' }, lineState: { params: { matrixIndex: 1 }, annotation: { text: '面积=|det|', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'area', scene: { id: 'area-factor', type: 'animation' }, lineState: { params: { matrixIndex: 1 }, annotation: { text: '缩放倍数', position: 'bottom' } } },

  // ===== sign (3) =====
  { lineId: 'sign-1', sectionId: 'sign', scene: { id: 'sign-intro', type: 'animation' }, lineState: { params: { matrixIndex: 0 }, annotation: { text: '正负号', position: 'top' } } },
  { lineId: 'sign-2', sectionId: 'sign', scene: { id: 'sign-flip', type: 'animation' }, lineState: { params: { matrixIndex: 3 }, annotation: { text: 'det<0 翻转', position: 'bottom' } } },
  { lineId: 'sign-3', sectionId: 'sign', scene: { id: 'sign-hand', type: 'animation' }, lineState: { params: { matrixIndex: 3 }, annotation: { text: '左右手互换', position: 'bottom' } } },

  // ===== zero (2) =====
  { lineId: 'zero-1', sectionId: 'zero', scene: { id: 'zero-collapse', type: 'animation' }, lineState: { params: { matrixIndex: 4 }, annotation: { text: '压成线段', position: 'top' } } },
  { lineId: 'zero-2', sectionId: 'zero', scene: { id: 'zero-det', type: 'animation' }, lineState: { params: { matrixIndex: 4 }, annotation: { text: 'det=0 降维', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { matrixIndex: 2 }, annotation: { text: '拖动元素', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-flip', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { matrixIndex: 3 }, annotation: { text: '翻转或压扁', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '面积缩放因子', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-sign', type: 'summary' }, lineState: { annotation: { text: '符号与降维', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
