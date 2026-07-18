/**
 * 谢尔宾斯基三角讲解场景配置
 * 每句口播对应模式（params.mode）与层数（params.level）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSierpinskiTriangleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sierpinskiTriangleScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '谢尔宾斯基三角', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-hole', type: 'animation' }, lineState: { params: { mode: 'recursive', level: 1 }, annotation: { text: '挖掉中心', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-again', type: 'animation' }, lineState: { params: { mode: 'recursive', level: 2 }, annotation: { text: '三个角继续挖', position: 'bottom' } } },

  // ===== recurse (3) =====
  { lineId: 'def-1', sectionId: 'recurse', scene: { id: 'def-four', type: 'animation' }, lineState: { params: { mode: 'recursive', level: 2 }, annotation: { text: '分四份挖中间', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'recurse', scene: { id: 'def-count', type: 'animation' }, lineState: { params: { mode: 'recursive', level: 3 }, annotation: { text: '3ⁿ 个小三角', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'recurse', scene: { id: 'def-limit', type: 'animation' }, lineState: { params: { mode: 'recursive', level: 5 }, annotation: { text: '面积趋于零', position: 'bottom' } } },

  // ===== selfsimilar (3) =====
  { lineId: 'sim-1', sectionId: 'selfsimilar', scene: { id: 'sim-zoom', type: 'animation' }, lineState: { params: { mode: 'recursive', level: 4 }, annotation: { text: '放大局部', position: 'top' } } },
  { lineId: 'sim-2', sectionId: 'selfsimilar', scene: { id: 'sim-soul', type: 'animation' }, lineState: { params: { mode: 'recursive', level: 4 }, annotation: { text: '自相似=分形灵魂', position: 'bottom' } } },
  { lineId: 'sim-3', sectionId: 'selfsimilar', scene: { id: 'sim-dim', type: 'animation' }, lineState: { params: { mode: 'recursive', level: 5 }, annotation: { text: '维数≈1.585', position: 'bottom' } } },

  // ===== chaos (3) =====
  { lineId: 'cha-1', sectionId: 'chaos', scene: { id: 'cha-start', type: 'animation' }, lineState: { params: { mode: 'chaos', level: 1 }, annotation: { text: '随机选顶点', position: 'top' } } },
  { lineId: 'cha-2', sectionId: 'chaos', scene: { id: 'cha-half', type: 'animation' }, lineState: { params: { mode: 'chaos', level: 3 }, annotation: { text: '每次移动一半', position: 'bottom' } } },
  { lineId: 'cha-3', sectionId: 'chaos', scene: { id: 'cha-emerge', type: 'animation' }, lineState: { params: { mode: 'chaos', level: 5 }, annotation: { text: '随机拼出分形', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-mode', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'chaos', level: 4 }, annotation: { text: '切换两种模式', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-level', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mode: 'recursive', level: 5 }, annotation: { text: '调整层数', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '挖出自相似', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-unify', type: 'summary' }, lineState: { annotation: { text: '秩序与混沌同归', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
