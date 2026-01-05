/**
 * 数论可视化讲解场景配置
 * 每句口播对应精确的动画状态
 * 共 45 行口播
 */

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const defaultNumberTheoryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

// 场景配置 - 每行口播对应一个场景
export const numberTheoryScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: {
      show: { grid: false, chart: false, spiral: false },
    },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-what', type: 'title' },
    lineState: {
      show: { grid: false, chart: false, spiral: false },
      annotation: { text: '数论=研究整数的数学', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-topics', type: 'title' },
    lineState: {
      show: { grid: false, chart: false, spiral: false },
      annotation: { text: '素数、猜想、螺旋', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-start', type: 'title' },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
    },
  },

  // ========== primes 段落 (5行) ==========
  {
    lineId: 'prime-1',
    sectionId: 'primes',
    scene: { id: 'prime-def', type: 'animation' },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      annotation: { text: '素数=只能被1和自己整除', position: 'top' },
    },
  },
  {
    lineId: 'prime-2',
    sectionId: 'primes',
    scene: { id: 'prime-examples', type: 'animation' },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      highlight: ['primes'],
      annotation: { text: '2, 3, 5, 7, 11, 13...', position: 'bottom' },
    },
  },
  {
    lineId: 'prime-3',
    sectionId: 'primes',
    scene: { id: 'prime-two', type: 'animation' },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      highlight: ['2'],
      annotation: { text: '2是唯一的偶数素数', position: 'bottom' },
    },
  },
  {
    lineId: 'prime-4',
    sectionId: 'primes',
    scene: { id: 'prime-one', type: 'animation' },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      highlight: ['1'],
      annotation: { text: '1不是素数', position: 'bottom' },
    },
  },
  {
    lineId: 'prime-5',
    sectionId: 'primes',
    scene: { id: 'prime-atoms', type: 'animation' },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      annotation: { text: '素数=数字的"原子"', position: 'bottom' },
    },
  },

  // ========== sieve 段落 (5行) ==========
  {
    lineId: 'sieve-1',
    sectionId: 'sieve',
    scene: { id: 'sieve-intro', type: 'animation' },
    lineState: {
      params: { topic: 'sieve', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      annotation: { text: '埃拉托斯特尼筛法', position: 'top' },
    },
  },
  {
    lineId: 'sieve-2',
    sectionId: 'sieve',
    scene: { id: 'sieve-one', type: 'animation' },
    lineState: {
      params: { topic: 'sieve', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      highlight: ['1'],
      annotation: { text: '步骤1: 划掉1', position: 'bottom' },
    },
  },
  {
    lineId: 'sieve-3',
    sectionId: 'sieve',
    scene: { id: 'sieve-two', type: 'animation' },
    lineState: {
      params: { topic: 'sieve', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      highlight: ['multiples-2'],
      annotation: { text: '步骤2: 划掉2的倍数', position: 'bottom' },
    },
  },
  {
    lineId: 'sieve-4',
    sectionId: 'sieve',
    scene: { id: 'sieve-three', type: 'animation' },
    lineState: {
      params: { topic: 'sieve', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      highlight: ['multiples-3'],
      annotation: { text: '步骤3: 划掉3的倍数', position: 'bottom' },
    },
  },
  {
    lineId: 'sieve-5',
    sectionId: 'sieve',
    scene: { id: 'sieve-result', type: 'animation' },
    lineState: {
      params: { topic: 'sieve', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      highlight: ['primes'],
      annotation: { text: '绿色=素数！', position: 'bottom' },
    },
  },

  // ========== distribution 段落 (5行) ==========
  {
    lineId: 'dist-1',
    sectionId: 'distribution',
    scene: { id: 'dist-chart', type: 'animation' },
    lineState: {
      params: { topic: 'primes', maxN: 200 },
      show: { grid: false, chart: true, spiral: false },
      annotation: { text: '素数分布图', position: 'top' },
    },
  },
  {
    lineId: 'dist-2',
    sectionId: 'distribution',
    scene: { id: 'dist-count', type: 'animation' },
    lineState: {
      params: { topic: 'primes', maxN: 200 },
      show: { grid: false, chart: true, spiral: false },
      highlight: ['countLine'],
      annotation: { text: '蓝线=素数计数π(x)', position: 'bottom' },
    },
  },
  {
    lineId: 'dist-3',
    sectionId: 'distribution',
    scene: { id: 'dist-approx', type: 'formula' },
    lineState: {
      params: { topic: 'primes', maxN: 200 },
      show: { grid: false, chart: true, spiral: false, formula: true },
      highlight: ['approxLine'],
      annotation: { text: '红线≈x/ln(x)', position: 'bottom' },
    },
  },
  {
    lineId: 'dist-4',
    sectionId: 'distribution',
    scene: { id: 'dist-theorem', type: 'formula' },
    lineState: {
      params: { topic: 'primes', maxN: 500 },
      show: { grid: false, chart: true, spiral: false, formula: true },
      annotation: { text: '素数定理：两线越来越近', position: 'bottom' },
    },
  },
  {
    lineId: 'dist-5',
    sectionId: 'distribution',
    scene: { id: 'dist-pattern', type: 'animation' },
    lineState: {
      params: { topic: 'primes', maxN: 500 },
      show: { grid: false, chart: true, spiral: false },
      annotation: { text: '素数有规律可循', position: 'bottom' },
    },
  },

  // ========== collatz 段落 (5行) ==========
  {
    lineId: 'coll-1',
    sectionId: 'collatz',
    scene: { id: 'coll-intro', type: 'animation' },
    lineState: {
      params: { topic: 'collatz', collatzStart: 27 },
      show: { grid: false, chart: false, spiral: false, sequence: true },
      annotation: { text: 'Collatz猜想(3n+1问题)', position: 'top' },
    },
  },
  {
    lineId: 'coll-2',
    sectionId: 'collatz',
    scene: { id: 'coll-rule', type: 'formula' },
    lineState: {
      params: { topic: 'collatz', collatzStart: 27 },
      show: { grid: false, chart: false, spiral: false, sequence: true, formula: true },
      annotation: { text: '偶数÷2，奇数×3+1', position: 'bottom' },
    },
  },
  {
    lineId: 'coll-3',
    sectionId: 'collatz',
    scene: { id: 'coll-example', type: 'animation' },
    lineState: {
      params: { topic: 'collatz', collatzStart: 27 },
      show: { grid: false, chart: false, spiral: false, sequence: true },
      highlight: ['sequence'],
      annotation: { text: '27→82→41→...', position: 'bottom' },
    },
  },
  {
    lineId: 'coll-4',
    sectionId: 'collatz',
    scene: { id: 'coll-conjecture', type: 'animation' },
    lineState: {
      params: { topic: 'collatz', collatzStart: 27 },
      show: { grid: false, chart: false, spiral: false, sequence: true },
      annotation: { text: '猜想：最终都到达1', position: 'bottom' },
    },
  },
  {
    lineId: 'coll-5',
    sectionId: 'collatz',
    scene: { id: 'coll-unsolved', type: 'animation' },
    lineState: {
      params: { topic: 'collatz', collatzStart: 27 },
      show: { grid: false, chart: false, spiral: false, sequence: true },
      annotation: { text: '至今未证明！', position: 'bottom' },
    },
  },

  // ========== ulam 段落 (5行) ==========
  {
    lineId: 'ulam-1',
    sectionId: 'ulam',
    scene: { id: 'ulam-intro', type: 'animation' },
    lineState: {
      params: { topic: 'ulam', ulamSize: 51 },
      show: { grid: false, chart: false, spiral: true },
      annotation: { text: 'Ulam螺旋', position: 'top' },
    },
  },
  {
    lineId: 'ulam-2',
    sectionId: 'ulam',
    scene: { id: 'ulam-spiral', type: 'animation' },
    lineState: {
      params: { topic: 'ulam', ulamSize: 51 },
      show: { grid: false, chart: false, spiral: true },
      highlight: ['center'],
      annotation: { text: '1在中心，螺旋排列', position: 'bottom' },
    },
  },
  {
    lineId: 'ulam-3',
    sectionId: 'ulam',
    scene: { id: 'ulam-primes', type: 'animation' },
    lineState: {
      params: { topic: 'ulam', ulamSize: 51 },
      show: { grid: false, chart: false, spiral: true },
      highlight: ['primes'],
      annotation: { text: '绿色=素数', position: 'bottom' },
    },
  },
  {
    lineId: 'ulam-4',
    sectionId: 'ulam',
    scene: { id: 'ulam-diagonal', type: 'animation' },
    lineState: {
      params: { topic: 'ulam', ulamSize: 101 },
      show: { grid: false, chart: false, spiral: true },
      highlight: ['diagonals'],
      annotation: { text: '素数排成对角线！', position: 'bottom' },
    },
  },
  {
    lineId: 'ulam-5',
    sectionId: 'ulam',
    scene: { id: 'ulam-history', type: 'animation' },
    lineState: {
      params: { topic: 'ulam', ulamSize: 101 },
      show: { grid: false, chart: false, spiral: true },
      annotation: { text: '乌拉姆开会时发现的规律', position: 'bottom' },
    },
  },

  // ========== parameters 段落 (5行) ==========
  {
    lineId: 'param-1',
    sectionId: 'parameters',
    scene: { id: 'param-intro', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      annotation: { text: '轮到你了！', position: 'top' },
    },
  },
  {
    lineId: 'param-2',
    sectionId: 'parameters',
    scene: { id: 'param-topic', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { topic: 'sieve', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      annotation: { text: '选择不同主题', position: 'bottom' },
    },
  },
  {
    lineId: 'param-3',
    sectionId: 'parameters',
    scene: { id: 'param-max', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { topic: 'primes', maxN: 200 },
      show: { grid: true, chart: true, spiral: false },
      annotation: { text: '调整最大值N', position: 'bottom' },
    },
  },
  {
    lineId: 'param-4',
    sectionId: 'parameters',
    scene: { id: 'param-collatz', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { topic: 'collatz', collatzStart: 15 },
      show: { grid: false, chart: false, spiral: false, sequence: true },
      annotation: { text: '试试不同起始值', position: 'bottom' },
    },
  },
  {
    lineId: 'param-5',
    sectionId: 'parameters',
    scene: { id: 'param-ulam', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { topic: 'ulam', ulamSize: 101 },
      show: { grid: false, chart: false, spiral: true },
      annotation: { text: '调整螺旋大小', position: 'bottom' },
    },
  },

  // ========== mysteries 段落 (5行) ==========
  {
    lineId: 'myst-1',
    sectionId: 'mysteries',
    scene: { id: 'myst-intro', type: 'application' },
    lineState: {
      show: { grid: false, chart: false, spiral: false },
      annotation: { text: '数论未解之谜', position: 'top' },
    },
  },
  {
    lineId: 'myst-2',
    sectionId: 'mysteries',
    scene: { id: 'myst-twin', type: 'application' },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      highlight: ['twin-primes'],
      annotation: { text: '孪生素数：11和13', position: 'bottom' },
    },
  },
  {
    lineId: 'myst-3',
    sectionId: 'mysteries',
    scene: { id: 'myst-goldbach', type: 'application' },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      annotation: { text: '哥德巴赫猜想', position: 'bottom' },
    },
  },
  {
    lineId: 'myst-4',
    sectionId: 'mysteries',
    scene: { id: 'myst-riemann', type: 'application' },
    lineState: {
      params: { topic: 'primes', maxN: 500 },
      show: { grid: false, chart: true, spiral: false },
      annotation: { text: '黎曼猜想：百万美元悬赏', position: 'bottom' },
    },
  },
  {
    lineId: 'myst-5',
    sectionId: 'mysteries',
    scene: { id: 'myst-future', type: 'application' },
    lineState: {
      show: { grid: false, chart: false, spiral: false },
      annotation: { text: '也许你就是解谜者！', position: 'bottom' },
    },
  },

  // ========== summary 段落 (6行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { grid: false, chart: false, spiral: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-primes', type: 'animation' },
    lineState: {
      params: { topic: 'primes', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      highlight: ['primes'],
      annotation: { text: '素数=数字的原子', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-sieve', type: 'animation' },
    lineState: {
      params: { topic: 'sieve', maxN: 100 },
      show: { grid: true, chart: false, spiral: false },
      annotation: { text: '埃氏筛法找素数', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-collatz', type: 'animation' },
    lineState: {
      params: { topic: 'collatz', collatzStart: 27 },
      show: { grid: false, chart: false, spiral: false, sequence: true },
      annotation: { text: 'Collatz猜想→最终到1', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-ulam', type: 'animation' },
    lineState: {
      params: { topic: 'ulam', ulamSize: 101 },
      show: { grid: false, chart: false, spiral: true },
      annotation: { text: 'Ulam螺旋的对角线', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-6',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { grid: false, chart: false, spiral: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
