import type { NarrationScript } from '../types'

/**
 * 波动方程实验 - 口播稿件
 *
 * 核心概念：波的传播与振动
 * 目标受众：大学本科生，有基础微积分知识
 */
export const waveEquationNarration: NarrationScript = {
  id: 'wave-equation',
  title: '波动方程',
  subtitle: '探索波的传播与振动',
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
    '理解波动方程的物理意义',
    '掌握波的传播特性',
    '观察驻波的形成',
    '了解波动方程的应用',
  ],

  prerequisites: [
    '多元微积分',
    '偏导数的概念',
    '三角函数知识',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到波动方程实验。',
        },
        {
          id: 'intro-2',
          text: '你有没有观察过，向平静的湖面扔一颗石子会产生什么？',
        },
        {
          id: 'intro-3',
          text: '涟漪从落点向外扩散，这就是波的传播。',
        },
        {
          id: 'intro-4',
          text: '波动方程正是描述这种现象的数学工具。',
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
          text: '波动方程描述了扰动如何在介质中传播。',
        },
        {
          id: 'concept-2',
          text: '它的核心是：位移的时间二阶导数等于空间二阶导数乘以波速的平方。',
        },
        {
          id: 'concept-3',
          text: '这个方程适用于声波、水波、电磁波等各种波动现象。',
        },
        {
          id: 'concept-4',
          text: '让我们通过可视化来观察波的行为。',
        },
      ],
    },
    {
      id: 'propagation',
      type: 'animation',
      title: '波的传播',
      lines: [
        {
          id: 'prop-1',
          text: '观察一根弦上的波是如何传播的。',
        },
        {
          id: 'prop-2',
          text: '初始的扰动分成两部分，分别向左和向右传播。',
        },
        {
          id: 'prop-3',
          text: '波的形状在传播过程中保持不变，只是位置在移动。',
        },
        {
          id: 'prop-4',
          text: '这是波动方程的一个重要特性：波形的保持。',
        },
      ],
    },
    {
      id: 'standing-wave',
      type: 'animation',
      title: '驻波',
      lines: [
        {
          id: 'stand-1',
          text: '当两列相向传播的波相遇时，会形成驻波。',
        },
        {
          id: 'stand-2',
          text: '驻波看起来不在移动，只是在原地振动。',
        },
        {
          id: 'stand-3',
          text: '有些点始终静止，叫做节点；有些点振幅最大，叫做波腹。',
        },
        {
          id: 'stand-4',
          text: '乐器的弦振动就是驻波的典型例子。',
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
          text: '波动方程在物理学和工程中有广泛应用。',
        },
        {
          id: 'app-2',
          text: '声学设计用它来分析音乐厅的声场分布。',
        },
        {
          id: 'app-3',
          text: '地震学用它来研究地震波的传播。',
        },
        {
          id: 'app-4',
          text: '电磁学中的麦克斯韦方程组也包含波动方程。',
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
          text: '今天我们探索了波动方程的基本原理。',
        },
        {
          id: 'sum-2',
          text: '波动方程描述了扰动在空间中的传播。',
        },
        {
          id: 'sum-3',
          text: '驻波是两列波叠加的结果，在乐器中尤为重要。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你理解波动现象的数学本质。',
        },
      ],
    },
  ],
}
