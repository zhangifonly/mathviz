import type { NarrationScript } from '../types'

/**
 * 自相关 - 口播稿件
 * 核心概念：自相关定义、延迟相乘求和、周期处峰值、基频提取
 * 目标受众：高中及以上
 */
export const autocorrelationNarration: NarrationScript = {
  id: 'autocorrelation',
  title: '自相关',
  subtitle: '检测信号周期',
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
    '理解自相关的定义与计算方式',
    '认识周期信号在自相关中的峰值特征',
    '了解自相关如何从噪声中提取周期',
    '感受它在基频提取等工程中的价值',
  ],

  prerequisites: ['了解正弦信号', '了解求和运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '这是一段忽上忽下、看起来杂乱无章的信号。' },
        { id: 'intro-2', text: '可它并不是纯噪声，里面藏着一个稳定的周期。' },
        { id: 'intro-3', text: '肉眼很难看出来，但有一种方法能把它揪出来。' },
        { id: 'intro-4', text: '这个方法就是自相关。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '什么是自相关',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '自相关，就是拿信号和它自己延迟一段后的副本作比较。' },
        { id: 'def-2', text: '延迟的样本数叫做 lag，也就是错开的距离。' },
        { id: 'def-3', text: '错开之后仍然很像自己，自相关就高。' },
      ],
    },
    {
      id: 'compute',
      type: 'concept',
      title: '延迟相乘求和',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'com-1', text: '具体做法是：把每个点和它延迟 lag 后的点相乘。' },
        { id: 'com-2', text: '再把所有乘积加起来，就得到这个 lag 的自相关值。' },
        { id: 'com-3', text: '对每个 lag 都算一遍，就画出下方那条自相关曲线。' },
      ],
    },
    {
      id: 'peak',
      type: 'concept',
      title: '周期处的峰值',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'peak-1', text: '当延迟恰好等于信号周期时，波峰对波峰、波谷对波谷。' },
        { id: 'peak-2', text: '乘积几乎全为正，累加出一个高高的峰值。' },
        { id: 'peak-3', text: '于是第一个显著峰的位置，就是我们要找的周期。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同信号，看噪声再大，周期峰依然稳稳出现。' },
        { id: 'int-2', text: '点击重新生成噪声，红线始终锁定在同一个周期上。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '自相关用延迟相乘求和，衡量信号隔多久还像自己。' },
        { id: 'sum-2', text: '周期倍数处的峰值，让我们从噪声里提取出基频。' },
        { id: 'sum-3', text: '一个错位相乘的巧思，就听懂了信号的节拍，我们下次再见！' },
      ],
    },
  ],
}
