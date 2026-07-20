/**
 * Softmax 函数讲解场景配置
 * 每句口播对应一个温度参数（params.temp），驱动柱状图分布变化
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSoftmaxState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const softmaxScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'Softmax函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-prob', type: 'animation' }, lineState: { params: { temp: 1 }, annotation: { text: '分数变概率', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { temp: 1 }, annotation: { text: '和为 1', position: 'bottom' } } },

  // ===== exponent (3) =====
  { lineId: 'exp-1', sectionId: 'exponent', scene: { id: 'exp-e', type: 'animation' }, lineState: { params: { temp: 1 }, annotation: { text: '取 e 的指数', position: 'top' } } },
  { lineId: 'exp-2', sectionId: 'exponent', scene: { id: 'exp-steep', type: 'animation' }, lineState: { params: { temp: 0.7 }, annotation: { text: '指数很陡', position: 'bottom' } } },
  { lineId: 'exp-3', sectionId: 'exponent', scene: { id: 'exp-amplify', type: 'animation' }, lineState: { params: { temp: 0.7 }, annotation: { text: '放大领先', position: 'bottom' } } },

  // ===== normalize (3) =====
  { lineId: 'norm-1', sectionId: 'normalize', scene: { id: 'norm-divide', type: 'animation' }, lineState: { params: { temp: 1 }, annotation: { text: '除以总和', position: 'top' } } },
  { lineId: 'norm-2', sectionId: 'normalize', scene: { id: 'norm-sum1', type: 'animation' }, lineState: { params: { temp: 1 }, annotation: { text: '全正 · 和为1', position: 'bottom' } } },
  { lineId: 'norm-3', sectionId: 'normalize', scene: { id: 'norm-dist', type: 'animation' }, lineState: { params: { temp: 1 }, annotation: { text: '合法概率分布', position: 'bottom' } } },

  // ===== temperature (3) =====
  { lineId: 'temp-1', sectionId: 'temperature', scene: { id: 'temp-t', type: 'animation' }, lineState: { params: { temp: 1 }, annotation: { text: '除以温度 T', position: 'top' } } },
  { lineId: 'temp-2', sectionId: 'temperature', scene: { id: 'temp-sharp', type: 'animation' }, lineState: { params: { temp: 0.4 }, annotation: { text: 'T 小 · 尖锐', position: 'bottom' } } },
  { lineId: 'temp-3', sectionId: 'temperature', scene: { id: 'temp-flat', type: 'animation' }, lineState: { params: { temp: 4 }, annotation: { text: 'T 大 · 均匀', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-logits', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { temp: 1 }, annotation: { text: '换一组 logits', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-temp', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { temp: 2 }, annotation: { text: '拖动温度滑块', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '指数 + 归一化', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-temp', type: 'summary' }, lineState: { annotation: { text: '温度旋钮', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
