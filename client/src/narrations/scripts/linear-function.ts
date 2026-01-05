/**
 * 一次函数讲解稿件
 * 适合初中生（12-15岁）
 */

import type { NarrationScript } from '../types'

export const linearFunctionNarration: NarrationScript = {
  id: 'linear-function',
  title: '一次函数',
  subtitle: '探索斜率和截距对直线的影响',
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
          text: '欢迎来到一次函数实验！今天我们要学习数学中最基础也最重要的函数之一。',
        },
        {
          id: 'intro-2',
          text: '一次函数的图像是一条直线，它在生活中无处不在，比如出租车计费、手机话费等。',
        },
        {
          id: 'intro-3',
          text: '通过这个实验，你将理解斜率和截距如何决定一条直线的位置和方向。',
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
          text: '一次函数的一般形式是 y 等于 kx 加 b，写作 y = kx + b。',
        },
        {
          id: 'formula-2',
          text: '其中 k 叫做斜率，它决定了直线的倾斜程度和方向。',
        },
        {
          id: 'formula-3',
          text: 'b 叫做 y 轴截距，它决定了直线与 y 轴的交点位置。',
        },
        {
          id: 'formula-4',
          text: '当 k 等于 0 时，函数变成 y = b，这是一条水平线，叫做常数函数。',
        },
      ],
    },
    {
      id: 'slope',

      type: 'concept',

      title: '斜率的意义',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'slope-1',
          text: '斜率 k 表示 x 每增加 1 时，y 增加多少。这就是"斜率三角形"的含义。',
        },
        {
          id: 'slope-2',
          text: '当 k 大于 0 时，直线向右上方倾斜，函数是递增的。',
        },
        {
          id: 'slope-3',
          text: '当 k 小于 0 时，直线向右下方倾斜，函数是递减的。',
        },
        {
          id: 'slope-4',
          text: 'k 的绝对值越大，直线越陡峭；绝对值越小，直线越平缓。',
        },
        {
          id: 'slope-5',
          text: '你可以拖动斜率滑块，观察直线如何随着 k 值变化而旋转。',
        },
      ],
    },
    {
      id: 'intercept',

      type: 'concept',

      title: '截距的意义',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'intercept-1',
          text: 'y 轴截距 b 是直线与 y 轴的交点的纵坐标，也就是当 x = 0 时 y 的值。',
        },
        {
          id: 'intercept-2',
          text: '改变 b 的值，直线会上下平移，但斜率保持不变。',
        },
        {
          id: 'intercept-3',
          text: 'x 轴截距是直线与 x 轴的交点，可以通过令 y = 0 求得，等于负 b 除以 k。',
        },
        {
          id: 'intercept-4',
          text: '试着调整截距滑块，看看直线如何上下移动。',
        },
      ],
    },
    {
      id: 'graph',

      type: 'concept',

      title: '图像特征',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'graph-1',
          text: '图中蓝色的直线就是一次函数的图像。绿色点是 y 轴截距，红色点是 x 轴截距。',
        },
        {
          id: 'graph-2',
          text: '黄色的虚线三角形展示了斜率的几何意义：水平走 1 步，垂直走 k 步。',
        },
        {
          id: 'graph-3',
          text: '你可以勾选或取消复选框，显示或隐藏网格、截距点和斜率三角形。',
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
          text: '点击"播放动画"按钮，可以看到斜率从负 2 变化到正 2 的过程。',
        },
        {
          id: 'animation-2',
          text: '观察直线如何从向右下方倾斜，变成水平，再变成向右上方倾斜。',
        },
        {
          id: 'animation-3',
          text: '这个动画帮助你直观理解斜率对直线方向的影响。',
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
          text: '右侧有一些快速设置按钮，让我们看几个典型的一次函数。',
        },
        {
          id: 'examples-2',
          text: 'y = x 是最简单的一次函数，斜率为 1，经过原点，与两坐标轴成 45 度角。',
        },
        {
          id: 'examples-3',
          text: 'y = -x 的斜率为负 1，也经过原点，但方向相反。',
        },
        {
          id: 'examples-4',
          text: 'y = 2x + 1 的斜率为 2，比 y = x 更陡，且向上平移了 1 个单位。',
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
          text: '一次函数在生活中有很多应用。比如出租车计费：起步价加上每公里单价乘以里程。',
        },
        {
          id: 'application-2',
          text: '这里起步价就是截距 b，每公里单价就是斜率 k，里程就是自变量 x。',
        },
        {
          id: 'application-3',
          text: '手机话费、水电费等很多计费方式都可以用一次函数来描述。',
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
          text: '一次函数 y = kx + b 的图像是一条直线，k 决定斜率，b 决定截距。',
        },
        {
          id: 'summary-3',
          text: '斜率为正时递增，为负时递减，绝对值越大越陡峭。',
        },
        {
          id: 'summary-4',
          text: '希望通过这个实验，你对一次函数有了更直观的理解。继续探索吧！',
        },
      ],
    },
  ],
}
