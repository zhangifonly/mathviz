/**
 * 空间填充多面体 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSpaceFillingSolidsState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const spaceFillingSolidsScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '哪些正多边形能铺满地面', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'hexPrism', copies: 3 }, annotation: { text: '只有三角形方形六边形', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'cube', copies: 4 }, annotation: { text: '空间里答案只有一种', position: 'bottom' } } },
  { lineId: 'dh-1', sectionId: 'dihedral', scene: { id: 'dh-1', type: 'animation' }, lineState: { params: { kind: 'cube', copies: 1 }, annotation: { text: '判据换成二面角', position: 'top' } } },
  { lineId: 'dh-2', sectionId: 'dihedral', scene: { id: 'dh-2', type: 'animation' }, lineState: { params: { kind: 'cube', copies: 4 }, annotation: { text: '立方体 90° × 4 = 360°', position: 'bottom' } } },
  { lineId: 'dh-3', sectionId: 'dihedral', scene: { id: 'dh-3', type: 'animation' }, lineState: { params: { kind: 'cube', copies: 5 }, annotation: { text: '其余四种都除不尽', position: 'bottom' } } },
  { lineId: 'ar-1', sectionId: 'aristotle', scene: { id: 'ar-1', type: 'animation' }, lineState: { params: { showGap: true }, annotation: { text: '亚里士多德的断言', position: 'top' } } },
  { lineId: 'ar-2', sectionId: 'aristotle', scene: { id: 'ar-2', type: 'animation' }, lineState: { params: { showGap: true }, annotation: { text: '70.5288° × 5 = 352.64°', position: 'bottom' } } },
  { lineId: 'ar-3', sectionId: 'aristotle', scene: { id: 'ar-3', type: 'animation' }, lineState: { params: { showGap: true }, annotation: { text: '红色缝隙 7.3561°', position: 'bottom' } } },
  { lineId: 'ot-1', sectionId: 'others', scene: { id: 'ot-1', type: 'animation' }, lineState: { params: { kind: 'truncatedOctahedron', copies: 4 }, annotation: { text: '十三种里只有一个能填充', position: 'top' } } },
  { lineId: 'ot-2', sectionId: 'others', scene: { id: 'ot-2', type: 'animation' }, lineState: { params: { kind: 'rhombicDodecahedron', copies: 4 }, annotation: { text: '菱形十二面体: 球的势力范围', position: 'bottom' } } },
  { lineId: 'ot-3', sectionId: 'others', scene: { id: 'ot-3', type: 'animation' }, lineState: { params: { kind: 'hexPrism', copies: 4 }, annotation: { text: '六棱柱: 蜂巢的三维版', position: 'bottom' } } },
  { lineId: 'kp-1', sectionId: 'kepler', scene: { id: 'kp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'rhombicDodecahedron', copies: 1 }, annotation: { text: '球本身能占多少体积', position: 'top' } } },
  { lineId: 'kp-2', sectionId: 'kepler', scene: { id: 'kp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'rhombicDodecahedron', copies: 4 }, annotation: { text: '约 74%, 开普勒猜想', position: 'bottom' } } },
  { lineId: 'kp-3', sectionId: 'kepler', scene: { id: 'kp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'rhombicDodecahedron', copies: 5 }, annotation: { text: '多面体填充是 100%', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '判据: 360°/二面角为整数', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '正四面体差 7.36°', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
