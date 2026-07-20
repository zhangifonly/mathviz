import type { NarrationScript } from '../types'

/**
 * 最小生成树 - 口播稿件
 * 核心概念：Kruskal（排序+并查集）、Prim（扩展）、总权重最小的连通
 * 目标受众：高中及以上
 */
export const minimumSpanningTreeNarration: NarrationScript = {
  id: 'minimum-spanning-tree',
  title: '最小生成树',
  subtitle: 'Kruskal与Prim',
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
    '理解最小生成树的定义与用途',
    '掌握 Kruskal 算法的排序与并查集思想',
    '掌握 Prim 算法的逐步扩展思想',
    '体会两种贪心策略殊途同归',
  ],

  prerequisites: ['了解图与边权', '了解贪心思想'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '假设要给几座村庄铺电缆，让它们全都连通。' },
        { id: 'intro-2', text: '每段线路都有造价，我们想让总花费尽可能少。' },
        { id: 'intro-3', text: '这就是最小生成树问题：用最省的成本连通所有点。' },
      ],
    },
    {
      id: 'tree',
      type: 'concept',
      title: '什么是生成树',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'tree-1', text: '生成树是一组边，连通全部节点却不含任何环。' },
        { id: 'tree-2', text: 'n 个节点的生成树，恰好有 n 减 1 条边。' },
        { id: 'tree-3', text: '权重之和最小的那一棵，就叫最小生成树。' },
      ],
    },
    {
      id: 'kruskal',
      type: 'concept',
      title: 'Kruskal 算法',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'krus-1', text: 'Kruskal 先把所有边按权重从小到大排好队。' },
        { id: 'krus-2', text: '依次尝试加入最便宜的边，只要它不会围成环。' },
        { id: 'krus-3', text: '判断成环靠并查集：两端已在同一集合就跳过。' },
      ],
    },
    {
      id: 'prim',
      type: 'concept',
      title: 'Prim 算法',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'prim-1', text: 'Prim 换个思路，从任意一个节点开始生长。' },
        { id: 'prim-2', text: '每一步都并入连接已选区域的那条最短边。' },
        { id: 'prim-3', text: '树像滚雪球般扩展，直到覆盖所有节点。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换两种算法，观察加边的先后顺序有何不同。' },
        { id: 'int-2', text: '你会发现，最终的总权重始终相等。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '最小生成树用最省的成本连通所有节点。' },
        { id: 'sum-2', text: 'Kruskal 排序加边，Prim 从一点扩展，都是贪心。' },
        { id: 'sum-3', text: '两条不同的路，通向同一个最优解，我们下次再见！' },
      ],
    },
  ],
}
