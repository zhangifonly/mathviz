/**
 * 旋转卡壳讲解场景配置
 * 每句口播对应点数量（params.count）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultRotatingCalipersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const rotatingCalipersScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '旋转卡壳', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-width', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: '点集有多宽？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-brute', type: 'animation' }, lineState: { params: { count: 24 }, annotation: { text: '两两比较太慢', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { count: 24 }, annotation: { text: '又快又优雅', position: 'bottom' } } },

  // ===== hull (3) =====
  { lineId: 'hull-1', sectionId: 'hull', scene: { id: 'hull-band', type: 'animation' }, lineState: { params: { count: 24 }, annotation: { text: '橡皮筋箍出凸包', position: 'top' } } },
  { lineId: 'hull-2', sectionId: 'hull', scene: { id: 'hull-onhull', type: 'animation' }, lineState: { params: { count: 24 }, annotation: { text: '最远点在凸包上', position: 'bottom' } } },
  { lineId: 'hull-3', sectionId: 'hull', scene: { id: 'hull-few', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: '只剩少数顶点', position: 'bottom' } } },

  // ===== antipodal (3) =====
  { lineId: 'anti-1', sectionId: 'antipodal', scene: { id: 'anti-clamp', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: '平行线夹住', position: 'top' } } },
  { lineId: 'anti-2', sectionId: 'antipodal', scene: { id: 'anti-pair', type: 'animation' }, lineState: { params: { count: 12 }, annotation: { text: '对踵点对', position: 'bottom' } } },
  { lineId: 'anti-3', sectionId: 'antipodal', scene: { id: 'anti-diam', type: 'animation' }, lineState: { params: { count: 24 }, annotation: { text: '直径在其中', position: 'bottom' } } },

  // ===== rotate (3) =====
  { lineId: 'rot-1', sectionId: 'rotate', scene: { id: 'rot-spin', type: 'animation' }, lineState: { params: { count: 24 }, annotation: { text: '卡钳旋转一圈', position: 'top' } } },
  { lineId: 'rot-2', sectionId: 'rotate', scene: { id: 'rot-advance', type: 'animation' }, lineState: { params: { count: 24 }, annotation: { text: '对面顶点推进', position: 'bottom' } } },
  { lineId: 'rot-3', sectionId: 'rotate', scene: { id: 'rot-rect', type: 'animation' }, lineState: { params: { count: 48 }, annotation: { text: '顺手量外接矩形', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 48 }, annotation: { text: '调整点数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 24 }, annotation: { text: '重新随机', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '凸包+旋转卡钳', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-linear', type: 'summary' }, lineState: { annotation: { text: '线性求直径', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
