import type { NarrationScript } from '../types'

/**
 * 斯特林数 - 口播稿件
 * 核心概念：集合划分、第二类斯特林数、递推、循环与第一类
 * 目标受众：高中及以上
 */
export const stirlingNumbersNarration: NarrationScript = {
  id: 'stirling-numbers',
  title: '斯特林数',
  subtitle: '划分与循环的计数',
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
    '理解第二类斯特林数的集合划分含义',
    '掌握斯特林三角的递推构造',
    '认识第一类斯特林数与循环排列',
    '感受计数问题背后的组合结构',
  ],

  prerequisites: ['了解排列组合', '了解集合与子集'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '四个小朋友要分到几张桌子上，有多少种不同的分法？' },
        { id: 'intro-2', text: '这类分组计数问题，答案往往不那么直观。' },
        { id: 'intro-3', text: '有一族数专门回答它们，叫做斯特林数。' },
      ],
    },
    {
      id: 'second',
      type: 'concept',
      title: '第二类斯特林数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '第二类斯特林数记作 S(n,k)，表示把 n 个不同元素分成 k 个非空子集的方案数。' },
        { id: 'def-2', text: '这里只看分组，不看顺序，比如甲乙一组和乙甲一组算同一种。' },
        { id: 'def-3', text: '把每一行的 S 值排成三角，就得到斯特林三角。' },
      ],
    },
    {
      id: 'recur',
      type: 'concept',
      title: '递推构造',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rec-1', text: '看第 n 个元素：它要么单独跳进新的一组，对应 S(n-1,k-1)。' },
        { id: 'rec-2', text: '要么加入已有的 k 组之一，有 k 种选择，对应 k 乘以 S(n-1,k)。' },
        { id: 'rec-3', text: '两种情况相加，就得到递推 S(n,k) 等于 k 乘 S(n-1,k) 再加 S(n-1,k-1)。' },
      ],
    },
    {
      id: 'first',
      type: 'concept',
      title: '第一类与循环',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fir-1', text: '第一类斯特林数换个问法：把 n 个人排成 k 个圆圈，有多少种坐法。' },
        { id: 'fir-2', text: '圆圈里只看相对顺序，所以它的递推系数变成 n 减一。' },
        { id: 'fir-3', text: '每一行的循环数加起来，恰好等于 n 的阶乘。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '在三角里选一个格子，看它如何由上一行两个数拼出来。' },
        { id: 'int-2', text: '切换第一类和第二类，比较两座三角的增长快慢。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '第二类斯特林数数划分，第一类数循环，都由简洁递推生成。' },
        { id: 'sum-2', text: '它们连接起集合、排列与贝尔数，是组合计数的核心工具。' },
        { id: 'sum-3', text: '一族小小的数，藏着分组的全部秘密，我们下次再见！' },
      ],
    },
  ],
}
