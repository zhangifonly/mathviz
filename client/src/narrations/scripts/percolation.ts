import type { NarrationScript } from '../types'

/**
 * 渗流模型 - 口播稿件
 * 核心概念：格点渗流、连通簇、临界概率、相变、序参量、分形
 * 目标受众：研究生以上
 */
export const percolationNarration: NarrationScript = {
  id: 'percolation',
  title: '渗流模型',
  subtitle: '随机点阵上的连通相变',
  difficulty: 'expert',
  targetAge: '研究生以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解站点渗流模型与连通簇的定义',
    '认识临界概率与连通相变的概念',
    '观察最大簇占比作为序参量的突变',
    '体会临界点附近的分形与标度不变性',
  ],

  prerequisites: ['概率论基础', '了解图的连通性', '接触过相变或统计物理概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '想象一大块多孔的岩石，水能不能从顶端一直渗到底端呢？' },
        { id: 'intro-2', text: '把岩石抽象成一张方格网，每个格子以概率 p 独立地打开或者关闭。' },
        { id: 'intro-3', text: '这个看似简单的随机模型，藏着一个非常锋利的相变。' },
      ],
    },
    {
      id: 'cluster',
      type: 'concept',
      title: '连通簇',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cluster-1', text: '把上下左右相邻的开放格子连在一起，就得到一个连通簇。' },
        { id: 'cluster-2', text: '注意，只算四个方向的相邻，斜对角并不相连。' },
        { id: 'cluster-3', text: '当 p 很小时，画面上只是一堆互不相连的零散小簇。' },
      ],
    },
    {
      id: 'critical',
      type: 'concept',
      title: '临界概率',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'critical-1', text: '不断调高 p，某个临界值附近，会突然冒出一个横跨全局的巨簇。' },
        { id: 'critical-2', text: '对二维方格站点渗流，这个临界概率大约是 零点五九二七。' },
        { id: 'critical-3', text: '一旦越过它，水就能从顶端贯穿到底端，我们说系统发生了渗流。' },
      ],
    },
    {
      id: 'phase',
      type: 'concept',
      title: '相变与序参量',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'phase-1', text: '用最大簇占开放格子的比例做序参量，它在临界点之下几乎为零。' },
        { id: 'phase-2', text: '越过临界点后，这个比例陡然升起，这正是连续相变的标志。' },
        { id: 'phase-3', text: '恰好在临界点上，巨簇呈现分形结构，在各种尺度上看起来都相似。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动概率 p，看零散小簇如何在临界点附近迅速合并成巨簇。' },
        { id: 'int-2', text: '留意那条金色的贯穿簇，它出现的一刻，就是渗流发生的一刻。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '渗流模型用最简单的随机规则，刻画了连通性的突然涌现。' },
        { id: 'sum-2', text: '临界概率、序参量突变与分形，都是统计物理相变的普适语言。' },
        { id: 'sum-3', text: '从材料导电到疫情传播，渗流无处不在，我们下次再见。' },
      ],
    },
  ],
}
