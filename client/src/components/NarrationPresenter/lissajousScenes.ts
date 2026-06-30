/**
 * 利萨茹与玫瑰曲线讲解场景配置
 * 每句口播对应精确的图形类型（params.figure）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultLissajousState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const lissajousScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '利萨茹与玫瑰曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-lis', type: 'animation' }, lineState: { params: { figure: 'lissajous-3-2' }, annotation: { text: '利萨茹图形', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-rose', type: 'animation' }, lineState: { params: { figure: 'rose-5' }, annotation: { text: '极坐标玫瑰', position: 'top' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-beauty', type: 'animation' }, lineState: { params: { figure: 'lissajous-5-4' }, annotation: { text: '对称之美', position: 'bottom' } } },

  // ===== lissajous (4) =====
  { lineId: 'lis-1', sectionId: 'lissajous', scene: { id: 'lis-eq', type: 'animation' }, lineState: { params: { figure: 'lissajous-3-2' }, annotation: { text: 'x=sin(at+δ)', position: 'top' } } },
  { lineId: 'lis-2', sectionId: 'lissajous', scene: { id: 'lis-circle', type: 'animation' }, lineState: { params: { figure: 'lissajous-1-1' }, annotation: { text: '1:1 → 圆', position: 'top' } } },
  { lineId: 'lis-3', sectionId: 'lissajous', scene: { id: 'lis-32', type: 'animation' }, lineState: { params: { figure: 'lissajous-3-2' }, annotation: { text: '3:2 → 缠绕', position: 'bottom' } } },
  { lineId: 'lis-4', sectionId: 'lissajous', scene: { id: 'lis-closed', type: 'animation' }, lineState: { params: { figure: 'lissajous-5-4' }, annotation: { text: '整数比 → 闭合', position: 'bottom' } } },

  // ===== rose (3) =====
  { lineId: 'rose-1', sectionId: 'rose', scene: { id: 'rose-eq', type: 'animation' }, lineState: { params: { figure: 'rose-3' }, annotation: { text: 'r=cos(kθ)', position: 'top' } } },
  { lineId: 'rose-2', sectionId: 'rose', scene: { id: 'rose-3p', type: 'animation' }, lineState: { params: { figure: 'rose-3' }, annotation: { text: 'k=3 → 3 瓣', position: 'top' } } },
  { lineId: 'rose-3', sectionId: 'rose', scene: { id: 'rose-4p', type: 'animation' }, lineState: { params: { figure: 'rose-4' }, annotation: { text: 'k=4 → 8 瓣', position: 'top' } } },

  // ===== why (2) =====
  { lineId: 'why-1', sectionId: 'why', scene: { id: 'why-sym', type: 'animation' }, lineState: { params: { figure: 'rose-5' }, annotation: { text: '周期性 → 对称', position: 'top' } } },
  { lineId: 'why-2', sectionId: 'why', scene: { id: 'why-order', type: 'animation' }, lineState: { params: { figure: 'lissajous-5-4' }, annotation: { text: '数字 → 几何秩序', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { figure: 'lissajous-3-2' }, annotation: { text: '切换图形', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-petal', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { figure: 'rose-4' }, annotation: { text: '数花瓣', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '频率比定形状', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-rose', type: 'summary' }, lineState: { annotation: { text: 'k 的奇偶定花瓣', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
