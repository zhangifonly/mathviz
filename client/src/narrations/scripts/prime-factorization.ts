import type { NarrationScript } from '../types'

/**
 * 质因数分解 - 口播稿件
 * 核心概念：质数是积木、分解树、算术基本定理（唯一分解）
 * 目标受众：小学高年级及以上
 */
export const primeFactorizationNarration: NarrationScript = {
  id: 'prime-factorization',
  title: '质因数分解',
  subtitle: '算术基本定理',
  difficulty: 'beginner',
  targetAge: '小学高年级以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解把整数拆成质数乘积的过程',
    '认识质数是构成整数的基本积木',
    '学会用分解树一步步拆解一个数',
    '理解算术基本定理的唯一性',
  ],

  prerequisites: ['了解乘法与因数', '知道什么是质数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '给你一个数字，比如六十，你能把它一步步拆开吗？' },
        { id: 'intro-2', text: '六十等于十二乘以五，而十二又能拆成四乘三。' },
        { id: 'intro-3', text: '一直拆下去，直到不能再拆，我们就完成了质因数分解。' },
      ],
    },
    {
      id: 'prime',
      type: 'concept',
      title: '质数是积木',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '质数只能被一和它自己整除，比如二、三、五、七。' },
        { id: 'def-2', text: '它们无法再被拆分，就像搭积木时最基本的那些小块。' },
        { id: 'def-3', text: '任何整数，说到底都是由这些质数积木相乘搭起来的。' },
      ],
    },
    {
      id: 'tree',
      type: 'animation',
      title: '分解树',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'tree-1', text: '我们用一棵分解树来记录拆解的过程。' },
        { id: 'tree-2', text: '每次把一个合数拆成两个因子，画出两条分支。' },
        { id: 'tree-3', text: '当分支上出现绿色的质数，它就成了不再生长的叶子。' },
      ],
    },
    {
      id: 'unique',
      type: 'concept',
      title: '唯一分解定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'uni-1', text: '无论你先拆哪一步，最后收集到的质数都完全一样。' },
        { id: 'uni-2', text: '六十总是二乘二乘三乘五，这就是算术基本定理。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换一个数字，看看它的分解树长成什么样子。' },
        { id: 'int-2', text: '如果输入的本身就是质数，那这棵树就只有一个孤零零的叶子。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '质因数分解，把每个整数还原成质数积木的乘积。' },
        { id: 'sum-2', text: '这份分解唯一且确定，是整个数论的基石。' },
        { id: 'sum-3', text: '记住这些小小的质数积木，我们下次再见！' },
      ],
    },
  ],
}
