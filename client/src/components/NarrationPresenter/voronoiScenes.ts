/**
 * 沃罗诺伊图讲解场景配置
 * 每句口播对应站点数量（params.count）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultVoronoiState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const voronoiScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '沃罗诺伊图', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { count: 8 }, annotation: { text: '离哪座城最近？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-color', type: 'animation' }, lineState: { params: { count: 8 }, annotation: { text: '同色 = 同归属', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '优美的结构', position: 'bottom' } } },

  // ===== define (3) =====
  { lineId: 'def-1', sectionId: 'define', scene: { id: 'def-region', type: 'animation' }, lineState: { params: { count: 8 }, annotation: { text: '各自的领地', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'define', scene: { id: 'def-bisect', type: 'animation' }, lineState: { params: { count: 8 }, annotation: { text: '边界=垂直平分线', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'define', scene: { id: 'def-dense', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '站点越多越细', position: 'bottom' } } },

  // ===== nature (3) =====
  { lineId: 'nat-1', sectionId: 'nature', scene: { id: 'nat-giraffe', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '长颈鹿花纹', position: 'top' } } },
  { lineId: 'nat-2', sectionId: 'nature', scene: { id: 'nat-cells', type: 'animation' }, lineState: { params: { count: 32 }, annotation: { text: '蜂巢·泥裂', position: 'bottom' } } },
  { lineId: 'nat-3', sectionId: 'nature', scene: { id: 'nat-eff', type: 'animation' }, lineState: { params: { count: 32 }, annotation: { text: '高效又稳定', position: 'bottom' } } },

  // ===== apply (2) =====
  { lineId: 'app-1', sectionId: 'apply', scene: { id: 'app-base', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '基站覆盖', position: 'top' } } },
  { lineId: 'app-2', sectionId: 'apply', scene: { id: 'app-delaunay', type: 'animation' }, lineState: { params: { count: 16 }, annotation: { text: '德劳内三角', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-count', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 32 }, annotation: { text: '调整站点数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-random', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { count: 16 }, annotation: { text: '随机生成', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '最近邻划分', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-delaunay', type: 'summary' }, lineState: { annotation: { text: '对偶德劳内', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
