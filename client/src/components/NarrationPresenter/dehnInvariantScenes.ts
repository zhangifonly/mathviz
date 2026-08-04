/**
 * Dehn 不变量 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultDehnInvariantState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const dehnInvariantScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { solidId: 'cube' }, annotation: { text: '平面：等面积必可剪拼', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { solidId: 'cube' }, annotation: { text: 'Bolyai–Gerwien, 1833', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron' }, annotation: { text: '空间里呢？希尔伯特第三问', position: 'bottom' } } },
  { lineId: 'an-1', sectionId: 'answer', scene: { id: 'an-1', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron' }, annotation: { text: '答案：不能', position: 'top' } } },
  { lineId: 'an-2', sectionId: 'answer', scene: { id: 'an-2', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron' }, annotation: { text: '1900 年提出，同年解决', position: 'bottom' } } },
  { lineId: 'an-3', sectionId: 'answer', scene: { id: 'an-3', type: 'animation' }, lineState: { params: { solidId: 'cube' }, annotation: { text: '造一个剪拼不变量', position: 'bottom' } } },
  { lineId: 'cs-1', sectionId: 'construct', scene: { id: 'cs-1', type: 'animation' }, lineState: { params: { solidId: 'cube', showAngles: true }, annotation: { text: 'D = Σ 棱长 ⊗ 二面角', position: 'top' } } },
  { lineId: 'cs-2', sectionId: 'construct', scene: { id: 'cs-2', type: 'animation' }, lineState: { params: { solidId: 'cube', showAngles: true }, annotation: { text: '在模掉 ℚπ 的空间里取值', position: 'bottom' } } },
  { lineId: 'cs-3', sectionId: 'construct', scene: { id: 'cs-3', type: 'animation' }, lineState: { params: { solidId: 'prism', showAngles: true }, annotation: { text: '绿棱：有理倍数，贡献为 0', position: 'bottom' } } },
  { lineId: 'cb-1', sectionId: 'cube', scene: { id: 'cb-1', type: 'animation' }, lineState: { params: { solidId: 'cube', showAngles: true }, annotation: { text: '12 条棱全是 90° = π/2', position: 'top' } } },
  { lineId: 'cb-2', sectionId: 'cube', scene: { id: 'cb-2', type: 'animation' }, lineState: { params: { solidId: 'cube', showAngles: true }, annotation: { text: '每项归零 ⟹ D = 0', position: 'bottom' } } },
  { lineId: 'cb-3', sectionId: 'cube', scene: { id: 'cb-3', type: 'animation' }, lineState: { params: { solidId: 'prism', showAngles: true }, annotation: { text: '三棱柱 60° 与 90°，也是 0', position: 'bottom' } } },
  { lineId: 'tt-1', sectionId: 'tetra', scene: { id: 'tt-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'tetrahedron', showAngles: true }, annotation: { text: '二面角 arccos(1/3) ≈ 70.53°', position: 'top' } } },
  { lineId: 'tt-2', sectionId: 'tetra', scene: { id: 'tt-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'tetrahedron', showAngles: true }, annotation: { text: '与 π 不可通约 ⟹ D ≠ 0', position: 'bottom' } } },
  { lineId: 'tt-3', sectionId: 'tetra', scene: { id: 'tt-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { solidId: 'octahedron', showAngles: true }, annotation: { text: '八面体同样非零', position: 'bottom' } } },
  { lineId: 'ir-1', sectionId: 'irrational', scene: { id: 'ir-1', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron', showAngles: false }, annotation: { text: '如何证明不可通约', position: 'top' } } },
  { lineId: 'ir-2', sectionId: 'irrational', scene: { id: 'ir-2', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron', showAngles: false }, annotation: { text: '3ⁿcos(nθ) 恒为不被 3 整除的整数', position: 'bottom' } } },
  { lineId: 'ir-3', sectionId: 'irrational', scene: { id: 'ir-3', type: 'animation' }, lineState: { params: { solidId: 'tetrahedron', showAngles: true }, annotation: { text: '若有理则会循环，矛盾', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'sydler', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '等体积不够，还要 D 相等', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'sydler', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '有理倍数的项自动归零', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'sydler', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
