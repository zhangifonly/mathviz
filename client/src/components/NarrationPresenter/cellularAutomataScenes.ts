/**
 * 元胞自动机讲解场景配置
 * 每句口播对应一个规则号（params.rule），驱动渲染器演化对应图案
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCellularAutomataState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const cellularAutomataScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '元胞自动机', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-neighbor', type: 'animation' }, lineState: { params: { rule: 90 }, annotation: { text: '只看左右邻居', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-world', type: 'animation' }, lineState: { params: { rule: 90 }, annotation: { text: '极简生万千', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'rule-1', sectionId: 'rule', scene: { id: 'rule-eight', type: 'animation' }, lineState: { params: { rule: 90 }, annotation: { text: '八种邻域组合', position: 'top' } } },
  { lineId: 'rule-2', sectionId: 'rule', scene: { id: 'rule-output', type: 'animation' }, lineState: { params: { rule: 90 }, annotation: { text: '各指定一个输出', position: 'top' } } },
  { lineId: 'rule-3', sectionId: 'rule', scene: { id: 'rule-code', type: 'animation' }, lineState: { params: { rule: 90 }, annotation: { text: '0~255 规则号', position: 'bottom' } } },

  // ===== chaos (2) =====
  { lineId: 'chaos-1', sectionId: 'chaos', scene: { id: 'chaos-noise', type: 'animation' }, lineState: { params: { rule: 30 }, annotation: { text: '规则 30 混沌', position: 'top' } } },
  { lineId: 'chaos-2', sectionId: 'chaos', scene: { id: 'chaos-random', type: 'animation' }, lineState: { params: { rule: 30 }, annotation: { text: '中心列做随机数', position: 'bottom' } } },

  // ===== fractal (3) =====
  { lineId: 'fractal-1', sectionId: 'fractal', scene: { id: 'fractal-xor', type: 'animation' }, lineState: { params: { rule: 90 }, annotation: { text: '左右异或', position: 'top' } } },
  { lineId: 'fractal-2', sectionId: 'fractal', scene: { id: 'fractal-sier', type: 'animation' }, lineState: { params: { rule: 90 }, annotation: { text: '谢尔宾斯基三角', position: 'bottom' } } },
  { lineId: 'fractal-3', sectionId: 'fractal', scene: { id: 'fractal-self', type: 'animation' }, lineState: { params: { rule: 90 }, annotation: { text: '自相似涌现', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'inter-1', sectionId: 'interaction', scene: { id: 'inter-turing', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rule: 110 }, annotation: { text: '规则 110 图灵完备', position: 'top' } } },
  { lineId: 'inter-2', sectionId: 'interaction', scene: { id: 'inter-explore', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { rule: 150 }, annotation: { text: '亲手切换规则', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '混沌·分形·计算', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-cosmos', type: 'summary' }, lineState: { annotation: { text: '简单底层法则', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '简单之中藏着无穷', position: 'bottom' } } },
]
