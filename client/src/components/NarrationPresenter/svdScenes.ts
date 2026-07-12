/**
 * 奇异值分解讲解场景配置
 * 每句口播对应一个预设矩阵（params.matrixId）与画面类型，
 * lineId / sectionId 与 narrations/scripts/svd.ts 严格一一对应。
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSvdState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const svdScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { annotation: { text: '奇异值分解', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { matrixId: 'rotate-scale' }, annotation: { text: '旋转+拉伸+旋转', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { matrixId: 'shear' }, annotation: { text: '三个简单动作', position: 'bottom' } } },

  // ===== geometry (3) =====
  { lineId: 'geo-1', sectionId: 'geometry', scene: { id: 'geo-1', type: 'animation' }, lineState: { params: { matrixId: 'stretch' }, annotation: { text: '单位圆变椭圆', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'geometry', scene: { id: 'geo-2', type: 'animation' }, lineState: { params: { matrixId: 'stretch' }, annotation: { text: '半轴 = 奇异值', position: 'bottom' } } },
  { lineId: 'geo-3', sectionId: 'geometry', scene: { id: 'geo-3', type: 'animation' }, lineState: { params: { matrixId: 'rotate-scale' }, annotation: { text: 'σ1 ≥ σ2 ≥ 0', position: 'bottom' } } },

  // ===== decompose (3) =====
  { lineId: 'dec-1', sectionId: 'decompose', scene: { id: 'dec-1', type: 'formula' }, lineState: { params: { matrixId: 'rotate-scale' }, annotation: { text: 'A = U Σ Vᵀ', position: 'top' } } },
  { lineId: 'dec-2', sectionId: 'decompose', scene: { id: 'dec-2', type: 'formula' }, lineState: { params: { matrixId: 'rotate-scale' }, annotation: { text: 'Vᵀ 先旋转', position: 'top' } } },
  { lineId: 'dec-3', sectionId: 'decompose', scene: { id: 'dec-3', type: 'formula' }, lineState: { params: { matrixId: 'rotate-scale' }, annotation: { text: 'Σ 拉伸, U 再旋转', position: 'bottom' } } },

  // ===== rank (3) =====
  { lineId: 'rank-1', sectionId: 'rank', scene: { id: 'rank-1', type: 'animation' }, lineState: { params: { matrixId: 'rotate-scale' }, annotation: { text: '奇异值降序排列', position: 'top' } } },
  { lineId: 'rank-2', sectionId: 'rank', scene: { id: 'rank-2', type: 'formula' }, lineState: { params: { matrixId: 'rotate-scale' }, annotation: { text: '秩一最佳逼近', position: 'bottom' } } },
  { lineId: 'rank-3', sectionId: 'rank', scene: { id: 'rank-3', type: 'animation' }, lineState: { params: { matrixId: 'singular' }, annotation: { text: 'σ2 = 0 → 压扁成线', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { matrixId: 'shear' }, annotation: { text: '切换矩阵', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { matrixId: 'singular' }, annotation: { text: '塌缩成线段', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '旋转 + 拉伸 + 旋转', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '奇异值 = 椭圆半轴', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '压缩与降维的基石', position: 'bottom' } } },
]
