import type { NarrationScript } from '../types'

/**
 * 法里数列 - 口播稿件
 * 核心概念：既约分数的有序排列、中位数递推、法里邻居性质、福特圆相切
 * 目标受众：高中及以上
 */
export const fareySequenceNarration: NarrationScript = {
  id: 'farey-sequence',
  title: '法里数列',
  subtitle: '既约分数的排列',
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
    '理解法里数列是分母有界的既约分数升序排列',
    '掌握中位数递推生成下一阶数列的方法',
    '认识相邻分数 bc-ad=1 的邻居性质',
    '了解福特圆与法里数列的相切几何',
  ],

  prerequisites: ['了解分数与既约概念', '了解数轴'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '零和一之间，藏着无穷多个分数。' },
        { id: 'intro-2', text: '如果只保留分母不太大的那些，还要求它们既约，会得到什么？' },
        { id: 'intro-3', text: '把它们从小到大排好队，就是一列奇妙而有序的分数。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '什么是法里数列',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: 'n 阶法里数列，是所有分母不超过 n 的既约分数，在零到一之间升序排列。' },
        { id: 'def-2', text: '比如五阶，从零一到一一，中间依次是五分之一、四分之一、三分之一，一路排上去。' },
        { id: 'def-3', text: '阶数越大，队伍里挤进的分数就越多，也越密。' },
      ],
    },
    {
      id: 'mediant',
      type: 'concept',
      title: '中位数的魔法',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'med-1', text: '从低阶升到高阶，新加进来的分数从哪来？' },
        { id: 'med-2', text: '答案是中位数：把相邻两分数的分子相加、分母相加。' },
        { id: 'med-3', text: '三分之一和二分之一的中位数，正是五分之二，它恰好落在两者之间。' },
      ],
    },
    {
      id: 'neighbor',
      type: 'concept',
      title: '邻居与福特圆',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'nei-1', text: '任意相邻的两个分数 a 比 b 与 c 比 d，都满足 b 乘 c 减 a 乘 d 等于一。' },
        { id: 'nei-2', text: '给每个分数画一个福特圆，分母越大圆越小，都稳稳贴在数轴上。' },
        { id: 'nei-3', text: '神奇的是，相邻分数的两个圆恰好相切，绝不重叠。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整阶数，看新的分数如何在缝隙里冒出来。' },
        { id: 'int-2', text: '打开福特圆，感受这些相切的圆铺满数轴的秩序之美。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '法里数列把既约分数按大小排成有序的队列。' },
        { id: 'sum-2', text: '中位数生成新项，相邻项满足优雅的邻居关系。' },
        { id: 'sum-3', text: '福特圆让这份秩序看得见摸得着，我们下次再见！' },
      ],
    },
  ],
}
