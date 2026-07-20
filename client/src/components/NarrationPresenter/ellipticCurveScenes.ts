/**
 * 椭圆曲线讲解场景配置
 * 每句口播对应曲线索引与两点 x 坐标（params.ci / xp / xq）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEllipticCurveState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const ellipticCurveScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '椭圆曲线', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-two', type: 'animation' }, lineState: { params: { ci: 0, xp: -1, xq: 1.5 }, annotation: { text: '两点相加', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-onback', type: 'animation' }, lineState: { params: { ci: 0, xp: -1, xq: 1.5 }, annotation: { text: '结果仍在曲线上', position: 'bottom' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-name', type: 'animation' }, lineState: { params: { ci: 0, xp: -1, xq: 1.5 }, annotation: { text: '密码学基石', position: 'bottom' } } },

  // ===== equation (3) =====
  { lineId: 'def-1', sectionId: 'equation', scene: { id: 'def-eq', type: 'animation' }, lineState: { params: { ci: 0, xp: -1, xq: 1.5 }, annotation: { text: 'y²=x³+ax+b', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'equation', scene: { id: 'def-sym', type: 'animation' }, lineState: { params: { ci: 0, xp: -1, xq: 1.5 }, annotation: { text: '关于 x 轴对称', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'equation', scene: { id: 'def-smooth', type: 'animation' }, lineState: { params: { ci: 2, xp: -0.5, xq: 1.2 }, annotation: { text: '判别式非零则光滑', position: 'bottom' } } },

  // ===== geometry (3) =====
  { lineId: 'geo-1', sectionId: 'geometry', scene: { id: 'geo-line', type: 'animation' }, lineState: { params: { ci: 0, xp: -1, xq: 1.5 }, annotation: { text: '过 P、Q 作直线', position: 'top' } } },
  { lineId: 'geo-2', sectionId: 'geometry', scene: { id: 'geo-third', type: 'animation' }, lineState: { params: { ci: 0, xp: -1, xq: 1.5 }, annotation: { text: '交曲线于第三点', position: 'bottom' } } },
  { lineId: 'geo-3', sectionId: 'geometry', scene: { id: 'geo-reflect', type: 'animation' }, lineState: { params: { ci: 0, xp: -1, xq: 1.5 }, annotation: { text: '翻折得 P+Q', position: 'bottom' } } },

  // ===== infinity (3) =====
  { lineId: 'inf-1', sectionId: 'infinity', scene: { id: 'inf-vert', type: 'animation' }, lineState: { params: { ci: 0, xp: 0.6, xq: 0.6 }, annotation: { text: '竖直连线', position: 'top' } } },
  { lineId: 'inf-2', sectionId: 'infinity', scene: { id: 'inf-point', type: 'animation' }, lineState: { params: { ci: 0, xp: 0.6, xq: 0.6 }, annotation: { text: '无穷远点 O', position: 'bottom' } } },
  { lineId: 'inf-3', sectionId: 'infinity', scene: { id: 'inf-identity', type: 'animation' }, lineState: { params: { ci: 0, xp: -1, xq: 1.5 }, annotation: { text: 'O 是单位元', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-drag', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { ci: 0, xp: -1.5, xq: 1 }, annotation: { text: '选择 P 与 Q', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-sum', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { ci: 1, xp: -1, xq: 1.5 }, annotation: { text: 'P+Q 落在曲线上', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-group', type: 'summary' }, lineState: { annotation: { text: '构成交换群', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-identity', type: 'summary' }, lineState: { annotation: { text: '单位元与负元', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
