import type { NarrationScript } from '../types'

/**
 * LU 分解 - 口播稿件
 * 核心概念：高斯消元的记录、L 存乘数、U 是消元结果、A = L·U、解方程
 * 目标受众：高中及以上
 */
export const luDecompositionNarration: NarrationScript = {
  id: 'lu-decomposition',
  title: 'LU分解',
  subtitle: '矩阵分解为下三角乘上三角',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解 LU 分解就是高斯消元的记录',
    '认识 U 是消元结果、L 存放消元乘数',
    '验证 A 等于 L 乘 U',
    '学会用 LU 分解求解线性方程组',
  ],

  prerequisites: ['了解矩阵乘法', '了解高斯消元'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '解线性方程组时，我们常用高斯消元把矩阵化成上三角。' },
        { id: 'intro-2', text: '可如果换一组右端项，又要重新消元一遍，实在浪费。' },
        { id: 'intro-3', text: 'LU 分解的想法是：把消元的过程本身记录下来，一次分解，反复使用。' },
      ],
    },
    {
      id: 'eliminate',
      type: 'concept',
      title: '消元得到 U',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'elim-1', text: '我们对矩阵 A 做高斯消元，逐列把主元下方的元素清成零。' },
        { id: 'elim-2', text: '消元结束，A 就变成了一个上三角矩阵，我们把它叫做 U。' },
        { id: 'elim-3', text: '每一步只用主元行去减下面的行，规则非常规整。' },
      ],
    },
    {
      id: 'store',
      type: 'concept',
      title: '乘数存进 L',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'store-1', text: '关键在于：每次消元用到的那个乘数，不要丢掉。' },
        { id: 'store-2', text: '把乘数填到一个对角线为一的下三角矩阵里，这就是 L。' },
        { id: 'store-3', text: 'L 就像一本账本，忠实记下了每一步是怎么消元的。' },
      ],
    },
    {
      id: 'verify',
      type: 'concept',
      title: 'A 等于 L 乘 U',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'verify-1', text: '神奇的是，把 L 和 U 乘起来，正好还原出原矩阵 A。' },
        { id: 'verify-2', text: '有了 A 等于 L 乘 U，解方程就拆成两个三角方程：先前代，再回代。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的示例矩阵，观察 L 和 U 分别长什么样子。' },
        { id: 'int-2', text: '逐步查看消元过程，看每一步是如何把一个元素清成零的。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'LU 分解把矩阵拆成下三角 L 与上三角 U 的乘积。' },
        { id: 'sum-2', text: '一次分解，就能高效应对同一系数、不同右端的多个方程组。' },
        { id: 'sum-3', text: '把消元过程记成账本，这就是 LU 分解的智慧，我们下次再见！' },
      ],
    },
  ],
}
