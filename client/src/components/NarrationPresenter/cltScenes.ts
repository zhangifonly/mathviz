/**
 * 中心极限定理讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCltState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const cltScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { histogram: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-normal', type: 'animation' },
    lineState: {
      show: { histogram: true, normalCurve: true },
      annotation: { text: '正态分布钟形曲线', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-why', type: 'animation' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '为什么如此普遍？', position: 'bottom' },
    },
  },

  // ========== theorem 段落 (4行) ==========
  {
    lineId: 'theorem-1',
    sectionId: 'theorem',
    scene: { id: 'thm-sum', type: 'animation' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '独立随机变量的和', position: 'top' },
    },
  },
  {
    lineId: 'theorem-2',
    sectionId: 'theorem',
    scene: { id: 'thm-mean', type: 'animation' },
    lineState: {
      show: { histogram: true, normalCurve: true },
      annotation: { text: '样本均值→正态分布', position: 'bottom' },
    },
  },
  {
    lineId: 'theorem-3',
    sectionId: 'theorem',
    scene: { id: 'thm-n', type: 'animation' },
    lineState: {
      params: { n: 30 },
      show: { histogram: true },
      annotation: { text: '样本量越大越精确', position: 'bottom' },
    },
  },
  {
    lineId: 'theorem-4',
    sectionId: 'theorem',
    scene: { id: 'thm-explain', type: 'animation' },
    lineState: {
      show: { histogram: true, normalCurve: true },
      annotation: { text: '解释正态分布普遍性', position: 'bottom' },
    },
  },

  // ========== dice-example 段落 (4行) ==========
  {
    lineId: 'dice-example-1',
    sectionId: 'dice-example',
    scene: { id: 'dice-intro', type: 'animation' },
    lineState: {
      params: { distribution: 'dice', n: 1 },
      show: { histogram: true },
      annotation: { text: '掷骰子实验', position: 'top' },
    },
  },
  {
    lineId: 'dice-example-2',
    sectionId: 'dice-example',
    scene: { id: 'dice-one', type: 'animation' },
    lineState: {
      params: { distribution: 'dice', n: 1 },
      show: { histogram: true },
      annotation: { text: '1个骰子=均匀分布', position: 'bottom' },
    },
  },
  {
    lineId: 'dice-example-3',
    sectionId: 'dice-example',
    scene: { id: 'dice-two', type: 'animation' },
    lineState: {
      params: { distribution: 'dice', n: 2 },
      show: { histogram: true },
      annotation: { text: '2个骰子=三角形', position: 'bottom' },
    },
  },
  {
    lineId: 'dice-example-4',
    sectionId: 'dice-example',
    scene: { id: 'dice-more', type: 'animation' },
    lineState: {
      params: { distribution: 'dice', n: 10 },
      show: { histogram: true, normalCurve: true },
      annotation: { text: '更多骰子→正态', position: 'bottom' },
    },
  },

  // ========== simulation 段落 (4行) ==========
  {
    lineId: 'simulation-1',
    sectionId: 'simulation',
    scene: { id: 'sim-dist', type: 'animation' },
    lineState: {
      params: { n: 10 },
      show: { histogram: true },
      annotation: { text: '样本均值分布', position: 'top' },
    },
  },
  {
    lineId: 'simulation-2',
    sectionId: 'simulation',
    scene: { id: 'sim-n', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { n: 10 },
      show: { histogram: true, slider: true },
      annotation: { text: '调整样本量n', position: 'bottom' },
    },
  },
  {
    lineId: 'simulation-3',
    sectionId: 'simulation',
    scene: { id: 'sim-small', type: 'animation' },
    lineState: {
      params: { n: 5 },
      show: { histogram: true },
      annotation: { text: 'n小时不规则', position: 'bottom' },
    },
  },
  {
    lineId: 'simulation-4',
    sectionId: 'simulation',
    scene: { id: 'sim-large', type: 'animation' },
    lineState: {
      params: { n: 50 },
      show: { histogram: true, normalCurve: true },
      annotation: { text: 'n大时→钟形曲线', position: 'bottom' },
    },
  },

  // ========== different-distributions 段落 (4行) ==========
  {
    lineId: 'different-distributions-1',
    sectionId: 'different-distributions',
    scene: { id: 'dd-magic', type: 'animation' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '对任何分布都成立', position: 'top' },
    },
  },
  {
    lineId: 'different-distributions-2',
    sectionId: 'different-distributions',
    scene: { id: 'dd-select', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { distribution: 'uniform' },
      show: { histogram: true, selector: true },
      annotation: { text: '选择原始分布', position: 'bottom' },
    },
  },
  {
    lineId: 'different-distributions-3',
    sectionId: 'different-distributions',
    scene: { id: 'dd-result', type: 'animation' },
    lineState: {
      params: { distribution: 'exponential', n: 30 },
      show: { histogram: true, normalCurve: true },
      annotation: { text: '样本均值→正态', position: 'bottom' },
    },
  },
  {
    lineId: 'different-distributions-4',
    sectionId: 'different-distributions',
    scene: { id: 'dd-universal', type: 'animation' },
    lineState: {
      show: { histogram: true, normalCurve: true },
      annotation: { text: '普适性', position: 'bottom' },
    },
  },

  // ========== parameters 段落 (4行) ==========
  {
    lineId: 'parameters-1',
    sectionId: 'parameters',
    scene: { id: 'param-intro', type: 'animation' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '样本均值的参数', position: 'top' },
    },
  },
  {
    lineId: 'parameters-2',
    sectionId: 'parameters',
    scene: { id: 'param-mean', type: 'formula' },
    lineState: {
      show: { histogram: true, formula: true },
      annotation: { text: 'E(X̄)=μ', position: 'bottom' },
    },
  },
  {
    lineId: 'parameters-3',
    sectionId: 'parameters',
    scene: { id: 'param-std', type: 'formula' },
    lineState: {
      show: { histogram: true, formula: true },
      annotation: { text: 'σ(X̄)=σ/√n', position: 'bottom' },
    },
  },
  {
    lineId: 'parameters-4',
    sectionId: 'parameters',
    scene: { id: 'param-imply', type: 'animation' },
    lineState: {
      show: { histogram: true },
      annotation: { text: 'n越大波动越小', position: 'bottom' },
    },
  },

  // ========== sample-size 段落 (4行) ==========
  {
    lineId: 'sample-size-1',
    sectionId: 'sample-size',
    scene: { id: 'ss-impact', type: 'animation' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '样本量的影响', position: 'top' },
    },
  },
  {
    lineId: 'sample-size-2',
    sectionId: 'sample-size',
    scene: { id: 'ss-30', type: 'animation' },
    lineState: {
      params: { n: 30 },
      show: { histogram: true, normalCurve: true },
      annotation: { text: 'n>30 近似很好', position: 'bottom' },
    },
  },
  {
    lineId: 'sample-size-3',
    sectionId: 'sample-size',
    scene: { id: 'ss-normal', type: 'animation' },
    lineState: {
      params: { distribution: 'normal', n: 10 },
      show: { histogram: true, normalCurve: true },
      annotation: { text: '原始正态→小n足够', position: 'bottom' },
    },
  },
  {
    lineId: 'sample-size-4',
    sectionId: 'sample-size',
    scene: { id: 'ss-skew', type: 'animation' },
    lineState: {
      params: { distribution: 'exponential', n: 50 },
      show: { histogram: true },
      annotation: { text: '偏斜分布→需更大n', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-base', type: 'application' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '统计推断基础', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-ci', type: 'application' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '置信区间', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-qc', type: 'application' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '质量控制', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-poll', type: 'application' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '民意调查', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { histogram: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-thm', type: 'animation' },
    lineState: {
      show: { histogram: true, normalCurve: true },
      annotation: { text: '样本均值→正态', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-any', type: 'animation' },
    lineState: {
      show: { histogram: true },
      annotation: { text: '与原始分布无关', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-why', type: 'animation' },
    lineState: {
      show: { histogram: true, normalCurve: true },
      annotation: { text: '解释正态分布普遍性', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { histogram: false },
      annotation: { text: '更直观理解中心极限定理！', position: 'bottom' },
    },
  },
]
