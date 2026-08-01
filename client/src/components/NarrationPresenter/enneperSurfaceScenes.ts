/**
 * 恩内佩尔曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultEnneperSurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const enneperSurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '只用三次多项式', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { annotation: { text: '恩内佩尔 1864', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { annotation: { text: '三行方程', position: 'bottom' } } },
  { lineId: 'min-1', sectionId: 'minimal', scene: { id: 'min-1', type: 'animation' }, lineState: { annotation: { text: '判据: 平均曲率为零', position: 'top' } } },
  { lineId: 'min-2', sectionId: 'minimal', scene: { id: 'min-2', type: 'animation' }, lineState: { annotation: { text: 'H ≡ 0', position: 'bottom' } } },
  { lineId: 'min-3', sectionId: 'minimal', scene: { id: 'min-3', type: 'animation' }, lineState: { annotation: { text: '高斯曲率处处为负', position: 'bottom' } } },
  { lineId: 'cross-1', sectionId: 'selfcross', scene: { id: 'cross-1', type: 'animation' }, lineState: { params: { scale: 0.7 }, annotation: { text: '长出四片花瓣', position: 'top' } } },
  { lineId: 'cross-2', sectionId: 'selfcross', scene: { id: 'cross-2', type: 'animation' }, lineState: { params: { scale: 1.4 }, annotation: { text: '花瓣互相穿过', position: 'bottom' } } },
  { lineId: 'cross-3', sectionId: 'selfcross', scene: { id: 'cross-3', type: 'animation' }, lineState: { params: { scale: 1.4 }, annotation: { text: '自交不等于破了', position: 'bottom' } } },
  { lineId: 'imm-1', sectionId: 'immersion', scene: { id: 'imm-1', type: 'animation' }, lineState: { annotation: { text: '浸入 vs 嵌入', position: 'top' } } },
  { lineId: 'imm-2', sectionId: 'immersion', scene: { id: 'imm-2', type: 'animation' }, lineState: { annotation: { text: '浸入但不嵌入', position: 'bottom' } } },
  { lineId: 'imm-3', sectionId: 'immersion', scene: { id: 'imm-3', type: 'animation' }, lineState: { annotation: { text: 'f=1, g=w', position: 'bottom' } } },
  { lineId: 'exp-1', sectionId: 'explore', scene: { id: 'exp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scale: 0.6 }, annotation: { text: '拖动缩放滑块', position: 'top' } } },
  { lineId: 'exp-2', sectionId: 'explore', scene: { id: 'exp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scale: 1.5 }, annotation: { text: '花瓣接触并穿透', position: 'bottom' } } },
  { lineId: 'exp-3', sectionId: 'explore', scene: { id: 'exp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scale: 1.5 }, annotation: { text: '始终是极小曲面', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'H ≡ 0, K < 0', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '浸入而非嵌入', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
