/**
 * 勾股定理讲解稿件
 * 适合初中生（12-15岁）
 */

import type { NarrationScript } from '../types'

export const pythagoreanNarration: NarrationScript = {
  id: 'pythagorean',
  title: '勾股定理',
  subtitle: '探索直角三角形中边长的关系',
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
          text: '欢迎来到勾股定理实验！今天我们要学习几何学中最著名的定理之一。',
        },
        {
          id: 'intro-2',
          text: '勾股定理揭示了直角三角形三边之间的神奇关系，已有数千年的历史。',
        },
        {
          id: 'intro-3',
          text: '在中国古代叫做"勾三股四弦五"，在西方叫做毕达哥拉斯定理。',
        },
      ],
    },
    {
      id: 'theorem',

      type: 'concept',

      title: '定理内容',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'theorem-1',
          text: '勾股定理说：在直角三角形中，两条直角边的平方和等于斜边的平方。',
        },
        {
          id: 'theorem-2',
          text: '用公式表示就是 a² + b² = c²，其中 a 和 b 是直角边，c 是斜边。',
        },
        {
          id: 'theorem-3',
          text: '斜边是直角三角形中最长的边，它对着直角。',
        },
        {
          id: 'theorem-4',
          text: '这个定理可以用来求直角三角形中任意一边的长度。',
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
          text: '图中蓝色的三角形就是直角三角形，直角用小方块标记。',
        },
        {
          id: 'visualization-2',
          text: '红色正方形的面积是 a²，绿色正方形的面积是 b²。',
        },
        {
          id: 'visualization-3',
          text: '勾股定理告诉我们，这两个正方形的面积之和等于斜边上正方形的面积 c²。',
        },
        {
          id: 'visualization-4',
          text: '你可以勾选"显示正方形"来观察这个面积关系。',
        },
      ],
    },
    {
      id: 'proof',

      type: 'concept',

      title: '几何证明',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'proof-1',
          text: '切换到"几何证明"模式，我们用面积法来证明勾股定理。',
        },
        {
          id: 'proof-2',
          text: '在直角边上分别构建正方形，边长为 a 的正方形面积是 a²。',
        },
        {
          id: 'proof-3',
          text: '边长为 b 的正方形面积是 b²，两者之和是 a² + b²。',
        },
        {
          id: 'proof-4',
          text: '在斜边上构建正方形，面积是 c²，通过几何变换可以证明它等于 a² + b²。',
        },
        {
          id: 'proof-5',
          text: '点击"播放动画"可以看到正方形逐渐出现的过程。',
        },
      ],
    },
    {
      id: 'pythagorean-triples',

      type: 'example',

      title: '勾股数',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'pythagorean-triples-1',
          text: '满足 a² + b² = c² 的正整数组合叫做勾股数。',
        },
        {
          id: 'pythagorean-triples-2',
          text: '最小的勾股数是 3, 4, 5，因为 3² + 4² = 9 + 16 = 25 = 5²。',
        },
        {
          id: 'pythagorean-triples-3',
          text: '其他常见的勾股数有 5, 12, 13 和 8, 15, 17。',
        },
        {
          id: 'pythagorean-triples-4',
          text: '勾股数的倍数也是勾股数，比如 6, 8, 10 是 3, 4, 5 的两倍。',
        },
        {
          id: 'pythagorean-triples-5',
          text: '右侧有快速设置按钮，你可以点击查看这些勾股数。',
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
          text: '切换到"实际应用"模式，我们来看一个梯子靠墙的问题。',
        },
        {
          id: 'application-2',
          text: '一个梯子靠在墙上，梯子底部距墙一定距离，求梯子顶端离地高度。',
        },
        {
          id: 'application-3',
          text: '这就是一个直角三角形问题，梯子是斜边，墙和地面是两条直角边。',
        },
        {
          id: 'application-4',
          text: '用勾股定理可以轻松求出任意一边的长度。',
        },
      ],
    },
    {
      id: 'parameters',

      type: 'interaction',

      title: '参数调整',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'parameters-1',
          text: '你可以用右侧的滑块调整直角边 a 和 b 的长度。',
        },
        {
          id: 'parameters-2',
          text: '斜边 c 会自动根据勾股定理计算出来。',
        },
        {
          id: 'parameters-3',
          text: '观察当 a 和 b 变化时，c 如何变化，以及正方形面积的关系。',
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
          text: '勾股定理：直角三角形中，a² + b² = c²，其中 c 是斜边。',
        },
        {
          id: 'summary-3',
          text: '这个定理可以用面积法证明，也有很多其他证明方法。',
        },
        {
          id: 'summary-4',
          text: '勾股定理在测量、建筑、导航等领域有广泛应用。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对勾股定理有了更直观的理解！',
        },
      ],
    },
  ],
}
