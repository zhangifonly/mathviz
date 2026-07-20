/**
 * 错排问题讲解场景配置
 * 每句口播对应视图模式(mode)与元素个数(n)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDerangementsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const derangementsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '错排问题', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { mode: 'grid', n: 4 }, annotation: { text: '全都装错？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { mode: 'grid', n: 4 }, annotation: { text: '装错信封问题', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-what', type: 'animation' }, lineState: { params: { mode: 'grid', n: 4 }, annotation: { text: '无一在原位', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-dn', type: 'animation' }, lineState: { params: { mode: 'grid', n: 5 }, annotation: { text: '记作 D(n)', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-three', type: 'animation' }, lineState: { params: { mode: 'grid', n: 4 }, annotation: { text: '三元素仅两种', position: 'bottom' } } },

  // ===== recur (3) =====
  { lineId: 'rec-1', sectionId: 'recur', scene: { id: 'rec-formula', type: 'animation' }, lineState: { params: { mode: 'grid', n: 5 }, annotation: { text: 'D(n)=(n-1)(D(n-1)+D(n-2))', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recur', scene: { id: 'rec-seq', type: 'animation' }, lineState: { params: { mode: 'ratio', n: 8 }, annotation: { text: '1,0,1,2,9,44,265', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'recur', scene: { id: 'rec-intuit', type: 'animation' }, lineState: { params: { mode: 'grid', n: 6 }, annotation: { text: 'n-1 种落点', position: 'bottom' } } },

  // ===== ratio (3) =====
  { lineId: 'rat-1', sectionId: 'ratio', scene: { id: 'rat-div', type: 'animation' }, lineState: { params: { mode: 'ratio', n: 8 }, annotation: { text: 'D(n)/n!', position: 'top' } } },
  { lineId: 'rat-2', sectionId: 'ratio', scene: { id: 'rat-limit', type: 'animation' }, lineState: { params: { mode: 'ratio', n: 10 }, annotation: { text: '趋于 1/e≈0.368', position: 'bottom' } } },
  { lineId: 'rat-3', sectionId: 'ratio', scene: { id: 'rat-cards', type: 'animation' }, lineState: { params: { mode: 'ratio', n: 10 }, annotation: { text: '洗牌无原位≈37%', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-n', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'grid', n: 5 }, annotation: { text: '调整元素个数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-curve', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'ratio', n: 10 }, annotation: { text: '贴近 1/e 红线', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '错排 = 无一在原位', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-formula', type: 'summary' }, lineState: { annotation: { text: '递推生成，趋于 1/e', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
