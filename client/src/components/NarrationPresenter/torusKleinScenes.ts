/**
 * 环面与克莱因瓶 讲解场景配置
 * params.surface 指定当前展示的曲面（torus / klein）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultTorusKleinState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const torusKleinScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '环面与克莱因瓶', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-glue', type: 'animation' }, lineState: { params: { surface: 'torus' }, annotation: { text: '粘边卷曲面', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-cast', type: 'animation' }, lineState: { params: { surface: 'klein' }, annotation: { text: '两位主角', position: 'bottom' } } },

  // ===== torus (3) =====
  { lineId: 'def-1', sectionId: 'torus', scene: { id: 'def-tube', type: 'animation' }, lineState: { params: { surface: 'torus' }, annotation: { text: '左右同向 -> 管子', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'torus', scene: { id: 'def-donut', type: 'animation' }, lineState: { params: { surface: 'torus' }, annotation: { text: '上下同向 -> 甜甜圈', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'torus', scene: { id: 'def-both', type: 'animation' }, lineState: { params: { surface: 'torus' }, annotation: { text: '两对边都同向', position: 'bottom' } } },

  // ===== klein (3) =====
  { lineId: 'kle-1', sectionId: 'klein', scene: { id: 'kle-flip', type: 'animation' }, lineState: { params: { surface: 'klein' }, annotation: { text: '一对边翻面反向', position: 'top' } } },
  { lineId: 'kle-2', sectionId: 'klein', scene: { id: 'kle-bottle', type: 'animation' }, lineState: { params: { surface: 'klein' }, annotation: { text: '克莱因瓶', position: 'bottom' } } },
  { lineId: 'kle-3', sectionId: 'klein', scene: { id: 'kle-4d', type: 'animation' }, lineState: { params: { surface: 'klein' }, annotation: { text: '真身住在四维', position: 'bottom' } } },

  // ===== orient (3) =====
  { lineId: 'ori-1', sectionId: 'orient', scene: { id: 'ori-torus', type: 'animation' }, lineState: { params: { surface: 'torus' }, annotation: { text: '环面有里外', position: 'top' } } },
  { lineId: 'ori-2', sectionId: 'orient', scene: { id: 'ori-klein', type: 'animation' }, lineState: { params: { surface: 'klein' }, annotation: { text: '无内外之分', position: 'bottom' } } },
  { lineId: 'ori-3', sectionId: 'orient', scene: { id: 'ori-name', type: 'animation' }, lineState: { params: { surface: 'klein' }, annotation: { text: '不可定向', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { surface: 'torus' }, annotation: { text: '切换曲面', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-rotate', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { surface: 'klein' }, annotation: { text: '旋转观察', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '同纸不同粘法', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-orient', type: 'summary' }, lineState: { annotation: { text: '可定向 vs 不可定向', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
