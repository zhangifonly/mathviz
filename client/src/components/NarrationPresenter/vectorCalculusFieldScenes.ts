/**
 * 保守场与势函数讲解场景配置
 * params.fieldIdx 选择向量场，showEq/showPaths 控制叠加层
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultVectorCalculusFieldState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const vectorCalculusFieldScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '保守场与势函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-climb', type: 'animation' }, lineState: { params: { fieldIdx: 0, showEq: true, showPaths: true }, annotation: { text: '做功只看高度差', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { fieldIdx: 0, showEq: true, showPaths: true }, annotation: { text: '这就是保守场', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-pq', type: 'animation' }, lineState: { params: { fieldIdx: 0, showEq: false, showPaths: false }, annotation: { text: 'F = (P, Q)', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-curl', type: 'animation' }, lineState: { params: { fieldIdx: 1, showEq: false, showPaths: false }, annotation: { text: '旋度 = dQ/dx - dP/dy', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-zero', type: 'animation' }, lineState: { params: { fieldIdx: 0, showEq: false, showPaths: false }, annotation: { text: '旋度为零 = 保守', position: 'bottom' } } },

  // ===== potential (3) =====
  { lineId: 'pot-1', sectionId: 'potential', scene: { id: 'pot-phi', type: 'animation' }, lineState: { params: { fieldIdx: 0, showEq: true, showPaths: false }, annotation: { text: 'F = grad(phi)', position: 'top' } } },
  { lineId: 'pot-2', sectionId: 'potential', scene: { id: 'pot-lines', type: 'animation' }, lineState: { params: { fieldIdx: 0, showEq: true, showPaths: false }, annotation: { text: '等势线', position: 'bottom' } } },
  { lineId: 'pot-3', sectionId: 'potential', scene: { id: 'pot-perp', type: 'animation' }, lineState: { params: { fieldIdx: 0, showEq: true, showPaths: false }, annotation: { text: '箭头垂直等势线', position: 'bottom' } } },

  // ===== pathindep (3) =====
  { lineId: 'path-1', sectionId: 'pathindep', scene: { id: 'path-formula', type: 'animation' }, lineState: { params: { fieldIdx: 0, showEq: true, showPaths: true }, annotation: { text: 'W = phi(终) - phi(始)', position: 'top' } } },
  { lineId: 'path-2', sectionId: 'pathindep', scene: { id: 'path-equal', type: 'animation' }, lineState: { params: { fieldIdx: 0, showEq: true, showPaths: true }, annotation: { text: '两路径做功相同', position: 'bottom' } } },
  { lineId: 'path-3', sectionId: 'pathindep', scene: { id: 'path-rot', type: 'animation' }, lineState: { params: { fieldIdx: 1, showEq: false, showPaths: true }, annotation: { text: '旋转场：路径重要', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-grad', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fieldIdx: 0, showEq: true, showPaths: true }, annotation: { text: '保守场：差值为零', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-rot', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { fieldIdx: 1, showEq: false, showPaths: true }, annotation: { text: '非保守：差值非零', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '旋度为零 → 保守', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-path', type: 'summary' }, lineState: { annotation: { text: '做功与路径无关', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
