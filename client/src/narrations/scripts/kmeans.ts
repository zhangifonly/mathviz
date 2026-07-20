import type { NarrationScript } from '../types'

/**
 * K-means 聚类 - 口播稿件
 * 核心概念：无监督分组、分配步、更新步、迭代收敛
 * 目标受众：高中及以上
 */
export const kmeansNarration: NarrationScript = {
  id: 'kmeans',
  title: 'K-means聚类',
  subtitle: '迭代分配与更新中心',
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
    '理解 K-means 把数据自动分成 K 组的思路',
    '掌握分配步：每个点归到最近的中心',
    '掌握更新步：中心移到所属点的均值',
    '感受两步交替如何一步步收敛',
  ],

  prerequisites: ['了解平面坐标', '了解平均数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '桌上撒了一把豆子，你一眼就能看出它们大致聚成了几堆。' },
        { id: 'intro-2', text: '可计算机没有眼睛，它要怎么把这些散点自动分成几组呢？' },
        { id: 'intro-3', text: 'K-means 就是最经典的自动分组算法，简单却出奇地好用。' },
      ],
    },
    {
      id: 'centers',
      type: 'concept',
      title: 'K 个中心',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '我们先决定要分成几组，这个数量就叫 K。' },
        { id: 'def-2', text: '然后随便放下 K 个中心点，作为每一组的临时代表。' },
        { id: 'def-3', text: '接下来的任务，就是不断调整这些中心，让它们落到数据真正的中心。' },
      ],
    },
    {
      id: 'assign',
      type: 'concept',
      title: '分配步',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'asg-1', text: '第一步叫分配：让每个数据点，认离它最近的那个中心当组长。' },
        { id: 'asg-2', text: '于是所有点都被染上了它所属那一组的颜色。' },
      ],
    },
    {
      id: 'update',
      type: 'concept',
      title: '更新步',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'upd-1', text: '第二步叫更新：把每个中心，搬到它这一组所有点的平均位置。' },
        { id: 'upd-2', text: '中心动了，各点最近的组长可能就变了，于是再回到分配步。' },
        { id: 'upd-3', text: '分配、更新、分配、更新，两步不停交替。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击单步迭代，看中心一步步滑向各堆的正中央。' },
        { id: 'int-2', text: '当中心不再移动，就说明算法收敛，分组稳定了。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'K-means 靠分配与更新两步交替，把散点收拢成 K 个簇。' },
        { id: 'sum-2', text: '它被广泛用于图像压缩、客户分群和数据探索。' },
        { id: 'sum-3', text: '简单的取最近、算均值，就让机器学会了分组，我们下次再见！' },
      ],
    },
  ],
}
