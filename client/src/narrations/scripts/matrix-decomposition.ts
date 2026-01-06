import type { NarrationScript } from '../types'

/**
 * 矩阵分解实验 - 口播稿件
 *
 * 核心概念：矩阵的分解与应用
 * 目标受众：大学本科生，有基础线性代数知识
 */
export const matrixDecompositionNarration: NarrationScript = {
  id: 'matrix-decomposition',
  title: '矩阵分解',
  subtitle: '探索矩阵的分解与应用',
  difficulty: 'advanced',
  targetAge: '大学本科',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解矩阵分解的意义',
    '掌握LU分解和QR分解',
    '了解奇异值分解SVD',
    '认识矩阵分解的应用',
  ],

  prerequisites: [
    '线性代数基础',
    '矩阵运算',
    '行列式和逆矩阵',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到矩阵分解实验。',
        },
        {
          id: 'intro-2',
          text: '就像整数可以分解为质因数，矩阵也可以分解为更简单的矩阵的乘积。',
        },
        {
          id: 'intro-3',
          text: '这种分解揭示了矩阵的内在结构，也简化了许多计算。',
        },
        {
          id: 'intro-4',
          text: '今天我们将探索几种重要的矩阵分解方法。',
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
          text: '矩阵分解是将一个矩阵表示为几个特殊矩阵的乘积。',
        },
        {
          id: 'concept-2',
          text: '不同的分解方法适用于不同的问题。',
        },
        {
          id: 'concept-3',
          text: 'LU分解用于解线性方程组，QR分解用于最小二乘问题。',
        },
        {
          id: 'concept-4',
          text: 'SVD是最通用的分解，适用于任何矩阵。',
        },
      ],
    },
    {
      id: 'lu',
      type: 'animation',
      title: 'LU分解',
      lines: [
        {
          id: 'lu-1',
          text: 'LU分解将矩阵分解为下三角矩阵L和上三角矩阵U的乘积。',
        },
        {
          id: 'lu-2',
          text: '它本质上是高斯消元法的矩阵形式。',
        },
        {
          id: 'lu-3',
          text: '有了LU分解，解线性方程组变得非常高效。',
        },
        {
          id: 'lu-4',
          text: '只需要两次简单的回代过程。',
        },
      ],
    },
    {
      id: 'svd',
      type: 'concept',
      title: '奇异值分解',
      lines: [
        {
          id: 'svd-1',
          text: 'SVD是最强大的矩阵分解方法。',
        },
        {
          id: 'svd-2',
          text: '它将任意矩阵分解为三个矩阵的乘积：U、Σ和V的转置。',
        },
        {
          id: 'svd-3',
          text: 'Σ是对角矩阵，对角元素叫做奇异值。',
        },
        {
          id: 'svd-4',
          text: '奇异值揭示了矩阵的秩和数值稳定性。',
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
          text: '矩阵分解在科学计算中至关重要。',
        },
        {
          id: 'app-2',
          text: '推荐系统用SVD来分析用户偏好。',
        },
        {
          id: 'app-3',
          text: '图像压缩用SVD来保留主要信息。',
        },
        {
          id: 'app-4',
          text: '自然语言处理用它来发现文本的潜在语义。',
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
          text: '今天我们探索了矩阵分解的基本方法。',
        },
        {
          id: 'sum-2',
          text: '从LU分解到SVD，每种方法都有其独特的应用场景。',
        },
        {
          id: 'sum-3',
          text: '矩阵分解是理解和操作矩阵的强大工具。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你深入理解线性代数的应用。',
        },
      ],
    },
  ],
}
