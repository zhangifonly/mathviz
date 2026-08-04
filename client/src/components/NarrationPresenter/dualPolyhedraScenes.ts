/**
 * 对偶多面体 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultDualPolyhedraState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const dualPolyhedraScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { solidId: 'cube', showDual: false }, annotation: { text: '立方体 6 面 8 顶点', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { solidId: 'octahedron', showDual: false }, annotation: { text: '正八面体正好反过来', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { solidId: 'cube', showDual: true }, annotation: { text: '两者的棱垂直穿插', position: 'bottom' } } },
  { lineId: 'pl-1', sectionId: 'polar', scene: { id: 'pl-1', type: 'animation' }, lineState: { params: { solidId: 'cube', showDual: true, showMid: true }, annotation: { text: '以半径 R 的球为镜', position: 'top' } } },
  { lineId: 'pl-2', sectionId: 'polar', scene: { id: 'pl-2', type: 'animation' }, lineState: { params: { solidId: 'cube', showDual: true, showMid: true }, annotation: { text: '新顶点距原点 R²/d', position: 'bottom' } } },
  { lineId: 'pl-3', sectionId: 'polar', scene: { id: 'pl-3', type: 'animation' }, lineState: { params: { solidId: 'octahedron', showDual: true }, annotation: { text: '面越近对偶顶点越远', position: 'bottom' } } },
  { lineId: 'eu-1', sectionId: 'euler', scene: { id: 'eu-1', type: 'animation' }, lineState: { params: { solidId: 'cube', showDual: true, fillFaces: false }, annotation: { text: 'F↔V 互换, E 不变', position: 'top' } } },
  { lineId: 'eu-2', sectionId: 'euler', scene: { id: 'eu-2', type: 'animation' }, lineState: { params: { solidId: 'cube', showDual: true, fillFaces: false }, annotation: { text: '8−12+6 = 6−12+8 = 2', position: 'bottom' } } },
  { lineId: 'eu-3', sectionId: 'euler', scene: { id: 'eu-3', type: 'animation' }, lineState: { params: { solidId: 'icosahedron', showDual: true, fillFaces: false }, annotation: { text: '五种立体 χ 都是 2', position: 'bottom' } } },
  { lineId: 'pr-1', sectionId: 'pairs', scene: { id: 'pr-1', type: 'animation' }, lineState: { params: { solidId: 'cube', showDual: true }, annotation: { text: '立方体 ↔ 正八面体', position: 'top' } } },
  { lineId: 'pr-2', sectionId: 'pairs', scene: { id: 'pr-2', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron', showDual: true }, annotation: { text: '正四面体自对偶', position: 'bottom' } } },
  { lineId: 'pr-3', sectionId: 'pairs', scene: { id: 'pr-3', type: 'animation' }, lineState: { params: { solidId: 'dodecahedron', showDual: true }, annotation: { text: '十二面体 ↔ 二十面体', position: 'bottom' } } },
  { lineId: 'md-1', sectionId: 'midsphere', scene: { id: 'md-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'cube', showDual: false, showMid: true }, annotation: { text: '中球与所有棱相切', position: 'top' } } },
  { lineId: 'md-2', sectionId: 'midsphere', scene: { id: 'md-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'cube', showDual: true, showMid: true, fillFaces: false }, annotation: { text: '交点落在球面上', position: 'bottom' } } },
  { lineId: 'md-3', sectionId: 'midsphere', scene: { id: 'md-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'icosahedron', showDual: true, showMid: true, fillFaces: false }, annotation: { text: '垂直度 1e-16', position: 'bottom' } } },
  { lineId: 'iv-1', sectionId: 'involution', scene: { id: 'iv-1', type: 'animation' }, lineState: { params: { solidId: 'octahedron', showDual: true }, annotation: { text: '对偶的对偶回到自己', position: 'top' } } },
  { lineId: 'iv-2', sectionId: 'involution', scene: { id: 'iv-2', type: 'animation' }, lineState: { params: { solidId: 'dodecahedron', showDual: true }, annotation: { text: '这叫对合', position: 'bottom' } } },
  { lineId: 'iv-3', sectionId: 'involution', scene: { id: 'iv-3', type: 'animation' }, lineState: { params: { solidId: 'cube', showDual: true }, annotation: { text: '换个角度看同一结构', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'F↔V 互换, E 不变', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '极反演: 距原点 R²/d', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
