/**
 * K-means 聚类讲解场景配置
 * params.k = 簇数量，params.step = 展示到第几帧（迭代步）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultKmeansState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const kmeansScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'K-means聚类', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { k: 3, step: 0 }, annotation: { text: '怎么自动分组？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { k: 3, step: 8 }, annotation: { text: '经典分组算法', position: 'bottom' } } },

  // ===== centers (3) =====
  { lineId: 'def-1', sectionId: 'centers', scene: { id: 'def-k', type: 'animation' }, lineState: { params: { k: 3, step: 0 }, annotation: { text: '选定 K 组', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'centers', scene: { id: 'def-init', type: 'animation' }, lineState: { params: { k: 3, step: 0 }, annotation: { text: '随机放下中心', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'centers', scene: { id: 'def-goal', type: 'animation' }, lineState: { params: { k: 3, step: 8 }, annotation: { text: '把中心调到正中', position: 'bottom' } } },

  // ===== assign (2) =====
  { lineId: 'asg-1', sectionId: 'assign', scene: { id: 'asg-nearest', type: 'animation' }, lineState: { params: { k: 3, step: 1 }, annotation: { text: '归到最近中心', position: 'top' } } },
  { lineId: 'asg-2', sectionId: 'assign', scene: { id: 'asg-color', type: 'animation' }, lineState: { params: { k: 3, step: 1 }, annotation: { text: '同色=同组', position: 'bottom' } } },

  // ===== update (3) =====
  { lineId: 'upd-1', sectionId: 'update', scene: { id: 'upd-mean', type: 'animation' }, lineState: { params: { k: 3, step: 2 }, annotation: { text: '中心搬到均值', position: 'top' } } },
  { lineId: 'upd-2', sectionId: 'update', scene: { id: 'upd-reassign', type: 'animation' }, lineState: { params: { k: 3, step: 3 }, annotation: { text: '归属随之改变', position: 'bottom' } } },
  { lineId: 'upd-3', sectionId: 'update', scene: { id: 'upd-loop', type: 'animation' }, lineState: { params: { k: 3, step: 5 }, annotation: { text: '两步交替', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-step', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { k: 4, step: 4 }, annotation: { text: '单步迭代', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-converge', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { k: 4, step: 12 }, annotation: { text: '收敛稳定', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '分配+更新', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-apply', type: 'summary' }, lineState: { annotation: { text: '应用广泛', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
