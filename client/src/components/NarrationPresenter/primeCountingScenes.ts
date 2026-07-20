/**
 * 素数计数讲解场景配置
 * 每句口播对应绘图上界（params.upper）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPrimeCountingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const primeCountingScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '素数计数与素数定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-sparse', type: 'animation' }, lineState: { params: { upper: 100 }, annotation: { text: '素数越来越稀', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-count', type: 'animation' }, lineState: { params: { upper: 1000 }, annotation: { text: '密度在下降', position: 'bottom' } } },

  // ===== pi (3) =====
  { lineId: 'pi-1', sectionId: 'pi', scene: { id: 'pi-define', type: 'animation' }, lineState: { params: { upper: 100 }, annotation: { text: 'π(x) 素数个数', position: 'top' } } },
  { lineId: 'pi-2', sectionId: 'pi', scene: { id: 'pi-step', type: 'animation' }, lineState: { params: { upper: 100 }, annotation: { text: '阶梯曲线', position: 'bottom' } } },
  { lineId: 'pi-3', sectionId: 'pi', scene: { id: 'pi-hidden', type: 'animation' }, lineState: { params: { upper: 1000 }, annotation: { text: '暗藏规律', position: 'bottom' } } },

  // ===== pnt (3) =====
  { lineId: 'pnt-1', sectionId: 'pnt', scene: { id: 'pnt-law', type: 'animation' }, lineState: { params: { upper: 1000 }, annotation: { text: 'π(x) ~ x/ln x', position: 'top' } } },
  { lineId: 'pnt-2', sectionId: 'pnt', scene: { id: 'pnt-ratio', type: 'animation' }, lineState: { params: { upper: 10000 }, annotation: { text: '比值趋近 1', position: 'bottom' } } },
  { lineId: 'pnt-3', sectionId: 'pnt', scene: { id: 'pnt-smooth', type: 'animation' }, lineState: { params: { upper: 10000 }, annotation: { text: '平滑而确定', position: 'bottom' } } },

  // ===== li (2) =====
  { lineId: 'li-1', sectionId: 'li', scene: { id: 'li-define', type: 'animation' }, lineState: { params: { upper: 1000 }, annotation: { text: 'Li(x) 对数积分', position: 'top' } } },
  { lineId: 'li-2', sectionId: 'li', scene: { id: 'li-fit', type: 'animation' }, lineState: { params: { upper: 10000 }, annotation: { text: '贴着阶梯走', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-upper', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { upper: 1000 }, annotation: { text: '调整上界 x', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-converge', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { upper: 10000 }, annotation: { text: '三线几乎重合', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: 'π(x) 阶梯', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-approx', type: 'summary' }, lineState: { annotation: { text: 'x/ln x 与 Li(x)', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
