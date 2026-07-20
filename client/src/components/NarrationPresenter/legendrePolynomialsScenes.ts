/**
 * 勒让德多项式讲解场景配置
 * 每句口播对应展示的最高阶数（params.maxN）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLegendrePolynomialsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const legendrePolynomialsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '勒让德多项式', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-basis', type: 'animation' }, lineState: { params: { maxN: 2 }, annotation: { text: '想要正交的基', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { maxN: 3 }, annotation: { text: '区间 [-1,1] 上', position: 'bottom' } } },

  // ===== recur (3) =====
  { lineId: 'rec-1', sectionId: 'recur', scene: { id: 'rec-seed', type: 'animation' }, lineState: { params: { maxN: 1 }, annotation: { text: 'P0=1, P1=x', position: 'top' } } },
  { lineId: 'rec-2', sectionId: 'recur', scene: { id: 'rec-formula', type: 'animation' }, lineState: { params: { maxN: 3 }, annotation: { text: 'Bonnet 递推', position: 'bottom' } } },
  { lineId: 'rec-3', sectionId: 'recur', scene: { id: 'rec-highorder', type: 'animation' }, lineState: { params: { maxN: 4 }, annotation: { text: '任意高阶', position: 'bottom' } } },

  // ===== ortho (3) =====
  { lineId: 'ort-1', sectionId: 'ortho', scene: { id: 'ort-integral', type: 'comparison' }, lineState: { params: { maxN: 3 }, annotation: { text: '不同阶积分=0', position: 'top' } } },
  { lineId: 'ort-2', sectionId: 'ortho', scene: { id: 'ort-mean', type: 'comparison' }, lineState: { params: { maxN: 3 }, annotation: { text: '互相垂直', position: 'bottom' } } },
  { lineId: 'ort-3', sectionId: 'ortho', scene: { id: 'ort-diag', type: 'comparison' }, lineState: { params: { maxN: 4 }, annotation: { text: '只有对角非零', position: 'bottom' } } },

  // ===== apply (2) =====
  { lineId: 'app-1', sectionId: 'apply', scene: { id: 'app-gauss', type: 'animation' }, lineState: { params: { maxN: 4 }, annotation: { text: '高斯求积', position: 'top' } } },
  { lineId: 'app-2', sectionId: 'apply', scene: { id: 'app-harmonic', type: 'animation' }, lineState: { params: { maxN: 4 }, annotation: { text: '球谐函数', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-degree', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { maxN: 4 }, annotation: { text: '调整最高阶', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-check', type: 'comparison' }, lineState: { params: { maxN: 4 }, annotation: { text: '非对角恒为零', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '递推·正交', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: '求积与球谐', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
