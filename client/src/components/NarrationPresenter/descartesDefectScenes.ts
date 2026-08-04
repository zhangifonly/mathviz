/**
 * Descartes 角亏定理 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultDescartesDefectState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const descartesDefectScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { solidId: 'cube', showDefects: false }, annotation: { text: '三个面各 90°，共 270°', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { solidId: 'cube', showDefects: false }, annotation: { text: '差 90° 才够一圈', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { solidId: 'cube', showDefects: true }, annotation: { text: '黄盘越大，角亏越多', position: 'bottom' } } },
  { lineId: 'th-1', sectionId: 'theorem', scene: { id: 'th-1', type: 'animation' }, lineState: { params: { solidId: 'cube', showDefects: true }, annotation: { text: 'Σδ 恒为 4π', position: 'top' } } },
  { lineId: 'th-2', sectionId: 'theorem', scene: { id: 'th-2', type: 'animation' }, lineState: { params: { solidId: 'cube', showDefects: true }, annotation: { text: '8 × 90° = 720° = 4π', position: 'bottom' } } },
  { lineId: 'th-3', sectionId: 'theorem', scene: { id: 'th-3', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron', showDefects: true }, annotation: { text: '4 × 180° 也是 720°', position: 'bottom' } } },
  { lineId: 'iv-1', sectionId: 'invariant', scene: { id: 'iv-1', type: 'animation' }, lineState: { params: { solidId: 'octahedron', showDefects: true }, annotation: { text: '顶点越多，每个角亏越少', position: 'top' } } },
  { lineId: 'iv-2', sectionId: 'invariant', scene: { id: 'iv-2', type: 'animation' }, lineState: { params: { solidId: 'dodecahedron', showDefects: true }, annotation: { text: '20 顶点 × 36°', position: 'bottom' } } },
  { lineId: 'iv-3', sectionId: 'invariant', scene: { id: 'iv-3', type: 'animation' }, lineState: { params: { solidId: 'icosahedron', showDefects: true }, annotation: { text: '12 顶点 × 60°，仍是 720°', position: 'bottom' } } },
  { lineId: 'eu-1', sectionId: 'euler', scene: { id: 'eu-1', type: 'animation' }, lineState: { params: { solidId: 'cube', showDefects: true, faceAlpha: 0.3 }, annotation: { text: '比欧拉公式早 100 年', position: 'top' } } },
  { lineId: 'eu-2', sectionId: 'euler', scene: { id: 'eu-2', type: 'animation' }, lineState: { params: { solidId: 'cube', showDefects: true, faceAlpha: 0.3 }, annotation: { text: 'Σδ = 2πV − Σ(nᵢ−2)π', position: 'bottom' } } },
  { lineId: 'eu-3', sectionId: 'euler', scene: { id: 'eu-3', type: 'animation' }, lineState: { params: { solidId: 'dodecahedron', showDefects: true, faceAlpha: 0.3 }, annotation: { text: '整理得 Σδ = 2π(V−E+F)', position: 'bottom' } } },
  { lineId: 'cv-1', sectionId: 'curvature', scene: { id: 'cv-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'icosahedron', showDefects: true }, annotation: { text: '4π 正是单位球面积', position: 'top' } } },
  { lineId: 'cv-2', sectionId: 'curvature', scene: { id: 'cv-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'icosahedron', showDefects: true }, annotation: { text: '曲率集中在顶点上', position: 'bottom' } } },
  { lineId: 'cv-3', sectionId: 'curvature', scene: { id: 'cv-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'dodecahedron', showDefects: true }, annotation: { text: '高斯–博内的离散形式', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: 'δ = 2π − 面角和', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: 'Σδ = 4π，与形状无关', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
