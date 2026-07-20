import type { NarrationScript } from '../types'

/**
 * 广度与深度优先搜索 - 口播稿件
 * 核心概念：BFS 队列层层扩散、DFS 栈一路到底、BFS 最短路
 * 目标受众：初中及以上
 */
export const bfsDfsNarration: NarrationScript = {
  id: 'bfs-dfs',
  title: '广度与深度优先搜索',
  subtitle: '层层扩散 vs 一路到底',
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
    '理解 BFS 用队列逐层扩散',
    '理解 DFS 用栈一路深入再回溯',
    '知道 BFS 在无权图上给出最短路',
    '体会两种遍历顺序的差异',
  ],

  prerequisites: ['了解网格与坐标', '了解队列与栈'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '给你一座迷宫，从入口走到出口，你会怎么找路？' },
        { id: 'intro-2', text: '一种办法是四面八方同时铺开，像水波一样层层漫过去。' },
        { id: 'intro-3', text: '另一种是认准一个方向一直走，走不通再退回来换条路。' },
        { id: 'intro-4', text: '这两种策略就是广度优先搜索和深度优先搜索。' },
      ],
    },
    {
      id: 'bfs',
      type: 'concept',
      title: 'BFS 队列层层扩散',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'bfs-1', text: '广度优先用一个队列，先进先出，从起点开始。' },
        { id: 'bfs-2', text: '每次取出一个格子，把它没走过的邻居都排到队尾。' },
        { id: 'bfs-3', text: '于是访问顺序像同心圆，一圈一圈地向外扩散。' },
      ],
    },
    {
      id: 'dfs',
      type: 'concept',
      title: 'DFS 栈一路到底',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'dfs-1', text: '深度优先改用栈，后进先出，总是先探最新发现的格子。' },
        { id: 'dfs-2', text: '它沿着一条路蜿蜒深入，直到撞墙或走进死胡同。' },
        { id: 'dfs-3', text: '这时就回溯到上一个岔口，换一个方向继续往下钻。' },
      ],
    },
    {
      id: 'shortest',
      type: 'concept',
      title: 'BFS 的最短路',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'short-1', text: '因为 BFS 是一层层推进的，先到达的一定步数更少。' },
        { id: 'short-2', text: '所以它第一次碰到出口时，走的正是最短的那条路。' },
        { id: 'short-3', text: '深度优先可不保证，它找到的路往往绕了远。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换到 BFS，看颜色如何从起点同心扩散开来。' },
        { id: 'int-2', text: '再切到 DFS，看它怎样一头扎进去、碰壁又折返。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'BFS 用队列层层扩散，DFS 用栈一路到底。' },
        { id: 'sum-2', text: '前者在无权图上给出最短路，后者胜在实现简洁省空间。' },
        { id: 'sum-3', text: '同一座迷宫，两种走法各有妙用，我们下次再见！' },
      ],
    },
  ],
}
