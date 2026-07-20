import type { NarrationScript } from '../types'

/**
 * PageRank - 口播稿件
 * 核心概念：随机浏览者、转移矩阵、阻尼因子、幂迭代收敛
 * 目标受众：高中及以上
 */
export const pagerankNarration: NarrationScript = {
  id: 'pagerank',
  title: 'PageRank',
  subtitle: '网页链接的稳态分布',
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
    '理解 PageRank 如何用链接结构衡量网页重要性',
    '认识随机浏览者模型与转移矩阵',
    '理解阻尼因子的作用',
    '观察幂迭代如何收敛到稳态分布',
  ],

  prerequisites: ['了解概率', '了解矩阵与向量'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '互联网上有亿万个网页，谷歌凭什么把最好的排在最前面？' },
        { id: 'intro-2', text: '早期谷歌的秘密武器，就是一个叫 PageRank 的算法。' },
        { id: 'intro-3', text: '它的核心想法很朴素：被越多重要网页链接的页面，本身就越重要。' },
      ],
    },
    {
      id: 'surfer',
      type: 'concept',
      title: '随机浏览者',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '设想一个随机浏览者，在网页间不停地点击链接漫游。' },
        { id: 'def-2', text: '他停留在某个网页的概率，就是这个网页的 PageRank 值。' },
        { id: 'def-3', text: '链接多、来源好的网页，浏览者更容易反复经过。' },
      ],
    },
    {
      id: 'matrix',
      type: 'concept',
      title: '转移矩阵与阻尼',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mat-1', text: '把每个网页把自己的权重平分给它指向的链接，就得到转移矩阵。' },
        { id: 'mat-2', text: '但浏览者不会永远点下去，有时会厌倦，随机跳到任意网页。' },
        { id: 'mat-3', text: '阻尼因子 d 就是继续点链接的概率，通常取零点八五。' },
      ],
    },
    {
      id: 'iterate',
      type: 'concept',
      title: '幂迭代收敛',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'iter-1', text: '让转移矩阵一次次作用到 rank 向量上，这就是幂迭代。' },
        { id: 'iter-2', text: '每迭代一步，权重就沿着链接重新分配一次。' },
        { id: 'iter-3', text: '很快向量趋于稳定，收敛到转移矩阵的稳态分布。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动迭代滑块，看每个节点如何从均匀出发逐渐分出高低。' },
        { id: 'int-2', text: '换一个阻尼因子，感受它如何改变最终的排名格局。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'PageRank 把重要性建模成随机浏览者的稳态停留概率。' },
        { id: 'sum-2', text: '带阻尼的转移矩阵反复幂迭代，就收敛出这个分布。' },
        { id: 'sum-3', text: '一个简单的链接投票，撑起了整个搜索时代，我们下次再见！' },
      ],
    },
  ],
}
