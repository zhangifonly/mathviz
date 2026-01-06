import type { NarrationScript } from '../types'

/**
 * 插值实验 - 口播稿件
 *
 * 核心概念：数据点之间的曲线拟合
 * 目标受众：大学本科生，有基础数学知识
 */
export const interpolationNarration: NarrationScript = {
  id: 'interpolation',
  title: '插值',
  subtitle: '探索数据点之间的曲线拟合',
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
    '理解插值的基本概念',
    '掌握拉格朗日插值和样条插值',
    '观察不同插值方法的效果',
    '了解插值在实际中的应用',
  ],

  prerequisites: [
    '多项式的基本概念',
    '函数的连续性',
    '基础代数知识',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到插值实验。',
        },
        {
          id: 'intro-2',
          text: '假设你有几个测量数据点，想知道它们之间的值是多少。',
        },
        {
          id: 'intro-3',
          text: '或者你想画一条平滑的曲线通过这些点。',
        },
        {
          id: 'intro-4',
          text: '插值正是解决这类问题的数学方法。',
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
          text: '插值是构造一个函数，使它精确通过给定的数据点。',
        },
        {
          id: 'concept-2',
          text: '与回归不同，插值曲线必须经过每一个数据点。',
        },
        {
          id: 'concept-3',
          text: '最简单的插值是线性插值：用直线连接相邻的点。',
        },
        {
          id: 'concept-4',
          text: '但我们通常需要更平滑的曲线，这就需要更高级的方法。',
        },
      ],
    },
    {
      id: 'lagrange',
      type: 'animation',
      title: '拉格朗日插值',
      lines: [
        {
          id: 'lag-1',
          text: '拉格朗日插值用一个多项式来通过所有数据点。',
        },
        {
          id: 'lag-2',
          text: 'n个点可以确定一个n-1次多项式。',
        },
        {
          id: 'lag-3',
          text: '这个方法简单优雅，但有一个问题：龙格现象。',
        },
        {
          id: 'lag-4',
          text: '当点数增多时，多项式在边缘可能会剧烈振荡。',
        },
      ],
    },
    {
      id: 'spline',
      type: 'animation',
      title: '样条插值',
      lines: [
        {
          id: 'spline-1',
          text: '样条插值用分段多项式来避免龙格现象。',
        },
        {
          id: 'spline-2',
          text: '最常用的是三次样条：每段是三次多项式，在连接点处光滑。',
        },
        {
          id: 'spline-3',
          text: '样条这个名字来自绘图员用的弹性木条。',
        },
        {
          id: 'spline-4',
          text: '它在计算机图形学和CAD中被广泛使用。',
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
          text: '插值在许多领域都有重要应用。',
        },
        {
          id: 'app-2',
          text: '图像处理中，放大图片需要插值来填充新像素。',
        },
        {
          id: 'app-3',
          text: '动画制作中，关键帧之间的过渡用插值来生成。',
        },
        {
          id: 'app-4',
          text: '科学计算中，它用于从离散数据估计连续函数。',
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
          text: '今天我们探索了插值的基本方法。',
        },
        {
          id: 'sum-2',
          text: '拉格朗日插值简单但可能振荡，样条插值更加稳定。',
        },
        {
          id: 'sum-3',
          text: '选择合适的插值方法取决于具体应用场景。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你理解数据拟合的数学原理。',
        },
      ],
    },
  ],
}
