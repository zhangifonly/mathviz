/**
 * 质因数分解讲解场景配置
 * 每句口播对应一个被分解的数字（params.n）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPrimeFactorizationState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const primeFactorizationScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '质因数分解', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-split', type: 'animation' }, lineState: { params: { n: 60 }, annotation: { text: '60 = 12 x 5', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-done', type: 'animation' }, lineState: { params: { n: 60 }, annotation: { text: '拆到不能再拆', position: 'bottom' } } },

  // ===== prime (3) =====
  { lineId: 'def-1', sectionId: 'prime', scene: { id: 'def-prime', type: 'animation' }, lineState: { params: { n: 17 }, annotation: { text: '质数：只被 1 和自己整除', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'prime', scene: { id: 'def-block', type: 'animation' }, lineState: { params: { n: 30 }, annotation: { text: '最基本的积木', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'prime', scene: { id: 'def-build', type: 'animation' }, lineState: { params: { n: 100 }, annotation: { text: '质数相乘搭出整数', position: 'bottom' } } },

  // ===== tree (3) =====
  { lineId: 'tree-1', sectionId: 'tree', scene: { id: 'tree-start', type: 'animation' }, lineState: { params: { n: 60 }, annotation: { text: '分解树', position: 'top' } } },
  { lineId: 'tree-2', sectionId: 'tree', scene: { id: 'tree-branch', type: 'animation' }, lineState: { params: { n: 360 }, annotation: { text: '每步拆成两个因子', position: 'bottom' } } },
  { lineId: 'tree-3', sectionId: 'tree', scene: { id: 'tree-leaf', type: 'animation' }, lineState: { params: { n: 360 }, annotation: { text: '绿色叶子=质数', position: 'bottom' } } },

  // ===== unique (2) =====
  { lineId: 'uni-1', sectionId: 'unique', scene: { id: 'uni-order', type: 'animation' }, lineState: { params: { n: 60 }, annotation: { text: '结果与顺序无关', position: 'top' } } },
  { lineId: 'uni-2', sectionId: 'unique', scene: { id: 'uni-theorem', type: 'animation' }, lineState: { params: { n: 60 }, annotation: { text: '60 = 2 x 2 x 3 x 5', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-input', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 100 }, annotation: { text: '换个数字试试', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-prime', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { n: 17 }, annotation: { text: '质数=单个叶子', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-recap', type: 'summary' }, lineState: { annotation: { text: '还原成质数乘积', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-unique', type: 'summary' }, lineState: { annotation: { text: '唯一且确定', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '下次再见！', position: 'bottom' } } },
]
