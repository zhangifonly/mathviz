/**
 * Dandelin 双球 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultDandelinState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const dandelinScenes: NarrationLineScene[] = [
  { lineId: 'q-1', sectionId: 'question', scene: { id: 'q-1', type: 'title' }, lineState: { params: { presetId: 'strong', showSpheres: false, showProof: false }, annotation: { text: '斜切圆锥，切口是椭圆', position: 'top' } } },
  { lineId: 'q-2', sectionId: 'question', scene: { id: 'q-2', type: 'animation' }, lineState: { params: { presetId: 'strong', showSpheres: false, showProof: false }, annotation: { text: '可是凭什么？', position: 'bottom' } } },
  { lineId: 'q-3', sectionId: 'question', scene: { id: 'q-3', type: 'animation' }, lineState: { params: { presetId: 'strong', showSpheres: false, showProof: false }, annotation: { text: '那两个焦点在哪里？', position: 'bottom' } } },
  { lineId: 's-1', sectionId: 'setup', scene: { id: 's-1', type: 'animation' }, lineState: { params: { presetId: 'strong', showSpheres: true, showProof: false }, annotation: { text: '塞进两个球', position: 'top' } } },
  { lineId: 's-2', sectionId: 'setup', scene: { id: 's-2', type: 'animation' }, lineState: { params: { presetId: 'strong', showSpheres: true, showProof: false }, annotation: { text: '同时与锥面、切平面相切', position: 'bottom' } } },
  { lineId: 's-3', sectionId: 'setup', scene: { id: 's-3', type: 'animation' }, lineState: { params: { presetId: 'strong', showSpheres: true, showProof: false }, annotation: { text: '加粗的圈就是切圆', position: 'bottom' } } },
  { lineId: 'l-1', sectionId: 'lemma', scene: { id: 'l-1', type: 'animation' }, lineState: { params: { presetId: 'strong', showProof: true, phi: 0.6 }, annotation: { text: '到球的切线段都等长', position: 'top' } } },
  { lineId: 'l-2', sectionId: 'lemma', scene: { id: 'l-2', type: 'animation' }, lineState: { params: { presetId: 'strong', showProof: true, phi: 0.6 }, annotation: { text: '长度 = √(|PO|² − r²)', position: 'bottom' } } },
  { lineId: 'l-3', sectionId: 'lemma', scene: { id: 'l-3', type: 'animation' }, lineState: { params: { presetId: 'strong', showProof: true, phi: 2.0 }, annotation: { text: '式子里只有距离，没有方向', position: 'bottom' } } },
  { lineId: 'p-1', sectionId: 'proof', scene: { id: 'p-1', type: 'animation' }, lineState: { params: { presetId: 'strong', showProof: true, phi: 1.2 }, annotation: { text: '母线穿过两个切圆于 T₁、T₂', position: 'top' } } },
  { lineId: 'p-2', sectionId: 'proof', scene: { id: 'p-2', type: 'animation' }, lineState: { params: { presetId: 'strong', showProof: true, phi: 1.2 }, annotation: { text: 'PF₁ = PT₁，PF₂ = PT₂', position: 'bottom' } } },
  { lineId: 'p-3', sectionId: 'proof', scene: { id: 'p-3', type: 'animation' }, lineState: { params: { presetId: 'strong', showProof: true, phi: 1.2 }, annotation: { text: '相加得 PF₁+PF₂ = T₁T₂', position: 'bottom' } } },
  { lineId: 'c-1', sectionId: 'conclusion', scene: { id: 'c-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'strong', showProof: true, phi: 3.0 }, annotation: { text: 'T₁T₂ 是母线上被截出的一段', position: 'top' } } },
  { lineId: 'c-2', sectionId: 'conclusion', scene: { id: 'c-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'strong', showProof: true, phi: 4.5 }, annotation: { text: '两个切圆都是水平的 ⟹ 每条母线截出的都一样长', position: 'bottom' } } },
  { lineId: 'c-3', sectionId: 'conclusion', scene: { id: 'c-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'strong', showProof: true, phi: 5.6 }, annotation: { text: '与 P 无关 ⟹ 切口是椭圆', position: 'bottom' } } },
  { lineId: 'e-1', sectionId: 'eccentricity', scene: { id: 'e-1', type: 'animation' }, lineState: { params: { presetId: 'mild', showProof: false }, annotation: { text: 'e = sinθ / cosα', position: 'top' } } },
  { lineId: 'e-2', sectionId: 'eccentricity', scene: { id: 'e-2', type: 'animation' }, lineState: { params: { presetId: 'circle', showProof: false }, annotation: { text: 'θ=0：e=0，切口是圆', position: 'bottom' } } },
  { lineId: 'e-3', sectionId: 'eccentricity', scene: { id: 'e-3', type: 'animation' }, lineState: { params: { presetId: 'extreme', showProof: false }, annotation: { text: 'θ→π/2−α：e→1，退化成抛物线', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '两球与平面的切点 = 焦点', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '切线段等长是唯一用到的引理', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
