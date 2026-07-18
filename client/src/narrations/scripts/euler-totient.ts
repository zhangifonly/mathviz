import type { NarrationScript } from '../types'

/**
 * 欧拉函数 - 口播稿件
 * 核心概念：互质计数、质因子公式、积性性质
 * 目标受众：初中及以上
 */
export const eulerTotientNarration: NarrationScript = {
  id: 'euler-totient',
  title: '欧拉函数',
  subtitle: '与 n 互质的数的个数',
  difficulty: 'intermediate',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解互质与欧拉函数 phi(n) 的定义',
    '掌握用质因子公式计算 phi(n)',
    '认识欧拉函数的积性性质',
    '感受数论中简洁公式的力量',
  ],

  prerequisites: ['了解因数与倍数', '了解质数与互质'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '给你一个数 n，比如 12，我们来数一数：1 到 12 里，有多少个数和它互质？' },
        { id: 'intro-2', text: '互质，就是两个数的最大公约数为 1，除了 1 之外没有公共因子。' },
        { id: 'intro-3', text: '这个个数，就是数论里赫赫有名的欧拉函数。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '欧拉函数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '欧拉函数记作 phi(n)，表示 1 到 n 中与 n 互质的数的个数。' },
        { id: 'def-2', text: '比如 phi(12) 等于 4，因为 1、5、7、11 这四个数与 12 互质。' },
        { id: 'def-3', text: '对任意质数 p，phi(p) 就等于 p 减 1，因为除它自己外都互质。' },
      ],
    },
    {
      id: 'formula',
      type: 'concept',
      title: '质因子公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'form-1', text: '要快速算出 phi(n)，我们不用逐个去试，而是看它的质因子。' },
        { id: 'form-2', text: '公式是：phi(n) 等于 n 乘以每个不同质因子 p 的一减 p 分之一。' },
        { id: 'form-3', text: '拿 12 来说，它的质因子是 2 和 3，phi(12) 等于 12 乘二分之一再乘三分之二，正好是 4。' },
      ],
    },
    {
      id: 'multiplicative',
      type: 'concept',
      title: '积性性质',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mul-1', text: '欧拉函数还有个漂亮的性质：它是积性的。' },
        { id: 'mul-2', text: '只要 m 和 n 互质，就有 phi(m 乘 n) 等于 phi(m) 乘 phi(n)。' },
        { id: 'mul-3', text: '比如 phi(4) 是 2，phi(9) 是 6，而 4 与 9 互质，phi(36) 恰好等于 2 乘 6，也就是 12。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '在数环上选择不同的 n，蓝色的点就是与它互质的数。' },
        { id: 'int-2', text: '数一数蓝点的个数，看看是不是正好等于中央显示的 phi(n)。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '欧拉函数 phi(n) 数出与 n 互质的数有多少个。' },
        { id: 'sum-2', text: '用质因子公式一步就能算出，还满足积性性质。' },
        { id: 'sum-3', text: '它是密码学 RSA 算法的基石，一个小函数撑起了信息安全，我们下次再见！' },
      ],
    },
  ],
}
