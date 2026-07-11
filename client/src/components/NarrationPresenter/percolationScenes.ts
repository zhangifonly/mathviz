/**
 * 渗流模型讲解场景配置
 * 每句口播对应一个开放概率 p（params.p）与随机种子（params.seed）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPercolationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const percolationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '渗流模型', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-lattice', type: 'animation' }, lineState: { params: { p: 0.45, seed: 7 }, annotation: { text: '每格以概率 p 开放', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-transition', type: 'animation' }, lineState: { params: { p: 0.45, seed: 7 }, annotation: { text: '藏着锋利的相变', position: 'bottom' } } },

  // ===== cluster (3) =====
  { lineId: 'cluster-1', sectionId: 'cluster', scene: { id: 'cluster-connect', type: 'animation' }, lineState: { params: { p: 0.45, seed: 7 }, annotation: { text: '四连通组成簇', position: 'top' } } },
  { lineId: 'cluster-2', sectionId: 'cluster', scene: { id: 'cluster-four', type: 'animation' }, lineState: { params: { p: 0.45, seed: 7 }, annotation: { text: '斜对角不相连', position: 'bottom' } } },
  { lineId: 'cluster-3', sectionId: 'cluster', scene: { id: 'cluster-small', type: 'animation' }, lineState: { params: { p: 0.45, seed: 7 }, annotation: { text: '低 p 只有零散小簇', position: 'bottom' } } },

  // ===== critical (3) =====
  { lineId: 'critical-1', sectionId: 'critical', scene: { id: 'critical-emerge', type: 'animation' }, lineState: { params: { p: 0.59, seed: 7 }, annotation: { text: '巨簇突然涌现', position: 'top' } } },
  { lineId: 'critical-2', sectionId: 'critical', scene: { id: 'critical-pc', type: 'animation' }, lineState: { params: { p: 0.59, seed: 7 }, annotation: { text: 'p_c ≈ 0.5927', position: 'top' } } },
  { lineId: 'critical-3', sectionId: 'critical', scene: { id: 'critical-span', type: 'animation' }, lineState: { params: { p: 0.65, seed: 7 }, annotation: { text: '顶端贯穿到底端', position: 'bottom' } } },

  // ===== phase (3) =====
  { lineId: 'phase-1', sectionId: 'phase', scene: { id: 'phase-order-low', type: 'animation' }, lineState: { params: { p: 0.45, seed: 7 }, annotation: { text: '临界之下序参量近零', position: 'top' } } },
  { lineId: 'phase-2', sectionId: 'phase', scene: { id: 'phase-order-high', type: 'animation' }, lineState: { params: { p: 0.75, seed: 7 }, annotation: { text: '越过临界陡然升起', position: 'top' } } },
  { lineId: 'phase-3', sectionId: 'phase', scene: { id: 'phase-fractal', type: 'animation' }, lineState: { params: { p: 0.59, seed: 7 }, annotation: { text: '临界点上呈分形', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 0.55, seed: 7 }, annotation: { text: '拖动 p 观察合并', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-spanning', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { p: 0.65, seed: 7 }, annotation: { text: '金色贯穿簇', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '连通性的突然涌现', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-universal', type: 'summary' }, lineState: { annotation: { text: '相变的普适语言', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '渗流无处不在！', position: 'bottom' } } },
]
