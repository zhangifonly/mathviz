import type { NarrationScript } from '../types'

/**
 * 最小二乘法 - 口播稿件
 * 核心概念：残差平方和、正规方程闭式解、决定系数 R²
 * 目标受众：高中及以上
 */
export const leastSquaresNarration: NarrationScript = {
  id: 'least-squares',
  title: '最小二乘法',
  subtitle: '最优直线拟合',
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
    '理解用残差平方和衡量拟合好坏',
    '掌握正规方程的闭式解思路',
    '认识决定系数 R² 的含义',
    '体会数据拟合背后的优化思想',
  ],

  prerequisites: ['了解一次函数', '了解平面坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一堆散乱的数据点摆在眼前，它们似乎藏着某种线性规律。' },
        { id: 'intro-2', text: '我们想画一条直线，尽可能穿过这团点的中心。' },
        { id: 'intro-3', text: '可什么样的直线才算最好？这就需要一个公平的评判标准。' },
      ],
    },
    {
      id: 'residual',
      type: 'concept',
      title: '残差平方和',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'res-1', text: '每个点到直线的竖直距离，叫做残差，代表这一点的预测误差。' },
        { id: 'res-2', text: '把所有残差平方后加起来，就是残差平方和，记作 RSS。' },
        { id: 'res-3', text: '平方既避免了正负抵消，又放大了远离直线的大偏差。' },
      ],
    },
    {
      id: 'minimize',
      type: 'concept',
      title: '最小化求解',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'min-1', text: '最小二乘法要找的，就是让残差平方和最小的那条直线。' },
        { id: 'min-2', text: '对斜率和截距求导并令其为零，得到一组正规方程。' },
        { id: 'min-3', text: '解出的斜率等于协方差除以方差，截距让直线穿过数据的均值点。' },
      ],
    },
    {
      id: 'goodness',
      type: 'concept',
      title: '拟合优度',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'good-1', text: '拟合好不好，用决定系数 R 平方来量化。' },
        { id: 'good-2', text: '它等于一减去残差平方和与总波动之比，越接近一就越好。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '加大噪声，看散点变散、R 平方随之下降。' },
        { id: 'int-2', text: '重新随机散点，直线始终自动落在最优位置。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '最小二乘法用残差平方和衡量误差，并把它降到最低。' },
        { id: 'sum-2', text: '一组正规方程给出斜率与截距的闭式解，R 平方评判拟合优度。' },
        { id: 'sum-3', text: '让数据自己说出规律，这就是拟合的力量，我们下次再见！' },
      ],
    },
  ],
}
