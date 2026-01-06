import type { NarrationScript } from '../types'

/**
 * 傅里叶级数实验 - 口播稿件
 *
 * 核心概念：周期函数的傅里叶展开
 * 目标受众：大学本科生，有基础微积分知识
 */
export const fourierSeriesNarration: NarrationScript = {
  id: 'fourier-series',
  title: '傅里叶级数',
  subtitle: '探索周期函数的频率分解',
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
    '理解傅里叶级数的数学形式',
    '掌握傅里叶系数的计算',
    '观察级数逼近的过程',
    '了解吉布斯现象',
  ],

  prerequisites: [
    '三角函数知识',
    '定积分的计算',
    '级数的基本概念',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到傅里叶级数实验。',
        },
        {
          id: 'intro-2',
          text: '傅里叶在研究热传导时发现了一个惊人的事实。',
        },
        {
          id: 'intro-3',
          text: '任何周期函数，无论多么复杂，都可以表示为正弦和余弦函数的无穷级数。',
        },
        {
          id: 'intro-4',
          text: '这个发现彻底改变了数学和物理学。',
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
          text: '傅里叶级数的形式是：常数项加上无穷多个正弦和余弦项的和。',
        },
        {
          id: 'concept-2',
          text: '每一项的频率是基频的整数倍，叫做谐波。',
        },
        {
          id: 'concept-3',
          text: '傅里叶系数决定了每个谐波的振幅。',
        },
        {
          id: 'concept-4',
          text: '这些系数可以通过积分公式计算。',
        },
      ],
    },
    {
      id: 'square-wave',
      type: 'animation',
      title: '方波展开',
      lines: [
        {
          id: 'sq-1',
          text: '让我们看看方波的傅里叶级数。',
        },
        {
          id: 'sq-2',
          text: '方波只包含奇次谐波，系数按1/n递减。',
        },
        {
          id: 'sq-3',
          text: '随着项数增加，级数越来越接近方波。',
        },
        {
          id: 'sq-4',
          text: '但在跳变点附近，总有一些振荡，这就是吉布斯现象。',
        },
      ],
    },
    {
      id: 'gibbs',
      type: 'concept',
      title: '吉布斯现象',
      lines: [
        {
          id: 'gibbs-1',
          text: '吉布斯现象是傅里叶级数在不连续点附近的过冲。',
        },
        {
          id: 'gibbs-2',
          text: '无论取多少项，过冲的幅度始终约为9%。',
        },
        {
          id: 'gibbs-3',
          text: '这不是计算误差，而是傅里叶级数的固有特性。',
        },
        {
          id: 'gibbs-4',
          text: '在信号处理中，需要特别注意这个现象。',
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
          text: '傅里叶级数是信号分析的基础。',
        },
        {
          id: 'app-2',
          text: '音乐合成器用它来创造各种音色。',
        },
        {
          id: 'app-3',
          text: '电路分析中，它用于研究周期信号的响应。',
        },
        {
          id: 'app-4',
          text: '图像压缩中的JPEG格式也基于类似的原理。',
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
          text: '今天我们探索了傅里叶级数的数学原理。',
        },
        {
          id: 'sum-2',
          text: '它揭示了周期函数的频率结构。',
        },
        {
          id: 'sum-3',
          text: '吉布斯现象提醒我们，数学逼近也有其局限性。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你深入理解傅里叶分析。',
        },
      ],
    },
  ],
}
