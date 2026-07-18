import type { NarrationScript } from '../types'

/**
 * 莫比乌斯函数 - 口播稿件
 * 核心概念：mu(n) 的正负零、平方因子、梅滕斯函数
 * 目标受众：高中及以上
 */
export const mobiusFunctionNarration: NarrationScript = {
  id: 'mobius-function',
  title: '莫比乌斯函数',
  subtitle: '数论中的正负零',
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
    '理解莫比乌斯函数只取 -1、0、+1',
    '掌握平方因子导致取零的规则',
    '认识梅滕斯函数是它的前缀和',
    '感受数论函数背后的深刻联系',
  ],

  prerequisites: ['了解质因数分解', '了解前缀和'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有一个函数，它对每个正整数只回答三种答案。' },
        { id: 'intro-2', text: '要么是正一，要么是负一，要么干脆是零。' },
        { id: 'intro-3', text: '它就是数论中优雅而神秘的莫比乌斯函数。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '莫比乌斯定义',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '先把 n 做质因数分解，看它由哪些素数相乘而成。' },
        { id: 'def-2', text: '如果每个素因子都只出现一次，就数一数素因子的个数。' },
        { id: 'def-3', text: '个数是偶数时取正一，奇数时取负一。' },
      ],
    },
    {
      id: 'zero',
      type: 'concept',
      title: '平方因子取零',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'zero-1', text: '可只要某个素数出现了两次以上，情况就不同了。' },
        { id: 'zero-2', text: '比如四等于二的平方，十二含有二的平方，它们的 mu 值都是零。' },
        { id: 'zero-3', text: '含平方因子就归零，这一刀切得干净利落。' },
      ],
    },
    {
      id: 'mertens',
      type: 'concept',
      title: '梅滕斯函数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mer-1', text: '把 mu 从一路加到 n，就得到梅滕斯函数 M(n)。' },
        { id: 'mer-2', text: '正负相互抵消，这条折线在零轴附近缓慢地上下游走。' },
        { id: 'mer-3', text: '它的增长快慢，竟与黎曼猜想这道世纪难题紧紧相连。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整观察范围，看正负条形交错分布的节奏。' },
        { id: 'int-2', text: '再留意下方的梅滕斯折线，如何随范围延伸而蜿蜒。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '莫比乌斯函数用正负零编码了整数的素因子结构。' },
        { id: 'sum-2', text: '平方因子归零，其余按素因子奇偶定正负。' },
        { id: 'sum-3', text: '小小三个值牵动着深邃的数论，我们下次再见！' },
      ],
    },
  ],
}
