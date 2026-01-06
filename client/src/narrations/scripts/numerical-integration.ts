import type { NarrationScript } from '../types'

/**
 * 数值积分实验 - 口播稿件
 *
 * 核心概念：数值方法计算定积分
 * 目标受众：大学本科生，有基础微积分知识
 */
export const numericalIntegrationNarration: NarrationScript = {
  id: 'numerical-integration',
  title: '数值积分',
  subtitle: '探索定积分的数值计算方法',
  difficulty: 'intermediate',
  targetAge: '大学本科',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解数值积分的基本思想',
    '掌握矩形法、梯形法和辛普森法',
    '观察不同方法的精度差异',
    '了解数值积分的应用场景',
  ],

  prerequisites: [
    '定积分的概念',
    '黎曼和的理解',
    '基础微积分知识',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到数值积分实验。',
        },
        {
          id: 'intro-2',
          text: '你学过定积分，知道它表示曲线下的面积。',
        },
        {
          id: 'intro-3',
          text: '但很多函数的积分没有解析解，或者解析解非常复杂。',
        },
        {
          id: 'intro-4',
          text: '这时候，数值积分就派上用场了。',
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
          text: '数值积分的基本思想是用简单图形的面积来近似曲线下的面积。',
        },
        {
          id: 'concept-2',
          text: '把积分区间分成很多小段，每段用矩形或梯形来近似。',
        },
        {
          id: 'concept-3',
          text: '分得越细，近似就越精确。',
        },
        {
          id: 'concept-4',
          text: '让我们来比较几种常用的方法。',
        },
      ],
    },
    {
      id: 'rectangle',
      type: 'animation',
      title: '矩形法',
      lines: [
        {
          id: 'rect-1',
          text: '矩形法是最简单的数值积分方法。',
        },
        {
          id: 'rect-2',
          text: '用矩形来近似每个小区间的面积。',
        },
        {
          id: 'rect-3',
          text: '矩形的高度可以取左端点、右端点或中点的函数值。',
        },
        {
          id: 'rect-4',
          text: '中点法通常比左端点和右端点法更精确。',
        },
      ],
    },
    {
      id: 'trapezoid',
      type: 'animation',
      title: '梯形法与辛普森法',
      lines: [
        {
          id: 'trap-1',
          text: '梯形法用梯形代替矩形，更好地逼近曲线。',
        },
        {
          id: 'trap-2',
          text: '它相当于用直线连接相邻的函数值。',
        },
        {
          id: 'trap-3',
          text: '辛普森法更进一步，用抛物线来近似曲线。',
        },
        {
          id: 'trap-4',
          text: '辛普森法的精度通常比梯形法高很多。',
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
          text: '数值积分在科学计算中无处不在。',
        },
        {
          id: 'app-2',
          text: '物理学中计算功、电荷、质量等物理量。',
        },
        {
          id: 'app-3',
          text: '统计学中计算概率分布的累积函数。',
        },
        {
          id: 'app-4',
          text: '工程中计算结构的应力和变形。',
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
          text: '今天我们探索了数值积分的基本方法。',
        },
        {
          id: 'sum-2',
          text: '从简单的矩形法到精确的辛普森法，各有优缺点。',
        },
        {
          id: 'sum-3',
          text: '选择合适的方法和分割数是数值积分的关键。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你理解数值计算的基本思想。',
        },
      ],
    },
  ],
}
