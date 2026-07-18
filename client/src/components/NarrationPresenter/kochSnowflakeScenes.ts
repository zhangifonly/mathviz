/**
 * 科赫雪花讲解场景配置
 * 每句口播对应迭代层数（params.level）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultKochSnowflakeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const kochSnowflakeScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '科赫雪花', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-mystery', type: 'animation' }, lineState: { params: { level: 5 }, annotation: { text: '藏着一个秘密', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-start', type: 'animation' }, lineState: { params: { level: 0 }, annotation: { text: '从等边三角形开始', position: 'bottom' } } },

  // ===== rule (3) =====
  { lineId: 'rule-1', sectionId: 'rule', scene: { id: 'rule-third', type: 'animation' }, lineState: { params: { level: 1 }, annotation: { text: '每条边三等分', position: 'top' } } },
  { lineId: 'rule-2', sectionId: 'rule', scene: { id: 'rule-peak', type: 'animation' }, lineState: { params: { level: 1 }, annotation: { text: '中间凸出小三角', position: 'bottom' } } },
  { lineId: 'rule-3', sectionId: 'rule', scene: { id: 'rule-four', type: 'animation' }, lineState: { params: { level: 2 }, annotation: { text: '一段变四段', position: 'bottom' } } },

  // ===== perimeter (3) =====
  { lineId: 'peri-1', sectionId: 'perimeter', scene: { id: 'peri-count', type: 'animation' }, lineState: { params: { level: 2 }, annotation: { text: '边数×4 边长÷3', position: 'top' } } },
  { lineId: 'peri-2', sectionId: 'perimeter', scene: { id: 'peri-ratio', type: 'animation' }, lineState: { params: { level: 3 }, annotation: { text: '周长×4/3', position: 'bottom' } } },
  { lineId: 'peri-3', sectionId: 'perimeter', scene: { id: 'peri-inf', type: 'animation' }, lineState: { params: { level: 5 }, annotation: { text: '周长趋于无穷', position: 'bottom' } } },

  // ===== area (3) =====
  { lineId: 'area-1', sectionId: 'area', scene: { id: 'area-circle', type: 'animation' }, lineState: { params: { level: 4 }, annotation: { text: '被外接圆框住', position: 'top' } } },
  { lineId: 'area-2', sectionId: 'area', scene: { id: 'area-series', type: 'animation' }, lineState: { params: { level: 4 }, annotation: { text: '收敛的等比级数', position: 'bottom' } } },
  { lineId: 'area-3', sectionId: 'area', scene: { id: 'area-limit', type: 'animation' }, lineState: { params: { level: 5 }, annotation: { text: '面积=初始的 8/5', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-level', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { level: 3 }, annotation: { text: '调整迭代层数', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-values', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { level: 5 }, annotation: { text: '周长涨面积稳', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '自相似的边缘', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-fractal', type: 'summary' }, lineState: { annotation: { text: '无穷包住有限', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
