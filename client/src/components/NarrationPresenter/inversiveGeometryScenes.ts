/**
 * 反演几何讲解场景配置
 * 每句口播对应反演圆半径（params.radius）与是否显示反演像（params.showImage）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultInversiveGeometryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const inversiveGeometryScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-mirror', type: 'title' }, lineState: { annotation: { text: '反演几何', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-circle', type: 'animation' }, lineState: { params: { radius: 110, showImage: false }, annotation: { text: '以圆为镜', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-swap', type: 'animation' }, lineState: { params: { radius: 110, showImage: true }, annotation: { text: '直线↔圆', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { radius: 110, showImage: true }, annotation: { text: '反演变换', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-oR', type: 'animation' }, lineState: { params: { radius: 110, showImage: false }, annotation: { text: '反演圆 O, R', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-product', type: 'animation' }, lineState: { params: { radius: 110, showImage: true }, annotation: { text: "|OP'|·|OP|=R²", position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-infinity', type: 'animation' }, lineState: { params: { radius: 150, showImage: true }, annotation: { text: 'O 映到无穷远', position: 'bottom' } } },

  // ===== line-to-circle (3) =====
  { lineId: 'l2c-1', sectionId: 'line-to-circle', scene: { id: 'l2c-line', type: 'animation' }, lineState: { params: { radius: 110, showImage: false }, annotation: { text: '不过 O 的直线', position: 'top' } } },
  { lineId: 'l2c-2', sectionId: 'line-to-circle', scene: { id: 'l2c-arc', type: 'animation' }, lineState: { params: { radius: 110, showImage: true }, annotation: { text: '像是过 O 的圆', position: 'bottom' } } },
  { lineId: 'l2c-3', sectionId: 'line-to-circle', scene: { id: 'l2c-back', type: 'animation' }, lineState: { params: { radius: 70, showImage: true }, annotation: { text: '互为反演', position: 'bottom' } } },

  // ===== circle-to-circle (3) =====
  { lineId: 'c2c-1', sectionId: 'circle-to-circle', scene: { id: 'c2c-circle', type: 'animation' }, lineState: { params: { radius: 110, showImage: true }, annotation: { text: '圆仍是圆', position: 'top' } } },
  { lineId: 'c2c-2', sectionId: 'circle-to-circle', scene: { id: 'c2c-general', type: 'animation' }, lineState: { params: { radius: 150, showImage: true }, annotation: { text: '广义圆', position: 'bottom' } } },
  { lineId: 'c2c-3', sectionId: 'circle-to-circle', scene: { id: 'c2c-conformal', type: 'animation' }, lineState: { params: { radius: 110, showImage: true }, annotation: { text: '保角共形', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-radius', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { radius: 150, showImage: true }, annotation: { text: '调整半径 R', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-toggle', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { radius: 70, showImage: true }, annotation: { text: '开关反演像', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-formula', type: 'summary' }, lineState: { annotation: { text: "|OP'|·|OP|=R²", position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-unify', type: 'summary' }, lineState: { annotation: { text: '圆与直线统一', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
