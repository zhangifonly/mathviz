import type { NarrationScript } from '../types'

/**
 * Cholesky 分解 - 口播稿件
 * 核心概念：对称正定矩阵、A = L L^T、逐元素公式
 * 目标受众：高中及以上
 */
export const choleskyNarration: NarrationScript = {
  id: 'cholesky',
  title: 'Cholesky 分解',
  subtitle: '对称正定 = 下三角乘转置',
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
    '理解 Cholesky 分解是 LU 分解在对称正定情形下的特化',
    '掌握 L 的逐元素计算公式',
    '理解 A = L L^T 的重构关系与正定性判据',
    '认识它在数值计算中的应用价值',
  ],

  prerequisites: ['了解矩阵乘法', '了解矩阵转置'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '我们都熟悉把矩阵拆成下三角乘上三角的 LU 分解。' },
        { id: 'intro-2', text: '但当矩阵既对称又正定时，它有一种更优雅的拆法。' },
        { id: 'intro-3', text: '这就是 Cholesky 分解，可以看作 LU 分解的对称版本。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '对称正定',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '所谓对称，是指矩阵等于它自己的转置，沿主对角线镜像相同。' },
        { id: 'def-2', text: '所谓正定，直观上是说它对应的二次型永远为正，不会塌陷。' },
        { id: 'def-3', text: '满足这两个条件，矩阵就能唯一地写成一个下三角乘它的转置。' },
      ],
    },
    {
      id: 'formula',
      type: 'concept',
      title: 'L 的逐元素公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'form-1', text: '我们按列从左到右求下三角 L。' },
        { id: 'form-2', text: '对角元等于该位置的值减去左边已算平方和，再开平方根。' },
        { id: 'form-3', text: '非对角元则减去对应行列已算乘积和，再除以上方的对角元。' },
      ],
    },
    {
      id: 'reconstruct',
      type: 'concept',
      title: 'L 乘 L 转置',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rec-1', text: '把求出的 L 乘上它的转置，就会精确还原出原始矩阵 A。' },
        { id: 'rec-2', text: '如果计算中开方遇到非正的数，说明矩阵并不正定，分解无法进行。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动进度条，看 L 的每个元素是怎样一格一格被算出来的。' },
        { id: 'int-2', text: '切换不同的正定矩阵，观察 A 分解成 L 与 L 转置的全过程。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'Cholesky 把对称正定矩阵分解为下三角乘它的转置。' },
        { id: 'sum-2', text: '它计算量小、数值稳定，是求解方程组和随机采样的利器。' },
        { id: 'sum-3', text: '记住这个对称之美的分解，我们下次再见！' },
      ],
    },
  ],
}
