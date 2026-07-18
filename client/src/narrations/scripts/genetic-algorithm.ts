import type { NarrationScript } from '../types'

/**
 * 遗传算法 - 口播稿件
 * 核心概念：模拟进化、适应度、选择交叉变异、种群收敛
 * 目标受众：高中及以上
 */
export const geneticAlgorithmNarration: NarrationScript = {
  id: 'genetic-algorithm',
  title: '遗传算法',
  subtitle: '选择交叉变异进化',
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
    '理解遗传算法如何模拟生物进化求解',
    '认识适应度、选择、交叉、变异四个核心机制',
    '观察种群如何一代代向全局最优收敛',
    '了解它在真实优化问题中的应用',
  ],

  prerequisites: ['了解函数与最大值', '了解概率的基本概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '大自然用亿万年的进化，造出了无数精巧的生命。' },
        { id: 'intro-2', text: '优胜劣汰，适者生存，这背后其实是一种强大的搜索算法。' },
        { id: 'intro-3', text: '如果让计算机也来模拟进化，它能替我们找到问题的最优解吗？' },
        { id: 'intro-4', text: '这就是遗传算法，一种向生命学来的优化方法。' },
      ],
    },
    {
      id: 'fitness',
      type: 'concept',
      title: '适应度',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '我们要在一条起伏的地形上，找到最高的那座山峰。' },
        { id: 'def-2', text: '每个候选解就是一个个体，它所在的高度就是它的适应度。' },
        { id: 'def-3', text: '适应度越高，代表这个解越好，越值得被保留。' },
      ],
    },
    {
      id: 'operators',
      type: 'concept',
      title: '选择交叉变异',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'op-1', text: '选择：适应度高的个体，更有机会成为下一代的父母。' },
        { id: 'op-2', text: '交叉：两个父母的解相互组合，孕育出新的后代。' },
        { id: 'op-3', text: '变异：以小概率随机扰动，让种群不至于陷入局部山头。' },
      ],
    },
    {
      id: 'converge',
      type: 'concept',
      title: '种群收敛',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'con-1', text: '一代又一代，散落各处的个体渐渐聚拢到最高的山峰。' },
        { id: 'con-2', text: '历代最优的曲线稳步上升，最终逼近全局最优值。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击进化一代，看粉色的个体如何一步步向金色最优点聚集。' },
        { id: 'int-2', text: '换一批初始种群，进化的路径每次都不尽相同，却殊途同归。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '遗传算法用选择、交叉、变异，模拟进化来搜索最优解。' },
        { id: 'sum-2', text: '它不依赖导数，尤其擅长复杂难解的优化问题。' },
        { id: 'sum-3', text: '让种群替我们进化出答案，这份来自生命的智慧，我们下次再见！' },
      ],
    },
  ],
}
