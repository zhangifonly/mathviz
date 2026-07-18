/**
 * 马氏链稳态讲解场景配置
 * params.initIdx = 初始分布索引(0晴/1雨/2均匀), params.step = 迭代步数
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMarkovStationaryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const markovStationaryScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '马氏链稳态', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { initIdx: 0, step: 0 }, annotation: { text: '晴天占多少？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { initIdx: 0, step: 12 }, annotation: { text: '长期占比=稳态', position: 'bottom' } } },

  // ===== matrix (3) =====
  { lineId: 'mat-1', sectionId: 'matrix', scene: { id: 'mat-table', type: 'animation' }, lineState: { params: { initIdx: 0, step: 0 }, annotation: { text: '转移矩阵', position: 'top' } } },
  { lineId: 'mat-2', sectionId: 'matrix', scene: { id: 'mat-rowsum', type: 'animation' }, lineState: { params: { initIdx: 0, step: 0 }, annotation: { text: '每行之和=1', position: 'bottom' } } },
  { lineId: 'mat-3', sectionId: 'matrix', scene: { id: 'mat-sunny', type: 'animation' }, lineState: { params: { initIdx: 0, step: 1 }, annotation: { text: '晴->七成晴', position: 'bottom' } } },

  // ===== iterate (3) =====
  { lineId: 'iter-1', sectionId: 'iterate', scene: { id: 'iter-mul', type: 'animation' }, lineState: { params: { initIdx: 0, step: 1 }, annotation: { text: '左乘得明天', position: 'top' } } },
  { lineId: 'iter-2', sectionId: 'iterate', scene: { id: 'iter-repeat', type: 'animation' }, lineState: { params: { initIdx: 0, step: 3 }, annotation: { text: '反复相乘', position: 'bottom' } } },
  { lineId: 'iter-3', sectionId: 'iterate', scene: { id: 'iter-bars', type: 'animation' }, lineState: { params: { initIdx: 0, step: 5 }, annotation: { text: '比例在调整', position: 'bottom' } } },

  // ===== converge (3) =====
  { lineId: 'conv-1', sectionId: 'converge', scene: { id: 'conv-flat', type: 'animation' }, lineState: { params: { initIdx: 0, step: 10 }, annotation: { text: '几乎不再变', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'converge', scene: { id: 'conv-fix', type: 'animation' }, lineState: { params: { initIdx: 0, step: 20 }, annotation: { text: 'pi=pi·P', position: 'bottom' } } },
  { lineId: 'conv-3', sectionId: 'converge', scene: { id: 'conv-eig', type: 'animation' }, lineState: { params: { initIdx: 0, step: 30 }, annotation: { text: '特征值1的分布', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-init', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { initIdx: 1, step: 0 }, annotation: { text: '从雨天出发', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-same', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { initIdx: 1, step: 30 }, annotation: { text: '殊途同归', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '收敛到稳态', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-indep', type: 'summary' }, lineState: { annotation: { text: '与起点无关', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
