/**
 * 韦达定理讲解场景配置
 * 每句口播对应一组根（params.rootsIdx，索引 SAMPLE_ROOTS）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultVietaFormulasState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const vietaFormulasScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '韦达定理', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-hidden', type: 'animation' }, lineState: { params: { rootsIdx: 0 }, annotation: { text: '根藏在系数里', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-sumprod', type: 'animation' }, lineState: { params: { rootsIdx: 1 }, annotation: { text: '只看系数知和与积', position: 'bottom' } } },

  // ===== quadratic (3) =====
  { lineId: 'quad-1', sectionId: 'quadratic', scene: { id: 'quad-eq', type: 'animation' }, lineState: { params: { rootsIdx: 0 }, annotation: { text: 'a x^2 + b x + c', position: 'top' } } },
  { lineId: 'quad-2', sectionId: 'quadratic', scene: { id: 'quad-expand', type: 'animation' }, lineState: { params: { rootsIdx: 1 }, annotation: { text: '展开对比系数', position: 'bottom' } } },
  { lineId: 'quad-3', sectionId: 'quadratic', scene: { id: 'quad-vieta', type: 'animation' }, lineState: { params: { rootsIdx: 1 }, annotation: { text: '和=-b/a, 积=c/a', position: 'bottom' } } },

  // ===== higher (3) =====
  { lineId: 'high-1', sectionId: 'higher', scene: { id: 'high-cubic', type: 'animation' }, lineState: { params: { rootsIdx: 2 }, annotation: { text: '推广到高次', position: 'top' } } },
  { lineId: 'high-2', sectionId: 'higher', scene: { id: 'high-sum', type: 'animation' }, lineState: { params: { rootsIdx: 2 }, annotation: { text: '和=-a_{n-1}/a_n', position: 'bottom' } } },
  { lineId: 'high-3', sectionId: 'higher', scene: { id: 'high-prod', type: 'animation' }, lineState: { params: { rootsIdx: 3 }, annotation: { text: '积=(-1)^n a_0/a_n', position: 'bottom' } } },

  // ===== symmetric (2) =====
  { lineId: 'sym-1', sectionId: 'symmetric', scene: { id: 'sym-elem', type: 'animation' }, lineState: { params: { rootsIdx: 2 }, annotation: { text: '初等对称多项式', position: 'top' } } },
  { lineId: 'sym-2', sectionId: 'symmetric', scene: { id: 'sym-coeff', type: 'animation' }, lineState: { params: { rootsIdx: 3 }, annotation: { text: '系数=±e_k', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rootsIdx: 2 }, annotation: { text: '切换不同的根', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-check', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rootsIdx: 1 }, annotation: { text: '和与积始终吻合', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '系数是根的对称函数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-rules', type: 'summary' }, lineState: { annotation: { text: '和与积的公式', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
