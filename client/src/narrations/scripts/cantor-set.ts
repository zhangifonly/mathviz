import type { NarrationScript } from '../types'

/**
 * 康托三分集 - 口播稿件
 * 核心概念：反复挖去中间三分之一、测度为零、却不可数、三进制表示
 * 目标受众：高中及以上
 */
export const cantorSetNarration: NarrationScript = {
  id: 'cantor-set',
  title: '康托三分集',
  subtitle: '测度为零的不可数集',
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
    '理解康托集反复挖去中间三分之一的构造',
    '认识剩余长度趋于零的极限行为',
    '体会测度为零却不可数的矛盾之美',
    '了解三进制表示如何刻画康托集',
  ],

  prerequisites: ['了解区间与长度', '了解无穷的初步概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '取一条长度为一的线段，摆在我们面前。' },
        { id: 'intro-2', text: '现在把它平分成三份，挖掉正中间那一份。' },
        { id: 'intro-3', text: '剩下左右两段，我们对每一段都重复同样的操作。' },
      ],
    },
    {
      id: 'iterate',
      type: 'concept',
      title: '逐层挖除',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'iter-1', text: '第一层剩两段，第二层剩四段，第 n 层就剩下 2 的 n 次方段。' },
        { id: 'iter-2', text: '每一段的长度也在缩小，第 n 层每段只有三分之一的 n 次方那么长。' },
        { id: 'iter-3', text: '把每一层叠起来看，线段像梳子一样越来越稀疏。' },
      ],
    },
    {
      id: 'measure',
      type: 'concept',
      title: '长度趋于零',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mea-1', text: '第 n 层剩余的总长度，是三分之二的 n 次方。' },
        { id: 'mea-2', text: '随着层数不断增加，这个总长度越来越接近零。' },
        { id: 'mea-3', text: '也就是说，无穷次挖除之后，康托集的测度恰好是零。' },
      ],
    },
    {
      id: 'uncountable',
      type: 'concept',
      title: '却不可数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'unc-1', text: '奇妙的是，被留下的点非但没有消失，反而多得数不清。' },
        { id: 'unc-2', text: '用三进制小数来写，康托集恰好是所有只含 0 和 2 的小数。' },
        { id: 'unc-3', text: '这样的小数和整条实数线一样多，是不可数的无穷。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整迭代层数，看线段如何一层层被掏空。' },
        { id: 'int-2', text: '留意右侧的剩余长度，它正一步步滑向零。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '康托集靠反复挖去中间三分之一而生成。' },
        { id: 'sum-2', text: '它的长度为零，却拥有不可数的无穷多个点。' },
        { id: 'sum-3', text: '一条线段藏着无穷的奥秘，我们下次再见！' },
      ],
    },
  ],
}
