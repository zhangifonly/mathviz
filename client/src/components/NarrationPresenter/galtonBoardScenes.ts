/**
 * 高尔顿板讲解场景配置
 * 每句口播对应小球数量（params.balls）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGaltonBoardState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const galtonBoardScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '高尔顿板', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-drop', type: 'animation' }, lineState: { params: { balls: 200 }, annotation: { text: '小球蹦跳下落', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-land', type: 'animation' }, lineState: { params: { balls: 200 }, annotation: { text: '落入某个格子', position: 'bottom' } } },

  // ===== fifty (3) =====
  { lineId: 'def-1', sectionId: 'fifty', scene: { id: 'def-lr', type: 'animation' }, lineState: { params: { balls: 200 }, annotation: { text: '左右各占一半', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'fifty', scene: { id: 'def-count', type: 'animation' }, lineState: { params: { balls: 1000 }, annotation: { text: '落槽=向右次数', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'fifty', scene: { id: 'def-center', type: 'animation' }, lineState: { params: { balls: 1000 }, annotation: { text: '越均衡越居中', position: 'bottom' } } },

  // ===== binomial (3) =====
  { lineId: 'bin-1', sectionId: 'binomial', scene: { id: 'bin-dist', type: 'animation' }, lineState: { params: { balls: 1000 }, annotation: { text: '二项分布', position: 'top' } } },
  { lineId: 'bin-2', sectionId: 'binomial', scene: { id: 'bin-peak', type: 'animation' }, lineState: { params: { balls: 1000 }, annotation: { text: '中间路径最多', position: 'bottom' } } },
  { lineId: 'bin-3', sectionId: 'binomial', scene: { id: 'bin-tail', type: 'animation' }, lineState: { params: { balls: 5000 }, annotation: { text: '两侧稀少', position: 'bottom' } } },

  // ===== normal (3) =====
  { lineId: 'nor-1', sectionId: 'normal', scene: { id: 'nor-smooth', type: 'animation' }, lineState: { params: { balls: 5000 }, annotation: { text: '轮廓渐平滑', position: 'top' } } },
  { lineId: 'nor-2', sectionId: 'normal', scene: { id: 'nor-bell', type: 'animation' }, lineState: { params: { balls: 5000 }, annotation: { text: '逼近钟形曲线', position: 'bottom' } } },
  { lineId: 'nor-3', sectionId: 'normal', scene: { id: 'nor-clt', type: 'animation' }, lineState: { params: { balls: 5000 }, annotation: { text: '中心极限定理', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-more', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { balls: 5000 }, annotation: { text: '增大小球数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-reroll', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { balls: 1000 }, annotation: { text: '重新投放', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '二项分布', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-clt', type: 'summary' }, lineState: { annotation: { text: '逼近正态', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
