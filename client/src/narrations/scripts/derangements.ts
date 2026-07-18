import type { NarrationScript } from '../types'

/**
 * 错排问题 - 口播稿件
 * 核心概念：错排定义、递推公式、比值趋于 1/e
 * 目标受众：高中及以上
 */
export const derangementsNarration: NarrationScript = {
  id: 'derangements',
  title: '错排问题',
  subtitle: '无一在原位的排列',
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
    '理解错排的定义：没有元素在原位置',
    '掌握错排数的递推公式',
    '认识比值 D(n)/n! 趋于 1/e',
    '感受组合计数中的优美规律',
  ],

  prerequisites: ['了解排列与阶乘', '了解基本递推思想'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '写好几封信，装进对应的信封，却手忙脚乱全装错了。' },
        { id: 'intro-2', text: '每封信都没进它该进的信封，这样的装法有多少种？' },
        { id: 'intro-3', text: '这就是著名的错排问题，也叫装错信封问题。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '错排的定义',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '把 n 个元素重新排列，如果没有任何一个停在它原来的位置，就叫一个错排。' },
        { id: 'def-2', text: '我们用 D(n) 表示 n 个元素错排的总数。' },
        { id: 'def-3', text: '比如三个元素，全部错位的排法只有两种。' },
      ],
    },
    {
      id: 'recur',
      type: 'concept',
      title: '递推公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rec-1', text: '错排数满足漂亮的递推：D(n) 等于 (n-1) 乘以 D(n-1) 加 D(n-2)。' },
        { id: 'rec-2', text: '从 D(0)=1、D(1)=0 出发，就能一步步算出 1、2、9、44、265。' },
        { id: 'rec-3', text: '递推的直觉是：第一个错位元素的落点有 n-1 种选择，再看它带来的两种子情形。' },
      ],
    },
    {
      id: 'ratio',
      type: 'concept',
      title: '趋于 1/e',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rat-1', text: '把错排数除以全部排列数，也就是 D(n) 除以 n 的阶乘。' },
        { id: 'rat-2', text: '这个比值会迅速稳定，趋向常数 1/e，约等于 0.368。' },
        { id: 'rat-3', text: '也就是说随机洗一副牌，大约有三分之一强的概率没有一张回到原位。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整元素个数 n，观察所有错排被一行行列举出来。' },
        { id: 'int-2', text: '再切换到曲线视图，看比值如何贴近那条 1/e 的红线。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '错排是无一在原位的排列，数量记作 D(n)。' },
        { id: 'sum-2', text: '它由递推 D(n)=(n-1)(D(n-1)+D(n-2)) 生成，比值趋于 1/e。' },
        { id: 'sum-3', text: '一个装错信封的小故事，藏着自然常数 e，我们下次再见！' },
      ],
    },
  ],
}
