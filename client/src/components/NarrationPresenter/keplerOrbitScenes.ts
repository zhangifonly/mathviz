/**
 * 开普勒轨道讲解场景配置
 * 每句口播对应轨道离心率（params.ecc）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultKeplerOrbitState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const keplerOrbitScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '开普勒轨道', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-mars', type: 'animation' }, lineState: { params: { ecc: 0.4 }, annotation: { text: '火星的轨迹之谜', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-ellipse', type: 'animation' }, lineState: { params: { ecc: 0.4 }, annotation: { text: '轨道是椭圆', position: 'bottom' } } },

  // ===== orbit (3) =====
  { lineId: 'orbit-1', sectionId: 'orbit', scene: { id: 'orbit-focus', type: 'animation' }, lineState: { params: { ecc: 0.6 }, annotation: { text: '太阳在焦点', position: 'top' } } },
  { lineId: 'orbit-2', sectionId: 'orbit', scene: { id: 'orbit-peri', type: 'animation' }, lineState: { params: { ecc: 0.6 }, annotation: { text: '近日点·远日点', position: 'bottom' } } },
  { lineId: 'orbit-3', sectionId: 'orbit', scene: { id: 'orbit-ecc', type: 'animation' }, lineState: { params: { ecc: 0.8 }, annotation: { text: '越扁差别越大', position: 'bottom' } } },

  // ===== area (3) =====
  { lineId: 'area-1', sectionId: 'area', scene: { id: 'area-law', type: 'animation' }, lineState: { params: { ecc: 0.6 }, annotation: { text: '等时扫等面积', position: 'top' } } },
  { lineId: 'area-2', sectionId: 'area', scene: { id: 'area-fast', type: 'animation' }, lineState: { params: { ecc: 0.8 }, annotation: { text: '近日点跑得快', position: 'bottom' } } },
  { lineId: 'area-3', sectionId: 'area', scene: { id: 'area-slow', type: 'animation' }, lineState: { params: { ecc: 0.8 }, annotation: { text: '远日点慢悠悠', position: 'bottom' } } },

  // ===== equation (3) =====
  { lineId: 'eq-1', sectionId: 'equation', scene: { id: 'eq-form', type: 'animation' }, lineState: { params: { ecc: 0.6 }, annotation: { text: 'M = E − e·sinE', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equation', scene: { id: 'eq-mean', type: 'animation' }, lineState: { params: { ecc: 0.6 }, annotation: { text: 'E 是偏近点角', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equation', scene: { id: 'eq-newton', type: 'animation' }, lineState: { params: { ecc: 0.6 }, annotation: { text: '牛顿迭代求解', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-ecc', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { ecc: 0.4 }, annotation: { text: '调整离心率', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-fan', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { ecc: 0.8 }, annotation: { text: '扇形面积不变', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '椭圆绕日', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-area', type: 'summary' }, lineState: { annotation: { text: '等时等面积', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
