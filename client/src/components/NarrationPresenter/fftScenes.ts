/**
 * 快速傅里叶变换讲解场景配置
 * 每句口播对应信号预设(params.preset)与采样点数(params.size)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFftState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const fftScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '快速傅里叶变换', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-dft', type: 'animation' }, lineState: { params: { preset: 0, size: 16 }, annotation: { text: '信号 -> 频率成分', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-slow', type: 'animation' }, lineState: { params: { preset: 1, size: 32 }, annotation: { text: '朴素 DFT 是 n 平方', position: 'bottom' } } },

  // ===== divide (3) =====
  { lineId: 'div-1', sectionId: 'divide', scene: { id: 'div-split', type: 'animation' }, lineState: { params: { preset: 1, size: 16 }, annotation: { text: '按奇偶下标拆半', position: 'top' } } },
  { lineId: 'div-2', sectionId: 'divide', scene: { id: 'div-half', type: 'animation' }, lineState: { params: { preset: 1, size: 16 }, annotation: { text: '各做半规模变换', position: 'bottom' } } },
  { lineId: 'div-3', sectionId: 'divide', scene: { id: 'div-recur', type: 'animation' }, lineState: { params: { preset: 2, size: 32 }, annotation: { text: '分治到单点', position: 'bottom' } } },

  // ===== butterfly (3) =====
  { lineId: 'bf-1', sectionId: 'butterfly', scene: { id: 'bf-merge', type: 'animation' }, lineState: { params: { preset: 1, size: 32 }, annotation: { text: '蝶形合并', position: 'top' } } },
  { lineId: 'bf-2', sectionId: 'butterfly', scene: { id: 'bf-twiddle', type: 'animation' }, lineState: { params: { preset: 1, size: 32 }, annotation: { text: '旋转因子 + 加减', position: 'bottom' } } },
  { lineId: 'bf-3', sectionId: 'butterfly', scene: { id: 'bf-wing', type: 'animation' }, lineState: { params: { preset: 2, size: 32 }, annotation: { text: '形如蝴蝶翅膀', position: 'bottom' } } },

  // ===== speed (3) =====
  { lineId: 'spd-1', sectionId: 'speed', scene: { id: 'spd-layers', type: 'animation' }, lineState: { params: { preset: 1, size: 32 }, annotation: { text: 'log n 层合并', position: 'top' } } },
  { lineId: 'spd-2', sectionId: 'speed', scene: { id: 'spd-nlogn', type: 'animation' }, lineState: { params: { preset: 1, size: 64 }, annotation: { text: 'n 平方 -> n log n', position: 'bottom' } } },
  { lineId: 'spd-3', sectionId: 'speed', scene: { id: 'spd-huge', type: 'animation' }, lineState: { params: { preset: 2, size: 64 }, annotation: { text: '大 n 快数万倍', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-signal', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 2, size: 32 }, annotation: { text: '切换信号看峰', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-size', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 1, size: 64 }, annotation: { text: '加大采样点数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '分治 + 蝶形', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: '无处不在的引擎', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
