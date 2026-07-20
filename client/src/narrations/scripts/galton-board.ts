import type { NarrationScript } from '../types'

/**
 * 高尔顿板 - 口播稿件
 * 核心概念：随机游走、二项分布、中心极限定理逼近正态
 * 目标受众：初中及以上
 */
export const galtonBoardNarration: NarrationScript = {
  id: 'galton-board',
  title: '高尔顿板',
  subtitle: '钉板堆出正态分布',
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
    '理解小球在钉板上的随机左右偏移',
    '认识落槽计数服从二项分布',
    '感受大量小球堆积逼近正态曲线',
    '直观体会中心极限定理',
  ],

  prerequisites: ['了解概率的基本概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '看这块钉满小钉子的木板，顶部投下一颗小球。' },
        { id: 'intro-2', text: '小球一路撞击钉子，蹦蹦跳跳地往下落。' },
        { id: 'intro-3', text: '最后它掉进底部的某个格子，看似完全随机。' },
      ],
    },
    {
      id: 'fifty',
      type: 'concept',
      title: '每层五五开',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '关键在于：每碰到一颗钉子，小球向左或向右的机会各占一半。' },
        { id: 'def-2', text: '经过很多层后，落入的格子等于它向右偏移的总次数。' },
        { id: 'def-3', text: '偏得越均衡，就越容易落在中间。' },
      ],
    },
    {
      id: 'binomial',
      type: 'concept',
      title: '二项分布',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'bin-1', text: '向右的次数服从一个漂亮的规律，叫二项分布。' },
        { id: 'bin-2', text: '中间的格子对应的路径最多，所以概率最高。' },
        { id: 'bin-3', text: '两侧要连续偏向同一边，机会稀少，所以又矮又低。' },
      ],
    },
    {
      id: 'normal',
      type: 'concept',
      title: '逼近正态',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'nor-1', text: '当小球足够多，柱形的轮廓会越来越平滑。' },
        { id: 'nor-2', text: '它逐渐逼近那条对称的钟形曲线，也就是正态分布。' },
        { id: 'nor-3', text: '这正是中心极限定理在眼前发生的样子。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '增大小球数量，看柱形一步步向钟形靠拢。' },
        { id: 'int-2', text: '点击重新投放，每次随机都略有不同，整体形状却始终稳定。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '每层五五开的随机偏移，累积成二项分布。' },
        { id: 'sum-2', text: '大量叠加后逼近正态曲线，展现中心极限定理。' },
        { id: 'sum-3', text: '随机之中藏着秩序，这就是概率之美，我们下次再见！' },
      ],
    },
  ],
}
