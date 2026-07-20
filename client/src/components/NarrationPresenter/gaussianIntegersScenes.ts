/**
 * 高斯整数讲解场景配置
 * 每句口播对应显示范围（params.range）与是否只看素数（params.primesOnly）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGaussianIntegersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gaussianIntegersScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '高斯整数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-form', type: 'animation' }, lineState: { params: { range: 6 }, annotation: { text: 'a + b·i', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-lattice', type: 'animation' }, lineState: { params: { range: 10 }, annotation: { text: '复平面方格点阵', position: 'bottom' } } },

  // ===== norm (3) =====
  { lineId: 'def-1', sectionId: 'norm', scene: { id: 'norm-def', type: 'animation' }, lineState: { params: { range: 6 }, annotation: { text: 'N=a²+b²', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'norm', scene: { id: 'norm-dist', type: 'animation' }, lineState: { params: { range: 6 }, annotation: { text: '到原点距离²', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'norm', scene: { id: 'norm-mult', type: 'animation' }, lineState: { params: { range: 10 }, annotation: { text: '乘法可乘', position: 'bottom' } } },

  // ===== prime (3) =====
  { lineId: 'gp-1', sectionId: 'prime', scene: { id: 'gp-what', type: 'animation' }, lineState: { params: { range: 10, primesOnly: true }, annotation: { text: '不可再分', position: 'top' } } },
  { lineId: 'gp-2', sectionId: 'prime', scene: { id: 'gp-axis', type: 'animation' }, lineState: { params: { range: 10, primesOnly: true }, annotation: { text: '轴上=4k+3素数', position: 'bottom' } } },
  { lineId: 'gp-3', sectionId: 'prime', scene: { id: 'gp-norm', type: 'animation' }, lineState: { params: { range: 15, primesOnly: true }, annotation: { text: '范数为素数', position: 'bottom' } } },

  // ===== split (3) =====
  { lineId: 'sp-1', sectionId: 'split', scene: { id: 'sp-intro', type: 'animation' }, lineState: { params: { range: 10, primesOnly: true }, annotation: { text: '素数的变化', position: 'top' } } },
  { lineId: 'sp-2', sectionId: 'split', scene: { id: 'sp-split', type: 'animation' }, lineState: { params: { range: 10, primesOnly: true }, annotation: { text: '4k+1 分裂', position: 'bottom' } } },
  { lineId: 'sp-3', sectionId: 'split', scene: { id: 'sp-inert', type: 'animation' }, lineState: { params: { range: 15, primesOnly: true }, annotation: { text: '4k+3 保持', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-zoom', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { range: 15, primesOnly: true }, annotation: { text: '缩放看分布', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-symmetry', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { range: 15, primesOnly: true }, annotation: { text: '八重对称', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '搬上复平面', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-prime', type: 'summary' }, lineState: { annotation: { text: '对称的素数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
