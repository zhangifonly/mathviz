/**
 * 霍普夫纤维化讲解场景配置
 * 每句口播对应纤维数量（params.count）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultHopfFibrationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const hopfFibrationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '霍普夫纤维化', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-tangle', type: 'animation' }, lineState: { params: { count: 4 }, annotation: { text: '四维中的纠缠', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-wrap', type: 'animation' }, lineState: { params: { count: 2 }, annotation: { text: 'S3 缠成 S2', position: 'bottom' } } },

  // ===== spheres (3) =====
  { lineId: 'def-1', sectionId: 'spheres', scene: { id: 'def-spheres', type: 'animation' }, lineState: { params: { count: 2 }, annotation: { text: 'S3 与 S2', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'spheres', scene: { id: 'def-map', type: 'animation' }, lineState: { params: { count: 2 }, annotation: { text: 'S3 每点 -> S2 一点', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'spheres', scene: { id: 'def-complex', type: 'animation' }, lineState: { params: { count: 4 }, annotation: { text: '复数对的代数', position: 'bottom' } } },

  // ===== fiber (3) =====
  { lineId: 'fib-1', sectionId: 'fiber', scene: { id: 'fib-preimage', type: 'animation' }, lineState: { params: { count: 2 }, annotation: { text: '原像不是点', position: 'top' } } },
  { lineId: 'fib-2', sectionId: 'fiber', scene: { id: 'fib-circle', type: 'animation' }, lineState: { params: { count: 2 }, annotation: { text: '而是一个圆(纤维)', position: 'bottom' } } },
  { lineId: 'fib-3', sectionId: 'fiber', scene: { id: 'fib-project', type: 'animation' }, lineState: { params: { count: 4 }, annotation: { text: '球极投影到 3D', position: 'bottom' } } },

  // ===== link (3) =====
  { lineId: 'link-1', sectionId: 'link', scene: { id: 'link-cross', type: 'animation' }, lineState: { params: { count: 4 }, annotation: { text: '环扣却不相交', position: 'top' } } },
  { lineId: 'link-2', sectionId: 'link', scene: { id: 'link-villarceau', type: 'animation' }, lineState: { params: { count: 6 }, annotation: { text: '维拉索圆', position: 'bottom' } } },
  { lineId: 'link-3', sectionId: 'link', scene: { id: 'link-fill', type: 'animation' }, lineState: { params: { count: 6 }, annotation: { text: '铺满整个 S3', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 6 }, annotation: { text: '增加纤维数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-spin', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 4 }, annotation: { text: '旋转看环扣', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '每点对应一个圆', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-bundle', type: 'summary' }, lineState: { annotation: { text: '经典纤维丛', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
