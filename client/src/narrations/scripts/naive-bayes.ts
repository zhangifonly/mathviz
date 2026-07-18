import type { NarrationScript } from '../types'

/**
 * 朴素贝叶斯 - 口播稿件
 * 核心概念：用概率做分类、贝叶斯定理、特征独立假设、高斯似然与决策边界
 * 目标受众：高中及以上
 */
export const naiveBayesNarration: NarrationScript = {
  id: 'naive-bayes',
  title: '朴素贝叶斯',
  subtitle: '特征独立假设分类',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解用概率给样本分类的基本思路',
    '掌握贝叶斯定理如何把先验与似然结合成后验',
    '认识朴素贝叶斯的特征独立假设',
    '了解高斯似然如何画出决策边界',
  ],

  prerequisites: ['了解概率与条件概率', '了解正态分布'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '桌上散落着两类样本，一类靛蓝，一类品红。' },
        { id: 'intro-2', text: '来了一个新点，它更可能属于哪一类呢？' },
        { id: 'intro-3', text: '我们不靠直觉，而是用概率来回答这个问题。' },
      ],
    },
    {
      id: 'bayes',
      type: 'concept',
      title: '贝叶斯定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '贝叶斯定理告诉我们，后验正比于先验乘以似然。' },
        { id: 'def-2', text: '先验是某一类本身出现的概率，似然是这类生成该样本的可能性。' },
        { id: 'def-3', text: '哪个类别的后验更大，我们就把样本判给谁。' },
      ],
    },
    {
      id: 'naive',
      type: 'concept',
      title: '朴素独立假设',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'naive-1', text: '样本有多个特征，联合似然本来很难估计。' },
        { id: 'naive-2', text: '朴素贝叶斯大胆假设各特征相互独立，于是似然变成逐个相乘。' },
        { id: 'naive-3', text: '假设虽然简化，效果却常常出奇地好。' },
      ],
    },
    {
      id: 'gauss',
      type: 'concept',
      title: '高斯似然与决策边界',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gauss-1', text: '连续特征上，我们用高斯分布估计每类每维的均值和方差。' },
        { id: 'gauss-2', text: '两类后验相等的地方，就连成了平面上的决策边界。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '增加样本数量，看两类的高斯等高线如何变得更贴合。' },
        { id: 'int-2', text: '移动查询点，观察它落在决策区域的哪一侧被判成哪类。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '朴素贝叶斯用贝叶斯定理，把先验与似然合成后验来分类。' },
        { id: 'sum-2', text: '特征独立假设让似然相乘，高斯似然画出优雅的决策边界。' },
        { id: 'sum-3', text: '简单的概率原则，撑起强大的分类器，我们下次再见！' },
      ],
    },
  ],
}
