/**
 * 纽结理论讲解场景配置
 * 每句口播对应一个纽结（params.knot）与标注
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultKnotTheoryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const knotTheoryScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '纽结理论', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-question', type: 'animation' }, lineState: { params: { knot: 'trefoil' }, annotation: { text: '能否互相变形？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-depth', type: 'animation' }, lineState: { params: { knot: 'trefoil' }, annotation: { text: '拓扑的深刻问题', position: 'bottom' } } },

  // ===== crossing (3) =====
  { lineId: 'cross-1', sectionId: 'crossing', scene: { id: 'cross-project', type: 'animation' }, lineState: { params: { knot: 'trefoil' }, annotation: { text: '记录上下穿越', position: 'top' } } },
  { lineId: 'cross-2', sectionId: 'crossing', scene: { id: 'cross-number', type: 'animation' }, lineState: { params: { knot: 'trefoil' }, annotation: { text: '最少交叉点', position: 'top' } } },
  { lineId: 'cross-3', sectionId: 'crossing', scene: { id: 'cross-trefoil', type: 'animation' }, lineState: { params: { knot: 'trefoil' }, annotation: { text: '三叶结: 交叉数 3', position: 'bottom' } } },

  // ===== invariant (3) =====
  { lineId: 'inv-1', sectionId: 'invariant', scene: { id: 'inv-idea', type: 'animation' }, lineState: { params: { knot: 'figure-eight' }, annotation: { text: '变形不变的量', position: 'top' } } },
  { lineId: 'inv-2', sectionId: 'invariant', scene: { id: 'inv-genus', type: 'animation' }, lineState: { params: { knot: 'figure-eight' }, annotation: { text: '亏格', position: 'top' } } },
  { lineId: 'inv-3', sectionId: 'invariant', scene: { id: 'inv-jones', type: 'animation' }, lineState: { params: { knot: 'figure-eight' }, annotation: { text: '琼斯多项式', position: 'bottom' } } },

  // ===== torus (2) =====
  { lineId: 'torus-1', sectionId: 'torus', scene: { id: 'torus-family', type: 'animation' }, lineState: { params: { knot: 'cinquefoil' }, annotation: { text: '环面纽结 T(p,q)', position: 'top' } } },
  { lineId: 'torus-2', sectionId: 'torus', scene: { id: 'torus-genus', type: 'animation' }, lineState: { params: { knot: 'cinquefoil' }, annotation: { text: '亏格 =(p-1)(q-1)/2', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { knot: 'trefoil' }, annotation: { text: '切换纽结', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { knot: 'cinquefoil' }, annotation: { text: '对比不变量', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '交叉数与亏格', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-jones', type: 'summary' }, lineState: { annotation: { text: '琼斯多项式连接量子物理', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '走进现代拓扑核心！', position: 'bottom' } } },
]
