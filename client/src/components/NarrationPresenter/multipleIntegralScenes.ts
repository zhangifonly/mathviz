/**
 * 重积分讲解场景配置
 * 每句口播对应网格密度 n、函数索引 fn、区域索引 dom
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMultipleIntegralState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const multipleIntegralScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '重积分', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-surface', type: 'animation' }, lineState: { params: { n: 8, fn: 0, dom: 0 }, annotation: { text: '曲面下的体积', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { n: 8, fn: 0, dom: 0 }, annotation: { text: '二重积分登场', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-slice', type: 'animation' }, lineState: { params: { n: 8, fn: 0, dom: 0 }, annotation: { text: '切成小柱子', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-column', type: 'animation' }, lineState: { params: { n: 16, fn: 0, dom: 0 }, annotation: { text: '底面积 × 高度', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-sum', type: 'animation' }, lineState: { params: { n: 16, fn: 0, dom: 0 }, annotation: { text: '∫∫ f dA', position: 'bottom' } } },

  // ===== iterate (3) =====
  { lineId: 'itr-1', sectionId: 'iterate', scene: { id: 'itr-two', type: 'animation' }, lineState: { params: { n: 16, fn: 1, dom: 1 }, annotation: { text: '拆成两次积分', position: 'top' } } },
  { lineId: 'itr-2', sectionId: 'iterate', scene: { id: 'itr-x', type: 'animation' }, lineState: { params: { n: 16, fn: 1, dom: 1 }, annotation: { text: '先沿 x 积一刀', position: 'bottom' } } },
  { lineId: 'itr-3', sectionId: 'iterate', scene: { id: 'itr-y', type: 'animation' }, lineState: { params: { n: 16, fn: 1, dom: 1 }, annotation: { text: '再沿 y 累加', position: 'bottom' } } },

  // ===== approx (3) =====
  { lineId: 'apx-1', sectionId: 'approx', scene: { id: 'apx-grid', type: 'animation' }, lineState: { params: { n: 8, fn: 2, dom: 2 }, annotation: { text: 'n×n 网格', position: 'top' } } },
  { lineId: 'apx-2', sectionId: 'approx', scene: { id: 'apx-mid', type: 'animation' }, lineState: { params: { n: 16, fn: 2, dom: 2 }, annotation: { text: '中点取高度', position: 'bottom' } } },
  { lineId: 'apx-3', sectionId: 'approx', scene: { id: 'apx-riemann', type: 'animation' }, lineState: { params: { n: 32, fn: 2, dom: 2 }, annotation: { text: '黎曼和逼近', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-density', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 32, fn: 0, dom: 0 }, annotation: { text: '调网格密度', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-swap', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 16, fn: 3, dom: 0 }, annotation: { text: '换函数与区域', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '体积 = 柱子累加', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-iter', type: 'summary' }, lineState: { annotation: { text: '累次积分', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
