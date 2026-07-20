/**
 * 加窗函数讲解场景配置
 * 每句口播对应一个窗类型（params.kind）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultWindowingState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const windowingScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '加窗函数', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-cut', type: 'animation' }, lineState: { params: { kind: 'rect' }, annotation: { text: '硬截断', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-edge', type: 'animation' }, lineState: { params: { kind: 'rect' }, annotation: { text: '突兀的边缘', position: 'bottom' } } },

  // ===== leakage (3) =====
  { lineId: 'leak-1', sectionId: 'leakage', scene: { id: 'leak-spread', type: 'animation' }, lineState: { params: { kind: 'rect' }, annotation: { text: '能量向两侧渗出', position: 'bottom' } } },
  { lineId: 'leak-2', sectionId: 'leakage', scene: { id: 'leak-name', type: 'animation' }, lineState: { params: { kind: 'rect' }, annotation: { text: '频谱泄漏', position: 'top' } } },
  { lineId: 'leak-3', sectionId: 'leakage', scene: { id: 'leak-cause', type: 'animation' }, lineState: { params: { kind: 'rect' }, annotation: { text: '陡峭直角边', position: 'bottom' } } },

  // ===== window (3) =====
  { lineId: 'win-1', sectionId: 'window', scene: { id: 'win-hann', type: 'animation' }, lineState: { params: { kind: 'hann' }, annotation: { text: '两端渐归零', position: 'top' } } },
  { lineId: 'win-2', sectionId: 'window', scene: { id: 'win-hamming', type: 'animation' }, lineState: { params: { kind: 'hamming' }, annotation: { text: '平滑过渡曲线', position: 'top' } } },
  { lineId: 'win-3', sectionId: 'window', scene: { id: 'win-less', type: 'animation' }, lineState: { params: { kind: 'hann' }, annotation: { text: '泄漏大减', position: 'bottom' } } },

  // ===== tradeoff (3) =====
  { lineId: 'trade-1', sectionId: 'tradeoff', scene: { id: 'trade-lobe', type: 'animation' }, lineState: { params: { kind: 'hann' }, annotation: { text: '主瓣与旁瓣', position: 'top' } } },
  { lineId: 'trade-2', sectionId: 'tradeoff', scene: { id: 'trade-rect', type: 'animation' }, lineState: { params: { kind: 'rect' }, annotation: { text: '窄主瓣高旁瓣', position: 'bottom' } } },
  { lineId: 'trade-3', sectionId: 'tradeoff', scene: { id: 'trade-blackman', type: 'animation' }, lineState: { params: { kind: 'blackman' }, annotation: { text: '低旁瓣宽主瓣', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'hamming' }, annotation: { text: '切换看旁瓣', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-compare', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'blackman' }, annotation: { text: '泄漏被压下去', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '加窗减泄漏', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-trade', type: 'summary' }, lineState: { annotation: { text: '按需取舍', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
