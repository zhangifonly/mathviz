import type { NarrationScript } from '../types'

/**
 * Softmax 函数 - 口播稿件
 * 核心概念：指数放大、归一化成概率、温度调节
 * 目标受众：高中及以上
 */
export const softmaxNarration: NarrationScript = {
  id: 'softmax',
  title: 'Softmax函数',
  subtitle: '分数归一化成概率',
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
    '理解 softmax 把任意分数变成概率分布',
    '认识指数放大与归一化两个步骤',
    '掌握温度参数对分布尖锐程度的影响',
    '了解它在分类与注意力机制中的作用',
  ],

  prerequisites: ['了解指数函数', '了解概率之和为 1'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '神经网络最后往往吐出一串分数，有正有负，大小不一。' },
        { id: 'intro-2', text: '可我们想要的是概率：每个类别有多大把握，而且加起来正好是一。' },
        { id: 'intro-3', text: '把任意分数变成一份漂亮概率分布的，正是 softmax 函数。' },
      ],
    },
    {
      id: 'exponent',
      type: 'concept',
      title: '指数放大',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'exp-1', text: '第一步，对每个分数取自然指数 e 的次方。' },
        { id: 'exp-2', text: '指数增长很陡，分数领先一点，指数值就会拉开一大截。' },
        { id: 'exp-3', text: '于是原本微弱的优势，被放大成明显的领先。' },
      ],
    },
    {
      id: 'normalize',
      type: 'concept',
      title: '归一化',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'norm-1', text: '第二步，把每个指数值除以所有指数值的总和。' },
        { id: 'norm-2', text: '这样得到的数全都是正的，而且刚好加起来等于一。' },
        { id: 'norm-3', text: '一串杂乱的分数，就变成了一份合法的概率分布。' },
      ],
    },
    {
      id: 'temperature',
      type: 'concept',
      title: '温度调节',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'temp-1', text: '在取指数前，我们还可以先把分数除以一个温度 T。' },
        { id: 'temp-2', text: '温度越低，分布越尖锐，几乎把概率都押给最高的那一项。' },
        { id: 'temp-3', text: '温度越高，分布越平缓，各个类别的概率趋于均匀。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '随机换一组 logits，看下方概率柱如何随之重新分配。' },
        { id: 'int-2', text: '再拖动温度滑块，感受分布在尖锐与平滑之间的连续变化。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'softmax 先用指数放大差距，再归一化成和为一的概率。' },
        { id: 'sum-2', text: '温度这个旋钮，让我们自由调节结果的果断或犹豫。' },
        { id: 'sum-3', text: '它藏在每一个分类器和注意力层里，我们下次再见！' },
      ],
    },
  ],
}
