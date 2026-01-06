import type { NarrationScript } from '../types'

/**
 * 热方程实验 - 口播稿件
 *
 * 核心概念：热传导与偏微分方程
 * 目标受众：大学本科生，有基础微积分知识
 */
export const heatEquationNarration: NarrationScript = {
  id: 'heat-equation',
  title: '热方程',
  subtitle: '探索热传导的数学描述',
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
    '理解热传导的物理过程',
    '掌握热方程的数学形式',
    '观察温度分布的演化',
    '了解偏微分方程的数值解法',
  ],

  prerequisites: [
    '多元微积分',
    '偏导数的概念',
    '基础物理知识',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到热方程实验。',
        },
        {
          id: 'intro-2',
          text: '你有没有注意过，热咖啡放在桌上会慢慢变凉？',
        },
        {
          id: 'intro-3',
          text: '或者冬天握着暖手宝，热量是如何传递到手上的？',
        },
        {
          id: 'intro-4',
          text: '热方程正是描述这种热传导过程的数学工具。',
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
          text: '热方程是最重要的偏微分方程之一，由傅里叶在1822年提出。',
        },
        {
          id: 'concept-2',
          text: '它描述了温度如何随时间和空间变化。',
        },
        {
          id: 'concept-3',
          text: '方程的核心思想是：热量从高温区域流向低温区域。',
        },
        {
          id: 'concept-4',
          text: '温度变化的速率与温度的空间二阶导数成正比。',
        },
      ],
    },
    {
      id: 'visualization',
      type: 'animation',
      title: '温度演化',
      lines: [
        {
          id: 'vis-1',
          text: '让我们观察一根金属棒的温度分布如何随时间变化。',
        },
        {
          id: 'vis-2',
          text: '初始时，棒的中间是热的，两端是冷的。',
        },
        {
          id: 'vis-3',
          text: '随着时间推移，热量向两端扩散，温度分布逐渐变得平缓。',
        },
        {
          id: 'vis-4',
          text: '最终，整根棒会达到均匀的温度。',
        },
      ],
    },
    {
      id: 'boundary',
      type: 'interaction',
      title: '边界条件',
      lines: [
        {
          id: 'bound-1',
          text: '边界条件决定了热方程的具体解。',
        },
        {
          id: 'bound-2',
          text: '固定温度边界：两端保持恒定温度。',
        },
        {
          id: 'bound-3',
          text: '绝热边界：两端没有热量流出。',
        },
        {
          id: 'bound-4',
          text: '不同的边界条件会导致完全不同的温度演化。',
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
          text: '热方程在工程和科学中有广泛应用。',
        },
        {
          id: 'app-2',
          text: '建筑设计中用它来分析墙体的保温性能。',
        },
        {
          id: 'app-3',
          text: '电子设备的散热设计依赖于热传导分析。',
        },
        {
          id: 'app-4',
          text: '有趣的是，热方程还用于图像处理中的模糊效果。',
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
          text: '今天我们探索了热方程的基本原理。',
        },
        {
          id: 'sum-2',
          text: '热方程描述了热量如何在空间中扩散。',
        },
        {
          id: 'sum-3',
          text: '边界条件和初始条件决定了温度的具体演化。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你理解偏微分方程的物理意义。',
        },
      ],
    },
  ],
}
