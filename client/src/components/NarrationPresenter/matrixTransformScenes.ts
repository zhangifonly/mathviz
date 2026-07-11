/**
 * 矩阵变换讲解场景配置
 * 每句口播对应一个变换预设（params.optionId）
 * lineId / sectionId 与 narration 稿件严格一一对应
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMatrixTransformState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const matrixTransformScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '矩阵变换', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-machine', type: 'animation' }, lineState: { params: { optionId: 'rotate' }, annotation: { text: '一台变形机器', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-grid', type: 'animation' }, lineState: { params: { optionId: 'shear' }, annotation: { text: '用网格看变换', position: 'bottom' } } },

  // ===== columns (3) =====
  { lineId: 'col-1', sectionId: 'columns', scene: { id: 'col-basis', type: 'animation' }, lineState: { params: { optionId: 'rotate' }, annotation: { text: '基向量 i、j', position: 'top' } } },
  { lineId: 'col-2', sectionId: 'columns', scene: { id: 'col-first', type: 'animation' }, lineState: { params: { optionId: 'rotate' }, annotation: { text: '第一列 = i 的落点', position: 'top' } } },
  { lineId: 'col-3', sectionId: 'columns', scene: { id: 'col-second', type: 'animation' }, lineState: { params: { optionId: 'shear' }, annotation: { text: '第二列 = j 的落点', position: 'bottom' } } },

  // ===== linearity (3) =====
  { lineId: 'lin-1', sectionId: 'linearity', scene: { id: 'lin-parallel', type: 'animation' }, lineState: { params: { optionId: 'shear' }, annotation: { text: '网格平行且等距', position: 'top' } } },
  { lineId: 'lin-2', sectionId: 'linearity', scene: { id: 'lin-origin', type: 'animation' }, lineState: { params: { optionId: 'shear' }, annotation: { text: '原点不动', position: 'bottom' } } },
  { lineId: 'lin-3', sectionId: 'linearity', scene: { id: 'lin-combo', type: 'animation' }, lineState: { params: { optionId: 'scale' }, annotation: { text: '坐标乘两列', position: 'bottom' } } },

  // ===== determinant (3) =====
  { lineId: 'det-1', sectionId: 'determinant', scene: { id: 'det-square', type: 'animation' }, lineState: { params: { optionId: 'scale' }, annotation: { text: '单位正方形→平行四边形', position: 'top' } } },
  { lineId: 'det-2', sectionId: 'determinant', scene: { id: 'det-area', type: 'animation' }, lineState: { params: { optionId: 'scale' }, annotation: { text: '面积缩放倍数', position: 'top' } } },
  { lineId: 'det-3', sectionId: 'determinant', scene: { id: 'det-flip', type: 'animation' }, lineState: { params: { optionId: 'reflect' }, annotation: { text: '负行列式=翻转', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-scale', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optionId: 'scale' }, annotation: { text: 'det = 4', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-squash', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optionId: 'squash' }, annotation: { text: 'det = 0，压成一条线', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-columns', type: 'summary' }, lineState: { annotation: { text: '矩阵 = 线性变换', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-det', type: 'summary' }, lineState: { annotation: { text: '行列式 = 面积缩放', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
