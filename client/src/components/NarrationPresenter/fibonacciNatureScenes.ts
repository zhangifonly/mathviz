/**
 * 斐波那契与自然 讲解场景配置
 * 每句口播对应向日葵的发散角（params.angle）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultFibonacciNatureState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const fibonacciNatureScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '斐波那契与自然', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-spiral', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '一圈圈螺旋', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-secret', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '数列与角度', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-recur', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '前两项之和', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-seq', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '1,1,2,3,5,8,13', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-name', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '斐波那契数列', position: 'bottom' } } },

  // ===== golden (3) =====
  { lineId: 'gold-1', sectionId: 'golden', scene: { id: 'gold-ratio', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '比值趋近 1.618', position: 'top' } } },
  { lineId: 'gold-2', sectionId: 'golden', scene: { id: 'gold-phi', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '黄金比', position: 'bottom' } } },
  { lineId: 'gold-3', sectionId: 'golden', scene: { id: 'gold-angle', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '黄金角 137.5°', position: 'bottom' } } },

  // ===== flower (3) =====
  { lineId: 'flo-1', sectionId: 'flower', scene: { id: 'flo-turn', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '每颗多转一角', position: 'top' } } },
  { lineId: 'flo-2', sectionId: 'flower', scene: { id: 'flo-noline', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '永不排成直线', position: 'bottom' } } },
  { lineId: 'flo-3', sectionId: 'flower', scene: { id: 'flo-dense', type: 'animation' }, lineState: { params: { angle: 137.5 }, annotation: { text: '最密实的排布', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-off', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { angle: 137.3 }, annotation: { text: '调开发散角', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-mess', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { angle: 90 }, annotation: { text: '螺旋散成条纹', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '数列到黄金角', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-flower', type: 'summary' }, lineState: { annotation: { text: '最均匀的排布', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
