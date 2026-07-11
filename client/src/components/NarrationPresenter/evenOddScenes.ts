/**
 * 奇偶数与整除讲解场景配置
 * 每句口播对应除数（params.divisor）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEvenOddState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const evenOddScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '奇偶数与整除', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-family', type: 'animation' }, lineState: { params: { divisor: 2 }, annotation: { text: '偶数与奇数', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-grid', type: 'animation' }, lineState: { params: { divisor: 2 }, annotation: { text: '排成方格', position: 'bottom' } } },

  // ===== parity (3) =====
  { lineId: 'parity-1', sectionId: 'parity', scene: { id: 'parity-even', type: 'animation' }, lineState: { params: { divisor: 2 }, annotation: { text: '偶数能被 2 整除', position: 'top' } } },
  { lineId: 'parity-2', sectionId: 'parity', scene: { id: 'parity-odd', type: 'animation' }, lineState: { params: { divisor: 2 }, annotation: { text: '奇数不能被 2 整除', position: 'top' } } },
  { lineId: 'parity-3', sectionId: 'parity', scene: { id: 'parity-alt', type: 'animation' }, lineState: { params: { divisor: 2 }, annotation: { text: '一个隔一个', position: 'bottom' } } },

  // ===== rules (3) =====
  { lineId: 'rules-1', sectionId: 'rules', scene: { id: 'rules-add', type: 'animation' }, lineState: { params: { divisor: 2 }, annotation: { text: '偶+偶=偶，奇+奇=偶', position: 'top' } } },
  { lineId: 'rules-2', sectionId: 'rules', scene: { id: 'rules-mix', type: 'animation' }, lineState: { params: { divisor: 2 }, annotation: { text: '奇+偶=奇', position: 'top' } } },
  { lineId: 'rules-3', sectionId: 'rules', scene: { id: 'rules-mul', type: 'animation' }, lineState: { params: { divisor: 2 }, annotation: { text: '奇×奇才是奇', position: 'bottom' } } },

  // ===== divide (3) =====
  { lineId: 'divide-1', sectionId: 'divide', scene: { id: 'divide-def', type: 'animation' }, lineState: { params: { divisor: 2 }, annotation: { text: '余数为 0 即整除', position: 'top' } } },
  { lineId: 'divide-2', sectionId: 'divide', scene: { id: 'divide-three', type: 'animation' }, lineState: { params: { divisor: 3 }, annotation: { text: '3 的倍数', position: 'bottom' } } },
  { lineId: 'divide-3', sectionId: 'divide', scene: { id: 'divide-five', type: 'animation' }, lineState: { params: { divisor: 5 }, annotation: { text: '5 的倍数', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { divisor: 3 }, annotation: { text: '切换除数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { divisor: 5 }, annotation: { text: '数一数点亮个数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '奇偶运算规律', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-divide', type: 'summary' }, lineState: { annotation: { text: '整除即余数为 0', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
