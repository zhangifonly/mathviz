/**
 * PageRank 讲解场景配置
 * 每句口播对应一帧迭代(params.iter)与阻尼因子(params.damping)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPagerankState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const pagerankScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'PageRank', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-google', type: 'animation' }, lineState: { params: { iter: 0, damping: 0.85 }, annotation: { text: '谷歌的秘密武器', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-vote', type: 'animation' }, lineState: { params: { iter: 0, damping: 0.85 }, annotation: { text: '链接就是投票', position: 'bottom' } } },

  // ===== surfer (3) =====
  { lineId: 'def-1', sectionId: 'surfer', scene: { id: 'def-surfer', type: 'animation' }, lineState: { params: { iter: 1, damping: 0.85 }, annotation: { text: '随机浏览者漫游', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'surfer', scene: { id: 'def-prob', type: 'animation' }, lineState: { params: { iter: 2, damping: 0.85 }, annotation: { text: '停留概率=rank', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'surfer', scene: { id: 'def-hub', type: 'animation' }, lineState: { params: { iter: 3, damping: 0.85 }, annotation: { text: '好链接更常经过', position: 'bottom' } } },

  // ===== matrix (3) =====
  { lineId: 'mat-1', sectionId: 'matrix', scene: { id: 'mat-transition', type: 'animation' }, lineState: { params: { iter: 4, damping: 0.85 }, annotation: { text: '权重平分给出链', position: 'top' } } },
  { lineId: 'mat-2', sectionId: 'matrix', scene: { id: 'mat-teleport', type: 'animation' }, lineState: { params: { iter: 5, damping: 0.85 }, annotation: { text: '有时随机跳转', position: 'bottom' } } },
  { lineId: 'mat-3', sectionId: 'matrix', scene: { id: 'mat-damping', type: 'animation' }, lineState: { params: { iter: 6, damping: 0.85 }, annotation: { text: '阻尼因子 d=0.85', position: 'bottom' } } },

  // ===== iterate (3) =====
  { lineId: 'iter-1', sectionId: 'iterate', scene: { id: 'iter-power', type: 'animation' }, lineState: { params: { iter: 3, damping: 0.85 }, annotation: { text: '矩阵反复作用', position: 'top' } } },
  { lineId: 'iter-2', sectionId: 'iterate', scene: { id: 'iter-redistribute', type: 'animation' }, lineState: { params: { iter: 8, damping: 0.85 }, annotation: { text: '权重逐步重分配', position: 'bottom' } } },
  { lineId: 'iter-3', sectionId: 'iterate', scene: { id: 'iter-converge', type: 'animation' }, lineState: { params: { iter: 20, damping: 0.85 }, annotation: { text: '收敛到稳态', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-slider', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { iter: 10, damping: 0.85 }, annotation: { text: '拖动迭代滑块', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-damping', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { iter: 20, damping: 0.5 }, annotation: { text: '换个阻尼因子', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '稳态停留概率', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-iterate', type: 'summary' }, lineState: { annotation: { text: '阻尼幂迭代', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
