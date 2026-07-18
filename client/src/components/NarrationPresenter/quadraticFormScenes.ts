/**
 * 二次型讲解场景配置
 * 每句口播对应一组系数（params.a / params.b / params.c）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultQuadraticFormState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const quadraticFormScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '二次型', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-form', type: 'animation' }, lineState: { params: { a: 2, b: 0.5, c: 1 }, annotation: { text: 'a x² + 2b xy + c y²', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-surface', type: 'animation' }, lineState: { params: { a: 2, b: 0.5, c: 1 }, annotation: { text: '一整张曲面', position: 'bottom' } } },

  // ===== matrix (3) =====
  { lineId: 'def-1', sectionId: 'matrix', scene: { id: 'def-cross', type: 'animation' }, lineState: { params: { a: 2, b: 1, c: 1 }, annotation: { text: '交叉项', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'matrix', scene: { id: 'def-matrix', type: 'animation' }, lineState: { params: { a: 2, b: 1, c: 1 }, annotation: { text: 'M = [[a,b],[b,c]]', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'matrix', scene: { id: 'def-vmv', type: 'animation' }, lineState: { params: { a: 2, b: 1, c: 1 }, annotation: { text: 'Q = vᵀ M v', position: 'bottom' } } },

  // ===== eigen (3) =====
  { lineId: 'eig-1', sectionId: 'eigen', scene: { id: 'eig-values', type: 'animation' }, lineState: { params: { a: 2, b: 0.5, c: 1 }, annotation: { text: '两个特征值', position: 'top' } } },
  { lineId: 'eig-2', sectionId: 'eigen', scene: { id: 'eig-sign', type: 'animation' }, lineState: { params: { a: 1, b: 0, c: -1 }, annotation: { text: '符号定类型', position: 'bottom' } } },
  { lineId: 'eig-3', sectionId: 'eigen', scene: { id: 'eig-dir', type: 'animation' }, lineState: { params: { a: 3, b: 0, c: 1 }, annotation: { text: '主轴弯曲快慢', position: 'bottom' } } },

  // ===== posdef (3) =====
  { lineId: 'pos-1', sectionId: 'posdef', scene: { id: 'pos-bowl', type: 'animation' }, lineState: { params: { a: 2, b: 0.5, c: 1 }, annotation: { text: '正定 · 碗形', position: 'top' } } },
  { lineId: 'pos-2', sectionId: 'posdef', scene: { id: 'pos-ellipse', type: 'animation' }, lineState: { params: { a: 2, b: 0.5, c: 1 }, annotation: { text: '等高线是椭圆', position: 'bottom' } } },
  { lineId: 'pos-3', sectionId: 'posdef', scene: { id: 'pos-saddle', type: 'animation' }, lineState: { params: { a: 1, b: 0, c: -1 }, annotation: { text: '不定 · 双曲线', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 2, b: 1.5, c: 1 }, annotation: { text: '拖动 a b c', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-eig', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1, b: 1.5, c: 1 }, annotation: { text: '看特征值变号', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '对称矩阵表示', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-eig', type: 'summary' }, lineState: { annotation: { text: '特征值定类型', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
