import type { NarrationScript } from '../types'

/**
 * 分数可视化实验 - 口播稿件
 *
 * 核心概念：通过饼图、条形图、网格图理解分数的概念和运算
 * 目标受众：小学生（6-12岁），数学入门
 */
export const fractionsNarration: NarrationScript = {
  id: 'fractions',
  title: '分数可视化',
  subtitle: '通过图形理解分数的概念和运算',
  difficulty: 'beginner',
  targetAge: '小学 6-12岁',
  voice: 'xiaoxiao',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-01-03',
    updatedAt: '2026-01-03',
  },

  objectives: [
    '理解分数的基本概念：分子和分母',
    '学会用图形表示分数',
    '掌握分数的比较方法',
    '理解分数加法和乘法的原理',
    '学会约分',
  ],

  prerequisites: [
    '认识数字',
    '理解"平均分"的概念',
    '会做简单的加法和乘法',
  ],

  sections: [
    // ========== 第一部分：开场引入 ==========
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        {
          id: 'intro-1',
          text: '小朋友们好！欢迎来到分数可视化实验。',
          animation: { action: 'reset' },
        },
        {
          id: 'intro-2',
          text: '你有没有分过蛋糕？把一个蛋糕切成几块，每人拿一块，这就是分数的来源！',
        },
        {
          id: 'intro-3',
          text: '今天，我们要用漂亮的图形来学习分数。',
        },
        {
          id: 'intro-4',
          text: '准备好了吗？让我们开始吧！',
        },
      ],
    },

    // ========== 第二部分：分数概念 ==========
    {
      id: 'concept',
      type: 'concept',
      title: '认识分数',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'concept-1',
          text: '分数由两部分组成：上面的数叫分子，下面的数叫分母。',
        },
        {
          id: 'concept-2',
          text: '分母告诉我们把整体分成了多少份。比如分母是4，就是分成4份。',
        },
        {
          id: 'concept-3',
          text: '分子告诉我们取了其中的几份。比如分子是1，就是取了1份。',
        },
        {
          id: 'concept-4',
          text: '所以四分之一，就是把整体分成4份，取其中的1份。',
        },
        {
          id: 'concept-5',
          text: '看饼图！蓝色部分就是我们取的那一份，灰色部分是剩下的。',
        },
      ],
    },

    // ========== 第三部分：图形表示 ==========
    {
      id: 'visualization',
      type: 'concept',
      title: '图形表示',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'vis-1',
          text: '分数可以用不同的图形来表示。',
        },
        {
          id: 'vis-2',
          text: '饼图就像切蛋糕，把圆形分成几块。',
          animation: { action: 'setParams', params: { visualization: 'pie' } },
        },
        {
          id: 'vis-3',
          text: '条形图就像巧克力棒，把长条分成几段。',
          animation: { action: 'setParams', params: { visualization: 'bar' } },
        },
        {
          id: 'vis-4',
          text: '网格图就像格子纸，把方块分成几个小格。',
          animation: { action: 'setParams', params: { visualization: 'grid' } },
        },
        {
          id: 'vis-5',
          text: '不管用哪种图形，表示的分数都是一样的！',
        },
      ],
    },

    // ========== 第四部分：比较分数 ==========
    {
      id: 'compare',
      type: 'concept',
      title: '比较分数',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'compare-1',
          text: '现在来学习怎么比较两个分数的大小。',
          animation: { action: 'setParams', params: { operation: 'compare' } },
        },
        {
          id: 'compare-2',
          text: '看图最直观！哪个分数涂色的部分更多，哪个就更大。',
        },
        {
          id: 'compare-3',
          text: '比如四分之一和三分之二，三分之二涂色更多，所以三分之二更大。',
        },
        {
          id: 'compare-4',
          text: '也可以把分数变成小数来比较。四分之一等于0.25，三分之二约等于0.67。',
        },
        {
          id: 'compare-5',
          text: '0.67大于0.25，所以三分之二大于四分之一。',
        },
      ],
    },

    // ========== 第五部分：分数加法 ==========
    {
      id: 'addition',
      type: 'concept',
      title: '分数加法',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'add-1',
          text: '分数加法有一个小技巧：先通分，再相加。',
          animation: { action: 'setParams', params: { operation: 'add' } },
        },
        {
          id: 'add-2',
          text: '通分就是把两个分数变成相同的分母。',
        },
        {
          id: 'add-3',
          text: '比如四分之一加三分之二，公共分母是4乘3等于12。',
        },
        {
          id: 'add-4',
          text: '四分之一变成十二分之三，三分之二变成十二分之八。',
        },
        {
          id: 'add-5',
          text: '分子相加：3加8等于11。结果是十二分之十一！',
        },
      ],
    },

    // ========== 第六部分：分数乘法 ==========
    {
      id: 'multiplication',
      type: 'concept',
      title: '分数乘法',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'mul-1',
          text: '分数乘法比加法简单！分子乘分子，分母乘分母。',
          animation: { action: 'setParams', params: { operation: 'multiply' } },
        },
        {
          id: 'mul-2',
          text: '比如四分之一乘三分之二。',
        },
        {
          id: 'mul-3',
          text: '分子：1乘2等于2。分母：4乘3等于12。',
        },
        {
          id: 'mul-4',
          text: '结果是十二分之二，约分后是六分之一。',
        },
        {
          id: 'mul-5',
          text: '分数乘法的意思是"取一部分的一部分"。',
        },
      ],
    },

    // ========== 第七部分：约分 ==========
    {
      id: 'simplify',
      type: 'concept',
      title: '约分',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'simp-1',
          text: '约分就是把分数变得更简单，但大小不变。',
          animation: { action: 'setParams', params: { operation: 'equivalent' } },
        },
        {
          id: 'simp-2',
          text: '方法是：找到分子和分母的最大公约数，然后同时除以它。',
        },
        {
          id: 'simp-3',
          text: '比如十二分之四，4和12的最大公约数是4。',
        },
        {
          id: 'simp-4',
          text: '分子4除以4等于1，分母12除以4等于3。',
        },
        {
          id: 'simp-5',
          text: '所以十二分之四约分后是三分之一。看图，它们涂色的面积是一样的！',
        },
      ],
    },

    // ========== 第八部分：参数互动 ==========
    {
      id: 'parameters',
      type: 'interaction',
      title: '自己试试',
      trigger: { type: 'parameter' },
      lines: [
        {
          id: 'param-1',
          text: '现在轮到你来试试了！',
        },
        {
          id: 'param-2',
          text: '在右边的控制面板，你可以选择不同的操作：比较、加法、乘法或约分。',
        },
        {
          id: 'param-3',
          text: '拖动滑块可以改变分子和分母。看看图形会怎么变化？',
        },
        {
          id: 'param-4',
          text: '试试切换不同的图形：饼图、条形图、网格图，哪个最容易理解？',
        },
        {
          id: 'param-5',
          text: '多试几组数字，你会发现分数的规律！',
        },
      ],
    },

    // ========== 第九部分：实际应用 ==========
    {
      id: 'application',
      type: 'application',
      title: '生活中的应用',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'app-1',
          text: '分数在生活中到处都能用到！',
        },
        {
          id: 'app-2',
          text: '分蛋糕、分披萨，每人拿几分之几。',
        },
        {
          id: 'app-3',
          text: '看时间，半小时就是一小时的二分之一。',
        },
        {
          id: 'app-4',
          text: '打折促销，打五折就是原价的二分之一。',
        },
        {
          id: 'app-5',
          text: '学好分数，你就能解决很多生活中的问题啦！',
        },
      ],
    },

    // ========== 第十部分：总结 ==========
    {
      id: 'summary',
      type: 'summary',
      title: '总结回顾',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'summary-1',
          text: '今天我们学习了分数，让我们来回顾一下。',
          animation: { action: 'reset' },
        },
        {
          id: 'summary-2',
          text: '分数由分子和分母组成，表示把整体分成几份，取其中几份。',
        },
        {
          id: 'summary-3',
          text: '分数可以用饼图、条形图、网格图来表示。',
        },
        {
          id: 'summary-4',
          text: '比较分数可以看图，也可以转成小数。',
        },
        {
          id: 'summary-5',
          text: '分数加法要先通分，分数乘法是分子乘分子、分母乘分母。',
        },
        {
          id: 'summary-6',
          text: '太棒了！你已经掌握了分数的基本知识。继续探索其他实验，发现更多数学的乐趣吧！',
        },
      ],
    },
  ],

  furtherReading: [
    {
      title: '加减乘除可视化',
      description: '复习基本的四则运算',
      link: '/basic-arithmetic',
    },
    {
      title: '概率分布',
      description: '学习概率，分数的高级应用',
      link: '/probability',
    },
  ],
}

export default fractionsNarration
