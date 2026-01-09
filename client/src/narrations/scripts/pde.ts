/**
 * 偏微分方程讲解稿件
 * 适合研究生
 */

import type { NarrationScript } from '../types'

export const pdeNarration: NarrationScript = {
  id: 'pde',
  title: '偏微分方程',
  subtitle: '探索多变量函数的微分方程世界',
  targetAge: '研究生',
  difficulty: 'expert',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-09',
    updatedAt: '2025-01-09',
  },

  objectives: [
    '理解偏微分方程的基本概念和分类',
    '掌握拉普拉斯方程、泊松方程、波动方程和热传导方程',
    '理解边界条件和初始条件的作用',
    '了解数值求解方法',
  ],

  prerequisites: [
    '多元微积分',
    '常微分方程',
    '数值分析基础',
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
          text: '欢迎来到偏微分方程的世界！偏微分方程是描述自然界中连续变化现象的数学语言。',
        },
        {
          id: 'intro-2',
          text: '从物理学中的波动、热传导、流体力学，到工程中的结构分析、电磁场理论，偏微分方程无处不在。',
        },
        {
          id: 'intro-3',
          text: '与常微分方程不同，偏微分方程涉及多个自变量的偏导数，这使得问题变得更加复杂和丰富。',
        },
      ],
    },
    {
      id: 'classification',
      type: 'concept',
      title: '方程分类',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'classification-1',
          text: '偏微分方程可以按照多种方式分类。最重要的分类是根据方程的类型：椭圆型、抛物型和双曲型。',
        },
        {
          id: 'classification-2',
          text: '椭圆型方程描述稳态问题，如拉普拉斯方程和泊松方程。这类方程没有时间变量，描述的是平衡状态。',
        },
        {
          id: 'classification-3',
          text: '抛物型方程描述扩散过程，典型代表是热传导方程。这类方程有一阶时间导数，描述不可逆的扩散过程。',
        },
        {
          id: 'classification-4',
          text: '双曲型方程描述波动现象，如波动方程。这类方程有二阶时间导数，描述可逆的振荡过程。',
        },
      ],
    },
    {
      id: 'laplace',
      type: 'formula',
      title: '拉普拉斯方程',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'laplace-1',
          text: '拉普拉斯方程是最基本的椭圆型方程，形式为：拉普拉斯算子作用于u等于零。',
        },
        {
          id: 'laplace-2',
          text: '在二维情况下，拉普拉斯算子等于u对x的二阶偏导数加上u对y的二阶偏导数。',
        },
        {
          id: 'laplace-3',
          text: '拉普拉斯方程描述无源的稳态场，如静电场、稳态温度分布、理想流体的势流等。',
        },
        {
          id: 'laplace-4',
          text: '拉普拉斯方程的解具有调和性质，即内部任一点的值等于其周围点的平均值。',
        },
      ],
    },
    {
      id: 'poisson',
      type: 'formula',
      title: '泊松方程',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'poisson-1',
          text: '泊松方程是拉普拉斯方程的推广，右侧有一个源项函数f(x,y)。',
        },
        {
          id: 'poisson-2',
          text: '当源项为零时，泊松方程退化为拉普拉斯方程。源项代表场的源或汇。',
        },
        {
          id: 'poisson-3',
          text: '在静电学中，泊松方程描述电荷分布与电势的关系。在引力场中，它描述质量分布与引力势的关系。',
        },
      ],
    },
    {
      id: 'heat',
      type: 'formula',
      title: '热传导方程',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'heat-1',
          text: '热传导方程是典型的抛物型方程，描述热量在介质中的扩散过程。',
        },
        {
          id: 'heat-2',
          text: '方程的形式是：u对时间的偏导数等于热扩散系数α乘以拉普拉斯算子作用于u。',
        },
        {
          id: 'heat-3',
          text: '热传导方程具有平滑性质，初始的不连续温度分布会迅速变得光滑。',
        },
        {
          id: 'heat-4',
          text: '这个方程也适用于其他扩散过程，如物质扩散、动量扩散等。',
        },
      ],
    },
    {
      id: 'wave',
      type: 'formula',
      title: '波动方程',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'wave-1',
          text: '波动方程是典型的双曲型方程，描述波的传播现象。',
        },
        {
          id: 'wave-2',
          text: '方程的形式是：u对时间的二阶偏导数等于波速c的平方乘以拉普拉斯算子作用于u。',
        },
        {
          id: 'wave-3',
          text: '波动方程描述声波、光波、弦振动、膜振动等多种物理现象。',
        },
        {
          id: 'wave-4',
          text: '与热传导方程不同，波动方程是可逆的，能量在空间中传播而不耗散。',
        },
      ],
    },
    {
      id: 'boundary',
      type: 'concept',
      title: '边界条件',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'boundary-1',
          text: '偏微分方程的解不是唯一的，需要边界条件来确定特定的解。',
        },
        {
          id: 'boundary-2',
          text: 'Dirichlet边界条件指定边界上函数的值，如固定温度或固定电势。',
        },
        {
          id: 'boundary-3',
          text: 'Neumann边界条件指定边界上函数的法向导数，如绝热边界或零通量边界。',
        },
        {
          id: 'boundary-4',
          text: '混合边界条件在不同边界上使用不同类型的条件，或者使用Robin边界条件，它是前两者的线性组合。',
        },
      ],
    },
    {
      id: 'numerical',
      type: 'concept',
      title: '数值求解',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'numerical-1',
          text: '大多数偏微分方程没有解析解，需要使用数值方法求解。',
        },
        {
          id: 'numerical-2',
          text: '有限差分法是最直观的方法，将连续的偏导数用离散的差分近似。',
        },
        {
          id: 'numerical-3',
          text: '五点差分格式是二维问题中最常用的方法，用中心点周围四个点的值来近似拉普拉斯算子。',
        },
        {
          id: 'numerical-4',
          text: '对于时间相关的问题，可以使用显式或隐式时间步进方法。显式方法简单但有稳定性限制，隐式方法稳定但需要求解线性方程组。',
        },
      ],
    },
    {
      id: 'applications',
      type: 'application',
      title: '应用领域',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'applications-1',
          text: '偏微分方程在科学和工程中有广泛应用。在物理学中，它们描述电磁场、量子力学、相对论等基本理论。',
        },
        {
          id: 'applications-2',
          text: '在工程中，偏微分方程用于结构分析、流体力学、热传递、电路设计等领域。',
        },
        {
          id: 'applications-3',
          text: '在金融数学中，Black-Scholes方程是一个抛物型偏微分方程，用于期权定价。',
        },
        {
          id: 'applications-4',
          text: '在图像处理和计算机视觉中，偏微分方程用于图像去噪、边缘检测、图像分割等任务。',
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
          text: '偏微分方程是描述连续变化现象的强大工具，涵盖了自然界和工程中的众多问题。',
        },
        {
          id: 'summary-2',
          text: '理解方程的类型、边界条件和数值求解方法，是掌握偏微分方程的关键。',
        },
        {
          id: 'summary-3',
          text: '拉普拉斯方程、泊松方程、热传导方程和波动方程是四类最基本和重要的偏微分方程。',
        },
        {
          id: 'summary-4',
          text: '希望这个可视化工具能帮助你更好地理解偏微分方程的概念和应用！',
        },
      ],
    },
  ],
}
