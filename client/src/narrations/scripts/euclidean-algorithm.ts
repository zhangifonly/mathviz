import type { NarrationScript } from '../types'

/**
 * 欧几里得算法 - 口播稿件
 * 核心概念：辗转相除、几何切正方形、扩展欧几里得与裴蜀等式
 * 目标受众：初中及以上
 */
export const euclideanAlgorithmNarration: NarrationScript = {
  id: 'euclidean-algorithm',
  title: '欧几里得算法',
  subtitle: '辗转相除求最大公约数',
  difficulty: 'elementary',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解最大公约数的含义',
    '掌握辗转相除法的步骤',
    '通过切正方形理解算法的几何本质',
    '认识扩展欧几里得与裴蜀等式',
  ],

  prerequisites: ['了解整数除法', '了解余数概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '两个整数的最大公约数，是能同时整除它们的最大正整数。' },
        { id: 'intro-2', text: '比如四十八和三十六，它们的最大公约数是十二。' },
        { id: 'intro-3', text: '两千多年前，欧几里得给出了一个惊人简洁的求法。' },
      ],
    },
    {
      id: 'divide',
      type: 'concept',
      title: '辗转相除',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '用大数除以小数，取余数，再用小数除以这个余数。' },
        { id: 'def-2', text: '如此辗转反复，直到余数变成零。' },
        { id: 'def-3', text: '最后那个非零的除数，就是最大公约数。' },
      ],
    },
    {
      id: 'geometry',
      type: 'concept',
      title: '几何解释',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'geo-1', text: '把两数看成矩形的长和宽，不断从中切下最大的正方形。' },
        { id: 'geo-2', text: '剩下的小矩形继续切，正方形越切越小。' },
        { id: 'geo-3', text: '最后一块正方形的边长，正是最大公约数。' },
      ],
    },
    {
      id: 'extend',
      type: 'concept',
      title: '扩展欧几里得',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ext-1', text: '扩展算法不仅求出公约数，还能找到两个系数。' },
        { id: 'ext-2', text: 'a 乘以 x 加上 b 乘以 y，恰好等于它们的公约数，这就是裴蜀等式。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '选择不同的两个数，看看辗转相除每一步的算式。' },
        { id: 'int-2', text: '观察矩形是怎样被一层层正方形填满的。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '辗转相除用余数一步步逼近，是最古老的高效算法之一。' },
        { id: 'sum-2', text: '它的几何形态是矩形切正方形，代数延伸是裴蜀等式。' },
        { id: 'sum-3', text: '简单的取余，藏着深刻的数学，我们下次再见！' },
      ],
    },
  ],
}
