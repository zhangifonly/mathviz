import type { NarrationScript } from '../types'

/**
 * 卢卡斯数 - 口播稿件
 * 核心概念：卢卡斯递推、趋近黄金比、与斐波那契的关系
 * 目标受众：初中及以上
 */
export const lucasNumbersNarration: NarrationScript = {
  id: 'lucas-numbers',
  title: '卢卡斯数',
  subtitle: '斐波那契的孪生数列',
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
    '了解卢卡斯数的初值与递推规则',
    '认识卢卡斯数的相邻比也趋近黄金比',
    '理解卢卡斯数与斐波那契的联系',
    '感受不同起点却殊途同归的数学之美',
  ],

  prerequisites: ['了解斐波那契数列', '了解简单递推'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '大家都熟悉斐波那契数列，它有一个鲜为人知的兄弟。' },
        { id: 'intro-2', text: '这位兄弟叫卢卡斯数，用完全相同的加法规则,却从不同的起点出发。' },
        { id: 'intro-3', text: '斐波那契从 0 和 1 起步，而卢卡斯数从 2 和 1 起步。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '卢卡斯递推',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '规则很简单：每一项都是前两项之和。' },
        { id: 'def-2', text: '从 2 和 1 开始，我们得到 3、4、7、11、18、29。' },
        { id: 'def-3', text: '这就是卢卡斯数列：2, 1, 3, 4, 7, 11, 18, 29, 47，一路生长。' },
      ],
    },
    {
      id: 'golden',
      type: 'concept',
      title: '也趋近黄金比',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gold-1', text: '把相邻两项相除，比值会一步步靠近黄金比 1.618。' },
        { id: 'gold-2', text: '这并不巧合，只要是这种加法递推,比值都会奔向黄金比。' },
        { id: 'gold-3', text: '起点不同，命运却相同,这正是数学的迷人之处。' },
      ],
    },
    {
      id: 'link',
      type: 'concept',
      title: '与斐波那契的联系',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'link-1', text: '两个数列的关系可以写成一行漂亮的公式。' },
        { id: 'link-2', text: '第 n 个卢卡斯数，等于第 n 减一个加上第 n 加一个斐波那契数。' },
        { id: 'link-3', text: '一个的信息里,藏着另一个的全部秘密。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整显示项数，看方块越叠越高，看比值曲线越来越平。' },
        { id: 'int-2', text: '打开斐波那契对比，你会发现两条比值曲线最终汇聚到同一条金线上。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '卢卡斯数与斐波那契同宗同源，只是起点不同。' },
        { id: 'sum-2', text: '它们的相邻比都趋向黄金比,并由简洁的公式紧紧相连。' },
        { id: 'sum-3', text: '同样的规则,不同的开始,一样的美,我们下次再见！' },
      ],
    },
  ],
}
