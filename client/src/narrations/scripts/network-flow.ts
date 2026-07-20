import type { NarrationScript } from '../types'

/**
 * 最大流最小割 - 口播稿件
 * 核心概念：流网络、容量、增广路径、Edmonds-Karp、最大流最小割定理
 * 目标受众：高中及以上
 */
export const networkFlowNarration: NarrationScript = {
  id: 'network-flow',
  title: '最大流最小割',
  subtitle: '增广路径求最大流',
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
    '理解流网络中流量与容量的关系',
    '掌握增广路径与 Edmonds-Karp 算法思路',
    '理解最大流最小割定理',
    '认识最大流在工程调度中的应用',
  ],

  prerequisites: ['了解图与节点', '了解广度优先搜索'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '想象一张由水管连成的网络，从源头 S 通向终点 T。' },
        { id: 'intro-2', text: '每根管道粗细不同，能通过的水量有上限。' },
        { id: 'intro-3', text: '问题是：单位时间内，最多能从 S 送多少水到 T ?' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '流与容量',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '每条边有一个容量，表示它能承载的最大流量。' },
        { id: 'def-2', text: '实际流量不能超过容量，我们把它记作 流量斜杠容量。' },
        { id: 'def-3', text: '除了源和汇，每个节点流入的总量必须等于流出的总量。' },
      ],
    },
    {
      id: 'augment',
      type: 'concept',
      title: '增广路径',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'aug-1', text: '增广路径是一条从 S 到 T 、每条边都还有剩余容量的通路。' },
        { id: 'aug-2', text: 'Edmonds-Karp 用广度优先搜索，每次找出最短的一条增广路径。' },
        { id: 'aug-3', text: '沿路推送瓶颈流量，反复进行，直到再也找不到通路。' },
      ],
    },
    {
      id: 'theorem',
      type: 'concept',
      title: '最大流最小割定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'thm-1', text: '把节点分成含 S 和含 T 的两组，跨组的边构成一个割。' },
        { id: 'thm-2', text: '割的容量，就是所有从 S 侧指向 T 侧的边的容量之和。' },
        { id: 'thm-3', text: '最大流恰好等于最小割，这就是著名的最大流最小割定理。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击求解，看算法把每条边填上最终流量，红色是瓶颈所在。' },
        { id: 'int-2', text: '再高亮最小割，你会发现它的容量正好等于最大流值。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '最大流问题，就是在容量限制下把最多的流量从 S 送到 T 。' },
        { id: 'sum-2', text: 'Edmonds-Karp 靠 BFS 找增广路径，最大流总等于最小割。' },
        { id: 'sum-3', text: '这套思想撑起了物流、匹配与图像分割，我们下次再见！' },
      ],
    },
  ],
}
