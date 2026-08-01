/**
 * 罗马曲面 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultRomanSurfaceState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const romanSurfaceScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '斯坦纳 1844 于罗马', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { annotation: { text: '射影平面的浸入', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { annotation: { text: '三条自交线穿插', position: 'bottom' } } },
  { lineId: 'eq-1', sectionId: 'equation', scene: { id: 'eq-1', type: 'animation' }, lineState: { annotation: { text: '参数形式: 正弦余弦乘积', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equation', scene: { id: 'eq-2', type: 'animation' }, lineState: { annotation: { text: '隐式: 四次代数方程', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equation', scene: { id: 'eq-3', type: 'animation' }, lineState: { annotation: { text: '残差精确为零', position: 'bottom' } } },
  { lineId: 'proj-1', sectionId: 'projective', scene: { id: 'proj-1', type: 'animation' }, lineState: { annotation: { text: '(u,v) 与 (u+π, π−v) 同点', position: 'top' } } },
  { lineId: 'proj-2', sectionId: 'projective', scene: { id: 'proj-2', type: 'animation' }, lineState: { annotation: { text: '对径点认同', position: 'bottom' } } },
  { lineId: 'proj-3', sectionId: 'projective', scene: { id: 'proj-3', type: 'animation' }, lineState: { annotation: { text: '不可定向的闭曲面', position: 'bottom' } } },
  { lineId: 'sing-1', sectionId: 'singular', scene: { id: 'sing-1', type: 'animation' }, lineState: { annotation: { text: '三条自交线沿坐标轴', position: 'top' } } },
  { lineId: 'sing-2', sectionId: 'singular', scene: { id: 'sing-2', type: 'animation' }, lineState: { annotation: { text: '六个分支点', position: 'bottom' } } },
  { lineId: 'sing-3', sectionId: 'singular', scene: { id: 'sing-3', type: 'animation' }, lineState: { annotation: { text: '原点: 唯一的三重点', position: 'bottom' } } },
  { lineId: 'sym-1', sectionId: 'symmetry', scene: { id: 'sym-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { annotation: { text: '三个方向看都一样', position: 'top' } } },
  { lineId: 'sym-2', sectionId: 'symmetry', scene: { id: 'sym-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.3 }, annotation: { text: '方程里三变量对称', position: 'bottom' } } },
  { lineId: 'sym-3', sectionId: 'symmetry', scene: { id: 'sym-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.4 }, annotation: { text: '自交线半长 a²/2', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '斯坦纳的四次曲面', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '3 线 6 点 1 三重点', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
