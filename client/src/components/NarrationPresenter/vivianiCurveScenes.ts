/**
 * 维维亚尼曲线 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultVivianiCurveState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const vivianiCurveScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '1692 年维维亚尼的问题', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { a: 1 }, annotation: { text: '要一个不含 π 的答案', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { a: 1 }, annotation: { text: '剩余面积恰为 4a²', position: 'bottom' } } },
  { lineId: 'st-1', sectionId: 'setup', scene: { id: 'st-1', type: 'animation' }, lineState: { params: { a: 1 }, annotation: { text: '球半径 2a, 柱半径 a', position: 'top' } } },
  { lineId: 'st-2', sectionId: 'setup', scene: { id: 'st-2', type: 'animation' }, lineState: { params: { a: 1 }, annotation: { text: '圆柱面通过球心', position: 'bottom' } } },
  { lineId: 'st-3', sectionId: 'setup', scene: { id: 'st-3', type: 'animation' }, lineState: { params: { a: 1.3 }, annotation: { text: '参数化只有三行', position: 'bottom' } } },
  { lineId: 'vf-1', sectionId: 'verify', scene: { id: 'vf-1', type: 'animation' }, lineState: { params: { a: 1 }, annotation: { text: '代入两个曲面方程', position: 'top' } } },
  { lineId: 'vf-2', sectionId: 'verify', scene: { id: 'vf-2', type: 'animation' }, lineState: { params: { a: 1 }, annotation: { text: '球面与柱面残差都为零', position: 'bottom' } } },
  { lineId: 'vf-3', sectionId: 'verify', scene: { id: 'vf-3', type: 'animation' }, lineState: { params: { a: 0.8 }, annotation: { text: '误差 1e-16 量级', position: 'bottom' } } },
  { lineId: 'pd-1', sectionId: 'period', scene: { id: 'pd-1', type: 'animation' }, lineState: { params: { a: 1 }, annotation: { text: 'x,y 周期是 2π', position: 'top' } } },
  { lineId: 'pd-2', sectionId: 'period', scene: { id: 'pd-2', type: 'animation' }, lineState: { params: { a: 1 }, annotation: { text: '但 z 含 sin(t/2)', position: 'bottom' } } },
  { lineId: 'pd-3', sectionId: 'period', scene: { id: 'pd-3', type: 'animation' }, lineState: { params: { a: 1 }, annotation: { text: '必须跑满 4π', position: 'bottom' } } },
  { lineId: 'pj-1', sectionId: 'projection', scene: { id: 'pj-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1 }, annotation: { text: '投到水平面得圆', position: 'top' } } },
  { lineId: 'pj-2', sectionId: 'projection', scene: { id: 'pj-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.2 }, annotation: { text: '投到竖平面得抛物线', position: 'bottom' } } },
  { lineId: 'pj-3', sectionId: 'projection', scene: { id: 'pj-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.2 }, annotation: { text: '另一个竖平面得双纽线', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '球与柱的交线', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '周期是 4π', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
