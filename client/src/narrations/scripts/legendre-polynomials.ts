import type { NarrationScript } from '../types'

/**
 * 勒让德多项式 - 口播稿件
 * 核心概念：Bonnet 递推、区间 [-1,1] 上的正交性、高斯求积与球谐应用
 * 目标受众：高中及以上
 */
export const legendrePolynomialsNarration: NarrationScript = {
  id: 'legendre-polynomials',
  title: '勒让德多项式',
  subtitle: '区间上的正交基',
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
    '理解勒让德多项式作为区间正交基的意义',
    '掌握 Bonnet 三项递推的生成方式',
    '认识区间 [-1,1] 上的正交性',
    '了解在高斯求积与球谐函数中的应用',
  ],

  prerequisites: ['了解多项式', '了解定积分与内积概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '我们熟悉的 1、x、x 平方，虽然能拼出任何多项式，却彼此纠缠不清。' },
        { id: 'intro-2', text: '数学家想要一组更好的基：它们在某种意义下互相垂直。' },
        { id: 'intro-3', text: '在区间负一到正一上，这组正交的多项式，就叫勒让德多项式。' },
      ],
    },
    {
      id: 'recur',
      type: 'concept',
      title: '递推生成',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rec-1', text: '它们从最简单的两项开始：P 零等于一，P 一等于 x。' },
        { id: 'rec-2', text: '之后每一阶都由前两阶推出：n 加一乘 P n 加一，等于二 n 加一乘 x P n，减去 n 乘 P n 减一。' },
        { id: 'rec-3', text: '这条 Bonnet 递推，让我们无需积分就能稳稳地算出任意高阶。' },
      ],
    },
    {
      id: 'ortho',
      type: 'concept',
      title: '区间正交性',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ort-1', text: '把两条不同阶的曲线相乘，再在负一到正一上积分，结果恰好是零。' },
        { id: 'ort-2', text: '这正是正交的含义：不同阶之间没有任何重叠的分量。' },
        { id: 'ort-3', text: '右边的矩阵里，只有对角线亮着，其余格子都近乎为零。' },
      ],
    },
    {
      id: 'apply',
      type: 'application',
      title: '实际应用',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'app-1', text: '用它们的零点作节点，就得到精度极高的高斯-勒让德数值积分。' },
        { id: 'app-2', text: '在球面上,它们又长成球谐函数,描述电磁场与量子轨道。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整最高阶数，看曲线如何一条条叠加，振荡越来越丰富。' },
        { id: 'int-2', text: '同时留意正交矩阵：无论加到几阶，非对角始终保持为零。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '勒让德多项式由三项递推生成，在区间上两两正交。' },
        { id: 'sum-2', text: '它是高斯求积和球谐分析的基石，把复杂函数拆成干净的分量。' },
        { id: 'sum-3', text: '一组正交的曲线，撑起了物理与计算的半边天，我们下次再见！' },
      ],
    },
  ],
}
