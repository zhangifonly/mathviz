/**
 * 莫比乌斯环与克莱因瓶讲解场景配置
 * 每句口播对应精确的曲面类型（surface 参数）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultMobiusState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const mobiusScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '莫比乌斯环', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-secret', type: 'animation' }, lineState: { params: { surface: 'mobius' }, annotation: { text: '只有一个面', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-ant', type: 'animation' }, lineState: { params: { surface: 'mobius' }, annotation: { text: '蚂蚁走遍"两面"', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-rotate', type: 'animation' }, lineState: { params: { surface: 'mobius' }, annotation: { text: '在三维中旋转', position: 'bottom' } } },

  // ===== mobius (4) =====
  { lineId: 'mob-1', sectionId: 'mobius', scene: { id: 'mob-twist', type: 'animation' }, lineState: { params: { surface: 'mobius' }, annotation: { text: '绕一圈翻转半圈', position: 'top' } } },
  { lineId: 'mob-2', sectionId: 'mobius', scene: { id: 'mob-ant1', type: 'animation' }, lineState: { params: { surface: 'mobius' }, annotation: { text: '一圈 → 到背面', position: 'bottom' } } },
  { lineId: 'mob-3', sectionId: 'mobius', scene: { id: 'mob-ant2', type: 'animation' }, lineState: { params: { surface: 'mobius' }, annotation: { text: '两圈 → 才归位', position: 'bottom' } } },
  { lineId: 'mob-4', sectionId: 'mobius', scene: { id: 'mob-cut', type: 'animation' }, lineState: { params: { surface: 'mobius' }, annotation: { text: '剪开 → 双扭大环', position: 'top' } } },

  // ===== klein (3) =====
  { lineId: 'klein-1', sectionId: 'klein', scene: { id: 'klein-intro', type: 'animation' }, lineState: { params: { surface: 'klein' }, annotation: { text: '克莱因瓶', position: 'top' } } },
  { lineId: 'klein-2', sectionId: 'klein', scene: { id: 'klein-noinout', type: 'animation' }, lineState: { params: { surface: 'klein' }, annotation: { text: '无内外·无边界', position: 'bottom' } } },
  { lineId: 'klein-3', sectionId: 'klein', scene: { id: 'klein-4d', type: 'animation' }, lineState: { params: { surface: 'klein' }, annotation: { text: '真身在四维空间', position: 'bottom' } } },

  // ===== compare (3) =====
  { lineId: 'cmp-1', sectionId: 'compare', scene: { id: 'cmp-torus', type: 'animation' }, lineState: { params: { surface: 'torus' }, annotation: { text: '环面：有内外两面', position: 'top' } } },
  { lineId: 'cmp-2', sectionId: 'compare', scene: { id: 'cmp-orient', type: 'animation' }, lineState: { params: { surface: 'torus' }, annotation: { text: '可定向 vs 不可定向', position: 'bottom' } } },
  { lineId: 'cmp-3', sectionId: 'compare', scene: { id: 'cmp-invariant', type: 'animation' }, lineState: { params: { surface: 'mobius' }, annotation: { text: '拓扑不变量', position: 'top' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { surface: 'mobius' }, annotation: { text: '拖动旋转观察', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { surface: 'klein' }, annotation: { text: '切换三种曲面', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '单侧曲面·无内外', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-topology', type: 'summary' }, lineState: { annotation: { text: '拓扑学的开端', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
