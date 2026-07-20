/**
 * 球面几何讲解场景配置
 * params.preset 选预设三角形，params.rot 控制地球旋转角度（弧度）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSphericalGeometryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sphericalGeometryScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '球面几何', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-flight', type: 'animation' }, lineState: { params: { preset: 'cities', rot: 0.6 }, annotation: { text: '飞行走弧线', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-need', type: 'animation' }, lineState: { params: { preset: 'cities', rot: 1.1 }, annotation: { text: '球面无直线', position: 'bottom' } } },

  // ===== geodesic (3) =====
  { lineId: 'def-1', sectionId: 'geodesic', scene: { id: 'def-greatcircle', type: 'animation' }, lineState: { params: { preset: 'octant', rot: 0.4 }, annotation: { text: '大圆:赤道与经线', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'geodesic', scene: { id: 'def-shortest', type: 'animation' }, lineState: { params: { preset: 'cities', rot: 0.4 }, annotation: { text: '最短=大圆弧', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'geodesic', scene: { id: 'def-geodesic', type: 'animation' }, lineState: { params: { preset: 'cities', rot: 0.9 }, annotation: { text: '大圆即测地线', position: 'bottom' } } },

  // ===== anglesum (3) =====
  { lineId: 'sum-1', sectionId: 'anglesum', scene: { id: 'sum-triangle', type: 'animation' }, lineState: { params: { preset: 'octant', rot: 0.5 }, annotation: { text: '球面三角形', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'anglesum', scene: { id: 'sum-gt180', type: 'animation' }, lineState: { params: { preset: 'wide', rot: 0.5 }, annotation: { text: '内角和>180°', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'anglesum', scene: { id: 'sum-octant', type: 'animation' }, lineState: { params: { preset: 'octant', rot: 0.7 }, annotation: { text: '八分球=270°', position: 'bottom' } } },

  // ===== excess (3) =====
  { lineId: 'exc-1', sectionId: 'excess', scene: { id: 'exc-def', type: 'animation' }, lineState: { params: { preset: 'octant', rot: 0.7 }, annotation: { text: '盈余=和-180', position: 'top' } } },
  { lineId: 'exc-2', sectionId: 'excess', scene: { id: 'exc-area', type: 'animation' }, lineState: { params: { preset: 'wide', rot: 0.6 }, annotation: { text: '盈余×R²=面积', position: 'bottom' } } },
  { lineId: 'exc-3', sectionId: 'excess', scene: { id: 'exc-bigger', type: 'animation' }, lineState: { params: { preset: 'wide', rot: 1.2 }, annotation: { text: '越大盈余越大', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'cities', rot: 0.5 }, annotation: { text: '切换三角形', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-rotate', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'cities', rot: 1.6 }, annotation: { text: '旋转看大圆', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'end-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '大圆是直线', position: 'top' } } },
  { lineId: 'end-2', sectionId: 'summary', scene: { id: 'sum-excess', type: 'summary' }, lineState: { annotation: { text: '盈余正比面积', position: 'bottom' } } },
  { lineId: 'end-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
