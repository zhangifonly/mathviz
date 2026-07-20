/**
 * 汉诺塔讲解场景配置
 * 每句口播对应盘子数量(params.n)与当前步(params.step)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultTowerOfHanoiState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const towerOfHanoiScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '汉诺塔', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-stack', type: 'animation' }, lineState: { params: { n: 5, step: 0 }, annotation: { text: '一摞金盘', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-rule', type: 'animation' }, lineState: { params: { n: 4, step: 1 }, annotation: { text: '大盘不压小盘', position: 'bottom' } } },

  // ===== recursion (3) =====
  { lineId: 'rec-1', sectionId: 'recursion', scene: { id: 'rec-big', type: 'animation' }, lineState: { params: { n: 4, step: 0 }, annotation: { text: '先看最大盘', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recursion', scene: { id: 'rec-move', type: 'animation' }, lineState: { params: { n: 4, step: 7 }, annotation: { text: '上面 n-1 个先挪走', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'recursion', scene: { id: 'rec-done', type: 'animation' }, lineState: { params: { n: 4, step: 15 }, annotation: { text: '再盖回去', position: 'bottom' } } },

  // ===== steps (3) =====
  { lineId: 'step-1', sectionId: 'steps', scene: { id: 'step-formula', type: 'animation' }, lineState: { params: { n: 3, step: 0 }, annotation: { text: 'T(n+1)=2T(n)+1', position: 'top' } } },
  { lineId: 'step-2', sectionId: 'steps', scene: { id: 'step-pow', type: 'animation' }, lineState: { params: { n: 3, step: 4 }, annotation: { text: '2ⁿ-1', position: 'bottom' } } },
  { lineId: 'step-3', sectionId: 'steps', scene: { id: 'step-count', type: 'animation' }, lineState: { params: { n: 5, step: 31 }, annotation: { text: '5 盘=31 步', position: 'bottom' } } },

  // ===== doom (3) =====
  { lineId: 'doom-1', sectionId: 'doom', scene: { id: 'doom-legend', type: 'animation' }, lineState: { params: { n: 5, step: 0 }, annotation: { text: '64 个金盘', position: 'top' } } },
  { lineId: 'doom-2', sectionId: 'doom', scene: { id: 'doom-huge', type: 'animation' }, lineState: { params: { n: 5, step: 16 }, annotation: { text: '2⁶⁴-1 步', position: 'bottom' } } },
  { lineId: 'doom-3', sectionId: 'doom', scene: { id: 'doom-safe', type: 'animation' }, lineState: { params: { n: 5, step: 31 }, annotation: { text: '约 5850 亿年', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 4, step: 0 }, annotation: { text: '调整盘数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 4, step: 8 }, annotation: { text: '单步播放', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '递归分解', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-exp', type: 'summary' }, lineState: { annotation: { text: '指数增长', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
