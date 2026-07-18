import type { NarrationScript } from '../types'

/**
 * 费马小定理 - 口播稿件
 * 核心概念：模幂、a^(p-1)≡1、费马素性测试、卡迈克尔伪素数
 * 目标受众：高中及以上
 */
export const fermatLittleNarration: NarrationScript = {
  id: 'fermat-little',
  title: '费马小定理',
  subtitle: 'a^p≡a模p，素数的隐秘指纹',
  difficulty: 'intermediate',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解费马小定理 a^(p-1)≡1 (mod p) 的含义',
    '观察模 p 下幂的循环规律',
    '掌握费马素性测试的思路',
    '认识卡迈克尔数这类伪素数',
  ],

  prerequisites: ['了解余数与整除', '了解幂运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '素数的指纹',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '素数看似杂乱无章，其实藏着精巧的规律。' },
        { id: 'intro-2', text: '取任意底数 a，把它一次次自乘，再对素数 p 取余数。' },
        { id: 'intro-3', text: '当指数走到 p 减一时，余数总会回到 1，像素数留下的指纹。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '费马小定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '费马小定理说：若 p 是素数，且 a 不被 p 整除，则 a 的 p 减一次方模 p 恒等于 1。' },
        { id: 'def-2', text: '换个写法，对任意整数 a，都有 a 的 p 次方模 p 等于 a 本身。' },
        { id: 'def-3', text: '这是三百多年前费马发现的，简洁却极其深刻。' },
      ],
    },
    {
      id: 'cycle',
      type: 'concept',
      title: '幂的循环',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cyc-1', text: '看这张幂表：每一行是一个底数 a 的连续幂，对 p 取余。' },
        { id: 'cyc-2', text: '余数不会无限增大，而是在有限的几个数里循环往复。' },
        { id: 'cyc-3', text: '循环的长度整除 p 减一，所以最后一列必然齐刷刷落回 1。' },
      ],
    },
    {
      id: 'test',
      type: 'concept',
      title: '素性测试与伪素数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'test-1', text: '反过来想：如果 a 的 n 减一次方模 n 不等于 1，那 n 一定不是素数。' },
        { id: 'test-2', text: '这就是费马素性测试，快到能在瞬间筛掉海量合数。' },
        { id: 'test-3', text: '但它会被骗：卡迈克尔数如 561，明明是合数，却对所有互素底数都通过测试。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '选择不同的素数 p，看幂表的规模和循环怎样变化。' },
        { id: 'int-2', text: '拖动底数 a，观察它的这一行如何总在最后一列停在 1。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '费马小定理揭示了素数模下幂运算的循环之美。' },
        { id: 'sum-2', text: '它是素性测试和现代密码学的基石，也提醒我们伪素数的存在。' },
        { id: 'sum-3', text: '一条简洁的同余式，串起数论与加密的世界，我们下次再见！' },
      ],
    },
  ],
}
