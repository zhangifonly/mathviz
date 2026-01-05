/**
 * 概率分布讲解稿件
 * 适合初中生（12-15岁）
 */

import type { NarrationScript } from '../types'

export const probabilityNarration: NarrationScript = {
  id: 'probability',
  title: '概率分布',
  subtitle: '探索常见概率分布的形态与参数影响',
  targetAge: '初中 12-15岁',
  difficulty: 'elementary',
  voice: 'xiaoxiao',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-03',
    updatedAt: '2025-01-03',
  },

  objectives: [
    '理解核心概念',
    '掌握基本操作',
    '观察参数变化的影响',
  ],

  sections: [
    {
      id: 'intro',

      type: 'intro',

      title: '开场引入',

      trigger: { type: 'auto', delay: 1000 },

      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到概率分布实验！今天我们要学习描述随机现象的数学工具。',
        },
        {
          id: 'intro-2',
          text: '概率分布告诉我们随机事件各种结果出现的可能性有多大。',
        },
        {
          id: 'intro-3',
          text: '从考试成绩到天气预报，从股票价格到产品质量，概率分布无处不在。',
        },
      ],
    },
    {
      id: 'normal',

      type: 'concept',

      title: '正态分布',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'normal-1',
          text: '正态分布是最重要的概率分布，也叫高斯分布，它的图像像一座钟。',
        },
        {
          id: 'normal-2',
          text: '正态分布由两个参数决定：均值 μ 决定中心位置，标准差 σ 决定分散程度。',
        },
        {
          id: 'normal-3',
          text: '均值 μ 越大，曲线越往右移；标准差 σ 越大，曲线越矮越宽。',
        },
        {
          id: 'normal-4',
          text: '自然界中很多现象服从正态分布，比如人的身高、考试成绩等。',
        },
        {
          id: 'normal-5',
          text: '试着调整 μ 和 σ 的值，观察曲线如何变化。',
        },
      ],
    },
    {
      id: 'uniform',

      type: 'concept',

      title: '均匀分布',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'uniform-1',
          text: '均匀分布是最简单的分布，在区间内每个值出现的概率相等。',
        },
        {
          id: 'uniform-2',
          text: '它的图像是一个矩形，高度等于 1 除以区间长度。',
        },
        {
          id: 'uniform-3',
          text: '掷骰子就是均匀分布的例子，1 到 6 每个点数出现的概率都是六分之一。',
        },
        {
          id: 'uniform-4',
          text: '调整上界和下界，可以改变均匀分布的范围。',
        },
      ],
    },
    {
      id: 'exponential',

      type: 'concept',

      title: '指数分布',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'exponential-1',
          text: '指数分布描述独立随机事件发生的时间间隔。',
        },
        {
          id: 'exponential-2',
          text: '比如顾客到达商店的时间间隔、设备故障的等待时间等。',
        },
        {
          id: 'exponential-3',
          text: '参数 λ 叫做率参数，λ 越大，事件发生越频繁，曲线下降越快。',
        },
        {
          id: 'exponential-4',
          text: '指数分布有一个特殊性质叫"无记忆性"，过去不影响未来。',
        },
      ],
    },
    {
      id: 'poisson',

      type: 'concept',

      title: '泊松分布',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'poisson-1',
          text: '泊松分布描述单位时间内随机事件发生次数的分布。',
        },
        {
          id: 'poisson-2',
          text: '比如一小时内接到的电话数、一天内发生的交通事故数等。',
        },
        {
          id: 'poisson-3',
          text: '泊松分布是离散分布，只能取非负整数值，用柱状图表示。',
        },
        {
          id: 'poisson-4',
          text: '参数 λ 是期望值，表示平均发生次数。λ 越大，分布越往右移，越接近正态分布。',
        },
      ],
    },
    {
      id: 'binomial',

      type: 'concept',

      title: '二项分布',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'binomial-1',
          text: '二项分布描述 n 次独立试验中成功次数的分布。',
        },
        {
          id: 'binomial-2',
          text: '比如抛 10 次硬币，正面朝上的次数就服从二项分布。',
        },
        {
          id: 'binomial-3',
          text: '二项分布有两个参数：试验次数 n 和每次成功的概率 p。',
        },
        {
          id: 'binomial-4',
          text: '当 p = 0.5 时，分布是对称的；当 p 偏离 0.5 时，分布会偏斜。',
        },
        {
          id: 'binomial-5',
          text: '调整 n 和 p 的值，观察分布形态的变化。',
        },
      ],
    },
    {
      id: 'statistics',

      type: 'concept',

      title: '数字特征',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'statistics-1',
          text: '每种分布都有两个重要的数字特征：期望和方差。',
        },
        {
          id: 'statistics-2',
          text: '期望 E(X) 是分布的中心位置，表示平均值。',
        },
        {
          id: 'statistics-3',
          text: '方差 Var(X) 衡量数据的分散程度，方差越大，数据越分散。',
        },
        {
          id: 'statistics-4',
          text: '标准差是方差的平方根，与原数据单位相同，更容易理解。',
        },
        {
          id: 'statistics-5',
          text: '右侧面板显示了当前分布的期望、方差和标准差。',
        },
      ],
    },
    {
      id: 'animation',

      type: 'animation',

      title: '动画演示',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'animation-1',
          text: '点击"播放动画"按钮，可以看到参数变化时分布形态的变化。',
        },
        {
          id: 'animation-2',
          text: '对于正态分布，动画展示标准差从小到大的变化过程。',
        },
        {
          id: 'animation-3',
          text: '观察曲线如何从窄高变成宽矮，但面积始终等于 1。',
        },
      ],
    },
    {
      id: 'summary',

      type: 'summary',

      title: '总结',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'summary-1',
          text: '让我们总结一下今天学到的内容。',
        },
        {
          id: 'summary-2',
          text: '概率分布描述随机变量取各种值的概率，分为连续分布和离散分布。',
        },
        {
          id: 'summary-3',
          text: '正态分布是最重要的连续分布，泊松分布和二项分布是常见的离散分布。',
        },
        {
          id: 'summary-4',
          text: '期望和方差是描述分布的两个关键数字特征。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对概率分布有了更直观的理解！',
        },
      ],
    },
  ],
}
