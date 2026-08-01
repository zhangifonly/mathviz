/**
 * 哈尔沃森吸引子 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultHalvorsenAttractorState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const halvorsenAttractorScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '三个方程形状相同', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { a: 1.89 }, annotation: { text: '变量在轮换', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { a: 1.89, showDiag: true }, annotation: { text: '对称会留下印记', position: 'bottom' } } },
  { lineId: 'sm-1', sectionId: 'symmetry', scene: { id: 'sm-1', type: 'animation' }, lineState: { params: { a: 1.89 }, annotation: { text: 'x→y→z→x 后不变', position: 'top' } } },
  { lineId: 'sm-2', sectionId: 'symmetry', scene: { id: 'sm-2', type: 'animation' }, lineState: { params: { a: 1.89 }, annotation: { text: '两条路径给出同一向量', position: 'bottom' } } },
  { lineId: 'sm-3', sectionId: 'symmetry', scene: { id: 'sm-3', type: 'animation' }, lineState: { params: { a: 1.89 }, annotation: { text: '偏差精确为零', position: 'bottom' } } },
  { lineId: 'tf-1', sectionId: 'threefold', scene: { id: 'tf-1', type: 'animation' }, lineState: { params: { a: 1.89 }, annotation: { text: '对应绕对角线转 120°', position: 'top' } } },
  { lineId: 'tf-2', sectionId: 'threefold', scene: { id: 'tf-2', type: 'animation' }, lineState: { params: { a: 1.89 }, annotation: { text: '故有三重旋转对称', position: 'bottom' } } },
  { lineId: 'tf-3', sectionId: 'threefold', scene: { id: 'tf-3', type: 'animation' }, lineState: { params: { a: 1.6 }, annotation: { text: '数出三片缠绕叶瓣', position: 'bottom' } } },
  { lineId: 'ds-1', sectionId: 'dissipation', scene: { id: 'ds-1', type: 'animation' }, lineState: { params: { a: 1.89, showDiag: true }, annotation: { text: '散度恒为 −3a', position: 'top' } } },
  { lineId: 'ds-2', sectionId: 'dissipation', scene: { id: 'ds-2', type: 'animation' }, lineState: { params: { a: 2.4, showDiag: true }, annotation: { text: '与位置完全无关', position: 'bottom' } } },
  { lineId: 'ds-3', sectionId: 'dissipation', scene: { id: 'ds-3', type: 'animation' }, lineState: { params: { a: 1.89, showDiag: true }, annotation: { text: '均匀耗散却依然混沌', position: 'bottom' } } },
  { lineId: 'eq-1', sectionId: 'equilibria', scene: { id: 'eq-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.89 }, annotation: { text: '对角线值得优先检查', position: 'top' } } },
  { lineId: 'eq-2', sectionId: 'equilibria', scene: { id: 'eq-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 1.89 }, annotation: { text: '解出原点与 −(a+8)', position: 'bottom' } } },
  { lineId: 'eq-3', sectionId: 'equilibria', scene: { id: 'eq-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { a: 2.5, showDiag: true }, annotation: { text: 'a 变大吸引子收紧', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '循环替换后不变', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '三重旋转对称', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
