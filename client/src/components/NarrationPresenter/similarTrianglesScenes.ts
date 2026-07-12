/**
 * 相似三角形讲解场景配置
 * 每句口播对应相似比（params.k）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSimilarTrianglesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const similarTrianglesScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '相似三角形', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-scale', type: 'animation' }, lineState: { params: { k: 1.5 }, annotation: { text: '变大变小仍是同一形状', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-triangle', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '用三角形看规律', position: 'bottom' } } },

  // ===== definition (3) =====
  { lineId: 'def-1', sectionId: 'definition', scene: { id: 'def-shape', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '形状相同大小不同', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'definition', scene: { id: 'def-pair', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '一对相似三角形', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'definition', scene: { id: 'def-angle', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '对应角相等', position: 'bottom' } } },

  // ===== angles (2) =====
  { lineId: 'ang-1', sectionId: 'angles', scene: { id: 'ang-invariant', type: 'animation' }, lineState: { params: { k: 1.5 }, annotation: { text: '内角始终不变', position: 'top' } } },
  { lineId: 'ang-2', sectionId: 'angles', scene: { id: 'ang-determine', type: 'animation' }, lineState: { params: { k: 3 }, annotation: { text: '角决定形状', position: 'bottom' } } },

  // ===== ratio (4) =====
  { lineId: 'rat-1', sectionId: 'ratio', scene: { id: 'rat-side', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '秘密藏在边长', position: 'top' } } },
  { lineId: 'rat-2', sectionId: 'ratio', scene: { id: 'rat-k', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '对应边之比 = 相似比', position: 'top' } } },
  { lineId: 'rat-3', sectionId: 'ratio', scene: { id: 'rat-area', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '面积比 = 相似比的平方', position: 'bottom' } } },
  { lineId: 'rat-4', sectionId: 'ratio', scene: { id: 'rat-square', type: 'animation' }, lineState: { params: { k: 2 }, annotation: { text: '边 2 倍，面积 4 倍', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-scale', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { k: 3 }, annotation: { text: '切换相似比', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-area', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { k: 0.5 }, annotation: { text: '观察面积比', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '角相等，边成比例', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-area', type: 'summary' }, lineState: { annotation: { text: '面积 = 相似比平方', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '相似无处不在！', position: 'bottom' } } },
]
