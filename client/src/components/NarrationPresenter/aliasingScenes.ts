/**
 * 混叠现象讲解场景配置
 * 每句口播对应一组 (f, fs) 参数，展示不同采样情形
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultAliasingState: SceneState = {
  waveType: 'sine',
  frequency: 9,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const aliasingScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '混叠现象', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-wheel', type: 'animation' }, lineState: { params: { f: 9, fs: 8 }, annotation: { text: '车轮为何倒转？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-frames', type: 'animation' }, lineState: { params: { f: 9, fs: 8 }, annotation: { text: '每秒有限张画面', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { f: 9, fs: 10 }, annotation: { text: '高频伪装成低频', position: 'bottom' } } },

  // ===== sample (3) =====
  { lineId: 'def-1', sectionId: 'sample', scene: { id: 'def-continuous', type: 'animation' }, lineState: { params: { f: 9, fs: 40 }, annotation: { text: '连续的真实信号', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'sample', scene: { id: 'def-sample', type: 'animation' }, lineState: { params: { f: 9, fs: 20 }, annotation: { text: '每隔一段取一点', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'sample', scene: { id: 'def-fs', type: 'animation' }, lineState: { params: { f: 9, fs: 20 }, annotation: { text: '采样率 fs', position: 'bottom' } } },

  // ===== undersample (3) =====
  { lineId: 'under-1', sectionId: 'undersample', scene: { id: 'under-sparse', type: 'animation' }, lineState: { params: { f: 9, fs: 10 }, annotation: { text: '点太稀疏', position: 'top' } } },
  { lineId: 'under-2', sectionId: 'undersample', scene: { id: 'under-alias', type: 'animation' }, lineState: { params: { f: 9, fs: 8 }, annotation: { text: '连出假低频波', position: 'bottom' } } },
  { lineId: 'under-3', sectionId: 'undersample', scene: { id: 'under-nyquist', type: 'animation' }, lineState: { params: { f: 9, fs: 20 }, annotation: { text: 'fs > 2f 才安全', position: 'bottom' } } },

  // ===== apparent (2) =====
  { lineId: 'app-1', sectionId: 'apparent', scene: { id: 'app-fa', type: 'animation' }, lineState: { params: { f: 9, fs: 8 }, annotation: { text: '假频率可算出', position: 'top' } } },
  { lineId: 'app-2', sectionId: 'apparent', scene: { id: 'app-formula', type: 'animation' }, lineState: { params: { f: 9, fs: 8 }, annotation: { text: '|f - k·fs|', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-adjust', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { f: 12, fs: 8 }, annotation: { text: '调 f 与 fs', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-cross', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { f: 9, fs: 20 }, annotation: { text: '越过奈奎斯特', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '高频伪装成低频', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-nyquist', type: 'summary' }, lineState: { annotation: { text: '两倍频率法则', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
