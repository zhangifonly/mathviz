/**
 * 部分分式分解讲解场景配置
 * 每句口播对应一个例子索引（params.sample）与是否显示分式曲线（params.parts）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPartialFractionsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const partialFractionsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '部分分式分解', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-hard', type: 'animation' }, lineState: { params: { sample: 0, parts: 0 }, annotation: { text: '复杂分式难积分', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { sample: 0, parts: 0 }, annotation: { text: '把它拆开', position: 'bottom' } } },

  // ===== split (3) =====
  { lineId: 'def-1', sectionId: 'split', scene: { id: 'def-split', type: 'animation' }, lineState: { params: { sample: 0, parts: 1 }, annotation: { text: '拆成简单分式', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'split', scene: { id: 'def-denom', type: 'animation' }, lineState: { params: { sample: 0, parts: 1 }, annotation: { text: '各自一次分母', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'split', scene: { id: 'def-coeff', type: 'animation' }, lineState: { params: { sample: 1, parts: 1 }, annotation: { text: '待求系数', position: 'bottom' } } },

  // ===== residue (3) =====
  { lineId: 'res-1', sectionId: 'residue', scene: { id: 'res-cover', type: 'animation' }, lineState: { params: { sample: 1, parts: 1 }, annotation: { text: '盖住因式', position: 'top' } } },
  { lineId: 'res-2', sectionId: 'residue', scene: { id: 'res-plug', type: 'animation' }, lineState: { params: { sample: 2, parts: 1 }, annotation: { text: '代入根', position: 'bottom' } } },
  { lineId: 'res-3', sectionId: 'residue', scene: { id: 'res-formula', type: 'animation' }, lineState: { params: { sample: 2, parts: 1 }, annotation: { text: "A=P(r)/Q'(r)", position: 'bottom' } } },

  // ===== verify (2) =====
  { lineId: 'ver-1', sectionId: 'verify', scene: { id: 'ver-overlap', type: 'animation' }, lineState: { params: { sample: 2, parts: 1 }, annotation: { text: '曲线重合', position: 'top' } } },
  { lineId: 'ver-2', sectionId: 'verify', scene: { id: 'ver-identity', type: 'animation' }, lineState: { params: { sample: 3, parts: 1 }, annotation: { text: '处处相等', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sample: 3, parts: 1 }, annotation: { text: '切换例子', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-toggle', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { sample: 2, parts: 1 }, annotation: { text: '叠加成原曲线', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '拆成简单分式和', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-residue', type: 'summary' }, lineState: { annotation: { text: '留数法秒求系数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '化繁为简，下次见！', position: 'bottom' } } },
]
