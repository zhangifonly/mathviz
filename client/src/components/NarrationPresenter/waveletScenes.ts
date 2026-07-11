/**
 * 小波变换讲解场景配置
 * 每个 NarrationLineScene 的 lineId/sectionId 与 narration 脚本一一对应。
 * params.signal 指定信号类型，params.wavelet 指定母小波，供渲染器读取。
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultWaveletState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const waveletScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-title', type: 'title' }, lineState: { annotation: { text: '小波变换', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fourier', type: 'animation' }, lineState: { params: { signal: 'chirp', wavelet: 'mexican' }, annotation: { text: '正弦无限延伸', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-wavelet', type: 'animation' }, lineState: { params: { signal: 'chirp', wavelet: 'mexican' }, annotation: { text: '时频同时可见', position: 'bottom' } } },

  // ===== concept-mother (4) =====
  { lineId: 'mother-1', sectionId: 'concept-mother', scene: { id: 'mother-base', type: 'animation' }, lineState: { params: { signal: 'transient', wavelet: 'mexican' }, annotation: { text: '母小波：零均值', position: 'top' } } },
  { lineId: 'mother-2', sectionId: 'concept-mother', scene: { id: 'mother-shift', type: 'animation' }, lineState: { params: { signal: 'transient', wavelet: 'mexican' }, annotation: { text: '平移定位时间', position: 'top' } } },
  { lineId: 'mother-3', sectionId: 'concept-mother', scene: { id: 'mother-scale', type: 'animation' }, lineState: { params: { signal: 'transient', wavelet: 'mexican' }, annotation: { text: '伸缩选择频率', position: 'bottom' } } },
  { lineId: 'mother-4', sectionId: 'concept-mother', scene: { id: 'mother-inner', type: 'animation' }, lineState: { params: { signal: 'transient', wavelet: 'mexican' }, annotation: { text: '内积得系数', position: 'bottom' } } },

  // ===== concept-scaleogram (3) =====
  { lineId: 'scale-1', sectionId: 'concept-scaleogram', scene: { id: 'scale-map', type: 'animation' }, lineState: { params: { signal: 'transient', wavelet: 'mexican' }, annotation: { text: '时间-尺度图', position: 'top' } } },
  { lineId: 'scale-2', sectionId: 'concept-scaleogram', scene: { id: 'scale-color', type: 'animation' }, lineState: { params: { signal: 'transient', wavelet: 'mexican' }, annotation: { text: '亮=能量强', position: 'bottom' } } },
  { lineId: 'scale-3', sectionId: 'concept-scaleogram', scene: { id: 'scale-spike', type: 'animation' }, lineState: { params: { signal: 'transient', wavelet: 'mexican' }, annotation: { text: '尖峰竖线定位', position: 'bottom' } } },

  // ===== concept-haar (3) =====
  { lineId: 'haar-1', sectionId: 'concept-haar', scene: { id: 'haar-avg', type: 'animation' }, lineState: { params: { signal: 'twoTone', wavelet: 'morlet' }, annotation: { text: '均值+差值', position: 'top' } } },
  { lineId: 'haar-2', sectionId: 'concept-haar', scene: { id: 'haar-multi', type: 'animation' }, lineState: { params: { signal: 'twoTone', wavelet: 'morlet' }, annotation: { text: '多分辨率分层', position: 'top' } } },
  { lineId: 'haar-3', sectionId: 'concept-haar', scene: { id: 'haar-recon', type: 'animation' }, lineState: { params: { signal: 'twoTone', wavelet: 'morlet' }, annotation: { text: '正交=完美重构', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-chirp', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { signal: 'chirp', wavelet: 'morlet' }, annotation: { text: '啁啾:斜带', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-two', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { signal: 'twoTone', wavelet: 'mexican' }, annotation: { text: '双频:定位切换', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '平移定时 伸缩定频', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: '压缩 去噪 地震分析', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美', position: 'bottom' } } },
]
