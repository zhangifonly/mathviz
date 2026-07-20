/**
 * 庞加莱圆盘讲解场景配置
 * params.ti 选择镶嵌类型；params.parallels 是否叠加过原点测地线
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPoincareDiskState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const poincareDiskScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '庞加莱圆盘', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fifth', type: 'animation' }, lineState: { params: { ti: 0 }, annotation: { text: '第五公设的困扰', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-birth', type: 'animation' }, lineState: { params: { ti: 0 }, annotation: { text: '双曲几何诞生', position: 'bottom' } } },

  // ===== model (3) =====
  { lineId: 'def-1', sectionId: 'model', scene: { id: 'def-disk', type: 'animation' }, lineState: { params: { ti: 0 }, annotation: { text: '整个平面装进圆盘', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'model', scene: { id: 'def-boundary', type: 'animation' }, lineState: { params: { ti: 0 }, annotation: { text: '边界是无穷远', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'model', scene: { id: 'def-scale', type: 'animation' }, lineState: { params: { ti: 1 }, annotation: { text: '越近边界越小其实全等', position: 'bottom' } } },

  // ===== geodesic (3) =====
  { lineId: 'geo-1', sectionId: 'geodesic', scene: { id: 'geo-arc', type: 'animation' }, lineState: { params: { ti: 0, parallels: true }, annotation: { text: '测地线是垂直边界的弧', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'geodesic', scene: { id: 'geo-diameter', type: 'animation' }, lineState: { params: { ti: 0, parallels: true }, annotation: { text: '过圆心退化为直径', position: 'bottom' } } },
  { lineId: 'geo-3', sectionId: 'geodesic', scene: { id: 'geo-line', type: 'animation' }, lineState: { params: { ti: 1, parallels: true }, annotation: { text: '弧就是双曲直线', position: 'bottom' } } },

  // ===== parallel (2) =====
  { lineId: 'par-1', sectionId: 'parallel', scene: { id: 'par-many', type: 'animation' }, lineState: { params: { ti: 0, parallels: true }, annotation: { text: '无穷多条平行线', position: 'top' } } },
  { lineId: 'par-2', sectionId: 'parallel', scene: { id: 'par-fail', type: 'animation' }, lineState: { params: { ti: 0, parallels: true }, annotation: { text: '第五公设失效', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { ti: 0 }, annotation: { text: '拖动看测地线', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-tiling', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { ti: 2 }, annotation: { text: '切换镶嵌铺满', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-finite', type: 'summary' }, lineState: { annotation: { text: '无限装进有限', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-geo', type: 'summary' }, lineState: { annotation: { text: '弧线与无穷平行', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
