import type { NarrationScript } from '../types'

/**
 * 隐马尔可夫模型 - 口播稿件
 * 核心概念：隐状态、马尔可夫链、发射观测、维特比动态规划解码
 * 目标受众：高中及以上
 */
export const hiddenMarkovNarration: NarrationScript = {
  id: 'hidden-markov',
  title: '隐马尔可夫模型',
  subtitle: '维特比解码隐藏状态',
  difficulty: 'expert',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解隐状态与可观测量的区别',
    '掌握马尔可夫链的状态转移',
    '理解发射概率如何联系隐状态与观测',
    '认识维特比算法的动态规划解码',
  ],

  prerequisites: ['了解概率', '了解条件概率'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有些事物我们无法直接看见，只能通过它留下的痕迹去猜。' },
        { id: 'intro-2', text: '比如朋友每天的活动，能不能反推出那天的天气是晴还是雨？' },
        { id: 'intro-3', text: '天气看不见，是隐藏的状态；活动看得见，是观测。' },
        { id: 'intro-4', text: '这类问题，正是隐马尔可夫模型要解决的。' },
      ],
    },
    {
      id: 'chain',
      type: 'concept',
      title: '马尔可夫链',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'chain-1', text: '隐藏的天气并非随意变化，它遵循马尔可夫链。' },
        { id: 'chain-2', text: '明天晴还是雨，只取决于今天，与更早的日子无关。' },
        { id: 'chain-3', text: '这种转移由一张转移矩阵刻画，晴更容易接着晴。' },
      ],
    },
    {
      id: 'emit',
      type: 'concept',
      title: '发射观测',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'emit-1', text: '每一天的天气，都会以一定概率引发某个活动。' },
        { id: 'emit-2', text: '晴天更爱散步，雨天更常打扫，这叫发射概率。' },
        { id: 'emit-3', text: '于是隐藏的天气链，投射出一串我们能看见的活动。' },
      ],
    },
    {
      id: 'viterbi',
      type: 'concept',
      title: '维特比解码',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'vit-1', text: '反过来，给定活动序列，哪条天气路径最有可能？' },
        { id: 'vit-2', text: '维特比算法用动态规划，逐列记录到每个状态的最优路径。' },
        { id: 'vit-3', text: '最后从终点回溯，就得到全局最可能的隐状态序列。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '生成一段序列，对比真实天气与维特比的解码结果。' },
        { id: 'int-2', text: '换个长度或重新随机，看看解码准确率如何变化。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '隐马尔可夫模型用隐状态链加发射概率，解释可观测的序列。' },
        { id: 'sum-2', text: '维特比算法则用动态规划，从观测反推最可能的隐藏路径。' },
        { id: 'sum-3', text: '看不见的，也能被数学照亮，我们下次再见！' },
      ],
    },
  ],
}
