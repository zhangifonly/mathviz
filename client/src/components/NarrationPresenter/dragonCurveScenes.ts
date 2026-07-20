/**
 * 龙形曲线讲解场景配置
 * 每句口播对应迭代次数（params.iterations）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultDragonCurveState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const dragonCurveScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '龙形曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-fold', type: 'animation' }, lineState: { params: { iterations: 4 }, annotation: { text: '反复对折', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-unfold', type: 'animation' }, lineState: { params: { iterations: 6 }, annotation: { text: '掰成直角', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { iterations: 10 }, annotation: { text: '一条盘旋的龙', position: 'bottom' } } },

  // ===== fold (3) =====
  { lineId: 'fold-1', sectionId: 'fold', scene: { id: 'fold-count', type: 'animation' }, lineState: { params: { iterations: 5 }, annotation: { text: '折痕成倍增长', position: 'top' } } },
  { lineId: 'fold-2', sectionId: 'fold', scene: { id: 'fold-mirror', type: 'animation' }, lineState: { params: { iterations: 6 }, annotation: { text: '中间谷折·两侧镜像', position: 'bottom' } } },
  { lineId: 'fold-3', sectionId: 'fold', scene: { id: 'fold-grow', type: 'animation' }, lineState: { params: { iterations: 8 }, annotation: { text: '像细胞分裂', position: 'bottom' } } },

  // ===== turn (3) =====
  { lineId: 'turn-1', sectionId: 'turn', scene: { id: 'turn-seq', type: 'animation' }, lineState: { params: { iterations: 8 }, annotation: { text: '左转 / 右转', position: 'top' } } },
  { lineId: 'turn-2', sectionId: 'turn', scene: { id: 'turn-walk', type: 'animation' }, lineState: { params: { iterations: 10 }, annotation: { text: '每步等长·拐九十度', position: 'bottom' } } },
  { lineId: 'turn-3', sectionId: 'turn', scene: { id: 'turn-draw', type: 'animation' }, lineState: { params: { iterations: 12 }, annotation: { text: '一笔画成', position: 'bottom' } } },

  // ===== fill (3) =====
  { lineId: 'fill-1', sectionId: 'fill', scene: { id: 'fill-nocross', type: 'animation' }, lineState: { params: { iterations: 12 }, annotation: { text: '永不自交', position: 'top' } } },
  { lineId: 'fill-2', sectionId: 'fill', scene: { id: 'fill-cover', type: 'animation' }, lineState: { params: { iterations: 14 }, annotation: { text: '铺满区域', position: 'bottom' } } },
  { lineId: 'fill-3', sectionId: 'fill', scene: { id: 'fill-self', type: 'animation' }, lineState: { params: { iterations: 16 }, annotation: { text: '自相似的小龙', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-iter', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { iterations: 16 }, annotation: { text: '调整迭代次数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-color', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { iterations: 12 }, annotation: { text: '渐变=行进顺序', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '对折再展开', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-fractal', type: 'summary' }, lineState: { annotation: { text: '不自交的分形', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
