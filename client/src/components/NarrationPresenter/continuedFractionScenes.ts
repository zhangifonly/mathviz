/**
 * 连分数讲解场景配置
 * 每句口播对应演示的数（params.numberKey）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultContinuedFractionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const continuedFractionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '连分数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { numberKey: 'pi' }, annotation: { text: '另一种写法', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-structure', type: 'animation' }, lineState: { params: { numberKey: 'pi' }, annotation: { text: '最本质的结构', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-nest', type: 'animation' }, lineState: { params: { numberKey: 'pi' }, annotation: { text: '嵌套的分数', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-step', type: 'animation' }, lineState: { params: { numberKey: 'pi' }, annotation: { text: '取整数, 再取倒数', position: 'top' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-finite', type: 'animation' }, lineState: { params: { numberKey: 'frac' }, annotation: { text: '有理数会终止', position: 'bottom' } } },

  // ===== convergent (3) =====
  { lineId: 'conv-1', sectionId: 'convergent', scene: { id: 'conv-truncate', type: 'animation' }, lineState: { params: { numberKey: 'pi' }, annotation: { text: '渐近分数', position: 'top' } } },
  { lineId: 'conv-2', sectionId: 'convergent', scene: { id: 'conv-recur', type: 'animation' }, lineState: { params: { numberKey: 'pi' }, annotation: { text: '简洁的递推', position: 'top' } } },
  { lineId: 'conv-3', sectionId: 'convergent', scene: { id: 'conv-approach', type: 'animation' }, lineState: { params: { numberKey: 'pi' }, annotation: { text: '两侧交替逼近', position: 'bottom' } } },

  // ===== approx (2) =====
  { lineId: 'apx-1', sectionId: 'approx', scene: { id: 'apx-best', type: 'animation' }, lineState: { params: { numberKey: 'pi' }, annotation: { text: '最佳有理逼近', position: 'top' } } },
  { lineId: 'apx-2', sectionId: 'approx', scene: { id: 'apx-pi', type: 'animation' }, lineState: { params: { numberKey: 'pi' }, annotation: { text: '22/7 与 355/113', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { numberKey: 'sqrt2' }, annotation: { text: '换个数试试', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-golden', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { numberKey: 'golden' }, annotation: { text: '黄金比例最难逼近', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-nest', type: 'summary' }, lineState: { annotation: { text: '层层嵌套的分数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-approx', type: 'summary' }, lineState: { annotation: { text: '最小分母, 最好逼近', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '看清数的本性！', position: 'bottom' } } },
]
