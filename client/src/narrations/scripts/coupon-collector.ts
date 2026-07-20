import type { NarrationScript } from '../types'

/**
 * 赠券收集问题 - 口播稿件
 * 核心概念：期望次数 n*H(n)、调和级数、收尾越来越慢
 * 目标受众：初中及以上
 */
export const couponCollectorNarration: NarrationScript = {
  id: 'coupon-collector',
  title: '赠券收集问题',
  subtitle: '集齐全套的期望次数',
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
    '理解赠券收集问题的设定',
    '掌握集齐期望次数 n*H(n) 的由来',
    '体会为何最后几张最难收集',
    '感受调和级数在现实中的应用',
  ],

  prerequisites: ['了解概率与期望', '了解求和'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '小时候集干脆面卡片，为了凑齐一整套，你买了多少包？' },
        { id: 'intro-2', text: '前几张总是很快到手，可越到后面，越难抽到没有的那几张。' },
        { id: 'intro-3', text: '这背后藏着一个漂亮的数学问题，叫赠券收集问题。' },
      ],
    },
    {
      id: 'setup',
      type: 'concept',
      title: '问题设定',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '假设一共有 n 种赠券，每次随机抽到其中一种，机会均等。' },
        { id: 'def-2', text: '我们关心的是：平均要抽多少次，才能集齐全部 n 种？' },
        { id: 'def-3', text: '图上的阶梯线，就是已集齐种数随抽取次数的增长过程。' },
      ],
    },
    {
      id: 'expect',
      type: 'concept',
      title: '期望次数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'exp-1', text: '收集第 k 种新券时，还差的种类占比是 (n−k+1)/n，平均要抽 n/(n−k+1) 次。' },
        { id: 'exp-2', text: '把每一步的期望加起来，总期望正好是 n 乘以调和数 H(n)。' },
        { id: 'exp-3', text: 'H(n) 是 1 加二分之一加三分之一，一直加到 n 分之一。' },
      ],
    },
    {
      id: 'tail',
      type: 'concept',
      title: '最后最难',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'tail-1', text: '由于 H(n) 约等于 ln(n)，总期望大约是 n 乘以 ln(n)。' },
        { id: 'tail-2', text: '注意最后一张，平均要抽整整 n 次才能碰上，这正是曲线尾部越来越平的原因。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整赠券的种类数，看期望次数怎样随之攀升。' },
        { id: 'int-2', text: '反复点击再模拟，感受每一次集齐所需的次数在期望值附近波动。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '集齐 n 种赠券的期望次数是 n 乘以调和数 H(n)。' },
        { id: 'sum-2', text: '它约等于 n 乘 ln(n)，收尾阶段总是格外漫长。' },
        { id: 'sum-3', text: '下次抽卡凑不齐时，你会知道那是数学的必然，我们下次再见！' },
      ],
    },
  ],
}
