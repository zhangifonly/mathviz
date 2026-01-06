import type { NarrationScript } from '../types'

/**
 * 牛顿法实验 - 口播稿件
 *
 * 核心概念：迭代求根方法
 * 目标受众：大学本科生，有基础微积分知识
 */
export const newtonMethodNarration: NarrationScript = {
  id: 'newton-method',
  title: '牛顿法',
  subtitle: '探索迭代求根的数学方法',
  difficulty: 'intermediate',
  targetAge: '大学本科',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解牛顿法的几何意义',
    '掌握迭代公式的推导',
    '观察收敛速度和失败情况',
    '了解牛顿法的应用',
  ],

  prerequisites: [
    '导数的概念',
    '切线方程',
    '基础微积分知识',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到牛顿法实验。',
        },
        {
          id: 'intro-2',
          text: '如何求解方程f(x)=0？对于简单的方程，我们可以用代数方法。',
        },
        {
          id: 'intro-3',
          text: '但对于复杂的方程，比如x的五次方加x等于1，代数方法就无能为力了。',
        },
        {
          id: 'intro-4',
          text: '牛顿法提供了一种强大的数值求解方法。',
        },
      ],
    },
    {
      id: 'concept',
      type: 'concept',
      title: '核心概念',
      lines: [
        {
          id: 'concept-1',
          text: '牛顿法的核心思想是用切线来逼近曲线。',
        },
        {
          id: 'concept-2',
          text: '从一个初始猜测开始，画出该点的切线。',
        },
        {
          id: 'concept-3',
          text: '切线与x轴的交点就是下一个更好的近似。',
        },
        {
          id: 'concept-4',
          text: '重复这个过程，通常能快速收敛到真正的根。',
        },
      ],
    },
    {
      id: 'visualization',
      type: 'animation',
      title: '几何演示',
      lines: [
        {
          id: 'vis-1',
          text: '让我们在图上观察牛顿法的迭代过程。',
        },
        {
          id: 'vis-2',
          text: '红点是当前的近似值，蓝线是该点的切线。',
        },
        {
          id: 'vis-3',
          text: '切线与x轴的交点成为新的近似值。',
        },
        {
          id: 'vis-4',
          text: '注意每次迭代后，近似值如何快速接近真正的根。',
        },
      ],
    },
    {
      id: 'convergence',
      type: 'concept',
      title: '收敛性',
      lines: [
        {
          id: 'conv-1',
          text: '牛顿法的收敛速度是二次的，非常快。',
        },
        {
          id: 'conv-2',
          text: '这意味着每次迭代，正确的位数大约翻倍。',
        },
        {
          id: 'conv-3',
          text: '但牛顿法也可能失败：如果初始点选得不好，可能不收敛。',
        },
        {
          id: 'conv-4',
          text: '在导数为零的点附近，牛顿法也会出问题。',
        },
      ],
    },
    {
      id: 'application',
      type: 'application',
      title: '实际应用',
      lines: [
        {
          id: 'app-1',
          text: '牛顿法是数值计算中最重要的算法之一。',
        },
        {
          id: 'app-2',
          text: '计算器和计算机用它来计算平方根和其他函数。',
        },
        {
          id: 'app-3',
          text: '优化问题中，它用于寻找函数的极值点。',
        },
        {
          id: 'app-4',
          text: '机器学习中的许多优化算法都是牛顿法的变体。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      lines: [
        {
          id: 'sum-1',
          text: '今天我们探索了牛顿法的原理和应用。',
        },
        {
          id: 'sum-2',
          text: '它用切线逼近的思想，实现了快速的迭代求根。',
        },
        {
          id: 'sum-3',
          text: '虽然不是万能的，但在大多数情况下非常有效。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你理解迭代算法的威力。',
        },
      ],
    },
  ],
}
