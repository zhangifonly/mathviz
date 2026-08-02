/**
 * 双曲三角形与角亏 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultHyperbolicTriangleState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const hyperbolicTriangleScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { scale: 0.5 }, annotation: { text: '球面: 内角和 > 180°', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { scale: 0.15 }, annotation: { text: '平面: 恰好 180°', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { scale: 0.8 }, annotation: { text: '双曲: 小于 180°', position: 'bottom' } } },
  { lineId: 'df-1', sectionId: 'defect', scene: { id: 'df-1', type: 'animation' }, lineState: { params: { scale: 0.5 }, annotation: { text: '面积 = π − 内角和', position: 'top' } } },
  { lineId: 'df-2', sectionId: 'defect', scene: { id: 'df-2', type: 'animation' }, lineState: { params: { scale: 0.6 }, annotation: { text: '与球面顺序正好相反', position: 'bottom' } } },
  { lineId: 'df-3', sectionId: 'defect', scene: { id: 'df-3', type: 'animation' }, lineState: { params: { scale: 0.7 }, annotation: { text: '角亏与面积精确相同', position: 'bottom' } } },
  { lineId: 'bd-1', sectionId: 'bound', scene: { id: 'bd-1', type: 'animation' }, lineState: { params: { scale: 0.9 }, annotation: { text: '内角至少为零', position: 'top' } } },
  { lineId: 'bd-2', sectionId: 'bound', scene: { id: 'bd-2', type: 'animation' }, lineState: { params: { scale: 0.95 }, annotation: { text: '故面积最多是 π', position: 'bottom' } } },
  { lineId: 'bd-3', sectionId: 'bound', scene: { id: 'bd-3', type: 'animation' }, lineState: { params: { scale: 0.995 }, annotation: { text: '逼近 3.1415 但永不达到', position: 'bottom' } } },
  { lineId: 'ct-1', sectionId: 'counter', scene: { id: 'ct-1', type: 'animation' }, lineState: { params: { scale: 0.3 }, annotation: { text: '平面放大角度不变', position: 'top' } } },
  { lineId: 'ct-2', sectionId: 'counter', scene: { id: 'ct-2', type: 'animation' }, lineState: { params: { scale: 0.5 }, annotation: { text: '球面放大角度变大', position: 'bottom' } } },
  { lineId: 'ct-3', sectionId: 'counter', scene: { id: 'ct-3', type: 'animation' }, lineState: { params: { scale: 0.9 }, annotation: { text: '双曲放大角度反而变小', position: 'bottom' } } },
  { lineId: 'uf-1', sectionId: 'unify', scene: { id: 'uf-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scale: 0.4 }, annotation: { text: 'K=+1: 内角和 − π', position: 'top' } } },
  { lineId: 'uf-2', sectionId: 'unify', scene: { id: 'uf-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scale: 0.1 }, annotation: { text: 'K=0: 与角度无关', position: 'bottom' } } },
  { lineId: 'uf-3', sectionId: 'unify', scene: { id: 'uf-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { scale: 0.85 }, annotation: { text: 'K=−1: π − 内角和', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '角亏就是面积', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '面积上界为 π', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
