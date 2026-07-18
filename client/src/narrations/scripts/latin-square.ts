import type { NarrationScript } from '../types'

/**
 * 拉丁方 - 口播稿件
 * 核心概念：每行每列各符号一次、循环构造、正交拉丁方与实验设计
 * 目标受众：初中及以上
 */
export const latinSquareNarration: NarrationScript = {
  id: 'latin-square',
  title: '拉丁方',
  subtitle: '每行每列各符号一次',
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
    '理解拉丁方每行每列各符号一次的定义',
    '掌握循环移位的构造方法',
    '认识正交拉丁方及其在实验设计中的应用',
    '感受数独背后的组合数学之美',
  ],

  prerequisites: ['了解方阵', '了解取余运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '你一定玩过数独，在九宫格里让数字不重复。' },
        { id: 'intro-2', text: '其实数独有一位更古老的祖先，叫做拉丁方。' },
        { id: 'intro-3', text: '早在两百多年前，数学家欧拉就深入研究过它。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '拉丁方的定义',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '一个 n 阶拉丁方，是用 n 个符号填满的 n 乘 n 方阵。' },
        { id: 'def-2', text: '要求每一行都用到全部符号，每一列也用到全部符号。' },
        { id: 'def-3', text: '也就是说，同一行、同一列里绝不出现重复。' },
      ],
    },
    {
      id: 'construct',
      type: 'concept',
      title: '循环构造',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'con-1', text: '最简单的造法是循环移位：每往下一行，就把符号整体右移一格。' },
        { id: 'con-2', text: '用公式说，第 i 行第 j 列填 i 加 j 对 n 取余。' },
        { id: 'con-3', text: '取余保证了符号在每行每列都恰好轮一遍，绝不撞车。' },
      ],
    },
    {
      id: 'orthogonal',
      type: 'concept',
      title: '正交与应用',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ort-1', text: '把两个拉丁方叠在一起，如果所有符号对都不重复，就称它们正交。' },
        { id: 'ort-2', text: '正交拉丁方是农业和工业实验设计的利器，能均衡地消除行列干扰。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整阶数，看拉丁方如何从小方阵长成大棋盘。' },
        { id: 'int-2', text: '换一种循环移位，观察校验器告诉你它是否仍然合法。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '拉丁方要求每行每列都不重复，是数独的数学骨架。' },
        { id: 'sum-2', text: '循环移位轻松构造，正交结构支撑起实验设计。' },
        { id: 'sum-3', text: '小小方阵里藏着大大的组合智慧，我们下次再见！' },
      ],
    },
  ],
}
