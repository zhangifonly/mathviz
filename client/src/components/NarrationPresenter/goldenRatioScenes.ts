/**
 * 黄金分割与斐波那契讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 40 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const defaultGoldenRatioState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

// 场景配置 - 每行口播对应一个场景
export const goldenRatioScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: {
      show: { ratioChart: false, spiral: false, sunflower: false },
    },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-nature', type: 'title' },
    lineState: {
      show: { ratioChart: false, spiral: false, sunflower: false },
      annotation: { text: '花朵、贝壳、银河系的秘密', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-phi', type: 'title' },
    lineState: {
      show: { ratioChart: false, spiral: false, sunflower: false },
      annotation: { text: 'φ ≈ 1.618', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-start', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false },
    },
  },

  // ========== fibonacci 段落 (5行) ==========
  {
    lineId: 'fib-1',
    sectionId: 'fibonacci',
    scene: { id: 'fib-intro', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: '斐波那契数列', position: 'top' },
    },
  },
  {
    lineId: 'fib-2',
    sectionId: 'fibonacci',
    scene: { id: 'fib-rule', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: 'F(n) = F(n-1) + F(n-2)', position: 'bottom' },
    },
  },
  {
    lineId: 'fib-3',
    sectionId: 'fibonacci',
    scene: { id: 'fib-calc', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: '1+1=2, 1+2=3, 2+3=5...', position: 'bottom' },
    },
  },
  {
    lineId: 'fib-4',
    sectionId: 'fibonacci',
    scene: { id: 'fib-sequence', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false, sequence: true },
      annotation: { text: '1,1,2,3,5,8,13,21,34,55...', position: 'bottom' },
    },
  },
  {
    lineId: 'fib-5',
    sectionId: 'fibonacci',
    scene: { id: 'fib-history', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: '800年前发现', position: 'bottom' },
    },
  },

  // ========== golden-ratio 段落 (5行) ==========
  {
    lineId: 'phi-1',
    sectionId: 'golden-ratio',
    scene: { id: 'phi-divide', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6, isAnimating: true },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: '相邻两数相除', position: 'top' },
    },
  },
  {
    lineId: 'phi-2',
    sectionId: 'golden-ratio',
    scene: { id: 'phi-calc', type: 'formula' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6, isAnimating: true },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: '2/1=2, 3/2=1.5, 5/3≈1.67', position: 'bottom' },
    },
  },
  {
    lineId: 'phi-3',
    sectionId: 'golden-ratio',
    scene: { id: 'phi-chart', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6, isAnimating: false },
      show: { ratioChart: true, spiral: false, sunflower: false },
      highlight: ['ratioLine'],
      annotation: { text: '比值越来越接近红线', position: 'bottom' },
    },
  },
  {
    lineId: 'phi-4',
    sectionId: 'golden-ratio',
    scene: { id: 'phi-value', type: 'formula' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false, formula: true },
      annotation: { text: 'φ = (1+√5)/2 ≈ 1.618', position: 'bottom' },
    },
  },
  {
    lineId: 'phi-5',
    sectionId: 'golden-ratio',
    scene: { id: 'phi-property', type: 'formula' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false, formula: true },
      annotation: { text: 'φ² = φ + 1', position: 'bottom' },
    },
  },

  // ========== spiral 段落 (5行) ==========
  {
    lineId: 'spiral-1',
    sectionId: 'spiral',
    scene: { id: 'spiral-intro', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: true, sunflower: false },
      annotation: { text: '黄金螺线', position: 'top' },
    },
  },
  {
    lineId: 'spiral-2',
    sectionId: 'spiral',
    scene: { id: 'spiral-growth', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: true, sunflower: false },
      annotation: { text: '每转一圈，半径变成φ倍', position: 'bottom' },
    },
  },
  {
    lineId: 'spiral-3',
    sectionId: 'spiral',
    scene: { id: 'spiral-shell', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: true, sunflower: false },
      annotation: { text: '鹦鹉螺的贝壳', position: 'bottom' },
    },
  },
  {
    lineId: 'spiral-4',
    sectionId: 'spiral',
    scene: { id: 'spiral-slider', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { fibCount: 15, spiralTurns: 4 },
      show: { ratioChart: false, spiral: true, sunflower: false },
      annotation: { text: '调整螺线圈数', position: 'bottom' },
    },
  },
  {
    lineId: 'spiral-5',
    sectionId: 'spiral',
    scene: { id: 'spiral-nature', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 8 },
      show: { ratioChart: false, spiral: true, sunflower: false },
      annotation: { text: '最"高效"的生长方式', position: 'bottom' },
    },
  },

  // ========== sunflower 段落 (5行) ==========
  {
    lineId: 'sun-1',
    sectionId: 'sunflower',
    scene: { id: 'sun-pattern', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: false, sunflower: true },
      annotation: { text: '向日葵种子排列', position: 'top' },
    },
  },
  {
    lineId: 'sun-2',
    sectionId: 'sunflower',
    scene: { id: 'sun-angle', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: false, sunflower: true },
      annotation: { text: '每颗种子旋转黄金角', position: 'bottom' },
    },
  },
  {
    lineId: 'sun-3',
    sectionId: 'sunflower',
    scene: { id: 'sun-golden', type: 'formula' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: false, sunflower: true, formula: true },
      annotation: { text: '黄金角 ≈ 137.5°', position: 'bottom' },
    },
  },
  {
    lineId: 'sun-4',
    sectionId: 'sunflower',
    scene: { id: 'sun-optimal', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: false, sunflower: true },
      annotation: { text: '空隙最小，种子最多', position: 'bottom' },
    },
  },
  {
    lineId: 'sun-5',
    sectionId: 'sunflower',
    scene: { id: 'sun-smart', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: false, sunflower: true },
      annotation: { text: '大自然的数学智慧', position: 'bottom' },
    },
  },

  // ========== parameters 段落 (5行) ==========
  {
    lineId: 'param-1',
    sectionId: 'parameters',
    scene: { id: 'param-intro', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: true, sunflower: false },
      annotation: { text: '轮到你了！', position: 'top' },
    },
  },
  {
    lineId: 'param-2',
    sectionId: 'parameters',
    scene: { id: 'param-terms', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { fibCount: 10, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: '调整斐波那契项数', position: 'bottom' },
    },
  },
  {
    lineId: 'param-3',
    sectionId: 'parameters',
    scene: { id: 'param-ratio', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { fibCount: 25, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: '项数越多越接近1.618', position: 'bottom' },
    },
  },
  {
    lineId: 'param-4',
    sectionId: 'parameters',
    scene: { id: 'param-spiral', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { fibCount: 15, spiralTurns: 4 },
      show: { ratioChart: false, spiral: true, sunflower: false },
      annotation: { text: '调整螺线圈数', position: 'bottom' },
    },
  },
  {
    lineId: 'param-5',
    sectionId: 'parameters',
    scene: { id: 'param-animate', type: 'interactive', interactive: { allowAnimation: true } },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6, isAnimating: true },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: '点击"播放动画"', position: 'bottom' },
    },
  },

  // ========== nature 段落 (5行) ==========
  {
    lineId: 'nature-1',
    sectionId: 'nature',
    scene: { id: 'nature-intro', type: 'application' },
    lineState: {
      show: { ratioChart: false, spiral: false, sunflower: false },
      annotation: { text: '自然界中的黄金比例', position: 'top' },
    },
  },
  {
    lineId: 'nature-2',
    sectionId: 'nature',
    scene: { id: 'nature-shell', type: 'application' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 8 },
      show: { ratioChart: false, spiral: true, sunflower: false },
      annotation: { text: '鹦鹉螺贝壳', position: 'bottom' },
    },
  },
  {
    lineId: 'nature-3',
    sectionId: 'nature',
    scene: { id: 'nature-plants', type: 'application' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: false, sunflower: true },
      annotation: { text: '松果、菠萝的纹路', position: 'bottom' },
    },
  },
  {
    lineId: 'nature-4',
    sectionId: 'nature',
    scene: { id: 'nature-body', type: 'application' },
    lineState: {
      show: { ratioChart: false, spiral: false, sunflower: false },
      annotation: { text: '手指骨节的长度比 ≈ φ', position: 'bottom' },
    },
  },
  {
    lineId: 'nature-5',
    sectionId: 'nature',
    scene: { id: 'nature-art', type: 'application' },
    lineState: {
      show: { ratioChart: false, spiral: false, sunflower: false },
      annotation: { text: '艺术家和建筑师的最爱', position: 'bottom' },
    },
  },

  // ========== summary 段落 (6行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { ratioChart: false, spiral: false, sunflower: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-fib', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false },
      annotation: { text: '斐波那契数列：前两数之和', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-phi', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: true, spiral: false, sunflower: false, formula: true },
      annotation: { text: 'φ ≈ 1.618 = 比值的极限', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-spiral', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: true, sunflower: false },
      annotation: { text: '黄金螺线和黄金角', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-nature', type: 'animation' },
    lineState: {
      params: { fibCount: 15, spiralTurns: 6 },
      show: { ratioChart: false, spiral: false, sunflower: true },
      annotation: { text: '大自然的"美丽密码"', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-6',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { ratioChart: false, spiral: false, sunflower: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
