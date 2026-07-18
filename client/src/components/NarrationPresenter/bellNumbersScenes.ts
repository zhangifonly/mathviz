/**
 * 贝尔数讲解场景配置
 * 每句口播对应贝尔三角显示的行数（params.rows）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBellNumbersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const bellNumbersScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '贝尔数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-ways', type: 'animation' }, lineState: { params: { rows: 3 }, annotation: { text: '几种分组方式？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-five', type: 'animation' }, lineState: { params: { rows: 3 }, annotation: { text: '三人共五种', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { rows: 4 }, annotation: { text: '这就是贝尔数', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-bn', type: 'animation' }, lineState: { params: { rows: 4 }, annotation: { text: 'B(n)=划分总数', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-seq', type: 'animation' }, lineState: { params: { rows: 5 }, annotation: { text: '1,1,2,5,15...', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-grow', type: 'animation' }, lineState: { params: { rows: 6 }, annotation: { text: '爆炸式增长', position: 'bottom' } } },

  // ===== triangle (4) =====
  { lineId: 'tri-1', sectionId: 'triangle', scene: { id: 'tri-intro', type: 'animation' }, lineState: { params: { rows: 6 }, annotation: { text: '贝尔三角', position: 'top' } } },
  { lineId: 'tri-2', sectionId: 'triangle', scene: { id: 'tri-head', type: 'animation' }, lineState: { params: { rows: 6 }, annotation: { text: '行首=上行末尾', position: 'bottom' } } },
  { lineId: 'tri-3', sectionId: 'triangle', scene: { id: 'tri-add', type: 'animation' }, lineState: { params: { rows: 7 }, annotation: { text: '左+左上', position: 'bottom' } } },
  { lineId: 'tri-4', sectionId: 'triangle', scene: { id: 'tri-end', type: 'animation' }, lineState: { params: { rows: 8 }, annotation: { text: '行末=下个贝尔数', position: 'bottom' } } },

  // ===== stirling (2) =====
  { lineId: 'stir-1', sectionId: 'stirling', scene: { id: 'stir-k', type: 'animation' }, lineState: { params: { rows: 8 }, annotation: { text: '恰好k个子集', position: 'top' } } },
  { lineId: 'stir-2', sectionId: 'stirling', scene: { id: 'stir-sum', type: 'animation' }, lineState: { params: { rows: 8 }, annotation: { text: '求和得贝尔数', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-rows', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rows: 10 }, annotation: { text: '调整行数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-bell', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rows: 12 }, annotation: { text: '看末尾高亮', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '划分总数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-tri', type: 'summary' }, lineState: { annotation: { text: '加法生成', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
