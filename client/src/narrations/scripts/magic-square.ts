import type { NarrationScript } from '../types'

/**
 * 幻方 - 口播稿件
 * 核心概念：暹罗法构造、幻常数、行列对角和相等
 * 目标受众：小学高年级及以上
 */
export const magicSquareNarration: NarrationScript = {
  id: 'magic-square',
  title: '幻方',
  subtitle: '行列对角和都相等的神奇矩阵',
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
    '认识幻方以及行列对角和相等的性质',
    '掌握暹罗法构造奇数阶幻方',
    '理解幻常数公式',
    '感受古老数学游戏的秩序之美',
  ],

  prerequisites: ['会做加法', '认识方格矩阵'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '相传大禹治水时，一只神龟从洛水浮出，背上刻着一幅奇异的数字图案。' },
        { id: 'intro-2', text: '古人称它为洛书，也就是最早的三阶幻方。' },
        { id: 'intro-3', text: '这个方阵里，无论横着加、竖着加、还是斜着加，得数都一样。' },
      ],
    },
    {
      id: 'build',
      type: 'concept',
      title: '暹罗法构造',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'build-1', text: '奇数阶幻方有一个优雅的填法，叫暹罗法，又叫楼梯法。' },
        { id: 'build-2', text: '把 1 放在第一行正中央，然后每次朝右上方斜着走一格。' },
        { id: 'build-3', text: '走出边界就从对边绕回来；如果目标格已经有数，就改放到当前格的正下方。' },
      ],
    },
    {
      id: 'verify',
      type: 'concept',
      title: '验证相等',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'verify-1', text: '填完之后，我们来验证：把任意一行加起来。' },
        { id: 'verify-2', text: '再把任意一列、两条对角线加起来，得数完全相同。' },
        { id: 'verify-3', text: '这个所有线共有的和，就叫做幻常数。' },
      ],
    },
    {
      id: 'property',
      type: 'concept',
      title: '幻常数公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'prop-1', text: '幻常数其实可以直接算出来，公式是 n 乘以 n 平方加一，再除以二。' },
        { id: 'prop-2', text: '三阶幻方的幻常数是十五，五阶是六十五，七阶是一百七十五。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换三阶、五阶、七阶，看暹罗法怎样铺满整个方阵。' },
        { id: 'int-2', text: '再点亮不同的行、列或对角线，它们的和始终等于幻常数。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '幻方用一条简单规则，让行列对角的和奇迹般地相等。' },
        { id: 'sum-2', text: '从洛书到暹罗法，数字里藏着人类对秩序的痴迷。' },
        { id: 'sum-3', text: '愿你也能在方格间发现属于自己的规律，我们下次再见！' },
      ],
    },
  ],
}
