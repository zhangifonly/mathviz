import type { NarrationScript } from '../types'

/**
 * 图论实验 - 口播稿件
 *
 * 核心概念：图的结构与算法
 * 目标受众：大学本科生，有基础离散数学知识
 */
export const graphTheoryNarration: NarrationScript = {
  id: 'graph-theory',
  title: '图论',
  subtitle: '探索网络与连接的数学',
  difficulty: 'intermediate',
  targetAge: '大学本科',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解图的基本概念和术语',
    '掌握图的遍历算法',
    '了解最短路径问题',
    '认识图论在现实中的应用',
  ],

  prerequisites: [
    '集合的基本概念',
    '基础算法知识',
    '逻辑推理能力',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到图论实验。',
        },
        {
          id: 'intro-2',
          text: '你有没有想过，导航软件是如何找到最短路线的？',
        },
        {
          id: 'intro-3',
          text: '或者社交网络是如何推荐你可能认识的人？',
        },
        {
          id: 'intro-4',
          text: '这些问题的答案都藏在图论这门数学分支中。',
        },
      ],
    },
    {
      id: 'concept',
      type: 'concept',
      title: '核心概念',
      lines: [
        {
          id: 'concept-1',
          text: '图由顶点和边组成，顶点代表对象，边代表对象之间的关系。',
        },
        {
          id: 'concept-2',
          text: '图可以是有向的或无向的，边可以有权重或没有权重。',
        },
        {
          id: 'concept-3',
          text: '图论起源于1736年欧拉解决的柯尼斯堡七桥问题。',
        },
        {
          id: 'concept-4',
          text: '今天，图论已成为计算机科学和网络分析的基础。',
        },
      ],
    },
    {
      id: 'traversal',
      type: 'animation',
      title: '图的遍历',
      lines: [
        {
          id: 'trav-1',
          text: '遍历是访问图中所有顶点的过程。',
        },
        {
          id: 'trav-2',
          text: '深度优先搜索像是走迷宫，一条路走到底再回头。',
        },
        {
          id: 'trav-3',
          text: '广度优先搜索像是水波扩散，一层一层向外探索。',
        },
        {
          id: 'trav-4',
          text: '这两种算法是解决图问题的基础工具。',
        },
      ],
    },
    {
      id: 'shortest-path',
      type: 'animation',
      title: '最短路径',
      lines: [
        {
          id: 'sp-1',
          text: '最短路径问题是图论中最重要的问题之一。',
        },
        {
          id: 'sp-2',
          text: 'Dijkstra算法可以找到从一个顶点到所有其他顶点的最短路径。',
        },
        {
          id: 'sp-3',
          text: '它的思想是贪心的：每次选择当前距离最近的未访问顶点。',
        },
        {
          id: 'sp-4',
          text: '这个算法是导航系统和网络路由的核心。',
        },
      ],
    },
    {
      id: 'application',
      type: 'application',
      title: '实际应用',
      lines: [
        {
          id: 'app-1',
          text: '图论在现代社会无处不在。',
        },
        {
          id: 'app-2',
          text: '社交网络用图来分析人际关系和信息传播。',
        },
        {
          id: 'app-3',
          text: '搜索引擎用图来计算网页的重要性。',
        },
        {
          id: 'app-4',
          text: '生物学家用图来研究蛋白质相互作用网络。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      lines: [
        {
          id: 'sum-1',
          text: '今天我们探索了图论的基本概念。',
        },
        {
          id: 'sum-2',
          text: '图是描述关系和连接的强大数学工具。',
        },
        {
          id: 'sum-3',
          text: '从社交网络到交通规划，图论的应用无处不在。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你理解网络世界的数学基础。',
        },
      ],
    },
  ],
}
