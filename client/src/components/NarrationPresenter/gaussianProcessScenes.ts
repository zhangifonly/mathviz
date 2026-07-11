/**
 * 高斯过程讲解场景配置
 * 每句口播对应核参数预设索引（params.optIndex）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGaussianProcessState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const gaussianProcessScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '高斯过程', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-dist', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '无数条可能曲线', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-honest', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '预测 + 不确定性', position: 'bottom' } } },

  // ===== prior (3) =====
  { lineId: 'prior-1', sectionId: 'prior', scene: { id: 'prior-multigauss', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '多元高斯分布', position: 'top' } } },
  { lineId: 'prior-2', sectionId: 'prior', scene: { id: 'prior-funcspace', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '函数空间上的分布', position: 'top' } } },
  { lineId: 'prior-3', sectionId: 'prior', scene: { id: 'prior-belief', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '先验信念', position: 'bottom' } } },

  // ===== kernel (3) =====
  { lineId: 'kernel-1', sectionId: 'kernel', scene: { id: 'kernel-corr', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '距离越近越相关', position: 'top' } } },
  { lineId: 'kernel-2', sectionId: 'kernel', scene: { id: 'kernel-rbf', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '平方指数核', position: 'top' } } },
  { lineId: 'kernel-3', sectionId: 'kernel', scene: { id: 'kernel-length', type: 'animation' }, lineState: { params: { optIndex: 1 }, annotation: { text: '长度尺度决定平滑度', position: 'bottom' } } },

  // ===== posterior (3) =====
  { lineId: 'post-1', sectionId: 'posterior', scene: { id: 'post-condition', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '高斯条件公式', position: 'top' } } },
  { lineId: 'post-2', sectionId: 'posterior', scene: { id: 'post-mean', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '均值贴近观测点', position: 'top' } } },
  { lineId: 'post-3', sectionId: 'posterior', scene: { id: 'post-var', type: 'animation' }, lineState: { params: { optIndex: 0 }, annotation: { text: '方差近窄远宽', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-length', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optIndex: 2 }, annotation: { text: '调节长度尺度', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-band', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { optIndex: 1 }, annotation: { text: '观察置信带', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '函数上的分布 + 核', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-meanvar', type: 'summary' }, lineState: { annotation: { text: '均值预测 + 方差不确定', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
