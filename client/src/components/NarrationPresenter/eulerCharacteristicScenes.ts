/**
 * 欧拉示性数讲解场景配置
 * params.idx 选择形状：0-4 为五种正多面体，5 为环面
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEulerCharacteristicState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const eulerCharacteristicScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '欧拉示性数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-cube', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '8 顶点·12 棱·6 面', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-hint', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '藏着恒等关系', position: 'top' } } },

  // ===== formula (3) =====
  { lineId: 'def-1', sectionId: 'formula', scene: { id: 'def-vef', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: 'V - E + F', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'formula', scene: { id: 'def-cube2', type: 'animation' }, lineState: { params: { idx: 1 }, annotation: { text: '8-12+6=2', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'formula', scene: { id: 'def-chi', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: 'χ = V-E+F', position: 'bottom' } } },

  // ===== convex (3) =====
  { lineId: 'con-1', sectionId: 'convex', scene: { id: 'con-tetra', type: 'animation' }, lineState: { params: { idx: 0 }, annotation: { text: '四面体 χ=2', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'convex', scene: { id: 'con-octa', type: 'animation' }, lineState: { params: { idx: 2 }, annotation: { text: '八面体 χ=2', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'convex', scene: { id: 'con-dodeca', type: 'animation' }, lineState: { params: { idx: 3 }, annotation: { text: '恒等于 2', position: 'bottom' } } },

  // ===== topology (3) =====
  { lineId: 'top-1', sectionId: 'topology', scene: { id: 'top-sphere', type: 'animation' }, lineState: { params: { idx: 4 }, annotation: { text: '球面的标志', position: 'top' } } },
  { lineId: 'top-2', sectionId: 'topology', scene: { id: 'top-blow', type: 'animation' }, lineState: { params: { idx: 4 }, annotation: { text: '都等价于球面', position: 'bottom' } } },
  { lineId: 'top-3', sectionId: 'topology', scene: { id: 'top-torus', type: 'animation' }, lineState: { params: { idx: 5 }, annotation: { text: '环面 χ=0', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 3 }, annotation: { text: '切换多面体', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-torus', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { idx: 5 }, annotation: { text: '验证 χ=0', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '凸多面体 χ=2', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-genus', type: 'summary' }, lineState: { annotation: { text: 'χ = 2 - 2g', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
