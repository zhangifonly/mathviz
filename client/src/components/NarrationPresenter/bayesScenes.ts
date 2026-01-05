/**
 * 贝叶斯定理讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultBayesState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const bayesScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { diagram: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-doctor', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '医生面对检测结果', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-surprise', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '答案可能让你惊讶', position: 'bottom' },
    },
  },

  // ========== conditional-prob 段落 (4行) ==========
  {
    lineId: 'conditional-prob-1',
    sectionId: 'conditional-prob',
    scene: { id: 'cp-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '条件概率', position: 'top' },
    },
  },
  {
    lineId: 'conditional-prob-2',
    sectionId: 'conditional-prob',
    scene: { id: 'cp-notation', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: 'P(A|B)', position: 'bottom' },
    },
  },
  {
    lineId: 'conditional-prob-3',
    sectionId: 'conditional-prob',
    scene: { id: 'cp-example', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'P(患病|阳性)', position: 'bottom' },
    },
  },
  {
    lineId: 'conditional-prob-4',
    sectionId: 'conditional-prob',
    scene: { id: 'cp-diff', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['formula'],
      annotation: { text: 'P(A|B)≠P(B|A)', position: 'bottom' },
    },
  },

  // ========== bayes-formula 段落 (4行) ==========
  {
    lineId: 'bayes-formula-1',
    sectionId: 'bayes-formula',
    scene: { id: 'bf-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '贝叶斯定理', position: 'top' },
    },
  },
  {
    lineId: 'bayes-formula-2',
    sectionId: 'bayes-formula',
    scene: { id: 'bf-formula', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['formula'],
      annotation: { text: 'P(A|B)=P(B|A)P(A)/P(B)', position: 'bottom' },
    },
  },
  {
    lineId: 'bayes-formula-3',
    sectionId: 'bayes-formula',
    scene: { id: 'bf-prior', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['prior'],
      annotation: { text: '先验概率 P(A)', position: 'bottom' },
    },
  },
  {
    lineId: 'bayes-formula-4',
    sectionId: 'bayes-formula',
    scene: { id: 'bf-posterior', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      highlight: ['posterior'],
      annotation: { text: '后验概率 P(A|B)', position: 'bottom' },
    },
  },

  // ========== medical-test 段落 (4行) ==========
  {
    lineId: 'medical-test-1',
    sectionId: 'medical-test',
    scene: { id: 'mt-intro', type: 'animation' },
    lineState: {
      params: { prevalence: 0.01, accuracy: 0.99 },
      show: { diagram: true },
      annotation: { text: '医学检测例子', position: 'top' },
    },
  },
  {
    lineId: 'medical-test-2',
    sectionId: 'medical-test',
    scene: { id: 'mt-setup', type: 'animation' },
    lineState: {
      params: { prevalence: 0.01, accuracy: 0.99 },
      show: { diagram: true, stats: true },
      annotation: { text: '患病率1%，准确率99%', position: 'bottom' },
    },
  },
  {
    lineId: 'medical-test-3',
    sectionId: 'medical-test',
    scene: { id: 'mt-question', type: 'animation' },
    lineState: {
      params: { prevalence: 0.01, accuracy: 0.99 },
      show: { diagram: true },
      annotation: { text: '阳性=真患病？', position: 'bottom' },
    },
  },
  {
    lineId: 'medical-test-4',
    sectionId: 'medical-test',
    scene: { id: 'mt-answer', type: 'animation' },
    lineState: {
      params: { prevalence: 0.01, accuracy: 0.99 },
      show: { diagram: true, result: true },
      highlight: ['result'],
      annotation: { text: '答案约50%！', position: 'bottom' },
    },
  },

  // ========== calculation 段落 (4行) ==========
  {
    lineId: 'calculation-1',
    sectionId: 'calculation',
    scene: { id: 'calc-start', type: 'animation' },
    lineState: {
      params: { population: 1000 },
      show: { diagram: true, calculation: true },
      annotation: { text: '用贝叶斯计算', position: 'top' },
    },
  },
  {
    lineId: 'calculation-2',
    sectionId: 'calculation',
    scene: { id: 'calc-pop', type: 'animation' },
    lineState: {
      params: { population: 1000 },
      show: { diagram: true, calculation: true },
      annotation: { text: '1000人中10人患病', position: 'bottom' },
    },
  },
  {
    lineId: 'calculation-3',
    sectionId: 'calculation',
    scene: { id: 'calc-test', type: 'animation' },
    lineState: {
      params: { population: 1000 },
      show: { diagram: true, calculation: true },
      annotation: { text: '10真阳+10假阳', position: 'bottom' },
    },
  },
  {
    lineId: 'calculation-4',
    sectionId: 'calculation',
    scene: { id: 'calc-result', type: 'formula' },
    lineState: {
      params: { population: 1000 },
      show: { diagram: true, calculation: true, formula: true },
      highlight: ['result'],
      annotation: { text: '10/20=50%', position: 'bottom' },
    },
  },

  // ========== base-rate 段落 (4行) ==========
  {
    lineId: 'base-rate-1',
    sectionId: 'base-rate',
    scene: { id: 'br-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '基础率的重要性', position: 'top' },
    },
  },
  {
    lineId: 'base-rate-2',
    sectionId: 'base-rate',
    scene: { id: 'br-explain', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '低患病率→多假阳性', position: 'bottom' },
    },
  },
  {
    lineId: 'base-rate-3',
    sectionId: 'base-rate',
    scene: { id: 'br-fallacy', type: 'animation' },
    lineState: {
      show: { diagram: true },
      highlight: ['fallacy'],
      annotation: { text: '基础率谬误', position: 'bottom' },
    },
  },
  {
    lineId: 'base-rate-4',
    sectionId: 'base-rate',
    scene: { id: 'br-help', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '贝叶斯避免错误', position: 'bottom' },
    },
  },

  // ========== interactive 段落 (4行) ==========
  {
    lineId: 'interactive-1',
    sectionId: 'interactive',
    scene: { id: 'int-adjust', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { prevalence: 0.01, accuracy: 0.99 },
      show: { diagram: true, sliders: true },
      annotation: { text: '调整参数', position: 'top' },
    },
  },
  {
    lineId: 'interactive-2',
    sectionId: 'interactive',
    scene: { id: 'int-prev', type: 'animation' },
    lineState: {
      params: { prevalence: 0.1, accuracy: 0.99 },
      show: { diagram: true },
      annotation: { text: '增加患病率', position: 'bottom' },
    },
  },
  {
    lineId: 'interactive-3',
    sectionId: 'interactive',
    scene: { id: 'int-acc', type: 'animation' },
    lineState: {
      params: { prevalence: 0.01, accuracy: 0.999 },
      show: { diagram: true },
      annotation: { text: '提高准确率', position: 'bottom' },
    },
  },
  {
    lineId: 'interactive-4',
    sectionId: 'interactive',
    scene: { id: 'int-both', type: 'animation' },
    lineState: {
      params: { prevalence: 0.1, accuracy: 0.999 },
      show: { diagram: true },
      annotation: { text: '两者都高才可靠', position: 'bottom' },
    },
  },

  // ========== applications 段落 (4行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '广泛应用', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-spam', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '垃圾邮件过滤', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-ml', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '贝叶斯分类器', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-dna', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'DNA证据解读', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-update', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '用证据更新概率', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-formula', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '先验+似然→后验', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-base', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '基础率很重要', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '更直观理解贝叶斯定理！', position: 'bottom' },
    },
  },
]
