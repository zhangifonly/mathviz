import type { NarrationScript } from '../types'

/**
 * 混沌理论实验 - 口播稿件
 *
 * 核心概念：确定性系统中的不可预测行为
 * 目标受众：大学本科生，有基础微分方程知识
 */
export const chaosNarration: NarrationScript = {
  id: 'chaos',
  title: '混沌理论',
  subtitle: '探索确定性系统中的不可预测性',
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
    '理解混沌系统的基本特征',
    '掌握蝴蝶效应的含义',
    '观察洛伦兹吸引子的形成',
    '理解初始条件敏感性',
  ],

  prerequisites: [
    '基础微分方程知识',
    '函数迭代的概念',
    '相空间的基本理解',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到混沌理论实验。',
        },
        {
          id: 'intro-2',
          text: '你是否想过，为什么天气预报超过一周就变得不准确？',
        },
        {
          id: 'intro-3',
          text: '这背后隐藏着一个深刻的数学现象：混沌。',
        },
        {
          id: 'intro-4',
          text: '混沌并不是随机，而是确定性系统中产生的看似随机的行为。',
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
          text: '混沌系统有三个关键特征：对初始条件的敏感依赖、拓扑混合性和稠密的周期轨道。',
        },
        {
          id: 'concept-2',
          text: '最著名的是蝴蝶效应：巴西的一只蝴蝶扇动翅膀，可能在德克萨斯引发龙卷风。',
        },
        {
          id: 'concept-3',
          text: '这个比喻来自气象学家洛伦兹，他在1963年发现了著名的洛伦兹吸引子。',
        },
        {
          id: 'concept-4',
          text: '让我们通过可视化来观察这个神奇的数学结构。',
        },
      ],
    },
    {
      id: 'visualization',
      type: 'animation',
      title: '洛伦兹吸引子',
      lines: [
        {
          id: 'vis-1',
          text: '屏幕上显示的是洛伦兹吸引子的三维轨迹。',
        },
        {
          id: 'vis-2',
          text: '注意它的形状像一只蝴蝶，这正是蝴蝶效应名称的另一个来源。',
        },
        {
          id: 'vis-3',
          text: '轨迹永远不会重复，但始终被限制在这个奇异吸引子内。',
        },
        {
          id: 'vis-4',
          text: '这就是混沌的本质：有界但不周期，确定但不可预测。',
        },
      ],
    },
    {
      id: 'sensitivity',
      type: 'interaction',
      title: '初始条件敏感性',
      lines: [
        {
          id: 'sens-1',
          text: '现在让我们观察两条初始位置非常接近的轨迹。',
        },
        {
          id: 'sens-2',
          text: '起初它们几乎重合，但很快就会分道扬镳。',
        },
        {
          id: 'sens-3',
          text: '这种指数级的分离速度，使得长期预测变得不可能。',
        },
        {
          id: 'sens-4',
          text: '即使我们知道精确的运动方程，微小的测量误差也会被无限放大。',
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
          text: '混沌理论在许多领域都有重要应用。',
        },
        {
          id: 'app-2',
          text: '在气象学中，它解释了为什么长期天气预报如此困难。',
        },
        {
          id: 'app-3',
          text: '在密码学中，混沌系统被用来生成伪随机数。',
        },
        {
          id: 'app-4',
          text: '在生态学中，它帮助我们理解种群数量的不规则波动。',
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
          text: '今天我们探索了混沌理论的核心概念。',
        },
        {
          id: 'sum-2',
          text: '混沌告诉我们，简单的规则可以产生极其复杂的行为。',
        },
        {
          id: 'sum-3',
          text: '确定性并不意味着可预测性，这是混沌给我们的深刻启示。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能激发你对非线性动力学的兴趣。',
        },
      ],
    },
  ],
}
