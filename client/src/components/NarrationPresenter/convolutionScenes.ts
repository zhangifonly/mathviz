/**
 * 卷积讲解场景配置
 * 每句口播对应卷积核（params.kernel）与滑动位置（params.step）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultConvolutionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const convolutionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '卷积', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-filter', type: 'animation' }, lineState: { params: { kernel: 'gaussian', step: -1 }, annotation: { text: '滤波 = 卷积', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-scan', type: 'animation' }, lineState: { params: { kernel: 'gaussian', step: 5 }, annotation: { text: '小核扫过信号', position: 'bottom' } } },

  // ===== flip (3) =====
  { lineId: 'flip-1', sectionId: 'flip', scene: { id: 'flip-do', type: 'animation' }, lineState: { params: { kernel: 'edge', step: 8 }, annotation: { text: '把核翻转', position: 'top' } } },
  { lineId: 'flip-2', sectionId: 'flip', scene: { id: 'flip-comm', type: 'animation' }, lineState: { params: { kernel: 'edge', step: 8 }, annotation: { text: '满足交换律', position: 'bottom' } } },
  { lineId: 'flip-3', sectionId: 'flip', scene: { id: 'flip-asym', type: 'animation' }, lineState: { params: { kernel: 'sharpen', step: 8 }, annotation: { text: '不对称核见翻转', position: 'bottom' } } },

  // ===== slide (3) =====
  { lineId: 'slide-1', sectionId: 'slide', scene: { id: 'slide-mul', type: 'animation' }, lineState: { params: { kernel: 'average', step: 4 }, annotation: { text: '对齐逐位相乘', position: 'top' } } },
  { lineId: 'slide-2', sectionId: 'slide', scene: { id: 'slide-sum', type: 'animation' }, lineState: { params: { kernel: 'average', step: 7 }, annotation: { text: '乘积求和 = 输出', position: 'bottom' } } },
  { lineId: 'slide-3', sectionId: 'slide', scene: { id: 'slide-move', type: 'animation' }, lineState: { params: { kernel: 'average', step: 12 }, annotation: { text: '滑动生成输出', position: 'bottom' } } },

  // ===== kernels (3) =====
  { lineId: 'ker-1', sectionId: 'kernels', scene: { id: 'ker-smooth', type: 'animation' }, lineState: { params: { kernel: 'gaussian', step: -1 }, annotation: { text: '平滑压噪', position: 'top' } } },
  { lineId: 'ker-2', sectionId: 'kernels', scene: { id: 'ker-edge', type: 'animation' }, lineState: { params: { kernel: 'edge', step: -1 }, annotation: { text: '差分找边缘', position: 'bottom' } } },
  { lineId: 'ker-3', sectionId: 'kernels', scene: { id: 'ker-diff', type: 'animation' }, lineState: { params: { kernel: 'sharpen', step: -1 }, annotation: { text: '换核换结果', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-pick', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kernel: 'gaussian', step: -1 }, annotation: { text: '选核看效果', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-slide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kernel: 'edge', step: 6 }, annotation: { text: '拖动看滑动', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '翻转·滑动·乘加', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-filter', type: 'summary' }, lineState: { annotation: { text: '换核换滤波', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
