/**
 * 蒙特卡洛方法讲解稿件
 * 适合初中生（12-15岁）
 */

import type { NarrationScript } from '../types'

export const monteCarloNarration: NarrationScript = {
  id: 'monte-carlo',
  title: '蒙特卡洛方法',
  subtitle: '用随机点估算圆周率 π',
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
          text: '欢迎来到蒙特卡洛方法实验！今天我们要用一种神奇的方法来估算圆周率。',
        },
        {
          id: 'intro-2',
          text: '蒙特卡洛方法是一种利用随机数来解决问题的计算方法。',
        },
        {
          id: 'intro-3',
          text: '它的名字来自摩纳哥的蒙特卡洛赌场，因为这种方法和赌博一样依赖随机性。',
        },
      ],
    },
    {
      id: 'principle',

      type: 'concept',

      title: '基本原理',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'principle-1',
          text: '想象一个边长为 2 的正方形，里面画一个半径为 1 的圆。',
        },
        {
          id: 'principle-2',
          text: '正方形的面积是 4，圆的面积是 π。',
        },
        {
          id: 'principle-3',
          text: '如果我们在正方形内随机撒点，落入圆内的概率就是圆面积除以正方形面积，等于 π/4。',
        },
        {
          id: 'principle-4',
          text: '所以，圆内点数除以总点数，再乘以 4，就能估算出 π 的值。',
        },
      ],
    },
    {
      id: 'visualization',

      type: 'animation',

      title: '图形演示',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'visualization-1',
          text: '图中蓝色的圆是单位圆，外面的方框是边长为 2 的正方形。',
        },
        {
          id: 'visualization-2',
          text: '绿色的点落在圆内，红色的点落在圆外。',
        },
        {
          id: 'visualization-3',
          text: '随着点数增加，绿点和红点的比例会越来越接近真实的面积比。',
        },
      ],
    },
    {
      id: 'experiment',

      type: 'interaction',

      title: '开始实验',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'experiment-1',
          text: '点击"开始"按钮，程序会不断生成随机点。',
        },
        {
          id: 'experiment-2',
          text: '每个点的坐标是随机的，程序会判断它是否在圆内。',
        },
        {
          id: 'experiment-3',
          text: '判断方法很简单：如果 x² + y² 小于等于 1，点就在圆内。',
        },
        {
          id: 'experiment-4',
          text: '你可以调整速度滑块，控制每帧生成的点数。',
        },
      ],
    },
    {
      id: 'convergence',

      type: 'concept',

      title: '收敛过程',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'convergence-1',
          text: '下方的图显示了 π 估计值随点数增加的变化过程。',
        },
        {
          id: 'convergence-2',
          text: '红色虚线是 π 的真实值 3.14159...。',
        },
        {
          id: 'convergence-3',
          text: '一开始估计值波动很大，但随着点数增加，会逐渐稳定在真实值附近。',
        },
        {
          id: 'convergence-4',
          text: '这就是大数定律的体现：样本越多，估计越准确。',
        },
      ],
    },
    {
      id: 'accuracy',

      type: 'concept',

      title: '精度分析',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'accuracy-1',
          text: '蒙特卡洛方法的精度与点数的平方根成正比。',
        },
        {
          id: 'accuracy-2',
          text: '要让误差减半，需要把点数增加到 4 倍。',
        },
        {
          id: 'accuracy-3',
          text: '所以这种方法收敛比较慢，但它的优点是简单且适用范围广。',
        },
        {
          id: 'accuracy-4',
          text: '右侧面板显示了当前的估计值和误差。',
        },
      ],
    },
    {
      id: 'application',

      type: 'application',

      title: '实际应用',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'application-1',
          text: '蒙特卡洛方法不仅能估算 π，还有很多实际应用。',
        },
        {
          id: 'application-2',
          text: '在金融领域，用于计算复杂金融产品的价格和风险。',
        },
        {
          id: 'application-3',
          text: '在物理学中，用于模拟粒子运动和核反应。',
        },
        {
          id: 'application-4',
          text: '在人工智能中，用于游戏 AI 和决策优化。',
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
          text: '蒙特卡洛方法利用随机采样来估算数学量，比如圆周率 π。',
        },
        {
          id: 'summary-3',
          text: '原理是：圆内点数除以总点数约等于 π/4，所以 π 约等于 4 乘以这个比值。',
        },
        {
          id: 'summary-4',
          text: '样本越多，估计越准确，这是大数定律的体现。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对蒙特卡洛方法有了更直观的理解！',
        },
      ],
    },
  ],
}
