/**
 * 平均曲率流 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultMeanCurvatureFlowState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const meanCurvatureFlowScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '热方程让温度均匀', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'peanut' }, annotation: { text: '沿法向以 H 为速度移动', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'peanut', showMeasure: true }, annotation: { text: '曲面越来越圆润', position: 'bottom' } } },
  { lineId: 'sp-1', sectionId: 'sphere', scene: { id: 'sp-1', type: 'animation' }, lineState: { params: { kind: 'sphere', showMeasure: true }, annotation: { text: '球面 H = 2/R', position: 'top' } } },
  { lineId: 'sp-2', sectionId: 'sphere', scene: { id: 'sp-2', type: 'animation' }, lineState: { params: { kind: 'sphere', showMeasure: true }, annotation: { text: 'R² = R₀² − 4t', position: 'bottom' } } },
  { lineId: 'sp-3', sectionId: 'sphere', scene: { id: 'sp-3', type: 'animation' }, lineState: { params: { kind: 'sphere', showMeasure: true }, annotation: { text: '自相似收缩, 形状不变', position: 'bottom' } } },
  { lineId: 'cy-1', sectionId: 'cylinder', scene: { id: 'cy-1', type: 'animation' }, lineState: { params: { kind: 'cylinder', showMeasure: true }, annotation: { text: '圆柱 H = 1/R', position: 'top' } } },
  { lineId: 'cy-2', sectionId: 'cylinder', scene: { id: 'cy-2', type: 'animation' }, lineState: { params: { kind: 'cylinder', showMeasure: true }, annotation: { text: 'R² = R₀² − 2t', position: 'bottom' } } },
  { lineId: 'cy-3', sectionId: 'cylinder', scene: { id: 'cy-3', type: 'animation' }, lineState: { params: { kind: 'cylinder', showMeasure: true }, annotation: { text: '坍塌时刻是球面两倍', position: 'bottom' } } },
  { lineId: 'sg-1', sectionId: 'singular', scene: { id: 'sg-1', type: 'animation' }, lineState: { params: { kind: 'dumbbell' }, annotation: { text: '哑铃: 两端粗中间细', position: 'top' } } },
  { lineId: 'sg-2', sectionId: 'singular', scene: { id: 'sg-2', type: 'animation' }, lineState: { params: { kind: 'dumbbell', showMeasure: true }, annotation: { text: '细腰曲率大, 收缩快', position: 'bottom' } } },
  { lineId: 'sg-3', sectionId: 'singular', scene: { id: 'sg-3', type: 'animation' }, lineState: { params: { kind: 'dumbbell', showMeasure: true }, annotation: { text: '断开处即奇点', position: 'bottom' } } },
  { lineId: 'mn-1', sectionId: 'monotone', scene: { id: 'mn-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'peanut', showMeasure: true }, annotation: { text: '面积一直减小', position: 'top' } } },
  { lineId: 'mn-2', sectionId: 'monotone', scene: { id: 'mn-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'peanut', showMeasure: true }, annotation: { text: '体积也一直减小', position: 'bottom' } } },
  { lineId: 'mn-3', sectionId: 'monotone', scene: { id: 'mn-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'peanut', showMeasure: true }, annotation: { text: '凸曲面趋于球形', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '几何版的热方程', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '球面 t*=R₀²/4', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
