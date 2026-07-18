import type { NarrationScript } from '../types'

/**
 * 排序算法可视化 - 口播稿件
 * 核心概念：冒泡、插入、快速、归并四种经典排序与复杂度对比
 * 目标受众：初中及以上
 */
export const sortingAlgorithmsNarration: NarrationScript = {
  id: 'sorting-algorithms',
  title: '排序算法可视化',
  subtitle: '冒泡插入快排归并',
  difficulty: 'elementary',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解排序就是把乱序数据变得有序',
    '掌握冒泡与插入排序的朴素思路',
    '理解快排的分治与归并的稳定合并',
    '学会用复杂度衡量算法的快慢',
  ],

  prerequisites: ['了解数组', '了解大小比较'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '桌上有一排高矮不一的柱子，我们想把它们从矮到高排好。' },
        { id: 'intro-2', text: '计算机每天都在做这件事：把杂乱的数据变得井然有序。' },
        { id: 'intro-3', text: '同样是排序，方法不同，快慢却相差巨大。' },
      ],
    },
    {
      id: 'basic',
      type: 'concept',
      title: '冒泡与插入',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '冒泡排序相邻两两比较，大的往后挪，每一轮把最大值送到末尾。' },
        { id: 'def-2', text: '插入排序像整理扑克牌，把每张牌插进前面已排好的部分。' },
        { id: 'def-3', text: '它们直观易懂，但都要两层循环，复杂度是 O(n 的平方)。' },
      ],
    },
    {
      id: 'quick',
      type: 'concept',
      title: '快速排序',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'quick-1', text: '快排选一个基准，把比它小的放左边，比它大的放右边。' },
        { id: 'quick-2', text: '再对左右两半递归地做同样的事，这就是分而治之。' },
        { id: 'quick-3', text: '平均下来只需 O(n 乘以 log n)，比冒泡快得多。' },
      ],
    },
    {
      id: 'merge',
      type: 'concept',
      title: '归并排序',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'merge-1', text: '归并排序先把数组一分为二，直到每段只剩一个元素。' },
        { id: 'merge-2', text: '再两两合并有序的小段，相等元素保持原序，因此它很稳定。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '选择一种算法，单步观察每一次比较和交换。' },
        { id: 'int-2', text: '也可以点击播放，让柱子在动画里自己排好队。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '冒泡和插入简单却慢，快排和归并靠分治更高效。' },
        { id: 'sum-2', text: '选对算法，就是在为程序省下宝贵的时间。' },
        { id: 'sum-3', text: '排序是算法世界的第一课，我们下次再见！' },
      ],
    },
  ],
}
