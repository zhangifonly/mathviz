/**
 * 希尔伯特曲线讲解场景配置
 * 每句口播对应曲线阶数（params.order）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHilbertCurveState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const hilbertCurveScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '希尔伯特曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fill', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '一维填满二维', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-visit', type: 'animation' }, lineState: { params: { order: 4 }, annotation: { text: '走遍每格不重复', position: 'bottom' } } },

  // ===== construct (3) =====
  { lineId: 'con-1', sectionId: 'construct', scene: { id: 'con-u', type: 'animation' }, lineState: { params: { order: 3 }, annotation: { text: '基础 U 形', position: 'top' } } },
  { lineId: 'con-2', sectionId: 'construct', scene: { id: 'con-split', type: 'animation' }, lineState: { params: { order: 4 }, annotation: { text: '四块各放一条', position: 'bottom' } } },
  { lineId: 'con-3', sectionId: 'construct', scene: { id: 'con-join', type: 'animation' }, lineState: { params: { order: 5 }, annotation: { text: '旋转翻转拼接', position: 'bottom' } } },

  // ===== locality (3) =====
  { lineId: 'loc-1', sectionId: 'locality', scene: { id: 'loc-key', type: 'animation' }, lineState: { params: { order: 4 }, annotation: { text: '邻近保持', position: 'top' } } },
  { lineId: 'loc-2', sectionId: 'locality', scene: { id: 'loc-near', type: 'animation' }, lineState: { params: { order: 5 }, annotation: { text: '一维近则二维近', position: 'bottom' } } },
  { lineId: 'loc-3', sectionId: 'locality', scene: { id: 'loc-encode', type: 'animation' }, lineState: { params: { order: 5 }, annotation: { text: '二维压进一维', position: 'bottom' } } },

  // ===== apply (2) =====
  { lineId: 'app-1', sectionId: 'apply', scene: { id: 'app-image', type: 'animation' }, lineState: { params: { order: 5 }, annotation: { text: '图像扫描', position: 'top' } } },
  { lineId: 'app-2', sectionId: 'apply', scene: { id: 'app-index', type: 'animation' }, lineState: { params: { order: 6 }, annotation: { text: '空间索引', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-order', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 6 }, annotation: { text: '调整阶数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-dots', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { order: 5 }, annotation: { text: '渐变色顺序', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '递归填满平面', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-locality', type: 'summary' }, lineState: { annotation: { text: '邻近保持', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
