import type { NarrationScript } from '../types'

/**
 * 布朗运动 - 口播稿件
 * 核心概念：高斯随机增量、方差随时间线性增长、连续处处不可导
 * 目标受众：高中及以上
 */
export const brownianMotionNarration: NarrationScript = {
  id: 'brownian-motion',
  title: '布朗运动',
  subtitle: '连续随机漫步',
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
    '理解布朗运动由独立高斯增量累加而成',
    '认识位置方差随时间线性增长的规律',
    '感受轨迹连续却处处不可导的奇特性质',
    '了解它在物理与金融中的广泛应用',
  ],

  prerequisites: ['了解随机与概率', '了解正态分布'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '1827年，植物学家布朗透过显微镜，看见水中的花粉不停颤动。' },
        { id: 'intro-2', text: '它们没有生命，却像着了魔一样，永不停歇地随机舞动。' },
        { id: 'intro-3', text: '这背后是无数看不见的水分子，在四面八方撞击它。' },
      ],
    },
    {
      id: 'increment',
      type: 'concept',
      title: '随机增量',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'inc-1', text: '我们把这种运动理解成一步步的随机漫步。' },
        { id: 'inc-2', text: '每一步的位移，是一个均值为零的高斯随机数。' },
        { id: 'inc-3', text: '把这些独立的增量不断累加，就画出了曲折的布朗轨迹。' },
      ],
    },
    {
      id: 'variance',
      type: 'concept',
      title: '方差随时间增长',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'var-1', text: '因为每步相互独立，位置的方差等于各步方差之和。' },
        { id: 'var-2', text: '于是方差随时间线性增长，走得越久，散得越开。' },
        { id: 'var-3', text: '典型的偏离距离，正比于时间的平方根。' },
      ],
    },
    {
      id: 'nondiff',
      type: 'concept',
      title: '连续却不可导',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'nd-1', text: '布朗轨迹是连续的，笔尖从不离开纸面。' },
        { id: 'nd-2', text: '可无论放大多少倍，它依然锯齿密布，处处求不出切线的斜率。' },
        { id: 'nd-3', text: '这就是数学中著名的：处处连续，却处处不可导。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击重新随机，每一次都生成一条独一无二的路径。' },
        { id: 'int-2', text: '在一维和二维之间切换，感受随机漫步如何铺满平面。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '布朗运动由独立的高斯增量累加而成。' },
        { id: 'sum-2', text: '它的方差随时间线性增长，轨迹连续却处处不可导。' },
        { id: 'sum-3', text: '从花粉到股价，随机之中自有规律，我们下次再见！' },
      ],
    },
  ],
}
