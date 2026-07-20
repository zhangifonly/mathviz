/**
 * 离散余弦变换讲解场景配置
 * 每句口播对应保留系数个数（params.keep）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDiscreteCosineTransformState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const discreteCosineTransformScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '离散余弦变换', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-dct', type: 'animation' }, lineState: { params: { keep: 32 }, annotation: { text: 'DCT', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-jpeg', type: 'animation' }, lineState: { params: { keep: 32 }, annotation: { text: 'JPEG 的核心', position: 'bottom' } } },

  // ===== basis (3) =====
  { lineId: 'basis-1', sectionId: 'basis', scene: { id: 'basis-sum', type: 'animation' }, lineState: { params: { keep: 32 }, annotation: { text: '余弦波叠加', position: 'top' } } },
  { lineId: 'basis-2', sectionId: 'basis', scene: { id: 'basis-low', type: 'animation' }, lineState: { params: { keep: 2 }, annotation: { text: '低频=大轮廓', position: 'bottom' } } },
  { lineId: 'basis-3', sectionId: 'basis', scene: { id: 'basis-high', type: 'animation' }, lineState: { params: { keep: 32 }, annotation: { text: '高频=细节', position: 'bottom' } } },

  // ===== coeff (3) =====
  { lineId: 'coeff-1', sectionId: 'coeff', scene: { id: 'coeff-weights', type: 'animation' }, lineState: { params: { keep: 32 }, annotation: { text: '每个基的权重', position: 'top' } } },
  { lineId: 'coeff-2', sectionId: 'coeff', scene: { id: 'coeff-low', type: 'animation' }, lineState: { params: { keep: 4 }, annotation: { text: '能量集中低频', position: 'bottom' } } },
  { lineId: 'coeff-3', sectionId: 'coeff', scene: { id: 'coeff-tiny', type: 'animation' }, lineState: { params: { keep: 32 }, annotation: { text: '高频接近零', position: 'bottom' } } },

  // ===== compress (3) =====
  { lineId: 'comp-1', sectionId: 'compress', scene: { id: 'comp-drop', type: 'animation' }, lineState: { params: { keep: 8 }, annotation: { text: '丢掉高频', position: 'top' } } },
  { lineId: 'comp-2', sectionId: 'compress', scene: { id: 'comp-rebuild', type: 'animation' }, lineState: { params: { keep: 8 }, annotation: { text: '逆变换重建', position: 'bottom' } } },
  { lineId: 'comp-3', sectionId: 'compress', scene: { id: 'comp-save', type: 'animation' }, lineState: { params: { keep: 4 }, annotation: { text: '有损压缩', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-keep', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { keep: 8 }, annotation: { text: '调保留个数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-less', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { keep: 2 }, annotation: { text: '越少越平滑', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '余弦基分解', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-compress', type: 'summary' }, lineState: { annotation: { text: '丢高频压缩', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
