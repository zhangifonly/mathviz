/**
 * 数值分析讲解稿件
 * 适合大学生
 */

import type { NarrationScript } from '../types'

export const numericalAnalysisNarration: NarrationScript = {
  id: 'numerical-analysis',
  title: '数值分析',
  subtitle: '探索数值方法的误差、稳定性和收敛性',
  targetAge: '大学',
  difficulty: 'advanced',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-09',
    updatedAt: '2025-01-09',
  },

  objectives: [
    '理解数值方法的基本原理',
    '掌握误差分析和稳定性概念',
    '了解不同方法的收敛特性',
    '学会选择合适的数值算法',
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
          text: '欢迎来到数值分析的世界！数值分析是研究如何用计算机求解数学问题的学科。',
        },
        {
          id: 'intro-2',
          text: '在实际应用中，很多数学问题无法得到精确解，这时我们就需要使用数值方法来获得近似解。',
        },
        {
          id: 'intro-3',
          text: '数值分析的核心问题包括：误差控制、算法稳定性、收敛速度和计算效率。',
        },
      ],
    },
    {
      id: 'error-analysis',
      type: 'concept',
      title: '误差分析',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'error-1',
          text: '在数值计算中，误差是不可避免的。误差主要来源于三个方面：模型误差、截断误差和舍入误差。',
        },
        {
          id: 'error-2',
          text: '截断误差是由于用有限项代替无限项而产生的。例如，泰勒级数展开时只取前几项。',
        },
        {
          id: 'error-3',
          text: '舍入误差是由于计算机只能表示有限位数的数字而产生的。浮点数运算会累积舍入误差。',
        },
        {
          id: 'error-4',
          text: '绝对误差是近似值与真实值的差，相对误差是绝对误差与真实值的比值。',
        },
      ],
    },
    {
      id: 'ode-methods',
      type: 'concept',
      title: 'ODE数值解法',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'ode-1',
          text: '常微分方程在科学和工程中无处不在。欧拉法是最简单的数值解法，它用切线来近似曲线。',
        },
        {
          id: 'ode-2',
          text: '欧拉法的公式是：y的下一个值等于当前值加上步长乘以导数。这是一阶方法，误差与步长成正比。',
        },
        {
          id: 'ode-3',
          text: '龙格-库塔法是更高精度的方法。四阶龙格-库塔法使用四个斜率的加权平均，误差与步长的四次方成正比。',
        },
        {
          id: 'ode-4',
          text: 'RK4方法计算四个系数k1到k4，分别对应区间起点、中点和终点的斜率信息。',
        },
      ],
    },
    {
      id: 'stability',
      type: 'concept',
      title: '数值稳定性',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'stability-1',
          text: '数值稳定性是指算法对输入误差的敏感程度。一个稳定的算法不会放大输入误差。',
        },
        {
          id: 'stability-2',
          text: '对于ODE求解，步长的选择至关重要。步长太大会导致不稳定，步长太小会增加计算量和舍入误差。',
        },
        {
          id: 'stability-3',
          text: '刚性方程是指解的某些分量变化很快而另一些变化很慢的方程。求解刚性方程需要特殊的隐式方法。',
        },
        {
          id: 'stability-4',
          text: '条件数衡量问题对输入扰动的敏感度。条件数越大，问题越病态，数值求解越困难。',
        },
      ],
    },
    {
      id: 'root-finding',
      type: 'concept',
      title: '求根方法',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'root-1',
          text: '求根问题是找到使函数值为零的点。二分法是最简单可靠的方法，它不断将区间对半分。',
        },
        {
          id: 'root-2',
          text: '二分法每次迭代将误差减半，这是线性收敛。虽然慢，但保证收敛，只要初始区间包含根。',
        },
        {
          id: 'root-3',
          text: '牛顿法使用函数的导数信息，收敛速度快得多。它是二次收敛的，每次迭代有效数字大约翻倍。',
        },
        {
          id: 'root-4',
          text: '牛顿法的缺点是需要计算导数，而且对初值敏感。如果初值选择不当，可能不收敛或收敛到错误的根。',
        },
      ],
    },
    {
      id: 'convergence',
      type: 'concept',
      title: '收敛性分析',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'convergence-1',
          text: '收敛性是指当步长或容差趋于零时，数值解是否趋于真实解。',
        },
        {
          id: 'convergence-2',
          text: '收敛阶描述误差减小的速度。一阶方法误差与h成正比，二阶方法误差与h平方成正比。',
        },
        {
          id: 'convergence-3',
          text: '对于迭代方法，线性收敛意味着误差每次减少一个常数因子，二次收敛意味着误差每次平方减小。',
        },
        {
          id: 'convergence-4',
          text: '在实际应用中，我们需要在精度、稳定性和计算效率之间找到平衡。',
        },
      ],
    },
    {
      id: 'applications',
      type: 'application',
      title: '应用',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'applications-1',
          text: '数值分析在科学计算中无处不在。天气预报使用数值方法求解大气动力学方程。',
        },
        {
          id: 'applications-2',
          text: '在工程设计中，有限元分析使用数值方法求解偏微分方程，模拟结构的应力和变形。',
        },
        {
          id: 'applications-3',
          text: '机器学习中的优化算法，如梯度下降，本质上也是数值方法，用于最小化损失函数。',
        },
        {
          id: 'applications-4',
          text: '金融工程使用数值方法为期权定价，求解随机微分方程。',
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
          text: '数值分析提供了用计算机求解数学问题的系统方法。',
        },
        {
          id: 'summary-2',
          text: '理解误差来源和传播规律，是设计和使用数值算法的基础。',
        },
        {
          id: 'summary-3',
          text: '稳定性和收敛性是评价数值方法的两个关键指标。',
        },
        {
          id: 'summary-4',
          text: '选择合适的数值方法需要考虑问题的特性、精度要求和计算资源。',
        },
        {
          id: 'summary-5',
          text: '希望这个可视化工具能帮助你更好地理解数值分析的核心概念！',
        },
      ],
    },
  ],
}
