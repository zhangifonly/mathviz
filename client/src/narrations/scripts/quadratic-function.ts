/**
 * 二次函数讲解稿件
 * 适合初中生（12-15岁）
 */

import type { NarrationScript } from '../types'

export const quadraticFunctionNarration: NarrationScript = {
  id: 'quadratic-function',
  title: '二次函数',
  subtitle: '探索抛物线的顶点、对称轴和根',
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
          text: '欢迎来到二次函数实验！今天我们要学习一种非常重要的函数——二次函数。',
        },
        {
          id: 'intro-2',
          text: '二次函数的图像是一条优美的曲线，叫做抛物线。它在物理和工程中有广泛应用。',
        },
        {
          id: 'intro-3',
          text: '比如投篮时篮球的运动轨迹、喷泉的水流形状，都是抛物线。',
        },
      ],
    },
    {
      id: 'formula',

      type: 'formula',

      title: '函数表达式',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'formula-1',
          text: '二次函数的一般形式是 y 等于 ax 平方加 bx 加 c，其中 a 不等于 0。',
        },
        {
          id: 'formula-2',
          text: 'a 是二次项系数，它决定了抛物线的开口方向和宽窄。',
        },
        {
          id: 'formula-3',
          text: 'b 是一次项系数，c 是常数项，它们共同决定了抛物线的位置。',
        },
        {
          id: 'formula-4',
          text: '除了一般式，还有顶点式 y = a(x-h)² + k，其中 (h, k) 是顶点坐标。',
        },
      ],
    },
    {
      id: 'coefficient-a',

      type: 'concept',

      title: '系数 a 的作用',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'coefficient-a-1',
          text: '系数 a 是二次函数中最重要的参数，它决定了抛物线的基本形态。',
        },
        {
          id: 'coefficient-a-2',
          text: '当 a 大于 0 时，抛物线开口向上，像一个碗，有最低点。',
        },
        {
          id: 'coefficient-a-3',
          text: '当 a 小于 0 时，抛物线开口向下，像一座山，有最高点。',
        },
        {
          id: 'coefficient-a-4',
          text: 'a 的绝对值越大，抛物线越窄越陡；绝对值越小，抛物线越宽越平缓。',
        },
        {
          id: 'coefficient-a-5',
          text: '试着调整 a 的值，观察抛物线如何变化。',
        },
      ],
    },
    {
      id: 'vertex',

      type: 'concept',

      title: '顶点和对称轴',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'vertex-1',
          text: '抛物线有一个特殊的点叫做顶点，它是抛物线的最高点或最低点。',
        },
        {
          id: 'vertex-2',
          text: '顶点的横坐标公式是 x = -b/(2a)，纵坐标可以代入函数求得。',
        },
        {
          id: 'vertex-3',
          text: '过顶点且垂直于 x 轴的直线叫做对称轴，抛物线关于它左右对称。',
        },
        {
          id: 'vertex-4',
          text: '图中红色的点就是顶点，灰色虚线就是对称轴。',
        },
      ],
    },
    {
      id: 'roots',

      type: 'concept',

      title: '根与判别式',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'roots-1',
          text: '抛物线与 x 轴的交点叫做函数的根或零点，也就是方程 ax² + bx + c = 0 的解。',
        },
        {
          id: 'roots-2',
          text: '判别式 Δ = b² - 4ac 决定了根的情况。',
        },
        {
          id: 'roots-3',
          text: '当 Δ 大于 0 时，有两个不相等的实根，抛物线与 x 轴有两个交点。',
        },
        {
          id: 'roots-4',
          text: '当 Δ 等于 0 时，有一个重根，抛物线与 x 轴相切。',
        },
        {
          id: 'roots-5',
          text: '当 Δ 小于 0 时，没有实根，抛物线与 x 轴没有交点。',
        },
        {
          id: 'roots-6',
          text: '图中绿色的点就是根，你可以用快速设置按钮查看不同情况。',
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
          text: '点击"播放动画"按钮，可以看到系数 a 从负 2 变化到正 2 的过程。',
        },
        {
          id: 'animation-2',
          text: '观察抛物线如何从开口向下变成开口向上，中间经过 a = 0 时退化为直线。',
        },
        {
          id: 'animation-3',
          text: '这个动画帮助你理解系数 a 对抛物线形态的影响。',
        },
      ],
    },
    {
      id: 'examples',

      type: 'example',

      title: '典型例子',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'examples-1',
          text: '让我们看几个典型的二次函数。',
        },
        {
          id: 'examples-2',
          text: 'y = x² 是最简单的二次函数，顶点在原点，开口向上。',
        },
        {
          id: 'examples-3',
          text: 'y = -x² 开口向下，顶点也在原点。',
        },
        {
          id: 'examples-4',
          text: 'y = x² - 4 向下平移了 4 个单位，与 x 轴交于 x = 2 和 x = -2。',
        },
        {
          id: 'examples-5',
          text: 'y = (x-1)² 向右平移了 1 个单位，顶点在 (1, 0)。',
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
          text: '二次函数在物理中描述抛体运动，比如投篮、发射炮弹的轨迹。',
        },
        {
          id: 'application-2',
          text: '在工程中，拱桥、抛物面天线都利用了抛物线的性质。',
        },
        {
          id: 'application-3',
          text: '在经济学中，利润函数常常是二次函数，顶点对应最大利润。',
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
          text: '二次函数 y = ax² + bx + c 的图像是抛物线，a 决定开口方向和宽窄。',
        },
        {
          id: 'summary-3',
          text: '顶点是抛物线的最值点，对称轴过顶点且垂直于 x 轴。',
        },
        {
          id: 'summary-4',
          text: '判别式 Δ 决定根的个数：Δ > 0 两根，Δ = 0 一根，Δ < 0 无实根。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对二次函数有了更深入的理解！',
        },
      ],
    },
  ],
}
