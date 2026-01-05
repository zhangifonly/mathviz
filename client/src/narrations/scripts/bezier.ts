/**
 * 贝塞尔曲线讲解稿件
 * 适合初中生（12-15岁）
 */

import type { NarrationScript } from '../types'

export const bezierNarration: NarrationScript = {
  id: 'bezier',
  title: '贝塞尔曲线',
  subtitle: '交互式探索贝塞尔曲线的构造和性质',
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
    '理解贝塞尔曲线的控制点概念',
    '掌握 de Casteljau 算法的构造过程',
    '了解参数 t 对曲线的影响',
    '认识贝塞尔曲线的重要性质',
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
          text: '欢迎来到贝塞尔曲线实验！今天我们要学习计算机图形学中最重要的曲线。',
        },
        {
          id: 'intro-2',
          text: '贝塞尔曲线广泛应用于字体设计、动画制作、汽车外形设计等领域。',
        },
        {
          id: 'intro-3',
          text: '你在 Photoshop、Illustrator 中使用的钢笔工具，画的就是贝塞尔曲线。',
        },
      ],
    },
    {
      id: 'control-points',
      type: 'concept',
      title: '控制点',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'control-points-1',
          text: '贝塞尔曲线由一组控制点定义，曲线会被这些点"拉"向特定的形状。',
        },
        {
          id: 'control-points-2',
          text: '图中黑色的点就是控制点，用 P0、P1、P2 等标记。',
        },
        {
          id: 'control-points-3',
          text: '曲线一定经过第一个和最后一个控制点，但不一定经过中间的点。',
        },
        {
          id: 'control-points-4',
          text: '你可以用鼠标拖动控制点，观察曲线如何随之变化。',
        },
      ],
    },
    {
      id: 'construction',
      type: 'concept',
      title: '构造过程',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'construction-1',
          text: '贝塞尔曲线的构造方法叫做 de Casteljau 算法，非常优雅。',
        },
        {
          id: 'construction-2',
          text: '算法的核心是线性插值：在两点之间按比例 t 找一个点。',
        },
        {
          id: 'construction-3',
          text: '对相邻的控制点两两做插值，得到新的一层点，然后继续插值。',
        },
        {
          id: 'construction-4',
          text: '重复这个过程，直到只剩一个点，这个点就在曲线上。',
        },
        {
          id: 'construction-5',
          text: '勾选"显示构造"，可以看到彩色的中间层点和连线。',
        },
      ],
    },
    {
      id: 'parameter-t',
      type: 'interaction',
      title: '参数 t',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'parameter-t-1',
          text: '参数 t 的取值范围是 0 到 1，它决定了曲线上点的位置。',
        },
        {
          id: 'parameter-t-2',
          text: '当 t = 0 时，点在曲线的起点，也就是第一个控制点。',
        },
        {
          id: 'parameter-t-3',
          text: '当 t = 1 时，点在曲线的终点，也就是最后一个控制点。',
        },
        {
          id: 'parameter-t-4',
          text: '当 t = 0.5 时，点大约在曲线的中间位置。',
        },
        {
          id: 'parameter-t-5',
          text: '拖动 t 滑块，观察红色的点如何沿着曲线移动。',
        },
      ],
    },
    {
      id: 'degree',
      type: 'concept',
      title: '曲线阶数',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'degree-1',
          text: '贝塞尔曲线的阶数等于控制点数减 1。',
        },
        {
          id: 'degree-2',
          text: '2 个控制点是一次曲线，其实就是一条直线。',
        },
        {
          id: 'degree-3',
          text: '3 个控制点是二次曲线，也叫二次贝塞尔曲线。',
        },
        {
          id: 'degree-4',
          text: '4 个控制点是三次曲线，这是最常用的贝塞尔曲线。',
        },
        {
          id: 'degree-5',
          text: '点击"添加点"和"删除点"按钮，可以改变控制点数量。',
        },
      ],
    },
    {
      id: 'bernstein',
      type: 'formula',
      title: '伯恩斯坦基函数',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'bernstein-1',
          text: '贝塞尔曲线还可以用伯恩斯坦多项式来表示。',
        },
        {
          id: 'bernstein-2',
          text: '下方的图显示了各个伯恩斯坦基函数随 t 变化的曲线。',
        },
        {
          id: 'bernstein-3',
          text: '每个控制点对曲线的影响由对应的基函数决定。',
        },
        {
          id: 'bernstein-4',
          text: '所有基函数在任意 t 处的和等于 1，这保证了曲线的稳定性。',
        },
      ],
    },
    {
      id: 'properties',
      type: 'concept',
      title: '重要性质',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'properties-1',
          text: '贝塞尔曲线有几个重要的性质。',
        },
        {
          id: 'properties-2',
          text: '第一，曲线一定经过首尾两个控制点。',
        },
        {
          id: 'properties-3',
          text: '第二，曲线在端点处与控制多边形相切。',
        },
        {
          id: 'properties-4',
          text: '第三，曲线完全位于控制点形成的凸包内。',
        },
        {
          id: 'properties-5',
          text: '第四，对曲线做平移、旋转、缩放，只需对控制点做同样的变换。',
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
          text: '点击"动画"按钮，可以看到参数 t 从 0 变化到 1 的过程。',
        },
        {
          id: 'animation-2',
          text: '观察红色的点如何沿着曲线从起点移动到终点。',
        },
        {
          id: 'animation-3',
          text: '同时观察中间层的点如何同步移动，这就是 de Casteljau 算法的可视化。',
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
          text: '贝塞尔曲线由控制点定义，通过 de Casteljau 算法构造。',
        },
        {
          id: 'summary-3',
          text: '参数 t 从 0 到 1 变化，生成曲线上的所有点。',
        },
        {
          id: 'summary-4',
          text: '贝塞尔曲线在计算机图形学中有广泛应用，是设计师的重要工具。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对贝塞尔曲线有了更直观的理解！',
        },
      ],
    },
  ],
}
