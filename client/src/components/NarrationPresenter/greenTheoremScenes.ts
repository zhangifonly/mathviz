/**
 * 格林公式讲解场景配置
 * 每句口播对应一个向量场(params.field) 与 是否显示旋度热力(params.showCurl)
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultGreenTheoremState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const greenTheoremScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-title', type: 'title' }, lineState: { annotation: { text: '格林公式', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-curve', type: 'animation' }, lineState: { params: { field: 'rotation', showCurl: false }, annotation: { text: '封闭曲线围住区域', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-idea', type: 'animation' }, lineState: { params: { field: 'rotation', showCurl: true }, annotation: { text: '边界由内部决定', position: 'bottom' } } },

  // ===== curl (3) =====
  { lineId: 'curl-1', sectionId: 'curl', scene: { id: 'curl-spin', type: 'animation' }, lineState: { params: { field: 'rotation', showCurl: true }, annotation: { text: '每点是否打转', position: 'top' } } },
  { lineId: 'curl-2', sectionId: 'curl', scene: { id: 'curl-def', type: 'animation' }, lineState: { params: { field: 'rotation', showCurl: true }, annotation: { text: '旋度 = Qx - Py', position: 'top' } } },
  { lineId: 'curl-3', sectionId: 'curl', scene: { id: 'curl-sign', type: 'animation' }, lineState: { params: { field: 'shear', showCurl: true }, annotation: { text: '正逆时针 负顺时针', position: 'bottom' } } },

  // ===== theorem (3) =====
  { lineId: 'thm-1', sectionId: 'theorem', scene: { id: 'thm-eq', type: 'animation' }, lineState: { params: { field: 'rotation', showCurl: true }, annotation: { text: '线积分 = 旋度二重积分', position: 'top' } } },
  { lineId: 'thm-2', sectionId: 'theorem', scene: { id: 'thm-circ', type: 'animation' }, lineState: { params: { field: 'rotation', showCurl: true }, annotation: { text: '边界环量 = 内部总和', position: 'top' } } },
  { lineId: 'thm-3', sectionId: 'theorem', scene: { id: 'thm-cancel', type: 'animation' }, lineState: { params: { field: 'rotation', showCurl: true }, annotation: { text: '内部相互抵消', position: 'bottom' } } },

  // ===== area (3) =====
  { lineId: 'area-1', sectionId: 'area', scene: { id: 'area-field', type: 'animation' }, lineState: { params: { field: 'area', showCurl: true }, annotation: { text: '旋度恒为 1', position: 'top' } } },
  { lineId: 'area-2', sectionId: 'area', scene: { id: 'area-boundary', type: 'animation' }, lineState: { params: { field: 'area', showCurl: false }, annotation: { text: '沿边界走一圈算面积', position: 'top' } } },
  { lineId: 'area-3', sectionId: 'area', scene: { id: 'area-planimeter', type: 'animation' }, lineState: { params: { field: 'area', showCurl: false }, annotation: { text: '求积仪原理', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'shear', showCurl: true }, annotation: { text: '切换向量场', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-conservative', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { field: 'conservative', showCurl: true }, annotation: { text: '保守场环量为零', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '边界 → 区域', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-link', type: 'summary' }, lineState: { annotation: { text: '斯托克斯的雏形', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '下次再见！', position: 'bottom' } } },
]
