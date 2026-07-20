import type { NarrationScript } from '../types'

/**
 * 快速幂 - 口播稿件
 * 核心概念：二进制分解、平方与乘、对数次乘法
 * 目标受众：初中及以上
 */
export const fastExponentiationNarration: NarrationScript = {
  id: 'fast-exponentiation',
  title: '快速幂',
  subtitle: '对数次乘法算幂',
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
    '理解朴素求幂的效率瓶颈',
    '掌握指数的二进制分解',
    '理解平方-乘快速幂的原理',
    '体会对数级别的乘法次数优化',
  ],

  prerequisites: ['了解乘方运算', '了解二进制表示'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '假如要算 2 的 100 次方，你会怎么做？' },
        { id: 'intro-2', text: '一个一个乘，需要整整九十九次乘法。' },
        { id: 'intro-3', text: '而快速幂只要不到十次，就能得到同样的答案。' },
      ],
    },
    {
      id: 'naive',
      type: 'concept',
      title: '朴素法太慢',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'naive-1', text: '朴素做法是把底数连乘指数次，乘法次数随指数线性增长。' },
        { id: 'naive-2', text: '指数一旦上百万，这种做法就慢得无法接受。' },
        { id: 'naive-3', text: '我们需要一个增长慢得多的办法。' },
      ],
    },
    {
      id: 'binary',
      type: 'concept',
      title: '二进制分解',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'bin-1', text: '关键在于把指数写成二进制。' },
        { id: 'bin-2', text: '比如 13 等于 1101，也就是 8 加 4 加 1。' },
        { id: 'bin-3', text: '于是幂就拆成了若干个底数平方项的乘积。' },
      ],
    },
    {
      id: 'squaremul',
      type: 'concept',
      title: '平方与乘',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sq-1', text: '从低位到高位扫描，底数每一步都平方一次。' },
        { id: 'sq-2', text: '遇到为 1 的位，就把当前底数乘进结果里。' },
        { id: 'sq-3', text: '这样乘法次数只和二进制位数有关，是对数级别。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着输入不同的底数和指数，看每一步的平方与累乘。' },
        { id: 'int-2', text: '对比一下快速幂和朴素法的乘法次数差距。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '快速幂靠二进制分解，把连乘变成平方与乘。' },
        { id: 'sum-2', text: '乘法次数从线性降到对数，大指数也能瞬间算出。' },
        { id: 'sum-3', text: '一个二进制的小技巧，换来巨大的加速，我们下次再见！' },
      ],
    },
  ],
}
