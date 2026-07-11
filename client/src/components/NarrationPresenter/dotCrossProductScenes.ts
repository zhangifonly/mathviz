/**
 * 点积与叉积讲解场景配置
 * 每句口播对应绘制模式（params.mode）与预设向量对（params.pair）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDotCrossProductState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const dotCrossProductScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '点积与叉积', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-two', type: 'animation' }, lineState: { params: { mode: 'dot', pair: 'general' }, annotation: { text: '两种乘法', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-geo', type: 'animation' }, lineState: { params: { mode: 'dot', pair: 'general' }, annotation: { text: '几何图像', position: 'bottom' } } },

  // ===== dot (4) =====
  { lineId: 'dot-1', sectionId: 'dot', scene: { id: 'dot-formula', type: 'animation' }, lineState: { params: { mode: 'dot', pair: 'general' }, annotation: { text: '对应坐标相乘求和', position: 'top' } } },
  { lineId: 'dot-2', sectionId: 'dot', scene: { id: 'dot-cos', type: 'animation' }, lineState: { params: { mode: 'dot', pair: 'general' }, annotation: { text: '长度乘积乘余弦', position: 'top' } } },
  { lineId: 'dot-3', sectionId: 'dot', scene: { id: 'dot-proj', type: 'animation' }, lineState: { params: { mode: 'dot', pair: 'general' }, annotation: { text: '投影大小', position: 'bottom' } } },
  { lineId: 'dot-4', sectionId: 'dot', scene: { id: 'dot-perp', type: 'animation' }, lineState: { params: { mode: 'dot', pair: 'perpendicular' }, annotation: { text: '垂直时点积为零', position: 'bottom' } } },

  // ===== cross (3) =====
  { lineId: 'cross-1', sectionId: 'cross', scene: { id: 'cross-vec', type: 'animation' }, lineState: { params: { mode: 'cross', pair: 'general' }, annotation: { text: '结果是新向量', position: 'top' } } },
  { lineId: 'cross-2', sectionId: 'cross', scene: { id: 'cross-dir', type: 'animation' }, lineState: { params: { mode: 'cross', pair: 'general' }, annotation: { text: '右手定则定方向', position: 'top' } } },
  { lineId: 'cross-3', sectionId: 'cross', scene: { id: 'cross-area', type: 'animation' }, lineState: { params: { mode: 'cross', pair: 'general' }, annotation: { text: '模长即面积', position: 'bottom' } } },

  // ===== geometry (3) =====
  { lineId: 'geo-1', sectionId: 'geometry', scene: { id: 'geo-cos', type: 'animation' }, lineState: { params: { mode: 'dot', pair: 'general' }, annotation: { text: '余弦管投影', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'geometry', scene: { id: 'geo-sin', type: 'animation' }, lineState: { params: { mode: 'cross', pair: 'general' }, annotation: { text: '正弦管面积', position: 'top' } } },
  { lineId: 'geo-3', sectionId: 'geometry', scene: { id: 'geo-complement', type: 'animation' }, lineState: { params: { mode: 'cross', pair: 'general' }, annotation: { text: '平行与垂直互补', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-perp', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'dot', pair: 'perpendicular' }, annotation: { text: '垂直点积归零', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-para', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'cross', pair: 'parallel' }, annotation: { text: '平行叉积归零', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-dot', type: 'summary' }, lineState: { annotation: { text: '点积: 标量·余弦·投影', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-cross', type: 'summary' }, lineState: { annotation: { text: '叉积: 向量·正弦·面积', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
