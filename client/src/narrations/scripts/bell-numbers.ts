import type { NarrationScript } from '../types'

/**
 * 贝尔数 - 口播稿件
 * 核心概念：集合划分总数、贝尔三角递推、与第二类斯特林数的关系
 * 目标受众：高中及以上
 */
export const bellNumbersNarration: NarrationScript = {
  id: 'bell-numbers',
  title: '贝尔数',
  subtitle: '集合划分总数',
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
    '理解贝尔数是集合划分的总数',
    '掌握用贝尔三角递推生成贝尔数',
    '了解贝尔数与第二类斯特林数的关系',
    '感受组合计数的层层生长之美',
  ],

  prerequisites: ['了解集合概念', '了解简单的加法递推'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '假设你有三位朋友，要把他们分成几个小组一起吃饭。' },
        { id: 'intro-2', text: '可以三人一桌，可以两人加一人，也可以各坐各的。' },
        { id: 'intro-3', text: '数一数，三个人一共有五种分法。' },
        { id: 'intro-4', text: '这个「总共有多少种分法」的数字，就叫贝尔数。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '什么是贝尔数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '贝尔数 B(n)，就是把 n 个元素的集合划分成若干非空子集的所有方式总数。' },
        { id: 'def-2', text: 'B(0) 和 B(1) 都是 1，B(2) 是 2，B(3) 是 5，B(4) 一下跳到 15。' },
        { id: 'def-3', text: '元素每多一个，分法都会爆炸式增长。' },
      ],
    },
    {
      id: 'triangle',
      type: 'concept',
      title: '贝尔三角递推',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'tri-1', text: '有个漂亮的办法能一口气算出它们，叫贝尔三角。' },
        { id: 'tri-2', text: '每一行的开头，抄下上一行的末尾那个数。' },
        { id: 'tri-3', text: '其余每个数，等于它左边的数加上左上方的数。' },
        { id: 'tri-4', text: '于是每一行的末尾，正好就是下一个贝尔数。' },
      ],
    },
    {
      id: 'stirling',
      type: 'concept',
      title: '与斯特林数的关系',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'stir-1', text: '如果规定恰好分成 k 个子集，方式数就是第二类斯特林数。' },
        { id: 'stir-2', text: '把 k 从 1 加到 n 的所有斯特林数相加，得到的正是贝尔数。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整行数，看贝尔三角如何一行行生长。' },
        { id: 'int-2', text: '盯住每行末尾的高亮数字，那串数就是贝尔数序列。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '贝尔数数清了一个集合所有可能的划分方式。' },
        { id: 'sum-2', text: '贝尔三角用简单的加法，就把它们层层生成出来。' },
        { id: 'sum-3', text: '简单的规则藏着惊人的增长，我们下次再见！' },
      ],
    },
  ],
}
