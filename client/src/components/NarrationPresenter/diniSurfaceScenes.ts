/**
 * 迪尼曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultDiniSurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const diniSurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '常负曲率只有伪球面吗?', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { annotation: { text: '答案是否定的', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { annotation: { text: '迪尼曲面: 螺旋海螺', position: 'bottom' } } },
  { lineId: 'build-1', sectionId: 'build', scene: { id: 'build-1', type: 'animation' }, lineState: { params: { b: 0 }, annotation: { text: '伪球面: 只转不升', position: 'top' } } },
  { lineId: 'build-2', sectionId: 'build', scene: { id: 'build-2', type: 'animation' }, lineState: { params: { b: 0.35 }, annotation: { text: '边转边升', position: 'bottom' } } },
  { lineId: 'build-3', sectionId: 'build', scene: { id: 'build-3', type: 'animation' }, lineState: { params: { b: 0.35 }, annotation: { text: '多出的 b·u 项', position: 'bottom' } } },
  { lineId: 'curv-1', sectionId: 'curvature', scene: { id: 'curv-1', type: 'animation' }, lineState: { annotation: { text: '曲率仍是常数', position: 'top' } } },
  { lineId: 'curv-2', sectionId: 'curvature', scene: { id: 'curv-2', type: 'animation' }, lineState: { annotation: { text: '式子里没有 u 和 v', position: 'bottom' } } },
  { lineId: 'curv-3', sectionId: 'curvature', scene: { id: 'curv-3', type: 'animation' }, lineState: { annotation: { text: '曲率与形状解耦', position: 'bottom' } } },
  { lineId: 'deg-1', sectionId: 'degenerate', scene: { id: 'deg-1', type: 'animation' }, lineState: { params: { b: 0 }, annotation: { text: '把 b 调到零', position: 'top' } } },
  { lineId: 'deg-2', sectionId: 'degenerate', scene: { id: 'deg-2', type: 'animation' }, lineState: { params: { b: 0 }, annotation: { text: '精确退化为伪球面', position: 'bottom' } } },
  { lineId: 'deg-3', sectionId: 'degenerate', scene: { id: 'deg-3', type: 'animation' }, lineState: { params: { b: 0 }, annotation: { text: '伪球面是家族边界', position: 'bottom' } } },
  { lineId: 'exp-1', sectionId: 'explore', scene: { id: 'exp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { b: 0.5 }, annotation: { text: '拖动螺距系数 b', position: 'top' } } },
  { lineId: 'exp-2', sectionId: 'explore', scene: { id: 'exp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.4, b: 0.3 }, annotation: { text: '再拖动粗细 a', position: 'bottom' } } },
  { lineId: 'exp-3', sectionId: 'explore', scene: { id: 'exp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.2, b: 0.45 }, annotation: { text: '保持 a²+b² 不变', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '边转边升扫出曲面', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'K = -1/(a²+b²)', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
