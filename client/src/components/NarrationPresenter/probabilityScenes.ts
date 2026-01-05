/**
 * 概率分布讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 38 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const defaultProbabilityState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

// 场景配置 - 每行口播对应一个场景
export const probabilityScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: {
      show: { chart: false, formula: false, stats: false },
    },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-concept', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '概率分布=结果的可能性', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-examples', type: 'illustration' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '考试成绩、天气、股票价格...', position: 'bottom' },
    },
  },

  // ========== normal 段落 (5行) ==========
  {
    lineId: 'normal-1',
    sectionId: 'normal',
    scene: { id: 'normal-intro', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '正态分布(高斯分布)', position: 'top' },
    },
  },
  {
    lineId: 'normal-2',
    sectionId: 'normal',
    scene: { id: 'normal-params', type: 'formula' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: true, stats: false },
      annotation: { text: 'μ=中心位置，σ=分散程度', position: 'bottom' },
    },
  },
  {
    lineId: 'normal-3',
    sectionId: 'normal',
    scene: { id: 'normal-effect', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 2, sigma: 2 },
      show: { chart: true, formula: true, stats: false },
      highlight: ['mu', 'sigma'],
      annotation: { text: 'μ大→右移，σ大→宽矮', position: 'bottom' },
    },
  },
  {
    lineId: 'normal-4',
    sectionId: 'normal',
    scene: { id: 'normal-examples', type: 'illustration' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '身高、考试成绩服从正态分布', position: 'bottom' },
    },
  },
  {
    lineId: 'normal-5',
    sectionId: 'normal',
    scene: { id: 'normal-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: true, stats: true },
      annotation: { text: '调整μ和σ观察变化', position: 'bottom' },
    },
  },

  // ========== uniform 段落 (4行) ==========
  {
    lineId: 'uniform-1',
    sectionId: 'uniform',
    scene: { id: 'uniform-intro', type: 'animation' },
    lineState: {
      params: { distributionType: 'uniform', a: 0, b: 1 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '均匀分布=等概率', position: 'top' },
    },
  },
  {
    lineId: 'uniform-2',
    sectionId: 'uniform',
    scene: { id: 'uniform-shape', type: 'animation' },
    lineState: {
      params: { distributionType: 'uniform', a: 0, b: 1 },
      show: { chart: true, formula: true, stats: false },
      annotation: { text: '图像是矩形，高=1/(b-a)', position: 'bottom' },
    },
  },
  {
    lineId: 'uniform-3',
    sectionId: 'uniform',
    scene: { id: 'uniform-dice', type: 'illustration' },
    lineState: {
      params: { distributionType: 'uniform', a: 1, b: 6 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '掷骰子：每点概率=1/6', position: 'bottom' },
    },
  },
  {
    lineId: 'uniform-4',
    sectionId: 'uniform',
    scene: { id: 'uniform-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { distributionType: 'uniform', a: 0, b: 5 },
      show: { chart: true, formula: true, stats: true },
      annotation: { text: '调整上下界改变范围', position: 'bottom' },
    },
  },

  // ========== exponential 段落 (4行) ==========
  {
    lineId: 'exponential-1',
    sectionId: 'exponential',
    scene: { id: 'exp-intro', type: 'animation' },
    lineState: {
      params: { distributionType: 'exponential', lambda: 1 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '指数分布=时间间隔', position: 'top' },
    },
  },
  {
    lineId: 'exponential-2',
    sectionId: 'exponential',
    scene: { id: 'exp-examples', type: 'illustration' },
    lineState: {
      params: { distributionType: 'exponential', lambda: 1 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '顾客到达、设备故障间隔', position: 'bottom' },
    },
  },
  {
    lineId: 'exponential-3',
    sectionId: 'exponential',
    scene: { id: 'exp-lambda', type: 'animation' },
    lineState: {
      params: { distributionType: 'exponential', lambda: 2 },
      show: { chart: true, formula: true, stats: false },
      highlight: ['lambda'],
      annotation: { text: 'λ大→事件频繁→曲线陡', position: 'bottom' },
    },
  },
  {
    lineId: 'exponential-4',
    sectionId: 'exponential',
    scene: { id: 'exp-memoryless', type: 'animation' },
    lineState: {
      params: { distributionType: 'exponential', lambda: 1 },
      show: { chart: true, formula: true, stats: true },
      annotation: { text: '无记忆性：过去不影响未来', position: 'bottom' },
    },
  },

  // ========== poisson 段落 (4行) ==========
  {
    lineId: 'poisson-1',
    sectionId: 'poisson',
    scene: { id: 'poisson-intro', type: 'animation' },
    lineState: {
      params: { distributionType: 'poisson', lambda: 3 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '泊松分布=事件发生次数', position: 'top' },
    },
  },
  {
    lineId: 'poisson-2',
    sectionId: 'poisson',
    scene: { id: 'poisson-examples', type: 'illustration' },
    lineState: {
      params: { distributionType: 'poisson', lambda: 3 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '电话数、交通事故数', position: 'bottom' },
    },
  },
  {
    lineId: 'poisson-3',
    sectionId: 'poisson',
    scene: { id: 'poisson-discrete', type: 'animation' },
    lineState: {
      params: { distributionType: 'poisson', lambda: 3 },
      show: { chart: true, formula: true, stats: false },
      annotation: { text: '离散分布，只取整数，柱状图', position: 'bottom' },
    },
  },
  {
    lineId: 'poisson-4',
    sectionId: 'poisson',
    scene: { id: 'poisson-lambda', type: 'animation' },
    lineState: {
      params: { distributionType: 'poisson', lambda: 10 },
      show: { chart: true, formula: true, stats: true },
      highlight: ['lambda'],
      annotation: { text: 'λ大→右移→近似正态', position: 'bottom' },
    },
  },

  // ========== binomial 段落 (5行) ==========
  {
    lineId: 'binomial-1',
    sectionId: 'binomial',
    scene: { id: 'binomial-intro', type: 'animation' },
    lineState: {
      params: { distributionType: 'binomial', n: 10, p: 0.5 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '二项分布=成功次数', position: 'top' },
    },
  },
  {
    lineId: 'binomial-2',
    sectionId: 'binomial',
    scene: { id: 'binomial-coin', type: 'illustration' },
    lineState: {
      params: { distributionType: 'binomial', n: 10, p: 0.5 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '抛10次硬币正面次数', position: 'bottom' },
    },
  },
  {
    lineId: 'binomial-3',
    sectionId: 'binomial',
    scene: { id: 'binomial-params', type: 'formula' },
    lineState: {
      params: { distributionType: 'binomial', n: 10, p: 0.5 },
      show: { chart: true, formula: true, stats: false },
      annotation: { text: 'n=试验次数，p=成功概率', position: 'bottom' },
    },
  },
  {
    lineId: 'binomial-4',
    sectionId: 'binomial',
    scene: { id: 'binomial-symmetry', type: 'animation' },
    lineState: {
      params: { distributionType: 'binomial', n: 10, p: 0.3 },
      show: { chart: true, formula: true, stats: false },
      highlight: ['p'],
      annotation: { text: 'p=0.5对称，偏离则偏斜', position: 'bottom' },
    },
  },
  {
    lineId: 'binomial-5',
    sectionId: 'binomial',
    scene: { id: 'binomial-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { distributionType: 'binomial', n: 20, p: 0.5 },
      show: { chart: true, formula: true, stats: true },
      annotation: { text: '调整n和p观察变化', position: 'bottom' },
    },
  },

  // ========== statistics 段落 (5行) ==========
  {
    lineId: 'statistics-1',
    sectionId: 'statistics',
    scene: { id: 'stats-intro', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: false, stats: true },
      annotation: { text: '数字特征：期望和方差', position: 'top' },
    },
  },
  {
    lineId: 'statistics-2',
    sectionId: 'statistics',
    scene: { id: 'stats-expectation', type: 'formula' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: true, stats: true },
      highlight: ['expectation'],
      annotation: { text: 'E(X)=中心位置=平均值', position: 'bottom' },
    },
  },
  {
    lineId: 'statistics-3',
    sectionId: 'statistics',
    scene: { id: 'stats-variance', type: 'formula' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 2 },
      show: { chart: true, formula: true, stats: true },
      highlight: ['variance'],
      annotation: { text: 'Var(X)=分散程度', position: 'bottom' },
    },
  },
  {
    lineId: 'statistics-4',
    sectionId: 'statistics',
    scene: { id: 'stats-std', type: 'formula' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: true, stats: true },
      highlight: ['std'],
      annotation: { text: '标准差=√方差，单位相同', position: 'bottom' },
    },
  },
  {
    lineId: 'statistics-5',
    sectionId: 'statistics',
    scene: { id: 'stats-panel', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: true, stats: true },
      annotation: { text: '右侧面板显示数字特征', position: 'bottom' },
    },
  },

  // ========== animation 段落 (3行) ==========
  {
    lineId: 'animation-1',
    sectionId: 'animation',
    scene: { id: 'anim-button', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1, isAnimating: false },
      show: { chart: true, formula: true, stats: true },
      annotation: { text: '点击播放动画按钮', position: 'top' },
    },
  },
  {
    lineId: 'animation-2',
    sectionId: 'animation',
    scene: { id: 'anim-normal', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1, isAnimating: true },
      show: { chart: true, formula: true, stats: true },
      annotation: { text: '正态分布：σ从小到大', position: 'bottom' },
    },
  },
  {
    lineId: 'animation-3',
    sectionId: 'animation',
    scene: { id: 'anim-area', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 2, isAnimating: true },
      show: { chart: true, formula: true, stats: true },
      highlight: ['area'],
      annotation: { text: '窄高→宽矮，面积始终=1', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { chart: false, formula: false, stats: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-types', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: false, stats: false },
      annotation: { text: '连续分布和离散分布', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-common', type: 'animation' },
    lineState: {
      params: { distributionType: 'binomial', n: 10, p: 0.5 },
      show: { chart: true, formula: true, stats: false },
      annotation: { text: '正态、泊松、二项分布', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-features', type: 'animation' },
    lineState: {
      params: { distributionType: 'normal', mu: 0, sigma: 1 },
      show: { chart: true, formula: true, stats: true },
      annotation: { text: '期望和方差是关键特征', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { chart: false, formula: false, stats: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
