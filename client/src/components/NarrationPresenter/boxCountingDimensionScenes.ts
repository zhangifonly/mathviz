/**
 * 盒维数讲解场景配置
 * 每句口播对应覆盖网格尺度（params.epsilon）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBoxCountingDimensionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const boxCountingDimensionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '盒维数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-between', type: 'animation' }, lineState: { params: { epsilon: 32 }, annotation: { text: '卡在一维和二维之间', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-ruler', type: 'animation' }, lineState: { params: { epsilon: 32 }, annotation: { text: '一把新尺子', position: 'bottom' } } },

  // ===== boxcount (3) =====
  { lineId: 'box-1', sectionId: 'boxcount', scene: { id: 'box-grid', type: 'animation' }, lineState: { params: { epsilon: 64 }, annotation: { text: '边长 ε 的方格网', position: 'top' } } },
  { lineId: 'box-2', sectionId: 'boxcount', scene: { id: 'box-count', type: 'animation' }, lineState: { params: { epsilon: 32 }, annotation: { text: '数非空格子 N(ε)', position: 'bottom' } } },
  { lineId: 'box-3', sectionId: 'boxcount', scene: { id: 'box-nonempty', type: 'animation' }, lineState: { params: { epsilon: 32 }, annotation: { text: '只算沾到图形的格子', position: 'bottom' } } },

  // ===== scale (3) =====
  { lineId: 'scale-1', sectionId: 'scale', scene: { id: 'scale-half', type: 'animation' }, lineState: { params: { epsilon: 16 }, annotation: { text: 'ε 减半，格子变多', position: 'top' } } },
  { lineId: 'scale-2', sectionId: 'scale', scene: { id: 'scale-compare', type: 'animation' }, lineState: { params: { epsilon: 8 }, annotation: { text: '线×2 面×4', position: 'bottom' } } },
  { lineId: 'scale-3', sectionId: 'scale', scene: { id: 'scale-power', type: 'animation' }, lineState: { params: { epsilon: 8 }, annotation: { text: 'N ∝ (1/ε)^D', position: 'bottom' } } },

  // ===== loglog (3) =====
  { lineId: 'log-1', sectionId: 'loglog', scene: { id: 'log-scatter', type: 'animation' }, lineState: { params: { epsilon: 16 }, annotation: { text: 'log(1/ε) - log N 散点', position: 'top' } } },
  { lineId: 'log-2', sectionId: 'loglog', scene: { id: 'log-slope', type: 'animation' }, lineState: { params: { epsilon: 8 }, annotation: { text: '斜率 = 盒维数 D', position: 'bottom' } } },
  { lineId: 'log-3', sectionId: 'loglog', scene: { id: 'log-value', type: 'animation' }, lineState: { params: { epsilon: 4 }, annotation: { text: 'D ≈ log3/log2 ≈ 1.585', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-eps', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { epsilon: 8 }, annotation: { text: '切换 ε 看网格', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-fit', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { epsilon: 4 }, annotation: { text: '散点贴合拟合直线', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '多尺度覆盖数 N(ε)', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-slope', type: 'summary' }, lineState: { annotation: { text: '斜率就是分数维数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
