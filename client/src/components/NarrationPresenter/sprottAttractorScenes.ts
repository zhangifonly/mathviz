/**
 * 斯普罗特极简吸引子 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultSprottAttractorState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sprottAttractorScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '洛伦兹与罗斯勒都是 7 项', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { kind: 'A' }, annotation: { text: '最少需要多复杂?', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { kind: 'A', showDiag: true }, annotation: { text: '让计算机穷举', position: 'bottom' } } },
  { lineId: 'an-1', sectionId: 'answer', scene: { id: 'an-1', type: 'animation' }, lineState: { params: { kind: 'A' }, annotation: { text: '19 个系统, 5~6 项', position: 'top' } } },
  { lineId: 'an-2', sectionId: 'answer', scene: { id: 'an-2', type: 'animation' }, lineState: { params: { kind: 'A' }, annotation: { text: 'Case A: x\'=y, y\'=−x+yz, z\'=1−y²', position: 'bottom' } } },
  { lineId: 'an-3', sectionId: 'answer', scene: { id: 'an-3', type: 'animation' }, lineState: { params: { kind: 'A', showDiag: true }, annotation: { text: '5 项, 2 个二次项', position: 'bottom' } } },
  { lineId: 'cs-1', sectionId: 'conservative', scene: { id: 'cs-1', type: 'animation' }, lineState: { params: { kind: 'A', showDiag: true }, annotation: { text: 'Case A 散度是 z 而非常数', position: 'top' } } },
  { lineId: 'cs-2', sectionId: 'conservative', scene: { id: 'cs-2', type: 'animation' }, lineState: { params: { kind: 'A', showDiag: true }, annotation: { text: '要看时间平均', position: 'bottom' } } },
  { lineId: 'cs-3', sectionId: 'conservative', scene: { id: 'cs-3', type: 'animation' }, lineState: { params: { kind: 'A', showDiag: true }, annotation: { text: '平均≈0 却 λ₁>0', position: 'bottom' } } },
  { lineId: 'ms-1', sectionId: 'misconception', scene: { id: 'ms-1', type: 'animation' }, lineState: { params: { kind: 'A', showDiag: true }, annotation: { text: '常说混沌必须耗散', position: 'top' } } },
  { lineId: 'ms-2', sectionId: 'misconception', scene: { id: 'ms-2', type: 'animation' }, lineState: { params: { kind: 'B', showDiag: true }, annotation: { text: '耗散是吸引子的条件', position: 'bottom' } } },
  { lineId: 'ms-3', sectionId: 'misconception', scene: { id: 'ms-3', type: 'animation' }, lineState: { params: { kind: 'B', showDiag: true }, annotation: { text: '不是混沌的条件', position: 'bottom' } } },
  { lineId: 'cm-1', sectionId: 'compare', scene: { id: 'cm-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'B', showDiag: true }, annotation: { text: 'A 随位置变, B/C 恒为 −1', position: 'top' } } },
  { lineId: 'cm-2', sectionId: 'compare', scene: { id: 'cm-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'C', showDiag: true }, annotation: { text: 'B 与 C 只差第三个方程', position: 'bottom' } } },
  { lineId: 'cm-3', sectionId: 'compare', scene: { id: 'cm-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { kind: 'C', showDiag: true }, annotation: { text: '每一项都举足轻重', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '五项足以产生混沌', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '保守系统也能混沌', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
