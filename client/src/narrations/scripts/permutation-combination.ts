/**
 * 排列组合讲解稿件
 * 适合高中生（15-18岁）
 */

import type { NarrationScript } from '../types'

export const permutationCombinationNarration: NarrationScript = {
  id: 'permutation-combination',
  title: '排列组合',
  subtitle: '探索排列与组合的区别，可视化帕斯卡三角形',
  targetAge: '高中 15-18岁',
  difficulty: 'intermediate',
  voice: 'xiaoxiao',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-09',
    updatedAt: '2025-01-09',
  },

  objectives: [
    '理解排列与组合的区别',
    '掌握排列数和组合数的计算公式',
    '理解帕斯卡三角形的性质',
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
          text: '欢迎来到排列组合的世界！排列组合是组合数学的基础，在概率论、统计学和计算机科学中有着广泛的应用。',
        },
        {
          id: 'intro-2',
          text: '排列和组合都是从一组元素中选取若干元素的方法，但它们的区别在于是否考虑顺序。',
        },
        {
          id: 'intro-3',
          text: '让我们通过可视化的方式，深入理解这两个重要的数学概念。',
        },
      ],
    },
    {
      id: 'permutation',
      type: 'concept',
      title: '排列',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'permutation-1',
          text: '排列是指从n个不同元素中取出r个元素，按照一定的顺序排成一列。',
        },
        {
          id: 'permutation-2',
          text: '排列数的计算公式是 P(n,r) = n! / (n-r)!，其中 n! 表示n的阶乘。',
        },
        {
          id: 'permutation-3',
          text: '例如，从3个人中选2个人排队，有 P(3,2) = 3!/1! = 6 种不同的排法。',
        },
        {
          id: 'permutation-4',
          text: '排列强调顺序的重要性：ABC 和 BAC 是两种不同的排列。',
        },
      ],
    },
    {
      id: 'combination',
      type: 'concept',
      title: '组合',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'combination-1',
          text: '组合是指从n个不同元素中取出r个元素，不考虑顺序，组成一组。',
        },
        {
          id: 'combination-2',
          text: '组合数的计算公式是 C(n,r) = n! / (r!(n-r)!)，也常写作"n选r"。',
        },
        {
          id: 'combination-3',
          text: '例如，从3个人中选2个人组成小组，有 C(3,2) = 3!/(2!×1!) = 3 种选法。',
        },
        {
          id: 'combination-4',
          text: '组合不考虑顺序：选择AB和选择BA是同一种组合。',
        },
      ],
    },
    {
      id: 'pascal-triangle',
      type: 'concept',
      title: '帕斯卡三角形',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'pascal-triangle-1',
          text: '帕斯卡三角形，在中国也叫杨辉三角，是一个展示组合数规律的美丽图形。',
        },
        {
          id: 'pascal-triangle-2',
          text: '三角形的每个数字等于它上方两个数字之和，这正是组合数的递推公式：C(n,k) = C(n-1,k-1) + C(n-1,k)。',
        },
        {
          id: 'pascal-triangle-3',
          text: '第n行的数字恰好是 C(n,0), C(n,1), ..., C(n,n)，即二项式展开的系数。',
        },
        {
          id: 'pascal-triangle-4',
          text: '帕斯卡三角形中隐藏着许多有趣的数学规律，比如斐波那契数列。',
        },
      ],
    },
    {
      id: 'applications',
      type: 'application',
      title: '应用',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'applications-1',
          text: '排列组合在日常生活中有很多应用。比如密码锁：4位数字密码有多少种可能？',
        },
        {
          id: 'applications-2',
          text: '如果数字可以重复，就是 10^4 = 10000 种；如果不能重复，就是 P(10,4) = 5040 种。',
        },
        {
          id: 'applications-3',
          text: '彩票中奖概率的计算也用到组合：从35个数字中选7个，有 C(35,7) 种可能。',
        },
        {
          id: 'applications-4',
          text: '在计算机科学中，排列组合用于算法分析、密码学和数据结构设计。',
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
          text: '排列考虑顺序，组合不考虑顺序，这是两者最本质的区别。',
        },
        {
          id: 'summary-2',
          text: '排列数总是大于或等于组合数，因为同一组元素可以有多种排列方式。',
        },
        {
          id: 'summary-3',
          text: '帕斯卡三角形是理解组合数性质的绝佳工具，展示了数学的对称之美。',
        },
        {
          id: 'summary-4',
          text: '掌握排列组合，是学习概率论和统计学的重要基础。希望这个可视化能帮助你更好地理解！',
        },
      ],
    },
  ],
}
