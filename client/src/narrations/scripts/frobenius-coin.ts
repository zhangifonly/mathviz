import type { NarrationScript } from '../types'

/**
 * Frobenius 硬币问题 - 口播稿件
 * 核心概念：可表示金额、两枚公式 ab-a-b、麦乐鸡数
 * 目标受众：高中及以上
 */
export const frobeniusCoinNarration: NarrationScript = {
  id: 'frobenius-coin',
  title: 'Frobenius硬币问题',
  subtitle: '无法凑出的最大金额',
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
    '理解硬币可表示金额的概念',
    '掌握两枚互质硬币的 Frobenius 公式 ab-a-b',
    '认识麦乐鸡数这一经典实例',
    '体会 DP 如何求解多枚硬币的最大不可凑金额',
  ],

  prerequisites: ['了解整除与倍数', '了解最大公约数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '假如口袋里只有面值 3 元和 5 元的硬币。' },
        { id: 'intro-2', text: '3 元、5 元、6 元、8 元都能不多不少地凑出来。' },
        { id: 'intro-3', text: '可是 1 元、2 元、4 元、7 元，无论怎么组合都凑不出。' },
        { id: 'intro-4', text: '一个自然的问题浮现：凑不出的最大金额到底是多少？' },
      ],
    },
    {
      id: 'representable',
      type: 'concept',
      title: '可表示金额',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rep-1', text: '把每种硬币想成可以无限使用的积木。' },
        { id: 'rep-2', text: '一个金额可表示，就是它能写成这些面额的非负整数组合。' },
        { id: 'rep-3', text: '当面额互质时，足够大的金额一定都能凑出来。' },
      ],
    },
    {
      id: 'formula',
      type: 'concept',
      title: '两枚硬币的公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'form-1', text: '只有两枚互质硬币 a 和 b 时，答案有优雅的闭式。' },
        { id: 'form-2', text: '最大凑不出的金额正好是 a 乘 b 再减去 a 减去 b。' },
        { id: 'form-3', text: '比如 3 和 5，代入得到 15 减 3 减 5，等于 7。' },
      ],
    },
    {
      id: 'mcnugget',
      type: 'concept',
      title: '麦乐鸡数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mcn-1', text: '曾经麦乐鸡只有 6 块、9 块和 20 块三种包装。' },
        { id: 'mcn-2', text: '三枚硬币没有闭式公式，只能用动态规划逐个标记。' },
        { id: 'mcn-3', text: '算下来，43 块是最大买不到的数目，这就是著名的麦乐鸡数。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同面额组合，看绿色可凑与红色不可凑如何分布。' },
        { id: 'int-2', text: '注意那个被高亮的红格，它就是这组面额的 Frobenius 数。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'Frobenius 数是互质面额下无法凑出的最大金额。' },
        { id: 'sum-2', text: '两枚硬币用 ab 减 a 减 b，多枚硬币交给动态规划。' },
        { id: 'sum-3', text: '一枚硬币里藏着深刻的数论，我们下次再见！' },
      ],
    },
  ],
}
