/**
 * 级数收敛判别讲解场景配置
 * 每句口播对应级数种类（params.key）与项数（params.N）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSeriesConvergenceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const seriesConvergenceScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '级数收敛判别', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-conv', type: 'animation' }, lineState: { params: { key: 'geometric', N: 50 }, annotation: { text: '收敛=停在有限值', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-div', type: 'animation' }, lineState: { params: { key: 'harmonic', N: 120 }, annotation: { text: '发散=越加越大', position: 'bottom' } } },

  // ===== geometric (3) =====
  { lineId: 'geo-1', sectionId: 'geometric', scene: { id: 'geo-terms', type: 'animation' }, lineState: { params: { key: 'geometric', N: 20 }, annotation: { text: '每项减半', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'geometric', scene: { id: 'geo-limit', type: 'animation' }, lineState: { params: { key: 'geometric', N: 50 }, annotation: { text: '逼近 2', position: 'bottom' } } },
  { lineId: 'geo-3', sectionId: 'geometric', scene: { id: 'geo-ratio', type: 'animation' }, lineState: { params: { key: 'geometric', N: 50 }, annotation: { text: '公比<1 则收敛', position: 'bottom' } } },

  // ===== harmonic (3) =====
  { lineId: 'har-1', sectionId: 'harmonic', scene: { id: 'har-terms', type: 'animation' }, lineState: { params: { key: 'harmonic', N: 50 }, annotation: { text: '项趋于零', position: 'top' } } },
  { lineId: 'har-2', sectionId: 'harmonic', scene: { id: 'har-grow', type: 'animation' }, lineState: { params: { key: 'harmonic', N: 120 }, annotation: { text: '缓慢涨向无穷', position: 'bottom' } } },
  { lineId: 'har-3', sectionId: 'harmonic', scene: { id: 'har-trap', type: 'animation' }, lineState: { params: { key: 'harmonic', N: 120 }, annotation: { text: '经典陷阱', position: 'bottom' } } },

  // ===== ptest (3) =====
  { lineId: 'pt-1', sectionId: 'ptest', scene: { id: 'pt-p2', type: 'animation' }, lineState: { params: { key: 'p2', N: 50 }, annotation: { text: '收敛到 pi^2/6', position: 'top' } } },
  { lineId: 'pt-2', sectionId: 'ptest', scene: { id: 'pt-prule', type: 'animation' }, lineState: { params: { key: 'p2', N: 120 }, annotation: { text: 'p>1 收敛', position: 'bottom' } } },
  { lineId: 'pt-3', sectionId: 'ptest', scene: { id: 'pt-ratio', type: 'animation' }, lineState: { params: { key: 'alternating', N: 120 }, annotation: { text: '比值判别法', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { key: 'harmonic', N: 120 }, annotation: { text: '切换级数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-n', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { key: 'p2', N: 120 }, annotation: { text: '增大 N', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '看部分和的极限', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-cases', type: 'summary' }, lineState: { annotation: { text: '收敛与发散', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
