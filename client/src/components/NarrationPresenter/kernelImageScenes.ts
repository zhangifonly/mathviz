/**
 * 核与像讲解场景配置
 * 每句口播对应示例矩阵索引 params.mi（0满秩 / 1秩1 / 2零矩阵）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultKernelImageState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const kernelImageScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '核与像', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-machine', type: 'animation' }, lineState: { params: { mi: 0 }, annotation: { text: '矩阵是一台机器', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-where', type: 'animation' }, lineState: { params: { mi: 0 }, annotation: { text: '平面被送到哪？', position: 'bottom' } } },

  // ===== kernel (3) =====
  { lineId: 'ker-1', sectionId: 'kernel', scene: { id: 'ker-crush', type: 'animation' }, lineState: { params: { mi: 1 }, annotation: { text: '压成零向量', position: 'top' } } },
  { lineId: 'ker-2', sectionId: 'kernel', scene: { id: 'ker-null', type: 'animation' }, lineState: { params: { mi: 1 }, annotation: { text: '核=零空间', position: 'bottom' } } },
  { lineId: 'ker-3', sectionId: 'kernel', scene: { id: 'ker-line', type: 'animation' }, lineState: { params: { mi: 1 }, annotation: { text: '红线即核方向', position: 'bottom' } } },

  // ===== image (2) =====
  { lineId: 'img-1', sectionId: 'image', scene: { id: 'img-col', type: 'animation' }, lineState: { params: { mi: 0 }, annotation: { text: '像=列空间', position: 'top' } } },
  { lineId: 'img-2', sectionId: 'image', scene: { id: 'img-shrink', type: 'animation' }, lineState: { params: { mi: 1 }, annotation: { text: '秩1塌成直线', position: 'bottom' } } },

  // ===== theorem (3) =====
  { lineId: 'thm-1', sectionId: 'theorem', scene: { id: 'thm-dims', type: 'animation' }, lineState: { params: { mi: 0 }, annotation: { text: '秩与零化度', position: 'top' } } },
  { lineId: 'thm-2', sectionId: 'theorem', scene: { id: 'thm-sum', type: 'animation' }, lineState: { params: { mi: 1 }, annotation: { text: '相加=维数', position: 'bottom' } } },
  { lineId: 'thm-3', sectionId: 'theorem', scene: { id: 'thm-two', type: 'animation' }, lineState: { params: { mi: 2 }, annotation: { text: '秩+零化度=2', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-full', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mi: 0 }, annotation: { text: '满秩搬运', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-rank1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { mi: 1 }, annotation: { text: '核方向坍缩', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '核与像', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-theorem', type: 'summary' }, lineState: { annotation: { text: '维数守恒', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
