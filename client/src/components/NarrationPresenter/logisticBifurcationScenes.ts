/**
 * Logistic 分岔图讲解场景配置
 * 每句口播对应一个放大窗口索引（params.win，映射到 R_WINDOWS）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLogisticBifurcationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const logisticBifurcationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'Logistic分岔图', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-pop', type: 'animation' }, lineState: { params: { win: 0 }, annotation: { text: '池塘里的虫口', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-into', type: 'animation' }, lineState: { params: { win: 0 }, annotation: { text: '走进混沌', position: 'bottom' } } },

  // ===== map (3) =====
  { lineId: 'map-1', sectionId: 'map', scene: { id: 'map-rule', type: 'animation' }, lineState: { params: { win: 0 }, annotation: { text: 'r·今年·(1−今年)', position: 'top' } } },
  { lineId: 'map-2', sectionId: 'map', scene: { id: 'map-formula', type: 'animation' }, lineState: { params: { win: 0 }, annotation: { text: 'x = r x (1−x)', position: 'top' } } },
  { lineId: 'map-3', sectionId: 'map', scene: { id: 'map-r', type: 'animation' }, lineState: { params: { win: 0 }, annotation: { text: 'r 决定命运', position: 'bottom' } } },

  // ===== fixed (3) =====
  { lineId: 'fix-1', sectionId: 'fixed', scene: { id: 'fix-point', type: 'animation' }, lineState: { params: { win: 0 }, annotation: { text: '单一不动点', position: 'top' } } },
  { lineId: 'fix-2', sectionId: 'fixed', scene: { id: 'fix-attract', type: 'animation' }, lineState: { params: { win: 0 }, annotation: { text: '被吸引收敛', position: 'bottom' } } },
  { lineId: 'fix-3', sectionId: 'fixed', scene: { id: 'fix-r3', type: 'animation' }, lineState: { params: { win: 0 }, annotation: { text: 'r 越过 3', position: 'bottom' } } },

  // ===== chaos (3) =====
  { lineId: 'chaos-1', sectionId: 'chaos', scene: { id: 'chaos-p2', type: 'animation' }, lineState: { params: { win: 1 }, annotation: { text: '周期 2', position: 'top' } } },
  { lineId: 'chaos-2', sectionId: 'chaos', scene: { id: 'chaos-p4', type: 'animation' }, lineState: { params: { win: 1 }, annotation: { text: '2→4→8', position: 'bottom' } } },
  { lineId: 'chaos-3', sectionId: 'chaos', scene: { id: 'chaos-feig', type: 'animation' }, lineState: { params: { win: 2 }, annotation: { text: '费根鲍姆常数', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-zoom', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { win: 2 }, annotation: { text: '放大分岔', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-self', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { win: 2 }, annotation: { text: '自相似指纹', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '秩序与混沌', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-ladder', type: 'summary' }, lineState: { annotation: { text: '倍周期梯子', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
