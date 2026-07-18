/**
 * 多项式求根讲解场景配置
 * 每句口播对应一组系数（params.coeffs，升幂）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPolynomialRootsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

// 复用的示例系数（升幂）
const QUAD = [-1, 0, 1]           // x^2-1，两实根
const CUBIC = [0, -3, 0, 1]       // x^3-3x，三实根
const NOROOT = [1, 0, 1]          // x^2+1，无实根（一对共轭复根）
const QUARTIC = [-4, 0, -3, 0, 1] // (x^2-4)(x^2+1)，两实根两复根

export const polynomialRootsScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '多项式求根', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-curve', type: 'animation' }, lineState: { params: { coeffs: QUAD }, annotation: { text: '把方程画成曲线', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-cross', type: 'animation' }, lineState: { params: { coeffs: QUAD }, annotation: { text: '穿过x轴=实根', position: 'bottom' } } },

  // ===== count (3) =====
  { lineId: 'cnt-1', sectionId: 'count', scene: { id: 'cnt-fta', type: 'animation' }, lineState: { params: { coeffs: CUBIC }, annotation: { text: 'n次有n个根', position: 'top' } } },
  { lineId: 'cnt-2', sectionId: 'count', scene: { id: 'cnt-degree', type: 'animation' }, lineState: { params: { coeffs: CUBIC }, annotation: { text: '不多不少', position: 'bottom' } } },
  { lineId: 'cnt-3', sectionId: 'count', scene: { id: 'cnt-hide', type: 'animation' }, lineState: { params: { coeffs: QUARTIC }, annotation: { text: '有的藏进复平面', position: 'bottom' } } },

  // ===== complex (3) =====
  { lineId: 'cpx-1', sectionId: 'complex', scene: { id: 'cpx-real', type: 'animation' }, lineState: { params: { coeffs: QUAD }, annotation: { text: '看得见的实根', position: 'top' } } },
  { lineId: 'cpx-2', sectionId: 'complex', scene: { id: 'cpx-nocross', type: 'animation' }, lineState: { params: { coeffs: NOROOT }, annotation: { text: '不相交=复根', position: 'bottom' } } },
  { lineId: 'cpx-3', sectionId: 'complex', scene: { id: 'cpx-pair', type: 'animation' }, lineState: { params: { coeffs: NOROOT }, annotation: { text: '共轭成对出现', position: 'bottom' } } },

  // ===== numeric (3) =====
  { lineId: 'num-1', sectionId: 'numeric', scene: { id: 'num-nof', type: 'animation' }, lineState: { params: { coeffs: QUARTIC }, annotation: { text: '五次以上无公式', position: 'top' } } },
  { lineId: 'num-2', sectionId: 'numeric', scene: { id: 'num-bisect', type: 'animation' }, lineState: { params: { coeffs: CUBIC }, annotation: { text: '二分法夹逼', position: 'bottom' } } },
  { lineId: 'num-3', sectionId: 'numeric', scene: { id: 'num-newton', type: 'animation' }, lineState: { params: { coeffs: CUBIC }, annotation: { text: '牛顿法用切线', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slide', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { coeffs: CUBIC }, annotation: { text: '拖动系数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-move', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { coeffs: QUAD }, annotation: { text: '看根移动', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '交点=根', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-numeric', type: 'summary' }, lineState: { annotation: { text: '数值逼近', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
