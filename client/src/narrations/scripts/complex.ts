/**
 * 复数讲解稿件
 * 适合高中生（15-18岁）
 */

import type { NarrationScript } from '../types'

export const complexNarration: NarrationScript = {
  id: 'complex',
  title: '复数与复平面',
  subtitle: '探索虚数的几何世界',
  targetAge: '高中 15-18岁',
  difficulty: 'intermediate',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-03',
    updatedAt: '2025-01-03',
  },

  objectives: [
    '理解虚数单位 i 的定义和意义',
    '掌握复数在复平面上的表示',
    '理解复数的模和辐角',
    '了解复数乘法的几何意义——旋转和缩放',
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
          text: '欢迎来到复数实验！今天我们要探索一个神奇的数学世界。',
        },
        {
          id: 'intro-2',
          text: '你可能听说过，负数不能开平方。但数学家说：为什么不能？',
        },
        {
          id: 'intro-3',
          text: '于是他们发明了虚数单位 i，定义 i 的平方等于负1。',
        },
      ],
    },
    {
      id: 'imaginary-unit',
      type: 'concept',
      title: '虚数单位',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'imaginary-unit-1',
          text: '虚数单位 i 满足 i 的平方等于负1，这是它的定义。',
        },
        {
          id: 'imaginary-unit-2',
          text: '有了 i，我们就可以表示负数的平方根了。',
        },
        {
          id: 'imaginary-unit-3',
          text: '例如，负4的平方根就是 2i，因为 2i 的平方等于 4 乘以 i 的平方，等于负4。',
        },
        {
          id: 'imaginary-unit-4',
          text: '虚数虽然叫"虚"，但它在物理和工程中有非常实际的应用。',
        },
      ],
    },
    {
      id: 'complex-number',
      type: 'concept',
      title: '复数的定义',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'complex-number-1',
          text: '复数是实数和虚数的组合，写成 a 加 bi 的形式。',
        },
        {
          id: 'complex-number-2',
          text: '其中 a 叫做实部，b 叫做虚部，它们都是实数。',
        },
        {
          id: 'complex-number-3',
          text: '当 b 等于 0 时，复数就退化为实数。',
        },
        {
          id: 'complex-number-4',
          text: '当 a 等于 0 时，复数就是纯虚数。',
        },
      ],
    },
    {
      id: 'complex-plane',
      type: 'animation',
      title: '复平面',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'complex-plane-1',
          text: '复数可以在平面上表示，这个平面叫做复平面。',
        },
        {
          id: 'complex-plane-2',
          text: '横轴是实轴，表示实部；纵轴是虚轴，表示虚部。',
        },
        {
          id: 'complex-plane-3',
          text: '每个复数对应平面上的一个点，反过来也成立。',
        },
        {
          id: 'complex-plane-4',
          text: '拖动图中的点，观察它对应的复数如何变化。',
        },
      ],
    },
    {
      id: 'modulus-argument',
      type: 'concept',
      title: '模和辐角',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'modulus-argument-1',
          text: '复数还有另一种表示方法：用模和辐角。',
        },
        {
          id: 'modulus-argument-2',
          text: '模是复数到原点的距离，用 r 表示，等于 a 平方加 b 平方的平方根。',
        },
        {
          id: 'modulus-argument-3',
          text: '辐角是复数与正实轴的夹角，用希腊字母 θ 表示。',
        },
        {
          id: 'modulus-argument-4',
          text: '这样，复数可以写成 r 乘以括号 cos θ 加 i sin θ 的形式。',
        },
      ],
    },
    {
      id: 'euler-formula',
      type: 'formula',
      title: '欧拉公式',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'euler-formula-1',
          text: '数学中最美的公式之一是欧拉公式：e 的 i θ 次方等于 cos θ 加 i sin θ。',
        },
        {
          id: 'euler-formula-2',
          text: '这个公式把指数函数和三角函数神奇地联系在一起。',
        },
        {
          id: 'euler-formula-3',
          text: '当 θ 等于 π 时，我们得到欧拉恒等式：e 的 i π 次方加 1 等于 0。',
        },
        {
          id: 'euler-formula-4',
          text: '这个等式包含了数学中最重要的五个常数：0、1、e、i 和 π。',
        },
      ],
    },
    {
      id: 'multiplication',
      type: 'animation',
      title: '复数乘法',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'multiplication-1',
          text: '复数乘法有一个美妙的几何意义。',
        },
        {
          id: 'multiplication-2',
          text: '两个复数相乘，模相乘，辐角相加。',
        },
        {
          id: 'multiplication-3',
          text: '这意味着乘以一个复数，相当于旋转加缩放！',
        },
        {
          id: 'multiplication-4',
          text: '特别地，乘以 i 相当于逆时针旋转 90 度。',
        },
        {
          id: 'multiplication-5',
          text: '这就解释了为什么 i 的平方等于负1：旋转两次 90 度就是 180 度，正好变成相反数。',
        },
      ],
    },
    {
      id: 'applications',
      type: 'application',
      title: '实际应用',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'applications-1',
          text: '复数在很多领域都有重要应用。',
        },
        {
          id: 'applications-2',
          text: '电气工程中，交流电路分析大量使用复数。',
        },
        {
          id: 'applications-3',
          text: '量子力学中，波函数就是复数值函数。',
        },
        {
          id: 'applications-4',
          text: '信号处理中，傅里叶变换的结果是复数。',
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
          text: '复数是实部加虚部的形式，可以在复平面上表示。',
        },
        {
          id: 'summary-3',
          text: '复数的模是到原点的距离，辐角是与实轴的夹角。',
        },
        {
          id: 'summary-4',
          text: '复数乘法的几何意义是旋转和缩放。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对复数有了更直观的理解！',
        },
      ],
    },
  ],
}
