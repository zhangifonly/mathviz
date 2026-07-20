/**
 * 伽马函数讲解场景配置
 * 每句口播对应一个高亮 x 值（params.pick），一一映射脚本行 id
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGammaFunctionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gammaFunctionScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '伽马函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-half', type: 'animation' }, lineState: { params: { pick: 1.5 }, annotation: { text: '0.5 的阶乘?', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-gap', type: 'animation' }, lineState: { params: { pick: 3 }, annotation: { text: '阶乘只认整数', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-curve', type: 'animation' }, lineState: { params: { pick: 2.5 }, annotation: { text: '一条光滑曲线', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-name', type: 'animation' }, lineState: { params: { pick: 2 }, annotation: { text: '记作 Γ', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-integral', type: 'animation' }, lineState: { params: { pick: 2.5 }, annotation: { text: '阶乘的连续版', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-plot', type: 'animation' }, lineState: { params: { pick: 3.5 }, annotation: { text: '蓝色即 Γ(x)', position: 'bottom' } } },

  // ===== factorial (3) =====
  { lineId: 'fac-1', sectionId: 'factorial', scene: { id: 'fac-formula', type: 'animation' }, lineState: { params: { pick: 4 }, annotation: { text: 'Γ(n)=(n-1)!', position: 'top' } } },
  { lineId: 'fac-2', sectionId: 'factorial', scene: { id: 'fac-points', type: 'animation' }, lineState: { params: { pick: 4 }, annotation: { text: '点落在曲线上', position: 'bottom' } } },
  { lineId: 'fac-3', sectionId: 'factorial', scene: { id: 'fac-ticks', type: 'animation' }, lineState: { params: { pick: 5 }, annotation: { text: '离散的刻度', position: 'bottom' } } },

  // ===== recur (3) =====
  { lineId: 'rec-1', sectionId: 'recur', scene: { id: 'rec-relation', type: 'animation' }, lineState: { params: { pick: 3 }, annotation: { text: 'Γ(x+1)=xΓ(x)', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recur', scene: { id: 'rec-extend', type: 'animation' }, lineState: { params: { pick: 2.5 }, annotation: { text: '推广到实数', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'recur', scene: { id: 'rec-halfpi', type: 'animation' }, lineState: { params: { pick: 0.5 }, annotation: { text: 'Γ(1/2)=√π', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-pick', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pick: 2 }, annotation: { text: '选一个 x', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-try', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { pick: 0.5 }, annotation: { text: '试试 2.5 或 0.5', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '阶乘的推广', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-props', type: 'summary' }, lineState: { annotation: { text: '三条关键性质', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
