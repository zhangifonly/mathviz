import type { NarrationScript } from '../types'

/**
 * 快乐数 - 口播稿件
 * 核心概念：各位平方和迭代、收敛到 1、8 数循环、快乐数分布
 * 目标受众：初中及以上
 */
export const happyNumbersNarration: NarrationScript = {
  id: 'happy-numbers',
  title: '快乐数',
  subtitle: '各位平方和的迭代',
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
    '理解各位数字平方和的迭代规则',
    '认识快乐数收敛到 1 的过程',
    '了解不快乐数陷入的 8 数循环',
    '感受简单规则下数的不同命运',
  ],

  prerequisites: ['会做乘法', '理解数位'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '你听说过快乐的数字吗？' },
        { id: 'intro-2', text: '数学家真的给一类数起名叫做快乐数。' },
        { id: 'intro-3', text: '一个数快不快乐，取决于一场简单的迭代游戏。' },
      ],
    },
    {
      id: 'rule',
      type: 'concept',
      title: '平方和迭代',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '规则是：把这个数每一位的数字都平方，再全部加起来。' },
        { id: 'def-2', text: '比如 19，就是 1 的平方加 9 的平方，等于 82。' },
        { id: 'def-3', text: '得到的新数继续这样算，一步接着一步。' },
      ],
    },
    {
      id: 'converge',
      type: 'concept',
      title: '两种命运',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'con-1', text: '有的数一路走下去，最终会稳稳地停在 1，这就是快乐数。' },
        { id: 'con-2', text: '19 就是这样：82、68、100，最后到 1。' },
        { id: 'con-3', text: '不快乐的数则会掉进一个固定的八数循环，永远出不来。' },
      ],
    },
    {
      id: 'distribute',
      type: 'concept',
      title: '快乐数分布',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'dis-1', text: '在 100 以内，快乐数大约有二十个，散落其间。' },
        { id: 'dis-2', text: '它们的分布看似杂乱，却藏着确定的规律。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '输入任意一个数，看它的迭代链是奔向 1，还是绕进循环。' },
        { id: 'int-2', text: '绿色代表快乐收敛，红色代表陷入循环。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '快乐数就是各位平方和迭代最终到达 1 的数。' },
        { id: 'sum-2', text: '其余的数都会陷入那个著名的八数循环。' },
        { id: 'sum-3', text: '一条简单规则，分出两种命运，我们下次再见！' },
      ],
    },
  ],
}
