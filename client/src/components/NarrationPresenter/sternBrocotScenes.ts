/**
 * Stern-Brocot 树讲解场景配置
 * 每句口播对应展开的树层数（params.depth）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultSternBrocotState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const sternBrocotScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: 'Stern-Brocot树', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { depth: 3 }, annotation: { text: '一棵分数之树', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-bounds', type: 'animation' }, lineState: { params: { depth: 3 }, annotation: { text: '边界 0/1 与 1/0', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-rule', type: 'animation' }, lineState: { params: { depth: 4 }, annotation: { text: '一条规则长出全部', position: 'bottom' } } },

  // ===== mediant (3) =====
  { lineId: 'def-1', sectionId: 'mediant', scene: { id: 'def-mediant', type: 'animation' }, lineState: { params: { depth: 3 }, annotation: { text: '分子分母各自相加', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'mediant', scene: { id: 'def-root', type: 'animation' }, lineState: { params: { depth: 3 }, annotation: { text: '树根 = 1/1', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'mediant', scene: { id: 'def-recurse', type: 'animation' }, lineState: { params: { depth: 4 }, annotation: { text: '递归生长', position: 'bottom' } } },

  // ===== reduced (3) =====
  { lineId: 'red-1', sectionId: 'reduced', scene: { id: 'red-born', type: 'animation' }, lineState: { params: { depth: 4 }, annotation: { text: '天生既约', position: 'top' } } },
  { lineId: 'red-2', sectionId: 'reduced', scene: { id: 'red-coprime', type: 'animation' }, lineState: { params: { depth: 4 }, annotation: { text: '分子分母互质', position: 'bottom' } } },
  { lineId: 'red-3', sectionId: 'reduced', scene: { id: 'red-unique', type: 'animation' }, lineState: { params: { depth: 4 }, annotation: { text: '每个恰好一次', position: 'bottom' } } },

  // ===== cf (2) =====
  { lineId: 'cf-1', sectionId: 'cf', scene: { id: 'cf-walk', type: 'animation' }, lineState: { params: { depth: 4 }, annotation: { text: '向左或向右', position: 'top' } } },
  { lineId: 'cf-2', sectionId: 'cf', scene: { id: 'cf-expand', type: 'animation' }, lineState: { params: { depth: 4 }, annotation: { text: '路径 = 连分数', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-depth', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 4 }, annotation: { text: '展开更多层', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-sep', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { depth: 4 }, annotation: { text: '整齐隔开', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '有序的分数树', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-cf', type: 'summary' }, lineState: { annotation: { text: '唯一且连分数', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
