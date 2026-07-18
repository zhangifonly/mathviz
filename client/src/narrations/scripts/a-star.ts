import type { NarrationScript } from '../types'

/**
 * A* 寻路 - 口播稿件
 * 核心概念：启发式搜索、g 实际代价、h 启发估计、f=g+h 优先扩展
 * 目标受众：初中及以上
 */
export const aStarNarration: NarrationScript = {
  id: 'a-star',
  title: 'A星寻路',
  subtitle: '启发式最短路搜索',
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
    '理解 g 实际代价与 h 启发估计的含义',
    '掌握 f = g + h 的优先扩展策略',
    '看懂 A* 相比 Dijkstra 更加定向',
    '感受启发式搜索的效率之美',
  ],

  prerequisites: ['了解网格与坐标', '了解最短路的直观概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '游戏里的 NPC，是怎么绕开墙壁走到你面前的？' },
        { id: 'intro-2', text: '它面对的是一张布满障碍的网格地图。' },
        { id: 'intro-3', text: '要在其中找到最短的一条路，靠的正是 A 星算法。' },
      ],
    },
    {
      id: 'gcost',
      type: 'concept',
      title: 'g：实际代价',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '先看 g 值，它是从起点走到当前格子，已经花掉的真实步数。' },
        { id: 'def-2', text: '每向相邻格子迈一步，g 就加一，走过的路一清二楚。' },
      ],
    },
    {
      id: 'hcost',
      type: 'concept',
      title: 'h：启发估计',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'con-1', text: '再看 h 值，它是对「还差多远到终点」的乐观估计。' },
        { id: 'con-2', text: '网格里常用曼哈顿距离，横竖格子差之和，从不高估真实距离。' },
        { id: 'con-3', text: '正因为不高估，A 星才能保证找到真正的最短路。' },
      ],
    },
    {
      id: 'fcost',
      type: 'concept',
      title: 'f = g + h',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fn-1', text: '把两者相加，f 等于 g 加 h，就是这条路的总代价预估。' },
        { id: 'fn-2', text: '算法每一步都挑 f 最小的格子优先扩展，朝着终点稳步逼近。' },
        { id: 'fn-3', text: '如果把 h 设为零，A 星就退化成盲目四散的 Dijkstra。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '看蓝色格子怎样朝终点定向铺开，这就是 A 星的搜索过程。' },
        { id: 'int-2', text: '切到 Dijkstra，黄色区域向四面漫开，扩展的格子明显更多。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'A 星用 f = g + h 权衡已走的路与预估的远方。' },
        { id: 'sum-2', text: '一个不高估的启发函数，就让搜索又快又准。' },
        { id: 'sum-3', text: '这就是启发式搜索的智慧，我们下次再见！' },
      ],
    },
  ],
}
