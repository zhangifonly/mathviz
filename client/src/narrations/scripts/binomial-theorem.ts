import type { NarrationScript } from '../types'

/**
 * 二项式定理 - 口播稿件
 * 核心概念：(a+b)^n 展开、帕斯卡三角、组合数意义
 * 目标受众：初中及以上
 */
export const binomialTheoremNarration: NarrationScript = {
  id: 'binomial-theorem',
  title: '二项式定理',
  subtitle: '展开与帕斯卡三角',
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
    '掌握 (a+b)^n 的展开规律',
    '认识帕斯卡三角与二项式系数的关系',
    '理解组合数在展开中的意义',
    '会用三角行快速写出展开式',
  ],

  prerequisites: ['了解乘法分配律', '了解幂的运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '先看最熟悉的完全平方：(a+b)的平方，等于 a方加二ab加b方。' },
        { id: 'intro-2', text: '三项，系数分别是一、二、一，藏着漂亮的规律。' },
        { id: 'intro-3', text: '如果指数变成三、四、五，展开式又长什么样呢？' },
      ],
    },
    {
      id: 'coeff',
      type: 'concept',
      title: '系数的规律',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'coeff-1', text: '展开 (a+b) 的 n 次方，会得到 n 加一项。' },
        { id: 'coeff-2', text: '每一项里，a 的指数从 n 递减，b 的指数从零递增，两者之和始终是 n。' },
        { id: 'coeff-3', text: '真正神奇的是前面的系数，它们排成了一个三角形。' },
      ],
    },
    {
      id: 'pascal',
      type: 'concept',
      title: '帕斯卡三角',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'pascal-1', text: '这就是帕斯卡三角，我们也叫它杨辉三角。' },
        { id: 'pascal-2', text: '每个数，都等于它上方左右两个数之和，两端永远是一。' },
        { id: 'pascal-3', text: '第 n 行，正好就是 (a+b) 的 n 次方的全部系数。' },
      ],
    },
    {
      id: 'combo',
      type: 'concept',
      title: '组合的意义',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'combo-1', text: '为什么是这些数？因为系数其实是组合数 C(n,k)。' },
        { id: 'combo-2', text: '把 n 个括号相乘，每一项就是从中选 k 个贡献 b、其余贡献 a。' },
        { id: 'combo-3', text: '选法有 C(n,k) 种，于是这一项的系数就是 C(n,k)。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换指数 n，看高亮行如何在三角中上下移动。' },
        { id: 'int-2', text: '对照下方的展开式，感受系数与三角行的一一对应。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '二项式定理把 (a+b) 的 n 次方展开成 n 加一项。' },
        { id: 'sum-2', text: '系数是组合数，恰好是帕斯卡三角的第 n 行。' },
        { id: 'sum-3', text: '一个三角形串起了代数与组合，我们下次再见！' },
      ],
    },
  ],
}
