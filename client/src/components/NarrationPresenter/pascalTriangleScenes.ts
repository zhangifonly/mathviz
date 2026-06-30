/**
 * 帕斯卡三角染色讲解场景配置
 * 每句口播对应模数（params.mod）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPascalTriangleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pascalTriangleScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '帕斯卡三角染色', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-rule', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '上方两数之和', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-secret', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '藏着秘密', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-fractal', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '分形浮现', position: 'bottom' } } },

  // ===== build (3) =====
  { lineId: 'build-1', sectionId: 'build', scene: { id: 'build-binom', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '二项式系数', position: 'top' } } },
  { lineId: 'build-2', sectionId: 'build', scene: { id: 'build-rows', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '1,1 1,1 2 1...', position: 'top' } } },
  { lineId: 'build-3', sectionId: 'build', scene: { id: 'build-parity', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '判断奇偶', position: 'bottom' } } },

  // ===== sierpinski (3) =====
  { lineId: 'sier-1', sectionId: 'sierpinski', scene: { id: 'sier-color', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '奇数涂亮', position: 'top' } } },
  { lineId: 'sier-2', sectionId: 'sierpinski', scene: { id: 'sier-tri', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '谢尔宾斯基三角', position: 'bottom' } } },
  { lineId: 'sier-3', sectionId: 'sierpinski', scene: { id: 'sier-self', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '自相似', position: 'bottom' } } },

  // ===== why (2) =====
  { lineId: 'why-1', sectionId: 'why', scene: { id: 'why-recur', type: 'animation' }, lineState: { params: { mod: 2 }, annotation: { text: '递归自复制', position: 'top' } } },
  { lineId: 'why-2', sectionId: 'why', scene: { id: 'why-mod', type: 'animation' }, lineState: { params: { mod: 3 }, annotation: { text: 'mod 3 更精细', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-mod', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mod: 5 }, annotation: { text: '切换模数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-zoom', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mod: 3 }, annotation: { text: '局部=整体', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '奇偶 → 谢尔宾斯基', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-recur', type: 'summary' }, lineState: { annotation: { text: '递归自相似', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
