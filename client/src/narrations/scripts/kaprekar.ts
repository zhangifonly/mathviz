import type { NarrationScript } from '../types'

/**
 * 卡普雷卡常数 - 口播稿件
 * 核心概念：数字重排相减、迭代收敛、6174 不动点
 * 目标受众：小学高年级及以上
 */
export const kaprekarNarration: NarrationScript = {
  id: 'kaprekar',
  title: '卡普雷卡常数',
  subtitle: '神奇的6174',
  difficulty: 'elementary',
  targetAge: '小学高年级以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解卡普雷卡例程：数字重排后大数减小数',
    '发现几乎所有四位数都会收敛到 6174',
    '认识收敛最多只需 7 步这一惊人事实',
    '感受简单规则背后隐藏的数学秩序',
  ],

  prerequisites: ['会做四位数减法', '理解数位排序'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有一个数字，藏着让人吃惊的魔力，它叫 6174。' },
        { id: 'intro-2', text: '随便挑一个四位数，只要数字不全相同，就能玩一个小游戏。' },
        { id: 'intro-3', text: '反复做同一件事，最后你几乎总会掉进 6174 这个坑里。' },
      ],
    },
    {
      id: 'rule',
      type: 'concept',
      title: '重排相减',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rule-1', text: '把四位数的各个数字，从大到小排出一个最大数。' },
        { id: 'rule-2', text: '再从小到大排出一个最小数。' },
        { id: 'rule-3', text: '用最大数减去最小数，就得到下一个四位数。' },
      ],
    },
    {
      id: 'converge',
      type: 'concept',
      title: '最多七步',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'conv-1', text: '拿这个结果再做一次重排相减，然后一次又一次。' },
        { id: 'conv-2', text: '神奇的是，从 1000 到 9999，几乎每个数都会走到 6174。' },
        { id: 'conv-3', text: '而且最多只要七步，绝不会更多。' },
      ],
    },
    {
      id: 'constant',
      type: 'concept',
      title: '卡普雷卡常数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'const-1', text: '到了 6174，再算一次：7641 减 1467，结果还是 6174。' },
        { id: 'const-2', text: '它把自己牢牢锁住，这就是印度数学家卡普雷卡发现的常数。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '输入你喜欢的四位数，看它一步步跳向 6174。' },
        { id: 'int-2', text: '试试不同的数，比较谁走得快，谁绕得远。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '重排相减这个简单规则，把纷乱的四位数都引向 6174。' },
        { id: 'sum-2', text: '最多七步收敛，是隐藏在数字里的奇妙秩序。' },
        { id: 'sum-3', text: '数学的惊喜常常藏在最朴素的规则里，我们下次再见！' },
      ],
    },
  ],
}
