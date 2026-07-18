/**
 * 莫比乌斯函数讲解场景配置
 * 每句口播对应观察范围（params.range）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMobiusFunctionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const mobiusFunctionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '莫比乌斯函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-three', type: 'animation' }, lineState: { params: { range: 30 }, annotation: { text: '只有 -1 / 0 / +1', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { range: 30 }, annotation: { text: '优雅而神秘', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-factor', type: 'animation' }, lineState: { params: { range: 30 }, annotation: { text: '先做质因数分解', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-count', type: 'animation' }, lineState: { params: { range: 60 }, annotation: { text: '数素因子个数', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-parity', type: 'animation' }, lineState: { params: { range: 60 }, annotation: { text: '偶正一 · 奇负一', position: 'bottom' } } },

  // ===== zero (3) =====
  { lineId: 'zero-1', sectionId: 'zero', scene: { id: 'zero-sq', type: 'animation' }, lineState: { params: { range: 60 }, annotation: { text: '素数重复出现', position: 'top' } } },
  { lineId: 'zero-2', sectionId: 'zero', scene: { id: 'zero-ex', type: 'animation' }, lineState: { params: { range: 60 }, annotation: { text: 'mu(4)=mu(12)=0', position: 'bottom' } } },
  { lineId: 'zero-3', sectionId: 'zero', scene: { id: 'zero-cut', type: 'animation' }, lineState: { params: { range: 100 }, annotation: { text: '含平方因子归零', position: 'bottom' } } },

  // ===== mertens (3) =====
  { lineId: 'mer-1', sectionId: 'mertens', scene: { id: 'mer-sum', type: 'animation' }, lineState: { params: { range: 100 }, annotation: { text: 'M(n) 前缀和', position: 'top' } } },
  { lineId: 'mer-2', sectionId: 'mertens', scene: { id: 'mer-walk', type: 'animation' }, lineState: { params: { range: 100 }, annotation: { text: '零轴附近游走', position: 'bottom' } } },
  { lineId: 'mer-3', sectionId: 'mertens', scene: { id: 'mer-riemann', type: 'animation' }, lineState: { params: { range: 100 }, annotation: { text: '关联黎曼猜想', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-range', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { range: 60 }, annotation: { text: '调整观察范围', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-line', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { range: 100 }, annotation: { text: '看折线蜿蜒', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '编码素因子结构', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-rule', type: 'summary' }, lineState: { annotation: { text: '平方归零 · 奇偶定正负', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
