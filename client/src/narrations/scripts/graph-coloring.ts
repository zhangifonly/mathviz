import type { NarrationScript } from '../types'

/**
 * 图着色 - 口播稿件
 * 核心概念：贪心着色、色数、相邻不同色约束、四色定理
 * 目标受众：初中及以上
 */
export const graphColoringNarration: NarrationScript = {
  id: 'graph-coloring',
  title: '图着色',
  subtitle: '相邻不同色，最少需要几种颜色',
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
    '理解图着色的相邻不同色约束',
    '掌握贪心着色的分配过程',
    '认识色数的概念与求解思路',
    '了解四色定理及其意义',
  ],

  prerequisites: ['了解点与边的图结构'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '给一张地图上色，你想让相邻的两个国家颜色不同。' },
        { id: 'intro-2', text: '问题来了：最少需要准备几种颜色，才能涂完整张地图？' },
        { id: 'intro-3', text: '把每个区域看成一个点，相邻区域之间连一条线，地图就变成了一张图。' },
      ],
    },
    {
      id: 'constraint',
      type: 'concept',
      title: '相邻不同色',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '图着色的唯一规则是：任何一条边连接的两个节点，颜色必须不同。' },
        { id: 'def-2', text: '如果两个相邻节点涂成了同色，这条边就成了冲突边，我们把它标红。' },
        { id: 'def-3', text: '目标是用尽量少的颜色，让所有边都不冲突。' },
      ],
    },
    {
      id: 'greedy',
      type: 'concept',
      title: '贪心着色',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'greedy-1', text: '一个简单办法是贪心法：按顺序处理每个节点。' },
        { id: 'greedy-2', text: '给当前节点挑一个还没被它邻居用过的、编号最小的颜色。' },
        { id: 'greedy-3', text: '贪心很快，但用到的颜色不一定最少，答案还和节点顺序有关。' },
      ],
    },
    {
      id: 'chromatic',
      type: 'concept',
      title: '色数与四色定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'chrom-1', text: '一张图能被合法着色所需的最少颜色数，叫做它的色数。' },
        { id: 'chrom-2', text: '要求出色数，可以用回溯法：从一种颜色开始逐步增加，直到能涂满为止。' },
        { id: 'chrom-3', text: '著名的四色定理说：任何平面地图，四种颜色一定够用。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的图，看看贪心着色分别用了几种颜色。' },
        { id: 'int-2', text: '再对比回溯法求出的真正色数，感受两者的差距。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '图着色要在相邻不同色的约束下，用最少的颜色涂满全图。' },
        { id: 'sum-2', text: '贪心法快而不一定最优，回溯法能求出真正的色数。' },
        { id: 'sum-3', text: '从地图到调度，图着色无处不在，我们下次再见！' },
      ],
    },
  ],
}
