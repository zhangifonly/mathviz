import type { NarrationScript } from '../types'

/**
 * Dijkstra 最短路 - 口播稿件
 * 核心概念：贪心扩展最近节点、边松弛、最短路径树
 * 目标受众：高中及以上
 */
export const dijkstraNarration: NarrationScript = {
  id: 'dijkstra',
  title: 'Dijkstra最短路',
  subtitle: '贪心扩展最近节点',
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
    '理解 Dijkstra 求单源最短路的贪心思想',
    '掌握边松弛如何逐步逼近最短距离',
    '认识最短路径树的结构',
    '了解它在导航与网络中的应用',
  ],

  prerequisites: ['了解图与带权边', '了解贪心策略'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '打开导航软件，输入终点，它几秒内就算出最快路线。' },
        { id: 'intro-2', text: '地图其实是一张图：路口是节点，道路是带权重的边。' },
        { id: 'intro-3', text: '求两点间最短路的经典算法，就是 Dijkstra。' },
      ],
    },
    {
      id: 'greedy',
      type: 'concept',
      title: '贪心思想',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '算法从源点出发，维护每个节点当前已知的最短距离。' },
        { id: 'def-2', text: '每一步，都从还没确定的节点里，挑出距离最小的那个。' },
        { id: 'def-3', text: '因为边权非负，这个最小距离不可能再被绕远路缩短，于是它被永久确定。' },
      ],
    },
    {
      id: 'relax',
      type: 'concept',
      title: '松弛边',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rel-1', text: '确定一个节点后，用它去更新每一条邻边通向的邻居。' },
        { id: 'rel-2', text: '如果经过它到邻居更近，就刷新邻居的距离，并记下前驱。' },
        { id: 'rel-3', text: '这个不断尝试缩短距离的动作，就叫松弛。' },
      ],
    },
    {
      id: 'tree',
      type: 'concept',
      title: '最短路径树',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'tree-1', text: '每个节点都记着自己的前驱，把这些前驱连起来。' },
        { id: 'tree-2', text: '就得到一棵以源点为根的最短路径树，从源到任意点的最短路都在树上。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换一个源点，看最短路径树如何从不同起点重新生长。' },
        { id: 'int-2', text: '再选一个目标点，粉色高亮就是那条最短路径。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'Dijkstra 每次贪心地确定最近节点，再松弛它的邻边。' },
        { id: 'sum-2', text: '前驱指针连成最短路径树，覆盖到所有可达点。' },
        { id: 'sum-3', text: '从导航到网络路由，它无处不在，我们下次再见！' },
      ],
    },
  ],
}
