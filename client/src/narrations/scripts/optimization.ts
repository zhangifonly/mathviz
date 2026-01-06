import type { NarrationScript } from '../types'

/**
 * 优化实验 - 口播稿件
 *
 * 核心概念：函数极值与约束优化
 * 目标受众：大学本科生，有基础微积分知识
 */
export const optimizationNarration: NarrationScript = {
  id: 'optimization',
  title: '优化',
  subtitle: '探索函数极值与约束优化',
  difficulty: 'advanced',
  targetAge: '大学本科',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解优化问题的基本框架',
    '掌握无约束优化的方法',
    '了解约束优化和拉格朗日乘数法',
    '认识优化在实际中的应用',
  ],

  prerequisites: [
    '多元微积分',
    '偏导数和梯度',
    '基础线性代数',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到优化实验。',
        },
        {
          id: 'intro-2',
          text: '生活中我们经常面临优化问题：如何用最少的成本获得最大的收益？',
        },
        {
          id: 'intro-3',
          text: '如何规划最短的路线？如何分配有限的资源？',
        },
        {
          id: 'intro-4',
          text: '数学优化为这些问题提供了系统的解决方法。',
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
          text: '优化问题的目标是找到使某个函数取得最大或最小值的点。',
        },
        {
          id: 'concept-2',
          text: '这个函数叫做目标函数，要找的点叫做最优解。',
        },
        {
          id: 'concept-3',
          text: '如果没有限制条件，叫做无约束优化；有限制条件，叫做约束优化。',
        },
        {
          id: 'concept-4',
          text: '让我们从最简单的情况开始。',
        },
      ],
    },
    {
      id: 'unconstrained',
      type: 'animation',
      title: '无约束优化',
      lines: [
        {
          id: 'uncon-1',
          text: '对于光滑函数，极值点处的梯度为零。',
        },
        {
          id: 'uncon-2',
          text: '这给了我们寻找极值的方向：沿着梯度下降。',
        },
        {
          id: 'uncon-3',
          text: '梯度下降法就是不断沿着负梯度方向移动。',
        },
        {
          id: 'uncon-4',
          text: '观察点如何逐步接近函数的最小值。',
        },
      ],
    },
    {
      id: 'constrained',
      type: 'concept',
      title: '约束优化',
      lines: [
        {
          id: 'con-1',
          text: '现实中的优化问题通常有约束条件。',
        },
        {
          id: 'con-2',
          text: '比如预算有限、资源有限、时间有限。',
        },
        {
          id: 'con-3',
          text: '拉格朗日乘数法是处理等式约束的经典方法。',
        },
        {
          id: 'con-4',
          text: '它把约束优化转化为无约束优化问题。',
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
          text: '优化在现代社会无处不在。',
        },
        {
          id: 'app-2',
          text: '物流公司用它来规划配送路线。',
        },
        {
          id: 'app-3',
          text: '金融机构用它来构建投资组合。',
        },
        {
          id: 'app-4',
          text: '机器学习的训练过程本质上就是一个优化问题。',
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
          text: '今天我们探索了优化的基本概念和方法。',
        },
        {
          id: 'sum-2',
          text: '从无约束到约束优化，数学提供了强大的工具。',
        },
        {
          id: 'sum-3',
          text: '优化思维是解决实际问题的重要能力。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你建立优化的数学直觉。',
        },
      ],
    },
  ],
}
