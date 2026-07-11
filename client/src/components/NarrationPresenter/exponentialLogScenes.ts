/**
 * 指数与对数讲解场景配置
 * 每句口播对应底数（params.base）与显示开关（params.showExp/showLog/showMirror）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultExponentialLogState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const exponentialLogScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '指数与对数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-exp', type: 'animation' }, lineState: { params: { base: 2, showExp: true, showLog: false, showMirror: false }, annotation: { text: '成倍放大', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-partner', type: 'animation' }, lineState: { params: { base: 2, showExp: true, showLog: true, showMirror: false }, annotation: { text: '形影不离的对数', position: 'bottom' } } },

  // ===== exp-concept (3) =====
  { lineId: 'exp-1', sectionId: 'exp-concept', scene: { id: 'exp-def', type: 'animation' }, lineState: { params: { base: 2, showExp: true, showLog: false, showMirror: false }, annotation: { text: 'y = a 的 x 次方', position: 'top' } } },
  { lineId: 'exp-2', sectionId: 'exp-concept', scene: { id: 'exp-grow', type: 'animation' }, lineState: { params: { base: 2, showExp: true, showLog: false, showMirror: false }, annotation: { text: '底数大于 1，陡峭上扬', position: 'top' } } },
  { lineId: 'exp-3', sectionId: 'exp-concept', scene: { id: 'exp-decay', type: 'animation' }, lineState: { params: { base: 0.5, showExp: true, showLog: false, showMirror: false }, annotation: { text: '底数小于 1，衰减', position: 'bottom' } } },

  // ===== log-concept (4) =====
  { lineId: 'log-1', sectionId: 'log-concept', scene: { id: 'log-def', type: 'animation' }, lineState: { params: { base: 2, showExp: false, showLog: true, showMirror: false }, annotation: { text: '几次方得到某数', position: 'top' } } },
  { lineId: 'log-2', sectionId: 'log-concept', scene: { id: 'log-inverse', type: 'animation' }, lineState: { params: { base: 2, showExp: true, showLog: true, showMirror: true }, annotation: { text: '关于 y = x 对称', position: 'top' } } },
  { lineId: 'log-3', sectionId: 'log-concept', scene: { id: 'log-mirror', type: 'animation' }, lineState: { params: { base: 2, showExp: true, showLog: true, showMirror: true }, annotation: { text: '一面镜子', position: 'bottom' } } },
  { lineId: 'log-4', sectionId: 'log-concept', scene: { id: 'log-changebase', type: 'animation' }, lineState: { params: { base: 10, showExp: true, showLog: true, showMirror: true }, annotation: { text: '换底公式', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-base', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 10, showExp: true, showLog: true, showMirror: false }, annotation: { text: '切换底数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-mirror', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { base: 2, showExp: true, showLog: true, showMirror: true }, annotation: { text: '互为镜像', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '增长与逆运算', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-symmetry', type: 'summary' }, lineState: { annotation: { text: '互为反函数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
