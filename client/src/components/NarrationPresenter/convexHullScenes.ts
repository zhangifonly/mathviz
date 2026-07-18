/**
 * 凸包算法讲解场景配置
 * 每句口播对应散点数量（params.count）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultConvexHullState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const convexHullScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '凸包算法', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-band', type: 'animation' }, lineState: { params: { count: 20 }, annotation: { text: '橡皮筋收缩', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { count: 20 }, annotation: { text: '勾勒出凸包', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-min', type: 'animation' }, lineState: { params: { count: 10 }, annotation: { text: '最小凸多边形', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-vertex', type: 'animation' }, lineState: { params: { count: 20 }, annotation: { text: '顶点来自散点', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-convex', type: 'animation' }, lineState: { params: { count: 20 }, annotation: { text: '绝不向内凹陷', position: 'bottom' } } },

  // ===== cross (3) =====
  { lineId: 'cross-1', sectionId: 'cross', scene: { id: 'cross-turn', type: 'animation' }, lineState: { params: { count: 10 }, annotation: { text: '左拐还是右拐', position: 'top' } } },
  { lineId: 'cross-2', sectionId: 'cross', scene: { id: 'cross-sign', type: 'animation' }, lineState: { params: { count: 10 }, annotation: { text: '叉积定符号', position: 'bottom' } } },
  { lineId: 'cross-3', sectionId: 'cross', scene: { id: 'cross-drop', type: 'animation' }, lineState: { params: { count: 20 }, annotation: { text: '右转就舍弃', position: 'bottom' } } },

  // ===== chain (3) =====
  { lineId: 'chain-1', sectionId: 'chain', scene: { id: 'chain-sort', type: 'animation' }, lineState: { params: { count: 20 }, annotation: { text: '按横坐标排序', position: 'top' } } },
  { lineId: 'chain-2', sectionId: 'chain', scene: { id: 'chain-scan', type: 'animation' }, lineState: { params: { count: 20 }, annotation: { text: '下链与上链', position: 'bottom' } } },
  { lineId: 'chain-3', sectionId: 'chain', scene: { id: 'chain-merge', type: 'animation' }, lineState: { params: { count: 40 }, annotation: { text: '拼成完整凸包', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 40 }, annotation: { text: '调整散点数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 20 }, annotation: { text: '随机重新收紧', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '最小凸多边形', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-algo', type: 'summary' }, lineState: { annotation: { text: '排序加扫描', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
