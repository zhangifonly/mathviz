/**
 * 高斯混合模型讲解场景配置
 * params.step 控制展示到第几步 EM 迭代（0=初始，越大越收敛）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGaussianMixtureState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gaussianMixtureScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '高斯混合模型', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-hist', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '藏着几个群？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-mix', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '归属未知', position: 'bottom' } } },

  // ===== model (3) =====
  { lineId: 'def-1', sectionId: 'model', scene: { id: 'def-mix', type: 'animation' }, lineState: { params: { step: 8 }, annotation: { text: '几个高斯的加权和', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'model', scene: { id: 'def-params', type: 'animation' }, lineState: { params: { step: 8 }, annotation: { text: 'μ σ 与权重', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'model', scene: { id: 'def-total', type: 'animation' }, lineState: { params: { step: 8 }, annotation: { text: '黑线=混合总曲线', position: 'bottom' } } },

  // ===== em (3) =====
  { lineId: 'em-1', sectionId: 'em', scene: { id: 'em-init', type: 'animation' }, lineState: { params: { step: 0 }, annotation: { text: '参数与归属都未知', position: 'top' } } },
  { lineId: 'em-2', sectionId: 'em', scene: { id: 'em-estep', type: 'animation' }, lineState: { params: { step: 1 }, annotation: { text: 'E步：算责任度', position: 'bottom' } } },
  { lineId: 'em-3', sectionId: 'em', scene: { id: 'em-mstep', type: 'animation' }, lineState: { params: { step: 2 }, annotation: { text: 'M步：更新参数', position: 'bottom' } } },

  // ===== converge (2) =====
  { lineId: 'conv-1', sectionId: 'converge', scene: { id: 'conv-ll', type: 'animation' }, lineState: { params: { step: 4 }, annotation: { text: '似然逐轮上升', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'converge', scene: { id: 'conv-fit', type: 'animation' }, lineState: { params: { step: 12 }, annotation: { text: '分量滑向各簇', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { step: 6 }, annotation: { text: '单步看移动', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-seed', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { step: 12 }, annotation: { text: '换种子重分离', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '加权高斯和', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-em', type: 'summary' }, lineState: { annotation: { text: 'E步M步交替', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
