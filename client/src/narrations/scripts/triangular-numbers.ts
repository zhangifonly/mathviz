import type { NarrationScript } from '../types'

/**
 * 三角形数与图形数 - 口播稿件
 * 核心概念：图形数、求和公式、几何与代数的桥梁
 * 目标受众：初中及以上
 */
export const triangularNumbersNarration: NarrationScript = {
  id: 'triangular-numbers',
  title: '三角形数与图形数',
  subtitle: '点子摆成图形',
  difficulty: 'beginner',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '认识三角形数、正方形数、五边形数',
    '理解三角形数的求和公式 n(n+1)/2',
    '发现图形数之间的几何关系',
    '感受数与形结合的数学之美',
  ],

  prerequisites: ['会做简单加法', '认识基本图形'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '拿一把棋子，你会怎么把它们摆整齐呢？' },
        { id: 'intro-2', text: '古希腊人喜欢把点子摆成规则的形状。' },
        { id: 'intro-3', text: '摆成三角形、正方形，需要的点数就叫做图形数。' },
      ],
    },
    {
      id: 'triangular',
      type: 'concept',
      title: '三角形数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'tri-1', text: '先从三角形开始，一行一个点，再一行两个点。' },
        { id: 'tri-2', text: '一层层往下堆，第 n 层就有 n 个点。' },
        { id: 'tri-3', text: '于是点数就是 1 加 2 加 3，一直加到 n。' },
      ],
    },
    {
      id: 'formula',
      type: 'concept',
      title: '求和公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '把两个同样的三角形拼在一起，就凑成一个整齐的矩形。' },
        { id: 'sum-2', text: '矩形有 n 行、n 加 1 列，点数正好是它的一半。' },
        { id: 'sum-3', text: '所以三角形数等于 n 乘 n 加 1 再除以 2。' },
      ],
    },
    {
      id: 'others',
      type: 'concept',
      title: '正方与五边形数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'oth-1', text: '把点子摆成正方形，第 n 个正方形数就是 n 乘 n。' },
        { id: 'oth-2', text: '有趣的是，相邻两个三角形数相加，正好得到一个完全平方数。' },
        { id: 'oth-3', text: '再摆成五边形，就得到五边形数 n 乘 3n 减 1 再除以 2。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换三角、正方、五边形，看看点子如何排成不同的形状。' },
        { id: 'int-2', text: '再拖动滑块调大 n，数着点数增长的节奏。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'end-1', text: '图形数把抽象的加法，变成看得见的点阵。' },
        { id: 'end-2', text: '一句 n 乘 n 加 1 除以 2，藏着数与形的默契。' },
        { id: 'end-3', text: '下次摆棋子时，不妨想想它是第几个图形数，我们下次再见！' },
      ],
    },
  ],
}
