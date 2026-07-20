/**
 * 卡特兰数讲解场景配置
 * 每句口播对应 n 值（params.n）与展示模式（params.mode）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCatalanNumbersState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const catalanNumbersScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '卡特兰数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-seq', type: 'animation' }, lineState: { params: { n: 4, mode: 'poly' }, annotation: { text: '1,1,2,5,14,42', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-faces', type: 'animation' }, lineState: { params: { n: 3, mode: 'paren' }, annotation: { text: '同一串数', position: 'bottom' } } },

  // ===== paren (3) =====
  { lineId: 'def-1', sectionId: 'paren', scene: { id: 'paren-ask', type: 'animation' }, lineState: { params: { n: 3, mode: 'paren' }, annotation: { text: 'n 对括号', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'paren', scene: { id: 'paren-rule', type: 'animation' }, lineState: { params: { n: 3, mode: 'paren' }, annotation: { text: '右不多于左', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'paren', scene: { id: 'paren-five', type: 'animation' }, lineState: { params: { n: 3, mode: 'paren' }, annotation: { text: 'C(3)=5', position: 'bottom' } } },

  // ===== tree (3) =====
  { lineId: 'tree-1', sectionId: 'tree', scene: { id: 'tree-ask', type: 'animation' }, lineState: { params: { n: 3, mode: 'tree' }, annotation: { text: '二叉树形态', position: 'top' } } },
  { lineId: 'tree-2', sectionId: 'tree', scene: { id: 'tree-map', type: 'animation' }, lineState: { params: { n: 3, mode: 'tree' }, annotation: { text: '括号对应树', position: 'bottom' } } },
  { lineId: 'tree-3', sectionId: 'tree', scene: { id: 'tree-same', type: 'animation' }, lineState: { params: { n: 4, mode: 'tree' }, annotation: { text: '数目相同', position: 'bottom' } } },

  // ===== poly (3) =====
  { lineId: 'poly-1', sectionId: 'poly', scene: { id: 'poly-cut', type: 'animation' }, lineState: { params: { n: 4, mode: 'poly' }, annotation: { text: '对角线切分', position: 'top' } } },
  { lineId: 'poly-2', sectionId: 'poly', scene: { id: 'poly-count', type: 'animation' }, lineState: { params: { n: 4, mode: 'poly' }, annotation: { text: '(n+2)边形', position: 'bottom' } } },
  { lineId: 'poly-3', sectionId: 'poly', scene: { id: 'poly-recur', type: 'animation' }, lineState: { params: { n: 5, mode: 'poly' }, annotation: { text: '卷积递推', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-n', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 5, mode: 'poly' }, annotation: { text: '选择 n', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-mode', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 4, mode: 'tree' }, annotation: { text: '切换视角', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recur', type: 'summary' }, lineState: { annotation: { text: '递推与闭式', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-unite', type: 'summary' }, lineState: { annotation: { text: '串成一家', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
