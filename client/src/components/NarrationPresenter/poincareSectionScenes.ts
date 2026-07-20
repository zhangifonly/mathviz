/**
 * 庞加莱截面讲解场景配置
 * params.set: 'periodic' | 'chaotic'；params.steps: 采样周期数
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPoincareSectionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const poincareSectionScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '庞加莱截面', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-mess', type: 'animation' }, lineState: { params: { set: 'chaotic', steps: 400 }, annotation: { text: '轨迹缠成乱麻', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { set: 'chaotic', steps: 800 }, annotation: { text: '压成一张点图', position: 'bottom' } } },

  // ===== strobe (3) =====
  { lineId: 'def-1', sectionId: 'strobe', scene: { id: 'def-strobe', type: 'animation' }, lineState: { params: { set: 'periodic', steps: 200 }, annotation: { text: '按节拍频闪', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'strobe', scene: { id: 'def-sample', type: 'animation' }, lineState: { params: { set: 'periodic', steps: 300 }, annotation: { text: '每周期采一点', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'strobe', scene: { id: 'def-thin', type: 'animation' }, lineState: { params: { set: 'chaotic', steps: 500 }, annotation: { text: '连续变离散', position: 'bottom' } } },

  // ===== point (3) =====
  { lineId: 'pt-1', sectionId: 'point', scene: { id: 'pt-section', type: 'animation' }, lineState: { params: { set: 'chaotic', steps: 800 }, annotation: { text: '落在截面上', position: 'top' } } },
  { lineId: 'pt-2', sectionId: 'point', scene: { id: 'pt-reduce', type: 'animation' }, lineState: { params: { set: 'chaotic', steps: 1200 }, annotation: { text: '高维降到二维', position: 'bottom' } } },
  { lineId: 'pt-3', sectionId: 'point', scene: { id: 'pt-skeleton', type: 'animation' }, lineState: { params: { set: 'chaotic', steps: 1500 }, annotation: { text: '隐藏骨架显现', position: 'bottom' } } },

  // ===== compare (3) =====
  { lineId: 'cmp-1', sectionId: 'compare', scene: { id: 'cmp-periodic', type: 'animation' }, lineState: { params: { set: 'periodic', steps: 400 }, annotation: { text: '周期=几个点', position: 'top' } } },
  { lineId: 'cmp-2', sectionId: 'compare', scene: { id: 'cmp-chaos', type: 'animation' }, lineState: { params: { set: 'chaotic', steps: 1500 }, annotation: { text: '混沌=分形云', position: 'bottom' } } },
  { lineId: 'cmp-3', sectionId: 'compare', scene: { id: 'cmp-count', type: 'animation' }, lineState: { params: { set: 'chaotic', steps: 2000 }, annotation: { text: '数点看命运', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { set: 'periodic', steps: 400 }, annotation: { text: '切换两组参数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-steps', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { set: 'chaotic', steps: 2000 }, annotation: { text: '加密采样', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '频闪降维', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-two', type: 'summary' }, lineState: { annotation: { text: '点数辨混沌', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
