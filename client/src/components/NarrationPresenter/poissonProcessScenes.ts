/**
 * 泊松过程讲解场景配置
 * 每句口播对应到达速率（params.rate）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPoissonProcessState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const poissonProcessScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '泊松过程', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-store', type: 'animation' }, lineState: { params: { rate: 1 }, annotation: { text: '随机推门而入', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { rate: 1 }, annotation: { text: '随机而独立', position: 'bottom' } } },

  // ===== gap (3) =====
  { lineId: 'gap-1', sectionId: 'gap', scene: { id: 'gap-wait', type: 'animation' }, lineState: { params: { rate: 0.5 }, annotation: { text: '等待时间', position: 'top' } } },
  { lineId: 'gap-2', sectionId: 'gap', scene: { id: 'gap-exp', type: 'animation' }, lineState: { params: { rate: 1 }, annotation: { text: '指数间隔 -ln(u)/λ', position: 'bottom' } } },
  { lineId: 'gap-3', sectionId: 'gap', scene: { id: 'gap-accum', type: 'animation' }, lineState: { params: { rate: 1 }, annotation: { text: '累加得到达时刻', position: 'bottom' } } },

  // ===== count (3) =====
  { lineId: 'cnt-1', sectionId: 'count', scene: { id: 'cnt-tally', type: 'animation' }, lineState: { params: { rate: 1 }, annotation: { text: '数到此刻几位', position: 'top' } } },
  { lineId: 'cnt-2', sectionId: 'count', scene: { id: 'cnt-nt', type: 'animation' }, lineState: { params: { rate: 1 }, annotation: { text: 'N(t) 逐级跳升', position: 'bottom' } } },
  { lineId: 'cnt-3', sectionId: 'count', scene: { id: 'cnt-step', type: 'animation' }, lineState: { params: { rate: 2 }, annotation: { text: '只升不降的阶梯', position: 'bottom' } } },

  // ===== dist (2) =====
  { lineId: 'dist-1', sectionId: 'dist', scene: { id: 'dist-window', type: 'animation' }, lineState: { params: { rate: 1 }, annotation: { text: '固定时间窗', position: 'top' } } },
  { lineId: 'dist-2', sectionId: 'dist', scene: { id: 'dist-poisson', type: 'animation' }, lineState: { params: { rate: 2 }, annotation: { text: '泊松分布 均值 λt', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-rate', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rate: 2 }, annotation: { text: '调大速率更密', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rate: 1 }, annotation: { text: '重新随机一次', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-gap', type: 'summary' }, lineState: { annotation: { text: '指数间隔生成到达', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-dist', type: 'summary' }, lineState: { annotation: { text: '计数服从泊松分布', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
