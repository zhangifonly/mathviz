/**
 * 毕达哥拉斯树讲解场景配置
 * 每句口播对应递归深度 depth 与三角形倾角 angle
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPythagorasTreeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pythagorasTreeScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '毕达哥拉斯树', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-theorem', type: 'animation' }, lineState: { params: { depth: 1, angle: 45 }, annotation: { text: '勾股定理', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-grow', type: 'animation' }, lineState: { params: { depth: 5, angle: 45 }, annotation: { text: '让它长下去', position: 'bottom' } } },

  // ===== build (3) =====
  { lineId: 'def-1', sectionId: 'build', scene: { id: 'def-trunk', type: 'animation' }, lineState: { params: { depth: 0, angle: 45 }, annotation: { text: '树干正方形', position: 'bottom' } } },
  { lineId: 'def-2', sectionId: 'build', scene: { id: 'def-triangle', type: 'animation' }, lineState: { params: { depth: 1, angle: 45 }, annotation: { text: '顶边架三角形', position: 'top' } } },
  { lineId: 'def-3', sectionId: 'build', scene: { id: 'def-branch', type: 'animation' }, lineState: { params: { depth: 2, angle: 45 }, annotation: { text: '两条边生新正方形', position: 'top' } } },

  // ===== grow (3) =====
  { lineId: 'grow-1', sectionId: 'grow', scene: { id: 'grow-repeat', type: 'animation' }, lineState: { params: { depth: 4, angle: 45 }, annotation: { text: '重复动作', position: 'top' } } },
  { lineId: 'grow-2', sectionId: 'grow', scene: { id: 'grow-double', type: 'animation' }, lineState: { params: { depth: 7, angle: 45 }, annotation: { text: '每层翻倍', position: 'bottom' } } },
  { lineId: 'grow-3', sectionId: 'grow', scene: { id: 'grow-canopy', type: 'animation' }, lineState: { params: { depth: 10, angle: 45 }, annotation: { text: '茂密树冠', position: 'bottom' } } },

  // ===== fractal (2) =====
  { lineId: 'frac-1', sectionId: 'fractal', scene: { id: 'frac-self', type: 'animation' }, lineState: { params: { depth: 9, angle: 40 }, annotation: { text: '枝条像整棵树', position: 'top' } } },
  { lineId: 'frac-2', sectionId: 'fractal', scene: { id: 'frac-name', type: 'animation' }, lineState: { params: { depth: 11, angle: 45 }, annotation: { text: '这就是分形', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-depth', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 12, angle: 45 }, annotation: { text: '调整深度', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-angle', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 11, angle: 60 }, annotation: { text: '调整倾角', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-rule', type: 'summary' }, lineState: { annotation: { text: '正方形加直角三角形', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-fractal', type: 'summary' }, lineState: { annotation: { text: '递归生成分形', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
